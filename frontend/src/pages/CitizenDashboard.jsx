import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyIssues } from '../api/issueApi';
import { Loader, Modal } from '../components/common';
import { IssueCard, IssueFilters, IssueDetailModal } from '../components/issues';
import { Plus, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const CitizenDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [selectedIssue, setSelectedIssue] = useState(null);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const data = await getMyIssues({ page, size: 20 });
      let content = data.content;
      
      if (statusFilter) {
        content = content.filter(issue => issue.status === statusFilter);
      }
      if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        content = content.filter(issue => 
          issue.title.toLowerCase().includes(lowerKeyword) || 
          issue.locationAddress.toLowerCase().includes(lowerKeyword)
        );
      }

      setIssues(content);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error('Failed to load your issues.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [page, statusFilter, keyword]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reported Issues</h1>
          <p className="text-gray-500 text-sm mt-1">Track the status of your civic reports</p>
        </div>
        <Link 
          to="/citizen/report" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} /> New Report
        </Link>
      </div>

      <IssueFilters 
        keyword={keyword} setKeyword={setKeyword}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
      />

      {loading ? (
        <div className="py-20"><Loader /></div>
      ) : issues.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No issues found</h3>
          <p className="text-gray-500 mt-1">You haven't reported any issues matching the criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map(issue => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              onClick={() => setSelectedIssue(issue)}
            />
          ))}
        </div>
      )}

      <IssueDetailModal 
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        issue={selectedIssue}
        onIssueUpdated={fetchIssues}
      />
    </div>
  );
};
