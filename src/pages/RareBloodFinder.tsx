import React, { useState } from 'react';
import { BloodGroup, Donor } from '../types';
import { dataService } from '../services/dataService';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import {
  Sparkles,
  Search,
  MapPin,
  ShieldAlert,
  AlertCircle,
  Phone,
  Info,
  CheckCircle2,
  Heart
} from 'lucide-react';

const RARE_GROUPS: BloodGroup[] = ['Oh (Bombay)', 'Rh-null', 'AB-', 'B-', 'A-'];
const CITIES = ['All Cities', 'Mumbai', 'Pune', 'Delhi', 'Bengaluru', 'Hyderabad'];

interface RareBloodFinderProps {
  onNavigate: (page: string) => void;
}

export const RareBloodFinder: React.FC<RareBloodFinderProps> = ({ onNavigate }) => {
  const [selectedRareGroup, setSelectedRareGroup] = useState<BloodGroup>('Oh (Bombay)');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  const allDonors = dataService.getDonors();
  const matchedDonors = allDonors.filter(d => {
    if (d.blood_group !== selectedRareGroup) return false;
    if (selectedCity !== 'All Cities' && d.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-purple-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-[10px] uppercase tracking-wider border border-purple-500/30 flex items-center gap-1.5 w-max">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Rare Phenotype Registry</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Rare Blood Finder
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl leading-relaxed">
              Specialized search and rapid response network for ultra-rare blood phenotypes including Bombay Blood Group (Oh) and Rh-null (Golden Blood).
            </p>
          </div>

          <button
            onClick={() => onNavigate('emergency-sos')}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#B71C1C] to-[#E53935] hover:from-[#8E0E00] hover:to-[#B71C1C] text-white font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-1.5 self-start md:self-center flex-shrink-0"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>Urgent Rare SOS Broadcast</span>
          </button>
        </div>
      </div>

      {/* RARE BLOOD EXPLAINER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
              Oh
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Bombay Blood Group (Oh Phenotype)
              </h3>
              <p className="text-[11px] text-gray-500">Prevalence: ~1 in 10,000 in India, 1 in 1,000,000 in Europe</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Individuals with the Bombay phenotype lack the H gene and cannot produce H antigen (the precursor to A and B antigens). They possess strong anti-H antibodies in plasma and <strong>can only receive red blood cells from another Bombay individual</strong>. Receiving standard O- blood can trigger fatal acute hemolytic reactions.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xs">
              Rh-null
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Golden Blood (Rh-null)
              </h3>
              <p className="text-[11px] text-gray-500">Fewer than 50 verified individuals recorded worldwide</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Rh-null individuals completely lack all 61 antigens in the Rh blood group system. It is considered universal blood for anyone with rare Rh subtypes, but an Rh-null patient <strong>can receive blood solely from another Rh-null donor</strong>.
          </p>
        </div>
      </div>

      {/* SEARCH CONTROLS */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
          <Search className="w-4 h-4 text-purple-600" />
          <span>Rare Blood Phenotype Search Criteria</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Select Rare Group *
            </label>
            <select
              value={selectedRareGroup}
              onChange={e => setSelectedRareGroup(e.target.value as BloodGroup)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-black text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {RARE_GROUPS.map(bg => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Location / Region
            </label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {CITIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MATCHED RARE DONORS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-gray-900">
            Verified Registered Rare Blood Donors ({matchedDonors.length})
          </h3>
          <span className="text-xs text-gray-500">
            Privacy-shielded profiles with direct coordinator dispatch
          </span>
        </div>

        {matchedDonors.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h4 className="text-sm font-bold text-gray-900">
              No registered donors currently matching in this immediate city
            </h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Rare blood cases typically require national inter-city coordination. Contact our 24/7 Rare Donor Emergency Desk.
            </p>
            <button
              onClick={() => onNavigate('emergency-sos')}
              className="px-4 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold shadow-md hover:bg-black"
            >
              Broadcast National Rare Requisition
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedDonors.map(donor => (
              <div
                key={donor.id}
                className="bg-white rounded-3xl p-6 border border-purple-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-800 text-white flex flex-col items-center justify-center shadow-md">
                      <span className="text-[8px] font-bold uppercase">RARE</span>
                      <span className="text-xs font-black leading-tight text-center px-1">
                        {donor.blood_group}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold text-[10px] uppercase">
                      National Registry
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-gray-900 capitalize">
                    {donor.full_name}
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{donor.area}, {donor.city}</span>
                  </p>

                  <div className="mt-4 bg-purple-50/60 rounded-xl p-3 text-xs space-y-1 text-purple-900 font-medium">
                    <div className="flex justify-between">
                      <span>Card ID:</span>
                      <span className="font-mono font-bold">{donor.digital_card_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Verified Donations:</span>
                      <span className="font-bold">{donor.total_donations} times</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Availability:</span>
                      <span className="font-bold text-emerald-700">● On-Call</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-400">
                    {donor.phone.slice(0, 8)} ••••
                  </span>
                  <button
                    onClick={() => {
                      dataService.pushNotification({
                        user_id: donor.user_id,
                        title: `CRITICAL RARE BLOOD REQUEST (${donor.blood_group})`,
                        message: `Emergency rare blood inquiry for ${donor.blood_group} received. Attending coordinator alerting your profile.`,
                        type: 'emergency',
                        link: '/donor-dashboard'
                      });
                      alert(`Urgent alert dispatched to rare donor ${donor.full_name}. Attending coordinator notified.`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
                  >
                    Alert Rare Donor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MedicalDisclaimer />
    </div>
  );
};
