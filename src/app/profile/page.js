"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    return <p className="text-center p-10">Loading Profile...</p>;
  }

  if (!user) {
    return <p className="text-center p-10">Could not load profile.</p>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Link href="/dashboard">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
            &larr; Back to Dashboard
          </button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="text-lg font-semibold">{user.name}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Email Address</p>
          <p className="text-lg font-semibold">{user.email}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Role</p>
          <p className="text-lg font-semibold capitalize">{user.role.toLowerCase()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Points</p>
          <p className="text-lg font-semibold text-green-600">{user.points}</p>
        </div>
      </div>
    </div>
  );
}