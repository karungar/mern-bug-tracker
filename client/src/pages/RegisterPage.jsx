import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
          <p className="mt-2 text-gray-600">
            Sign up to start tracking bugs in your projects
          </p>
        </div>
        
        <RegisterForm />
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;