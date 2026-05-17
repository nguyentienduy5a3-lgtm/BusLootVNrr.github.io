import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { Music, Music2, LogOut, Menu, X } from "lucide-react";

import lofiBg from "@assets/lofi-bg_1779004437369.mp3";

const DAYS_VI = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const day = DAYS_VI[now.getDay()];
  const date = `${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return (
    <div className="hidden md:flex flex-col items-end leading-tight select-none">
      <span className="text-sm font-bold font-mono tabular-nums text-primary">{time}</span>
      <span className="text-[10px] text-muted-foreground">
        {day}, {date}
      </span>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user } = useGetMe();

  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // sync auth modal state properly
  useEffect(() => {
    setAuthOpen(!user && location !== "/");
  }, [user, location]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(lofiBg);
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    const tryPlay = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };

    window.addEventListener("click", tryPlay, { once: true });
    window.addEventListener("keydown", tryPlay, { once: true });
    window.addEventListener("touchstart", tryPlay, { once: true });

    return () => {
      audio.pause();
    };
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => {
        startedRef.current = true;
        setPlaying(true);
      }).catch(() => {});
    }
  }, [playing]);

  const handleLogout = () => {
    localStorage.removeItem("busloot_token");

    // IMPORTANT: clear toàn bộ cache user
    queryClient.clear();

    setLocation("/");

    // reset UI states
    setMobileMenuOpen(false);
    setAuthOpen(false);

    audioRef.current?.pause();
    setPlaying(false);
  };

  const navLinks = [
    { href: "/", label: "Hub" },
    { href: "/inventory", label: "Collection" },
    { href: "/daily", label: "Daily" },
    { href: "/leaderboard", label: "Ranks" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground dark pb-20 md:pb-0">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-bold text-primary uppercase italic">
              Bus<span className="text-accent">Loot</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 ml-auto">
            <Clock />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMusic}
            >
              {playing ? <Music2 className="text-primary" /> : <Music />}
            </Button>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-bold">
                    {user.nickname || user.username}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.school}
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => setAuthOpen(true)}>
                Login / Play
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[4.5rem] z-30 bg-background/95 md:hidden p-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg p-3 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {user && (
            <Button
              className="w-full mt-6"
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      )}

      <main className="flex-1 container mx-auto p-4 max-w-5xl">
        {children}
      </main>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => queryClient.invalidateQueries()}
      />
    </div>
  );
}