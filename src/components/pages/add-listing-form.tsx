"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { getListingEstimate } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal, Sparkles, TrendingUp, ShieldCheck, Scale, History, Shuffle, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [state, formAction] = useActionState(getListingEstimate, initialState);
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [unit, setUnit] = React.useState<string | undefined>();

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
            <Input id="dates" name="dates" type="hidden" value={
              date?.from && date?.to ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}` : ""
            } />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {state.errors?.dates && <p className="text-sm text-destructive">{state.errors.dates[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit Details</Label>
            <Input id="unit" name="unit" type="hidden" value={unit} />
             <Select onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 bedroom">1 bedroom</SelectItem>
                <SelectItem value="1 bedroom lock off">1 bedroom lock off</SelectItem>
                <SelectItem value="2 bedroom">2 bedroom</SelectItem>
                <SelectItem value="3 bedroom">3 bedroom</SelectItem>
                <SelectItem value="4 bedroom">4 bedroom</SelectItem>
              </SelectContent>
            </Select>
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
