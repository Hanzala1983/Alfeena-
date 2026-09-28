import React from 'react';
import { Truck } from 'lucide-react';
import { BrandingConfig } from '../types';

interface HeaderProps {
  branding: BrandingConfig;
  cartCount?: number;
  cartTotal?: number;
  onOpenCart?: () => void;
  onOpenTracking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  branding,
  onOpenTracking,
}) => {
  return (
    <header className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF4EA] to-[#FFFDF9] border-b border-amber-200/90 shadow-[0_4px_25px_-5px_rgba(180,120,40,0.08)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Left: Brand Logo + Brand Name in a single line + Tagline */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          {/* Circular Boutique Seal Logo */}
          <div className="relative shrink-0 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-amber-600/80 shadow-xs ring-1 ring-amber-700/20 p-0.5">
            <div className="w-full h-full rounded-full border border-dashed border-amber-700/50 flex flex-col items-center justify-center bg-white overflow-hidden text-center">
              <span className="text-[9px] font-bold text-amber-900 leading-none tracking-tighter">👗</span>
              <span className="font-serif-luxury text-[9px] sm:text-[10px] font-bold text-amber-900 tracking-tighter leading-none italic">
                Alfeena
              </span>
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-2xl font-bold text-stone-900 tracking-tight truncate font-serif-luxury">
                {branding.storeName}
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-[#853609] font-medium truncate">
              {branding.tagline}
            </p>
          </div>
        </div>

        {/* Right Section: Tracking Button with Icon on Top */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="header-tracking-btn"
            onClick={onOpenTracking}
            className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl bg-[#853609] hover:bg-[#6e2b07] text-amber-100 text-[11px] sm:text-xs font-bold flex flex-col items-center justify-center gap-0.5 shadow-sm transition-all hover:shadow-md active:scale-95 cursor-pointer border border-[#6e2b07]/40"
            title="ট্র্যাকিং - আপনার অর্ডারের বর্তমান অবস্থা জানুন"
          >
            <Truck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300" />
            <span className="tracking-wide leading-tight">ট্র্যাকিং</span>
          </button>
        </div>

      </div>
    </header>
  );
};
