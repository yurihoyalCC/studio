import Link from "next/link";
import Image from "next/legacy/image";
import type { Lottery, Listing } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Coins, MapPin, Ticket, ShieldCheck, Clock } from "lucide-react";
import { differenceInDays, formatDistanceToNowStrict } from "date-fns";

type LotteryCardProps = {
  lottery: Lottery;
  listing: Listing;
};

export function LotteryCard({ lottery, listing }: LotteryCardProps) {
  
  const endsIn = formatDistanceToNowStrict(new Date(lottery.drawAt), { addSuffix: true });

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/lottery/${lottery.lotteryId}`} className="block">
          <div className="relative h-48 w-full">
            <Image
              src={listing.resort.imageUrl}
              alt={listing.resort.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint="resort landscape"
            />
            <Badge variant="destructive" className="absolute top-2 left-2 flex items-center gap-1">
              <Ticket className="h-3 w-3" />
              Lottery
            </Badge>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-headline font-semibold mb-2 truncate">
          <Link href={`/lottery/${lottery.lotteryId}`} className="hover:text-primary">
            {listing.resort.name}
          </Link>
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{`${listing.resort.location.city}, ${listing.resort.location.region}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{listing.stay.nights} nights starting {new Date(listing.stay.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Ends {endsIn}</span>
          </div>
           <div className="flex items-center gap-2 pt-2">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span className="text-xs">Guaranteed Payout: {lottery.guaranteedOwnerPayoutCredits.toLocaleString()} credits</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge>
            Entry: {lottery.entryCreditCost} credits
          </Badge>
        </div>
        <Button asChild size="sm">
          <Link href={`/lottery/${lottery.lotteryId}`}>View & Enter</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
