# LIFE LINK – Smart Blood Donation Management System
> **Tagline:** *"Every Drop Connects a Life."*

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-red.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com/)
[![Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

A modern, responsive, and clinically grounded healthcare platform connecting voluntary blood donors, emergency patients, certified blood banks, and collegiate communities. Built for university-level AI & Data Science exhibitions and real-world deployment.

---

## 🩸 Core Innovations & Differentiating Features

### 1. Smart Blood Matching Engine (`src/utils/compatibility.ts`)
- **Clinical Red-Cell Matrix:** Full ABO & Rh system compatibility rules (including O- universal RBC donor and AB+ universal recipient).
- **Multi-Factor Scoring (0–100%):** Weighted quantitative ranking combining exact vs. compatible blood group (45 pts), on-call availability (25 pts), hyper-local geographic proximity (20 pts), and mandatory 90-day cooldown interval (10 pts).
- **Privacy-Preserving Contact:** Volunteer phone numbers and identity markers remain masked until explicit bilateral consent is established.

### 2. High-Priority Emergency SOS Broadcast (`src/pages/EmergencySOS.tsx`)
- High-visibility broadcast for acute surgical trauma, obstetric hemorrhage, and pediatric emergencies.
- **5-Stage Pipeline Tracking:** `Pending` ➔ `Donor Contacted` ➔ `Donor Confirmed` ➔ `Fulfilled` (or `Cancelled`).
- Live donor response logger with dispatch confirmations and time logs.

### 3. Rare Blood Phenotype Finder (`src/pages/RareBloodFinder.tsx`)
- Specialized registry for ultra-rare phenotypes: **Bombay Blood Group (Oh)** and **Rh-null ("Golden Blood")**, as well as rare negatives (`AB-`, `B-`, `A-`).
- Prevents fatal transfusion reactions: Explains the H-antigen deficiency and alerts registered rare donors nationwide.

### 4. Digital Donor ID Card (`src/components/common/DigitalDonorCard.tsx`)
- Holographic, printable, and downloadable digital credential.
- Displays unique Donor ID (e.g., `LL-MUM-2026-1042`), blood group badge, verified donation milestones, impact points, and QR verification stamp.

### 5. Blood Bank Inventory & Expiry Tracker (`src/pages/BloodBankDashboard.tsx`)
- Real-time cold storage unit tracking (2–6°C optimal monitoring).
- **Expiry Tracker:** Automated alerts for batches reaching shelf-life expiry within 7 days to fast-track elective procedures and eliminate wastage.

### 6. College Blood Donation Championship (`src/pages/CollegeNetwork.tsx`)
- Inter-college participation leaderboard ranking university NSS & Red Cross chapters.
- Campus donation drive management, target unit trackers, and student ambassador badges.

---

## 👥 Four Stakeholder Roles & Dashboards

1. **Volunteer Donor (`/donor-dashboard`)**:
   - Welcome greeting, blood group badge, on-call toggle switch, Impact Score (out of 100), digital donor card generator, nearby blood requests with 1-click "I Will Donate" response, and authenticated past donation history.
2. **Patient & Hospital Care (`/patient-dashboard`)**:
   - Requisition creation, status progression pipeline, live list of responded donors with contacts, and nearby blood bank component inventory suggestions.
3. **Blood Bank Technician (`/blood-bank-dashboard`)**:
   - Accredited facility profile, cold storage inventory management, batch logging with 35-day collection/expiry calculators, and 7-day expiry warnings.
4. **Healthcare Administrator (`/admin-dashboard`)**:
   - Platform KPIs, supply vs. demand bar analytics across all blood groups, donor credential verification console, and blood bank licensing review.

---

## 🎨 Design System & Palette

- **Deep Red:** `#B71C1C` (Primary Brand & Clinical Elements)
- **Bright Red:** `#E53935` (Emergency SOS & Accents)
- **White:** `#FFFFFF` (Surface Cards & Modals)
- **Light Healthcare Background:** `#F7F7F9`
- **Dark Text:** `#222222` (High-contrast readability)

---

## 🗄️ Database & Supabase Architecture

The complete PostgreSQL migration script is provided in `supabase/schema.sql` with:
- 11 relational tables: `profiles`, `donors`, `blood_banks`, `blood_inventory`, `blood_requests`, `donor_responses`, `colleges`, `donation_camps`, `camp_registrations`, `donation_history`, `notifications`.
- Custom PostgreSQL ENUMs (`user_role`, `blood_group_type`, `urgency_level`, `request_status`, `inventory_status`).
- Row Level Security (RLS) policies protecting user profiles and donor contact data.
- Automated fallback to local storage mock service with realistic pre-seeded Indian metropolitan records (Mumbai, Pune, Delhi, Bengaluru, Hyderabad).

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Setup & Launch

1. **Navigate to the project directory:**
   ```bash
   cd lifelink
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **(Optional) Configure Supabase:**
   Copy `.env.example` to `.env` and fill in your Supabase project keys:
   ```bash
   cp .env.example .env
   ```
   *Note: If no `.env` is provided, LIFE LINK automatically runs in high-fidelity Demonstration Mode with full local persistence.*

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` (or the port displayed in the console).

5. **Run the automated test suite:**
   ```bash
   npm test
   ```

6. **Build for production:**
   ```bash
   npm run build
   ```

---

## ⚖️ Clinical & Legal Notice
LIFE LINK connects volunteer donors, hospitals, and blood banks. Preliminary compatibility calculations are advisory reference tools. Pre-transfusion laboratory blood grouping, crossmatching, and mandatory infectious screening (HIV, HBV, HCV, Syphilis, Malaria) must always be performed by licensed medical professionals and certified blood bank personnel.
