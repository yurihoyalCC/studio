export type User = {
  uid: string;
  role: 'owner' | 'guest' | 'admin';
  displayName: string;
  email: string;
  phone?: string;
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  trustScore: number;
  vipTier: 'wayfinder' | 'navigator' | 'trailblazer' | 'lighthouse';
  vip: {
    compositeScore: number;
    monthlyActivityPoints: number;
    freeLotteryEntriesRemaining: number;
    lastVipGrantAt: string;
  };
  creditsBalance: number;
  clubMember: boolean;
  abuseFlags: {
    frozen: boolean;
    reason: string | null;
  };
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
};

export type Listing = {
  listingId: string;
  ownerUid: string;
  resort: {
    id: string;
    name: string;
    brand: string;
    location: {
      country: string;
      region: string;
      city: string;
    };
    tier: 'lux' | 'mid' | 'value';
    imageUrl: string;
  };
  unit: {
    bedrooms: number;
    sleeps: number;
    features: {
      kitchen: boolean;
      view: 'ocean' | 'resort' | 'garden' | null;
    };
    type: string;
  };
  stay: {
    startDate: string;
    endDate: string;
    nights: number;
  };
  proof: {
    confNumber?: string;
    attachmentUrl?: string;
    verified: boolean;
    verifiedAt?: string;
  };
  source: 'owner' | 'developer';
  maintenanceFeeUSD: number | null;
  tradeValueScore: number;
  creditValue: number;
  status: 'draft' | 'active' | 'under_offer' | 'booked' | 'expired' | 'blocked' | 'canceled' | 'lottery';
  tradeModes: {
    creditsOnly: boolean;
    tradeOnly: boolean;
    tradePlusCredits: boolean;
  };
  allowOffers: boolean;
  minOfferPct: number;
  visibility: 'public' | 'pilotOnly';
  analytics: {
    views: number;
    offers: number;
    saves: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type Offer = {
  offerId: string;
  listingId: string;
  fromUid: string;
  toUid:string;
  offeredListingId: string | null;
  offeredCredits: number;
  aiRank: 'low' | 'fair' | 'great';
  status: 'pending' | 'countered' | 'accepted' | 'declined' | 'expired';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type WalletEntry = {
  entryId: string;
  type:
    | 'deposit_earn'
    | 'trade_spend'
    | 'trade_fee'
    | 'purchase'
    | 'gift_receive'
    | 'gift_send'
    | 'admin_adjust'
    | 'vip_reward'
    | 'lottery_entry'
    | 'lottery_refund'
    | 'lottery_retained';
  amount: number;
  refType: 'listing' | 'trade' | 'order' | 'gift' | 'admin' | 'lottery';
  refId: string;
  createdAt: string;
  signed: boolean;
  description: string;
};

export type Lottery = {
  lotteryId: string;
  listingId: string;
  ownerUid: string;
  entryCreditCost: number;
  openAt: string;
  closeAt: string;
  drawAt: string;
  status: 'open' | 'closed' | 'drawn' | 'fulfilled' | 'canceled';
  guaranteedOwnerPayoutCredits: number;
  winnerUid: string | null;
  resultsPublic: {
    winnerMaskedId: string | null;
    totalEntries: number;
  };
  createdAt: string;
  updatedAt: string;
};
