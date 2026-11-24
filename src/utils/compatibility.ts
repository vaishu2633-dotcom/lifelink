import { BloodGroup } from '../types';

/**
 * Standard Red Blood Cell (RBC) Compatibility Matrix.
 * Keys: Recipient Blood Group
 * Values: Array of compatible Donor Blood Groups
 */
export const RBC_RECIPIENT_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'Oh (Bombay)': ['Oh (Bombay)'], // Ultra-rare: Bombay individuals lack H antigen and can only safely receive Bombay RBCs
  'Rh-null': ['Rh-null']          // Golden blood: lacks all Rh antigens; universal rare donor, but can only receive Rh-null
};

/**
 * RBC Donor Matrix: Who can this donor give Red Blood Cells to?
 */
export const RBC_DONOR_CAN_DONATE_TO: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal RBC donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'], // RBC Universal Recipient only donates to AB+
  'Oh (Bombay)': ['Oh (Bombay)', 'O-', 'O+', 'A+', 'B+', 'AB+'], // Bombay RBCs lack H and ABO antigens
  'Rh-null': ['Rh-null', 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
};

/**
 * Check if donor's red blood cells are compatible with recipient
 */
export function isRbcCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const allowedDonors = RBC_RECIPIENT_COMPATIBILITY[recipientGroup];
  return allowedDonors ? allowedDonors.includes(donorGroup) : false;
}

/**
 * Determine self-reported donation eligibility based on 90-day cooldown interval (whole blood)
 */
export function checkDonationEligibility(lastDonationDateString?: string): {
  isEligible: boolean;
  daysRemaining: number;
  message: string;
} {
  if (!lastDonationDateString) {
    return {
      isEligible: true,
      daysRemaining: 0,
      message: 'Eligible (no prior recorded donations)'
    };
  }

  const lastDate = new Date(lastDonationDateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const cooldownPeriod = 90; // Standard 90-day minimum between whole blood donations

  if (diffDays >= cooldownPeriod) {
    return {
      isEligible: true,
      daysRemaining: 0,
      message: `Eligible (Last donation was ${diffDays} days ago)`
    };
  } else {
    const daysLeft = cooldownPeriod - diffDays;
    return {
      isEligible: false,
      daysRemaining: daysLeft,
      message: `In cooldown period (${daysLeft} days remaining before next eligible donation)`
    };
  }
}

export interface MatchScoreResult {
  score: number; // 0 - 100
  isExactGroup: boolean;
  isCompatible: boolean;
  isEligible: boolean;
  proximityScore: number;
  matchReasons: string[];
}

/**
 * Smart matching algorithm calculating a quantitative match score (0-100)
 */
export function calculateMatchScore(
  donor: {
    blood_group: BloodGroup;
    is_available: boolean;
    city: string;
    area: string;
    last_donation_date?: string;
    impact_score?: number;
    is_verified?: boolean;
  },
  requirement: {
    blood_group: BloodGroup;
    city: string;
    area?: string;
  }
): MatchScoreResult {
  const reasons: string[] = [];
  let score = 0;

  // 1. Compatibility check
  const isExactGroup = donor.blood_group === requirement.blood_group;
  const isCompatible = isRbcCompatible(donor.blood_group, requirement.blood_group);

  if (!isCompatible) {
    return {
      score: 0,
      isExactGroup: false,
      isCompatible: false,
      isEligible: false,
      proximityScore: 0,
      matchReasons: ['Incompatible red-cell blood group']
    };
  }

  if (isExactGroup) {
    score += 45;
    reasons.push(`Exact Blood Group Match (${donor.blood_group})`);
  } else {
    score += 35;
    reasons.push(`Compatible Red-Cell Donor (${donor.blood_group} to ${requirement.blood_group})`);
  }

  // 2. Availability
  if (donor.is_available) {
    score += 25;
    reasons.push('Actively Available & On-Call');
  } else {
    score += 5;
    reasons.push('Currently Unavailable for calls');
  }

  // 3. Proximity
  let proximityScore = 0;
  const donorCityNorm = donor.city.toLowerCase().trim();
  const reqCityNorm = requirement.city.toLowerCase().trim();

  if (donorCityNorm === reqCityNorm) {
    if (requirement.area && donor.area.toLowerCase().includes(requirement.area.toLowerCase().trim())) {
      proximityScore = 20;
      score += 20;
      reasons.push(`Hyper-local Area Match (${donor.area})`);
    } else {
      proximityScore = 15;
      score += 15;
      reasons.push(`Same City (${donor.city})`);
    }
  } else {
    proximityScore = 5;
    score += 5;
    reasons.push(`Inter-city Donor (${donor.city})`);
  }

  // 4. Clinical eligibility (cooldown)
  const eligibility = checkDonationEligibility(donor.last_donation_date);
  if (eligibility.isEligible) {
    score += 10;
    reasons.push('Passed 90-day donation interval');
  } else {
    score -= 20;
    reasons.push(eligibility.message);
  }

  // 5. Verified & Impact bonus
  if (donor.is_verified) {
    score = Math.min(100, score + 5);
    reasons.push('Verified Donor Credentials');
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    isExactGroup,
    isCompatible,
    isEligible: eligibility.isEligible,
    proximityScore,
    matchReasons: reasons
  };
}

export const MEDICAL_SAFETY_DISCLAIMER =
  "LIFE LINK connects willing volunteer donors and hospitals. The preliminary blood compatibility matrix provided is for reference only. Prior to transfusion, certified medical professionals and authorized blood bank staff must perform comprehensive laboratory blood grouping, crossmatching, screening for transfusion-transmissible infections, and health examinations.";
