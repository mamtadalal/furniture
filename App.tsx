
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { AIAssistant } from './components/AIAssistant';
import { ContactUs } from './components/ContactUs';
import { PRODUCTS } from './data';
import { Product, CartItem, Category, SortOption } from './types';
import { ChevronRight, Filter, ShoppingBag, X, Info } from 'lucide-react';

const SORT_OPTIONS: SortOption[] = [
  { label: 'Featured', value: 'default' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Highest Rated', value: 'rating' },
];

const CATEGORIES: Category[] = ['All', 'Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor'];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'shop' | 'contact'>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<SortOption['value']>('default');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const shopRef = useRef<HTMLElement>(null);

  // Persistence for cart
  useEffect(() => {
    const savedCart = localStorage.getItem('lumina-cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina-cart', JSON.stringify(cart));
  }, [cart]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToShop = () => {
    if (currentPage !== 'shop') {
      setCurrentPage('shop');
      setTimeout(() => shopRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      shopRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryChange = (cat: Category) => {
    setCurrentPage('shop');
    setActiveCategory(cat);
    setTimeout(scrollToShop, 50);
  };

  const handleNavigate = (page: 'shop' | 'contact') => {
    setCurrentPage(page);
    scrollToTop();
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, activeCategory, sortBy]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onSearch={(q) => { setSearchQuery(q); if(q) scrollToShop(); }} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      <main className="flex-grow">
        {currentPage === 'shop' ? (
          <>
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden bg-stone-100">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" 
                  className="w-full h-full object-cover opacity-60"
                  alt="Hero Furniture"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-50 via-stone-50/80 to-transparent"></div>
              </div>
              
              <div className="relative max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-2xl animate-fade-in">
                  <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-4 block">Summer Collection 2024</span>
                  <h1 className="display-font text-5xl md:text-7xl text-stone-900 mb-6 leading-tight">
                    Design Your <br />
                    <span className="italic text-stone-600">Dream Sanctuary</span>
                  </h1>
                  <p className="text-stone-600 text-lg mb-8 max-w-md">
                    Experience the perfect blend of minimalist aesthetics and ergonomic comfort with our curated furniture collections.
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={scrollToShop}
                      className="bg-stone-900 text-white font-semibold py-4 px-8 rounded-full hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/20"
                    >
                      Shop Now
                    </button>
                    <button 
                      onClick={() => handleCategoryChange('Living Room')}
                      className="bg-white text-stone-900 border border-stone-200 font-semibold py-4 px-8 rounded-full hover:bg-stone-50 transition-colors"
                    >
                      View Collection
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section ref={shopRef} className="max-w-7xl mx-auto px-4 py-16">
              {/* Controls */}
              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-12">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                        activeCategory === cat 
                        ? 'bg-stone-900 text-white shadow-lg' 
                        : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-stone-500 font-medium">
                    <Filter className="w-4 h-4" />
                    Sort by:
                  </div>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAndSortedProducts.length > 0 ? (
                  filteredAndSortedProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Info className="w-8 h-8 text-stone-400" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">No items found</h3>
                    <p className="text-stone-500">Try adjusting your filters or search query to find what you're looking for.</p>
                    <button 
                      onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                      className="mt-6 text-stone-900 font-bold underline underline-offset-4"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <ContactUs />
        )}
      </main>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div 
            className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fade-in origin-right">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag className="w-16 h-16 mb-4" />
                  <p className="text-lg">Your bag is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} className="w-20 h-24 object-cover rounded-xl" alt={item.name} />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-stone-900">{item.name}</h4>
                      <p className="text-stone-500 text-xs mb-2">{item.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:bg-stone-50">-</button>
                          <span className="px-3 py-1 text-sm font-bold border-x border-stone-200">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:bg-stone-50">+</button>
                        </div>
                        <span className="font-bold text-stone-900">
                          ${((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-[10px] text-red-500 font-bold uppercase mt-2 tracking-widest hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-100 bg-stone-50 space-y-4">
                <div className="flex items-center justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-medium">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-stone-500">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Calculated at checkout</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <button className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-stone-800 transition-colors shadow-lg">
                  Checkout Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Assistant Button */}
      <AIAssistant />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold display-font tracking-tight text-white mb-6">LUMINA</div>
            <p className="text-sm leading-relaxed mb-6">
              Modern living designed with intent. We source the finest materials to create furniture that lasts generations.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:bg-stone-800 cursor-pointer text-[10px] font-bold">IG</div>
              <div className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:bg-stone-800 cursor-pointer text-[10px] font-bold">TW</div>
              <div className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:bg-stone-800 cursor-pointer text-[10px] font-bold">FB</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => handleCategoryChange('Living Room')} className="hover:text-white transition-colors">Living Room</button></li>
              <li><button onClick={() => handleCategoryChange('Bedroom')} className="hover:text-white transition-colors">Bedroom</button></li>
              <li><button onClick={() => handleCategoryChange('Dining')} className="hover:text-white transition-colors">Dining</button></li>
              <li><button onClick={() => handleCategoryChange('Office')} className="hover:text-white transition-colors">Office</button></li>
              <li><button onClick={() => handleCategoryChange('Outdoor')} className="hover:text-white transition-colors">Outdoor</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-left">
              <li><button onClick={() => handleNavigate('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Product Care</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Join our Newsletter</h4>
            <p className="text-sm mb-4">Get 10% off your first order plus design inspiration directly to your inbox.</p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="w-full bg-stone-800 border-none rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:ring-1 focus:ring-stone-600 outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-stone-900 p-1.5 rounded-lg">
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>© 2024 Lumina Home Retail Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
