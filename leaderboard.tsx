import React, { useState } from "react";
import { useGetLeaderboard, useGetStatsSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Map, Target } from "lucide-react";

export default function Leaderboard() {
  const [school, setSchool] = useState<string>("ALL");
  const { data: stats, isLoading: statsLoading } = useGetStatsSummary();
  
  // Create a params object conditionally. If school is ALL, don't pass school filter.
  const params = school === "ALL" ? {} : { school };
  const { data: leaderboard, isLoading: lbLoading } = useGetLeaderboard({ query: { queryKey: ["leaderboard", school] }, request: { query: params } as any });

  const schools = ["ALL", "FTU", "NEU", "HLU", "HUST"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase italic">Leaderboards</h1>
          <p className="text-muted-foreground">Who rides the most? Who has the best luck?</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <Trophy className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold font-display">{statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalUsers}</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Players</div>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <Map className="h-8 w-8 text-accent mb-2" />
            <div className="text-2xl font-bold font-display">{statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalRides}</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Rides</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <Target className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-2xl font-bold font-display">{statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalStickersDropped}</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Stickers Found</div>
          </CardContent>
        </Card>
        <Card className="bg-pink-500/5 border-pink-500/20">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <Medal className="h-8 w-8 text-pink-500 mb-2" />
            <div className="text-xl font-bold font-display uppercase truncate w-full">{statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.topRarity}</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Top Rarity Ever</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <Tabs value={school} onValueChange={setSchool} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-muted/50">
              {schools.map(s => (
                <TabsTrigger key={s} value={s} className="font-bold">{s}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {lbLoading ? (
            <div className="space-y-4 pt-4">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
            </div>
          ) : !leaderboard || leaderboard.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No players found in this category yet.
            </div>
          ) : (
            <div className="space-y-3 pt-4">
              {leaderboard.map((entry, idx) => (
                <div 
                  key={entry.username} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-colors hover:bg-muted/50 ${idx === 0 ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 shadow-sm' : idx === 1 ? 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800' : idx === 2 ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900' : 'bg-card'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold font-display text-lg
                      ${idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-400 text-white' : idx === 2 ? 'bg-orange-400 text-white' : 'bg-muted text-muted-foreground'}`}
                    >
                      {entry.rank}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarFallback className="font-bold text-lg">{entry.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-lg leading-none">{entry.username}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">{entry.school}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-right">
                    <div className="hidden sm:block">
                      <div className="text-xs text-muted-foreground font-bold uppercase">Rides</div>
                      <div className="font-mono">{entry.rideCount}</div>
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-xs text-muted-foreground font-bold uppercase">Stickers</div>
                      <div className="font-mono">{entry.stickerCount}</div>
                    </div>
                    <div className="w-20">
                      <div className="text-xs text-primary font-bold uppercase">Pts</div>
                      <div className="font-display font-bold text-xl text-primary">{entry.points}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
