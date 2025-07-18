import { Link } from 'react-router-dom';
import Button from '../components/Button';

function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <div className="mt-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button>
              <i className="fas fa-home mr-2"></i> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;