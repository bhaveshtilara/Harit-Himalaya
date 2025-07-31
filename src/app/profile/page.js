"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

// Simple SVG Icons for profile details
const RoleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const DateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const StatusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>;


export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [journeys, setJourneys] = useState([]); // State to hold journey data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user profile and their journeys in parallel
        const [userResponse, journeysResponse] = await Promise.all([
            axios.get('/api/users/me'),
            axios.get('/api/journey/user')
        ]);
        setUser(userResponse.data.data);
        setJourneys(journeysResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Could not load profile. Please log in again.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [router]);

  if (loading) {
    return (
        <div>
            <Navbar/>
            <p className="text-center p-10 min-h-screen">Loading Profile...</p>
        </div>
    );
  }

  if (!user) {
    return (
        <div>
            <Navbar/>
            <p className="text-center p-10 min-h-screen">Could not load profile.</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4 md:p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">My Profile</h1>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-200">
            <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-5xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="bg-emerald-50 p-6 rounded-lg text-center">
              <p className="text-sm font-semibold text-emerald-700 uppercase">Total Points</p>
              <p className="text-4xl font-extrabold text-emerald-600 mt-2">{user.points}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-sm font-semibold text-blue-700 uppercase">Journeys Completed</p>
              <p className="text-4xl font-extrabold text-blue-600 mt-2">{journeys.length}</p>
            </div>
          </div>
          
          {/* Details Section */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-500"><RoleIcon/></div>
                <div className="ml-4">
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-md font-semibold capitalize">{user.role.toLowerCase()}</p>
                </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-500"><StatusIcon/></div>
                <div className="ml-4">
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className={`text-md font-semibold capitalize ${user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>{user.status.toLowerCase()}</p>
                </div>
            </div>
             <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-500"><DateIcon/></div>
                <div className="ml-4">
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-md font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}