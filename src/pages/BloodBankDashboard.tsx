import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { BloodGroup, BloodInventoryItem } from '../types';
import {
  Building2,
  PlusCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
  Package,
  TrendingDown,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'Oh (Bombay)', 'Rh-null'];

export const BloodBankDashboard: React.FC = () => {
  const { user } = useAuth();
  const bloodBanks = dataService.getBloodBanks();
  const currentBank = bloodBanks[0]; // Default to LifeCare Central Blood Center for demo

  const [inventory, setInventory] = useState<BloodInventoryItem[]>(() =>
    dataService.getInventoryByBank(currentBank.id)
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O+');
  const [units, setUnits] = useState<number>(10);
  const [collectionDate, setCollectionDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Compute standard 35-day whole blood expiry date
  const computeDefaultExpiry = (dateStr: string) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 35);
    return d.toISOString().split('T')[0];
  };

  const [expiryDate, setExpiryDate] = useState<string>(() => computeDefaultExpiry(new Date().toISOString().split('T')[0]));

  const refreshInventory = () => {
    setInventory(dataService.getInventoryByBank(currentBank.id));
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();

    dataService.addInventoryItem({
      blood_bank_id: currentBank.id,
      blood_group: selectedGroup,
      units: Number(units),
      collection_date: collectionDate,
      expiry_date: expiryDate
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#B71C1C', '#E53935', '#00C853']
    });

    setShowAddModal(false);
    refreshInventory();
  };

  const handleUpdateUnits = (itemId: string, newUnits: number) => {
    dataService.updateInventoryUnits(itemId, newUnits);
    refreshInventory();
  };

  // Expiring inventory tracker (within 7 days)
  const expiringItems = dataService.getExpiringInventory(currentBank.id);
  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. BLOOD BANK HEADER BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] text-white flex items-center justify-center flex-shrink-0 shadow-lg">
            <Building2 className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-950">
                {currentBank.name}
              </h1>
              {currentBank.is_verified && (
                <span title="Accredited Blood Bank">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-gray-700 font-semibold">License: {currentBank.license_number}</span>
              <span>•</span>
              <span>{currentBank.address}</span>
            </p>

            <div className="flex flex-wrap gap-2 mt-2.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Authorized Transfusion Staff: {user?.full_name || 'Dr. Sunita Rao'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {currentBank.operating_hours}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center space-x-2 self-start md:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Blood Stock</span>
        </button>
      </div>

      {/* 2. BLOOD EXPIRY TRACKER (Requirement 9.F) */}
      {expiringItems.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-950">
                Blood Expiry Warning: Critical Attention Required ({expiringItems.length} Batches)
              </h3>
              <p className="text-xs text-amber-800">
                The following blood units will reach shelf-life expiry within 7 days. Prioritize these batches for incoming planned surgical requisitions to prevent wastage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {expiringItems.map(item => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-[#B71C1C] font-black text-xs flex items-center justify-center">
                    {item.blood_group}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">
                      {item.units} Units Available
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold">
                      Expires: {item.expiry_date}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[9px] uppercase">
                  &lt;7 Days Left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. STOCK OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-card text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Available</span>
          <div className="text-3xl font-black text-gray-900 mt-1">{totalUnits}</div>
          <span className="text-[10px] text-gray-500">Units in Cold Storage</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-card text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Expiring Soon</span>
          <div className="text-3xl font-black text-amber-600 mt-1">
            {expiringItems.reduce((acc, curr) => acc + curr.units, 0)}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold">Needs Fast-Track</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-card text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Storage Temp</span>
          <div className="text-3xl font-black text-blue-600 mt-1">3.4°C</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Optimal Standard (2-6°C)</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-card text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Rare Stock (Oh/Rh-)</span>
          <div className="text-3xl font-black text-purple-600 mt-1">
            {inventory.filter(i => i.blood_group === 'Oh (Bombay)' || i.blood_group === 'Rh-null').reduce((s, i) => s + i.units, 0)}
          </div>
          <span className="text-[10px] text-purple-600 font-semibold">Rare Phenotype Vault</span>
        </div>
      </div>

      {/* 4. INVENTORY MANAGEMENT TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">
              Live Blood Component Inventory
            </h2>
            <p className="text-xs text-gray-500">
              Only authorized blood bank technicians can modify certified unit counts.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Showing {inventory.length} Batches</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Available Units</th>
                <th className="py-3 px-4">Collection Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Safety Status</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-2">
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] text-white flex items-center justify-center font-black text-xs">
                        {item.blood_group}
                      </span>
                      <strong className="text-gray-900">{item.blood_group}</strong>
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-sm font-black text-gray-900">{item.units}</span>
                    <span className="text-gray-400 text-[11px] ml-1">Bags</span>
                  </td>

                  <td className="py-3 px-4 font-mono text-gray-600">{item.collection_date}</td>

                  <td className="py-3 px-4 font-mono font-semibold text-gray-800">
                    {item.expiry_date}
                  </td>

                  <td className="py-3 px-4">
                    {item.status === 'expiring_soon' ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Expiring Soon</span>
                      </span>
                    ) : item.status === 'expired' ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-900 font-bold text-[10px] flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>Expired</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Safe & Certified</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center space-x-1.5 bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => handleUpdateUnits(item.id, item.units - 1)}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-gray-200 text-gray-800 font-black flex items-center justify-center shadow-sm"
                        title="Deduct 1 unit (transfused)"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold text-gray-800">{item.units}</span>
                      <button
                        onClick={() => handleUpdateUnits(item.id, item.units + 1)}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-gray-200 text-gray-800 font-black flex items-center justify-center shadow-sm"
                        title="Add 1 unit"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. ADD BLOOD STOCK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900">
                Log New Blood Collection Batch
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStock} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Blood Group *</label>
                <select
                  value={selectedGroup}
                  onChange={e => setSelectedGroup(e.target.value as BloodGroup)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Number of Units (Bags) *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={units}
                  onChange={e => setUnits(parseInt(e.target.value) || 1)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Collection Date *</label>
                <input
                  type="date"
                  required
                  value={collectionDate}
                  onChange={e => {
                    setCollectionDate(e.target.value);
                    setExpiryDate(computeDefaultExpiry(e.target.value));
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Expiry Date (Standard 35-42 days for CPDA-1 RBC) *
                </label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white font-bold shadow-md"
                >
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
