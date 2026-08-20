import { Loader } from '../common';

const statusColors = {
  OPEN: { dot: 'bg-red-500', ring: 'ring-red-100', text: 'text-red-700', bg: 'bg-red-50' },
  IN_PROGRESS: { dot: 'bg-amber-500', ring: 'ring-amber-100', text: 'text-amber-700', bg: 'bg-amber-50' },
  RESOLVED: { dot: 'bg-emerald-500', ring: 'ring-emerald-100', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  CREATED: { dot: 'bg-blue-500', ring: 'ring-blue-100', text: 'text-blue-700', bg: 'bg-blue-50' },
};

const getColors = (status, isCreation) => {
  if (isCreation) return statusColors.CREATED;
  return statusColors[status] || statusColors.OPEN;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const statusLabel = (status) => {
  if (!status) return '';
  return status.replace(/_/g, ' ');
};

export const IssueTimeline = ({ timeline, loading }) => {
  if (loading) {
    return (
      <div className="py-12">
        <Loader />
      </div>
    );
  }

  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">No timeline data available.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6">
      {/* Vertical connecting line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-200" />

      <div className="space-y-0">
        {timeline.map((entry, index) => {
          const isCreation = entry.oldStatus === null && entry.newStatus === 'OPEN';
          const colors = getColors(entry.newStatus, isCreation);
          const isLast = index === timeline.length - 1;

          return (
            <div key={entry.id || index} className="relative pb-6 last:pb-0">
              {/* Dot */}
              <div
                className={`absolute -left-6 top-1 w-[22px] h-[22px] rounded-full ${colors.dot} ring-4 ${colors.ring} z-10 flex items-center justify-center`}
              >
                <div className="w-2 h-2 rounded-full bg-white/80" />
              </div>

              {/* Content card */}
              <div className={`ml-4 p-3 rounded-lg border border-gray-100 ${isLast && !isCreation ? colors.bg : 'bg-white'} shadow-sm transition-all hover:shadow-md`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold uppercase tracking-wide ${colors.text}`}>
                    {isCreation ? 'Issue Reported' : 'Status Changed'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>

                {/* Status change badge */}
                {!isCreation && entry.oldStatus && entry.newStatus && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {statusLabel(entry.oldStatus)}
                    </span>
                    <span className="text-gray-400 text-xs">→</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                      {statusLabel(entry.newStatus)}
                    </span>
                  </div>
                )}

                {/* Comment */}
                {entry.comment && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {isCreation ? '' : '💬 '}{entry.comment}
                  </p>
                )}

                {/* Author */}
                <p className="text-[11px] text-gray-400 mt-1.5">
                  {isCreation ? 'Reported by' : 'By'}{' '}
                  <span className="font-semibold text-gray-600">{entry.updatedByName}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
