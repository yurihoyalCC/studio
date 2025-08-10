import type { User } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Award, Star, Shield, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

type VipLadderProps = {
  user: User;
};

const tiers = {
  wayfinder: {
    name: "Wayfinder",
    score: 0,
    benefits: ["Basic marketplace access"],
    icon: <Star className="h-5 w-5" />,
    howToGain: "Complete bookings, respond on time, send fair offers.",
  },
  navigator: {
    name: "Navigator",
    score: 40,
    benefits: ["1 free lottery entry/month", "Early access to new listings"],
    icon: <Award className="h-5 w-5" />,
    howToGain: "2 completed bookings or 1 trade + 1000 credits spent; On-time confirmations ≥ 90%.",
  },
  trailblazer: {
    name: "Trailblazer",
    score: 65,
    benefits: ["2 free lottery entries/month", "Early access", "Priority support", "5% lottery entry discount"],
    icon: <Shield className="h-5 w-5" />,
    howToGain: "4 completed bookings in 90 days; Credits volume ≥ 10k; Clean dispute record.",
  },
  lighthouse: {
    name: "Lighthouse",
    score: 80,
    benefits: ["4 free lottery entries/month", "Early access", "Priority support", "10% lottery entry discount"],
    icon: <CheckCircle className="h-5 w-5" />,
    howToGain: "8 completed bookings/quarter or mix of trades + credits; On-time confirmations ≥ 95%; High acceptance rate.",
  },
};

const tierNames = Object.keys(tiers) as (keyof typeof tiers)[];

export function VipLadder({ user }: VipLadderProps) {
  const currentTierIndex = tierNames.indexOf(user.vipTier);
  const nextTierIndex = currentTierIndex + 1;
  const nextTier = nextTierIndex < tierNames.length ? tiers[tierNames[nextTierIndex]] : null;
  const currentTier = tiers[user.vipTier];

  const scoreForNextTier = nextTier ? nextTier.score : 100;
  const scoreForCurrentTier = currentTier.score;
  const progressPercentage = nextTier ? 
    ((user.vip.compositeScore - scoreForCurrentTier) / (scoreForNextTier - scoreForCurrentTier)) * 100 
    : 100;


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          Your VIP Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <Badge className="text-lg py-1 px-4">{currentTier.name}</Badge>
          <p className="text-sm text-muted-foreground mt-2">Composite Score: {user.vip.compositeScore}</p>
          <Progress value={progressPercentage} className="mt-2 h-2" />
          {nextTier && (
            <p className="text-xs text-muted-foreground mt-1">
              {scoreForNextTier - user.vip.compositeScore} points to {nextTier.name}
            </p>
          )}
        </div>
        
        <h4 className="font-semibold mb-2">Benefits this month:</h4>
        <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">{user.vip.freeLotteryEntriesRemaining} free lottery entries</Badge>
            <Badge variant="secondary">5% Lottery Discount</Badge>
        </div>

        <Accordion type="single" collapsible defaultValue={user.vipTier}>
          {tierNames.map((tierKey) => {
            const tier = tiers[tierKey];
            const isCurrentTier = user.vipTier === tierKey;
            return (
              <AccordionItem value={tierKey} key={tierKey} className={isCurrentTier ? "border-primary border-2 rounded-lg" : ""}>
                <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    {tier.icon} {tier.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <strong>Requirement:</strong> Composite Score ≥ {tier.score}
                    </p>
                    <div>
                      <h5 className="font-semibold">Benefits:</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {tier.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                      </ul>
                    </div>
                     <div>
                      <h5 className="font-semibold">How to Gain:</h5>
                      <p className="text-sm text-muted-foreground">{tier.howToGain}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <Button variant="outline" className="w-full mt-6">
          How to level up <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
