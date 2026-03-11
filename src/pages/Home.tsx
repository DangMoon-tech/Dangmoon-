import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Download, Star, ShieldCheck, CreditCard, Truck, RefreshCcw, Users, Zap, Globe, Rocket, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { productService } from '../services/productService';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);
      const data = await productService.getProducts();
      setFeaturedProducts(data.slice(0, 4));
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
        {/* Background Wallpaper */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2071" 
            alt="Background Wallpaper" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-transparent to-brand-bg" />
        </div>

        {/* Background Gradients */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-5" />

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-accent text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Premium Digital Products</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Empowering <span className="text-brand-accent">Digital</span><br />
            <span className="text-brand-secondary">Innovation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Discover premium digital products, templates, and tools built for modern creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/store" className="btn-primary px-10 py-4 text-lg w-full sm:w-auto">
              Explore Store <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-16"
          >
            <div className="glass-card px-5 py-2.5 rounded-full flex items-center gap-2.5 border-white/5 bg-white/[0.03]">
              <Download className="w-4 h-4 text-brand-accent" />
              <span className="font-semibold text-sm">10K+ Downloads</span>
            </div>
            <div className="glass-card px-5 py-2.5 rounded-full flex items-center gap-2.5 border-white/5 bg-white/[0.03]">
              <Star className="w-4 h-4 text-brand-accent" />
              <span className="font-semibold text-sm">4.9 Rating</span>
            </div>
            <div className="glass-card px-5 py-2.5 rounded-full flex items-center gap-2.5 border-white/5 bg-white/[0.03]">
              <ShieldCheck className="w-4 h-4 text-brand-accent" />
              <span className="font-semibold text-sm">Secure Delivery</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 bg-brand-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {[
              { icon: CreditCard, title: 'Secure Payments', desc: 'Razorpay', color: 'bg-brand-accent/10 text-brand-accent' },
              { icon: Truck, title: 'Instant Digital Delivery', desc: 'Immediate access', color: 'bg-brand-accent/10 text-brand-accent' },
              { icon: RefreshCcw, title: 'Clear Return Policy', desc: 'Refund & Return', color: 'bg-brand-accent/10 text-brand-accent' },
              { icon: Users, title: 'Built for Creators', desc: 'Worldwide', color: 'bg-brand-accent/10 text-brand-accent' }
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0", feature.color)}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-xl">{feature.title}</h3>
                  <p className="text-brand-muted text-base">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Why Choose <span className="text-brand-accent">Us</span></h2>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {[
              { icon: Zap, title: 'Instant Access', desc: 'Download your products immediately after purchase or signup' },
              { icon: Globe, title: 'All India Access', desc: 'Instant download from whole India' },
              { icon: Rocket, title: 'Global Delivery Coming Soon', desc: 'Expanding worldwide delivery to serve innovators globally' }
            ].map((item, i) => (
              <div key={i} className="glass-card p-10 rounded-3xl space-y-6 text-center group hover:border-brand-accent/30 transition-all bg-white/[0.02]">
                <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mx-auto group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-brand-muted leading-relaxed max-w-md mx-auto">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass-card p-12 rounded-[2.5rem] relative overflow-hidden text-center border-brand-accent/20 bg-white/[0.02]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-accent/10 rounded-full blur-[80px] -z-10" />
            <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mx-auto mb-8">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-brand-muted mb-10 max-w-lg mx-auto text-lg">
              Get early access to new products, important updates, and exclusive offers from Dangmoon.
            </p>
            <form className="flex flex-col gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-brand-bg border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-accent transition-colors text-lg"
              />
              <button className="btn-primary w-full py-4 text-lg font-bold rounded-2xl">
                Subscribe <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="text-brand-accent">Products</span></h2>
              <p className="text-brand-muted">Handpicked digital assets to elevate your projects.</p>
            </div>
            <Link to="/store" className="text-brand-accent font-semibold flex items-center gap-2 hover:underline">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card rounded-3xl p-4 space-y-4 animate-pulse">
                  <div className="aspect-[4/3] bg-white/5 rounded-2xl" />
                  <div className="h-6 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              ))
            ) : (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
