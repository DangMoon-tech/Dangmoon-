import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Facebook, Twitter } from 'lucide-react';
import { settingsService } from '../services/settingsService';
import { DEFAULT_LOGO_URL } from '../constants';

export default function Footer() {
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
  const sections = [
    {
      title: 'Products',
      links: [
        { name: 'Store', path: '/store' },
        { name: 'AI Tools', path: '/store?category=AI+Tools' },
        { name: 'Developer Resources', path: '/store?category=Developer' },
        { name: 'Creative Assets', path: '/store?category=Creative' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Blog', path: '/blog' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms & Conditions', path: '/terms' },
        { name: 'Return & Refund Policy', path: '/refund' },
        { name: 'Disclaimer', path: '/disclaimer' },
      ]
    }
  ];

  return (
    <footer className="bg-brand-bg border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
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
              <span className="text-2xl font-bold tracking-tight gradient-text">Dangmoon</span>
            </Link>
            <p className="text-brand-muted max-w-sm leading-relaxed">
              Premium digital products & tools for modern creators. Empowering digital innovation with high-quality assets.
            </p>
            <div className="flex items-center gap-4">
              {[Youtube, Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-muted hover:text-brand-accent hover:bg-white/10 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {sections.map(section => (
            <div key={section.title} className="space-y-6">
              <h3 className="font-bold text-lg">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-brand-muted hover:text-brand-accent transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-brand-muted">
          <p>© 2026 Dangmoon. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
