import React, { useState } from 'react';
import { BloodGroup, UrgencyLevel, Donor } from '../types';
import { dataService } from '../services/dataService';
import { calculateMatchScore } from '../utils/compatibility';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Heart,
  Phone,
  Sparkles,
  ArrowUpDown,
  Send,
  UserCheck,
  Building,
  HelpCircle
} from 'lucide-react';

const CITIES = ['All Cities', 'Mumbai', 'Pune', 'Bengaluru', 'Delhi', 'Hyderabad', 'Chennai'];
const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'Oh (Bombay)', 'Rh-null'];

interface FindBloodProps {
  onNavigate: (page: string) => void;
}

export const FindBlood: React.FC<FindBloodProps> = ({ onNavigate }) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O+');
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [areaInput, setAreaInput] = useState<string>('');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');

  // Filters & Sorting
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [onlyExactGroup, setOnlyExactGroup] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'score' | 'proximity' | 'impact'>('score');

  // Contact Modal State
  const [contactingDonor, setContactingDonor] = useState<Donor | null>(null);
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  // Search execution
  const allDonors = dataService.getDonors();

  const matchedDonors = allDonors
    .map(donor => {
      const matchInfo = calculateMatchScore(donor, {
        blood_group: selectedGroup,
        city: selectedCity === 'All Cities' ? donor.city : selectedCity,
        area: areaInput
      });
      return { donor, matchInfo };
    })
    .filter(item => {
      if (!item.matchInfo.isCompatible) return false;
      if (onlyExactGroup && !item.matchInfo.isExactGroup) return false;
      if (onlyAvailable && !item.donor.is_available) return false;
      if (selectedCity !== 'All Cities' && item.donor.city.toLowerCase() !== selectedCity.toLowerCase()) {
        // Only keep if high score rare donor
        return item.matchInfo.score > 50;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.matchInfo.score - a.matchInfo.score;
      if (sortBy === 'proximity') return b.matchInfo.proximityScore - a.matchInfo.proximityScore;
      if (sortBy === 'impact') return b.donor.impact_score - a.donor.impact_score;
      return 0;
    });

  const handleOpenContact = (donor: Donor) => {
    setContactingDonor(donor);
    setContactMessage(`Hello, we urgently need ${unitsNeeded} unit(s) of ${selectedGroup} blood in ${selectedCity}. Please let us know if you are able to assist.`);
    setContactSubmitted(false);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactingDonor) return;

    // Send mock notification to the donor
    dataService.pushNotification({
      user_id: contactingDonor.user_id,
      title: `Blood Requisition: ${selectedGroup} Needed`,
      message: `A patient in ${selectedCity} requested your help for ${unitsNeeded} units. Message: "${contactMessage}"`,
      type: 'match',
      link: '/donor-dashboard'
    });

    setContactSubmitted(true);
    setTimeout(() => {
      setContactingDonor(null);
      setContactSubmitted(false);
    }, 2200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#E53935] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Core Feature
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-950 mt-1">
            Smart Blood Donor Matching
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Clinically driven ABO/Rh compatibility engine evaluating active availability, geographic proximity, and self-reported 90-day cooldown interval.
          </p>
        </div>

        {/* SOS Shortcut */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3 self-start">
          <AlertTriangle className="w-5 h-5 text-[#B71C1C] flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-[#B71C1C]">Immediate Life Threat?</p>
            <button
              onClick={() => onNavigate('emergency-sos')}
              className="text-xs font-black text-[#E53935] hover:underline"
            >
              Trigger Emergency SOS Broadcast →
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH PANEL CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#B71C1C]" />
          <span>Patient Requirement Parameters</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Blood Group */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Required Blood Group *
            </label>
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value as BloodGroup)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#B71C1C]"
            >
              {BLOOD_GROUPS.map(bg => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              City *
            </label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#B71C1C]"
            >
              {CITIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Area / Pincode */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Area or Pincode
            </label>
            <input
              type="text"
              placeholder="e.g. Andheri, Kothrud"
              value={areaInput}
              onChange={e => setAreaInput(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#B71C1C]"
            />
          </div>

          {/* Units Needed */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Required Units (Pints/Bags)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={unitsNeeded}
              onChange={e => setUnitsNeeded(parseInt(e.target.value) || 1)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#B71C1C]"
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Urgency Level
            </label>
            <select
              value={urgency}
              onChange={e => setUrgency(e.target.value as UrgencyLevel)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#B71C1C]"
            >
              <option value="normal">Normal (Within 48h)</option>
              <option value="urgent">Urgent (Within 12h)</option>
              <option value="critical_sos">Critical SOS (&lt;2h)</option>
            </select>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={e => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 text-[#B71C1C] rounded border-gray-300 focus:ring-red-500"
              />
              <span>Available & On-Call Only</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyExactGroup}
                onChange={e => setOnlyExactGroup(e.target.checked)}
                className="w-4 h-4 text-[#B71C1C] rounded border-gray-300 focus:ring-red-500"
              />
              <span>Exact Match Only ({selectedGroup})</span>
            </label>
          </div>

          {/* Sort selector */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-400 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:outline-none"
            >
              <option value="score">Highest Match Score</option>
              <option value="proximity">Closest Proximity</option>
              <option value="impact">Donor Impact Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* MATCH RESULTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-gray-900">
              Compatible Registered Donors
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#B71C1C] font-extrabold text-xs">
              {matchedDonors.length} Found
            </span>
          </div>

          <span className="text-xs text-gray-500">
            Donor identities and phone numbers are privacy-protected
          </span>
        </div>

        {matchedDonors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-gray-900">
              No matching donors found in the immediate selection
            </h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Try switching city to "All Cities", unchecking "Available & On-Call Only", or broadcast an Emergency SOS to our wider network of registered lifesavers.
            </p>
            <button
              onClick={() => onNavigate('emergency-sos')}
              className="px-5 py-2.5 rounded-xl bg-[#B71C1C] text-white text-xs font-bold shadow-md hover:bg-[#8E0E00]"
            >
              Broadcast Emergency SOS Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedDonors.map(({ donor, matchInfo }) => {
              // Mask mobile number for privacy protection (Requirement 6)
              const maskedPhone = donor.phone.replace(/(\d{5})\s?(\d{5})/, '$1 •••••');

              return (
                <div
                  key={donor.id}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Match Score Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] text-white flex items-center justify-center font-black text-lg shadow-md">
                        {donor.blood_group}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-gray-900 text-sm">
                            {donor.full_name}
                          </h4>
                          {donor.is_verified && (
                            <span title="Verified Donor">
                              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{donor.area}, {donor.city}</span>
                        </p>
                      </div>
                    </div>

                    {/* Quantitative match score indicator */}
                    <div className="text-right">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        <span>{matchInfo.score}% Match</span>
                      </div>
                      <span className="block text-[10px] text-gray-400 mt-0.5">
                        {matchInfo.isExactGroup ? 'Exact Group' : 'Compatible RBC'}
                      </span>
                    </div>
                  </div>

                  {/* Donor Match Details & Reasons */}
                  <div className="space-y-2 my-2 text-xs">
                    <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Availability:</span>
                        <span className={`font-bold ${donor.is_available ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {donor.is_available ? '● Available for Calls' : '○ Cooldown'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Eligibility Interval:</span>
                        <span className="font-semibold text-gray-700">
                          {matchInfo.isEligible ? 'Eligible (>90 days)' : 'In Cooldown'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Past Donations:</span>
                        <span className="font-semibold text-gray-700">{donor.total_donations} times</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Impact Score:</span>
                        <span className="font-bold text-[#B71C1C]">{donor.impact_score} Pts</span>
                      </div>
                    </div>

                    {/* Match Reasons Pill */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {matchInfo.matchReasons.slice(0, 2).map((reason, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-red-50 text-[#B71C1C] font-semibold px-2 py-0.5 rounded-md"
                        >
                          ✓ {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Privacy-Preserved Contact Action */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-[11px] text-gray-400 font-mono">
                      {maskedPhone}
                    </div>

                    <button
                      onClick={() => handleOpenContact(donor)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Request Contact</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mandatory Medical Disclaimer */}
      <MedicalDisclaimer />

      {/* CONTACT DONOR PRIVACY-PRESERVING MODAL */}
      {contactingDonor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#B71C1C] flex items-center justify-center font-bold text-sm">
                  {contactingDonor.blood_group}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Connect with {contactingDonor.full_name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {contactingDonor.city} • Verified Donor Card {contactingDonor.digital_card_id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setContactingDonor(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {contactSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-gray-900">
                  Request Dispatched to Donor!
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  The donor has received your notification with hospital details. You will be alerted as soon as they confirm availability.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Requisition Message
                  </label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#B71C1C]"
                  />
                  <span className="text-[10px] text-gray-400">
                    Include hospital ward number or attending clinician contact if available.
                  </span>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                  <strong>Privacy Rule:</strong> Direct phone numbers are shared securely only after the volunteer donor explicitly confirms their willingness to donate.
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setContactingDonor(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#B71C1C] hover:bg-[#8E0E00] text-white shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Requisition</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
