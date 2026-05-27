import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../common';

const COLORS = {
  OPEN: '#dc2626',       // danger
  IN_PROGRESS: '#f59e0b',// accent
  RESOLVED: '#16a34a'    // success
};

export const ResolutionRateChart = ({ data }) => {
  const chartData = Object.keys(data || {}).map(key => ({
    name: key.replace('_', ' '),
    value: data[key],
    rawKey: key
  })).filter(item => item.value > 0);

  return (
    <Card className="p-6 flex flex-col h-full animate-fade-in">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Current Status Distribution</h3>
      {chartData.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-400 text-sm">No data available</div>
      ) : (
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.rawKey] || '#9ca3af'} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
