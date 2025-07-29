"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Navbar() {
  const router = useRouter();

  const onLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      toast.success('Logout successful');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center py-4">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-green-600">Harit Himalaya</h1>
          </Link>
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-green-600 transition-colors">Dashboard</Link>
            <Link href="/profile" className="text-gray-600 hover:text-green-600 transition-colors">Profile</Link>
            <Link href="/leaderboard" className="text-gray-600 hover:text-green-600 transition-colors">Leaderboard</Link>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}