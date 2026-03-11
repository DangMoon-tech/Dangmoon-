import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ShieldCheck, LogIn } from 'lucide-react';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';
import { settingsService } from '../services/settingsService';
import { DEFAULT_LOGO_URL } from '../constants';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);
  const { items, itemCount, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    async function fetchLogo() {
      const url = await settingsService.getSetting('logo_url');
      if (url) setLogoUrl(url);
    }
    fetchLogo();

    const handleLogoUpdate = (e: any) => {
      if (e.detail) {
        // Add cache buster to force re-load
        const cacheBuster = `?t=${Date.now()}`;
        setLogoUrl(e.detail.includes('?') ? `${e.detail}&${cacheBuster.slice(1)}` : `${e.detail}${cacheBuster}`);
      }
    };

    window.addEventListener('logoUpdated', handleLogoUpdate);
    return () => window.removeEventListener('logoUpdated', handleLogoUpdate);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Store', path: '/store' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-brand-secondary flex items-center justify-center p-[2px]">
              <div className="w-full h-full rounded-full bg-brand-bg flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoUrl} 
                    alt="Dangmoon Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight gradient-text">
              Dangmoon
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-accent",
                  location.pathname === link.path ? "text-brand-accent" : "text-brand-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/signin" 
              className="px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-brand-muted hover:text-brand-accent transition-colors"
            >
              <ShoppingCart className="w-7 h-7" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-brand-bg text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-bg">
                  {itemCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-brand-muted hover:text-brand-accent transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-brand-bg pt-20 px-4 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-semibold text-brand-muted hover:text-brand-accent"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                <Link 
                  to="/signin" 
                  className="btn-primary w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="w-5 h-5" /> Sign In
                </Link>
                <Link 
                  to="/admin" 
                  className="btn-secondary w-full border-amber-500/20 text-amber-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShieldCheck className="w-5 h-5" /> Admin Access
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-brand-card border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-brand-accent" />
                  <h2 className="text-xl font-bold">Your Cart ({itemCount})</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-brand-muted gap-4">
                    <ShoppingCart className="w-12 h-12 opacity-20" />
                    <p>Your cart is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-brand-accent hover:underline"
                    >
                      Start shopping
                    </button>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-brand-muted hover:text-red-400">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-brand-accent font-bold">₹{item.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10"
                          >
                            -
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-brand-bg/50 space-y-4">
                  <button onClick={clearCart} className="text-sm text-brand-muted hover:text-white transition-colors">
                    Clear Cart
                  </button>
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span className="text-brand-accent">₹{total}</span>
                  </div>
                  <button className="btn-primary w-full py-4">
                    <ShoppingCart className="w-5 h-5" /> Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
