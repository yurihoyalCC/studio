import { AddListingForm } from "@/components/pages/add-listing-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from 'lucide-react';

export default function AddListingPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
      <div className="text-center mb-10">
        <BarChart className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-headline font-bold text-primary">
          Check Your Value
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          See the estimated credit value of your reservation before you deposit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
           <AddListingForm />
        </div>
        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">How it Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                <div>
                  <h4 className="font-semibold">Enter Details</h4>
                  <p className="text-muted-foreground">Provide your reservation info.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                <div>
                  <h4 className="font-semibold">Get Estimate</h4>
                  <p className="text-muted-foreground">Our AI calculates its value.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Deposit & Trade</h4>
                  <p className="text-muted-foreground">If you like the value, deposit it!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
