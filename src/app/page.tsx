"use client";
import Link from 'next/link';

// Simple SVG icons for the "How it Works" section
const TrekIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-4-4-6 6"/><path d="m18 12-6-6"/></svg>;
const VerifyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const ImpactIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8a2.3 2.3 0 0 0-3.2 0l-4.3 4.3a2.3 2.3 0 0 0 0 3.2l4.3 4.3a2.3 2.3 0 0 0 3.2-3.2Z"/></svg>;


export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* --- Hero Section --- */}
      <section
        className="relative flex items-center justify-center min-h-screen text-white text-center px-4"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Our Mountains are Calling for Help.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
            Join a community of trekkers dedicated to preserving the pristine beauty of the Himalayas, one step at a time.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/register">
              <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-transform duration-300">
                Join the Mission
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300">
                Member Login
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- Problem Section --- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">A Paradise in Peril</h2>
          <p className="max-w-3xl mx-auto text-gray-600 mb-12">
            The trails we love are facing a growing crisis from tourist-generated waste. The impact is real, but together, our small actions can lead to a massive change.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-blue-600">Millions of Visitors</h3>
              <p className="mt-2 text-gray-600">Annually, creating a huge environmental footprint.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-red-600">5,000+ KG of Plastic</h3>
              <p className="mt-2 text-gray-600">Often collected from a single trail in one season alone.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-yellow-600">An Uncoordinated Effort</h3>
              <p className="mt-2 text-gray-600">Leaving volunteers feeling burnt out and helpless.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Be the Solution. It's Simple.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full text-green-600"><TrekIcon /></div>
              <h3 className="mt-4 text-2xl font-semibold">1. Trek & Collect</h3>
              <p className="mt-2 text-gray-600">Enjoy your trek as you normally would. Simply collect any plastic waste you find along the way.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full text-green-600"><VerifyIcon /></div>
              <h3 className="mt-4 text-2xl font-semibold">2. Verify & Log</h3>
              <p className="mt-2 text-gray-600">At the end of your trail, get your collected waste officially weighed and logged by a verified partner at the gate.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full text-green-600"><ImpactIcon /></div>
              <h3 className="mt-4 text-2xl font-semibold">3. Track Your Impact</h3>
              <p className="mt-2 text-gray-600">Earn points, climb the community leaderboard, and see the collective difference our actions are making.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section className="bg-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Make a Difference?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-300">
            Your next journey can be more than just a trek. It can be a mission to protect the places we love.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <button className="px-10 py-4 bg-green-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-transform duration-300">
                Create Your Account Today
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-gray-400 py-6">
          <div className="container mx-auto px-4 text-center">
              <p>&copy; 2025 Harit Himalaya. Built for a cleaner tomorrow.</p>
          </div>
      </footer>
    </div>
  );
}