import React, { useState } from "react";
import { useGetInventory, useTradeStickerUp, getGetInventoryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { RARITY_COLORS, RARITY_LABELS } from "@/lib/rarity";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Inventory() {
  const { data: inventory, isLoading } = useGetInventory();
  const tradeMut = useTradeStickerUp();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [selectedForTrade, setSelectedForTrade] = useState<any>(null);
  
  const totalStickers = inventory ? inventory.reduce((acc, curr) => acc + curr.count, 0) : 0;
  const uniqueStickers = inventory ? inventory.length : 0;
  const totalAvailable = 50; // Just a mock number for completion
  const completionPercent = Math.min(100, Math.round((uniqueStickers / totalAvailable) * 100));

  const handleTrade = () => {
    if (!selectedForTrade) return;
    
    tradeMut.mutate({ data: { stickerId: selectedForTrade.stickerId, rarity: selectedForTrade.rarity } }, {
      onSuccess: (res) => {
        toast({ title: "Trade Successful!", description: `You got: ${res.stickerName}` });
        setSelectedForTrade(null);
        queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() });
      },
      onError: (err: any) => {
        toast({ title: "Trade failed", description: err.message, variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase italic">Your Collection</h1>
          <p className="text-muted-foreground">Collect them all by riding buses.</p>
        </div>
        
        <Card className="w-full md:w-64 bg-card/50">
          <CardContent className="p-4">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-sm">COMPLETION</span>
              <span className="font-display font-bold text-xl text-primary">{completionPercent}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${completionPercent}%` }}></div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-right">
              {uniqueStickers} / {totalAvailable} Unique • {totalStickers} Total
            </div>
          </CardContent>
        </Card>
      </div>

      {!inventory || inventory.length === 0 ? (
        <Card className="py-12 border-dashed">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="text-6xl opacity-50">🫙</div>
            <h3 className="text-xl font-bold">Your collection is empty</h3>
            <p className="text-muted-foreground">Go to the Hub and open some capsules!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {inventory.map((item) => (
            <Card 
              key={item.stickerId} 
              className={`relative overflow-hidden group cursor-pointer border-2 transition-all hover:-translate-y-1 hover:shadow-xl ${item.rarity === 'impossible' ? 'glow-impossible' : ''}`}
              style={{ borderColor: RARITY_COLORS[item.rarity] || RARITY_COLORS.common }}
              onClick={() => {
                if (item.count >= 2 && item.rarity !== 'impossible') {
                  setSelectedForTrade(item);
                }
              }}
            >
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary" className="font-bold shadow-sm">x{item.count}</Badge>
              </div>
              <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                <div className="text-6xl drop-shadow-md py-4 transition-transform group-hover:scale-110">
                  {item.stickerIcon}
                </div>
                <div>
                  <Badge 
                    className="mb-2 text-white border-none text-[10px] tracking-widest uppercase font-bold"
                    style={{ backgroundColor: RARITY_COLORS[item.rarity] || RARITY_COLORS.common }}
                  >
                    {RARITY_LABELS[item.rarity] || item.rarity}
                  </Badge>
                  <h3 className="font-bold text-sm leading-tight line-clamp-1">{item.stickerName}</h3>
                </div>
                {item.count >= 2 && item.rarity !== 'impossible' && (
                  <div className="absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur text-xs font-bold py-1 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to Trade
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedForTrade} onOpenChange={(open) => !open && setSelectedForTrade(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trade Up Stickers</DialogTitle>
            <DialogDescription>
              Trade 2 copies of <b>{selectedForTrade?.stickerName}</b> to get 1 random sticker of the next higher rarity.
            </DialogDescription>
          </DialogHeader>
          
          {selectedForTrade && (
            <div className="py-6 flex flex-col items-center">
              <div className="flex items-center gap-4 text-4xl mb-6">
                <div>{selectedForTrade.stickerIcon}</div>
                <div className="text-muted-foreground text-sm font-bold">+</div>
                <div>{selectedForTrade.stickerIcon}</div>
                <div className="text-primary text-xl">➡️</div>
                <div className="animate-pulse">❓</div>
              </div>
              
              <Button 
                onClick={handleTrade} 
                disabled={tradeMut.isPending}
                className="w-full font-bold uppercase"
              >
                {tradeMut.isPending ? "Trading..." : "Confirm Trade"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
