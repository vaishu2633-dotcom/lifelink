import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { Donor, BloodBank, BloodRequest, DonationCamp } from '../types';
import {
  Users,
  ShieldCheck,
  Building,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  BarChart3,
  TrendingUp,
  FileText,
  Filter,
  Check,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>(() => dataService.getDonors());
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>(() => dataService.getBloodBanks());
  const [camps, setCamps] = useState<DonationCamp[]>(() => dataService.getCamps());
  const [activeTab, setActiveTab] = useState<'overview' | 'donors' | 'bloodbanks' | 'camps'>('overview');

  const stats = dataService.getAdminStats();

  const handleVerifyDonor = (id: string, current: boolean) => {
    dataService.verifyDonor(id, !current);
    setDonors(dataService.getDonors());
  };

  const handleVerifyBloodBank = (id: string, current: boolean) => {
    dataService.verifyBloodBank(id, !current);
    setBloodBanks(dataService.getBloodBanks());
  };

  // Mock data for charts
  const bloodSupplyDemand = [
    { group: 'O+', supply: 105, demand: 88 },
    { group: 'O-', supply: 25, demand: 42 }, // Deficit
    { group: 'A+', supply: 59, demand: 48 },
    { group: 'A-', supply: 20, demand: 18 },
    { group: 'B+', supply: 87, demand: 75 },
    { group: 'B-', supply: 11, demand: 22 }, // Deficit
    { group: 'AB+', supply: 34, demand: 25 },
    { group: 'AB-', supply: 5, demand: 12 },  // Deficit
    { group: 'Oh', supply: 2, demand: 3 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-extrabold text-[10px] uppercase tracking-wider border border-red-500/30">
            System Administrator Operations Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
            LIFE LINK National Healthcare Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-tenant monitoring, donor compliance verification and blood inventory logistics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            All Regional Networks Healthy
          </span>
        </div>
      </div>

      {/* KPI METRICS (Requirement 10) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Total Donors</span>
          <div className="text-2xl font-black text-gray-900 mt-1">{stats.totalDonors}</div>
          <span className="text-[10px] text-emerald-600 font-bold">100% Volunteer</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Blood Banks</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{stats.totalBloodBanks}</div>
          <span className="text-[10px] text-blue-600 font-semibold">Licensed Centers</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Pending Reqs</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.pendingRequests}</div>
          <span className="text-[10px] text-amber-600 font-semibold">In Coordination</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Emergency SOS</span>
          <div className="text-2xl font-black text-red-600 mt-1">{stats.emergencyRequests}</div>
          <span className="text-[10px] text-red-600 font-bold">High Priority</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Fulfilled Reqs</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.fulfilledRequests}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Transfused</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Total Stock Units</span>
          <div className="text-2xl font-black text-purple-600 mt-1">{stats.totalStockUnits}</div>
          <span className="text-[10px] text-purple-600 font-semibold">Across Centers</span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Analytics & Supply-Demand
        </button>
        <button
          onClick={() => setActiveTab('donors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'donors'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Donor Verification Console ({donors.length})
        </button>
        <button
          onClick={() => setActiveTab('bloodbanks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bloodbanks'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Blood Bank Licensure ({bloodBanks.length})
        </button>
      </div>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Supply vs Demand Chart Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-gray-900">
                  Regional Blood Supply vs Demand Dynamics
                </h3>
                <p className="text-xs text-gray-500">
                  Visual inventory buffer index comparing units stored in blood banks vs active hospital requisitions.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-gray-700">
                  <span className="w-3 h-3 rounded bg-[#B71C1C]"></span> Stock Available
                </span>
                <span className="flex items-center gap-1.5 font-bold text-gray-700">
                  <span className="w-3 h-3 rounded bg-amber-400"></span> Active Demand
                </span>
              </div>
            </div>

            {/* Custom Interactive SVG/HTML Bar Chart */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-4 pt-4">
              {bloodSupplyDemand.map(item => {
                const isDeficit = item.supply < item.demand;
                return (
                  <div key={item.group} className="flex flex-col items-center">
                    <div className="h-44 w-full bg-gray-50 rounded-2xl p-2 flex items-end justify-center gap-1.5 relative border border-gray-100">
                      {/* Supply bar */}
                      <div
                        style={{ height: `${Math.min(100, (item.supply / 110) * 100)}%` }}
                        className="w-4 rounded-t-lg bg-[#B71C1C] transition-all duration-500 hover:opacity-90 relative group"
                        title={`Supply: ${item.supply} units`}
                      ></div>
                      {/* Demand bar */}
                      <div
                        style={{ height: `${Math.min(100, (item.demand / 110) * 100)}%` }}
                        className="w-4 rounded-t-lg bg-amber-400 transition-all duration-500 hover:opacity-90 relative group"
                        title={`Demand: ${item.demand} units`}
                      ></div>
                    </div>

                    <span className="font-black text-xs text-gray-900 mt-2">{item.group}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                        isDeficit ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isDeficit ? 'Deficit' : 'Balanced'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DONOR VERIFICATION TABLE */}
      {activeTab === 'donors' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-900">
                Registered Volunteer Donor Directory
              </h3>
              <p className="text-xs text-gray-500">
                Review self-reported medical eligibility, donor card credentials and toggle verification badges.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Donor Name & Card</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Donations</th>
                  <th className="py-3 px-4">Impact Score</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donors.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{d.full_name}</div>
                      <div className="text-[10px] font-mono text-gray-400">{d.digital_card_id}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="w-7 h-7 rounded-lg bg-red-100 text-[#B71C1C] font-black text-xs inline-flex items-center justify-center">
                        {d.blood_group}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {d.area}, {d.city}
                    </td>

                    <td className="py-3 px-4 font-bold text-gray-800">
                      {d.total_donations} times
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-[#B71C1C]">
                      {d.impact_score} Pts
                    </td>

                    <td className="py-3 px-4">
                      {d.is_verified ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold text-[10px]">
                          Pending Review
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleVerifyDonor(d.id, d.is_verified)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          d.is_verified
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                        }`}
                      >
                        {d.is_verified ? 'Revoke' : 'Verify Donor'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BLOOD BANK LICENSURE */}
      {activeTab === 'bloodbanks' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-900">
                Authorized Regional Blood Bank Registry
              </h3>
              <p className="text-xs text-gray-500">
                Verification of regulatory drug controller & NBTC licensing credentials.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Center Name</th>
                  <th className="py-3 px-4">License Number</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Licensure Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bloodBanks.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">{b.name}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-700">{b.license_number}</td>
                    <td className="py-3 px-4 text-gray-600">{b.area}, {b.city}</td>
                    <td className="py-3 px-4 font-mono text-gray-600">{b.phone}</td>
                    <td className="py-3 px-4">
                      {b.is_verified ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Accredited</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Audit Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleVerifyBloodBank(b.id, b.is_verified)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          b.is_verified
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                        }`}
                      >
                        {b.is_verified ? 'Suspend' : 'Verify & Approve'}
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
