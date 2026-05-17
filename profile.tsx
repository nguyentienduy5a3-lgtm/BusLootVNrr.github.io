import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetMe, useUpdateProfile, useGetInventory, getGetMeQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { ACHIEVEMENTS, RARITY_STYLE } from "@/lib/achievements";

const profileSchema = z.object({
  nickname: z.string().min(2).max(20).optional().or(z.literal("")),
  bio: z.string().max(160).optional().or(z.literal("")),
  avatar: z.string().optional(),
});

const AVATARS = ["🚌", "🐉", "🍃", "🍀", "🇻🇳", "🐯", "🍜", "🛵"];

export default function Profile() {
  const { data: user, isLoading } = useGetMe();
  const { data: inventory } = useGetInventory();
  const updateMut = useUpdateProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { nickname: "", bio: "", avatar: "🚌" },
  });

  useEffect(() => {
    if (user) form.reset({ nickname: user.nickname || "", bio: user.bio || "", avatar: user.avatar || "🚌" });
  }, [user, form]);

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    updateMut.mutate({ data }, {
      onSuccess: (updatedUser) => {
        toast({ title: "Đã lưu hồ sơ" });
        queryClient.setQueryData(getGetMeQueryKey(), updatedUser);
      },
      onError: (err: any) => toast({ title: "Lỗi lưu hồ sơ", description: err.message, variant: "destructive" }),
    });
  };

  if (isLoading || !user) return <Skeleton className="h-96 w-full" />;

  const inv = (inventory as any[]) ?? [];
  const unlockedIds = new Set(
    ACHIEVEMENTS.filter((a) => a.check(user, inv)).map((a) => a.id)
  );
  const unlockedCount = unlockedIds.size;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile card */}
      <Card className="overflow-hidden border-2">
        <div className="h-32 bg-gradient-to-r from-primary via-accent to-primary" />
        <CardContent className="px-6 pb-6 relative">
          <div className="absolute -top-16 left-6 w-32 h-32 bg-background rounded-xl border-4 border-background flex items-center justify-center text-7xl shadow-lg">
            {user.avatar || "🚌"}
          </div>
          <div className="pt-20">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-display font-bold">{user.nickname || user.username}</h1>
                <p className="text-muted-foreground text-lg">@{user.username}</p>
              </div>
              <Badge className="text-lg py-1 px-4 font-bold bg-primary/20 text-primary border-primary/30">
                {user.school}
              </Badge>
            </div>
            {user.bio && (
              <p className="mt-4 text-lg italic border-l-4 border-muted pl-4 py-1 text-muted-foreground">
                "{user.bio}"
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
            <div className="text-center">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Chuyến đi</div>
              <div className="text-3xl font-display font-bold">{user.rideCount}</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Streak</div>
              <div className="text-3xl font-display font-bold text-orange-500">{user.streak}🔥</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Rolls</div>
              <div className="text-3xl font-display font-bold text-primary">{user.availableRolls}</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Thành tích</div>
              <div className="text-3xl font-display font-bold text-accent">{unlockedCount}/{ACHIEVEMENTS.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display uppercase italic flex items-center gap-2">
            🏆 Thành tích
          </CardTitle>
          <CardDescription>
            Đã mở {unlockedCount}/{ACHIEVEMENTS.length} thành tích
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = unlockedIds.has(ach.id);
              const style = RARITY_STYLE[ach.rarity];
              return (
                <div
                  key={ach.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all
                    ${unlocked
                      ? `${style.border} ${style.bg}`
                      : "border-border/30 bg-muted/20 opacity-50 grayscale"}`}
                >
                  <div className={`text-3xl shrink-0 ${!unlocked ? "opacity-40" : ""}`}>
                    {unlocked ? ach.icon : "🔒"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-sm ${!unlocked ? "text-muted-foreground" : ""}`}>
                        {ach.title}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded
                        ${ach.rarity === "rainbow"
                          ? "bg-gradient-to-r from-pink-500 via-yellow-400 to-green-400 text-white"
                          : ach.rarity === "gold"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : ach.rarity === "silver"
                              ? "bg-slate-400/20 text-slate-300"
                              : "bg-orange-700/20 text-orange-400"}`}>
                        {style.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{ach.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit profile */}
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa hồ sơ</CardTitle>
          <CardDescription>Tùy chỉnh cách bạn xuất hiện trên bảng xếp hạng.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="avatar" render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <ToggleGroup type="single" value={field.value} onValueChange={(v) => { if (v) field.onChange(v); }} className="justify-start flex-wrap gap-2">
                      {AVATARS.map((emoji) => (
                        <ToggleGroupItem key={emoji} value={emoji}
                          className={`text-3xl w-16 h-16 rounded-xl border-2 ${field.value === emoji ? "border-primary bg-primary/10" : "border-transparent bg-muted/50"}`}>
                          {emoji}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="nickname" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên hiển thị</FormLabel>
                  <FormControl><Input {...field} placeholder="Biệt danh của bạn" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới thiệu</FormLabel>
                  <FormControl><Textarea {...field} placeholder="Kể về các tuyến bus yêu thích của bạn..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full font-bold" disabled={updateMut.isPending}>
                {updateMut.isPending ? "Đang lưu..." : "Lưu hồ sơ"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
