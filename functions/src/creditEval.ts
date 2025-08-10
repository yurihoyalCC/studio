import { differenceInCalendarDays, parseISO } from 'date-fns';
import * as admin from 'firebase-admin';
import { getAdminConfig } from './config';

const db = admin.firestore();

// --- helpers ---
const roundTo = (num: number, step: number) =>
  Math.round(num / step) * step;

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

// naive season classifier (replace with your own table if needed)
function classifySeason(isoStart: string): 'off'|'shoulder'|'peak' {
  const month = parseISO(isoStart).getMonth() + 1;
  if ([6,7,8].includes(month)) return 'peak';
  if ([3,4,5,9,10].includes(month)) return 'shoulder';
  return 'off';
}

// ADR lookup (region + season). You can enhance this using OTA feeds later.
async function getAdrBaseUSD(regionId: string, startISO: string): Promise<number> {
  const season = classifySeason(startISO);
  const region = await db.doc(`regions/${regionId}`).get();
  const m = region.get('adrBaseBySeason') || {};
  const adr = m[season];
  if (!adr) throw new Error(`adrBase missing for ${regionId}/${season}`);
  return adr;
}

// demand index lookup by week (fallback to 1.0)
async function getDemandIndex(regionId: string, startISO: string): Promise<number> {
  const region = await db.doc(`regions/${regionId}`).get();
  const map = region.get('demandIndexByWeek') || {};
  return map[startISO] ?? 1.0;
}

// --- core eval ---
export async function evaluateCredits(params: {
  resortId: string;
  startDateISO: string;
  endDateISO: string;
  unitType: string;                  // "studio" | "1br" | "2br" | "3br"
  features: { kitchen?: boolean; premiumView?: boolean };
  maintenanceFeeUSD?: number | null;
  flexibility: { guestCertAllowed: boolean }; // true/false
  historyIndex?: number;            // 0.9–1.1 optional
  leadTimeIndex?: number;           // 0.85–1.05 optional
}) {
  const config = await getAdminConfig();

  const resortSnap = await db.doc(`resorts/${params.resortId}`).get();
  if (!resortSnap.exists) throw new Error('resort not found');
  const resort = resortSnap.data() as any;
  const regionId: string = resort.regionId;

  const nights = differenceInCalendarDays(parseISO(params.endDateISO), parseISO(params.startDateISO));
  if (nights < 3 || nights > 7) throw new Error('Stay must be 3–7 nights');

  const adrBase = await getAdrBaseUSD(regionId, params.startDateISO);
  const demandIndex = await getDemandIndex(regionId, params.startDateISO);
  const seasonality = classifySeason(params.startDateISO);

  const brandTierIndex = config.indices.brandTier[resort.tier ?? 'mid'] ?? 1.0;
  const unitBaseIndex = config.indices.unitBase[params.unitType] ?? 1.0;
  const featureKitchen = params.features.kitchen ? (config.indices.featureBonus.kitchen ?? 0) : 0;
  const featureView    = params.features.premiumView ? (config.indices.featureBonus.premiumView ?? 0) : 0;
  const unitIndex = unitBaseIndex * (1 + featureKitchen + featureView);

  const leadIdx = params.leadTimeIndex ?? 1.00;
  const flexIdx = params.flexibility.guestCertAllowed ? 1.00 : 0.95;
  const histIdx = params.historyIndex ?? 1.00;

  // demand & season multipliers (tune as needed)
  const seasonIndex = seasonality === 'peak' ? 1.30 : seasonality === 'shoulder' ? 1.05 : 0.90;

  const marketValueUSD = adrBase * nights;
  const multiplier = demandIndex * seasonIndex * brandTierIndex * unitIndex * leadIdx * flexIdx * histIdx;
  const rawUSD = marketValueUSD * multiplier;

  // optional MF sanity check
  let mfIndex = 1.0;
  if (typeof params.maintenanceFeeUSD === 'number') {
    const ratio = params.maintenanceFeeUSD / Math.max(rawUSD, 1);
    if (ratio <= 0.25) mfIndex = 1.05;
    else if (ratio <= 0.40) mfIndex = 1.00;
    else if (ratio <= 0.55) mfIndex = 0.95;
    else mfIndex = 0.90;
  }
  const adjustedUSD = rawUSD * mfIndex;

  const perCreditUSD = (await getAdminConfig()).creditPriceUSDPerCredit;  // 0.15
  const calibrationK = (await getAdminConfig()).calibrationK;             // 1.00

  let creditsFloat = (adjustedUSD / perCreditUSD) * calibrationK;
  // guardrails
  const perNightMin = (await getAdminConfig()).perNightMinCredits;
  const perNightMax = (await getAdminConfig()).perNightMaxCredits;
  const totalMin = (await getAdminConfig()).totalMinCredits;
  const totalMax = (await getAdminConfig()).totalMaxCredits;

  const minByNights = Math.max(totalMin, perNightMin * nights);
  const maxByNights = Math.min(totalMax, perNightMax * nights);

  creditsFloat = clamp(creditsFloat, minByNights, maxByNights);
  const credits = roundTo(creditsFloat, (await getAdminConfig()).roundingStep);

  // 0–100 “score” (for badges/explanations). Normalize against a soft baseline.
  // You can tune this mapping later; this is informational only.
  const nominalPerNight = 2000; // credits at mid-market (tune)
  const scoreRaw = (credits / (nominalPerNight * nights)) * 70 + 30; // 30–100 band
  const tradeValueScore = clamp(Math.round(scoreRaw), 0, 100);

  const explanation = [
    `Base from local ADR ($${'${adrBase}'}/night) x ${'${nights}'} nights`,
    `Adjustments: demand ${'${demandIndex.toFixed(2)}'}, season ${'${seasonIndex.toFixed(2)}'}, brand ${'${brandTierIndex.toFixed(2)}'}, unit ${'${unitIndex.toFixed(2)}'}, lead ${'${leadIdx.toFixed(2)}'}, flex ${'${flexIdx.toFixed(2)}'}, history ${'${histIdx.toFixed(2)}'}`,
    typeof params.maintenanceFeeUSD === 'number' ? `MF ratio adjustment ${'${mfIndex.toFixed(2)}'}` : 'MF not provided',
    `Calibration K ${'${calibrationK.toFixed(2)}'}`
  ].join(' • ');

  return {
    nights,
    credits,
    tradeValueScore,
    marketValueUSD: Number(marketValueUSD.toFixed(2)),
    adjustedValueUSD: Number(adjustedUSD.toFixed(2)),
    breakdown: {
      adrBase,
      demandIndex,
      seasonIndex,
      brandTierIndex,
      unitIndex,
      leadIdx,
      flexIdx,
      histIdx,
      mfIndex
    },
    explain: explanation
  };
}
