import React from 'react';
import { Sparkles } from 'lucide-react';
import heroWatermarkBg from '../assets/images/hero_luxury_watermark_1790528874690.jpg';

interface HeroBannerProps {
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-[#3d0610] text-white py-10 sm:py-16 border-b border-[#2b040a]">
      
      {/* Luxury Watermark (জলছাপ) Background Image & Royal Floral Motifs */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src={heroWatermarkBg}
          alt="Alfeena Luxury Three Piece Watermark"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-45 sm:opacity-50 scale-105 filter contrast-110 brightness-95"
        />
        {/* Soft translucent wine/crimson scrim so the watermark image remains clearly visible while text stays crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3a050e]/70 via-[#450813]/50 to-[#36050e]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(69,8,19,0.25)_0%,rgba(40,4,10,0.78)_100%)]" />

        {/* Subtle Central Royal Mandala Watermark Seal behind the text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.12]">
          <svg
            viewBox="0 0 200 200"
            className="w-72 h-72 sm:w-96 sm:h-96 text-amber-300 animate-[spin_90s_linear_infinite]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
            <circle cx="100" cy="100" r="42" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M100 8 C112 45, 155 45, 192 100 C155 155, 112 155, 100 192 C88 155, 45 155, 8 100 C45 45, 88 45, 100 8 Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M35 35 C72 60, 128 60, 165 35 C140 72, 140 128, 165 165 C128 140, 72 140, 35 165 C60 128, 60 72, 35 35 Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-4 sm:space-y-5">
        
        {/* Luxury Pill Tag Badge matching screenshot */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a040b]/80 border border-amber-500/60 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>লাক্সারি ঈদ ও সামার কালেকশন ২০২৬</span>
        </div>

        {/* Main Luxury Heading matching screenshot */}
        <div className="space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-serif-luxury leading-tight">
            আভিজাত্য ও আস্থার প্রতীক
          </h2>
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#fbbf24] font-serif-luxury leading-tight drop-shadow-sm">
            আলফিনা এক্সক্লুসিভ থ্রি পিস
          </h3>
        </div>

        {/* Paragraph Text matching screenshot */}
        <p className="text-stone-100 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed text-balance">
          প্রতিটি সুতোয় ফুটিয়ে তোলা হয়েছে ঐতিহ্যবাহী নকশা ও আধুনিক লাক্সারি ফ্যাশন। ১০০% প্রিমিয়াম ফেব্রিক ও আকর্ষণীয় কালার কম্বিনেশনে তৈরি আমাদের প্রতিটি থ্রি পিস।
        </p>

      </div>

    </section>
  );
};
