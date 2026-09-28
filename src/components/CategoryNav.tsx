import React, { useRef, useEffect, useCallback } from 'react';
import { Category } from '../types';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const centerCategoryButton = useCallback((categoryId: string) => {
    const container = scrollRef.current;
    const btn = buttonRefs.current[categoryId];
    if (!container || !btn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const btnCenterRelativeToContainer =
      btnRect.left - containerRect.left + container.scrollLeft + btnRect.width / 2;
    const targetScrollLeft = btnCenterRelativeToContainer - containerRect.width / 2;

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    // Wait for DOM update (including Sparkles icon width) to center accurately
    const rafId = requestAnimationFrame(() => {
      centerCategoryButton(selectedCategory);
    });
    const timerId = window.setTimeout(() => {
      centerCategoryButton(selectedCategory);
    }, 60);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [selectedCategory, categories, centerCategoryButton]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 240;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="bg-[#009e4f] border-b border-[#008743] shadow-md sticky top-[46px] z-40 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 relative flex items-center">
        
        {/* Left scroll arrow for desktop */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors shrink-0 mr-1.5 cursor-pointer"
          aria-label="Previous categories"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable category list */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar scroll-smooth w-full"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                ref={(el) => {
                  buttonRefs.current[cat.id] = el;
                }}
                id={`cat-btn-${cat.id}`}
                onClick={() => {
                  onSelectCategory(cat.id);
                  centerCategoryButton(cat.id);
                }}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#853609] text-white shadow-md font-bold scale-102 ring-1 ring-white/20'
                    : 'bg-white text-stone-800 hover:text-stone-950 hover:bg-stone-50 border border-emerald-800/10 shadow-xs'
                }`}
              >
                {isSelected && <Sparkles className="w-3 h-3 text-amber-300" />}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right scroll arrow for desktop */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors shrink-0 ml-1.5 cursor-pointer"
          aria-label="Next categories"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </nav>
  );
};
