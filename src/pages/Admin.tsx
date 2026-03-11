import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, Mail, LayoutDashboard, Package, Users, Settings, Plus, LogOut, Zap, Eye, EyeOff, Upload, CheckCircle2, AlertCircle, X, Edit2, Trash2, ExternalLink, Chrome } from 'lucide-react';
import { cn, Product } from '../types';
import { storageService } from '../services/storageService';
import { settingsService } from '../services/settingsService';
import { productService } from '../services/productService';
import { supabase } from '../lib/supabase';
import { DEFAULT_LOGO_URL } from '../constants';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Site Settings State
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);
  const [message, setMessage] = useState({ text: '', type: 'success' as 'success' | 'error' });
  
  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'AI Tools',
    image_url: '',
    file_url: '',
    downloads: 0,
    rating: 5,
    is_free: false
  });

  const isSuperAdmin = user?.email === 'hello.dangmoon@gmail.com';

  useEffect(() => {
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
    } catch (err) {
      console.error('Session check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const [allSettings, setAllSettings] = useState<any[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  const fetchData = async () => {
    const [url, productsList, { data: settingsData }] = await Promise.all([
      settingsService.getSetting('logo_url'),
      productService.getProducts(),
      supabase.from('site_settings').select('*')
    ]);
    if (url) setLogoUrl(url);
    setProducts(productsList);
    if (settingsData) setAllSettings(settingsData);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;
      
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (authError) throw authError;
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setUploading(true);
    setMessage({ text: '', type: 'success' });

    try {
      console.log('Starting logo upload for file:', file.name);
      const filename = `logos/logo-${Date.now()}.${file.name.split('.').pop()}`;
      
      // Set a timeout for the upload
      const uploadPromise = storageService.uploadFile('assets', filename, file);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timed out. Please check your connection.')), 30000)
      );

      const publicUrl = await Promise.race([uploadPromise, timeoutPromise]) as string | null;
      
      if (publicUrl) {
        console.log('Logo uploaded successfully, URL:', publicUrl);
        await settingsService.updateSetting('logo_url', publicUrl);
        
        // Add cache buster to force re-load
        const cacheBuster = `?t=${Date.now()}`;
        const finalUrl = `${publicUrl}${cacheBuster}`;
        setLogoUrl(finalUrl);
        setMessage({ text: 'Logo updated successfully!', type: 'success' });
        
        // Notify other components (Navbar, Footer) that the logo has changed
        window.dispatchEvent(new CustomEvent('logoUpdated', { detail: publicUrl }));
        
        // Refresh debug info
        fetchData();
      } else {
        console.error('Logo upload returned null URL');
        setMessage({ 
          text: 'Upload failed. This usually happens if the "assets" storage bucket is missing or not set to Public.', 
          type: 'error' 
        });
      }
    } catch (err: any) {
      console.error('Logo upload error:', err);
      setMessage({ text: `Error: ${err.message || 'Unknown upload error'}`, type: 'error' });
    } finally {
      setUploading(false);
      // Clear the input so the same file can be selected again
      if (e.target) e.target.value = '';
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: 'success' });
    
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productFormData);
        setMessage({ text: 'Product updated successfully!', type: 'success' });
      } else {
        // Ensure we don't send an empty ID if the DB generates it
        const { id, ...newProductData } = productFormData;
        await productService.createProduct(newProductData);
        setMessage({ text: 'Product created successfully!', type: 'success' });
      }
      setIsProductModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error('Product submission error:', err);
      let errorText = err.message;
      if (err.message.includes('violates row-level security policy')) {
        errorText = 'Permission Denied: Your account does not have permission to manage products. Please ensure you are logged in as hello.dangmoon@gmail.com and have run the RLS setup SQL.';
      }
      setMessage({ text: errorText, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.deleteProduct(id);
      setMessage({ text: 'Product deleted successfully!', type: 'success' });
      fetchData();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  const openProductModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setProductFormData({ ...product });
    } else {
      setEditingProduct(null);
      setProductFormData({
        name: '',
        description: '',
        price: 0,
        category: 'AI Tools',
        image_url: '',
        file_url: '',
        downloads: 0,
        rating: 5,
        is_free: false
      });
    }
    setIsProductModalOpen(true);
  };

  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-card p-8 rounded-3xl space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-brand-muted">Enter your credentials to access the dashboard</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 px-4 rounded-xl font-semibold hover:bg-white/90 transition-all disabled:opacity-50"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-brand-muted uppercase tracking-wider">or email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-muted">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                <input 
                  type="email" 
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-bg border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-muted">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-bg border border-white/10 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary bg-amber-500 text-brand-bg hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Unlock Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <LayoutDashboard className="text-brand-accent" /> {isSuperAdmin ? 'Super Admin Dashboard' : 'Product Admin Dashboard'}
            </h1>
            <p className="text-brand-muted">
              {isSuperAdmin 
                ? 'Full access to site settings, products, and analytics.' 
                : 'Manage your uploaded products and updates.'}
            </p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleLogout} className="btn-secondary text-red-400 border-red-400/20">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>

        {message.text && (
          <div className={cn(
            "mb-8 p-4 rounded-xl flex items-center gap-3 border",
            message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
          )}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{message.text}</p>
            <button onClick={() => setMessage({ text: '', type: 'success' })} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Total Sales', value: isSuperAdmin ? '₹45,200' : '₹12,400', icon: Zap, color: 'text-brand-accent' },
            { label: 'Active Products', value: products.length.toString(), icon: Package, color: 'text-brand-secondary' },
            { label: 'Total Users', value: isSuperAdmin ? '1,240' : 'N/A', icon: Users, color: 'text-emerald-400' },
            { label: 'Store Rating', value: '4.9/5', icon: ShieldCheck, color: 'text-amber-400' }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 rounded-3xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-muted">{stat.label}</span>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {isSuperAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-accent" /> Site Identity
              </h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-brand-muted">Store Logo</label>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt="Logo Preview" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            console.error('Logo preview failed to load:', logoUrl);
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              const errorIcon = document.createElement('div');
                              errorIcon.className = "text-rose-500 text-[10px] text-center p-2";
                              errorIcon.innerText = "Load Error";
                              parent.appendChild(errorIcon);
                            }
                          }}
                        />
                      ) : (
                        <ShieldCheck className="w-8 h-8 text-brand-muted" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          {uploading ? 'Uploading...' : 'Upload New Logo'}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleLogoUpload}
                            disabled={uploading}
                          />
                        </label>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Restore default logo?')) {
                              await settingsService.updateSetting('logo_url', DEFAULT_LOGO_URL);
                              setLogoUrl(DEFAULT_LOGO_URL);
                              window.dispatchEvent(new CustomEvent('logoUpdated', { detail: DEFAULT_LOGO_URL }));
                              fetchData();
                            }
                          }}
                          className="btn-secondary text-brand-accent border-brand-accent/20"
                        >
                          Restore Default
                        </button>
                      </div>
                      <p className="text-xs text-brand-muted mt-2">Recommended: 512x512px PNG or SVG</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <button 
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-xs text-brand-muted hover:text-brand-accent transition-colors"
                  >
                    {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
                  </button>
                  {showDebug && (
                    <div className="mt-4 p-4 bg-black/20 rounded-xl text-[10px] font-mono overflow-auto max-h-60">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-brand-muted uppercase">Raw Site Settings:</h4>
                        <button onClick={() => fetchData()} className="text-brand-accent hover:underline">Refresh</button>
                      </div>
                      <div className="mb-4 p-2 bg-brand-accent/5 rounded border border-brand-accent/10 text-brand-accent">
                        <p className="font-bold">Timezone Info:</p>
                        <p>Your Local Time: {new Date().toLocaleTimeString()}</p>
                        <p>Database Time (UTC): {new Date().toISOString().split('T')[1].split('.')[0]} UTC</p>
                        <p className="mt-1 text-[8px] opacity-70">* The "updated_at" in the database is always in UTC time.</p>
                      </div>
                      <pre>{JSON.stringify(allSettings, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-secondary" /> Admin Management
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-brand-bg font-bold">H</div>
                    <span>{user?.email}</span>
                  </div>
                  <span className="text-xs bg-brand-accent/20 text-brand-accent px-2 py-1 rounded">
                    {isSuperAdmin ? 'Super Admin' : 'Product Admin'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold">Product Management</h3>
            <button onClick={() => openProductModal()} className="btn-primary py-2 px-4 text-sm">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-sm text-brand-muted">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Sales</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-brand-muted space-y-4">
                      <p>No products found. Add your first product to get started.</p>
                      <button 
                        onClick={async () => {
                          setLoading(true);
                          await productService.seedDatabase();
                          fetchData();
                          setLoading(false);
                        }}
                        className="btn-secondary px-6 py-2 text-sm mx-auto"
                      >
                        Seed Initial Data
                      </button>
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                      <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-white/10" referrerPolicy="no-referrer" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                      </td>
                      <td className="px-6 py-4 text-brand-muted">{product.category}</td>
                      <td className="px-6 py-4">₹{product.price}</td>
                      <td className="px-6 py-4">{product.downloads}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button onClick={() => openProductModal(product)} className="text-brand-accent hover:text-brand-accent/80 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-red-400 hover:text-red-300 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-2xl bg-brand-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-muted">Product Name</label>
                    <input 
                      type="text" 
                      value={productFormData.name}
                      onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                      className="w-full bg-brand-bg border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-accent transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-muted">Category</label>
                    <select 
                      value={productFormData.category}
                      onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                      className="w-full bg-brand-bg border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-accent transition-colors"
                    >
                      {['AI Tools', 'AI Prompts', 'Automation', 'Developer Tools', 'Creative Assets'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-muted">Price (₹)</label>
                    <input 
                      type="number" 
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                      className="w-full bg-brand-bg border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-accent transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-muted">Image URL</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={productFormData.image_url}
                        onChange={(e) => setProductFormData({ ...productFormData, image_url: e.target.value })}
                        className="flex-1 bg-brand-bg border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-accent transition-colors"
                        placeholder="https://..."
                        required
                      />
                      <label className="btn-secondary px-4 cursor-pointer">
                        <Upload className="w-5 h-5" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await storageService.uploadFile('assets', `products/${Date.now()}-${file.name}`, file);
                              if (url) setProductFormData({ ...productFormData, image_url: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-muted">Is Free?</label>
                    <div className="flex items-center gap-4 h-[50px]">
                      <button
                        type="button"
                        onClick={() => setProductFormData({ ...productFormData, is_free: !productFormData.is_free, price: !productFormData.is_free ? 0 : productFormData.price })}
                        className={cn(
                          "w-12 h-6 rounded-full transition-colors relative",
                          productFormData.is_free ? "bg-brand-accent" : "bg-white/10"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                          productFormData.is_free ? "left-7" : "left-1"
                        )} />
                      </button>
                      <span className="text-sm">{productFormData.is_free ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-muted">Initial Rating (1-5)</label>
                    <input 
                      type="number" 
                      min="1"
                      max="5"
                      step="0.1"
                      value={productFormData.rating}
                      onChange={(e) => setProductFormData({ ...productFormData, rating: Number(e.target.value) })}
                      className="w-full bg-brand-bg border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-muted">Description</label>
                  <textarea 
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    className="w-full bg-brand-bg border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-accent transition-colors h-32 resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-muted">File URL (Download Link)</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                    <input 
                      type="text" 
                      value={productFormData.file_url}
                      onChange={(e) => setProductFormData({ ...productFormData, file_url: e.target.value })}
                      className="w-full bg-brand-bg border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-accent transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsProductModalOpen(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 btn-primary"
                  >
                    {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
