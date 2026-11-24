import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BloodGroup, UserRole } from '../types';
import {
  Heart,
  Droplet,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Building,
  GraduationCap,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'Oh (Bombay)', 'Rh-null'];
const CITIES = ['Mumbai', 'Pune', 'Bengaluru', 'Delhi', 'Hyderabad', 'Chennai'];

interface RegisterProps {
  onNavigate: (page: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const { registerDonor, registerGeneric } = useAuth();
  const [role, setRole] = useState<UserRole>('donor');

  // Donor form fields (Requirement 4)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(22);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [city, setCity] = useState('Mumbai');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [password, setPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (role === 'donor') {
      await registerDonor({
        full_name: fullName,
        email,
        phone,
        password,
        age: Number(age),
        blood_group: bloodGroup,
        city,
        area: area || 'Central',
        pincode: pincode || '400001',
        last_donation_date: lastDonationDate,
        college_name: collegeName
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B71C1C', '#E53935', '#FFD700']
      });

      setLoading(false);
      onNavigate('donor-dashboard');
    } else {
      await registerGeneric({
        full_name: fullName,
        email,
        phone,
        password,
        role,
        city,
        area: area || 'Main Area',
        license_number: licenseNumber
      });

      setLoading(false);
      if (role === 'patient') onNavigate('patient-dashboard');
      else if (role === 'blood_bank') onNavigate('blood-bank-dashboard');
      else onNavigate('admin-dashboard');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] flex items-center justify-center text-white mx-auto shadow-md">
            <Heart className="w-7 h-7 fill-white text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Join the LIFE LINK Lifesaver Network
          </h1>
          <p className="text-xs text-gray-500">
            Create an official account to pledge blood donations or coordinate hospital requisitions.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('donor')}
            className={`py-2 rounded-xl transition-all ${
              role === 'donor'
                ? 'bg-white text-[#B71C1C] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Volunteer Donor
          </button>
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`py-2 rounded-xl transition-all ${
              role === 'patient'
                ? 'bg-white text-[#B71C1C] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Patient / Requester
          </button>
          <button
            type="button"
            onClick={() => setRole('blood_bank')}
            className={`py-2 rounded-xl transition-all ${
              role === 'blood_bank'
                ? 'bg-white text-[#B71C1C] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Blood Bank Facility
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Mobile Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98220 00000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Donor-Specific Fields (Age, Blood Group, Last Donation) */}
          {role === 'donor' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-red-50/50 p-4 rounded-2xl border border-red-100">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Age (18-65) *</label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  required
                  value={age}
                  onChange={e => setAge(parseInt(e.target.value) || 18)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Blood Group *</label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-black text-[#B71C1C] focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Last Donated Date</label>
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={e => setLastDonationDate(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}

          {/* Blood Bank Specific */}
          {role === 'blood_bank' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                State Drug Controller License Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MH-MUM-BB-2026-9011"
                value={licenseNumber}
                onChange={e => setLicenseNumber(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          {/* Location details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">City *</label>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Area / Locality *</label>
              <input
                type="text"
                required
                placeholder="e.g. Andheri West"
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                placeholder="400058"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Optional College Affiliation */}
          {role === 'donor' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                College Affiliation (Optional for Inter-College Championship)
              </label>
              <input
                type="text"
                placeholder="e.g. COEP Technological University, Pune"
                value={collegeName}
                onChange={e => setCollegeName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Create Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="text-[11px] text-gray-500 pt-1">
            By creating an account, you consent to receive emergency blood broadcast alerts. Your contact numbers will remain privacy-shielded until direct bilateral consent.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#B71C1C] to-[#E53935] hover:from-[#8E0E00] hover:to-[#B71C1C] text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95"
          >
            {loading ? 'Creating Account...' : 'Complete Registration & Get Donor Card'}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          <span>Already registered with LIFE LINK? </span>
          <button
            onClick={() => onNavigate('login')}
            className="font-bold text-[#B71C1C] hover:underline"
          >
            Log In Here
          </button>
        </div>
      </div>
    </div>
  );
};
