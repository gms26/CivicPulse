import { Card } from '../common';

export const StatsCard = ({ title, value, icon: Icon, trend, trendLabel, colorClass = "text-primary" }) => {
  return (
    <Card className="p-6 flex flex-col h-full animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {Icon && (
          <div className={`p-2 rounded-lg bg-gray-50 ${colorClass}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="mt-auto">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p className="text-sm mt-2 flex items-center">
            <span className={`font-medium ${trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
              {trend}
            </span>
            <span className="text-gray-400 ml-2">{trendLabel}</span>
          </p>
        )}
      </div>
    </Card>
  );
};
