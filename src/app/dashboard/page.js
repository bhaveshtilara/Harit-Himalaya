"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast'; 

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userResponse, journeysResponse] = await Promise.all([
          axios.get('/api/users/me'),
          axios.get('/api/journey/user'),
        ]);
        setUser(userResponse.data.data);
        setJourneys(journeysResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Session expired. Please log in.');
        router.push('/login'); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) {
    return (
        <div>
            <Navbar/>
            <div className="text-center p-10 min-h-screen">Loading Dashboard...</div>
        </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
            <p className="text-gray-600 mt-1">Here's a summary of your impact. Thank you for your contribution!</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-lg font-semibold uppercase tracking-wider mb-2">Total Points</h2>
          <p className="text-5xl font-extrabold">{user?.points}</p>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Cleanup Journeys</h2>
        <div className="space-y-4">
          {journeys.length > 0 ? (
            journeys.map((journey) => (
              <div key={journey._id} className="p-5 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{journey.location.trailName}</h3>
                    <p className="text-sm text-gray-500">Date: {new Date(journey.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      journey.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {journey.status}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700">Waste Collected: <span className="font-bold">{journey.wasteCollectedKg} kg</span></p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-10 border-2 border-dashed rounded-lg text-gray-500">
              <p>You haven't started any journeys yet.</p>
              <p className="mt-2 text-sm">Let's change that on your next trek!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}