import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBugById, deleteBug, updateBug } from '../../services/bugService';
import Button from '../Button';

function BugDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchBug = async () => {
      try {
        const data = await getBugById(id);
        setBug(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bug details');
      } finally {
        setLoading(false);
      }
    };

    fetchBug();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        setIsDeleting(true);
        await deleteBug(id);
        navigate('/bugs');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete bug');
        setIsDeleting(false);
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdatingStatus(true);
      const updatedBug = await updateBug(id, { status: newStatus });
      setBug(updatedBug);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bug status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const statusColors = {
    'open': 'bg-red-100 text-red-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'resolved': 'bg-green-100 text-green-800'
  };

  const priorityColors = {
    'low': 'bg-blue-100 text-blue-800',
    'medium': 'bg-orange-100 text-orange-800',
    'high': 'bg-red-100 text-red-800'
  };

  if (loading) {
    return <div className="text-center py-10">Loading bug details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!bug) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bug Not Found</h2>
        <p className="mb-4">The bug you're looking for doesn't exist or has been removed.</p>
        <Link to="/bugs">
          <Button>Back to Bug List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{bug.title}</h2>
        <div className="flex space-x-2">
          <Link to={`/bugs/${id}/edit`}>
            <Button variant="secondary">
              <i className="fas fa-edit mr-2"></i> Edit
            </Button>
          </Link>
          <Button 
            variant="danger" 
            onClick={handleDelete} 
            disabled={isDeleting}
          >
            <i className="fas fa-trash mr-2"></i> {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Status</h3>
          <div className="flex items-center">
            <span className={`${statusColors[bug.status]} py-1 px-3 rounded-full text-sm mr-4`}>
              {bug.status.charAt(0).toUpperCase() + bug.status.slice(1)}
            </span>
            {!isUpdatingStatus && (
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant={bug.status === 'open' ? 'primary' : 'outline'} 
                  onClick={() => handleStatusChange('open')}
                  disabled={bug.status === 'open'}
                >
                  Open
                </Button>
                <Button 
                  size="sm" 
                  variant={bug.status === 'in-progress' ? 'primary' : 'outline'} 
                  onClick={() => handleStatusChange('in-progress')}
                  disabled={bug.status === 'in-progress'}
                >
                  In Progress
                </Button>
                <Button 
                  size="sm" 
                  variant={bug.status === 'resolved' ? 'primary' : 'outline'} 
                  onClick={() => handleStatusChange('resolved')}
                  disabled={bug.status === 'resolved'}
                >
                  Resolved
                </Button>
              </div>
            )}
            {isUpdatingStatus && <span className="ml-2 text-sm text-gray-500">Updating...</span>}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Priority</h3>
          <span className={`${priorityColors[bug.priority]} py-1 px-3 rounded-full text-sm`}>
            {bug.priority.charAt(0).toUpperCase() + bug.priority.slice(1)}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
          {bug.description || 'No description provided.'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Created By</h3>
          <p>{bug.user?.name || 'Unknown User'}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Created On</h3>
          <p>{new Date(bug.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/bugs">
          <Button variant="secondary">Back to Bug List</Button>
        </Link>
      </div>
    </div>
  );
}

export default BugDetail;