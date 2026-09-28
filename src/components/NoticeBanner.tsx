import React from 'react';
import { Sparkles, Truck, ShieldCheck, PhoneCall } from 'lucide-react';
import { BrandingConfig } from '../types';

interface NoticeBannerProps {
  branding: BrandingConfig;
  onOpenTracking: () => void;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ branding }) => {
  return (
    <div className="bg-[#7a2e05] text-amber-100 border-b border-[#5e2203] text-xs sm:text-sm py-2 px-3 sm:px-6 shadow-xs text-center">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 font-medium tracking-wide">
        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
        <span className="text-white font-medium text-center">{branding.noticeBannerText}</span>
      </div>
    </div>
  );
};
