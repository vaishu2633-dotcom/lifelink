import React, { useState } from 'react';
import {
  Heart,
  Droplet,
  Search,
  AlertCircle,
  Users,
  ShieldCheck,
  Building,
  Calendar,
  Sparkles,
  ArrowRight,
  Activity,
  Award,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { BloodGroup } from '../types';
import { BloodCompatibilityTable } from '../components/common/BloodCompatibilityTable';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const sosRequests = dataService.getSOSRequests().slice(0, 2);
  const upcomingCamps = dataService.getCamps().slice(0, 3);
  const stats = dataService.getAdminStats();

  const bloodGroupStats: Array<{ group: BloodGroup; type: string; color: string }> = [
    { group: 'O-', type: 'Universal RBC Donor', color: 'from-red-600 to-rose-700' },
    { group: 'O+', type: 'Most Common', color: 'from-rose-600 to-red-700' },
    { group: 'A+', type: 'High Demand', color: 'from-red-500 to-rose-600' },
    { group: 'A-', type: 'Rare Negative', color: 'from-amber-600 to-orange-700' },
    { group: 'B+', type: 'Frequent Demand', color: 'from-red-600 to-red-800' },
    { group: 'B-', type: 'Rare Negative', color: 'from-orange-600 to-rose-700' },
    { group: 'AB+', type: 'Universal Recipient', color: 'from-purple-600 to-indigo-700' },
    { group: 'AB-', type: 'Ultra Rare (<1%)', color: 'from-violet-700 to-purple-800' }
  ];

  const stories = [
    {
      name: 'Rohan Deshpande',
      role: 'Regular Platelet Donor (14 Times)',
      quote: 'Receiving a real-time SOS notification when a young cancer patient needed platelets at KEM Hospital allowed me to arrive within 40 minutes. Knowing your single donation directly stabilized someone is an unmatched feeling.',
      location: 'Pune',
      group: 'O+'
    },
    {
      name: 'Dr. Shalini Swaminathan',
      role: 'Pediatric Surgeon & Donor',
      quote: 'In surgical emergencies, time is the ultimate barrier. LIFE LINK’s smart donor matching connects our blood bank with verified donors in minutes instead of desperate frantic phone calls.',
      location: 'Mumbai',
      group: 'A-'
    },
    {
      name: 'Priya Iyer',
      role: 'COEP Student Coordinator',
      quote: 'Our college mobilized over 300 students during the annual drive. The digital donor card and impact badges turned voluntary blood donation into a campus-wide movement of pride.',
      location: 'COEP Tech',
      group: 'B+'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pb-24 lg:pb-32 bg-gradient-to-b from-red-50/70 via-white to-[#F7F7F9]">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-400/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Pill */}
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-red-200/80 shadow-sm text-xs font-semibold text-[#B71C1C]">
              <span className="flex h-2 w-2 rounded-full bg-[#E53935] animate-ping"></span>
              <span>Intelligent Healthcare Network</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600 font-normal">Real-Time Blood Donor Matching</span>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="mt-6 text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              Your One Donation Can Give Someone{' '}
              <span className="bg-gradient-to-r from-[#B71C1C] via-[#E53935] to-rose-600 bg-clip-text text-transparent">
                Another Tomorrow.
              </span>
            </h1>
            <p className="mt-5 text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connecting blood donors, patients and blood banks through a smarter, faster and verified donation network.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('find-blood')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#B71C1C] to-[#E53935] hover:from-[#8E0E00] hover:to-[#B71C1C] text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Find Blood Now</span>
              </button>

              <button
                onClick={() => onNavigate('register')}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center space-x-2"
              >
                <Heart className="w-4 h-4 text-[#E53935]" />
                <span>Become a Donor</span>
              </button>

              <button
                onClick={() => onNavigate('emergency-sos')}
                className="px-6 py-3.5 rounded-2xl bg-red-950 hover:bg-black text-white font-bold text-sm shadow-lg shadow-red-950/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center space-x-2 border border-red-800"
              >
                <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
                <span>Emergency SOS</span>
              </button>
            </div>
          </div>

          {/* Quick Emergency Ticker if active SOS exists */}
          {sosRequests.length > 0 && (
            <div className="mt-12 max-w-3xl mx-auto bg-gradient-to-r from-red-600 to-rose-700 text-white p-3.5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center space-x-3 text-xs sm:text-sm font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping flex-shrink-0"></span>
                <span>
                  <strong>CRITICAL ALERT:</strong> Urgent {sosRequests[0].blood_group} needed at {sosRequests[0].hospital_name} ({sosRequests[0].city})
                </span>
              </div>
              <button
                onClick={() => onNavigate('emergency-sos')}
                className="whitespace-nowrap px-4 py-1.5 rounded-xl bg-white text-[#B71C1C] text-xs font-bold hover:bg-red-50 transition-colors shadow-sm flex items-center gap-1"
              >
                <span>View & Respond</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Animated Statistics Strip */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-card text-center hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#B71C1C] flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-gray-900 tracking-tight">1,240+</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
                Verified Donors
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-card text-center hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-gray-900 tracking-tight">3,890+</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
                Requests Fulfilled
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-card text-center hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Building className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-gray-900 tracking-tight">85+</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
                Licensed Blood Banks
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-card text-center hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-gray-900 tracking-tight">5,400+</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
                Lives Impacted
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#E53935]">
            Seamless 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            How LIFE LINK Connects Every Drop
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Engineered to eliminate delays during critical emergencies and maintain reliable supply for planned surgeries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-card hover:shadow-card-hover transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#B71C1C] flex items-center justify-center font-black text-lg mb-6 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Request or Register</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Patients and hospitals submit requirements with required units and hospital details. Volunteer donors register with their blood group and availability status.
            </p>
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center text-xs font-bold text-[#B71C1C]">
              <span>Instant registration in 60s</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-card hover:shadow-card-hover transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#B71C1C] flex items-center justify-center font-black text-lg mb-6 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Algorithm Matches</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our clinical logic computes ABO/Rh RBC compatibility, geographic proximity, self-reported 90-day cooldown eligibility and active availability score.
            </p>
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center text-xs font-bold text-[#B71C1C]">
              <span>Clinical RBC Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-card hover:shadow-card-hover transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#B71C1C] flex items-center justify-center font-black text-lg mb-6 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Connect & Save Lives</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Donors receive emergency broadcasts and confirm intent. Hospital blood banks perform laboratory crossmatching and update the digital inventory.
            </p>
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center text-xs font-bold text-[#B71C1C]">
              <span>Transparent Tracking</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. BLOOD GROUP MATRIX & COMPATIBILITY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E53935]">
              Blood Groups & Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Know Your Blood Type Compatibility
            </h2>
          </div>
          <button
            onClick={() => onNavigate('rare-blood')}
            className="text-xs font-bold text-[#B71C1C] hover:text-[#8E0E00] flex items-center gap-1 self-start"
          >
            <span>Explore Rare Blood Phenotypes (Bombay & Rh-null)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Blood Group Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {bloodGroupStats.map(item => (
            <div
              key={item.group}
              onClick={() => onNavigate('find-blood')}
              className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] text-white flex items-center justify-center font-black text-sm mx-auto shadow-sm group-hover:scale-105 transition-transform">
                {item.group}
              </div>
              <div className="text-xs font-bold text-gray-900 mt-2">{item.group}</div>
              <div className="text-[10px] text-gray-500 truncate">{item.type}</div>
            </div>
          ))}
        </div>

        {/* The Interactive Red Blood Cell Matrix Card */}
        <BloodCompatibilityTable />

        <div className="mt-6">
          <MedicalDisclaimer />
        </div>
      </section>

      {/* 4. FEATURED EMERGENCY SOS REQUESTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#B71C1C]">
                Urgent Blood Needs
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Active Hospital SOS Broadcasts
            </h2>
          </div>

          <button
            onClick={() => onNavigate('emergency-sos')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-[#B71C1C] hover:bg-red-100 transition-all flex items-center gap-1.5 self-start"
          >
            <span>View All SOS Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataService.getRequests().slice(0, 2).map(req => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 border border-red-100 shadow-card hover:shadow-card-hover transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      req.is_sos
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {req.is_sos ? 'CRITICAL SOS' : 'URGENT REQUIREMENT'}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2">
                    Patient: {req.patient_name}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{req.hospital_name}, {req.city}</span>
                  </p>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] text-white flex flex-col items-center justify-center shadow-md">
                  <span className="text-[9px] uppercase font-bold text-white/80">Need</span>
                  <span className="text-lg font-black">{req.blood_group}</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                "{req.notes}"
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Required Units</span>
                  <span className="font-bold text-gray-800">{req.units_needed} Units (Whole RBC)</span>
                </div>
                <button
                  onClick={() => onNavigate('emergency-sos')}
                  className="px-4 py-2 rounded-xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                >
                  <span>Respond / Donate</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. UPCOMING DONATION CAMPS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E53935]">
              Community Drives
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Upcoming Blood Donation Camps
            </h2>
          </div>
          <button
            onClick={() => onNavigate('camps')}
            className="text-xs font-bold text-[#B71C1C] hover:text-[#8E0E00] flex items-center gap-1 self-start"
          >
            <span>Browse Full Camp Calendar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingCamps.map(camp => (
            <div
              key={camp.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                    Upcoming Drive
                  </span>
                  <span className="font-mono text-gray-500 font-semibold">{camp.date}</span>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {camp.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Org: {camp.organizer_name}
                </p>

                <div className="mt-4 space-y-2 text-xs text-gray-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{camp.venue}, {camp.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{camp.start_time} - {camp.end_time}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">Registered Donors</span>
                  <span className="text-sm font-bold text-gray-900">{camp.registered_count} / {camp.target_units} Target</span>
                </div>
                <button
                  onClick={() => onNavigate('camps')}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. DONOR SUCCESS STORIES */}
      <section className="bg-slate-900 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-3xl my-10 max-w-7xl sm:mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-400">
            Real Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Stories That Connect Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Hear from our community of everyday lifesavers and medical coordinators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((st, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-red-600/30 text-red-400 flex items-center justify-center font-bold text-xs border border-red-500/30">
                    {st.group}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{st.location}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{st.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/80">
                <h4 className="text-sm font-bold text-white">{st.name}</h4>
                <p className="text-[11px] text-red-400 font-medium">{st.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#B71C1C] via-[#E53935] to-rose-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
              Join Our Lifesaving Community
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Save a Life Today?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-red-100 leading-relaxed">
              Register as a donor, get your Digital Donor Card, track your Impact Score, and receive verified notifications when a patient in your vicinity needs help.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-red-50 text-[#B71C1C] font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Register as Donor
            </button>
            <button
              onClick={() => onNavigate('find-blood')}
              className="px-6 py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 text-white font-bold text-sm border border-white/20 transition-all active:scale-95"
            >
              Search Blood Stock
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
