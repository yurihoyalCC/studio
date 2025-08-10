import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { evaluateCredits } from './creditEval';

admin.initializeApp();
const db = admin.firestore();

// Callable: PRE-DEPOSIT ESTIMATE (no writes)
export const estimateListingScore = functions.https.onCall(async (data, ctx) => {
  // auth optional; rate limit via App Check or metering
  const res = await evaluateCredits({
    resortId: data.resortId,
    startDateISO: data.startDateISO,
    endDateISO: data.endDateISO,
    unitType: data.unitType,                     // "studio"|"1br"|"2br"|"3br"
    features: data.features || {},
    maintenanceFeeUSD: data.maintenanceFeeUSD ?? null,
    flexibility: { guestCertAllowed: !!data.guestCertAllowed },
    historyIndex: data.historyIndex ?? 1.0,
    leadTimeIndex: data.leadTimeIndex ?? 1.0
  });
  // Optionally persist a short estimate document for analytics
  await db.collection('estimates').add({
    actorUid: ctx.auth?.uid ?? null,
    input: data,
    score: res.tradeValueScore,
    estimatedCredits: res.credits,
    breakdown: res.breakdown,
    disclaimer: 'Estimate only. Final value may adjust after verification.',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return res;
});

// Callable: FINAL SCORING (server-authoritative, writes to listing)
export const scoreListing = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth) throw new functions.https.HttpsError('unauthenticated', 'Sign in required');
  const listingRef = db.doc(`listings/${data.listingId}`);
  const snap = await listingRef.get();
  if (!snap.exists) throw new functions.https.HttpsError('not-found', 'Listing not found');

  const listing = snap.data() as any;
  if (listing.ownerUid !== ctx.auth.uid && !(await isAdmin(ctx.auth.uid))) {
    throw new functions.https.HttpsError('permission-denied', 'Not your listing');
  }

  // pull resort & compute
  const resortId: string = listing.resortId;
  const res = await evaluateCredits({
    resortId,
    startDateISO: listing.stay.startDate,
    endDateISO: listing.stay.endDate,
    unitType: listing.unit.type,
    features: listing.unit.features || {},
    maintenanceFeeUSD: listing.maintenanceFeeUSD ?? null,
    flexibility: { guestCertAllowed: true }, // read from resort.policies if you store it there
    historyIndex: 1.0,
    leadTimeIndex: 1.0
  });

  await listingRef.update({
    tradeValueScore: res.tradeValueScore,
    creditValue: res.credits,
    valuation: {
      marketValueUSD: res.marketValueUSD,
      adjustedValueUSD: res.adjustedValueUSD,
      breakdown: res.breakdown,
      explain: res.explain,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  });

  return { creditValue: res.credits, tradeValueScore: res.tradeValueScore, explain: res.explain };
});


// --- Lottery Functions ---

// scheduleOwnerPrompts, convertToLottery, enterLottery, drawLottery will go here

async function isAdmin(uid?: string|null) {
  if (!uid) return false;
  const u = await admin.firestore().doc(`users/${uid}`).get();
  return u.exists && u.get('role') === 'admin';
}
