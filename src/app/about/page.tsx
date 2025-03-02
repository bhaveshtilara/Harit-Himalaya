"use client";

import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-[#1A3C34] text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/logo.jpg" alt="HaritHimalaya Logo" width={40} height={40} className="rounded-full" />
            <span className="text-2xl font-bold">HaritHimalaya</span>
          </div>
          <div className="flex space-x-6 items-center">
            <Link href="/" className="hover:text-[#A3BFFA] transition duration-300">Home</Link>
            <Link href="/leaderboard" className="hover:text-[#A3BFFA] transition duration-300">Leaderboard</Link>
            <Link href="/dashboard" className="hover:text-[#A3BFFA] transition duration-300">Dashboard</Link>
            <Link href="/about" className="hover:text-[#A3BFFA] transition duration-300">About</Link>
            <button className="bg-[#2F855A] px-4 py-2 rounded-md hover:bg-[#276749] transition duration-300 transform hover:scale-105">
              Log Waste
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#2F855A] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            About HaritHimalaya
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Saving Uttarakhand’s mountains, one cleanup at a time.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#2F855A]/50 to-[#1A3C34]/50 animate-pulse opacity-30"></div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-[#1A3C34] text-center mb-8">Our Mission</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <p className="text-gray-700 text-lg">
              HaritHimalaya was born from a trekker’s frustration—seeing pristine trails like Roopkund and Valley of Flowers choked with plastic waste. We’re here to turn that mess into a movement. Our app empowers trekkers, locals, and eco-warriors to log waste, clean it up, and recycle it into something valuable—all while gamifying the effort with “Clean Mountain” points. From Kedarnath’s trails to recycling hubs, we’re building a greener Himalaya, step by step.
            </p>
          </div>
          <div className="flex-1">
            <div className="bg-[#E6F0EA] h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Image: Trash to Treasure (Placeholder)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-[#E6F0EA] py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1A3C34] mb-8">Our Vision</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            A trash-free Uttarakhand where every trail shines, wildlife thrives, and tourism fuels sustainability—not pollution. We dream of scaling HaritHimalaya to every mountain state, turning waste into revenue, and inspiring a generation to clean as they climb.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-[#1A3C34] text-center mb-8">The Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 text-center">
            <Image src="/logo.jpg" alt="Team Member" width={80} height={80} className="rounded-full mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#2F855A]">Priya Sharma</h3>
            <p className="text-gray-600">Founder & Trekker</p>
            <p className="text-gray-700 mt-2">Loves Valley of Flowers, hates plastic wrappers.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 text-center">
            <Image src="/logo.jpg" alt="Team Member" width={80} height={80} className="rounded-full mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#2F855A]">Aman Rawat</h3>
            <p className="text-gray-600">Tech Lead</p>
            <p className="text-gray-700 mt-2">Codes MERN magic, dreams of clean trails.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 text-center">
            <Image src="/logo.jpg" alt="Team Member" width={80} height={80} className="rounded-full mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#2F855A]">Riya Bisht</h3>
            <p className="text-gray-600">Eco-Advocate</p>
            <p className="text-gray-700 mt-2">Pushes recycling, hikes Roopkund.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#1A3C34] text-white py-12 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Join the HaritHimalaya Movement</h2>
        <p className="text-lg text-gray-200 mb-6">
          Be part of the change—clean trails, earn points, and save the mountains!
        </p>
        <Link
          href="/dashboard"
          className="bg-[#2F855A] px-6 py-3 rounded-lg hover:bg-[#276749] transition duration-300 inline-block"
        >
          Start Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A3C34] text-white py-6 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Image src="/logo.jpg" alt="HaritHimalaya Logo" width={30} height={30} className="rounded-full" />
            <span className="text-lg font-bold">HaritHimalaya</span>
          </div>
          <p className="text-gray-200">Built with ❤️ for Uttarakhand’s mountains by Team Hackathon</p>
          <p className="text-sm mt-2">© 2025 HaritHimalaya</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  );
}