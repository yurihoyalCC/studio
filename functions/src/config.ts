import * as admin from 'firebase-admin';
const db = admin.firestore();

export type AdminConfig = {
  creditPriceUSDPerCredit: number;   // 0.15
  calibrationK: number;              // 1.00
  roundingStep: number;              // 50
  perNightMinCredits: number;        // 200
  perNightMaxCredits: number;        // 1500
  totalMinCredits: number;           // 800
  totalMaxCredits: number;           // 10000
  indices: {
    brandTier: Record<string, number>;
    unitBase: Record<string, number>;
    featureBonus: Record<string, number>;
  };
};

export async function getAdminConfig(): Promise<AdminConfig> {
  const snap = await db.doc('admin/config').get();
  if (!snap.exists) throw new Error('admin/config missing');
  return snap.data() as AdminConfig;
}
