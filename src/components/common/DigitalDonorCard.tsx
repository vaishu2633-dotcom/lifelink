import React, { useRef, useState } from 'react';
import { Donor } from '../../types';
import { Heart, ShieldCheck, Download, Printer, QrCode, Award, Share2, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DigitalDonorCardProps {
  donor: Donor;
}

export const DigitalDonorCard: React.FC<DigitalDonorCardProps> = ({ donor }) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    setDownloading(true);
    // Fire festive lifesaver confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B71C1C', '#E53935', '#FFFFFF', '#FFD700']
    });

    // Simple print/export trigger
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 400);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `I am a verified blood donor on LIFE LINK! Blood Group: ${donor.blood_group} | Donor ID: ${donor.digital_card_id}. Every Drop Connects a Life.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* The Printable Digital Donor Card */}
      <div
        ref={cardRef}
        id="digital-donor-card"
        className="relative w-full max-w-md bg-gradient-to-br from-[#8E0E00] via-[#B71C1C] to-[#1F1C18] text-white rounded-3xl p-6 shadow-2xl overflow-hidden border border-red-800/40"
      >
        {/* Holographic glowing background effect */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-red-500/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Heart className="w-5 h-5 fill-white text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest font-extrabold uppercase text-red-200">
                Official Digital Credential
              </span>
              <h4 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                LIFE LINK
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white">DONOR</span>
              </h4>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-red-200 font-semibold">Card ID</span>
            <span className="font-mono text-xs font-bold text-amber-300 bg-black/30 px-2 py-0.5 rounded border border-white/10">
              {donor.digital_card_id}
            </span>
          </div>
        </div>

        {/* Card Middle: Blood Group Banner & Name */}
        <div className="relative z-10 my-6 flex items-center justify-between bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-red-200 font-semibold">
              <span>{donor.city}, {donor.area}</span>
              {donor.is_verified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
            <h3 className="text-xl font-black text-white mt-0.5 capitalize">
              {donor.full_name}
            </h3>
            <p className="text-xs text-white/70 mt-0.5 font-mono">
              Age: {donor.age} yrs • Verified Donor
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#E53935] to-[#B71C1C] w-16 h-16 rounded-2xl shadow-lg border-2 border-white/30">
            <span className="text-[9px] font-black uppercase text-white/80 tracking-tight">BLOOD</span>
            <span className="text-2xl font-black text-white leading-none tracking-tight">
              {donor.blood_group}
            </span>
          </div>
        </div>

        {/* Card Bottom: Stats, Milestones & QR */}
        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-red-200 block">Total Donations</span>
              <span className="text-sm font-bold text-white flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-300" /> {donor.total_donations} Times
              </span>
            </div>
            <div>
              <span className="text-[10px] text-red-200 block">Impact Score</span>
              <span className="text-sm font-bold text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> {donor.impact_score} Pts
              </span>
            </div>
          </div>

          {/* QR Code representation */}
          <div className="bg-white p-1.5 rounded-xl shadow-sm text-gray-900 flex flex-col items-center justify-center">
            <QrCode className="w-8 h-8 text-gray-900" />
            <span className="text-[7px] font-bold text-gray-600 tracking-tighter">VERIFIED</span>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/60">
          <span>"Every Drop Connects a Life."</span>
          <span className="font-semibold text-emerald-300">
            {donor.is_available ? '● Available for Calls' : '○ Cooldown Period'}
          </span>
        </div>
      </div>

      {/* Action Buttons for Card */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#B71C1C] hover:bg-[#8E0E00] text-white shadow-md transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Preparing...' : 'Download Card / Print'}</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm transition-all active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-gray-600" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Share Credential'}</span>
        </button>
      </div>
    </div>
  );
};
