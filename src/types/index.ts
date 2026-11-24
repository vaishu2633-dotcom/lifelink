export type UserRole = 'donor' | 'patient' | 'blood_bank' | 'admin';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Oh (Bombay)' | 'Rh-null';

export type UrgencyLevel = 'normal' | 'urgent' | 'critical_sos';

export type RequestStatus = 'pending' | 'donor_contacted' | 'donor_confirmed' | 'fulfilled' | 'cancelled';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string;
  city: string;
  area: string;
  avatar_url?: string;
  created_at: string;
}

export interface Donor {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  blood_group: BloodGroup;
  city: string;
  area: string;
  pincode: string;
  is_available: boolean;
  last_donation_date: string;
  total_donations: number;
  impact_score: number;
  digital_card_id: string;
  college_id?: string;
  college_name?: string;
  badges: string[];
  is_verified: boolean;
  created_at: string;
}

export interface BloodRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  patient_name: string;
  contact_number: string;
  hospital_name: string;
  hospital_location: string;
  city: string;
  area: string;
  blood_group: BloodGroup;
  units_needed: number;
  urgency: UrgencyLevel;
  required_date: string;
  status: RequestStatus;
  notes?: string;
  is_sos: boolean;
  created_at: string;
  fulfilled_at?: string;
  responses_count?: number;
}

export interface DonorResponse {
  id: string;
  request_id: string;
  donor_id: string;
  donor_name: string;
  donor_phone: string;
  donor_blood_group: BloodGroup;
  status: 'interested' | 'confirmed' | 'declined' | 'completed';
  message?: string;
  created_at: string;
}

export interface BloodBank {
  id: string;
  user_id?: string;
  name: string;
  license_number: string;
  city: string;
  area: string;
  address: string;
  phone: string;
  email: string;
  is_verified: boolean;
  latitude: number;
  longitude: number;
  operating_hours: string;
}

export interface BloodInventoryItem {
  id: string;
  blood_bank_id: string;
  blood_group: BloodGroup;
  units: number;
  collection_date: string;
  expiry_date: string;
  status: 'safe' | 'expiring_soon' | 'expired';
}

export interface DonationCamp {
  id: string;
  title: string;
  organizer_name: string;
  college_id?: string;
  college_name?: string;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  city: string;
  target_units: number;
  registered_count: number;
  collected_units: number;
  contact_phone: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface CampRegistration {
  id: string;
  camp_id: string;
  donor_id: string;
  donor_name: string;
  donor_blood_group: BloodGroup;
  donor_phone: string;
  registered_at: string;
}

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  code: string;
  total_donors: number;
  total_units_donated: number;
  rank: number;
  coordinator_name: string;
  coordinator_contact: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'emergency' | 'match' | 'camp' | 'stock' | 'system';
  is_read: boolean;
  created_at: string;
  link?: string;
}
