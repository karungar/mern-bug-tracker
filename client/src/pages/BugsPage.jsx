import BugList from '../components/bugs/BugList';

function BugsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bug Tracker</h1>
      <BugList />
    </div>
  );
}

export default BugsPage;