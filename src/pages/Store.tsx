import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { CATEGORIES, cn, Product } from '../types';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { productService } from '../services/productService';

export default function Store() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All Products' || p.category === selectedCategory || (selectedCategory === 'Free' && p.is_free);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Digital <span className="text-brand-accent">Store</span></h1>
          <p className="text-brand-muted max-w-2xl mx-auto">
            Discover premium digital products, AI tools, and resources to accelerate your projects.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <aside className="space-y-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
              <input 
                type="text" 
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-card border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-accent transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-1.5 px-4 text-sm">
                Search
              </button>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <Filter className="w-5 h-5 text-brand-accent" /> Categories
                </h3>
              </div>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group",
                      selectedCategory === cat 
                        ? "bg-brand-accent/10 text-brand-accent font-bold border border-brand-accent/20" 
                        : "text-brand-muted hover:bg-white/5"
                    )}
                  >
                    {cat}
                    <span className="text-sm font-bold text-brand-accent opacity-80 group-hover:opacity-100 bg-brand-accent/10 px-2 py-0.5 rounded-md">
                      {products.filter(p => cat === 'All Products' || p.category === cat || (cat === 'Free' && p.is_free)).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-brand-muted">Showing {filteredProducts.length} products</p>
              <button className="flex items-center gap-2 text-sm font-medium text-brand-muted hover:text-white">
                Sort by: Newest <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 text-brand-accent animate-spin" />
                <p className="text-brand-muted">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-20 text-center space-y-4">
                <Search className="w-12 h-12 text-brand-muted mx-auto opacity-20" />
                <h3 className="text-xl font-bold">No products found</h3>
                <p className="text-brand-muted">Try adjusting your search or filters, or seed the database if it's empty.</p>
                <div className="flex flex-col gap-4 items-center">
                  <button 
                    onClick={() => { setSearch(''); setSelectedCategory('All Products'); }}
                    className="text-brand-accent hover:underline"
                  >
                    Clear all filters
                  </button>
                  <button 
                    onClick={async () => {
                      await productService.seedDatabase();
                      const data = await productService.getProducts();
                      setProducts(data);
                    }}
                    className="btn-secondary px-6 py-2 text-sm"
                  >
                    Seed Initial Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
