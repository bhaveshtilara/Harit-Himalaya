"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar'; 

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/leaderboard');
        setLeaderboardData(response.data.data);
      } catch (error)
      {
        console.error('Failed to fetch leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankClass = (index) => {
    switch (index) {
      case 0:
        return 'bg-amber-100 border-amber-300'; 
      case 1:
        return 'bg-slate-200 border-slate-300'; 
      case 2:
        return 'bg-orange-100 border-orange-300'; 
      default:
        return 'bg-white';
    }
  };
  
  const getRankEmoji = (index) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return index + 1;
    }
  };


  if (loading) {
    return (
        <div>
            <Navbar/>
            <p className="text-center p-10">Loading Leaderboard...</p>
        </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                Top Contributors
            </h1>
            <p className="mt-2 text-lg text-gray-600">
                Celebrating our environmental heroes leading the cleanup charge!
            </p>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                <thead className="bg-gray-800 text-white">
                    <tr>
                    <th className="py-3 px-6 text-center w-24">Rank</th>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Points</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {leaderboardData.length > 0 ? (
                        leaderboardData.map((user, index) => (
                        <tr key={user._id} className={`${getRankClass(index)} border-b border-gray-200 hover:bg-green-50 transition-colors`}>
                            <td className="py-4 px-6 text-center font-bold text-xl">{getRankEmoji(index)}</td>
                            <td className="py-4 px-6 font-medium text-lg">{user.name}</td>
                            <td className="py-4 px-6 text-green-600 font-bold text-lg">{user.points}</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center py-10 text-gray-500">
                                Be the first hero! Complete a cleanup journey to appear on the leaderboard.
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}