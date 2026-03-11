import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Shield, Zap } from 'lucide-react';
import ConnectionDiagnostic from '../components/ConnectionDiagnostic';
import { settingsService } from '../services/settingsService';
import { DEFAULT_LOGO_URL } from '../constants';

export default function About() {
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);

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

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-accent to-brand-secondary p-0.5 mx-auto mb-8"
          >
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
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">About <span className="text-brand-accent">Dangmoon</span></h1>
          <p className="text-brand-muted max-w-3xl mx-auto text-lg leading-relaxed">
            Your destination for premium digital products—AI tools, developer resources, and creative assets designed to accelerate your projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-medium">
              <Target className="w-4 h-4" />
              <span>Our Mission</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">Democratizing <br /><span className="text-brand-accent">Innovation</span></h2>
            <p className="text-brand-muted text-lg leading-relaxed">
              In a world moving at the speed of AI, we believe everyone deserves access to top-tier tools and resources. Our mission is to provide creators with the building blocks they need to turn their ideas into reality, without the friction of starting from scratch.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-2xl">
                <h4 className="text-brand-accent text-3xl font-bold mb-1">5k+</h4>
                <p className="text-sm text-brand-muted">Happy Creators</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <h4 className="text-brand-accent text-3xl font-bold mb-1">500+</h4>
                <p className="text-sm text-brand-muted">Digital Assets</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-brand-accent/20 blur-[100px] rounded-full" />
            <img 
              src="https://picsum.photos/seed/mission/800/800" 
              alt="Mission" 
              className="relative z-10 rounded-3xl border border-white/10 shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: Zap, title: 'Fast Delivery', desc: 'Get instant access to your digital products immediately after purchase.' },
            { icon: Shield, title: 'Secure Payments', desc: 'Your transactions are protected by industry-standard encryption.' },
            { icon: Target, title: 'Premium Quality', desc: 'Every asset is carefully vetted to ensure the highest standards.' }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl space-y-4 hover:border-brand-accent/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-brand-muted leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">System Status</h2>
            <p className="text-brand-muted">Verify your connection to the Dangmoon Backend.</p>
          </div>
          <ConnectionDiagnostic />
        </div>
      </div>
    </div>
  );
}
