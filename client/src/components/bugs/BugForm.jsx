import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBugById, createBug, updateBug } from '../../services/bugService';
import FormInput from '../FormInput';
import Button from '../Button';

function BugForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { title, description, status, priority } = formData;
  
  useEffect(() => {
    const fetchBug = async () => {
      if (isEditMode) {
        try {
          const bug = await getBugById(id);
          setFormData({
            title: bug.title,
            description: bug.description,
            status: bug.status,
            priority: bug.priority
          });
        } catch (err) {
          setError('Failed to load bug details. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchBug();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title || !description) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateBug(id, formData);
        navigate(`/bugs/${id}`);
      } else {
        const newBug = await createBug(formData);
        navigate(`/bugs/${newBug._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bug. Please try again.');
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Bug' : 'Report New Bug'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Title"
          id="title"
          name="title"
          value={title}
          onChange={handleChange}
          placeholder="Enter a brief, descriptive title"
          required
        />
        
        <div className="mb-4">
          <label 
            htmlFor="description" 
            className="block text-gray-700 font-medium mb-1"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            rows="6"
            placeholder="Describe the bug in detail. Include steps to reproduce, expected behavior, and actual behavior."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label 
              htmlFor="status" 
              className="block text-gray-700 font-medium mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div>
            <label 
              htmlFor="priority" 
              className="block text-gray-700 font-medium mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (isEditMode ? 'Update Bug' : 'Create Bug')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(isEditMode ? `/bugs/${id}` : '/bugs')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default BugForm;