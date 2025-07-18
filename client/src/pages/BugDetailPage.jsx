import BugDetail from '../components/bugs/BugDetail';

function BugDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bug Details</h1>
      <BugDetail />
    </div>
  );
}

export default BugDetailPage;