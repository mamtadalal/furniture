import React from 'react';
import { Star, Plus, Eye } from 'lucide-react';
import { Product } from '../types.ts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div className="group animate-fade-in flex flex-col h-full bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">New</span>
          )}
          {discount > 0 && (
            <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">-{discount}%</span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button className="bg-white p-3 rounded-full shadow-lg hover:bg-stone-900 hover:text-white transition-colors">
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-stone-900 hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">{product.category}</p>
        <h3 className="text-stone-900 font-semibold mb-2 group-hover:text-stone-600 transition-colors line-clamp-1">{product.name}</h3>
        
        <div className="flex items-center gap-1 mb-4">
          <div className="flex items-center text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-bold ml-1 text-stone-900">{product.rating}</span>
          </div>
          <span className="text-xs text-stone-400">({product.reviews} reviews)</span>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-stone-400 line-through text-xs">${product.price}</span>
                <span className="text-lg font-bold text-orange-600">${product.discountPrice}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-stone-900">${product.price}</span>
            )}
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-900 font-semibold py-2 px-4 rounded-xl text-sm transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};