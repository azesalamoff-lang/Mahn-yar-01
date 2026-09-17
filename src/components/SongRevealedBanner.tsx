import React, { useEffect, useState } from 'react';
import { Music, CheckCircle2, Sparkles, Award, ArrowRight, X } from 'lucide-react';

interface SongRevealedBannerProps {
  isOpen: boolean;
  songTitle: string;
  artistOrComposer: string;
  category?: string;
  year?: string;
  teamName?: string;
  teamColor?: string;
  points?: number;
  durationSeconds?: number; // 5s for Stage 1-3, 2s for Stage 4
  onClose: () => void;
}

export const SongRevealedBanner: React.FC<SongRevealedBannerProps> = ({
  isOpen,
  songTitle,
  artistOrComposer,
  category,
  year,
  teamName,
  teamColor = '#F59E0B',
  points,
  durationSeconds = 5,
  onClose
}) => {
  const [countdown, setCountdown] = useState(durationSeconds);

  useEffect(() => {
    if (!isOpen) return;
    setCountdown(durationSeconds);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, durationSeconds, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="song-revealed-banner-modal"
      className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 sm:p-12 animate-in fade-in zoom-in-95 duration-200 select-none"
    >
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black tracking-widest uppercase text-emerald-400">
              Düzgün Cavab Qeydə Alındı!
            </span>
            <p className="text-[11px] text-slate-400">
              Mahnının rəsmi adı və ifaçısı
            </p>
          </div>
        </div>

        {/* Countdown Pill & Skip button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-700">
            <span className="text-[11px] text-slate-400 font-medium">Lövhə:</span>
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center animate-pulse">
              {countdown}s
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Dərhal davam et"
          >
            <span>Davam et</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Centerpiece Display */}
      <div className="flex flex-col items-center justify-center text-center my-auto max-w-4xl space-y-6 px-4">
        {/* Category & Year Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {category && (
            <span className="px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold uppercase tracking-wider">
              {category}
            </span>
          )}
          {year && (
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
              {year}
            </span>
          )}
        </div>

        {/* Music Icon Floating Badge */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-amber-500/20 border-2 border-emerald-400/50 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
          <Music className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 animate-pulse" />
        </div>

        {/* Huge Song Title */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
            Mahnının Adı:
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-tight drop-shadow-2xl">
            {songTitle}
          </h1>
          <p className="text-lg sm:text-2xl font-semibold text-emerald-300 font-sans mt-2">
            {artistOrComposer}
          </p>
        </div>

        {/* Awarded Team & Points Banner */}
        {teamName && (
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border shadow-xl mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{
              backgroundColor: `${teamColor}15`,
              borderColor: `${teamColor}60`
            }}
          >
            <div
              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: teamColor }}
            />
            <span className="text-sm font-bold text-white">
              Xalı Qazandı: <strong style={{ color: teamColor }}>{teamName}</strong>
            </span>
            {points !== undefined && points > 0 && (
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                +{points} Xal
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full max-w-xl flex flex-col items-center gap-2">
        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${(countdown / durationSeconds) * 100}%` }}
          />
        </div>
        <span className="text-[11px] text-slate-500">
          {countdown} saniyə sonra növbəti mərhələyə qayıdır
        </span>
      </div>
    </div>
  );
};
