import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';

function HomePage() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto text-center px-6">
        <div className="flex justify-center mb-6">
          <div className="text-6xl text-blue-600">
            <i className="fas fa-bug"></i>
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Bug Tracker
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
          A simple and powerful tool to track, manage and resolve bugs in your projects. Stay organized, collaborate effectively, and deliver better software.
        </p>
        
        <div className="flex justify-center space-x-4">
          {isAuthenticated ? (
            <div className="space-x-4">
              <Link to="/dashboard">
                <Button size="lg">
                  Go to Dashboard
                </Button>
              </Link>
              
              <Link to="/bugs">
                <Button variant="secondary" size="lg">
                  View Bugs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/register">
                <Button size="lg">
                  Get Started
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl text-blue-500 mb-4">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor the status of bugs from report to resolution with our intuitive tracking system.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl text-blue-500 mb-4">
              <i className="fas fa-tasks"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Prioritize Tasks</h3>
            <p className="text-gray-600">
              Categorize bugs by priority and status to focus on what matters most for your project.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl text-blue-500 mb-4">
              <i className="fas fa-users"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">
              Work together seamlessly with your team to identify, fix, and verify bug resolutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;