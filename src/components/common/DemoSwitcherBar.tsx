import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { UserCheck, ShieldAlert, Building2, UserCog, Sparkles } from 'lucide-react';

export const DemoSwitcherBar: React.FC = () => {
  const { role, switchDemoRole } = useAuth();

  const roles: Array<{ id: UserRole; label: string; icon: React.ReactNode; desc: string }> = [
    {
      id: 'donor',
      label: 'Donor View',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      desc: 'Digital Card, Impact Score, SOS Alerts'
    },
    {
      id: 'patient',
      label: 'Patient View',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
      desc: 'Smart Search, Urgent SOS Broadcast'
    },
    {
      id: 'blood_bank',
      label: 'Blood Bank View',
      icon: <Building2 className="w-3.5 h-3.5" />,
      desc: 'Stock Management, Expiry Tracker'
    },
    {
      id: 'admin',
      label: 'Admin View',
      icon: <UserCog className="w-3.5 h-3.5" />,
      desc: 'Platform Analytics, Verifications'
    }
  ];

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800 py-1.5 px-4 hidden md:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="flex items-center gap-1 font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full text-[11px]">
            <Sparkles className="w-3 h-3" /> Project Demo Switcher:
          </span>
          <span className="text-slate-400 text-[11px]">
            Simulate the system as any stakeholder with full role-based permissions:
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {roles.map(r => {
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => switchDemoRole(r.id)}
                title={r.desc}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all text-[11px] font-medium ${
                  isActive
                    ? 'bg-[#E53935] text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
