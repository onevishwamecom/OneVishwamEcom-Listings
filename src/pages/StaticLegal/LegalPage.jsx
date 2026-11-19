import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function LegalPage({ initialTab = 'terms' }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (location.pathname.includes('privacy')) setActiveTab('privacy');
    else if (location.pathname.includes('help')) setActiveTab('help');
    else if (location.pathname.includes('terms')) setActiveTab('terms');
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="OneVishwam" className="h-8 w-auto object-contain" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 border-l border-slate-200 hidden sm:inline">
              Lister Portal
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left text-[11px]" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl max-w-md mx-auto mb-8 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terms of Service
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('help')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'help'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Help &amp; Support
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-5">
                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block mb-1">
                  Legal Agreement
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  OneVishwam Lister Terms &amp; Conditions
                </h1>
                <p className="text-xs text-slate-500 mt-1">Last updated: November 2026</p>
              </div>

              <div className="space-y-5 text-slate-700 text-sm leading-relaxed">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">1. Overview &amp; Eligibility</h3>
                  <p>
                    By registering as a merchant, builder, broker, or dealer on OneVishwam Lister Portal, you affirm that you have the legal capacity, valid authorizations, and legitimate ownership or representation rights for all commodities and assets listed.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">2. Listing Standards &amp; Content Verification</h3>
                  <p>
                    All items must feature accurate descriptions, unmanipulated high-resolution photos, verified physical locations, and transparent pricing. Fabricated amenities, false RERA numbers, or fake vehicle mileage violate our policies and lead to immediate termination.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">3. Commercial Terms &amp; Platform Mediation</h3>
                  <p>
                    OneVishwam acts as a high-trust verification and marketplace mediation network connecting verified sellers with qualified buyers. Inquiries forwarded to you must be handled with professional courtesy and prompt status tracking.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">4. Account Safety &amp; Non-Compliance</h3>
                  <p>
                    Listers must protect their access credentials. Accounts showing suspicious activities, fraudulent documentation, or unfulfilled transactions are permanently suspended without entitlement to refund of listing subscription credits.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-5">
                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block mb-1">
                  Data Protection
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  OneVishwam Lister Privacy Policy
                </h1>
                <p className="text-xs text-slate-500 mt-1">Last updated: November 2026</p>
              </div>

              <div className="space-y-5 text-slate-700 text-sm leading-relaxed">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">1. Information We Collect</h3>
                  <p>
                    We collect identification details (name, email, phone number), commercial credentials (business registration, dealership proof, GSTIN), and metadata regarding your uploaded inventory for security and fraud prevention.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">2. How We Safeguard Your Information</h3>
                  <p>
                    Your data is secured using industry-standard TLS 1.3 encryption in transit and AES-256 encryption at rest. We never sell, rent, or distribute partner credentials to unauthorized external third parties.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">3. Regulatory Compliance &amp; Disclosure</h3>
                  <p>
                    We process information strictly in compliance with applicable Indian IT and e-commerce consumer protection regulations. Records may be shared only with statutory regulatory authorities when mandated by court orders.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">4. Data Access &amp; Portability</h3>
                  <p>
                    You may review, download, or request complete removal of your business records and listings at any time by contacting our data protection officer at privacy@onevishwam.com.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-5">
                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block mb-1">
                  Partner Concierge
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Lister Helpdesk &amp; Support Center
                </h1>
                <p className="text-xs text-slate-500 mt-1">Dedicated assistance for verified listers &amp; dealers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center mb-3">
                    <i className="fa-solid fa-headset text-base" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Telephone Support</h4>
                  <p className="text-xs text-slate-600 mb-2">Mon–Sat, 9:00 AM to 7:00 PM IST</p>
                  <a href="tel:+918045678900" className="text-sm font-extrabold text-brand-blue hover:underline">
                    +91 80 4567 8900
                  </a>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
                    <i className="fa-solid fa-envelope text-base" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Email Desk</h4>
                  <p className="text-xs text-slate-600 mb-2">Average response time: &lt; 2 hours</p>
                  <a href="mailto:support@onevishwam.com" className="text-sm font-extrabold text-emerald-700 hover:underline">
                    support@onevishwam.com
                  </a>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="font-bold text-xs sm:text-sm text-slate-900 mb-1">How long does listing approval take?</p>
                    <p className="text-xs text-slate-600">All submissions undergo automated checks and human moderation within 2 to 4 business hours.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="font-bold text-xs sm:text-sm text-slate-900 mb-1">Can I update listing prices after publishing?</p>
                    <p className="text-xs text-slate-600">Yes! Open &ldquo;My Listings&rdquo; on your dashboard and select &ldquo;Edit&rdquo; to modify price, specifications, or media instantly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} OneVishwam Technologies Pvt. Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
