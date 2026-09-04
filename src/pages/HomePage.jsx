import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle, Download, ArrowRight, Zap, Users, Lock,
  ShieldCheck, Search, Building2, Sparkles, Award, ExternalLink, HelpCircle, ChevronDown, ChevronUp, CheckCircle2
} from 'lucide-react';
import INSTITUTION_CONFIG from '../config/institutionConfig.js';
import ScrollCompress from '../components/ScrollCompress.jsx';

export default function BonafideLandingPage() {
  const [tokenInput, setTokenInput] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      navigate(`/verify/${tokenInput.trim()}`);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does the anti-tamper QR code verification work?',
      a: 'Each issued certificate contains a cryptographically signed QR code and a unique 32-character verification token. Anyone (employers, scholarship authorities, passport offices) can scan the QR code to verify the document live on our official ledger.'
    },
    {
      q: 'Is this digital Bonafide Certificate officially recognized?',
      a: 'Yes! It is digitally signed under the Indian PKI / e-Sign governance framework and adheres to all DTE Maharashtra and MSBTE Maharashtra educational compliance standards.'
    },
    {
      q: 'How long does the HOD approval process take?',
      a: 'Applications submitted by registered students are instantly routed to their department HOD dashboard. Upon HOD verification, the PDF is generated and emailed within minutes.'
    },
    {
      q: 'Can I apply for custom purposes like MahaDBT scholarship or Passport?',
      a: 'Yes, students can select standard preset purposes (MahaDBT Scholarship, Bus/Train Concession, Passport Application) or type a custom reason when submitting the form.'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200">

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none animate-pulseGlow" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none animate-floatSoft" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6 animate-slideInUp">

          {/* Institution Header Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50/80 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold shadow-xs animate-bounceSoft">
            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{INSTITUTION_CONFIG.collegeName}</span>
            <span className="h-3 w-px bg-blue-300 dark:bg-blue-800"></span>
            <span className="text-amber-600 dark:text-amber-400 flex items-center font-extrabold">
              <Sparkles className="w-3 h-3 mr-1 animate-spinSlow" /> MERN Stack Portal
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:via-slate-100 dark:to-slate-300 dark:bg-clip-text">
            Smart Bonafide Certificate <br className="hidden sm:inline" />
            <span className="text-blue-600 dark:text-blue-400">Issuance & Verification System</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Official paperless digital portal for students, HODs, and administrators. Request, approve, and verify authentic tamper-proof Bonafide Certificates online with embedded QR codes.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold transition-all shadow-lg shadow-blue-600/30 btn-animated text-sm">
                <span>Apply for Certificate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 font-extrabold text-slate-800 dark:text-slate-200 transition-all shadow-xs btn-animated text-sm">
                Faculty / Admin Sign In
              </button>
            </Link>
          </div>

          {/* Live Public Verification Search Bar Widget */}
          <div className="max-w-2xl mx-auto pt-6">
            <form onSubmit={handleVerifySubmit} className="glass-card p-2 sm:p-2.5 rounded-2xl border border-blue-200 dark:border-blue-500/30 shadow-xl flex flex-col sm:flex-row items-center gap-2 bg-white/90 dark:bg-slate-900/80 card-hover-lift">
              <div className="relative w-full flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste Certificate Verification Token ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-xs sm:text-sm font-mono font-semibold focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 shrink-0 btn-animated"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Document</span>
              </button>
            </form>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 font-medium">
              Enter any 32-character certificate token or scan a QR code to check validity live.
            </p>
          </div>

        </div>
      </section>

      {/* Live Stat Banner */}
      <ScrollCompress className="py-10 border-y border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="animate-fadeIn stagger-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">1,250+</span>
            <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Certificates Issued</span>
          </div>

          <div className="animate-fadeIn stagger-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</span>
            <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Cryptographic Anti-Tamper</span>
          </div>

          <div className="animate-fadeIn stagger-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400">5</span>
            <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Engineering Depts</span>
          </div>

          <div className="animate-fadeIn stagger-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 dark:text-amber-400">0 min</span>
            <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Paper Counter Delay</span>
          </div>
        </div>
      </ScrollCompress>

      {/* Workflow Section */}
      <ScrollCompress id="process" className="py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 animate-bounceSoft">
              Automated Process
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-3">Simple 3-Step Online Workflow</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mt-1">
              Eliminating physical queues and administrative paperwork
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollCompress staggerDelay={0.05} className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs space-y-4 card-hover-lift">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-xl shadow-inner animate-floatSoft">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">1. Student Application</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Log in to student portal, choose your certificate purpose (Scholarship, Passport, Higher Education), and submit.
              </p>
            </ScrollCompress>

            <ScrollCompress staggerDelay={0.12} className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs space-y-4 card-hover-lift">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-extrabold text-xl shadow-inner animate-floatSoft">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">2. HOD Review & Approval</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Department HOD reviews your application on their routed queue and approves it with a single click.
              </p>
            </ScrollCompress>

            <ScrollCompress staggerDelay={0.18} className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs space-y-4 card-hover-lift">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-xl shadow-inner animate-floatSoft">
                <Download className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">3. PDF Email & Download</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                The server generates a PDF with embedded e-Sign and QR code, dispatches it to your email, and unlocks 1-click download.
              </p>
            </ScrollCompress>
          </div>
        </div>
      </ScrollCompress>

      {/* Departments Showcase Grid */}
      <ScrollCompress className="py-16 px-6 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Integrated Academic Departments</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mt-1">
              Automated routing for all engineering streams at {INSTITUTION_CONFIG.collegeShortName}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INSTITUTION_CONFIG.departments.map((dept, index) => (
              <ScrollCompress key={dept} staggerDelay={(index % 4) * 0.08} className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-xs space-y-3 card-hover-lift">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold animate-floatSoft">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{dept}</h4>
                <div className="flex items-center text-[11px] font-semibold text-slate-600 dark:text-slate-400 space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">HOD Active</span>
                  <span>Auto-Routing</span>
                </div>
              </ScrollCompress>
            ))}
          </div>
        </div>
      </ScrollCompress>

      {/* FAQ Accordion */}
      <ScrollCompress className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mt-1">
              Everything you need to know about the Bonafide Portal & Verification Engine
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <ScrollCompress key={index} staggerDelay={index * 0.05} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/95 dark:bg-slate-900/60 transition-all card-hover-lift">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between font-extrabold text-sm text-slate-900 dark:text-slate-100"
                >
                  <span className="flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2.5 text-blue-600 shrink-0" />
                    {faq.q}
                  </span>
                  {openFaq === index ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </ScrollCompress>
            ))}
          </div>
        </div>
      </ScrollCompress>

      {/* Official Accreditation Footer Bar */}
      <ScrollCompress className="py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs font-semibold text-center">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Approved by Directorate of Technical Education (DTE), Maharashtra State</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
            <span>MSBTE Affiliated</span>
            <span>•</span>
            <span>Indian e-Sign Standard PKI</span>
          </div>
        </div>
      </ScrollCompress>

    </div>
  );
}
