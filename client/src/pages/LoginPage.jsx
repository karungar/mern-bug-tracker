import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="mt-2 text-gray-600">
            Log in to your account to track and manage bugs
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;