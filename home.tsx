import { useState, useRef, useEffect, useCallback } from "react";
import {
  useGetMe, useStartRide, useCompleteRide,
  useOpenCapsule, useOpenCookie, useSpinWheel,
  getGetMeQueryKey, getGetInventoryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { RARITY_COLORS } from "@/lib/rarity";
import { RideMap } from "@/components/ride-map";
import { BUS_LOCATIONS } from "@/lib/locations";
import { calcRideStats } from "@/lib/ride-stats";
import { sounds } from "@/lib/sounds";
import { Fireworks } from "@/components/fireworks";

const RIDE_DURATION_MS = 6000;
const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

/* ─── Capsule reveal ────────────────────────────────────────────── */
function CapsuleRevealModal({ result, open, onOpenChange }: {
  result: any; open: boolean; onOpenChange: (v: boolean) => void;
}) {
  if (!result) return null;
  const color = RARITY_COLORS[result.rarity] ?? RARITY_COLORS.common;
  const isImpossible = result.rarity === "impossible";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[400px] border-4 ${isImpossible ? "animate-pulse" : ""}`}
        style={{ borderColor: color }}
      >
        <DialogTitle className="text-center text-3xl mb-2 font-display uppercase tracking-wider" style={{ color }}>
          {result.rarity} Drop!
        </DialogTitle>
        <DialogDescription className="text-center mb-4">
          {result.isNew ? "Sticker mới!" : "Sticker trùng."}
        </DialogDescription>
        <div className="flex flex-col items-center gap-4">
          <div className="text-9xl drop-shadow-2xl relative">
            {isImpossible && (
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-full h-full rounded-full opacity-20 blur-xl animate-pulse bg-red-500" />
              </div>
            )}
            {result.stickerIcon}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-1">{result.stickerName}</h3>
            <p className="text-muted-foreground text-sm">{result.stickerDesc}</p>
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={() => { sounds.click(); onOpenChange(false); }} size="lg" className="w-full font-bold">
            Tuyệt vời!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Ride completion dialog ────────────────────────────────────── */
function RideCompleteDialog({ open, onOpenChange, stats }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  stats: { distanceKm: number; moneySavedVnd: number; co2SavedGrams: number } | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] border-2 border-green-500">
        <DialogTitle className="text-center text-2xl font-display uppercase text-green-500 mb-1">
          Hoàn thành an toàn! 🎉
        </DialogTitle>
        <DialogDescription className="text-center text-base mb-4">
          Bạn vừa hoàn thành chuyến đi an toàn. Cảm ơn đã chọn xe buýt!
        </DialogDescription>
        {stats && (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted rounded-xl p-3">
              <div className="text-2xl mb-1">📏</div>
              <div className="text-lg font-bold">{stats.distanceKm} km</div>
              <div className="text-xs text-muted-foreground mt-0.5">Quãng đường</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {stats.moneySavedVnd > 0 ? `${(stats.moneySavedVnd / 1000).toFixed(0)}k ₫` : "9k ₫"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Tiền tiết kiệm</div>
            </div>
            <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3">
              <div className="text-2xl mb-1">🌱</div>
              <div className="text-lg font-bold text-sky-600 dark:text-sky-400">
                {stats.co2SavedGrams >= 1000
                  ? `${(stats.co2SavedGrams / 1000).toFixed(1)} kg`
                  : `${stats.co2SavedGrams} g`}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">CO₂ giảm</div>
            </div>
          </div>
        )}
        <div className="mt-5">
          <Button size="lg" className="w-full font-bold bg-green-600 hover:bg-green-700"
            onClick={() => { sounds.click(); onOpenChange(false); }}>
            Tuyệt! +1 Roll nhận rồi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Fortune Wheel ─────────────────────────────────────────────── */
function FortuneWheel({ onSpinEnd }: { onSpinEnd: (result: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: user, refetch: refetchUser } = useGetMe();
  const spinMut = useSpinWheel();
  const [isSpinning, setIsSpinning] = useState(false);

  const PRIZES = [
    { label: "+1 Roll",    color: "#2ecc71" },
    { label: "+2 Rolls",   color: "#3498db" },
    { label: "+1 Streak",  color: "#9b59b6" },
    { label: "Thử lại",    color: "#e74c3c" },
    { label: "+3 Rolls",   color: "#f39c12" },
    { label: "Pity Reset!",color: "#f1c40f" },
  ];

  const drawWheel = useCallback((angleOffset: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const seg = PRIZES.length;
    for (let i = 0; i < seg; i++) {
      const angle = (Math.PI * 2) / seg;
      const s = i * angle + angleOffset, e = s + angle;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, s, e);
      ctx.fillStyle = PRIZES[i].color; ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(s + angle / 2);
      ctx.textAlign = "right"; ctx.fillStyle = "white"; ctx.font = "bold 12px sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 3;
      ctx.fillText(PRIZES[i].label, r - 10, 5); ctx.restore();
    }
    ctx.beginPath();
    ctx.moveTo(canvas.width - 14, cy); ctx.lineTo(canvas.width, cy - 10); ctx.lineTo(canvas.width, cy + 10);
    ctx.fillStyle = "white"; ctx.fill();
  }, []);

  useEffect(() => { drawWheel(0); }, [drawWheel]);

  const handleSpin = () => {
    if (isSpinning || !user || user.dailyWheelSpins <= 0) return;
    sounds.spin(); setIsSpinning(true);
    let angle = 0, speed = 0.55;
    spinMut.mutate(undefined, {
      onSuccess: (res) => {
        const animate = () => {
          if (speed > 0.008) { angle += speed; speed *= 0.978; drawWheel(angle); requestAnimationFrame(animate); }
          else { setIsSpinning(false); sounds.spinEnd(); onSpinEnd(res); refetchUser(); }
        };
        animate();
      },
      onError: () => { sounds.error(); setIsSpinning(false); },
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <canvas ref={canvasRef} width={250} height={250} className="rounded-full shadow-lg" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 bg-foreground rounded-l-full shadow z-10 flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-background rounded-full" />
        </div>
      </div>
      <Button onClick={handleSpin}
        disabled={isSpinning || !user || user.dailyWheelSpins <= 0 || spinMut.isPending}
        className="w-full font-bold uppercase" size="lg">
        {user ? (user.dailyWheelSpins > 0 ? `Quay (${user.dailyWheelSpins} lần còn lại)` : "Hết lượt hôm nay") : "Đăng nhập để quay"}
      </Button>
    </div>
  );
}

/* ─── Cookie with crack animation ───────────────────────────────── */
function FortuneCookie({ onCrack }: { onCrack: () => void }) {
  const [state, setCookieState] = useState<"idle" | "cracking" | "cracked">("idle");

  const handleClick = () => {
    if (state !== "idle") return;
    sounds.cookie();
    setCookieState("cracking");
    setTimeout(() => { setCookieState("cracked"); onCrack(); }, 560);
  };

  const reset = () => { sounds.click(); setCookieState("idle"); };

  return (
    <div className="flex flex-col items-center">
      {state !== "cracked" ? (
        <div
          className="relative w-32 h-32 flex items-center justify-center cursor-pointer select-none"
          onClick={handleClick}
        >
          {/* Left half */}
          <div
            className={`absolute inset-0 flex items-center justify-center text-9xl leading-none ${state === "cracking" ? "cookie-crack-left" : "hover:scale-110 transition-transform"}`}
            style={{ clipPath: "inset(0 50% 0 0)", transformOrigin: "left center" }}
          >
            🥠
          </div>
          {/* Right half */}
          <div
            className={`absolute inset-0 flex items-center justify-center text-9xl leading-none ${state === "cracking" ? "cookie-crack-right" : ""}`}
            style={{ clipPath: "inset(0 0 0 50%)", transformOrigin: "right center" }}
          >
            🥠
          </div>
          {/* Full cookie shown when idle (no clip) — behind the halves for click area */}
          {state === "idle" && (
            <div className="text-9xl leading-none opacity-0 pointer-events-none select-none">🥠</div>
          )}
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={reset} className="mt-2">Lấy cái khác</Button>
      )}
      {state === "idle" && (
        <p className="mt-3 text-sm text-muted-foreground font-medium uppercase tracking-wider">Bấm để phá vỡ</p>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function Home() {
  const { data: user } = useGetMe();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [route, setRoute] = useState("Tuyến 32");
  const [pickup, setPickup] = useState("Giáp Bát");
  const [destination, setDestination] = useState("Mỹ Đình");
  const [routeConfirmed, setRouteConfirmed] = useState(false);
  const [isRiding, setIsRiding] = useState(false);

  const [rideCompleteOpen, setRideCompleteOpen] = useState(false);
  const [rideStats, setRideStats] = useState<ReturnType<typeof calcRideStats> | null>(null);

  /* Dice rolling */
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceFace, setDiceFace] = useState("🎲");
  const diceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Capsule */
  const [capsuleResult, setCapsuleResult] = useState<any>(null);
  const [capsuleModalOpen, setCapsuleModalOpen] = useState(false);

  /* Fireworks */
  const [fireworksActive, setFireworksActive] = useState(false);

  /* Cookie */
  const [cookieResult, setCookieResult] = useState<string | null>(null);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [cookieKey, setCookieKey] = useState(0); // force-remount cookie component

  const startRideMut = useStartRide();
  const completeRideMut = useCompleteRide();
  const capsuleMut = useOpenCapsule();
  const cookieMut = useOpenCookie();

  const handleRouteChange = (v: string) => { sounds.click(); setRoute(v); setRouteConfirmed(false); };
  const handlePickupChange = (v: string) => { sounds.click(); setPickup(v); setRouteConfirmed(false); };
  const handleDestChange = (v: string) => { sounds.click(); setDestination(v); setRouteConfirmed(false); };

  const handleConfirmRoute = () => {
    sounds.confirm();
    if (!user) { toast({ title: "Cần đăng nhập", description: "Vui lòng đăng nhập để bắt đầu chuyến đi." }); return; }
    if (pickup === destination) { sounds.error(); toast({ title: "Lỗi lộ trình", description: "Điểm đón và điểm đến không được trùng nhau.", variant: "destructive" }); return; }
    setRouteConfirmed(true);
  };

  const handleStartRide = () => {
    sounds.rideStart();
    startRideMut.mutate({ data: { route, pickup, destination } }, {
      onSuccess: () => setIsRiding(true),
      onError: () => { sounds.error(); toast({ title: "Không thể bắt đầu chuyến đi", variant: "destructive" }); },
    });
  };

  const handleMapAnimationComplete = () => {
    completeRideMut.mutate(undefined, {
      onSuccess: (updatedUser) => {
        setIsRiding(false); setRouteConfirmed(false);
        sounds.rideComplete();
        const pl = BUS_LOCATIONS[pickup], dl = BUS_LOCATIONS[destination];
        setRideStats(pl && dl ? calcRideStats(pl, dl) : null);
        setRideCompleteOpen(true);
        queryClient.setQueryData(getGetMeQueryKey(), updatedUser);
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      },
    });
  };

  const startDice = () => {
    let idx = 0;
    setDiceFace(DICE_FACES[0]);
    if (diceIntervalRef.current) clearInterval(diceIntervalRef.current);
    diceIntervalRef.current = setInterval(() => {
      idx++;
      setDiceFace(DICE_FACES[idx % DICE_FACES.length]);
    }, 80);
  };

  const stopDice = () => {
    if (diceIntervalRef.current) { clearInterval(diceIntervalRef.current); diceIntervalRef.current = null; }
    setDiceRolling(false);
    setDiceFace("🎲");
  };

  const handleOpenCapsule = () => {
    if (!user || user.availableRolls <= 0) { sounds.error(); return; }
    sounds.click();
    setDiceRolling(true);
    startDice();

    const startTime = Date.now();
    capsuleMut.mutate(undefined, {
      onSuccess: (res) => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1000 - elapsed);
        setTimeout(() => {
          stopDice();
          sounds.capsule(res.rarity);
          setCapsuleResult(res);
          setCapsuleModalOpen(true);
          setFireworksActive(true);
          setTimeout(() => setFireworksActive(false), 3500);
          queryClient.setQueryData(getGetMeQueryKey(), res.user);
          queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() });
        }, remaining);
      },
      onError: (err: any) => {
        stopDice();
        sounds.error();
        toast({ title: "Không thể mở capsule", description: err.message, variant: "destructive" });
      },
    });
  };

  const handleCookieCrack = () => {
    cookieMut.mutate(undefined, {
      onSuccess: (res) => { setCookieResult(res.fortune); setCookieOpen(true); },
      onError: () => sounds.error(),
    });
  };

  const pickupLoc = BUS_LOCATIONS[pickup];
  const destLoc = BUS_LOCATIONS[destination];

  return (
    <div className="space-y-6">
      {/* Fireworks overlay */}
      <Fireworks active={fireworksActive} durationMs={3500} />

      {/* Stats bar */}
      {user && (
        <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
          <CardContent className="p-4 relative z-10 flex items-center justify-between">
            {[
              { label: "Chuyến đi", value: user.rideCount },
              { label: "Streak", value: `${user.streak}🔥` },
              { label: "Rolls", value: user.availableRolls },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xs font-medium opacity-80 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-2xl font-bold font-display">{stat.value}</div>
                </div>
                {i < arr.length - 1 && <div className="w-px h-10 bg-primary-foreground/20" />}
              </div>
            ))}
          </CardContent>
          <div className="px-4 pb-3 pt-0 relative z-10">
            <div className="flex justify-between text-xs mb-1 font-bold">
              <span>PITY COUNTER</span>
              <span>{user.pityActive ? "PITY ACTIVE! 50% IMPOSSIBLE!" : `${50 - user.pityCounter} lượt đến pity`}</span>
            </div>
            <Progress value={user.pityActive ? 100 : (user.pityCounter / 50) * 100} className="h-2 bg-primary-foreground/20" />
          </div>
        </Card>
      )}

      {/* Ride section */}
      <Card className="border-2 border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-display uppercase italic">
            <span className="text-3xl">🚌</span> Bắt xe buýt
          </CardTitle>
          <CardDescription>Chọn lộ trình, xác nhận rồi bắt đầu chuyến đi để nhận roll.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold">Tuyến</label>
              <Select value={route} onValueChange={handleRouteChange} disabled={isRiding}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Tuyến 32","Tuyến 27","Tuyến 161","Tuyến 09","Metro Cát Linh","86 Nội Bài"].map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mr-1 align-middle" />Điểm đón
              </label>
              <Select value={pickup} onValueChange={handlePickupChange} disabled={isRiding}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(BUS_LOCATIONS).map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 mr-1 align-middle" />Điểm đến
              </label>
              <Select value={destination} onValueChange={handleDestChange} disabled={isRiding}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(BUS_LOCATIONS).map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!routeConfirmed && !isRiding && (
            <Button className="w-full font-bold uppercase tracking-wider" size="lg" variant="outline" onClick={handleConfirmRoute}>
              Xác định lộ trình
            </Button>
          )}

          {(routeConfirmed || isRiding) && pickupLoc && destLoc && (
            <div className="space-y-3">
              <RideMap pickup={pickupLoc} destination={destLoc} isRiding={isRiding}
                rideDurationMs={RIDE_DURATION_MS} onRideComplete={handleMapAnimationComplete} />
              {isRiding ? (
                <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-xl px-5 py-3">
                  <span className="text-3xl animate-bounce">🚌</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm">Đang chạy {route}…</div>
                    <div className="text-xs text-muted-foreground">{pickup} → {destination}</div>
                    <Progress value={100} className="h-1 mt-2 animate-pulse" />
                  </div>
                </div>
              ) : (
                <Button className="w-full font-bold uppercase tracking-wider" size="lg"
                  onClick={handleStartRide} disabled={startRideMut.isPending || !user}>
                  {startRideMut.isPending ? "Đang khởi động…" : "Bắt đầu chuyến đi"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capsule — dice roll animation */}
        <Card className="border-2 border-accent/20 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-display uppercase italic">
              <span className="text-3xl">🎲</span> Mở Capsule
            </CardTitle>
            <CardDescription>Dùng rolls để nhận sticker hiếm.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div className={`absolute inset-0 opacity-20 blur-2xl rounded-full ${diceRolling ? "bg-yellow-400 animate-pulse" : "bg-accent"}`} />
              <div
                className={`text-8xl relative z-10 drop-shadow-xl cursor-pointer select-none transition-transform
                  ${diceRolling ? "animate-dice-shake" : "hover:scale-110"}`}
                onClick={handleOpenCapsule}
              >
                {diceRolling ? diceFace : "💊"}
              </div>
            </div>
            <Button
              size="lg"
              className={`w-full font-bold uppercase tracking-wider ${diceRolling
                ? "bg-yellow-500 hover:bg-yellow-500 text-black"
                : "bg-accent hover:bg-accent/90 text-accent-foreground"}`}
              onClick={handleOpenCapsule}
              disabled={capsuleMut.isPending || diceRolling || !user || user.availableRolls <= 0}
            >
              {diceRolling
                ? "Đang lắc xúc xắc…"
                : user
                  ? user.availableRolls > 0
                    ? `Mở 1 Capsule (còn ${user.availableRolls})`
                    : "Hết rolls"
                  : "Đăng nhập để mở"}
            </Button>
          </CardContent>
        </Card>

        {/* Fortune Wheel */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-display uppercase italic">Vòng quay may mắn</CardTitle>
            <CardDescription>{user ? `Còn ${user.dailyWheelSpins} lượt hôm nay` : "3 lượt/ngày"}</CardDescription>
          </CardHeader>
          <CardContent>
            <FortuneWheel onSpinEnd={(res) => toast({ title: "Kết quả vòng quay!", description: res.label })} />
          </CardContent>
        </Card>
      </div>

      {/* Fortune Cookie */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-display uppercase italic">Bánh quy may mắn</CardTitle>
          <CardDescription>Bấm để phá vỡ và xem lời tiên tri</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[200px] gap-4">
          <FortuneCookie key={cookieKey} onCrack={handleCookieCrack} />
          {cookieOpen && cookieResult && (
            <div className="flex flex-col items-center gap-3 animate-in zoom-in fade-in duration-300 max-w-md text-center w-full">
              <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl shadow-sm border border-amber-200 dark:border-amber-800 font-serif italic text-lg">
                "{cookieResult}"
              </div>
              <Button variant="outline" size="sm" onClick={() => { setCookieOpen(false); setCookieResult(null); setCookieKey(k => k + 1); }}>
                Lấy cái khác
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CapsuleRevealModal result={capsuleResult} open={capsuleModalOpen} onOpenChange={setCapsuleModalOpen} />
      <RideCompleteDialog open={rideCompleteOpen} onOpenChange={setRideCompleteOpen} stats={rideStats} />
    </div>
  );
}
