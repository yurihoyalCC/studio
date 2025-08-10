import Image from "next/legacy/image";
import { notFound } from "next/navigation";
import { mockLotteries, mockListings, mockUsers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Clock, Coins, HelpCircle, ShieldCheck, Ticket, User, Users, Info } from "lucide-react";
import { format, formatDistanceToNowStrict } from "date-fns";
import React from 'react';

export default function LotteryDetailPage({ params }: { params: { id: string } }) {
  const lottery = mockLotteries.find(l => l.lotteryId === params.id);
  
  if (!lottery) {
    notFound();
  }

  const listing = mockListings.find(l => l.listingId === lottery.listingId);
  const user = mockUsers['user-1']; // Assume logged in user

  if (!listing) {
    notFound();
  }

  const endsIn = formatDistanceToNowStrict(new Date(lottery.drawAt), { addSuffix: true });
  // Mocked user entries
  const userEntries = 5; 
  const maxEntries = 10;
  const canEnter = user.creditsBalance >= lottery.entryCreditCost && userEntries < maxEntries;


  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-5xl">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            {/* Image and Header */}
            <div className="relative h-72 rounded-lg overflow-hidden mb-6 shadow-lg">
                <Image
                    src={listing.resort.imageUrl}
                    alt={listing.resort.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="resort landscape"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                    <h1 className="text-4xl font-headline font-bold text-white">
                        {listing.resort.name}
                    </h1>
                    <p className="text-lg text-white/90">{`${listing.resort.location.city}, ${listing.resort.location.region}`}</p>
                </div>
            </div>

            {/* Core Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
                <Card>
                    <CardHeader><CardTitle className="text-base font-normal text-muted-foreground">Stay</CardTitle></CardHeader>
                    <CardContent><p className="text-lg font-semibold">{listing.stay.nights} Nights</p></CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-base font-normal text-muted-foreground">Unit</CardTitle></CardHeader>
                    <CardContent><p className="text-lg font-semibold">{listing.unit.bedrooms} BR / Sleeps {listing.unit.sleeps}</p></CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-base font-normal text-muted-foreground">Original Value</CardTitle></CardHeader>
                    <CardContent><p className="text-lg font-semibold">{listing.creditValue.toLocaleString()} Credits</p></CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-base font-normal text-muted-foreground">Entry</CardTitle></CardHeader>
                    <CardContent><p className="text-lg font-semibold">{lottery.entryCreditCost} Credits</p></CardContent>
                </Card>
            </div>
            
            <Separator className="my-8" />
            
            {/* How it Works */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2"><HelpCircle className="text-primary"/>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Each entry costs <strong>{lottery.entryCreditCost} credits</strong>.</p>
                <p>If you don’t win, you get <strong>{lottery.entryCreditCost * 0.75} credits refunded</strong> (75%). Clearhold retains 25 credits.</p>
                <p>Winners are notified immediately after the draw, and the booking will automatically appear in your account.</p>
                <p>You can enter up to <strong>{maxEntries} times</strong> for this lottery to increase your chances.</p>
              </CardContent>
            </Card>

        </div>
        <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl">
                 <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 text-primary">
                        <Ticket className="h-7 w-7" />
                        <CardTitle className="font-headline text-3xl">Lottery Draw</CardTitle>
                    </div>
                 </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center p-4 bg-secondary rounded-lg">
                        <p className="text-sm text-muted-foreground">Drawing in</p>
                        <p className="text-2xl font-bold text-primary">{endsIn}</p>
                         <p className="text-xs text-muted-foreground">on {format(new Date(lottery.drawAt), 'MMMM d')}</p>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Your Entries</p>
                        <p className="text-lg font-semibold">{userEntries} / {maxEntries}</p>
                    </div>

                    <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                      <ShieldCheck className="h-4 w-4 !text-green-600" />
                      <AlertTitle>Owner Payout</AlertTitle>
                      <AlertDescription>
                        The owner is guaranteed <strong>{lottery.guaranteedOwnerPayoutCredits.toLocaleString()} credits</strong> if this stay is drawn.
                      </AlertDescription>
                    </Alert>

                    <Button size="lg" className="w-full" disabled={!canEnter}>
                        <Ticket className="mr-2"/>
                        Enter for {lottery.entryCreditCost} credits
                    </Button>
                    {!canEnter && userEntries === maxEntries && (
                       <p className="text-center text-sm text-yellow-600">You've reached the max entries.</p>
                    )}
                     {!canEnter && user.creditsBalance < lottery.entryCreditCost && (
                       <Button variant="secondary" className="w-full">Buy Credits</Button>
                    )}
                </CardContent>
            </Card>
        </div>
       </div>
    </div>
  );
}
