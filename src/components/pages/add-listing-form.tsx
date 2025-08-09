"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getListingEstimate } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal, Sparkles, TrendingUp, ShieldCheck, Scale, History, Shuffle } from 'lucide-react';

const initialState = {
  message: '',
  errors: {},
  estimate: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Calculating..." : "Calculate Value"}
    </Button>
  );
}

export function AddListingForm() {
  const [state, formAction] = useFormState(getListingEstimate, initialState);

  const breakdownIcons = {
    locationDemand: <TrendingUp className="h-5 w-5 text-accent" />,
    seasonality: <TrendingUp className="h-5 w-5 text-accent" />,
    brandTier: <ShieldCheck className="h-5 w-5 text-accent" />,
    unitType: <Scale className="h-5 w-5 text-accent" />,
    mfRatio: <Scale className="h-5 w-5 text-accent" />,
    history: <History className="h-5 w-5 text-accent" />,
    flexibility: <Shuffle className="h-5 w-5 text-accent" />,
  };
  
  return (
    <Card className="w-full">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Reservation Details</CardTitle>
          <CardDescription>
            Enter your confirmed reservation information to get a credit value estimate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resortId">Resort Name</Label>
            <Input id="resortId" name="resortId" placeholder="e.g., Maui Seaside Resort" />
            {state.errors?.resortId && <p className="text-sm text-destructive">{state.errors.resortId[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dates">Dates of Stay</Label>
            <Input id="dates" name="dates" placeholder="e.g., July 12 - July 19, 2024" />
             {state.errors?.dates && <p className="text-sm text-destructive">{state.errors.dates[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit Details</Label>
            <Textarea id="unit" name="unit" placeholder="e.g., 2 Bedroom Ocean View, sleeps 6" />
            {state.errors?.unit && <p className="text-sm text-destructive">{state.errors.unit[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mfUSD">Maintenance Fee (USD)</Label>
            <Input id="mfUSD" name="mfUSD" type="number" placeholder="e.g., 1200" />
            {state.errors?.mfUSD && <p className="text-sm text-destructive">{state.errors.mfUSD[0]}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch">
          <SubmitButton />
          {state.message && state.message !== 'Success' && (
             <p className="text-sm text-destructive mt-4">{state.message}</p>
          )}
        </CardFooter>
      </form>

      {state.estimate && (
        <div className="p-6 border-t">
          <Card className="bg-primary/5">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Sparkles className="text-accent" />
                    Value Estimate
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center bg-background p-6 rounded-lg">
                    <p className="text-muted-foreground">Estimated Credit Value</p>
                    <p className="text-5xl font-bold text-primary my-2">{state.estimate.estimatedCredits.toLocaleString()}</p>
                    <Badge>Score: {state.estimate.score}/100</Badge>
                </div>

                <div>
                    <h4 className="font-semibold mb-4 font-headline">Valuation Breakdown</h4>
                    <div className="space-y-3">
                    {Object.entries(state.estimate.breakdown).map(([key, value]) => (
                        <div key={key} className="flex gap-4 items-start text-sm">
                            <div className="flex-shrink-0 mt-1">
                                {breakdownIcons[key as keyof typeof breakdownIcons]}
                            </div>
                            <p><span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value as string}</p>
                        </div>
                    ))}
                    </div>
                </div>

                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Disclaimer</AlertTitle>
                    <AlertDescription>{state.estimate.disclaimer}</AlertDescription>
                </Alert>

                <Button className="w-full" size="lg">
                    Deposit Listing & Get {state.estimate.estimatedCredits.toLocaleString()} Credits
                </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}
