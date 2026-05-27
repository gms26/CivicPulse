import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSummary, getByCategory, getByStatus } from '../api/analyticsApi';
import { Loader } from '../components/common';
import { StatsCard, CategoryChart, ResolutionRateChart } from '../components/dashboard';
import { Activity, CheckCircle, Shield } from 'lucide-react';

export const PublicDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [summary, byCategory, byStatus] = await Promise.all([
          getSummary(),
          getByCategory(),
          getByStatus()
        ]);
        setData({ summary, byCategory, byStatus });
      } catch (err) {
        console.error("Failed to load public metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center animate-fade-in shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          CivicPulse <br className="md:hidden"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent ml-2">
            Community Issue Tracker
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10">
          Empowering citizens to report local infrastructure issues like potholes, power outages, and broken pipes directly to city authorities for swift resolution.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 text-lg"
          >
            Report an Issue
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto px-8 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm text-lg"
          >
            Citizen Sign In
          </Link>
        </div>
      </div>

      {/* Live Metrics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-grow">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Live Community Impact</h2>
          <p className="mt-2 text-gray-500">Real-time statistics driven by citizen reports.</p>
        </div>
        
        {loading ? (
          <div className="py-20 flex justify-center"><Loader /></div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatsCard 
                title="Total Reports Submitted" 
                value={data.summary.totalIssues} 
                icon={Activity} 
                colorClass="text-primary bg-primary/10"
              />
              <StatsCard 
                title="Successfully Resolved" 
                value={data.summary.resolvedIssues} 
                icon={CheckCircle} 
                colorClass="text-success bg-success/10"
              />
              <StatsCard 
                title="City Resolution Rate" 
                value={`${data.summary.resolutionRate.toFixed(1)}%`} 
                icon={Shield} 
                colorClass="text-accent bg-accent/10"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="shadow-lg rounded-xl overflow-hidden">
                <ResolutionRateChart data={data.byStatus} />
              </div>
              <div className="shadow-lg rounded-xl overflow-hidden">
                <CategoryChart data={data.byCategory} />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">Live metrics temporarily unavailable.</div>
        )}
      </div>
    </div>
  );
};
