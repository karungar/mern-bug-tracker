import { useParams } from 'react-router-dom';
import BugForm from '../components/bugs/BugForm';

function BugFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Bug' : 'Report New Bug'}
      </h1>
      <BugForm />
    </div>
  );
}

export default BugFormPage;