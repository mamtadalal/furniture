
import React from 'react';
import { ShoppingCart, Search, Menu, User } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (page: 'shop' | 'contact') => void;
  currentPage: 'shop' | 'contact';
}

export const Header: React.FC<HeaderProps> = ({ onSearch, cartCount, onOpenCart, onNavigate, currentPage }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate('shop')}
            className="text-2xl font-bold display-font tracking-tight text-stone-900 flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white text-xs">L</div>
            LUMINA
          </button>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button 
              onClick={() => onNavigate('shop')} 
              className={`hover:text-stone-900 transition-colors ${currentPage === 'shop' ? 'text-stone-900 border-b-2 border-stone-900' : ''}`}
            >
              Shop
            </button>
            <button 
              className="hover:text-stone-900 transition-colors"
            >
              Collections
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className={`hover:text-stone-900 transition-colors ${currentPage === 'contact' ? 'text-stone-900 border-b-2 border-stone-900' : ''}`}
            >
              Contact
            </button>
            <button className="hover:text-stone-900 transition-colors">About</button>
          </nav>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Search furniture..." 
              className="w-full bg-stone-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all outline-none"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-stone-100 rounded-full transition-colors md:hidden">
            <Search className="w-5 h-5 text-stone-600" />
          </button>
          <button className="p-2 hover:bg-stone-100 rounded-full transition-colors hidden sm:block">
            <User className="w-5 h-5 text-stone-600" />
          </button>
          <button 
            onClick={onOpenCart}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors relative group"
          >
            <ShoppingCart className="w-5 h-5 text-stone-600 group-hover:text-stone-900" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 hover:bg-stone-100 rounded-full">
            <Menu className="w-6 h-6 text-stone-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
