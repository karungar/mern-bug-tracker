import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { register } from '../../services/authService';
import FormInput from '../FormInput';
import Button from '../Button';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { name, email, password, confirmPassword } = formData;
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      const userData = await register({ name, email, password });
      login(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Name"
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
        
        <FormInput
          label="Email"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        
        <FormInput
          label="Password"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
        
        <FormInput
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />
        
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;