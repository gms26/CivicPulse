import { useState } from 'react';
import { Modal, Button, StatusBadge } from '../common';
import { updateIssueStatus, updateIssuePriority, assignIssue } from '../../api/adminApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { MapPin, Calendar, User as UserIcon } from 'lucide-react';

export const IssueDetailModal = ({ isOpen, onClose, issue, onIssueUpdated }) => {
  const { isAdmin } = useAuth();
  
  const [status, setStatus] = useState(issue?.status || '');
  const [statusComment, setStatusComment] = useState('');
  
  const [priority, setPriority] = useState(issue?.priority || 'LOW');
  
  const [assigneeId, setAssigneeId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync state when issue changes
  useState(() => {
    if (issue) {
      setStatus(issue.status);
      setPriority(issue.priority || 'LOW');
    }
  }, [issue]);

  if (!issue) return null;

  const handleUpdateStatus = async () => {
    if (status === issue.status) return;
    setIsUpdating(true);
    try {
      await updateIssueStatus(issue.id, status, statusComment);
      toast.success('Status updated successfully');
      onIssueUpdated();
      setStatusComment('');
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePriority = async () => {
    if (priority === issue.priority) return;
    setIsUpdating(true);
    try {
      await updateIssuePriority(issue.id, priority);
      toast.success('Priority updated successfully');
      onIssueUpdated();
    } catch (err) {
      toast.error('Failed to update priority');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssign = async () => {
    if (!assigneeId) return;
    setIsUpdating(true);
    try {
      await assignIssue(issue.id, parseInt(assigneeId));
      toast.success('Issue assigned successfully');
      onIssueUpdated();
      setAssigneeId('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign issue');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue Details">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* Header Info */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-primary uppercase bg-primary/10 px-2 py-1 rounded">
              {issue.categoryDisplayName}
            </span>
            <StatusBadge status={issue.status} displayName={issue.statusDisplayName} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{issue.title}</h2>
        </div>

        {issue.imageUrl && (
          <img src={issue.imageUrl} alt={issue.title} className="w-full h-48 object-cover rounded-lg" />
        )}

        <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
          {issue.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <span>{issue.locationAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400 shrink-0" />
            <span>{new Date(issue.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon size={16} className="text-gray-400 shrink-0" />
            <span>Reported by: <br/><span className="font-medium text-gray-900">{issue.reporterName}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon size={16} className="text-primary shrink-0" />
            <span>Assigned Admin: <br/><span className="font-medium text-gray-900">{issue.assignedAdminName || 'Unassigned'}</span></span>
          </div>
        </div>

        {/* ADMIN ACTIONS */}
        {isAdmin && (
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
            <h4 className="font-bold text-gray-900 text-sm">Admin Controls</h4>
            
            {/* Status Update */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-xs font-medium text-gray-700 mb-1">Update Status</label>
              <div className="flex flex-col gap-2">
                <select 
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-primary focus:border-primary"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Optional comment for reporter..." 
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-primary focus:border-primary"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                />
                <Button size="sm" onClick={handleUpdateStatus} disabled={isUpdating || status === issue.status} className="w-full">
                  Update Status
                </Button>
              </div>
            </div>

            {/* Priority Update */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-end gap-2">
              <div className="flex-grow">
                <label className="block text-xs font-medium text-gray-700 mb-1">Set Priority</label>
                <select 
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-primary focus:border-primary"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
              <Button size="sm" variant="outline" onClick={handleUpdatePriority} disabled={isUpdating || priority === issue.priority}>
                Set
              </Button>
            </div>

            {/* Assignment */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-end gap-2">
              <div className="flex-grow">
                <label className="block text-xs font-medium text-gray-700 mb-1">Assign to Admin (ID)</label>
                <input 
                  type="number" 
                  placeholder="Admin User ID" 
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-primary focus:border-primary"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                />
              </div>
              <Button size="sm" variant="secondary" onClick={handleAssign} disabled={isUpdating || !assigneeId}>
                Assign
              </Button>
            </div>

          </div>
        )}
      </div>
    </Modal>
  );
};
