export type User = {
  uid: string;
  role: 'owner' | 'guest' | 'admin';
  displayName: string;
  email: string;
  phone?: string;
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  trustScore: number;
  vipTier: 'wayfinder' | 'navigator' | 'trailblazer' | 'lighthouse';
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
  status: 'draft' | 'active' | 'under_offer' | 'booked' | 'lottery' | 'expired' | 'blocked' | 'canceled';
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
  toUid: string;
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
    | 'lottery_entry'
    | 'lottery_refund'
    | 'lottery_retained'
    | 'purchase'
    | 'gift_receive'
    | 'gift_send'
    | 'admin_adjust'
    | 'vip_reward';
  amount: number;
  refType: 'listing' | 'trade' | 'order' | 'lottery' | 'gift' | 'admin';
  refId: string;
  createdAt: string;
  signed: boolean;
  description: string;
};
