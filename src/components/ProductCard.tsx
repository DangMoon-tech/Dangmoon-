import React from 'react';
import { Star, Download, ShoppingCart, Eye } from 'lucide-react';
import { Product, cn } from '../types';
import { useCart } from '../CartContext';
import { motion } from 'motion/react';

export default function ProductCard({ product }: any) {
  const { addToCart, items } = useCart();
  const isInCart = items.some(item => item.id === product.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-2xl overflow-hidden group hover:border-brand-accent/30 transition-all duration-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-accent hover:text-brand-bg transition-all">
            <Eye className="w-6 h-6" />
          </button>
        </div>
        {product.is_free && (
          <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Free
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold group-hover:text-brand-accent transition-colors">{product.name}</h3>
          <p className="text-xl font-bold text-brand-accent">
            {product.is_free ? 'Free' : `₹${product.price}`}
          </p>
        </div>
        
        <p className="text-brand-muted text-sm line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between text-xs text-brand-muted pt-2">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-medium text-white">{product.rating}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            <span>{product.downloads >= 1000 ? `${(product.downloads / 1000).toFixed(1)}k` : product.downloads} downloads</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button className="flex-1 btn-secondary py-2.5 text-sm">
            View
          </button>
          <button 
            onClick={() => addToCart(product)}
            className={cn(
              "flex-[2] btn-primary py-2.5 text-sm",
              isInCart && "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 hover:shadow-none"
            )}
          >
            <ShoppingCart className="w-4 h-4" />
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
