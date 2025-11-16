
import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { MapPage } from './components/MapPage';
import { NewsFeedPage } from './components/NewsFeedPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { ReportHazardWizard } from './components/ReportHazardWizard';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isReporting, setIsReporting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleReportSubmit = () => {
    setIsReporting(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <HomePage onNavigate={handleNavigate} />;
      case Page.MAP:
        return <MapPage onReportHazard={() => setIsReporting(true)} onNavigate={handleNavigate} />;
      case Page.NEWS:
        return <NewsFeedPage onNavigate={handleNavigate} />;
      case Page.ANALYTICS:
        return <AnalyticsPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // For hash-based routing simulation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toUpperCase();
      if (hash in Page) {
        setCurrentPage(Page[hash as keyof typeof Page]);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  return (
    <>
      {renderPage()}
      <ReportHazardWizard
        isOpen={isReporting}
        onClose={() => setIsReporting(false)}
        onSubmit={handleReportSubmit}
      />
      {showSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-green-500/20 backdrop-blur-md border border-green-400 text-white px-6 py-4 rounded-xl shadow-lg flex items-center space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-bold">Hazard Report Submitted</p>
            <p className="text-sm text-green-200">Thank you for helping keep our oceans safe.</p>
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="text-green-200 hover:text-white">&times;</button>
        </div>
      )}
    </>
  );
};

export default App;
