import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onViewProduct: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onViewProduct,
}) => {
  if (!isOpen) return null;

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200">
          
          {/* Top Drawer Header */}
          <div className="p-4 sm:p-5 bg-[#853609] text-white flex items-center justify-between border-b border-[#6e2b07]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-amber-100 font-serif-luxury leading-tight">
                  আপনার শপিং ব্যাগ
                </h3>
                <p className="text-xs text-amber-200/80 font-medium">
                  {totalQuantity > 0 ? `${totalQuantity} টি পণ্য যোগ করা হয়েছে` : 'ব্যাগটি বর্তমানে খালি'}
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

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-800 text-base">আপনার ব্যাগটি খালি</h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    আমাদের কালেকশন থেকে আপনার পছন্দের প্রিমিয়াম থ্রি পিস ব্যাগে যুক্ত করুন।
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors shadow-sm cursor-pointer"
                >
                  কালেকশন ব্রাউজ করুন
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-3 sm:gap-4 items-center">
                  
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    onClick={() => {
                      onViewProduct(item.product.id);
                      onClose();
                    }}
                    className="w-18 h-22 sm:w-20 sm:h-24 rounded-xl object-cover border border-stone-200 cursor-pointer shrink-0 hover:opacity-90"
                  />

                  {/* Info & Quantity controls */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          #{item.product.code}
                        </span>
                        <h4
                          onClick={() => {
                            onViewProduct(item.product.id);
                            onClose();
                          }}
                          className="font-bold text-stone-900 text-xs sm:text-sm line-clamp-1 hover:text-emerald-800 cursor-pointer mt-0.5"
                        >
                          {item.product.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="পণ্যটি মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="p-1.5 text-stone-600 hover:bg-stone-200 active:scale-95 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-stone-900 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1.5 text-stone-600 hover:bg-stone-200 active:scale-95 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total Price for this item */}
                      <span className="font-bold text-[#853609] text-sm sm:text-base font-serif-luxury">
                        ৳{(item.product.price * item.quantity).toLocaleString('bn-BD')}
                      </span>
                    </div>

                  </div>

                </div>
              ))
            )}
          </div>

          {/* Bottom Summary & Cash on Delivery Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-3">
              
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-stone-600">
                  <span>মোট পণ্যের মূল্য (Subtotal):</span>
                  <span className="font-bold text-[#853609] font-serif-luxury text-base">
                    ৳{subtotal.toLocaleString('bn-BD')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-500 text-xs">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="text-[#853609] font-medium">চেকআউটে এলাকা নির্বাচন অনুযায়ী</span>
                </div>
              </div>

              {/* Free return and COD badge */}
              <div className="flex items-center gap-1.5 text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-stone-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>সারা দেশে ক্যাশ অন ডেলিভারি ও প্যাকেট খুলে দেখে নেওয়ার সুযোগ</span>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-checkout-btn"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#853609] hover:bg-[#6e2b07] text-white font-bold text-sm sm:text-base shadow-md border border-[#a8440b] flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 cursor-pointer"
              >
                <span>অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};
