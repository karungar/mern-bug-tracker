import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <i className="fas fa-bug text-2xl"></i>
            <Link to="/" className="text-xl font-bold">Bug Tracker</Link>
          </div>
          
          <div className="flex space-x-6 items-center">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition-colors">
                  Dashboard
                </Link>
                <Link to="/bugs" className="hover:text-blue-200 transition-colors">
                  Bugs
                </Link>
                <div className="flex items-center space-x-2">
                  <span>Welcome, {user?.name || 'User'}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;