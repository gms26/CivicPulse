import { useState, useEffect } from 'react';
import { getSummary, getByCategory, getByStatus, getTrends } from '../../api/analyticsApi';
import { Loader } from '../../components/common';
import { StatsCard, CategoryChart, ResolutionRateChart, TrendChart } from '../../components/dashboard';
import { LayoutDashboard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: null,
    byCategory: null,
    byStatus: null,
    trends: null
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [summary, byCategory, byStatus, trends] = await Promise.all([
          getSummary(),
          getByCategory(),
          getByStatus(),
          getTrends()
        ]);
        
        setData({ summary, byCategory, byStatus, trends });
      } catch (err) {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="min-h-[calc(100vh-64px)] flex items-center justify-center"><Loader /></div>;
  }

  const { summary, byCategory, byStatus, trends } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Platform-wide statistics and performance metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Issues" 
          value={summary.totalIssues} 
          icon={LayoutDashboard} 
          colorClass="text-primary bg-primary/10"
        />
        <StatsCard 
          title="Open Issues" 
          value={summary.openIssues} 
          icon={AlertCircle} 
          colorClass="text-danger bg-danger/10"
        />
        <StatsCard 
          title="In Progress" 
          value={summary.inProgressIssues} 
          icon={Clock} 
          colorClass="text-accent bg-accent/10"
        />
        <StatsCard 
          title="Resolution Rate" 
          value={`${summary.resolutionRate.toFixed(1)}%`} 
          icon={CheckCircle} 
          trend="+1.2%" trendLabel="vs last month"
          colorClass="text-success bg-success/10"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TrendChart data={trends} />
        <ResolutionRateChart data={byStatus} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CategoryChart data={byCategory} />
      </div>
    </div>
  );
};
