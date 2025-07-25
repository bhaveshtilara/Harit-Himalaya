"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 

export default function VerifierDashboard() {
  const router = useRouter(); 
  const [activeJourneys, setActiveJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trekkerEmail, setTrekkerEmail] = useState('');
  const [wasteAmount, setWasteAmount] = useState('');
  const [completingJourneyId, setCompletingJourneyId] = useState(null);
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
  const fetchActiveJourneys = async () => {
    try {
      const response = await axios.get('/api/verifier/journeys');
      setActiveJourneys(response.data.data);
    } catch (err) {
      setError('Failed to fetch journeys. You might not be an authorized verifier.');
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
          router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveJourneys();
  }, [router]); 

  const handleStartJourney = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/journey/start', { trekkerEmail });
      setTrekkerEmail('');
      alert('Journey started successfully!');
      fetchActiveJourneys();
    } catch (err) {
      alert(`Failed to start journey: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCompleteJourney = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/journey/complete', {
        journeyId: completingJourneyId,
        wasteCollectedKg: parseFloat(wasteAmount),
      });
      setWasteAmount('');
      setCompletingJourneyId(null);
      alert('Journey completed successfully!');
      fetchActiveJourneys(); 
    } catch (err) {
      alert(`Failed to complete journey: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <p className="p-4 text-center">Loading Verifier Dashboard...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Verifier Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Logout
        </button>
      </div>
      <div className="mb-8 p-4 border rounded-lg shadow bg-white">
        <h2 className="text-2xl font-semibold mb-3">Start New Journey</h2>
        <form onSubmit={handleStartJourney} className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-grow">
            <label htmlFor="trekkerEmail" className="block text-sm font-medium text-gray-700">Trekker Email</label>
            <input
              id="trekkerEmail"
              type="email"
              value={trekkerEmail}
              onChange={(e) => setTrekkerEmail(e.target.value)}
              placeholder="e.g., anil@example.com"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto">Start Journey</button>
        </form>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-3">Active Journeys</h2>
        <div className="space-y-4">
          {activeJourneys.length > 0 ? (
            activeJourneys.map((journey) => (
              <div key={journey._id} className="p-4 border rounded-lg shadow-sm bg-white">
                <p><strong>Trekker:</strong> {journey.trekker.name} ({journey.trekker.email})</p>
                <p><strong>Start Time:</strong> {new Date(journey.startTime).toLocaleString()}</p>
                
                {completingJourneyId === journey._id ? (
                   <form onSubmit={handleCompleteJourney} className="mt-4 flex flex-col md:flex-row gap-4 md:items-end">
                     <div className="flex-grow">
                       <label htmlFor={`waste-${journey._id}`} className="block text-sm font-medium text-gray-700">Waste Collected (kg)</label>
                        <input
                          id={`waste-${journey._id}`}
                          type="number"
                          step="0.1"
                          value={wasteAmount}
                          onChange={(e) => setWasteAmount(e.target.value)}
                          placeholder="e.g., 2.5"
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        />
                     </div>
                     <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Confirm</button>
                     <button type="button" onClick={() => setCompletingJourneyId(null)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                   </form>
                ) : (
                  <button onClick={() => setCompletingJourneyId(journey._id)} className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                    Complete Journey
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No active journeys at your location.</p>
          )}
        </div>
      </div>
    </div>
  );
}