import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Hospital Blood Integration Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#E53935]">
          24/7 National Emergency Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950">
          Connect with LIFE LINK
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Need immediate support, hospital inventory integration, or collegiate drive assistance? Our clinical desk is available round-the-clock.
        </p>
      </div>

      {/* EMERGENCY HELPLINES STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#B71C1C] text-white flex items-center justify-center mx-auto shadow-md">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">National Blood Bank Toll-Free</h3>
          <div className="text-3xl font-black text-[#B71C1C] font-mono">104</div>
          <p className="text-[11px] text-gray-500">Immediate state helpline for whole blood & platelets</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">National Emergency Ambulance</h3>
          <div className="text-3xl font-black text-emerald-700 font-mono">108</div>
          <p className="text-[11px] text-gray-500">Immediate trauma transfer & critical care dispatch</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-3xl p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Rare Blood Registry Desk</h3>
          <div className="text-2xl font-black text-purple-900 font-mono">+91 22 2830 0000</div>
          <p className="text-[11px] text-gray-500">Dedicated Bombay (Oh) & Rh-null coordinator hotline</p>
        </div>
      </div>

      {/* CONTACT FORM & LOCATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Send an Inquiry to Healthcare Operations
          </h2>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-950">Inquiry Dispatched!</h3>
              <p className="text-xs text-emerald-800">
                Thank you for contacting LIFE LINK. An authorized regional health officer will reach out within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Gupta"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@hospital.org"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Inquiry Category</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Hospital Blood Integration Inquiry">Hospital Blood Integration Inquiry</option>
                  <option value="College Blood Drive Permission">College Blood Drive Permission</option>
                  <option value="Rare Blood Group Crossmatch Query">Rare Blood Group Crossmatch Query</option>
                  <option value="Volunteer Donor Support">Volunteer Donor Support</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail your inquiry or hospital bed requirement..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Head Office & Coordinates */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card space-y-4">
            <h3 className="text-base font-bold text-gray-900">National Headquarters</h3>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B71C1C] flex-shrink-0 mt-0.5" />
                <span>
                  LIFE LINK Operations Command, Indian Red Cross Building, Central Avenue, New Delhi, India 110001
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B71C1C] flex-shrink-0" />
                <span>emergency-ops@lifelink.org</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#B71C1C] flex-shrink-0" />
                <span>24 Hours / 7 Days Live Transfusion Coordination</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-3 border border-slate-800">
            <h4 className="text-sm font-bold">University Exhibition Demo Notes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All demo requests, donor pledges, and stock adjustments made on this platform update local mock storage in real-time. Feel free to test and inspect all workflows!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
