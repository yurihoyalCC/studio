import Image from "next/image";
import { notFound } from "next/navigation";
import { mockListings, mockUsers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { BedDouble, Calendar, Check, Coins, Kitchen, MapPin, Sparkles, Users, View, X } from "lucide-react";
import { format } from "date-fns";

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = mockListings.find(l => l.listingId === params.id);
  
  if (!listing) {
    notFound();
  }
  
  const owner = mockUsers[listing.ownerUid];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Image Carousel */}
          <Carousel className="w-full mb-6 rounded-lg overflow-hidden shadow-lg">
            <CarouselContent>
              {Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-96">
                    <Image
                      src={`${listing.resort.imageUrl.split('.png')[0]}/${index}`}
                      alt={`${listing.resort.name} view ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="resort landscape"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          {/* Listing Header */}
          <div className="mb-6">
            <Badge variant="secondary" className="mb-2">{listing.resort.brand}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
              {listing.resort.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>{`${listing.resort.location.city}, ${listing.resort.location.region}, ${listing.resort.location.country}`}</span>
            </div>
          </div>
          
          <Separator className="my-6" />

          {/* Unit & Stay Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">Unit Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div className="flex items-center gap-3"><BedDouble className="h-5 w-5 text-primary" /><span>{listing.unit.bedrooms} Bedroom{listing.unit.bedrooms > 1 ? 's' : ''}</span></div>
                <div className="flex items-center gap-3"><Users className="h-5 w-5 text-primary" /><span>Sleeps {listing.unit.sleeps}</span></div>
                <div className="flex items-center gap-3"><View className="h-5 w-5 text-primary" /><span>{listing.unit.features.view} View</span></div>
                <div className="flex items-center gap-3">
                  {listing.unit.features.kitchen ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-destructive" />}
                  <span>Full Kitchen</span>
                </div>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">Stay Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-primary" /><span>{listing.stay.nights} Nights</span></div>
                <div className="flex items-center gap-3"><span className="font-semibold">Check-in:</span><span>{format(new Date(listing.stay.startDate), 'EEEE, MMMM d, yyyy')}</span></div>
                <div className="flex items-center gap-3"><span className="font-semibold">Check-out:</span><span>{format(new Date(listing.stay.endDate), 'EEEE, MMMM d, yyyy')}</span></div>
              </CardContent>
            </Card>
          </div>
           <Separator className="my-6" />
           {/* Host Info */}
           {owner && (
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Hosted by {owner.displayName}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={owner.avatarUrl} alt={owner.displayName} />
                    <AvatarFallback>{owner.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Badge>{owner.vipTier.charAt(0).toUpperCase() + owner.vipTier.slice(1)}</Badge>
                    <p className="text-muted-foreground mt-1">Trust Score: {owner.trustScore}/100</p>
                  </div>
                </CardContent>
             </Card>
           )}

        </div>

        {/* Action Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 text-accent">
                <Coins className="h-8 w-8" />
                <span className="text-4xl font-bold">{listing.creditValue.toLocaleString()}</span>
              </div>
              <p className="text-muted-foreground">credits</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button size="lg" className="w-full">
                Book with Credits
              </Button>
              {listing.allowOffers && (
                <Button size="lg" variant="outline" className="w-full">
                  Make an Offer
                </Button>
              )}
               <div className="text-xs text-center text-muted-foreground pt-2">
                <Sparkles className="inline h-3 w-3 mr-1"/>
                Trade Value Score: {listing.tradeValueScore}/100
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
