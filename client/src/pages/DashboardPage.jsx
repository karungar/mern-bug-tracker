import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getBugs } from '../services/bugService';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';

function DashboardPage() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

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

  // Calculate statistics
  const totalBugs = bugs.length;
  const openBugs = bugs.filter(bug => bug.status === 'open').length;
  const inProgressBugs = bugs.filter(bug => bug.status === 'in-progress').length;
  const resolvedBugs = bugs.filter(bug => bug.status === 'resolved').length;
  
  const highPriorityBugs = bugs.filter(bug => bug.priority === 'high').length;
  const userBugs = bugs.filter(bug => bug.user?._id === user?._id).length;

  // Get recent bugs (last 5)
  const recentBugs = [...bugs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  const statusColors = {
    'open': 'bg-red-100 text-red-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'resolved': 'bg-green-100 text-green-800'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name || 'User'}! Here's an overview of your bug tracking statistics.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Bugs</p>
              <h3 className="text-3xl font-bold text-gray-800">{totalBugs}</h3>
            </div>
            <div className="text-blue-500 bg-blue-100 p-3 rounded-full">
              <i className="fas fa-bug text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Open Bugs</p>
              <h3 className="text-3xl font-bold text-red-600">{openBugs}</h3>
            </div>
            <div className="text-red-500 bg-red-100 p-3 rounded-full">
              <i className="fas fa-exclamation-circle text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">In Progress</p>
              <h3 className="text-3xl font-bold text-yellow-600">{inProgressBugs}</h3>
            </div>
            <div className="text-yellow-500 bg-yellow-100 p-3 rounded-full">
              <i className="fas fa-spinner text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Resolved</p>
              <h3 className="text-3xl font-bold text-green-600">{resolvedBugs}</h3>
            </div>
            <div className="text-green-500 bg-green-100 p-3 rounded-full">
              <i className="fas fa-check-circle text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Bug Status Distribution</h2>
          <div className="flex items-center mb-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              {totalBugs > 0 && (
                <>
                  <div 
                    className="bg-red-500 h-4 rounded-l-full" 
                    style={{ width: `${(openBugs / totalBugs) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-yellow-500 h-4" 
                    style={{ width: `${(inProgressBugs / totalBugs) * 100}%`, marginLeft: `-2px` }}
                  ></div>
                  <div 
                    className="bg-green-500 h-4 rounded-r-full" 
                    style={{ width: `${(resolvedBugs / totalBugs) * 100}%`, marginLeft: `-2px` }}
                  ></div>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Open</span>
              </div>
              <p className="font-bold">{Math.round((openBugs / totalBugs) * 100) || 0}%</p>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="text-sm text-gray-600">In Progress</span>
              </div>
              <p className="font-bold">{Math.round((inProgressBugs / totalBugs) * 100) || 0}%</p>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Resolved</span>
              </div>
              <p className="font-bold">{Math.round((resolvedBugs / totalBugs) * 100) || 0}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Your Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Your reported bugs:</span>
              <span className="font-bold">{userBugs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">High priority bugs:</span>
              <span className="font-bold text-red-600">{highPriorityBugs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Resolution rate:</span>
              <span className="font-bold text-green-600">
                {Math.round((resolvedBugs / totalBugs) * 100) || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Bugs */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Bugs</h2>
          <Link to="/bugs">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        {recentBugs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No bugs reported yet. Create your first bug report!</p>
            <div className="mt-4">
              <Link to="/bugs/new">
                <Button>Report Bug</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-4 text-left text-gray-600 font-medium">Title</th>
                  <th className="py-2 px-4 text-left text-gray-600 font-medium">Status</th>
                  <th className="py-2 px-4 text-left text-gray-600 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBugs.map(bug => (
                  <tr key={bug._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link 
                        to={`/bugs/${bug._id}`} 
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {bug.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`${statusColors[bug.status]} py-1 px-2 rounded-full text-xs`}>
                        {bug.status.charAt(0).toUpperCase() + bug.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(bug.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/bugs/new">
            <Button>
              <i className="fas fa-plus mr-2"></i> Report New Bug
            </Button>
          </Link>
          <Link to="/bugs">
            <Button variant="secondary">
              <i className="fas fa-list mr-2"></i> View All Bugs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;