import React from 'react';
import { PhoneCall, MapPin, Sparkles, ShieldCheck, Truck, RefreshCw, MessageCircle } from 'lucide-react';
import { BrandingConfig } from '../types';

interface FooterProps {
  branding: BrandingConfig;
  onOpenTracking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ branding, onOpenTracking }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-amber-950 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top 4 Value pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-stone-800 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-amber-100">ক্যাশ অন ডেলিভারি</h5>
              <p className="text-[11px] text-stone-400">সারা দেশে ঘরে বসে মূল্য দিন</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-emerald-100">১০০% আসল ফেব্রিক</h5>
              <p className="text-[11px] text-stone-400">পিওর সুতি লন ও জর্জেট গ্যারান্টি</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-amber-100">সহজ রিটার্ন পলিসি</h5>
              <p className="text-[11px] text-stone-400">চেক করে অপছন্দে সরাসরি ফেরত</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-teal-100">ঈদ ও উৎসব কালেকশন</h5>
              <p className="text-[11px] text-stone-400">এক্সক্লুসিভ লাক্সারি ডিজাইন</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs sm:text-sm">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#853609] border-2 border-amber-400 text-amber-200 font-serif-luxury text-xl font-bold flex items-center justify-center shadow-md">
                আ
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-serif-luxury">{branding.storeName}</h4>
                <p className="text-xs text-amber-400 font-medium">{branding.tagline}</p>
              </div>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              আমরা নারীদের রুচিশীল ব্যক্তিত্বের সাথে মানানসই প্রিমিয়াম মানের পাকিস্তানি লন, সুইস কটন, লখনৌ চিকনকারি ও পার্টি জর্জেট থ্রি পিস সরবরাহ করে থাকি।
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-bold text-amber-200 uppercase tracking-wider text-xs">জরুরি লিংক</h5>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <button onClick={onOpenTracking} className="hover:text-amber-300 transition-colors cursor-pointer">
                  • লাইভ পার্সেল ট্র্যাকিং
                </button>
              </li>
              <li>• ডেলিভারি ও পেমেন্ট চার্জ (ঢাকা ৳৭০ / বাইরে ৳১৩০)</li>
              <li>• কাপড় ও ফেব্রিক যত্ন নির্দেশিকা</li>
              <li>• রিফান্ড ও রিটার্ন শর্তাবলী</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="font-bold text-amber-200 uppercase tracking-wider text-xs">কাস্টমার কেয়ার হেল্পলাইন</h5>
            <div className="space-y-2 text-xs text-stone-400">
              <a
                href={`tel:${branding.helplinePhone}`}
                className="flex items-center gap-2 text-amber-300 hover:text-amber-200 font-bold text-sm"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>{branding.helplineDisplay}</span>
              </a>
              <p className="text-stone-400 text-xs">সকাল ৯:০০ টা - রাত ১১:০০ টা (প্রতিদিন খোলা)</p>
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`https://wa.me/${branding.whatsappNumber.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>হোয়াটসঅ্যাপ সাপোর্ট</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <p>© ২০২৬ {branding.storeName}। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-amber-300/80">সারা দেশে দ্রুততম ক্যাশ অন ডেলিভারি সার্ভিস</p>
        </div>

      </div>
    </footer>
  );
};
