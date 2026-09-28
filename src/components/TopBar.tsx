import React from 'react';
import { Monitor, Smartphone, ShoppingBag, Sparkles } from 'lucide-react';

export type DeviceViewMode = 'desktop' | 'mobile';

interface TopBarProps {
  cartCount: number;
  onOpenCart: () => void;
  viewMode?: DeviceViewMode;
  onViewModeChange?: (mode: DeviceViewMode) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  cartCount,
  onOpenCart,
  viewMode = 'desktop',
  onViewModeChange,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-[#14100d] via-[#221a14] to-[#14100d] text-stone-200 px-3 sm:px-6 h-[48px] flex items-center border-b border-amber-500/30 shadow-md w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 w-full">
        
        {/* Left: ALFEENA luxury eye-catching typography without box border */}
        <div className="relative flex items-center gap-1.5 sm:gap-2 select-none py-1 group cursor-pointer">
          {/* Soft warm luminous ambient backlight */}
          <div className="absolute -inset-x-3 -inset-y-1 bg-gradient-to-r from-rose-600/25 via-amber-500/20 to-rose-600/25 blur-sm rounded-full pointer-events-none -z-10" />
          
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse shrink-0" />

          <span className="font-cinzel-decorative font-black tracking-[0.24em] sm:tracking-[0.28em] bg-gradient-to-r from-[#FF2E2E] via-[#FF5C5C] to-[#E00000] bg-clip-text text-transparent text-lg sm:text-xl md:text-2xl uppercase leading-none drop-shadow-[0_2px_10px_rgba(255,46,46,0.5)] transition-transform duration-300 group-hover:scale-105">
            ALFEENA
          </span>

          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse shrink-0" />
        </div>

        {/* Right: Device & Bag Actions matching screenshot */}
        <div className="flex items-center gap-2">
          
          {/* Device Toggles */}
          <div className="flex items-center bg-[#292019] p-1 rounded-xl border border-amber-600/30 gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => onViewModeChange?.('desktop')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                viewMode === 'desktop'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-400 hover:text-amber-200 hover:bg-stone-800/60'
              }`}
              title="ডেস্কটপ ভিউ (কম্পিউটার/টিভি স্ক্রিন)"
              aria-label="ডেস্কটপ ভিউ"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange?.('mobile')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-400 hover:text-amber-200 hover:bg-stone-800/60'
              }`}
              title="মোবাইল ভিউ (স্মার্টফোন স্ক্রিন)"
              aria-label="মোবাইল ভিউ"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cart Bag Icon Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative w-8 h-8 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer border border-amber-300/40"
            title="শপিং ব্যাগ"
          >
            <ShoppingBag className="w-4 h-4 text-stone-950" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
