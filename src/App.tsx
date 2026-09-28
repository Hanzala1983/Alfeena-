import React, { useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  doc,
} from 'firebase/firestore';
import { db, seedInitialFirestoreData } from './lib/firebase';
import { Product, Category, CartItem, BrandingConfig, Order } from './types';
import { INITIAL_BRANDING, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from './data/initialData';
import { NoticeBanner } from './components/NoticeBanner';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductGalleryModal } from './components/ProductGalleryModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TrackingModal } from './components/TrackingModal';
import { Footer } from './components/Footer';
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Sparkles,
  PhoneCall,
  MessageCircle,
  Check,
  X,
  Package,
  Smartphone,
  Monitor,
} from 'lucide-react';

export default function App() {
  // Device View Mode (Desktop vs Mobile Screen)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // State from Firestore
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [branding, setBranding] = useState<BrandingConfig>(INITIAL_BRANDING);
  const [isFirestoreLoading, setIsFirestoreLoading] = useState<boolean>(true);

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'discount'>('featured');

  // Modals & UI States
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<CartItem | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [trackingInitialCode, setTrackingInitialCode] = useState<string>('');

  // Cart State (Persisted in LocalStorage safely)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('alfeena_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item) => item && item.product && item.product.id && typeof item.product.price === 'number'
        );
      }
      return [];
    } catch {
      return [];
    }
  });

  // Save Cart to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('alfeena_cart', JSON.stringify(cartItems));
    } catch (e) {
      // ignore
    }
  }, [cartItems]);

  // Real-time Firestore Synchronization & Seed
  useEffect(() => {
    let unsubProducts = () => {};
    let unsubCategories = () => {};
    let unsubBranding = () => {};

    try {
      // 1. Seed initial data to Firestore if empty
      seedInitialFirestoreData();

      // 2. Real-time products listener
      if (db && typeof (db as any).type === 'string') {
        unsubProducts = onSnapshot(
          collection(db, 'products'),
          (snapshot) => {
            if (!snapshot.empty) {
              const prods: Product[] = [];
              snapshot.forEach((docSnap) => {
                const data = docSnap.data() as Product;
                if (data && data.id) {
                  prods.push(data);
                }
              });
              if (prods.length > 0) {
                setProducts(prods);
              }
            }
            setIsFirestoreLoading(false);
          },
          (err) => {
            console.warn('Firestore products listener error (using local catalog):', err);
            setIsFirestoreLoading(false);
          }
        );

        // 3. Real-time categories listener
        unsubCategories = onSnapshot(
          collection(db, 'categories'),
          (snapshot) => {
            if (!snapshot.empty) {
              const cats: Category[] = [];
              snapshot.forEach((docSnap) => {
                const data = docSnap.data() as Category;
                if (data && data.id) {
                  cats.push(data);
                }
              });
              if (cats.length > 0) {
                if (!cats.some((c) => c.id === 'all')) {
                  cats.unshift({ id: 'all', name: 'সব কালেকশন', slug: 'all' });
                }
                setCategories(cats);
              }
            }
          },
          (err) => {
            console.warn('Firestore categories listener error (using local catalog):', err);
          }
        );

        // 4. Real-time branding listener
        unsubBranding = onSnapshot(
          doc(db, 'branding', 'store_config'),
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as BrandingConfig;
              if (data && data.storeName) {
                setBranding(data);
              }
            }
          },
          (err) => {
            console.warn('Firestore branding listener error (using local branding):', err);
          }
        );
      } else {
        setIsFirestoreLoading(false);
      }
    } catch (err) {
      console.warn('Error establishing Firestore listeners:', err);
      setIsFirestoreLoading(false);
    }

    return () => {
      try {
        unsubProducts();
        unsubCategories();
        unsubBranding();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  // Cart Calculations
  const cartTotalQuantity = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Direct Order Handler (Buy Now)
  const handleDirectOrder = (product: Product) => {
    setDirectCheckoutItem({ product, quantity: 1 });
    setIsCheckoutOpen(true);
  };

  // Open Full Cart Checkout
  const handleProceedToCartCheckout = () => {
    setDirectCheckoutItem(null);
    setIsCheckoutOpen(true);
  };

  // Order Success Handler
  const handleOrderSuccess = (newOrder: Order) => {
    // If checkout was from standard cart, clear cart
    if (!directCheckoutItem) {
      setCartItems([]);
    }
  };

  // Open Tracking with initial code
  const handleOpenTrackingWithCode = (codeOrId: string) => {
    setTrackingInitialCode(codeOrId);
    setIsTrackingOpen(true);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products
      .filter((prod) => {
        if (!prod || !prod.id) return false;
        // Category match
        if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
          return false;
        }

        // Search match (title, serial code, fabric details)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = prod.title ? prod.title.toLowerCase().includes(q) : false;
          const matchCode = prod.code ? prod.code.toLowerCase().includes(q) : false;
          const matchKamiz = prod.fabric?.kamiz ? prod.fabric.kamiz.toLowerCase().includes(q) : false;
          const matchWork = prod.fabric?.work ? prod.fabric.work.toLowerCase().includes(q) : false;
          const matchCat = prod.category ? prod.category.toLowerCase().includes(q) : false;
          return matchTitle || matchCode || matchKamiz || matchWork || matchCat;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'discount') {
          const discA = a.discountPercentage || 0;
          const discB = b.discountPercentage || 0;
          return discB - discA;
        }
        // Default: featured (best sellers & new arrivals first)
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Shared Storefront Content (Used for both full desktop and mobile frame preview)
  const renderStoreContent = () => (
    <div className="flex-1 flex flex-col w-full bg-stone-50">
      {/* 1. Top Notice Banner */}
      <NoticeBanner
        branding={branding}
        onOpenTracking={() => {
          setTrackingInitialCode('');
          setIsTrackingOpen(true);
        }}
      />

      {/* 2. Main Store Header (আলফিনা এক্সক্লুসিভ থ্রি পিস / আভিজাত্য ও রুচিশীল নারীর প্রথম পছন্দ) */}
      <Header
        branding={branding}
        cartCount={cartTotalQuantity}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => {
          setTrackingInitialCode('');
          setIsTrackingOpen(true);
        }}
      />

      {/* 3. Sticky Category Navigation Menu */}
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
        }}
      />

      {/* 4. Hero Banner */}
      <HeroBanner onExploreClick={scrollToProducts} />

      {/* 5. Main Product Showcase & Search Section */}
      <main id="products-section" className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-7 w-full space-y-4">
        
        {/* Category Header Row */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#008743] font-serif-luxury leading-tight">
              {selectedCategory === 'all'
                ? 'সকল এক্সক্লুসিভ থ্রি পিস'
                : (categories.find((c) => c.id === selectedCategory)?.name || 'কালেকশন')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              মোট {filteredProducts.length} টি প্রিমিয়াম ডিজাইন প্রদর্শিত হচ্ছে
            </p>
          </div>
        </div>

        {/* Full-width Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="থ্রি পিস খুঁজুন..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#853609] focus:border-[#853609] text-xs sm:text-sm bg-white shadow-2xs placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Responsive Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Package className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-bold text-stone-800">কোনো থ্রি পিস পাওয়া যায়নি</h4>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                আপনার অনুসন্ধানের সাথে মিল রেখে কোনো পণ্য খুঁজে পাওয়া যায়নি। অন্য কোনো নাম বা ক্যাটাগরি দিয়ে চেষ্টা করুন।
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors"
            >
              সব কালেকশন রিসেট করুন
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === 'mobile'
                ? 'grid grid-cols-1 gap-5 max-w-md mx-auto w-full'
                : 'grid grid-cols-2 gap-2.5 sm:gap-5'
            }
          >
            {filteredProducts.map((product) => {
              const isAdded = cartItems.some((item) => item.product.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setActiveModalProduct(p)}
                  onAddToCart={handleAddToCart}
                  onDirectOrder={handleDirectOrder}
                  isAddedToCart={isAdded}
                  viewMode={viewMode}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* 10. Boutique Footer */}
      <Footer
        branding={branding}
        onOpenTracking={() => {
          setTrackingInitialCode('');
          setIsTrackingOpen(true);
        }}
      />
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col font-bengali transition-colors duration-300 ${viewMode === 'mobile' ? 'bg-[#120f0d]' : 'bg-stone-50 text-stone-900 selection:bg-amber-300 selection:text-stone-950'}`}>
      
      {/* 0. Top Bar with ALFEENA luxury badge & Working TV/Mobile Screen Toggles */}
      <TopBar
        cartCount={cartTotalQuantity}
        onOpenCart={() => setIsCartOpen(true)}
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode)}
      />

      {/* View Mode Switching: Mobile Device Simulator Frame vs Full Desktop View */}
      {viewMode === 'mobile' ? (
        <div className="w-full flex-1 flex flex-col items-center py-0 sm:py-7 px-0 sm:px-4 bg-stone-50 sm:bg-[#120f0d]">
          {/* Informative Floating Ribbon (on desktop) */}
          <div className="hidden sm:flex mb-4 px-4 py-1.5 rounded-full bg-[#241c16] border border-amber-500/40 text-amber-200 text-xs items-center gap-2 shadow-lg select-none">
            <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium">মোবাইল স্ক্রিন প্রিভিউ (১ কলাম ভিউ)</span>
            <span className="text-stone-600">•</span>
            <button
              type="button"
              onClick={() => setViewMode('desktop')}
              className="text-amber-400 hover:text-amber-300 underline font-bold cursor-pointer transition-colors"
            >
              ডেস্কটপ স্ক্রিনে ফিরুন
            </button>
          </div>

          {/* Smartphone Simulator Chassis on desktop, clean full-width on mobile */}
          <div className="w-full sm:max-w-[430px] bg-stone-50 text-stone-900 rounded-none sm:rounded-[2.5rem] border-0 sm:border-[8px] sm:border-[#292019] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_0_2px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col relative transition-all duration-300">
            
            {/* Phone Top Speaker & Camera Notch (desktop simulator only) */}
            <div className="hidden sm:flex h-6 bg-[#292019] items-center justify-between px-6 text-[10px] text-stone-400 select-none shrink-0 border-b border-[#201812]">
              <span className="font-semibold text-stone-300">৯:৪১</span>
              <div className="w-16 h-3 bg-[#14100d] rounded-full flex items-center justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                <div className="w-6 h-1 rounded-full bg-stone-800" />
              </div>
              <div className="flex items-center gap-1 text-[9px] text-stone-300">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Storefront Content inside Phone */}
            <div className="flex-1 flex flex-col w-full">
              {renderStoreContent()}
            </div>

            {/* Phone Bottom Home Bar (desktop simulator only) */}
            <div className="hidden sm:flex h-4 bg-[#292019] items-center justify-center shrink-0">
              <div className="w-24 h-1 rounded-full bg-stone-500/50" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex-1 flex flex-col">
          {renderStoreContent()}
        </div>
      )}

      {/* Floating Action Buttons on Mobile & Desktop */}
      
      {/* 1. Floating Shopping Bag Pill */}
      {cartTotalQuantity > 0 && (
        <div className="fixed bottom-4 right-4 z-40 animate-bounce">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#853609] to-[#6e2b07] text-white shadow-2xl hover:shadow-[#853609]/40 border-2 border-amber-400 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span className="absolute -top-2 -right-2.5 bg-amber-400 text-stone-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-stone-900">
                {cartTotalQuantity}
              </span>
            </div>
            <div className="text-left font-sans">
              <span className="text-[10px] text-amber-200 block leading-none">ব্যাগ দেখুন</span>
              <span className="text-xs font-bold text-amber-300 font-serif-luxury leading-none">
                ৳{cartSubtotal.toLocaleString('bn-BD')}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* 2. Floating Quick WhatsApp Button */}
      <div className="fixed bottom-4 left-4 z-30">
        <a
          href={`https://wa.me/${(branding?.whatsappNumber || '+8801892000000').replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="হোয়াটসঅ্যাপে অর্ডার ও তথ্য"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* 6. Multi-Image Viewer & Gallery Modal */}
      <ProductGalleryModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectOrder={handleDirectOrder}
        helplinePhone={branding.helplinePhone}
      />

      {/* 7. Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCartCheckout}
        onViewProduct={(prodId) => {
          const p = products.find((x) => x.id === prodId);
          if (p) setActiveModalProduct(p);
        }}
      />

      {/* 8. Cash On Delivery (COD) Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        directProduct={directCheckoutItem}
        onOrderSuccess={handleOrderSuccess}
        onOpenTrackingWithCode={handleOpenTrackingWithCode}
        insideDhakaFee={branding.insideDhakaShipping || 70}
        outsideDhakaFee={branding.outsideDhakaShipping || 130}
        helplinePhone={branding.helplinePhone}
      />

      {/* 9. Live Private Parcel Tracking Modal */}
      <TrackingModal
        isOpen={isTrackingOpen}
        onClose={() => {
          setIsTrackingOpen(false);
          setTrackingInitialCode('');
        }}
        initialQuery={trackingInitialCode}
        helplinePhone={branding.helplinePhone}
        helplineDisplay={branding.helplineDisplay}
      />

    </div>
  );
}
