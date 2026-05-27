import { Card, StatusBadge } from '../common';
import { MapPin } from 'lucide-react';

export const IssueCard = ({ issue, onClick }) => {
  return (
    <Card 
      onClick={onClick}
      className={`flex flex-col h-full hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:border-primary/50' : ''}`}
    >
      {issue.imageUrl ? (
        <div className="h-48 w-full overflow-hidden bg-gray-100">
          <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No Image Provided
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
            {issue.categoryDisplayName}
          </span>
          <StatusBadge status={issue.status} displayName={issue.statusDisplayName} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{issue.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{issue.description}</p>
        <div className="flex items-center text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="truncate">{issue.locationAddress}</span>
        </div>
        <div className="text-[10px] text-gray-400 mt-2 flex justify-between">
          <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
          {issue.priority && (
            <span className={`font-semibold ${issue.priority === 'CRITICAL' ? 'text-danger' : issue.priority === 'HIGH' ? 'text-accent' : 'text-gray-500'}`}>
              Priority: {issue.priority}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
