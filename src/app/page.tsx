import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockListings } from "@/lib/mock-data";
import { ListingCard } from "@/components/listing-card";
import { Filter } from "lucide-react";

export default function MarketplacePage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          Find Your Next Getaway
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore exclusive reservations and trade for your dream vacation.
        </p>
      </header>

      <div className="mb-8 p-4 border rounded-lg bg-card shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-medium">Destination</label>
            <Input id="destination" placeholder="e.g., Maui, Hawaii" />
          </div>
          <div className="space-y-2">
            <label htmlFor="dates" className="text-sm font-medium">Dates</label>
            <Input id="dates" placeholder="Select your dates" type="date" />
          </div>
          <div className="space-y-2">
            <label htmlFor="guests" className="text-sm font-medium">Guests</label>
            <Select>
              <SelectTrigger id="guests">
                <SelectValue placeholder="2 guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Guest</SelectItem>
                <SelectItem value="2">2 Guests</SelectItem>
                <SelectItem value="3">3 Guests</SelectItem>
                <SelectItem value="4">4 Guests</SelectItem>
                <SelectItem value="5">5+ Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockListings.map((listing) => (
          <ListingCard key={listing.listingId} listing={listing} />
        ))}
      </div>
    </div>
  );
}
