import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSummary, getByCategory, getByStatus } from '../../api/analyticsApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Loader } from '../../components/common';
import { Activity, CheckCircle, AlertCircle, Shield } from 'lucide-react';
const STATUS_COLORS = {
  OPEN: '#dc2626',
  IN_PROGRESS: '#f59e0b',
  RESOLVED: '#16a34a'
};

export const PublicDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: null,
    byCategory: [],
    byStatus: []
  });

  useEffect(() => {
    let retryTimeout;

    const fetchPublicData = async () => {
      try {
        const [summaryData, categoryData, statusData] = await Promise.all([
          getSummary(),
          getByCategory(),
          getByStatus()
        ]);

        // Format category data for Recharts BarChart
        const formattedCategory = Object.keys(categoryData || {}).map(key => ({
          name: key,
          count: categoryData[key]
        })).sort((a, b) => b.count - a.count);

        // Format status data for Recharts PieChart
        const formattedStatus = Object.keys(statusData || {}).map(key => ({
          name: key.replace('_', ' '),
          value: statusData[key],
          rawKey: key
        })).filter(item => item.value > 0);

        setData({
          summary: summaryData,
          byCategory: formattedCategory,
          byStatus: formattedStatus
        });
        setLoading(false);
      } catch (err) {
        console.warn("Server unavailable, retrying in 5 seconds...");
        retryTimeout = setTimeout(fetchPublicData, 5000);
      }
    };

    fetchPublicData();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50">
        <Loader />
        <p className="mt-4 text-primary font-medium animate-pulse text-lg">Starting server, please wait...</p>
        <p className="text-gray-500 text-sm mt-2">Free tier servers may take up to 50 seconds to wake up.</p>
      </div>
    );
  }

  const { summary, byCategory, byStatus } = data;

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e40af] mb-4 tracking-tight">
          CivicPulse
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Community Issue Reporting & Resolution Platform
        </h2>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10">
          Empowering citizens to report and track local civic issues
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3 bg-[#1e40af] text-white font-medium rounded-lg hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/30 text-lg"
          >
            Report an Issue
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm text-lg"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Live Metrics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-grow">

        {/* Live Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Issues</h3>
              <div className="p-2 rounded-lg bg-blue-50 text-[#1e40af]"><Activity size={20} /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-auto">{summary.totalIssues}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Resolved</h3>
              <div className="p-2 rounded-lg bg-green-50 text-[#16a34a]"><CheckCircle size={20} /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-auto">{summary.resolvedIssues}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Open</h3>
              <div className="p-2 rounded-lg bg-red-50 text-[#dc2626]"><AlertCircle size={20} /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-auto">{summary.openIssues}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Resolution Rate</h3>
              <div className="p-2 rounded-lg bg-amber-50 text-[#f59e0b]"><Shield size={20} /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-auto">{summary.resolutionRate.toFixed(1)}%</p>
          </div>

        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Issues by Category</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Current Status Distribution</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {byStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.rawKey] || '#9ca3af'} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            CivicPulse &copy; 2025 | Built for Community
          </p>
        </div>
      </footer>
    </div>
  );
};
