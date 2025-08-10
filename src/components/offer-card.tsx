import Image from "next/image";
import Link from "next/link";
import { mockListings, mockUsers } from "@/lib/mock-data";
import type { Offer } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRightLeft, Check, Coins, Info, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Progress } from "./ui/progress";

type OfferCardProps = {
  offer: Offer;
  perspective: 'sender' | 'receiver';
};

const rankColorMap: Record<Offer['aiRank'], string> = {
    low: "bg-red-100 text-red-800 border-red-300",
    "leaning-low": "bg-orange-100 text-orange-800 border-orange-300",
    fair: "bg-yellow-100 text-yellow-800 border-yellow-300",
    good: "bg-sky-100 text-sky-800 border-sky-300",
    great: "bg-green-100 text-green-800 border-green-300",
};

const statusColorMap: Record<Offer['status'], string> = {
    pending: "bg-blue-100 text-blue-800",
    accepted: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
    countered: "bg-orange-100 text-orange-800",
};

export function OfferCard({ offer, perspective }: OfferCardProps) {
  const listing = mockListings.find(l => l.listingId === offer.listingId);
  const offeredListing = offer.offeredListingId ? mockListings.find(l => l.listingId === offer.offeredListingId) : null;
  const fromUser = mockUsers[offer.fromUid];
  const toUser = mockUsers[offer.toUid];

  if (!listing || !fromUser || !toUser) return null;

  const theyGetListing = perspective === 'receiver' ? listing : offeredListing;
  const youGetListing = perspective === 'receiver' ? offeredListing : listing;

  const theyGetCredits = perspective === 'receiver' ? 0 : offer.offeredCredits;
  const youGetCredits = perspective === 'receiver' ? offer.offeredCredits : 0;
  
  const isPending = offer.status === 'pending';
  const rankText = offer.aiRank.replace(/-/g, ' ');

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-secondary/30 p-4 flex flex-row items-center justify-between">
         <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={(perspective === 'receiver' ? fromUser.avatarUrl : toUser.avatarUrl)} />
                <AvatarFallback>{(perspective === 'receiver' ? fromUser.displayName : toUser.displayName).charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-sm font-semibold">
                {perspective === 'receiver' ? `Offer from ${fromUser.displayName}` : `Your offer to ${toUser.displayName}`}
            </p>
         </div>
         <div className="flex items-center gap-2">
            {perspective === 'receiver' && <Badge className={`${rankColorMap[offer.aiRank]} capitalize`}>AI Rank: {rankText}</Badge>}
            <Badge className={statusColorMap[offer.status]}>{offer.status}</Badge>
         </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* You Give */}
            <div className="text-center">
                <p className="font-semibold text-muted-foreground mb-2">You Give</p>
                <div className="p-4 rounded-lg bg-secondary/50 min-h-[100px] flex flex-col justify-center items-center">
                    {youGetListing === listing ? ( // This means it's a credits-only offer from you
                       <div className="text-center">
                         <Coins className="h-8 w-8 text-primary mx-auto mb-2" />
                         <p className="text-xl font-bold">{offer.offeredCredits.toLocaleString()} Credits</p>
                       </div>
                    ) : (
                      <>
                        {offeredListing && (
                           <Link href={`/listings/${offeredListing.listingId}`} className="text-sm font-semibold hover:text-primary">{offeredListing.resort.name}</Link>
                        )}
                        {offer.offeredCredits > 0 && offeredListing && <p className="text-sm font-bold my-1">+</p>}
                        {offer.offeredCredits > 0 && <p className="text-sm">{offer.offeredCredits.toLocaleString()} Credits</p>}
                      </>
                    )}
                </div>
            </div>

            <ArrowRightLeft className="h-8 w-8 text-muted-foreground mx-auto" />

            {/* You Get */}
            <div className="text-center">
                <p className="font-semibold text-muted-foreground mb-2">You Get</p>
                <div className="p-4 rounded-lg bg-primary/10 min-h-[100px] flex flex-col justify-center items-center">
                   <Link href={`/listings/${listing.listingId}`} className="text-sm font-semibold hover:text-primary">{listing.resort.name}</Link>
                </div>
            </div>

        </div>
        {perspective === 'receiver' && offer.aiDetails && (
            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-blue-600"/>
                    <h4 className="font-semibold text-blue-800">AI Coach</h4>
                </div>
                <p className="text-sm text-blue-700 mb-2">{offer.aiDetails.explanation}</p>
                {offer.aiDetails.suggestedTopUp > 0 && (
                    <p className="text-sm text-blue-700 font-medium">✨ Add {offer.aiDetails.suggestedTopUp} credits to make this a 'Good' offer.</p>
                )}
                 <div className="mt-2 space-y-1">
                    <label className="text-xs font-medium text-blue-700">Acceptance Likelihood</label>
                    <Progress value={offer.aiDetails.acceptanceProbability} className="h-2 [&>div]:bg-blue-500" />
                </div>
            </div>
        )}
      </CardContent>
      {isPending && perspective === 'receiver' && (
        <CardFooter className="p-4 bg-secondary/30 flex justify-end gap-2">
            <Button variant="outline">Counter</Button>
            <Button variant="destructive">
                <X className="mr-2 h-4 w-4" /> Decline
            </Button>
            <Button>
                <Check className="mr-2 h-4 w-4" /> Accept
            </Button>
        </CardFooter>
      )}
       {isPending && perspective === 'sender' && (
        <CardFooter className="p-4 bg-secondary/30 flex justify-end gap-2">
            <Button variant="outline">Withdraw Offer</Button>
        </CardFooter>
      )}
    </Card>
  );
}
