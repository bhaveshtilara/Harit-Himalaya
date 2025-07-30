"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [dashboardUrl, setDashboardUrl] = useState('/dashboard');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/users/me');
        const role = response.data.data.role;
        setUserRole(role);
        if (role === 'ADMIN') {
          setDashboardUrl('/admin/dashboard');
        } else if (role === 'VERIFIER') {
          setDashboardUrl('/verifier/dashboard');
        } else {
          setDashboardUrl('/dashboard');
        }

      } catch (error) {
        console.error("Failed to fetch user role for navbar", error);
      }
    };
    fetchUserData();
  }, []);

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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center py-4">
          <Link href={dashboardUrl} onClick={() => setIsMenuOpen(false)}>
            <h1 className="text-2xl font-bold text-green-600">Harit Himalaya</h1>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href={dashboardUrl} className="text-gray-600 hover:text-green-600 transition-colors">Dashboard</Link>
            <Link href="/profile" className="text-gray-600 hover:text-green-600 transition-colors">Profile</Link>
            
            {(userRole === 'TREKKER' || userRole === 'ADMIN') && (
              <Link href="/leaderboard" className="text-gray-600 hover:text-green-600 transition-colors">Leaderboard</Link>
            )}

            <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
              Logout
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <Link href={dashboardUrl} onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-3 py-2 rounded-md text-gray-700">Dashboard</Link>
            <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-3 py-2 rounded-md text-gray-700">Profile</Link>
            
            {(userRole === 'TREKKER' || userRole === 'ADMIN') && (
              <Link href="/leaderboard" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-3 py-2 rounded-md text-gray-700">Leaderboard</Link>
            )}

            <button onClick={onLogout} className="mt-2 w-11/12 bg-red-500 text-white font-bold py-2 px-4 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}