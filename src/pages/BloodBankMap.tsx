import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { BloodBank, BloodGroup } from '../types';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Compass,
  Layers,
  ArrowRight
} from 'lucide-react';

const CITIES = ['All Cities', 'Mumbai', 'Pune', 'Bengaluru', 'Delhi'];
const BLOOD_GROUPS: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

interface BloodBankMapProps {
  onNavigate: (page: string) => void;
}

export const BloodBankMap: React.FC<BloodBankMapProps> = ({ onNavigate }) => {
  const bloodBanks = dataService.getBloodBanks();
  const allInventory = dataService.getInventory();

  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('All');
  const [activeBankId, setActiveBankId] = useState<string>(bloodBanks[0]?.id || '');

  const filteredBanks = bloodBanks.filter(b => {
    if (selectedCity !== 'All Cities' && b.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (searchQuery && !b.name.toLowerCase().includes(searchQuery.toLowerCase()) && !b.area.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const activeBank = bloodBanks.find(b => b.id === activeBankId) || bloodBanks[0];
  const activeBankStock = allInventory.filter(i => i.blood_bank_id === activeBank?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#E53935]">
            Verified Facilities
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-950 mt-1">
            Blood Bank Map & Stock Directory
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time component laboratory directory with verifiable license numbers and live storage counts.
          </p>
        </div>

        <button
          onClick={() => onNavigate('blood-bank-dashboard')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all self-start"
        >
          Staff Dashboard Login →
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-card flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by center name or locality..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
          >
            {CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2-COLUMN VIEW: MAP VISUALIZATION (LEFT) + DETAILS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive Simulated Healthcare Map */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#B71C1C]" />
                <span>Geographical Coverage & Centers</span>
              </h3>
              <span className="text-[11px] text-gray-400">Click any facility pin to view live stock</span>
            </div>

            {/* Stylized Vector Map Canvas / Simulation */}
            <div className="relative w-full h-80 sm:h-96 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 rounded-2xl overflow-hidden border border-gray-200 p-4">
              {/* Map grid lines */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* Center Pins */}
              {filteredBanks.map((bank, index) => {
                const isSelected = bank.id === activeBankId;
                // Position simulation coordinates
                const positions = [
                  { top: '35%', left: '30%' },
                  { top: '55%', left: '45%' },
                  { top: '75%', left: '60%' },
                  { top: '25%', left: '70%' },
                  { top: '65%', left: '35%' }
                ];
                const pos = positions[index % positions.length];

                return (
                  <button
                    key={bank.id}
                    onClick={() => setActiveBankId(bank.id)}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl flex items-center space-x-2 transition-all transform hover:scale-110 shadow-lg ${
                      isSelected
                        ? 'bg-[#B71C1C] text-white ring-4 ring-red-300 z-30 scale-105'
                        : 'bg-white text-gray-800 hover:bg-red-50 z-20'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#B71C1C]'}`} />
                    <span className="text-[11px] font-black truncate max-w-[120px]">
                      {bank.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}

              {/* Map Legend */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200 text-[10px] text-gray-600 font-semibold shadow-sm">
                ● 24x7 Accredited Component Labs
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-4">
            GPS locations verified by regional state health authority licensing registers.
          </p>
        </div>

        {/* Selected Blood Bank Details Card */}
        <div className="lg:col-span-5 space-y-6">
          {activeBank && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card space-y-6">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                    Accredited Center
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {activeBank.license_number}
                  </span>
                </div>

                <h2 className="text-lg font-black text-gray-900 mt-1">
                  {activeBank.name}
                </h2>
                <p className="text-xs text-gray-500 flex items-start gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{activeBank.address}</span>
                </p>
              </div>

              {/* Contact and Operating Hours */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Phone Hotline</span>
                  <span className="font-mono font-bold text-gray-900">{activeBank.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Service Hours</span>
                  <span className="font-semibold text-emerald-700">{activeBank.operating_hours}</span>
                </div>
              </div>

              {/* Live Inventory Preview for this bank */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#B71C1C]" />
                  <span>Verified Cold Storage Inventory</span>
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  {activeBankStock.map(stock => (
                    <div
                      key={stock.id}
                      className="bg-red-50/50 p-2.5 rounded-xl border border-red-100 text-center"
                    >
                      <span className="text-xs font-black text-[#B71C1C] block">
                        {stock.blood_group}
                      </span>
                      <span className="text-base font-black text-gray-900 leading-tight">
                        {stock.units}
                      </span>
                      <span className="text-[9px] text-gray-400 block">Units</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${activeBank.phone}`}
                  className="w-full py-3 rounded-xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Emergency Blood Desk</span>
                </a>
              </div>
            </div>
          )}

          {/* Other Centers List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Other Regional Blood Centers
            </h4>
            <div className="space-y-2">
              {filteredBanks.filter(b => b.id !== activeBankId).map(b => (
                <div
                  key={b.id}
                  onClick={() => setActiveBankId(b.id)}
                  className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm hover:border-red-200 cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-gray-900">{b.name}</h5>
                    <p className="text-[11px] text-gray-400">{b.area}, {b.city}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
