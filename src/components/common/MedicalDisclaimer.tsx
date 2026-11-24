import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { MEDICAL_SAFETY_DISCLAIMER } from '../../utils/compatibility';

interface MedicalDisclaimerProps {
  compact?: boolean;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg text-xs text-amber-900 flex items-start space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold">Clinical Notice:</span> Blood compatibility matches are preliminary reference indicators. Crossmatching and certified laboratory testing must always be confirmed by authorized hospital and blood bank clinicians prior to transfusion.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <span>Clinical Verification & Medical Ethics Policy</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Mandatory Protocol
            </span>
          </h4>
          <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
            {MEDICAL_SAFETY_DISCLAIMER}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Voluntary, Non-Remunerated Donation Only
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Mandatory NACO / WHO Infectious Screening
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 90-Day Inter-Donation Safety Interval
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
