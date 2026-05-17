export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  rarity: "bronze" | "silver" | "gold" | "rainbow";
  check: (user: any, inventory?: any[]) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_ride",
    icon: "🚌",
    title: "Chuy\u1ebfn \u0111i \u0111\u1ea7u ti\u00ean",
    desc: "Ho\u00e0n th\u00e0nh chuy\u1ebfn \u0111i xe bu\u00fdt \u0111\u1ea7u ti\u00ean trong cu\u1ed9c \u0111\u1eddi.",
    rarity: "bronze",
    check: (u) => u.rideCount >= 1,
  },
  {
    id: "rides_10",
    icon: "\ud83c\udfc5",
    title: "H\u00e0nh kh\u00e1ch th\u00e2n thi\u1ebft",
    desc: "Ho\u00e0n th\u00e0nh 10 chuy\u1ebfn \u0111i.",
    rarity: "bronze",
    check: (u) => u.rideCount >= 10,
  },
  {
    id: "rides_50",
    icon: "\ud83c\udfc6",
    title: "Vua xe bu\u00fdt",
    desc: "Ho\u00e0n th\u00e0nh 50 chuy\u1ebfn \u0111i.",
    rarity: "silver",
    check: (u) => u.rideCount >= 50,
  },
  {
    id: "rides_100",
    icon: "\ud83d\ude80",
    title: "Huy\u1ec1n tho\u1ea1i giao th\u00f4ng",
    desc: "Ho\u00e0n th\u00e0nh 100 chuy\u1ebfn \u0111i.",
    rarity: "gold",
    check: (u) => u.rideCount >= 100,
  },
  {
    id: "streak_3",
    icon: "\ud83d\udd25",
    title: "B\u1eaft \u0111\u1ea7u b\u1ea1o",
    desc: "Duy tr\u00ec streak 3 ng\u00e0y li\u00ean ti\u1ebfp.",
    rarity: "bronze",
    check: (u) => u.streak >= 3,
  },
  {
    id: "streak_7",
    icon: "\u26a1",
    title: "Tu\u1ea7n l\u1ec5 \u0111\u1eb7c bi\u1ec7t",
    desc: "Duy tr\u00ec streak 7 ng\u00e0y li\u00ean ti\u1ebfp.",
    rarity: "silver",
    check: (u) => u.streak >= 7,
  },
  {
    id: "streak_30",
    icon: "\ud83d\udc8e",
    title: "Chi\u1ebfn binh th\u00e1ng",
    desc: "Duy tr\u00ec streak 30 ng\u00e0y li\u00ean ti\u1ebfp.",
    rarity: "gold",
    check: (u) => u.streak >= 30,
  },
  {
    id: "first_rare",
    icon: "\ud83d\udc99",
    title: "H\u00e0ng hi\u1ebfm",
    desc: "M\u1edf \u0111\u01b0\u1ee3c sticker Rare l\u1ea7n \u0111\u1ea7u ti\u00ean.",
    rarity: "bronze",
    check: (_, inv) =>
      !!inv?.some((s) =>
        ["rare", "epic", "legendary", "mythic", "secret", "impossible"].includes(s.rarity)
      ),
  },
  {
    id: "first_epic",
    icon: "\ud83d\udc9c",
    title: "S\u1ee9c m\u1ea1nh Epic",
    desc: "M\u1edf \u0111\u01b0\u1ee3c sticker Epic.",
    rarity: "silver",
    check: (_, inv) =>
      !!inv?.some((s) =>
        ["epic", "legendary", "mythic", "secret", "impossible"].includes(s.rarity)
      ),
  },
  {
    id: "first_legendary",
    icon: "\ud83c\udf1f",
    title: "Huy\u1ec1n tho\u1ea1i",
    desc: "M\u1edf \u0111\u01b0\u1ee3c sticker Legendary.",
    rarity: "gold",
    check: (_, inv) =>
      !!inv?.some((s) =>
        ["legendary", "mythic", "secret", "impossible"].includes(s.rarity)
      ),
  },
  {
    id: "impossible_drop",
    icon: "\ud83d\udc7b",
    title: "Kh\u00f4ng th\u1ec3 tin \u0111\u01b0\u1ee3c",
    desc: "M\u1edf \u0111\u01b0\u1ee3c sticker Impossible.",
    rarity: "rainbow",
    check: (_, inv) => !!inv?.some((s) => s.rarity === "impossible"),
  },
  {
    id: "pity_hit",
    icon: "\ud83c\udfb0",
    title: "Nh\u00e0 c\u00e1i",
    desc: "\u0110\u1ea1t ng\u01b0\u1ee1ng pity \u2013 h\u1ec7 th\u1ed1ng \u01b0u \u00e1i b\u1ea1n.",
    rarity: "silver",
    check: (u) => u.pityActive || u.pityCounter >= 50,
  },
  {
    id: "collector_5",
    icon: "\ud83d\udce6",
    title: "Nh\u00e0 s\u01b0u t\u1eadp",
    desc: "S\u1edf h\u1eefu 5 sticker kh\u00e1c nhau.",
    rarity: "bronze",
    check: (_, inv) => (inv?.length ?? 0) >= 5,
  },
  {
    id: "collector_20",
    icon: "\ud83d\uddc3\ufe0f",
    title: "B\u1ea3o t\u00e0ng mini",
    desc: "S\u1edf h\u1eefu 20 sticker kh\u00e1c nhau.",
    rarity: "silver",
    check: (_, inv) => (inv?.length ?? 0) >= 20,
  },
  {
    id: "collector_50",
    icon: "\ud83c\udfdb\ufe0f",
    title: "B\u1ea3o t\u00e0ng qu\u1ed1c gia",
    desc: "S\u1edf h\u1eefu 50 sticker kh\u00e1c nhau.",
    rarity: "gold",
    check: (_, inv) => (inv?.length ?? 0) >= 50,
  },
];

export const RARITY_STYLE: Record<string, { border: string; bg: string; label: string }> = {
  bronze:  { border: "border-orange-600/60", bg: "bg-orange-900/20", label: "Đồng" },
  silver:  { border: "border-slate-400/60",  bg: "bg-slate-700/20",  label: "Bạc" },
  gold:    { border: "border-yellow-400/60", bg: "bg-yellow-900/20", label: "Vàng" },
  rainbow: { border: "border-pink-500/60",   bg: "bg-pink-900/20",   label: "Cầu vồng" },
};
