import React from 'react';
import { Eye, ShoppingBag, Zap, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onDirectOrder: (product: Product) => void;
  isAddedToCart?: boolean;
  viewMode?: 'desktop' | 'mobile';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  onDirectOrder,
  isAddedToCart = false,
  viewMode = 'desktop',
}) => {
  const discountPercent = product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const isSingleColumn = viewMode === 'mobile';

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'}
          alt={product.title || 'থ্রি পিস'}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 sm:gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className={`${isSingleColumn ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[10px]'} sm:px-2.5 sm:py-1 rounded-md bg-rose-600 text-white font-bold sm:text-xs shadow-md tracking-wider`}>
              {discountPercent}% ছাড়
            </span>
          )}

          {product.isLimitedStock && (
            <span className={`${isSingleColumn ? 'px-2 py-0.5 text-[10px]' : 'px-1.5 py-0.5 text-[9px]'} sm:px-2 rounded-md bg-amber-500 text-stone-950 font-bold sm:text-[11px] shadow-xs flex items-center gap-1`}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              স্টক সীমিত
            </span>
          )}
        </div>

        {/* Top Right: Serial Code Badge */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10">
          <span className={`${isSingleColumn ? 'px-2 py-1 text-[10px]' : 'px-1.5 py-0.5 text-[9px]'} sm:px-2 sm:py-1 rounded-md bg-stone-900/80 backdrop-blur-xs text-amber-200 sm:text-xs font-mono font-bold tracking-tight border border-amber-400/30`}>
            #{product.code || 'ALF'}
          </span>
        </div>

        {/* Quick View Button on Image hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 inset-x-3 py-2 px-3 rounded-xl bg-white/95 backdrop-blur-md text-stone-900 text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 flex items-center justify-center gap-1.5 hover:bg-[#853609] hover:text-white cursor-pointer"
        >
          <Eye className="w-4 h-4 text-[#853609] group-hover:text-white" />
          <span>বিস্তারিত দেখুন</span>
        </button>

      </div>

      {/* Product Content Details */}
      <div className={`${isSingleColumn ? 'p-3.5 space-y-3' : 'p-2.5 space-y-2'} sm:p-4 flex-1 flex flex-col justify-between sm:space-y-3`}>
        
        <div>
          {/* Fabric mini tag */}
          <p className={`${isSingleColumn ? 'text-[11px] mb-1' : 'text-[10px] mb-0.5'} sm:text-[11px] font-semibold text-emerald-800 uppercase tracking-wider sm:mb-1 line-clamp-1`}>
            {product.fabric?.kamiz ? product.fabric.kamiz.split(',')[0] : 'প্রিমিয়াম থ্রি পিস'}
          </p>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className={`${isSingleColumn ? 'text-sm' : 'text-xs'} sm:text-base font-bold text-stone-900 hover:text-emerald-800 line-clamp-2 cursor-pointer transition-colors leading-snug`}
            title={product.title}
          >
            {product.title}
          </h3>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline justify-between gap-1.5 sm:gap-2 border-t border-stone-100 pt-2 sm:pt-2.5">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className={`${isSingleColumn ? 'text-lg' : 'text-base'} sm:text-xl font-bold text-[#853609] font-serif-luxury`}>
              ৳{(product.price || 0).toLocaleString('bn-BD')}
            </span>
            {product.originalPrice && product.price && product.originalPrice > product.price && (
              <span className={`${isSingleColumn ? 'text-xs' : 'text-[10px]'} sm:text-sm text-stone-400 line-through`}>
                ৳{product.originalPrice.toLocaleString('bn-BD')}
              </span>
            )}
          </div>

          <span className={`${isSingleColumn ? 'inline-block' : 'hidden sm:inline-block'} text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/60`}>
            ক্যাশ অন ডেলিভারি
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className={`grid grid-cols-2 ${isSingleColumn ? 'gap-2' : 'gap-1.5'} sm:gap-2 pt-1`}>
          
          {/* 1. ব্যাগে রাখুন (Add to Bag) */}
          <button
            id={`btn-add-bag-${product.id}`}
            onClick={() => onAddToCart(product)}
            className={`${isSingleColumn ? 'py-2.5 px-2 rounded-xl text-xs gap-1.5' : 'py-2 px-1.5 rounded-lg text-[11px] gap-1'} sm:py-2.5 sm:px-2 sm:rounded-xl sm:text-[13px] font-semibold flex items-center justify-center sm:gap-1.5 transition-all duration-200 cursor-pointer border ${
              isAddedToCart
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200/80 active:scale-95'
            }`}
            title="ব্যাগে যোগ করুন"
          >
            {isAddedToCart ? (
              <>
                <Check className={`${isSingleColumn ? 'w-3.5 h-3.5' : 'w-3 h-3'} sm:w-3.5 sm:h-3.5 text-emerald-700 shrink-0`} />
                {isSingleColumn ? (
                  <span className="whitespace-nowrap">ব্যাগে যুক্ত</span>
                ) : (
                  <>
                    <span className="hidden sm:inline whitespace-nowrap">ব্যাগে যুক্ত</span>
                    <span className="sm:hidden truncate">যুক্ত</span>
                  </>
                )}
              </>
            ) : (
              <>
                <ShoppingBag className={`${isSingleColumn ? 'w-3.5 h-3.5' : 'w-3 h-3'} sm:w-3.5 sm:h-3.5 text-stone-700 shrink-0`} />
                {isSingleColumn ? (
                  <span className="whitespace-nowrap">ব্যাগে রাখুন</span>
                ) : (
                  <>
                    <span className="hidden sm:inline whitespace-nowrap">ব্যাগে রাখুন</span>
                    <span className="sm:hidden truncate">ব্যাগে</span>
                  </>
                )}
              </>
            )}
          </button>

          {/* 2. সরাসরি অর্ডার করুন (Direct COD Order) */}
          <button
            id={`btn-order-now-${product.id}`}
            onClick={() => onDirectOrder(product)}
            className={`${isSingleColumn ? 'py-2.5 px-2 rounded-xl text-xs gap-1.5' : 'py-2 px-1.5 rounded-lg text-[11px] gap-1'} sm:py-2.5 sm:px-2 sm:rounded-xl sm:text-[13px] font-bold bg-[#853609] hover:bg-[#6e2b07] text-white shadow-xs hover:shadow-md flex items-center justify-center sm:gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer border border-[#6e2b07]`}
            title="সরাসরি ক্যাশ অন ডেলিভারি অর্ডার করুন"
          >
            <Zap className={`${isSingleColumn ? 'w-3.5 h-3.5' : 'w-3 h-3'} sm:w-3.5 sm:h-3.5 text-amber-300 fill-amber-300 shrink-0`} />
            {isSingleColumn ? (
              <span className="whitespace-nowrap">অর্ডার করুন</span>
            ) : (
              <>
                <span className="hidden sm:inline whitespace-nowrap">অর্ডার করুন</span>
                <span className="sm:hidden truncate">অর্ডার</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};
