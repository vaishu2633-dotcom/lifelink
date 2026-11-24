import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { College } from '../types';
import {
  GraduationCap,
  Trophy,
  Award,
  Users,
  PlusCircle,
  Flame,
  Medal,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CollegeNetworkProps {
  onNavigate: (page: string) => void;
}

export const CollegeNetwork: React.FC<CollegeNetworkProps> = ({ onNavigate }) => {
  const [colleges, setColleges] = useState<College[]>(() => dataService.getColleges());
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Registration Form
  const [name, setName] = useState('');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [code, setCode] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorContact, setCoordinatorContact] = useState('');

  const handleRegisterCollege = (e: React.FormEvent) => {
    e.preventDefault();

    dataService.registerCollege({
      name,
      city,
      state,
      code: code.toUpperCase(),
      coordinator_name: coordinatorName,
      coordinator_contact: coordinatorContact
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#B71C1C', '#E53935']
    });

    setShowRegisterModal(false);
    setColleges(dataService.getColleges());

    setName('');
    setCode('');
    setCoordinatorName('');
    setCoordinatorContact('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 via-[#B71C1C] to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 w-max">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Inter-College Lifesaver Championship</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              College Blood Donation Network
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-xl leading-relaxed">
              Empowering universities and NSS chapters to foster voluntary donation culture. Compete on the national leaderboard, track campus impact, and inspire youth lifesavers.
            </p>
          </div>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-red-50 text-[#B71C1C] font-black text-xs shadow-lg transition-all active:scale-95 flex items-center gap-1.5 self-start md:self-center flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#E53935]" />
            <span>Register Your Campus</span>
          </button>
        </div>
      </div>

      {/* TOP 3 PODIUM STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {colleges.slice(0, 3).map((col, idx) => {
          const podiumBadges = [
            { rank: '1st', color: 'from-amber-400 to-amber-600', text: 'Gold Trophy' },
            { rank: '2nd', color: 'from-slate-300 to-slate-500', text: 'Silver Trophy' },
            { rank: '3rd', color: 'from-amber-600 to-amber-800', text: 'Bronze Trophy' }
          ];
          const badge = podiumBadges[idx];

          return (
            <div
              key={col.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${badge.color} text-white flex items-center justify-center font-black text-sm shadow-md`}>
                    {idx + 1}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {badge.text}
                  </span>
                </div>

                <span className="font-mono text-xs font-bold text-[#B71C1C]">#{col.code}</span>
                <h3 className="text-base font-black text-gray-900 mt-0.5 leading-snug">
                  {col.name}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{col.city}, {col.state}</span>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Donors</span>
                  <span className="text-base font-black text-gray-900">{col.total_donors}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Units Donated</span>
                  <span className="text-base font-black text-[#B71C1C]">{col.total_units_donated}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL LEADERBOARD TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>National Inter-College Participation Leaderboard</span>
            </h2>
            <p className="text-xs text-gray-500">
              Rankings calculated dynamically based on total units donated during campus drives.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">Campus Code</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Registered Donors</th>
                <th className="py-3 px-4">Units Donated</th>
                <th className="py-3 px-4">NSS Coordinator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {colleges.map((col, index) => (
                <tr key={col.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                      index === 0
                        ? 'bg-amber-100 text-amber-800'
                        : index === 1
                        ? 'bg-slate-200 text-slate-700'
                        : index === 2
                        ? 'bg-amber-200/60 text-amber-900'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">{col.name}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#B71C1C]">{col.code}</td>
                  <td className="py-3 px-4 text-gray-600">{col.city}, {col.state}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800">{col.total_donors} students</td>
                  <td className="py-3 px-4 font-black text-[#B71C1C]">{col.total_units_donated} units</td>
                  <td className="py-3 px-4 text-gray-500">{col.coordinator_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTER COLLEGE MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900">
                Register Your University / College
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterCollege} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  College / Institute Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BITS Pilani Goa Campus"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Short Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BITS-GOA"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Faculty Coordinator / NSS Officer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Arvind Kulkarni"
                  value={coordinatorName}
                  onChange={e => setCoordinatorName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Official Coordinator Email / Phone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="nss@college.edu.in"
                  value={coordinatorContact}
                  onChange={e => setCoordinatorContact(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white font-bold shadow-md"
                >
                  Join Championship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
