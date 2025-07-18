import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBugs } from '../../services/bugService';
import Button from '../Button';

function BugList() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const data = await getBugs();
        setBugs(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bugs');
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();
  }, []);

  const filteredBugs = bugs.filter(bug => {
    if (filter === 'all') return true;
    return bug.status === filter;
  });

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
    return <div className="text-center py-10">Loading bugs...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Bug List</h2>
        <Link to="/bugs/new">
          <Button>
            <i className="fas fa-plus mr-2"></i> New Bug
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded ${filter === 'open' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Open
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded ${filter === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded ${filter === 'resolved' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Resolved
          </button>
        </div>
      </div>

      {filteredBugs.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <i className="fas fa-bug text-4xl mb-3"></i>
          <p>No bugs found. Create a new bug to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-center">Priority</th>
                <th className="py-3 px-6 text-center">Created Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {filteredBugs.map((bug) => (
                <tr key={bug._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">
                    <Link to={`/bugs/${bug._id}`} className="font-medium text-blue-600 hover:text-blue-800">
                      {bug.title}
                    </Link>
                  </td>
                  <td className="py-3 px-6">
                    <span className={`${statusColors[bug.status]} py-1 px-3 rounded-full text-xs`}>
                      {bug.status.charAt(0).toUpperCase() + bug.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className={`${priorityColors[bug.priority]} py-1 px-3 rounded-full text-xs`}>
                      {bug.priority.charAt(0).toUpperCase() + bug.priority.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    {new Date(bug.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <Link to={`/bugs/${bug._id}`} className="w-4 mr-4 transform hover:text-blue-500 hover:scale-110">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/bugs/${bug._id}/edit`} className="w-4 mr-4 transform hover:text-yellow-500 hover:scale-110">
                        <i className="fas fa-edit"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BugList;