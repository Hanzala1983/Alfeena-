import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Phone,
  PhoneCall,
  User,
  ShoppingBag,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { searchOrderByQuery } from '../lib/firebase';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  helplinePhone: string;
  helplineDisplay: string;
}

const STAGES: {
  status: OrderStatus;
  title: string;
  bnTitle: string;
  desc: string;
}[] = [
  {
    status: 'placed',
    title: 'Placed',
    bnTitle: '১. অর্ডার গ্রহণ',
    desc: 'গ্রাহক দ্বারা অর্ডার সফলভাবে প্লেস হয়েছে',
  },
  {
    status: 'confirmed',
    title: 'Confirmed',
    bnTitle: '২. কনফার্মড',
    desc: 'কাস্টমার কেয়ার দ্বারা ভেরিফাই ও কনফার্মড',
  },
  {
    status: 'packed',
    title: 'Packed',
    bnTitle: '৩. প্যাকেজিং',
    desc: 'গুণগত মান যাচাই করে ওয়াটারপ্রুফ ব্যাগে প্যাকড',
  },
  {
    status: 'in_transit',
    title: 'In Transit',
    bnTitle: '৪. ট্রানজিট',
    desc: 'কুরিয়ার হাব থেকে আপনার শহরের পথে রওয়ানা',
  },
  {
    status: 'out_for_delivery',
    title: 'Out for Delivery',
    bnTitle: '৫. ডেলিভারির পথে',
    desc: 'ডেলিভারি রাইডার আপনার ঠিকানায় রওয়ানা দিয়েছে',
  },
  {
    status: 'delivered',
    title: 'Delivered',
    bnTitle: '৬. ডেলিভার্ড',
    desc: 'সফলভাবে ক্যাশ অন ডেলিভারি সম্পন্ন হয়েছে',
  },
];

export const TrackingModal: React.FC<TrackingModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  helplinePhone,
  helplineDisplay,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setSearchQuery(initialQuery);
        executeSearch(initialQuery);
      } else {
        setSearchQuery('');
        setSearchedOrder(null);
        setHasSearched(false);
        setErrorText('');
      }
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const executeSearch = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) {
      setErrorText('অনুগ্রহ করে অর্ডার আইডি, কুরিয়ার কোড বা মোবাইল নম্বর দিন।');
      return;
    }

    setErrorText('');
    setIsLoading(true);
    setHasSearched(true);

    try {
      const result = await searchOrderByQuery(q);
      setSearchedOrder(result);
    } catch (err) {
      console.error('Tracking search error:', err);
      setErrorText('ট্র্যাকিং তথ্য লোড করতে সাময়িক সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  // Helper to determine stage status: 'completed' | 'current' | 'upcoming'
  const getStageState = (orderStatus: OrderStatus, stageStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = [
      'placed',
      'confirmed',
      'packed',
      'in_transit',
      'out_for_delivery',
      'delivered',
    ];
    const currentIndex = statusOrder.indexOf(orderStatus);
    const stageIndex = statusOrder.indexOf(stageStatus);

    if (currentIndex > stageIndex) return 'completed';
    if (currentIndex === stageIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-auto border border-stone-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#853609] text-white flex items-center justify-between border-b border-[#6e2b07]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-amber-100 font-serif-luxury leading-tight">
                লাইভ পার্সেল ট্র্যাকিং
              </h3>
              <p className="text-xs text-amber-200/80 font-normal">
                আপনার অর্ডারের বর্তমান ডেলিভারি অগ্রগতি দেখুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          
          {/* Search Input Bar */}
          <form onSubmit={handleFormSubmit} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="অর্ডার আইডি (যেমন: ALF-81771), মোবাইল বা কুরিয়ার কোড..."
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#853609] focus:border-[#853609] text-xs sm:text-sm bg-stone-50/50 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-4 sm:px-6 py-2.5 rounded-xl bg-[#853609] hover:bg-[#6e2b07] text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer disabled:opacity-50 border border-[#a8440b]"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 text-amber-300" />
                    <span>ট্র্যাক করুন</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Demo Hint */}
            <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
              <span>গোপনীয়তা রক্ষা: কেবল আপনার নির্দিষ্ট অর্ডারের তথ্যই প্রদর্শিত হবে।</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('ALF-81771');
                  executeSearch('ALF-81771');
                }}
                className="text-emerald-700 hover:underline font-semibold"
              >
                ডেমো ট্র্যাকিং দেখুন (ALF-81771)
              </button>
            </div>
          </form>

          {/* Error notice */}
          {errorText && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {/* If Search Done and NOT Found */}
          {hasSearched && !isLoading && !searchedOrder && (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-700">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-800 text-sm sm:text-base">কোনো পার্সেল পাওয়া যায়নি</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                অনুগ্রহ করে আপনার সঠিক ১১ ডিজিটের মোবাইল নম্বর অথবা অর্ডার কনফার্মেশনের সময় পাওয়া অর্ডার আইডি দিয়ে পুনরায় চেষ্টা করুন।
              </p>
              <div className="pt-2">
                <a
                  href={`tel:${helplinePhone}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold hover:bg-emerald-200 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                  <span>হেল্পলাইনে যোগাযোগ করুন ({helplineDisplay})</span>
                </a>
              </div>
            </div>
          )}

          {/* If Search Found: Display 6-Stage Delivery Progress Timeline + Order Details */}
          {searchedOrder && (
            <div className="space-y-6">
              
              {/* Top Order Badge Card */}
              <div className="bg-gradient-to-br from-stone-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-amber-500/20">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-700/60 pb-3">
                  <div>
                    <span className="text-[11px] text-stone-400 font-medium">অর্ডার আইডি:</span>
                    <h3 className="text-lg sm:text-xl font-mono font-bold text-amber-300">
                      #{searchedOrder.id}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 font-medium">কুরিয়ার পার্টনার:</span>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-300">
                      {searchedOrder.courierPartner}
                    </p>
                    <span className="text-[11px] font-mono text-amber-200/90 block">
                      ট্র্যাকিং: {searchedOrder.courierTrackingCode}
                    </span>
                  </div>
                </div>

                {/* Recipient Snapshot */}
                <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{searchedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-mono">{searchedOrder.mobile}</span>
                  </div>
                  <div className="col-span-2 flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{searchedOrder.address}, {searchedOrder.district}</span>
                  </div>
                </div>
              </div>

              {/* 6-Stage Delivery Progress Timeline */}
              <div className="p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>৬-ধাপের ডেলিভারি অগ্রগতি ট্র্যাকার</span>
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300/60">
                    {STAGES.find((s) => s.status === searchedOrder.status)?.bnTitle || searchedOrder.status}
                  </span>
                </div>

                {/* Timeline list */}
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-300">
                  {STAGES.map((stage, idx) => {
                    const state = getStageState(searchedOrder.status, stage.status);

                    return (
                      <div key={stage.status} className="relative flex items-start gap-3 text-xs sm:text-sm">
                        {/* Step Marker */}
                        <div
                          className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                            state === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : state === 'current'
                              ? 'bg-amber-500 text-stone-950 ring-amber-200 animate-pulse'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          {state === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-bold ${
                                state === 'current'
                                  ? 'text-amber-900 text-sm'
                                  : state === 'completed'
                                  ? 'text-emerald-950 font-semibold'
                                  : 'text-stone-400'
                              }`}
                            >
                              {stage.bnTitle}
                            </span>
                            {state === 'current' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 font-bold">
                                চলমান ধাপ
                              </span>
                            )}
                          </div>
                          <p className={`text-xs ${state === 'upcoming' ? 'text-stone-400' : 'text-stone-600'}`}>
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in this Order */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-emerald-800" />
                  <span>অর্ডারের পণ্যসমূহ ({searchedOrder.items.length})</span>
                </h4>

                <div className="divide-y divide-stone-100">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-10 h-12 rounded-lg object-cover border border-stone-200" />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 truncate">{item.title}</p>
                          <span className="text-stone-500 font-mono text-[11px]">#{item.code} × {item.quantity}</span>
                        </div>
                      </div>

                      <span className="font-bold font-serif-luxury text-emerald-900 text-sm shrink-0">
                        ৳{(item.price * item.quantity).toLocaleString('bn-BD')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total invoice summary */}
                <div className="border-t border-stone-200 pt-2.5 space-y-1 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>পণ্যের মূল্য:</span>
                    <span className="font-serif-luxury font-medium">৳{searchedOrder.subtotal.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ডেলিভারি চার্জ:</span>
                    <span className="font-serif-luxury font-medium">৳{searchedOrder.deliveryCharge.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 text-sm pt-1 border-t border-stone-100">
                    <span>সর্বমোট ক্যাশ অন ডেলিভারি মূল্য:</span>
                    <span className="font-serif-luxury text-emerald-900 text-base">
                      ৳{searchedOrder.totalAmount.toLocaleString('bn-BD')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Help & Support CTA */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="text-xs text-emerald-950">
                  <p className="font-bold">ডেলিভারি নিয়ে কোনো প্রশ্ন থাকলে?</p>
                  <p className="text-emerald-800 text-[11px]">আমাদের কাস্টমার রিলেশন প্রতিনিধি সার্বক্ষণিক প্রস্তুত রয়েছে।</p>
                </div>
                <a
                  href={`tel:${helplinePhone}`}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                  <span>কল করুন: {helplineDisplay}</span>
                </a>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
