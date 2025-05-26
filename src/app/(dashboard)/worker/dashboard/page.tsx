export default function WorkerDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Worker Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Applications</h2>
          <p className="text-gray-600">5 active applications</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Messages</h2>
          <p className="text-gray-600">3 unread messages</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Profile Completeness</h2>
          <p className="text-gray-600">80% complete</p>
        </div>
      </div>
    </div>
  );
}