import React, { useState } from 'react';
import { BloodGroup, UrgencyLevel, BloodRequest, RequestStatus } from '../types';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import {
  AlertCircle,
  PlusCircle,
  MapPin,
  Clock,
  Phone,
  Building,
  CheckCircle2,
  Users,
  ShieldAlert,
  Send,
  Sparkles,
  ChevronRight,
  Flame,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'Oh (Bombay)', 'Rh-null'];
const CITIES = ['Mumbai', 'Pune', 'Bengaluru', 'Delhi', 'Hyderabad', 'Chennai'];

const STATUS_STEPS: Array<{ key: RequestStatus; label: string; desc: string }> = [
  { key: 'pending', label: 'Broadcast Pending', desc: 'Alerting matched local donors' },
  { key: 'donor_contacted', label: 'Donor Contacted', desc: 'Donors reviewing requisition' },
  { key: 'donor_confirmed', label: 'Donor Confirmed', desc: 'Lifesaver dispatched to center' },
  { key: 'fulfilled', label: 'Fulfilled & Safe', desc: 'Crossmatch & transfusion complete' }
];

export const EmergencySOS: React.FC = () => {
  const { user, donorProfile, role } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>(() => dataService.getRequests());
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState(user?.phone || '');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalLocation, setHospitalLocation] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [area, setArea] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [unitsNeeded, setUnitsNeeded] = useState(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('critical_sos');
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Responding state for donors
  const [respondingRequestId, setRespondingRequestId] = useState<string | null>(null);
  const [responseMsg, setResponseMsg] = useState('I am nearby and can reach the hospital blood bank within 30-45 minutes.');

  const refreshRequests = () => {
    setRequests(dataService.getRequests());
  };

  const handleCreateSOS = (e: React.FormEvent) => {
    e.preventDefault();

    const newReq = dataService.createRequest({
      requester_id: user?.id || 'anon-requester',
      requester_name: user?.full_name || 'Emergency Attendant',
      patient_name: patientName,
      contact_number: contactNumber,
      hospital_name: hospitalName,
      hospital_location: hospitalLocation,
      city: city,
      area: area || 'Central',
      blood_group: bloodGroup,
      units_needed: Number(unitsNeeded),
      urgency: urgency,
      status: 'pending',
      notes: clinicalNotes || 'Critical emergency blood requisition.',
      is_sos: true,
      required_date: requiredDate
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#B71C1C', '#E53935', '#FFA000']
    });

    setShowCreateForm(false);
    refreshRequests();
    // Reset form
    setPatientName('');
    setHospitalName('');
    setHospitalLocation('');
    setClinicalNotes('');
  };

  const handleDonorRespond = (requestId: string) => {
    if (!donorProfile && role !== 'donor') {
      alert('Please switch to or register as a Donor to submit a donation response.');
      return;
    }

    const donorName = donorProfile ? donorProfile.full_name : user?.full_name || 'Volunteer Donor';
    const donorPhone = donorProfile ? donorProfile.phone : user?.phone || '+91 98000 00000';
    const donorBlood = donorProfile ? donorProfile.blood_group : 'O+';

    dataService.respondToRequest({
      request_id: requestId,
      donor_id: donorProfile?.id || 'donor-demo',
      donor_name: donorName,
      donor_phone: donorPhone,
      donor_blood_group: donorBlood,
      status: 'confirmed',
      message: responseMsg
    });

    dataService.updateRequestStatus(requestId, 'donor_confirmed');

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00C853', '#B71C1C', '#E53935']
    });

    setRespondingRequestId(null);
    refreshRequests();
  };

  const handleStatusUpdate = (requestId: string, nextStatus: RequestStatus) => {
    dataService.updateRequestStatus(requestId, nextStatus);
    refreshRequests();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* SOS Top Emergency Header */}
      <div className="bg-gradient-to-r from-red-950 via-[#B71C1C] to-red-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-red-700/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-xs font-bold text-red-200">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE EMERGENCY BROADCAST NETWORK</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Emergency SOS Blood Center
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-xl leading-relaxed">
              When every second matters. SOS requests trigger high-priority alerts to matching nearby donors and authorized hospital blood banks.
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-red-50 text-[#B71C1C] font-black text-sm shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center space-x-2 self-start md:self-center flex-shrink-0"
          >
            <PlusCircle className="w-5 h-5 text-[#E53935]" />
            <span>{showCreateForm ? 'Close SOS Form' : 'Broadcast Emergency SOS'}</span>
          </button>
        </div>
      </div>

      {/* CREATE EMERGENCY SOS FORM */}
      {showCreateForm && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-red-500/40 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#B71C1C] flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Hospital Emergency Blood Requisition Form
              </h2>
              <p className="text-xs text-gray-500">
                Please provide accurate clinical and hospital ward coordinates for immediate dispatch.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateSOS} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Patient Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Emergency Attendant Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98220 00000"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Required Blood Group *
                </label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full bg-red-50/50 border border-red-200 rounded-xl px-3.5 py-2.5 text-xs font-black text-[#B71C1C] focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Required Units */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Units Needed *
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  required
                  value={unitsNeeded}
                  onChange={e => setUnitsNeeded(parseInt(e.target.value) || 1)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Hospital Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Hospital Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lilavati Hospital, Bandra"
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Hospital Location / Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Hospital Ward / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICU Ward 3, 2nd Floor"
                  value={hospitalLocation}
                  onChange={e => setHospitalLocation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {CITIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Required Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Required By Date *
                </label>
                <input
                  type="date"
                  required
                  value={requiredDate}
                  onChange={e => setRequiredDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Clinical Reason / Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Clinical Reason / Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Trauma case with severe internal hemorrhage, immediate crossmatch required."
                value={clinicalNotes}
                onChange={e => setClinicalNotes(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Publish Emergency SOS Broadcast</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ACTIVE EMERGENCY REQUESTS DASHBOARD */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-gray-900">
              Live Emergency SOS Feed
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#B71C1C] font-black text-xs">
              {requests.length} Active Requests
            </span>
          </div>

          <div className="text-xs text-gray-500 hidden sm:block">
            Auto-refreshing live hospital progress feed
          </div>
        </div>

        <div className="space-y-6">
          {requests.map(req => {
            const responses = dataService.getResponsesForRequest(req.id);
            const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === req.status);

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card hover:shadow-card-hover transition-all space-y-6"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] text-white flex flex-col items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-[10px] font-black uppercase text-white/80">RBC</span>
                      <span className="text-2xl font-black leading-none">{req.blood_group}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            req.is_sos
                              ? 'bg-red-600 text-white animate-pulse'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {req.is_sos ? 'CRITICAL SOS' : 'URGENT'}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          ID: #{req.id.slice(-6)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-gray-900 mt-1">
                        Patient: {req.patient_name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-gray-400" />
                          <strong>{req.hospital_name}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {req.hospital_location}, {req.city}
                        </span>
                        <span className="flex items-center gap-1 text-[#B71C1C] font-semibold">
                          <Phone className="w-3.5 h-3.5" />
                          {req.contact_number}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Units needed pill */}
                  <div className="sm:text-right">
                    <div className="text-2xl font-black text-gray-900">
                      {req.units_needed} <span className="text-xs font-semibold text-gray-500">Units</span>
                    </div>
                    <span className="text-xs font-medium text-red-600">
                      Needed by: {req.required_date}
                    </span>
                  </div>
                </div>

                {/* Notes box */}
                {req.notes && (
                  <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 text-xs text-gray-700">
                    <strong className="text-gray-900 block mb-0.5">Clinical Situation:</strong>
                    {req.notes}
                  </div>
                )}

                {/* STATUS PROGRESSION PIPELINE (Requirement 7) */}
                <div className="pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                    Requisition Progress Pipeline:
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div
                          key={step.key}
                          className={`p-3 rounded-2xl border text-xs transition-all ${
                            isCurrent
                              ? 'bg-red-50 border-red-300 ring-2 ring-red-200'
                              : isCompleted
                              ? 'bg-emerald-50/60 border-emerald-200'
                              : 'bg-gray-50/60 border-gray-100 opacity-60'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 mb-1">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="font-bold text-gray-900">{step.label}</span>
                          </div>
                          <p className="text-[10px] text-gray-500">{step.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RESPONSES LOG (Donors who responded) */}
                {responses.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                    <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#B71C1C]" />
                      <span>Volunteered Donors Responded ({responses.length}):</span>
                    </div>

                    <div className="divide-y divide-gray-200/60">
                      {responses.map(resp => (
                        <div key={resp.id} className="pt-2 first:pt-0 flex items-start justify-between text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{resp.donor_name}</span>
                              <span className="px-1.5 py-0.2 rounded bg-red-100 text-[#B71C1C] font-extrabold text-[10px]">
                                {resp.donor_blood_group}
                              </span>
                              <span className="text-emerald-600 font-bold text-[10px]">
                                ● Confirmed En-Route
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-600 mt-0.5">"{resp.message}"</p>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(resp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS ROW */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    {/* Status updater for Patient or Admin */}
                    {req.status !== 'fulfilled' && (
                      <button
                        onClick={() => handleStatusUpdate(req.id, 'fulfilled')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mark Fulfilled</span>
                      </button>
                    )}

                    {req.status !== 'cancelled' && req.status !== 'fulfilled' && (
                      <button
                        onClick={() => handleStatusUpdate(req.id, 'cancelled')}
                        className="px-3 py-1.5 rounded-xl text-gray-500 hover:bg-gray-100 text-xs font-semibold"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>

                  {/* Donor Response Action */}
                  {req.status !== 'fulfilled' && req.status !== 'cancelled' && (
                    <div>
                      {respondingRequestId === req.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={responseMsg}
                            onChange={e => setResponseMsg(e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-gray-900 w-64 focus:outline-none"
                            placeholder="Message to attending clinician"
                          />
                          <button
                            onClick={() => handleDonorRespond(req.id)}
                            className="px-4 py-1.5 rounded-xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white text-xs font-bold shadow-md"
                          >
                            Send Confirmation
                          </button>
                          <button
                            onClick={() => setRespondingRequestId(null)}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setRespondingRequestId(req.id)}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#B71C1C] to-[#E53935] hover:from-[#8E0E00] hover:to-[#B71C1C] text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 animate-pulse"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>I Can Donate (Respond to SOS)</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
