"use client";

import Link from "next/link";
import Image from "next/image";

export default function Leaderboard() {
  // Dummy leaderboard data
  const leaders = [
    { rank: 1, name: "Priya Sharma", points: 150, cleanups: 12 },
    { rank: 2, name: "Aman Rawat", points: 120, cleanups: 10 },
    { rank: 3, name: "Riya Bisht", points: 95, cleanups: 8 },
    { rank: 4, name: "Vikram Singh", points: 80, cleanups: 6 },
    { rank: 5, name: "Sneha Negi", points: 65, cleanups: 5 },
  ];

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

      {/* Leaderboard Hero */}
      <section className="bg-[#2F855A] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            HaritHimalaya Leaderboard
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Meet the top trailblazers keeping Uttarakhand green!
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#2F855A]/50 to-[#1A3C34]/50 animate-pulse opacity-30"></div>
      </section>

      {/* Leaderboard Table */}
      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#1A3C34] mb-6 text-center">Top Cleaners</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#E6F0EA] text-[#1A3C34]">
                  <th className="p-4 font-semibold">Rank</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Points</th>
                  <th className="p-4 font-semibold">Cleanups</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((leader) => (
                  <tr
                    key={leader.rank}
                    className="border-b hover:bg-[#E6F0EA] transition duration-300"
                  >
                    <td className="p-4 text-[#2F855A] font-bold">
                      {leader.rank === 1 ? "🥇" : leader.rank === 2 ? "🥈" : leader.rank === 3 ? "🥉" : leader.rank}
                    </td>
                    <td className="p-4 text-gray-700">{leader.name}</td>
                    <td className="p-4 text-gray-700">{leader.points}</td>
                    <td className="p-4 text-gray-700">{leader.cleanups}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Call to Action */}
      <section className="bg-[#1A3C34] text-white py-12 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Climb the Ranks!</h2>
        <p className="text-lg text-gray-200 mb-6">
          Log waste, clean trails, and join the top cleaners on HaritHimalaya!
        </p>
        <Link
          href="/dashboard"
          className="bg-[#2F855A] px-6 py-3 rounded-lg hover:bg-[#276749] transition duration-300 inline-block"
        >
          Start Cleaning
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