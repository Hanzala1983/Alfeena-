import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  User,
  FileText,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, OrderItem } from '../types';
import { BD_DISTRICTS } from '../data/initialData';
import { createStorefrontOrder } from '../lib/firebase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  directProduct?: CartItem | null;
  onOrderSuccess: (order: Order) => void;
  onOpenTrackingWithCode: (trackingCodeOrId: string) => void;
  insideDhakaFee: number;
  outsideDhakaFee: number;
  helplinePhone: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  directProduct,
  onOrderSuccess,
  onOpenTrackingWithCode,
  insideDhakaFee = 70,
  outsideDhakaFee = 130,
  helplinePhone,
}) => {
  // Items to order (either direct single product or whole cart)
  const orderItemsList = directProduct ? [directProduct] : cartItems;

  const [customerName, setCustomerName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [district, setDistrict] = useState<string>('ঢাকা (Dhaka)');
  const [address, setAddress] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Confirmed Order State
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  if (!isOpen) return null;

  const isInsideDhaka = district.includes('ঢাকা') || district.toLowerCase().includes('dhaka');
  const deliveryCharge = isInsideDhaka ? insideDhakaFee : outsideDhakaFee;
  const subtotal = orderItemsList.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const grandTotal = subtotal + deliveryCharge;

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value);
  };

  const validatePhone = (phone: string): boolean => {
    const clean = phone.replace(/\D/g, '');
    return clean.length === 11 && (clean.startsWith('013') || clean.startsWith('014') || clean.startsWith('015') || clean.startsWith('016') || clean.startsWith('017') || clean.startsWith('018') || clean.startsWith('019'));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }

    const cleanPhone = mobile.trim();
    if (!validatePhone(cleanPhone)) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 018XXXXXXXX)।');
      return;
    }

    if (!address.trim() || address.trim().length < 6) {
      setErrorMessage('অনুগ্রহ করে বিস্তারিত ডেলিভারি ঠিকানা লিখুন (রোড, বাড়ি/ফ্ল্যাট নম্বর, এলাকা)।');
      return;
    }

    if (orderItemsList.length === 0) {
      setErrorMessage('আপনার শপিং ব্যাগে কোনো পণ্য নেই!');
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedItems: OrderItem[] = orderItemsList.map((item) => ({
        productId: item.product.id,
        code: item.product.code,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
      }));

      const newOrder = await createStorefrontOrder({
        customerName: customerName.trim(),
        mobile: cleanPhone,
        district,
        isInsideDhaka,
        address: address.trim(),
        note: note.trim() || undefined,
        items: formattedItems,
        subtotal,
        deliveryCharge,
        totalAmount: grandTotal,
        paymentMethod: 'cash_on_delivery',
      });

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#fbbf24', '#047857'],
        });
      } catch (e) {
        // ignore
      }

      setConfirmedOrder(newOrder);
      onOrderSuccess(newOrder);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage('অর্ডার প্লেস করতে সাময়িক সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleResetAndClose = () => {
    setConfirmedOrder(null);
    setCustomerName('');
    setMobile('');
    setAddress('');
    setNote('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      
      <div className="fixed inset-0" onClick={confirmedOrder ? handleResetAndClose : onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-auto border border-stone-200">
        
        {/* If Order is Confirmed Successfully */}
        {confirmedOrder ? (
          <div className="p-5 sm:p-8 space-y-6 text-center">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center mx-auto text-emerald-600 shadow-md">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-luxury">
                ধন্যবাদ, {confirmedOrder.customerName}!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                আপনার ক্যাশ অন ডেলিভারি অর্ডারটি আমাদের সিস্টেমে সংরক্ষিত হয়েছে। আমাদের কাস্টমার কেয়ার টিম দ্রুত আপনাকে কল করে পার্সেলটি পাঠিয়ে দেবে।
              </p>
            </div>

            {/* Order Info Card with copy button */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <div>
                  <span className="text-[11px] text-stone-500 block font-medium">অর্ডার আইডি (Order ID)</span>
                  <span className="text-base sm:text-lg font-mono font-bold text-emerald-800">
                    #{confirmedOrder.id}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(confirmedOrder.id)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium transition-colors cursor-pointer"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                  <span>{copiedId ? 'কপি হয়েছে' : 'আইডি কপি করুন'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
                <div>
                  <span className="text-stone-400 block text-[10px]">কুরিয়ার ট্র্যাকিং কোড</span>
                  <span className="font-mono font-bold text-amber-900">{confirmedOrder.courierTrackingCode}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">মোট প্রদেয় মূল্য (ক্যাশ অন ডেলিভারি)</span>
                  <span className="font-bold text-emerald-800 text-sm">৳{confirmedOrder.totalAmount.toLocaleString('bn-BD')}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">ডেলিভারি ঠিকানা</span>
                  <span className="font-medium line-clamp-1">{confirmedOrder.address}, {confirmedOrder.district}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">মোবাইল নম্বর</span>
                  <span className="font-mono font-medium">{confirmedOrder.mobile}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  handleResetAndClose();
                  onOpenTrackingWithCode(confirmedOrder.id);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#853609] hover:bg-[#6e2b07] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all border border-[#a8440b]"
              >
                <Truck className="w-4 h-4 text-amber-300" />
                <span>পার্সেল লাইভ ট্র্যাক করুন</span>
              </button>

              <button
                onClick={handleResetAndClose}
                className="py-3 px-5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-colors cursor-pointer"
              >
                কেনাকাটা চালিয়ে যান
              </button>
            </div>

          </div>
        ) : (
          /* Checkout Form */
          <div>
            
            {/* Header */}
            <div className="p-4 sm:p-5 bg-[#853609] text-white flex items-center justify-between border-b border-[#6e2b07]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-amber-100 font-serif-luxury leading-tight">
                    ক্যাশ অন ডেলিভারি দ্রুত চেকআউট
                  </h3>
                  <p className="text-xs text-amber-200/80 font-normal">
                    সারা দেশে কোনো অগ্রিম পেমেন্ট ছাড়াই অর্ডার করুন
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

            {/* Content Form */}
            <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Order Summary Mini Box */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#853609]" />
                    <span>অর্ডারের পণ্যসমূহ ({orderItemsList.length} আইটেম)</span>
                  </span>
                  <span className="font-serif-luxury text-[#853609] text-sm">
                    সাবটোটাল: ৳{subtotal.toLocaleString('bn-BD')}
                  </span>
                </div>

                <div className="max-h-24 overflow-y-auto space-y-1.5 no-scrollbar text-xs text-stone-600">
                  {orderItemsList.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between gap-2">
                      <span className="truncate">
                        • {item.product.title} <span className="font-bold text-stone-900">× {item.quantity}</span>
                      </span>
                      <span className="font-mono text-stone-900 font-medium shrink-0">
                        ৳{(item.product.price * item.quantity).toLocaleString('bn-BD')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Customer Inputs */}
              <div className="space-y-3 text-xs sm:text-sm">
                
                {/* Name */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#853609]" />
                    <span>আপনার নাম <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="যেমন: নুসরাত জাহান"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#853609] focus:border-[#853609] bg-stone-50/50"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#853609]" />
                    <span>মোবাইল নম্বর <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="যেমন: 01812345678 (১১ ডিজিট)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#853609] focus:border-[#853609] bg-stone-50/50 font-mono"
                  />
                </div>

                {/* District Dropdown */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#853609]" />
                      <span>জেলা নির্বাচন করুন <span className="text-rose-500">*</span></span>
                    </span>
                    <span className="text-[11px] font-semibold text-[#853609]">
                      {isInsideDhaka ? `ঢাকার ভেতর চার্জ: ৳${insideDhakaFee}` : `ঢাকার বাইরে চার্জ: ৳${outsideDhakaFee}`}
                    </span>
                  </label>
                  <select
                    value={district}
                    onChange={handleDistrictChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#853609] focus:border-[#853609] bg-white"
                  >
                    {BD_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist} {dist.includes('ঢাকা') ? `(চার্জ ৳${insideDhakaFee})` : `(চার্জ ৳${outsideDhakaFee})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Full Address */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#853609]" />
                    <span>সম্পূর্ণ ডেলিভারি ঠিকানা <span className="text-rose-500">*</span></span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="বাড়ি নং, রোড নং/নাম, এলাকা, থানা/উপজেলা..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#853609] focus:border-[#853609] bg-stone-50/50 resize-none"
                  />
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block font-medium text-stone-600 mb-1 flex items-center gap-1.5 text-xs">
                    <FileText className="w-3.5 h-3.5 text-stone-400" />
                    <span>বিশেষ নির্দেশনা বা ডেলিভারি নোট (ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#853609] bg-stone-50/50 text-xs"
                  />
                </div>

              </div>

              {/* Price Calculation Card */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-stone-700">
                  <span>পণ্যের মোট মূল্য:</span>
                  <span className="font-serif-luxury font-bold">৳{subtotal.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span>হোম ডেলিভারি ফি ({isInsideDhaka ? 'ঢাকার ভেতর' : 'ঢাকার বাইরে'}):</span>
                  <span className="font-serif-luxury font-bold">৳{deliveryCharge.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex items-center justify-between text-stone-950 font-bold border-t border-amber-300/80 pt-2 text-sm sm:text-base">
                  <span>সর্বমোট প্রদেয় মূল্য (ক্যাশ অন ডেলিভারি):</span>
                  <span className="text-[#853609] font-serif-luxury text-lg font-bold">
                    ৳{grandTotal.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>অগ্রিম কোনো টাকা দিতে হবে না। পার্সেল হাতে পেয়ে ডেলিভারিম্যানকে টাকা দিন।</span>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                id="submit-order-button"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#853609] hover:bg-[#6e2b07] text-white font-bold text-sm sm:text-base shadow-md border border-[#a8440b] flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>অর্ডার প্রক্রিয়াকরণ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>অর্ডার কনফার্ম করুন (৳{grandTotal.toLocaleString('bn-BD')})</span>
                  </>
                )}
              </button>

            </form>

          </div>
        )}

      </div>

    </div>
  );
};
