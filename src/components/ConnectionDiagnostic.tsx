import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle2, Database, Shield, Key } from 'lucide-react';

export default function ConnectionDiagnostic() {
  const [status, setStatus] = useState<{
    db: 'loading' | 'success' | 'error';
    storage: 'loading' | 'success' | 'error';
    errorMsg?: string;
    errorType?: 'env' | 'auth' | 'rls' | 'other';
  }>({ db: 'loading', storage: 'loading' });

  useEffect(() => {
    async function runDiagnostics() {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANONYMOUS_KEY;

      if (!url || !key || url.includes('placeholder')) {
        setStatus(prev => ({ 
          ...prev, 
          db: 'error', 
          storage: 'error', 
          errorType: 'env',
          errorMsg: 'Dangmoon Backend environment variables are missing or set to placeholders.' 
        }));
        return;
      }

      // 1. Database Test
      try {
        const { error: dbError } = await supabase.from('products').select('*').limit(1);
        const { error: settingsError } = await supabase.from('site_settings').select('*').limit(1);
        
        if (dbError || settingsError) {
          const err = dbError || settingsError;
          let type: 'auth' | 'rls' | 'other' = 'other';
          if (err?.code === '42P01') {
            type = 'other'; // Table doesn't exist
          } else if (err?.message.includes('JWT') || err?.message.includes('API key')) {
            type = 'auth';
          } else if (err?.message.includes('policy')) {
            type = 'rls';
          }
          
          setStatus(prev => ({ 
            ...prev, 
            db: 'error', 
            errorType: type,
            errorMsg: `DB Error: ${err?.message}` 
          }));
        } else {
          setStatus(prev => ({ ...prev, db: 'success' }));
        }
      } catch (err: any) {
        setStatus(prev => ({ ...prev, db: 'error', errorMsg: err.message }));
      }

      // 2. Storage Test
      try {
        // Try 'assets' first, then 'asset' as fallback
        let bucketName = 'assets';
        let { error: storageError } = await supabase.storage.from('assets').list('', { limit: 1 });
        
        if (storageError && storageError.message.includes('not found')) {
          bucketName = 'asset';
          const { error: assetError } = await supabase.storage.from('asset').list('', { limit: 1 });
          storageError = assetError;
        }
        
        if (storageError) {
          let type: 'auth' | 'rls' | 'other' = 'other';
          if (storageError.message.includes('not found')) {
            type = 'other'; // Bucket doesn't exist
          } else if (storageError.message.includes('JWT') || storageError.message.includes('API key')) {
            type = 'auth';
          } else if (storageError.message.includes('policy')) {
            type = 'rls';
          }

          setStatus(prev => ({ 
            ...prev, 
            storage: 'error', 
            errorType: type,
            errorMsg: prev.errorMsg ? `${prev.errorMsg} | Storage Error: ${storageError.message}` : `Storage Error: ${storageError.message}`
          }));
        } else {
          setStatus(prev => ({ ...prev, storage: 'success' }));
        }
      } catch (err: any) {
        setStatus(prev => ({ ...prev, storage: 'error', errorMsg: err.message }));
      }
    }

    runDiagnostics();
  }, []);

  const StatusIcon = ({ state }: { state: 'loading' | 'success' | 'error' }) => {
    if (state === 'loading') return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-accent"></div>;
    if (state === 'success') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    return <AlertCircle className="w-5 h-5 text-rose-500" />;
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Database className="w-5 h-5 text-brand-accent" />
        Backend Diagnostics
      </h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-sm font-medium">Database Connection</span>
          <StatusIcon state={status.db} />
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-sm font-medium">Storage Bucket Access</span>
          <StatusIcon state={status.storage} />
        </div>
      </div>

      {status.errorType && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
            {status.errorType === 'env' && <Key className="w-4 h-4" />}
            {status.errorType === 'auth' && <Shield className="w-4 h-4" />}
            {status.errorType === 'rls' && <Shield className="w-4 h-4" />}
            <span>
              {status.errorType === 'env' && 'Missing Environment Variables'}
              {status.errorType === 'auth' && 'Invalid API Key (401)'}
              {status.errorType === 'rls' && 'RLS Policy Restriction (403)'}
              {status.errorType === 'other' && 'Configuration Error'}
            </span>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            {status.errorMsg}
          </p>
        </div>
      )}

      {status.db === 'success' && status.storage === 'success' && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <p className="text-xs text-emerald-500 font-medium text-center">
            All systems operational. Backend is correctly connected.
          </p>
        </div>
      )}
    </div>
  );
}
