import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Donor, BloodGroup } from '../types';
import { dataService } from '../services/dataService';

export interface RegisterDonorData {
  full_name: string;
  email: string;
  phone: string;
  password?: string;
  age: number;
  blood_group: BloodGroup;
  city: string;
  area: string;
  pincode?: string;
  last_donation_date?: string;
  college_name?: string;
}

export interface RegisterGenericData {
  full_name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  city: string;
  area: string;
  license_number?: string;
  organization_name?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  donorProfile: Donor | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  registerDonor: (data: RegisterDonorData) => Promise<boolean>;
  registerGeneric: (data: RegisterGenericData) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  updateDonorAvailability: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, { profile: UserProfile; donorId?: string }> = {
  donor: {
    profile: {
      id: 'user-donor-1',
      email: 'aarav.sharma@example.com',
      full_name: 'Aarav Sharma',
      role: 'donor',
      phone: '+91 98230 11234',
      city: 'Mumbai',
      area: 'Andheri West',
      created_at: '2025-01-10T10:00:00Z'
    },
    donorId: 'donor-1'
  },
  patient: {
    profile: {
      id: 'user-patient-1',
      email: 'rajesh.patil@example.com',
      full_name: 'Rajesh Patil',
      role: 'patient',
      phone: '+91 98231 99001',
      city: 'Mumbai',
      area: 'Bandra West',
      created_at: '2025-03-15T11:00:00Z'
    }
  },
  blood_bank: {
    profile: {
      id: 'user-bb-1',
      email: 'admin@lifecareblood.org',
      full_name: 'Dr. Sunita Rao (LifeCare Blood Center)',
      role: 'blood_bank',
      phone: '+91 22 2830 4567',
      city: 'Mumbai',
      area: 'Andheri East',
      created_at: '2024-10-11T09:00:00Z'
    }
  },
  admin: {
    profile: {
      id: 'user-admin',
      email: 'chief.admin@lifelink.org',
      full_name: 'System Healthcare Administrator',
      role: 'admin',
      phone: '+91 11 2300 0001',
      city: 'National HQ',
      area: 'Central Operations',
      created_at: '2024-01-01T00:00:00Z'
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('lifelink_active_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.donor.profile; // Default to demo donor for fast evaluation
  });

  const [donorProfile, setDonorProfile] = useState<Donor | null>(() => {
    return dataService.getDonorById('donor-1') || null;
  });

  const role: UserRole = user ? user.role : 'donor';
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (user) {
      localStorage.setItem('lifelink_active_user', JSON.stringify(user));
      if (user.role === 'donor') {
        const found = dataService.getDonorById(user.id) || dataService.getDonorById('donor-1');
        setDonorProfile(found || null);
      } else {
        setDonorProfile(null);
      }
    } else {
      localStorage.removeItem('lifelink_active_user');
      setDonorProfile(null);
    }
  }, [user]);

  const login = async (email: string, targetRole: UserRole = 'donor'): Promise<boolean> => {
    // Check if matching demo profile or build generic profile
    const demo = DEMO_USERS[targetRole];
    const newUser: UserProfile = {
      ...demo.profile,
      email: email || demo.profile.email
    };
    setUser(newUser);
    return true;
  };

  const registerDonor = async (data: RegisterDonorData): Promise<boolean> => {
    const userId = `user-donor-${Date.now()}`;
    const donorId = `donor-${Date.now()}`;
    const cardId = `LL-${data.city.slice(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDonor: Donor = {
      id: donorId,
      user_id: userId,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      age: data.age,
      blood_group: data.blood_group,
      city: data.city,
      area: data.area,
      pincode: data.pincode || '400001',
      is_available: true,
      last_donation_date: data.last_donation_date || '',
      total_donations: data.last_donation_date ? 1 : 0,
      impact_score: data.last_donation_date ? 20 : 10,
      digital_card_id: cardId,
      college_name: data.college_name,
      badges: ['New Lifesaver'],
      is_verified: true,
      created_at: new Date().toISOString()
    };

    dataService.addDonor(newDonor);

    const newUserProfile: UserProfile = {
      id: userId,
      email: data.email,
      full_name: data.full_name,
      role: 'donor',
      phone: data.phone,
      city: data.city,
      area: data.area,
      created_at: new Date().toISOString()
    };

    setUser(newUserProfile);
    setDonorProfile(newDonor);
    return true;
  };

  const registerGeneric = async (data: RegisterGenericData): Promise<boolean> => {
    const userId = `user-${data.role}-${Date.now()}`;
    const newUserProfile: UserProfile = {
      id: userId,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      phone: data.phone,
      city: data.city,
      area: data.area,
      created_at: new Date().toISOString()
    };

    setUser(newUserProfile);
    return true;
  };

  const logout = () => {
    setUser(null);
    setDonorProfile(null);
    localStorage.removeItem('lifelink_active_user');
  };

  const switchDemoRole = (newRole: UserRole) => {
    const target = DEMO_USERS[newRole];
    setUser(target.profile);
    if (newRole === 'donor' && target.donorId) {
      setDonorProfile(dataService.getDonorById(target.donorId) || null);
    } else {
      setDonorProfile(null);
    }
  };

  const updateDonorAvailability = (): boolean => {
    if (donorProfile) {
      const newStatus = dataService.toggleDonorAvailability(donorProfile.id);
      setDonorProfile({ ...donorProfile, is_available: newStatus });
      return newStatus;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        donorProfile,
        role,
        isAuthenticated,
        login,
        registerDonor,
        registerGeneric,
        logout,
        switchDemoRole,
        updateDonorAvailability
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
