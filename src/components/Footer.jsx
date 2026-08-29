import React from 'react';
import { Link } from 'react-router-dom';
import INSTITUTION_CONFIG from '../config/institutionConfig.js';
import { Building2, MapPin, Mail, Phone, ShieldCheck, ExternalLink, Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/90 text-slate-600 dark:text-slate-400 font-medium transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Col 1 & 2: Institution Branding & Details */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 flex items-center justify-center shadow-xs overflow-hidden">
                <img
                  src="/msbte.png"
                  alt="MSBTE Emblem"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 hidden" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {INSTITUTION_CONFIG.collegeName}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
              {INSTITUTION_CONFIG.tagline}
            </p>
            <div className="flex items-center space-x-3 text-xs font-extrabold text-blue-600 dark:text-blue-400 pt-1">
              <span className="flex items-center"><Building2 className="w-4 h-4 mr-1" /> {INSTITUTION_CONFIG.governmentAffiliation}</span>
              <span className="flex items-center text-emerald-600 dark:text-emerald-400"><Activity className="w-3.5 h-3.5 mr-1 animate-pulse" /> Portal Live</span>
            </div>
          </div>

          {/* Col 3: Contact & Address Info */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Campus Address & Contact
            </h4>
            <p className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>{INSTITUTION_CONFIG.address}</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <a href={`mailto:${INSTITUTION_CONFIG.contactEmail}`} className="hover:text-blue-600 dark:hover:text-white transition-colors">
                {INSTITUTION_CONFIG.contactEmail}
              </a>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{INSTITUTION_CONFIG.contactPhone}</span>
            </p>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 font-semibold">
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Portal Home & QR Verification
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Student Application Portal
                </Link>
              </li>
              <li>
                <a href={INSTITUTION_CONFIG.website} target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-white transition-colors inline-flex items-center gap-1">
                  <span>Official College Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-semibold gap-3">
          <p>&copy; {new Date().getFullYear()} {INSTITUTION_CONFIG.collegeName}. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Powered by MERN Stack & Cryptographic Anti-Tamper Engine</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
