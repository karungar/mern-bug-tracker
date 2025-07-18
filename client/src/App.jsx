import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BugsPage from './pages/BugsPage';
import BugDetailPage from './pages/BugDetailPage';
import BugFormPage from './pages/BugFormPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bugs" 
                element={
                  <ProtectedRoute>
                    <BugsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bugs/:id" 
                element={
                  <ProtectedRoute>
                    <BugDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bugs/new" 
                element={
                  <ProtectedRoute>
                    <BugFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bugs/edit/:id" 
                element={
                  <ProtectedRoute>
                    <BugFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <footer className="bg-white shadow-inner py-4">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>&copy; {new Date().getFullYear()} Bug Tracker. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;