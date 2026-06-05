import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../common';

export const TrendChart = ({ data }) => {
  const chartData = Object.keys(data || {}).map(dateStr => {
    // Format YYYY-MM-DD to DD MMM
    const dateObj = new Date(dateStr);
    const formatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      dateString: dateStr,
      displayDate: formatted,
      count: data[dateStr]
    };
  }).sort((a, b) => new Date(a.dateString) - new Date(b.dateString));

  return (
    <Card className="p-6 flex flex-col h-full animate-fade-in">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Issues Reported (Last 30 Days)</h3>
      {chartData.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-400 text-sm">No data available</div>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={20} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 6, fill: '#f59e0b' }} 
                name="Reports"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
