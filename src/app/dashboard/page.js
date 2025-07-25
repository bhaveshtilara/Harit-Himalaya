"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 

export default function DashboardPage() {
  const router = useRouter(); 
  const [user, setUser] = useState(null);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const onLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      alert('Logout successful');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
      alert('Logout failed. Please try again.');
    }
  };

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
        router.push('/login'); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]); 

  if (loading) {
    return <div className="text-center p-10">Loading Dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome, {user?.name}!</h1>
        <div className="flex gap-4">
          <Link href="/leaderboard">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
              Leaderboard 🏆
            </button>
          </Link>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
        <strong className="font-bold">Total Points: </strong>
        <span className="block sm:inline ml-2 text-lg">{user?.points}</span>
      </div>
      <h2 className="text-2xl font-semibold mb-3">Your Cleanup Journeys</h2>
      <div className="space-y-4">
        {journeys.length > 0 ? (
          journeys.map((journey) => (
            <div key={journey._id} className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-bold">{journey.location.trailName}</h3>
              <p className="text-gray-600">Date: {new Date(journey.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600">Waste Collected: {journey.wasteCollectedKg} kg</p>
              <p>
                Status:{" "}
                <span
                  className={`font-semibold ${
                    journey.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  {journey.status}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p>You haven not started any journeys yet.</p>
        )}
      </div>
    </div>
  );
}