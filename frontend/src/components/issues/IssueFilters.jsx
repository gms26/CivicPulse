import { Search, Filter, AlertTriangle } from 'lucide-react';

export const IssueFilters = ({ keyword, setKeyword, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter, priorityFilter, setPriorityFilter }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 mb-6 animate-fade-in">
      
      {/* Search Input */}
      <div className="relative flex-grow lg:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          placeholder="Search by title or location..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* Filters Container */}
      <div className="flex flex-wrap sm:flex-nowrap gap-3 flex-grow justify-end">
        
        {/* Category Filter */}
        {setCategoryFilter && (
          <div className="relative w-full sm:w-auto min-w-[140px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="pl-9 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-white"
              value={categoryFilter || ''}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="ROAD">Road</option>
              <option value="WATER">Water</option>
              <option value="POWER">Power</option>
              <option value="GARBAGE">Garbage</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div className="relative w-full sm:w-auto min-w-[130px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
          <select
            className="pl-9 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-white"
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        {/* Priority Filter */}
        {setPriorityFilter && (
          <div className="relative w-full sm:w-auto min-w-[130px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AlertTriangle className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="pl-9 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-white"
              value={priorityFilter || ''}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        )}

      </div>
    </div>
  );
};
