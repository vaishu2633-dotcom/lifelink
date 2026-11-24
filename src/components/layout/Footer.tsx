import React from 'react';
import { Droplet, Heart, PhoneCall, ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] flex items-center justify-center text-white shadow-lg">
                <Droplet className="w-6 h-6 fill-white text-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  LIFE<span className="text-[#E53935]">LINK</span>
                </span>
                <p className="text-[11px] text-slate-400 font-medium">
                  Smart Blood Donation Management System
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              "Every Drop Connects a Life." An intelligent healthcare network connecting volunteer donors, emergency patients, certified blood banks and collegiate communities with real-time smart matching.
            </p>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="text-[10px] uppercase font-bold text-red-400 tracking-wider flex items-center gap-1.5 mb-1">
                <PhoneCall className="w-3.5 h-3.5" /> 24/7 Emergency Helplines
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-300 font-mono text-[11px]">
                <span>National Blood Helpline: <strong className="text-white">104</strong></span>
                <span>Emergency Ambulance: <strong className="text-white">108</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Network
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('find-blood')} className="hover:text-red-400 transition-colors">
                  Find Blood Donors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('emergency-sos')} className="text-red-400 font-semibold hover:underline flex items-center gap-1">
                  <span>Emergency SOS Broadcast</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rare-blood')} className="hover:text-red-400 transition-colors">
                  Rare Blood Registry (Oh / Rh-null)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blood-banks')} className="hover:text-red-400 transition-colors">
                  Blood Bank Directory & Stock
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('camps')} className="hover:text-red-400 transition-colors">
                  Upcoming Donation Drives
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('colleges')} className="hover:text-red-400 transition-colors">
                  College Championship
                </button>
              </li>
            </ul>
          </div>

          {/* For Stakeholders */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Dashboards & Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('donor-dashboard')} className="hover:text-red-400 transition-colors">
                  Volunteer Donor Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('patient-dashboard')} className="hover:text-red-400 transition-colors">
                  Patient & Hospital Requisition
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blood-bank-dashboard')} className="hover:text-red-400 transition-colors">
                  Blood Bank Inventory & Expiry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-red-400 transition-colors">
                  Healthcare Admin Console
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-red-400 transition-colors font-semibold text-emerald-400">
                  Register as a Lifesaver
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical Policy & Exhibition Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Medical Governance
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Compliant with National Blood Transfusion Council (NBTC) guidelines & WHO standards. Red blood cell compatibility calculations are advisory; laboratory crossmatching is mandatory.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Privacy Protected</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 LIFE LINK Systems. All rights reserved.</p>
          <div className="flex items-center space-x-2">
            <span>Built for AI & Data Science Exhibition</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-red-400">
              Made with <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400" /> for Human Lives
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
