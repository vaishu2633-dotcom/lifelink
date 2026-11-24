import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DemoSwitcherBar } from './components/common/DemoSwitcherBar';

// Pages
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { FindBlood } from './pages/FindBlood';
import { EmergencySOS } from './pages/EmergencySOS';
import { DonorDashboard } from './pages/DonorDashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { BloodBankDashboard } from './pages/BloodBankDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { RareBloodFinder } from './pages/RareBloodFinder';
import { BloodBankMap } from './pages/BloodBankMap';
import { DonationCamps } from './pages/DonationCamps';
import { CollegeNetwork } from './pages/CollegeNetwork';
import { ContactUs } from './pages/ContactUs';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Handle hash changes for smooth URL navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string) => {
    window.location.hash = page;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigateTo} />;
      case 'about':
        return <AboutUs />;
      case 'login':
        return <Login onNavigate={navigateTo} />;
      case 'register':
        return <Register onNavigate={navigateTo} />;
      case 'find-blood':
        return <FindBlood onNavigate={navigateTo} />;
      case 'emergency-sos':
        return <EmergencySOS />;
      case 'donor-dashboard':
        return <DonorDashboard onNavigate={navigateTo} />;
      case 'patient-dashboard':
        return <PatientDashboard onNavigate={navigateTo} />;
      case 'blood-bank-dashboard':
        return <BloodBankDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'rare-blood':
        return <RareBloodFinder onNavigate={navigateTo} />;
      case 'blood-banks':
        return <BloodBankMap onNavigate={navigateTo} />;
      case 'camps':
        return <DonationCamps onNavigate={navigateTo} />;
      case 'colleges':
        return <CollegeNetwork onNavigate={navigateTo} />;
      case 'contact':
        return <ContactUs />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F9] text-[#222222]">
      {/* 1. Quick Project Demo Switcher Bar */}
      <DemoSwitcherBar />

      {/* 2. Navigation Header */}
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      {/* 3. Main Page Content View */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* 4. Global Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
