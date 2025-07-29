"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar'; 

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/users/me');
        setUser(response.data.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [router]);

  if (loading) {
    return <div className="text-center p-10 min-h-screen">Loading Profile...</div>;
  }

  if (!user) {
    return <div className="text-center p-10 min-h-screen">Could not load profile.</div>;
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4 md:p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">My Profile</h1>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <div className="flex items-center space-x-6 mb-8">
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl text-gray-500">{user.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-lg font-semibold capitalize">{user.role.toLowerCase()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Points</p>
              <p className="text-lg font-semibold text-green-600">{user.points}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="text-lg font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}