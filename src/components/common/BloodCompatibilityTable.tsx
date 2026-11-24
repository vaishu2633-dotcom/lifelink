import React, { useState } from 'react';
import { BloodGroup } from '../../types';
import { RBC_RECIPIENT_COMPATIBILITY, RBC_DONOR_CAN_DONATE_TO } from '../../utils/compatibility';
import { ArrowRight, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';

const ALL_BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'Oh (Bombay)', 'Rh-null'];

export const BloodCompatibilityTable: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');

  const canReceiveFrom = RBC_RECIPIENT_COMPATIBILITY[selectedGroup] || [];
  const canDonateTo = RBC_DONOR_CAN_DONATE_TO[selectedGroup] || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
        <div>
          <span className="text-xs font-bold text-[#E53935] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Clinical Reference Tool
          </span>
          <h3 className="text-lg font-bold text-gray-900 mt-0.5">
            Smart Red Blood Cell Compatibility Matrix
          </h3>
          <p className="text-xs text-gray-500">
            Select any blood group to instantly inspect compatible donors and recipients.
          </p>
        </div>

        {/* Group Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {ALL_BLOOD_GROUPS.map(bg => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedGroup === bg
                  ? 'bg-[#B71C1C] text-white shadow-sm ring-2 ring-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Group Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Can Receive From */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                IN
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Patient ({selectedGroup}) Can Receive From:
                </h4>
                <p className="text-[11px] text-gray-500">Compatible donor blood groups</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {canReceiveFrom.length} Group{canReceiveFrom.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {ALL_BLOOD_GROUPS.map(bg => {
              const isCompatible = canReceiveFrom.includes(bg);
              return (
                <div
                  key={`rec-${bg}`}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    isCompatible
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white/80 text-gray-300 line-through opacity-50'
                  }`}
                >
                  {isCompatible ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-gray-300" />
                  )}
                  <span>{bg}</span>
                </div>
              );
            })}
          </div>

          {selectedGroup === 'AB+' && (
            <p className="mt-4 text-xs font-medium text-emerald-800 bg-emerald-100/60 p-2.5 rounded-lg flex items-center gap-1.5">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span><strong>Universal Recipient:</strong> AB+ individuals can receive red blood cells from any standard ABO/Rh group.</span>
            </p>
          )}
          {selectedGroup === 'Oh (Bombay)' && (
            <p className="mt-4 text-xs font-medium text-amber-900 bg-amber-100/60 p-2.5 rounded-lg flex items-center gap-1.5">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span><strong>Bombay Phenotype:</strong> Lacks H substance, producing anti-H antibodies. Can safely receive RBCs ONLY from other Bombay (Oh) individuals!</span>
            </p>
          )}
        </div>

        {/* Can Donate To */}
        <div className="bg-red-50/70 border border-red-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#B71C1C] text-white flex items-center justify-center font-bold text-xs">
                OUT
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Donor ({selectedGroup}) Can Donate To:
                </h4>
                <p className="text-[11px] text-gray-500">Patients that can safely receive this blood</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
              {canDonateTo.length} Group{canDonateTo.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {ALL_BLOOD_GROUPS.map(bg => {
              const isCompatible = canDonateTo.includes(bg);
              return (
                <div
                  key={`don-${bg}`}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    isCompatible
                      ? 'bg-[#B71C1C] text-white shadow-sm'
                      : 'bg-white/80 text-gray-300 line-through opacity-50'
                  }`}
                >
                  {isCompatible ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-gray-300" />
                  )}
                  <span>{bg}</span>
                </div>
              );
            })}
          </div>

          {selectedGroup === 'O-' && (
            <p className="mt-4 text-xs font-medium text-red-900 bg-red-100/70 p-2.5 rounded-lg flex items-center gap-1.5">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span><strong>Universal RBC Donor:</strong> O- red blood cells lack A, B, and Rh antigens, making them crucial during emergency trauma transfusions.</span>
            </p>
          )}
          {selectedGroup === 'Rh-null' && (
            <p className="mt-4 text-xs font-medium text-purple-900 bg-purple-100/70 p-2.5 rounded-lg flex items-center gap-1.5">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span><strong>Golden Blood (Rh-null):</strong> Completely lacks all 61 antigens in the Rh system. Highly prized universal rare RBC donor.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
