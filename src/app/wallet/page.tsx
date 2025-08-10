import { mockUsers, mockWalletEntries } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, PlusCircle, ArrowDown, ArrowUp } from "lucide-react";
import { VipLadder } from "@/components/vip-ladder";

export default function WalletPage() {
  const user = mockUsers['user-1'];

  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <WalletIcon className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-headline font-bold text-primary">
          My Wallet
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your credits, transaction history, and VIP status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance and Actions */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="text-center shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-muted-foreground font-medium">
                Available Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-6xl font-bold text-primary">
                {user.creditsBalance.toLocaleString()}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Buy Credits
              </Button>
            </CardFooter>
          </Card>

          <VipLadder user={user} />

        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Transaction History</CardTitle>
              <CardDescription>A log of all your credit movements.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockWalletEntries.map((entry) => (
                    <TableRow key={entry.entryId}>
                      <TableCell className="text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={entry.amount > 0 ? "outline" : "secondary"} className={`border-none ${entry.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {entry.amount > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                          {formatType(entry.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className={`text-right font-semibold ${entry.amount > 0 ? 'text-green-600' : 'text-destructive'}`}>
                        {entry.amount > 0 ? '+' : ''}
                        {entry.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
