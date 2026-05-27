import { useState, useEffect } from 'react';
import { getAdminIssues } from '../../api/adminApi';
import { Loader } from '../../components/common';
import { IssueCard, IssueFilters, IssueDetailModal } from '../../components/issues';
import { useWebSocket } from '../../hooks/useWebSocket';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';

export const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const [selectedIssue, setSelectedIssue] = useState(null);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      // The backend accepts category, status, priority, and search keyword
      const params = {
        page,
        size: 20,
        ...(categoryFilter && { category: categoryFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(priorityFilter && { priority: priorityFilter }),
        ...(keyword && { search: keyword }),
      };
      
      const data = await getAdminIssues(params);
      setIssues(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce keyword search slightly
    const timer = setTimeout(() => {
      fetchIssues();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, statusFilter, categoryFilter, priorityFilter, keyword]);

  // Real-time refresh when new WebSocket notification arrives (e.g., someone creates a new issue)
  useWebSocket(() => {
    if (page === 0) {
      fetchIssues();
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Issue Management Console</h1>
        <p className="text-gray-500 text-sm mt-1">Review, assign, and update civic issues reported by citizens.</p>
        <p className="text-primary text-sm font-medium mt-2">Total Issues: {totalElements}</p>
      </div>

      <IssueFilters 
        keyword={keyword} setKeyword={setKeyword}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
      />

      {loading ? (
        <div className="py-20"><Loader /></div>
      ) : issues.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No issues found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {issues.map(issue => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              onClick={() => setSelectedIssue(issue)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button 
            disabled={page === 0} 
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
          <button 
            disabled={page === totalPages - 1} 
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <IssueDetailModal 
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        issue={selectedIssue}
        onIssueUpdated={() => {
          fetchIssues();
          // Keep modal open to show updated data, it will re-render because we fetch updated list
          // which updates the issue ref indirectly if we wanted to map it, but for simplicity
          // the user will see changes when they close, or we can close it:
          setSelectedIssue(null);
        }}
      />
    </div>
  );
};
