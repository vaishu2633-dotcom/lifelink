-- =========================================================================
-- LIFE LINK – Smart Blood Donation Management System
-- PostgreSQL & Supabase Database Schema
-- TAGLINE: "Every Drop Connects a Life."
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('donor', 'patient', 'blood_bank', 'admin');
CREATE TYPE blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Oh (Bombay)', 'Rh-null');
CREATE TYPE urgency_level AS ENUM ('normal', 'urgent', 'critical_sos');
CREATE TYPE request_status AS ENUM ('pending', 'donor_contacted', 'donor_confirmed', 'fulfilled', 'cancelled');
CREATE TYPE inventory_status AS ENUM ('safe', 'expiring_soon', 'expired');
CREATE TYPE response_status AS ENUM ('interested', 'confirmed', 'declined', 'completed');
CREATE TYPE camp_status AS ENUM ('upcoming', 'ongoing', 'completed');

-- 2. PROFILES TABLE (linked to auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'donor',
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. COLLEGES TABLE (College Blood Donation Network)
CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    total_donors INTEGER DEFAULT 0,
    total_units_donated INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 1,
    coordinator_name TEXT NOT NULL,
    coordinator_contact TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. DONORS TABLE
CREATE TABLE donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER CHECK (age >= 18 AND age <= 65),
    blood_group blood_group_type NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    last_donation_date DATE,
    total_donations INTEGER DEFAULT 0,
    impact_score INTEGER DEFAULT 0,
    digital_card_id TEXT UNIQUE NOT NULL,
    college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
    badges TEXT[] DEFAULT ARRAY['New Lifesaver'],
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. BLOOD BANKS TABLE
CREATE TABLE blood_banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    operating_hours TEXT DEFAULT '24x7 Emergency Services',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. BLOOD INVENTORY TABLE (Blood Expiry Tracker)
CREATE TABLE blood_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE CASCADE NOT NULL,
    blood_group blood_group_type NOT NULL,
    units INTEGER NOT NULL CHECK (units >= 0),
    collection_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status inventory_status DEFAULT 'safe',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. BLOOD REQUESTS & EMERGENCY SOS TABLE
CREATE TABLE blood_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    hospital_location TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    blood_group blood_group_type NOT NULL,
    units_needed INTEGER NOT NULL CHECK (units_needed > 0),
    urgency urgency_level DEFAULT 'normal',
    required_date DATE NOT NULL,
    status request_status DEFAULT 'pending',
    notes TEXT,
    is_sos BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    fulfilled_at TIMESTAMP WITH TIME ZONE
);

-- 8. DONOR RESPONSES TABLE
CREATE TABLE donor_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES blood_requests(id) ON DELETE CASCADE NOT NULL,
    donor_id UUID REFERENCES donors(id) ON DELETE CASCADE NOT NULL,
    donor_name TEXT NOT NULL,
    donor_phone TEXT NOT NULL,
    donor_blood_group blood_group_type NOT NULL,
    status response_status DEFAULT 'interested',
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. DONATION CAMPS TABLE
CREATE TABLE donation_camps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organizer_name TEXT NOT NULL,
    college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    venue TEXT NOT NULL,
    city TEXT NOT NULL,
    target_units INTEGER DEFAULT 100,
    registered_count INTEGER DEFAULT 0,
    collected_units INTEGER DEFAULT 0,
    contact_phone TEXT NOT NULL,
    status camp_status DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. CAMP REGISTRATIONS TABLE
CREATE TABLE camp_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    camp_id UUID REFERENCES donation_camps(id) ON DELETE CASCADE NOT NULL,
    donor_id UUID REFERENCES donors(id) ON DELETE CASCADE NOT NULL,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. DONATION HISTORY TABLE
CREATE TABLE donation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES donors(id) ON DELETE CASCADE NOT NULL,
    blood_bank_id UUID REFERENCES blood_banks(id) ON DELETE SET NULL,
    camp_id UUID REFERENCES donation_camps(id) ON DELETE SET NULL,
    units INTEGER DEFAULT 1,
    donation_date DATE NOT NULL,
    certificate_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Read policies: public reads for searching blood, camps, colleges and verified blood banks
CREATE POLICY "Public profiles can be viewed" ON profiles FOR SELECT USING (true);
CREATE POLICY "Donors are viewable for matching" ON donors FOR SELECT USING (true);
CREATE POLICY "Blood banks are viewable by public" ON blood_banks FOR SELECT USING (true);
CREATE POLICY "Inventory viewable by public" ON blood_inventory FOR SELECT USING (true);
CREATE POLICY "Blood requests viewable by all" ON blood_requests FOR SELECT USING (true);
CREATE POLICY "Camps viewable by public" ON donation_camps FOR SELECT USING (true);
CREATE POLICY "Colleges viewable by public" ON colleges FOR SELECT USING (true);
CREATE POLICY "Notifications viewable by owner" ON notifications FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Write policies: authenticated users can manage their own records
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Donors can update own donor info" ON donors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Requesters can create blood requests" ON blood_requests FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Requesters can update their requests" ON blood_requests FOR UPDATE USING (auth.uid() = requester_id);
CREATE POLICY "Donors can submit responses" ON donor_responses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authorized blood bank staff update stock" ON blood_inventory FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'blood_bank' OR profiles.role = 'admin'))
);
