"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const [points, setPoints] = useState(() => {
    return typeof window !== "undefined" ? parseInt(localStorage.getItem("points") || "15") : 15;
  });
  const [cleanups, setCleanups] = useState(() => {
    return typeof window !== "undefined" ? parseInt(localStorage.getItem("cleanups") || "2") : 2;
  });

  // Sync local storage changes (e.g., from homepage)
  useEffect(() => {
    const handleStorageChange = () => {
      setPoints(parseInt(localStorage.getItem("points") || "15"));
      setCleanups(parseInt(localStorage.getItem("cleanups") || "2"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogWaste = () => {
    setPoints(points + 5);
    alert("Waste logged! +5 points earned!");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-[#1A3C34] text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/favicon.ico" alt="HaritHimalaya Logo" width={40} height={40} className="rounded-full" />
            <span className="text-2xl font-bold">HaritHimalaya</span>
          </div>
          <div className="flex space-x-6 items-center">
            <Link href="/" className="hover:text-[#A3BFFA] transition duration-300">Home</Link>
            <Link href="/leaderboard" className="hover:text-[#A3BFFA] transition duration-300">Leaderboard</Link>
            <Link href="/dashboard" className="hover:text-[#A3BFFA] transition duration-300">Dashboard</Link>
            <Link href="/about" className="hover:text-[#A3BFFA] transition duration-300">About</Link>
            <button
              onClick={handleLogWaste}
              className="bg-[#2F855A] px-4 py-2 rounded-md hover:bg-[#276749] transition duration-300 transform hover:scale-105"
            >
              Log Waste
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-[#1A3C34] mb-8 text-center">Your HaritHimalaya Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          <div className="flex items-center space-x-4">
            <Image src="/favicon.ico" alt="Profile" width={60} height={60} className="rounded-full" />
            <div>
              <h2 className="text-xl font-semibold text-[#2F855A]">Priya</h2>
              <p className="text-gray-600">Eco-Warrior | Valley of Flowers Trekker</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#E6F0EA] rounded-md">
              <p className="text-lg text-gray-700">Points</p>
              <p className="text-2xl font-bold text-[#2F855A]">{points}</p>
            </div>
            <div className="text-center p-4 bg-[#E6F0EA] rounded-md">
              <p className="text-lg text-gray-700">Cleanups</p>
              <p className="text-2xl font-bold text-[#2F855A]">{cleanups}</p>
            </div>
            <div className="text-center p-4 bg-[#E6F0EA] rounded-md">
              <p className="text-lg text-gray-700">Rank</p>
              <p className="text-2xl font-bold text-[#2F855A]">#1</p>
            </div>
          </div>
          <button
            onClick={handleLogWaste}
            className="w-full bg-[#2F855A] text-white py-3 rounded-md hover:bg-[#276749] transition duration-300"
          >
            Log More Waste (+5)
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A3C34] text-white py-6 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Image src="/favicon.ico" alt="HaritHimalaya Logo" width={30} height={30} className="rounded-full" />
            <span className="text-lg font-bold">HaritHimalaya</span>
          </div>
          <p className="text-gray-200">Built with ❤️ for Uttarakhand’s mountains by Team Hackathon</p>
          <p className="text-sm mt-2">© 2025 HaritHimalaya</p>
        </div>
      </footer>
    </div>
  );
}