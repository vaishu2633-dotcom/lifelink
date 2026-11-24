import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Lock,
  Mail,
  Heart,
  Droplet,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building,
  UserCog
} from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const demoAccounts: Record<UserRole, { email: string; name: string; desc: string }> = {
    donor: {
      email: 'aarav.sharma@example.com',
      name: 'Aarav Sharma (Donor - O+)',
      desc: 'Access Digital Card & Impact Score'
    },
    patient: {
      email: 'rajesh.patil@example.com',
      name: 'Rajesh Patil (Patient)',
      desc: 'View Active Requisitions & Donor Responses'
    },
    blood_bank: {
      email: 'admin@lifecareblood.org',
      name: 'Dr. Sunita Rao (Blood Bank)',
      desc: 'Stock Management & Expiry Tracker'
    },
    admin: {
      email: 'chief.admin@lifelink.org',
      name: 'Healthcare Admin',
      desc: 'Verification Console & Analytics'
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await login(email, selectedRole);
    setLoading(false);

    // Redirect to respective dashboard
    switch (selectedRole) {
      case 'donor':
        onNavigate('donor-dashboard');
        break;
      case 'patient':
        onNavigate('patient-dashboard');
        break;
      case 'blood_bank':
        onNavigate('blood-bank-dashboard');
        break;
      case 'admin':
        onNavigate('admin-dashboard');
        break;
      default:
        onNavigate('donor-dashboard');
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(demoAccounts[role].email);
    setPassword('demoPassword123');
    login(demoAccounts[role].email, role);

    switch (role) {
      case 'donor':
        onNavigate('donor-dashboard');
        break;
      case 'patient':
        onNavigate('patient-dashboard');
        break;
      case 'blood_bank':
        onNavigate('blood-bank-dashboard');
        break;
      case 'admin':
        onNavigate('admin-dashboard');
        break;
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] flex items-center justify-center text-white mx-auto shadow-md">
            <Droplet className="w-7 h-7 fill-white text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Sign In to LIFE LINK
          </h1>
          <p className="text-xs text-gray-500">
            Select your role to access your personalized medical portal
          </p>
        </div>

        {/* ROLE SELECTOR TABS (Requirement 4) */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-2xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setSelectedRole('donor')}
            className={`py-2 rounded-xl transition-all ${
              selectedRole === 'donor'
                ? 'bg-white text-[#B71C1C] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Donor
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('patient')}
            className={`py-2 rounded-xl transition-all ${
              selectedRole === 'patient'
                ? 'bg-white text-[#B71C1C] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('blood_bank')}
            className={`py-2 rounded-xl transition-all ${
              selectedRole === 'blood_bank'
                ? 'bg-white text-[#B71C1C] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Bank
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`py-2 rounded-xl transition-all ${
              selectedRole === 'admin'
                ? 'bg-white text-[#B71C1C] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Admin
          </button>
        </div>

        {/* 1-Click Fast Demo Fill Box */}
        <div className="bg-red-50/70 border border-red-200/80 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#B71C1C] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 1-Click Demo Access
            </span>
            <span className="text-[10px] text-gray-400">Exhibition Mode</span>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemo(selectedRole)}
            className="w-full py-2 rounded-xl bg-white hover:bg-gray-50 border border-red-200 text-xs font-bold text-gray-800 shadow-sm flex items-center justify-center space-x-1.5 transition-all active:scale-95"
          >
            <span>Log In as {demoAccounts[selectedRole].name}</span>
            <ArrowRight className="w-3 h-3 text-[#B71C1C]" />
          </button>
        </div>

        {/* Standard Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Email Address</label>
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
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-gray-700">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[10px] text-[#B71C1C] hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#B71C1C] hover:bg-[#8E0E00] text-white font-black text-xs shadow-md transition-all active:scale-95"
          >
            {loading ? 'Authenticating...' : `Sign In as ${selectedRole.replace('_', ' ')}`}
          </button>
        </form>

        {/* Footer link to register */}
        <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          <span>Don't have an account yet? </span>
          <button
            onClick={() => onNavigate('register')}
            className="font-bold text-[#B71C1C] hover:underline"
          >
            Register Now
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-gray-900">Reset Password</h3>
            <p className="text-xs text-gray-500">
              Enter your registered email. In demonstration mode, password reset links are automatically authenticated.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Demo reset instructions simulated. You can log in directly using the 1-click button.');
                  setShowForgotModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#B71C1C] text-white"
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
