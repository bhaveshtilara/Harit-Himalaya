"use client";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
      <main className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-600">
          Harit Himalaya
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600">
          A community-driven initiative to keep our sacred mountains pristine.
        </p>
        <p className="mt-6 text-md md:text-lg">
          Join us in our mission to track and clean waste from the trekking trails of the Himalayas. Every trekker can be a warrior for our environment. Log your cleanup efforts, earn points, and become a part of the solution.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login">
            <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300">
              Register
            </button>
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-4 text-gray-500 text-sm">
        <p>Built for a cleaner tomorrow.</p>
      </footer>
    </div>
  );
}