
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockLotteries, mockListings } from "@/lib/mock-data";
import { LotteryCard } from "@/components/lottery-card";
import { Filter, Ticket } from "lucide-react";

export default function LotteryPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <Ticket className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-headline font-bold text-primary">
          Weekly Jackpot Stays
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Enter for 100 credits. Your next dream vacation could be just a click away!
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
            <Select>
              <SelectTrigger id="dates-filter">
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">Next 90 days</SelectItem>
                <SelectItem value="60">Next 60 days</SelectItem>
                <SelectItem value="45">Next 45 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="brand-tier" className="text-sm font-medium">Brand Tier</label>
             <Select>
              <SelectTrigger id="brand-tier">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lux">Luxury</SelectItem>
                <SelectItem value="mid">Mid-Tier</SelectItem>
                <SelectItem value="value">Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            Filter Lotteries
          </Button>
        </div>
      </div>

      {mockLotteries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockLotteries.map((lottery) => {
            const listing = mockListings.find(l => l.listingId === lottery.listingId);
            if (!listing) return null;
            return <LotteryCard key={lottery.lotteryId} lottery={lottery} listing={listing} />;
          })}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-muted-foreground">No active lotteries. Check back soon or browse the marketplace.</p>
        </div>
      )}
    </div>
  );
}
