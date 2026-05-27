import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../common';

export const CategoryChart = ({ data }) => {
  // Map raw data from map to array for recharts
  const chartData = Object.keys(data || {}).map(key => ({
    name: key,
    count: data[key]
  })).sort((a, b) => b.count - a.count);

  return (
    <Card className="p-6 flex flex-col h-full animate-fade-in">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Issues by Category</h3>
      {chartData.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-400 text-sm">No data available</div>
      ) : (
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
