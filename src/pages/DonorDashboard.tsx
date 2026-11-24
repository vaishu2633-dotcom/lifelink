import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { DigitalDonorCard } from '../components/common/DigitalDonorCard';
import {
  Heart,
  Award,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DonorDashboardProps {
  onNavigate: (page: string) => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({ onNavigate }) => {
  const { user, donorProfile, updateDonorAvailability } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'card' | 'history'>('overview');

  // Fallback donor info if logged in as another role
  const donor = donorProfile || dataService.getDonors()[0];
  const [isAvailable, setIsAvailable] = useState(donor.is_available);

  // Nearby requests suitable for donor's blood group
  const allRequests = dataService.getRequests();
  const nearbyRequests = allRequests.filter(r => r.city === donor.city && r.status !== 'fulfilled');

  const upcomingCamps = dataService.getCamps().slice(0, 2);

  // Past donation history mock records
  const donationHistory = [
    {
      id: 'don-hist-1',
      date: donor.last_donation_date || '2026-07-15',
      center: 'LifeCare Central Blood Center',
      units: '1 Unit (Packed RBC)',
      certificateId: 'LL-CERT-2026-8812',
      status: 'Verified & Transfused'
    },
    {
      id: 'don-hist-2',
      date: '2026-03-10',
      center: 'COEP Mega Blood Donation Drive',
      units: '1 Unit (Whole Blood)',
      certificateId: 'LL-CERT-2026-4401',
      status: 'Verified & Transfused'
    },
    {
      id: 'don-hist-3',
      date: '2025-11-20',
      center: 'Red Cross Regional Blood Center',
      units: '1 Unit (Platelet Apheresis)',
      certificateId: 'LL-CERT-2025-9921',
      status: 'Verified & Transfused'
    }
  ];

  const handleToggle = () => {
    const updated = updateDonorAvailability();
    setIsAvailable(updated);
  };

  const handleAcceptRequest = (requestId: string) => {
    dataService.respondToRequest({
      request_id: requestId,
      donor_id: donor.id,
      donor_name: donor.full_name,
      donor_phone: donor.phone,
      donor_blood_group: donor.blood_group,
      status: 'confirmed',
      message: 'Accepted via Donor Dashboard. Dispatched to hospital blood bank.'
    });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#00C853', '#B71C1C', '#E53935']
    });

    alert('Thank you, Lifesaver! The attending hospital clinician has been notified of your acceptance.');
  };

  const handleDeclineRequest = (requestId: string) => {
    alert('Request dismissed from your active priority queue.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. WELCOME HERO & PROFILE BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] text-white flex flex-col items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-[10px] font-black uppercase text-white/80">BLOOD</span>
            <span className="text-2xl sm:text-3xl font-black leading-none">{donor.blood_group}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-950">
                Welcome back, {donor.full_name}!
              </h1>
              {donor.is_verified && (
                <span title="Verified Lifesaver">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <span>{donor.area}, {donor.city}</span>
              <span>•</span>
              <span className="font-mono text-gray-600 font-semibold">{donor.digital_card_id}</span>
              {donor.college_name && (
                <>
                  <span>•</span>
                  <span className="text-[#B71C1C] font-semibold">{donor.college_name}</span>
                </>
              )}
            </p>

            {/* Badges Pill */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {donor.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center gap-1"
                >
                  <Award className="w-3 h-3 text-amber-500" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AVAILABILITY TOGGLE CARD (Requirement 5) */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 flex items-center justify-between sm:justify-start space-x-4 self-start md:self-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Emergency Availability
            </span>
            <span className={`text-xs font-bold ${isAvailable ? 'text-emerald-700' : 'text-gray-500'}`}>
              {isAvailable ? '● Available for Urgent Calls' : '○ Cooldown / Unavailable'}
            </span>
          </div>

          <button
            onClick={handleToggle}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isAvailable ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
            aria-label="Toggle Availability"
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                isAvailable ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. STATS & DONOR IMPACT METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Donations</span>
            <Heart className="w-5 h-5 text-[#E53935]" />
          </div>
          <div className="text-3xl font-black text-gray-900 mt-2">
            {donor.total_donations} <span className="text-xs font-semibold text-gray-400">Times</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            ✓ 100% Certified Transfusion
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Donor Impact Score</span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-[#B71C1C] mt-2">
            {donor.impact_score} <span className="text-xs font-semibold text-gray-400">/ 100</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Top 5% among volunteer donors
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Estimated Lives Saved</span>
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2">
            {donor.total_donations * 3} <span className="text-xs font-semibold text-gray-400">Patients</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            (RBCs, Platelets & Cryoprecipitate)
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Next Eligible Date</span>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-xl font-black text-gray-900 mt-2">
            Eligible Now
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            90-day cooldown cleared
          </p>
        </div>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-[#B71C1C] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Nearby Requests & Camps
        </button>
        <button
          onClick={() => setActiveTab('card')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'card'
              ? 'bg-[#B71C1C] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Digital Donor ID Card
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-[#B71C1C] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Donation History & Certificates
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nearby Blood Requests (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-gray-900">
                Nearby Emergency Blood Requests ({nearbyRequests.length})
              </h2>
              <span className="text-xs text-gray-500">Matching {donor.city} hospitals</span>
            </div>

            {nearbyRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-gray-100">
                <p className="text-xs text-gray-500">No active emergency requests in your area right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {nearbyRequests.map(req => (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              req.is_sos ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {req.is_sos ? 'EMERGENCY SOS' : 'URGENT'}
                          </span>
                          <span className="text-xs text-gray-400">{req.city}</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mt-1">
                          Patient: {req.patient_name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{req.hospital_name} ({req.hospital_location})</span>
                        </p>
                      </div>

                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] text-white flex flex-col items-center justify-center shadow-md">
                        <span className="text-[8px] font-bold uppercase">NEED</span>
                        <span className="text-base font-black">{req.blood_group}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">
                      "{req.notes}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className="text-xs font-semibold text-gray-700">
                        Required: {req.units_needed} Unit(s)
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="px-4 py-1.5 rounded-xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>I Will Donate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Camps Preview (1 Col) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-gray-900">Upcoming Camps</h2>
              <button
                onClick={() => onNavigate('camps')}
                className="text-xs font-bold text-[#B71C1C] hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {upcomingCamps.map(camp => (
                <div
                  key={camp.id}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-card space-y-3"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    {camp.date}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{camp.venue}, {camp.city}</span>
                  </p>
                  <button
                    onClick={() => {
                      dataService.registerForCamp(camp.id, donor.full_name, donor.phone, donor.blood_group);
                      alert(`Successfully registered for ${camp.title}!`);
                    }}
                    className="w-full py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all"
                  >
                    Register for Drive
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DIGITAL DONOR CARD */}
      {activeTab === 'card' && (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-card">
          <div className="text-center max-w-md mx-auto mb-6">
            <h2 className="text-lg font-black text-gray-900">
              Your Official Digital Lifesaver Credential
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Present this verified card at certified blood centers or hospital transfusion laboratories for immediate verification.
            </p>
          </div>

          <DigitalDonorCard donor={donor} />
        </div>
      )}

      {/* TAB CONTENT: DONATION HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Verified Donation Record Log
              </h2>
              <p className="text-xs text-gray-500">
                Official records authenticated by accredited transfusion laboratories.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              {donationHistory.length} Verified Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Blood Bank / Camp Venue</th>
                  <th className="py-3 px-4">Donation Type</th>
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donationHistory.map(hist => (
                  <tr key={hist.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{hist.date}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{hist.center}</td>
                    <td className="py-3 px-4 text-gray-600">{hist.units}</td>
                    <td className="py-3 px-4 font-mono text-gray-500">{hist.certificateId}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {hist.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Certificate ${hist.certificateId} generated. Print dialog opening...`)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[10px] inline-flex items-center gap-1"
                      >
                        <FileCheck className="w-3 h-3 text-emerald-600" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
