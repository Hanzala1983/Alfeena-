import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  Sparkles,
  PhoneCall,
  Share2,
  Check,
  Maximize2,
} from 'lucide-react';
import { Product } from '../types';

interface ProductGalleryModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onDirectOrder: (product: Product) => void;
  helplinePhone: string;
}

export const ProductGalleryModal: React.FC<ProductGalleryModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectOrder,
  helplinePhone,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);

  // Direct device back button navigation support (history pushState & popstate listener)
  useEffect(() => {
    if (!product) return;
    setActiveImageIndex(0);
    setIsZoomed(false);

    // Push modal state to browser history
    window.history.pushState({ modalOpen: true, productId: product.id }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  // Magnifier mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // Double tap / click to toggle zoom
  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `${product.title} - ৳${product.price} | আলফিনা এক্সক্লুসিভ থ্রি পিস`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAdd = () => {
    onAddToCart(product);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-5xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[100vh] sm:max-h-[92vh] flex flex-col md:flex-row border border-stone-200">
        
        {/* Top bar on Mobile for Close & Share */}
        <div className="md:hidden flex items-center justify-between p-3 bg-stone-900 text-white border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-bold text-xs font-mono">
              #{product.code}
            </span>
            <span className="text-xs text-stone-300">ছবি {activeImageIndex + 1}/{images.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-stone-800 text-stone-200 hover:text-white"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-800 text-stone-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LEFT COLUMN: Multi-Image Viewer & Gallery (Swipeable + Serial Badges #1, #2, #3...) */}
        <div className="w-full md:w-1/2 bg-stone-950 flex flex-col justify-between relative select-none">
          
          {/* Main Large Image Display with Magnifier Zoom */}
          <div
            className="relative w-full aspect-[3/4] sm:aspect-auto sm:h-[480px] md:h-full max-h-[550px] bg-stone-900 overflow-hidden flex items-center justify-center cursor-crosshair group"
            onMouseMove={handleMouseMove}
            onDoubleClick={toggleZoom}
          >
            <img
              src={images[activeImageIndex]}
              alt={`${product.title} - ভিউ #${activeImageIndex + 1}`}
              className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                isZoomed ? 'scale-225 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
            />

            {/* Desktop Close Button */}
            <button
              onClick={onClose}
              className="hidden md:flex absolute top-4 left-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all cursor-pointer z-20"
              title="বন্ধ করুন (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Serial Badge Top Right */}
            <div className="hidden md:flex absolute top-4 right-4 items-center gap-2 z-20">
              <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-stone-950 font-bold text-xs font-mono shadow-md">
                #{product.code}
              </span>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
                title="শেয়ার করুন"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Left / Right Carousel Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer z-20"
                  title="পূর্ববর্তী ছবি"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer z-20"
                  title="পরবর্তী ছবি"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Zoom Tooltip / Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white text-xs font-medium backdrop-blur-md flex items-center gap-1.5 transition-colors z-20 cursor-pointer"
            >
              {isZoomed ? (
                <>
                  <ZoomOut className="w-3.5 h-3.5 text-amber-300" />
                  <span>জুম আউট</span>
                </>
              ) : (
                <>
                  <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
                  <span>জুম করুন (ডাবল ট্যাপ)</span>
                </>
              )}
            </button>

          </div>

          {/* Bottom Thumbnails Strip with Serial Number Badges (#1, #2, #3...) */}
          <div className="p-3 bg-stone-900 border-t border-stone-800 flex items-center justify-center gap-2.5 overflow-x-auto no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImageIndex(idx);
                  setIsZoomed(false);
                }}
                className={`relative w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                    : 'border-stone-700 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`থাম্বনেইল #${idx + 1}`} className="w-full h-full object-cover" />
                {/* Serial Badge Overlay (#1, #2, #3...) */}
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-amber-300 font-mono text-[9px] font-bold">
                  #{idx + 1}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Product Details & Fast Action Bar */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[500px] md:max-h-[620px] bg-white">
          
          <div className="space-y-4">
            
            {/* Header info & Price */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300/60">
                  {product.category === 'cotton-lawn' ? 'প্রিমিয়াম সুতি লন' : 'লাক্সারি কালেকশন'}
                </span>
                <span className="text-xs font-mono font-bold text-stone-500">
                  কোড: #{product.code}
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-bold text-stone-900 font-serif-luxury leading-snug">
                {product.title}
              </h2>

              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#853609] font-serif-luxury">
                  ৳{product.price.toLocaleString('bn-BD')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base text-stone-400 line-through">
                    ৳{product.originalPrice.toLocaleString('bn-BD')}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-xs font-bold">
                  {product.discountPercentage || 25}% ছাড়
                </span>
              </div>
            </div>

            {/* Fabric & Boutique Specs Box */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2.5 text-xs sm:text-sm">
              <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>ফেব্রিক ও কারুকাজের বিবরণ</span>
              </h4>

              <div className="grid grid-cols-1 gap-2 text-stone-800">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-stone-900 min-w-[70px]">কামিজ:</span>
                  <span className="text-stone-700">{product.fabric.kamiz}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-stone-900 min-w-[70px]">ওড়না:</span>
                  <span className="text-stone-700">{product.fabric.dupatta}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-stone-900 min-w-[70px]">সেলোয়ার:</span>
                  <span className="text-stone-700">{product.fabric.salwar}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-stone-900 min-w-[70px]">কাজ:</span>
                  <span className="text-stone-700">{product.fabric.work}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Trust Assurance List */}
            <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs text-stone-700 pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>১০০% আসল কাপড় ও রঙ পাকা</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি</span>
              </div>
            </div>

          </div>

          {/* Action Buttons Section */}
          <div className="pt-5 border-t border-stone-200 mt-5 space-y-2.5">
            
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Add to Bag */}
              <button
                id="modal-add-to-bag"
                onClick={handleAdd}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border ${
                  isAddedFeedback
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-900 border-stone-300 active:scale-95'
                }`}
              >
                {isAddedFeedback ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>ব্যাগে যুক্ত হয়েছে</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-emerald-800" />
                    <span>ব্যাগে রাখুন</span>
                  </>
                )}
              </button>

              {/* Order Now (Direct COD) */}
              <button
                id="modal-direct-order"
                onClick={() => {
                  onDirectOrder(product);
                  onClose();
                }}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#853609] hover:bg-[#6e2b07] text-white shadow-md flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer border border-[#a8440b]"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>সরাসরি অর্ডার করুন</span>
              </button>

            </div>

            {/* Helpline Call CTA */}
            <div className="text-center">
              <a
                href={`tel:${helplinePhone}`}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-800 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                <span>পণ্য সম্পর্কে আরও জানতে কল করুন: <span className="font-semibold text-stone-800">{helplinePhone}</span></span>
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
