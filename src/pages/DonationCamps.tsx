import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { DonationCamp } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  PlusCircle,
  CheckCircle2,
  Phone,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DonationCampsProps {
  onNavigate: (page: string) => void;
}

export const DonationCamps: React.FC<DonationCampsProps> = ({ onNavigate }) => {
  const { user, donorProfile } = useAuth();
  const [camps, setCamps] = useState<DonationCamp[]>(() => dataService.getCamps());
  const [showAddCampModal, setShowAddCampModal] = useState(false);
  const [registeredCampIds, setRegisteredCampIds] = useState<string[]>([]);

  // Add Camp Form State
  const [title, setTitle] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [targetUnits, setTargetUnits] = useState(200);
  const [contactPhone, setContactPhone] = useState('');

  const handleRegisterCamp = (camp: DonationCamp) => {
    const donorName = donorProfile?.full_name || user?.full_name || 'Volunteer Donor';
    const donorPhone = donorProfile?.phone || user?.phone || '+91 98000 00000';
    const donorBlood = donorProfile?.blood_group || 'O+';

    const success = dataService.registerForCamp(camp.id, donorName, donorPhone, donorBlood);
    if (success) {
      setRegisteredCampIds([...registeredCampIds, camp.id]);
      setCamps(dataService.getCamps());

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00C853', '#B71C1C', '#E53935']
      });

      alert(`Congratulations! You have successfully registered for "${camp.title}". We have reserved your donation slot.`);
    }
  };

  const handleCreateCamp = (e: React.FormEvent) => {
    e.preventDefault();

    dataService.createCamp({
      title,
      organizer_name: organizerName,
      date,
      start_time: startTime,
      end_time: endTime,
      venue,
      city,
      target_units: Number(targetUnits),
      contact_phone: contactPhone,
      status: 'upcoming'
    });

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#B71C1C', '#E53935', '#FFA000']
    });

    setShowAddCampModal(false);
    setCamps(dataService.getCamps());

    // Reset
    setTitle('');
    setOrganizerName('');
    setVenue('');
    setContactPhone('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase tracking-wider">
            Community Drives & Mobile Blood Mobiles
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-950 mt-1">
            Donation Camp Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
            Explore upcoming collegiate and civic blood donation camps, register for donation slots, or submit your community drive for medical authorization.
          </p>
        </div>

        <button
          onClick={() => setShowAddCampModal(true)}
          className="px-5 py-3 rounded-2xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center space-x-2 self-start md:self-center flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Host / Organize a Camp</span>
        </button>
      </div>

      {/* CAMPS LISTING GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">
            Scheduled Community Blood Drives ({camps.length})
          </h2>
          <span className="text-xs text-gray-400">All events partnered with certified blood centers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {camps.map(camp => {
            const isRegistered = registeredCampIds.includes(camp.id);

            return (
              <div
                key={camp.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] uppercase tracking-wider">
                      Confirmed Drive
                    </span>
                    <span className="font-mono text-gray-700 font-bold flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#B71C1C]" />
                      {camp.date}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 leading-snug">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-[#B71C1C] font-semibold mt-1">
                    Organized by: {camp.organizer_name}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-gray-600 bg-gray-50 p-4 rounded-2xl">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{camp.venue}, {camp.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{camp.start_time} to {camp.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>Coordinator: {camp.contact_phone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">
                      Donor Mobilization
                    </span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-black text-gray-900 text-sm">
                        {camp.registered_count} Registered
                      </span>
                      <span className="text-xs text-gray-400">/ {camp.target_units} Target</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRegisterCamp(camp)}
                    disabled={isRegistered}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5 ${
                      isRegistered
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-[#B71C1C] hover:bg-[#8E0E00] text-white active:scale-95'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Registered!</span>
                      </>
                    ) : (
                      <>
                        <span>Reserve Donation Slot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HOST / ORGANIZE A CAMP MODAL (Requirement 9.E) */}
      {showAddCampModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-black text-gray-900">
                  Submit New Blood Donation Camp Proposal
                </h3>
                <p className="text-xs text-gray-500">
                  We assign a certified medical blood bank team & mobile bus to your location.
                </p>
              </div>
              <button
                onClick={() => setShowAddCampModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCamp} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Camp Title / Event Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VJTI Youth Blood Donation Festival"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Organizing Entity / College / NGO *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotaract Club of Pune Central"
                  value={organizerName}
                  onChange={e => setOrganizerName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Units *</label>
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    required
                    value={targetUnits}
                    onChange={e => setTargetUnits(parseInt(e.target.value) || 100)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    placeholder="05:00 PM"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Venue & City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. College Quadrangle, Shivajinagar, Pune"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Organizer Contact Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98220 12345"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddCampModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white font-bold shadow-md"
                >
                  Publish Camp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
