import React from 'react';
import {
  Heart,
  Droplet,
  ShieldCheck,
  Target,
  Sparkles,
  Award,
  Users,
  Compass,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

export const AboutUs: React.FC = () => {
  const pillars = [
    {
      title: 'Smart Clinical Matching',
      desc: 'Moving beyond naive keyword searches to a clinical red-cell compatibility engine factoring in ABO/Rh antigens, hyper-local proximity, and 90-day cooldown eligibility.',
      icon: Sparkles
    },
    {
      title: 'High-Priority Emergency SOS',
      desc: 'Broadcast engine designed for acute surgical, trauma, and obstetric emergencies, reaching on-call verified lifesavers in under 2 minutes.',
      icon: Heart
    },
    {
      title: 'Privacy-First Architecture',
      desc: 'Strict privacy-preserving contact protocols. Volunteer donor phone numbers are shielded until explicit bilateral mutual consent is established.',
      icon: ShieldCheck
    },
    {
      title: 'College & Youth Mobilization',
      desc: 'National inter-collegiate championship gamifying donation with digital badges, verified impact scores, and transparent drive administration.',
      icon: Users
    }
  ];

  const myths = [
    {
      myth: 'Donating blood makes you weak or sick for days.',
      fact: 'Your body replaces plasma volume in 24 to 48 hours and red cells in a few weeks. Donors resume normal light activities within hours.'
    },
    {
      myth: 'You cannot donate blood if you have a tattoo.',
      fact: 'In India, you can safely donate 6 to 12 months after receiving a tattoo or piercing once the skin is fully healed and free of infection.'
    },
    {
      myth: 'Rare blood group patients can receive universal O- blood indefinitely.',
      fact: 'Ultra-rare phenotypes like Bombay (Oh) or Rh-null will suffer lethal acute hemolytic reactions if given standard O- RBCs due to plasma antibodies.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-[#B71C1C] text-xs font-bold border border-red-200">
          <Droplet className="w-3.5 h-3.5 fill-[#B71C1C]" />
          <span>About LIFE LINK Healthcare Network</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
          Every Drop Connects a Life.
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          LIFE LINK is an intelligent healthcare infrastructure bridging critical delays between voluntary blood donors, emergency patients, accredited blood centers, and collegiate communities.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#B71C1C] flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            To eliminate preventable mortality arising from acute blood shortages and logistical delays by pairing real-time clinical matching algorithms with community-driven voluntary donation.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Our Vision</h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            A nationwide transparent healthcare ecosystem where no surgical table, trauma center, or cancer ward waits in desperation for a compatible unit of blood.
          </p>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#E53935]">
            Engineering & Medical Precision
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-1">
            Why LIFE LINK is More Than a Register
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#B71C1C] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blood Donation Facts & Myths */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card space-y-6">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-[#B71C1C]" />
          <h3 className="text-lg font-black text-gray-900">
            Medical Facts & Myths Debunked
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myths.map((m, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-2 text-xs">
              <span className="text-red-600 font-bold block">❌ Myth:</span>
              <p className="text-gray-800 font-semibold">{m.myth}</p>
              <span className="text-emerald-700 font-bold block pt-2">✓ Clinical Fact:</span>
              <p className="text-gray-600 leading-relaxed">{m.fact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Exhibition Attribution */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 text-center space-y-3">
        <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
          University Engineering Showcase
        </span>
        <h3 className="text-xl font-bold">
          AI & Data Science Senior Capstone Project
        </h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Developed as a comprehensive full-stack healthcare platform demonstrating automated donor matching algorithms, real-time emergency broadcast protocols, and role-based data architecture.
        </p>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};
