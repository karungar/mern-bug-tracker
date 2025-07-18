import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateProfile, getProfile } from '../services/authService';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

function ProfilePage() {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setFormData(prevData => ({
          ...prevData,
          name: profileData.name,
          email: profileData.email
        }));
      } catch (err) {
        setError('Failed to load profile. Please refresh the page.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      
      // Only include password fields if currentPassword is provided
      const updateData = {
        name: formData.name,
        email: formData.email
      };
      
      if (formData.currentPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      const updatedUser = await updateProfile(updateData);
      
      updateUser(updatedUser);
      
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <p>{message}</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <FormInput
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
          />
          
          <div className="mt-8 mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Change Password</h3>
            <p className="text-sm text-gray-500 mb-4">
              Leave these fields empty if you don't want to change your password.
            </p>
          </div>
          
          <FormInput
            label="Current Password"
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
          
          <FormInput
            label="New Password"
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          
          <FormInput
            label="Confirm New Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          
          <div className="mt-8">
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;