"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/leaderboard');
        setLeaderboardData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <p className="text-center p-10">Loading Leaderboard...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard 🏆</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Rank</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Points</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {leaderboardData.map((user, index) => (
              <tr key={user._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6 font-bold text-lg">{index + 1}</td>
                <td className="py-3 px-6">{user.name}</td>
                <td className="py-3 px-6 text-green-600 font-semibold">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}