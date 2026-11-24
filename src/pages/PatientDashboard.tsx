import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { BloodRequest, RequestStatus } from '../types';
import {
  Users,
  Clock,
  MapPin,
  Building,
  PlusCircle,
  Phone,
  CheckCircle2,
  AlertCircle,
  Radio,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface PatientDashboardProps {
  onNavigate: (page: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>(() => dataService.getRequests());

  const userRequests = requests; // In demo mode, show active requests for immediate inspection

  const refreshData = () => {
    setRequests(dataService.getRequests());
  };

  const handleUpdateStatus = (reqId: string, status: RequestStatus) => {
    dataService.updateRequestStatus(reqId, status);
    refreshData();
  };

  // Nearby blood banks with stock
  const bloodBanks = dataService.getBloodBanks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#B71C1C] font-extrabold text-[10px] uppercase">
              Patient & Hospital Care Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-gray-950 mt-1">
            Requisition Status & Lifesaver Responses
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Logged in as: <strong>{user?.full_name || 'Rajesh Patil'}</strong> ({user?.phone})
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('find-blood')}
            className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-all"
          >
            Search Donors
          </button>
          <button
            onClick={() => onNavigate('emergency-sos')}
            className="px-5 py-2.5 rounded-xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* ACTIVE REQUISITIONS */}
      <div className="space-y-6">
        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-600 animate-pulse" />
          <span>Active Requisitions & Attendant Pipeline</span>
        </h2>

        {userRequests.map(req => {
          const responses = dataService.getResponsesForRequest(req.id);

          return (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card hover:shadow-card-hover transition-all space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] text-white flex flex-col items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-[9px] font-black uppercase text-white/80">NEED</span>
                    <span className="text-xl font-black leading-none">{req.blood_group}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          req.is_sos ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {req.urgency.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">#{req.id.slice(-6)}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-gray-900 mt-1">
                      Patient: {req.patient_name}
                    </h3>

                    <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <span>{req.hospital_name}</span>
                      <span>•</span>
                      <span>{req.hospital_location}, {req.city}</span>
                    </p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-xl font-black text-gray-900">
                    {req.units_needed} <span className="text-xs font-normal text-gray-500">Units</span>
                  </div>
                  <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 capitalize">
                    Status: {req.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* RESPONDED DONORS SECTION */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#B71C1C]" />
                    <span>Volunteered Donors Responded ({responses.length})</span>
                  </h4>
                  <span className="text-[11px] text-gray-400">Attendants can coordinate directly</span>
                </div>

                {responses.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">
                    Waiting for registered donors to accept the broadcast. We are actively notifying verified lifesavers in {req.city}.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {responses.map(resp => (
                      <div
                        key={resp.id}
                        className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-sm flex items-start justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-gray-900">{resp.donor_name}</span>
                            <span className="px-1.5 py-0.2 rounded bg-red-100 text-[#B71C1C] font-black text-[10px]">
                              {resp.donor_blood_group}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1 italic">"{resp.message}"</p>
                          <div className="mt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{resp.donor_phone}</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-gray-400">
                          {new Date(resp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs text-gray-400">
                  Required by: <strong className="text-gray-700">{req.required_date}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  {req.status !== 'fulfilled' && (
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'fulfilled')}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Transfusion Completed</span>
                    </button>
                  )}
                  {req.status !== 'cancelled' && req.status !== 'fulfilled' && (
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'cancelled')}
                      className="px-3 py-1.5 rounded-xl text-gray-500 hover:bg-gray-100 text-xs font-semibold"
                    >
                      Cancel Requisition
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEARBY CERTIFIED BLOOD BANKS SUGGESTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-gray-900">
              Licensed Blood Banks with Available Units in Your City
            </h3>
            <p className="text-xs text-gray-500">
              Hospitals can also issue requisition slips to central component laboratories.
            </p>
          </div>
          <button
            onClick={() => onNavigate('blood-banks')}
            className="text-xs font-bold text-[#B71C1C] hover:underline"
          >
            View Full Inventory Directory →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bloodBanks.slice(0, 3).map(bank => (
            <div key={bank.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 truncate max-w-[200px]">{bank.name}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </div>
              <p className="text-gray-500 text-[11px] truncate">{bank.address}</p>
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="font-mono text-[#B71C1C] font-semibold">{bank.phone}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                  {bank.operating_hours}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
