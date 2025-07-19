import React from 'react';
function Page() {
  return (
    <div className="min-h-screen bg-green-50 font-sans">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 text-center">
        <h1 className="text-4xl font-bold">Harit Himalaya</h1>
        <p className="text-xl mt-2">Keep Uttarakhand’s Mountains Clean</p>
      </header>

      {/* Main Section */}
      <main className="max-w-4xl mx-auto p-6 text-center">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            Why We Need Your Help
          </h2>
          <p className="text-lg text-gray-700">
            Tourism in Uttarakhand’s mountains leaves behind trash like plastic
            bottles and wrappers. This hurts our beautiful trails, rivers, and
            wildlife, and burdens local communities. Without an organized way to
            clean up, the problem keeps growing.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            Join the Cleanup
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-green-500 text-white text-lg font-medium py-3 px-6 rounded-lg hover:bg-green-600">
              Report Trash
            </button>
            <button className="bg-green-500 text-white text-lg font-medium py-3 px-6 rounded-lg hover:bg-green-600">
              View Cleanup Data
            </button>
          </div>
          <p className="text-gray-600 mt-4">
            Help trekkers and locals make Uttarakhand cleaner!
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-600 text-white p-4 text-center">
        <p>© 2025 [Harit-Himalaya]. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Page;