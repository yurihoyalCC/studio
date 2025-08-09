import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockOffers, mockListings, mockUsers } from "@/lib/mock-data";
import { OfferCard } from "@/components/offer-card";
import { Handshake } from "lucide-react";

export default function OffersPage() {
  const currentUser = mockUsers['user-1']; // Assume this is the logged-in user

  const receivedOffers = mockOffers.filter(o => o.toUid === currentUser.uid);
  const sentOffers = mockOffers.filter(o => o.fromUid === currentUser.uid);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <Handshake className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-headline font-bold text-primary">
          Trade Offers
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your incoming and outgoing trade proposals.
        </p>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="received">
            Received ({receivedOffers.filter(o => o.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
        <TabsContent value="received" className="mt-6">
          <div className="space-y-4">
            {receivedOffers.length > 0 ? (
              receivedOffers.map(offer => {
                const listing = mockListings.find(l => l.listingId === offer.listingId);
                const fromUser = mockUsers[offer.fromUid];
                const offeredListing = offer.offeredListingId ? mockListings.find(l => l.listingId === offer.offeredListingId) : null;
                if (!listing || !fromUser) return null;
                return <OfferCard key={offer.offerId} offer={offer} perspective="receiver" />
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">No received offers.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="sent" className="mt-6">
          <div className="space-y-4">
             {sentOffers.length > 0 ? (
              sentOffers.map(offer => {
                return <OfferCard key={offer.offerId} offer={offer} perspective="sender" />
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">You haven't sent any offers.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
