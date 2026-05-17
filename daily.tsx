import React from "react";
import { useGetDailyStatus, useClaimDaily, getGetDailyStatusQueryKey, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Daily() {
  const { data: status, isLoading } = useGetDailyStatus();
  const claimMut = useClaimDaily();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleClaim = () => {
    claimMut.mutate(undefined, {
      onSuccess: (updatedUser) => {
        toast({ title: "Daily Reward Claimed!", description: "Check your inventory for rewards." });
        queryClient.setQueryData(getGetMeQueryKey(), updatedUser);
        queryClient.invalidateQueries({ queryKey: getGetDailyStatusQueryKey() });
      },
      onError: (err: any) => {
        toast({ title: "Failed to claim", description: err.message, variant: "destructive" });
      }
    });
  };

  if (isLoading || !status) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const canClaim = !status.claimedToday;
  const todayIndex = status.days.findIndex(d => d.isToday);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-display font-bold uppercase italic">Daily Check-in</h1>
        <p className="text-muted-foreground">Come back every day to earn rare drops and streak bonuses.</p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg overflow-hidden relative bg-card/80 backdrop-blur">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
        <CardContent className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Current Streak</div>
            <div className="text-5xl font-display font-bold text-primary flex items-center gap-2">
              {status.streakCount} <span className="text-orange-500 animate-pulse">🔥</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {status.days.map((day, idx) => {
              const isPast = idx < todayIndex;
              const isFuture = idx > todayIndex;
              const isToday = day.isToday;
              
              let cardClass = "border-2 flex flex-col items-center p-3 rounded-xl transition-all ";
              if (isToday) {
                cardClass += day.claimed 
                  ? "border-primary/50 bg-primary/5" 
                  : "border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] bg-primary/10 -translate-y-2";
              } else if (isPast) {
                cardClass += day.claimed ? "border-muted bg-muted/30 opacity-70" : "border-destructive/30 bg-destructive/5 opacity-50";
              } else {
                cardClass += "border-border bg-card/50 opacity-80";
              }

              return (
                <div key={day.date} className={cardClass}>
                  <div className="text-xs font-bold uppercase mb-2 text-muted-foreground">{day.dayLabel}</div>
                  <div className={`text-4xl mb-2 ${isToday && !day.claimed ? 'animate-bounce' : ''}`}>
                    {isPast && !day.claimed ? '❌' : (day.claimed ? '✅' : day.reward)}
                  </div>
                  <div className="text-[10px] font-bold text-center">
                    {isToday ? (day.claimed ? 'CLAIMED' : 'TODAY') : (day.claimed ? 'DONE' : 'LOCK')}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button 
              size="lg" 
              className={`w-full max-w-sm font-bold uppercase tracking-wider text-lg h-14 ${canClaim ? 'animate-pulse' : ''}`}
              onClick={handleClaim}
              disabled={!canClaim || claimMut.isPending}
            >
              {claimMut.isPending ? "Claiming..." : (canClaim ? "Claim Daily Reward" : "Come back tomorrow")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
