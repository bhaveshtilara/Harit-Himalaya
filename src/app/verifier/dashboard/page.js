"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export default function VerifierDashboard() {
  const router = useRouter();
  const [verifier, setVerifier] = useState(null);
  const [activeJourneys, setActiveJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [trekkerEmail, setTrekkerEmail] = useState('');
  const [wasteAmount, setWasteAmount] = useState('');
  const [completingJourneyId, setCompletingJourneyId] = useState(null);

  const fetchData = async () => {
    try {
      const meResponse = await axios.get('/api/users/me');
      if (meResponse.data.data.role !== 'VERIFIER') {
        toast.error('Access Denied.');
        router.push('/dashboard');
        return;
      }
      setVerifier(meResponse.data.data);

      const journeysResponse = await axios.get('/api/verifier/journeys');
      setActiveJourneys(journeysResponse.data.data);
    } catch (err) {
      toast.error('Session expired. Please log in again.');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleStartJourney = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Starting journey...');
    try {
      await axios.post('/api/journey/start', { trekkerEmail });
      setTrekkerEmail('');
      toast.success('Journey started successfully!', { id: toastId });
      fetchData(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start journey.', { id: toastId });
    }
  };
  const handleCompleteJourney = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Completing journey...');
    try {
      await axios.post('/api/journey/complete', {
        journeyId: completingJourneyId,
        wasteCollectedKg: parseFloat(wasteAmount),
      });
      toast.success('Journey completed successfully!', { id: toastId });
      setActiveJourneys(prevJourneys =>
        prevJourneys.filter(journey => journey._id !== completingJourneyId)
      );
      setWasteAmount('');
      setCompletingJourneyId(null);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete journey.', { id: toastId });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Verifier Panel...</div>;
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Verifier Control Panel</h1>
            <p className="text-gray-600">Managing journeys for: <span className="font-semibold text-green-600">{verifier?.assignedLocation?.name || 'your assigned location'}</span></p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-lg font-semibold text-gray-500 uppercase">Active Journeys</h2>
                    <p className="text-6xl font-extrabold text-blue-600">{activeJourneys.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Start New Journey</h2>
                    <form onSubmit={handleStartJourney} className="space-y-4">
                        <div>
                            <label htmlFor="trekkerEmail" className="block text-sm font-medium text-gray-700">Trekker's Email</label>
                            <input id="trekkerEmail" type="email" value={trekkerEmail} onChange={(e) => setTrekkerEmail(e.target.value)} placeholder="trekker@example.com" required className="mt-1 block w-full px-3 py-2 border rounded-md text-black"/>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Start</button>
                    </form>
                </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Current Active Journeys</h2>
                <div className="space-y-4">
                    {activeJourneys.length > 0 ? (
                        activeJourneys.map((journey) => (
                        <div key={journey._id} className="p-4 border rounded-md bg-gray-50">
                            <p className="font-semibold">{journey.trekker.name} <span className="text-sm text-gray-500">({journey.trekker.email})</span></p>
                            <p className="text-sm text-gray-500">Started: {new Date(journey.startTime).toLocaleTimeString()}</p>
                            {completingJourneyId === journey._id ? (
                               <form onSubmit={handleCompleteJourney} className="mt-4 flex gap-2 items-center">
                                 <input type="number" step="0.1" value={wasteAmount} onChange={(e) => setWasteAmount(e.target.value)} placeholder="Waste (kg)" required className="block w-full px-3 py-2 border rounded-md text-black"/>
                                 <button type="submit" className="bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600">✓</button>
                                 <button type="button" onClick={() => setCompletingJourneyId(null)} className="bg-gray-500 text-white py-2 px-3 rounded-lg hover:bg-gray-600">X</button>
                               </form>
                            ) : (
                              <button onClick={() => setCompletingJourneyId(journey._id)} className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg">
                                Complete Journey
                              </button>
                            )}
                        </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">No active journeys right now.</p>
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}