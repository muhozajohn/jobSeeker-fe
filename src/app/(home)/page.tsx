export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to JobConnect</h1>
      <p className="text-lg mb-4">
        Find your dream job or the perfect candidate with our platform.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">For Job Seekers</h2>
          <p>Browse thousands of job listings across various categories.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">For Employers</h2>
          <p>Post jobs and find qualified candidates quickly.</p>
        </div>
      </div>
    </div>
  );
}