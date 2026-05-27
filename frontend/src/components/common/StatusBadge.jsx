export const StatusBadge = ({ status, displayName }) => {
  const colors = {
    OPEN: "bg-danger-light text-danger-dark bg-opacity-20",
    IN_PROGRESS: "bg-accent-light text-accent-dark bg-opacity-20",
    RESOLVED: "bg-success-light text-success-dark bg-opacity-20",
  };

  const defaultColor = "bg-gray-100 text-gray-800";
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[status] || defaultColor}`}>
      {displayName || status}
    </span>
  );
};
