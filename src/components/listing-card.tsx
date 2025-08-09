import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Coins, MapPin, Tag } from "lucide-react";

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/listings/${listing.listingId}`} className="block">
          <div className="relative h-48 w-full">
            <Image
              src={listing.resort.imageUrl}
              alt={listing.resort.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint="resort landscape"
            />
            <Badge variant="secondary" className="absolute top-2 right-2">
              {listing.resort.tier.charAt(0).toUpperCase() + listing.resort.tier.slice(1)}
            </Badge>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-headline font-semibold mb-2 truncate">
          <Link href={`/listings/${listing.listingId}`} className="hover:text-primary">
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
            <span>{`${new Date(listing.stay.startDate).toLocaleDateString()} - ${new Date(listing.stay.endDate).toLocaleDateString()}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>{listing.resort.brand}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-accent" />
          <span className="text-lg font-bold text-primary">{listing.creditValue.toLocaleString()}</span>
        </div>
        <Button asChild size="sm">
          <Link href={`/listings/${listing.listingId}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
