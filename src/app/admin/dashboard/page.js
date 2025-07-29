"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

// A simple stat card component
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center">
      <div className="p-3 bg-green-100 rounded-full text-2xl">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, locations: 0, completedJourneys: 0 });
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newLocation, setNewLocation] = useState({ name: '', trailName: '' });
  const [editingUser, setEditingUser] = useState(null);

  // Fetches all data needed for the admin panel
  const fetchData = async () => {
    try {
      const [statsRes, usersRes, locationsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/locations'),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setLocations(locationsRes.data.data);
    } catch (error) {
      toast.error('Access Denied or failed to fetch data.');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);
  
  // Handler for creating a new location
  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Creating location...');
    try {
      await axios.post('/api/locations', newLocation);
      toast.success('Location created successfully!', { id: toastId });
      setNewLocation({ name: '', trailName: '' });
      fetchData(); // Refresh all data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create location.', { id: toastId });
    }
  };

  // Handler for updating a user
  const handleUserUpdate = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Updating user...');
    try {
      await axios.put(`/api/admin/users/${editingUser._id}`, {
        role: editingUser.role,
        assignedLocation: editingUser.assignedLocation || null,
        status: editingUser.status, // Send the status
      });
      toast.success('User updated successfully!', { id: toastId });
      setEditingUser(null);
      fetchData(); // Refresh all data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user.', { id: toastId });
    }
  };

  if (loading) return (
    <div>
        <Navbar/>
        <div className="min-h-screen flex items-center justify-center">Loading Admin Panel...</div>
    </div>
  );

  return (
    <div>
        <Navbar />
        <main className="container mx-auto p-4 md:p-6 bg-gray-50">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Admin Overview</h1>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Users" value={stats.users} icon={'👥'}/>
                <StatCard title="Total Locations" value={stats.locations} icon={'📍'}/>
                <StatCard title="Journeys Completed" value={stats.completedJourneys} icon={'✅'}/>
            </div>

            {/* Management Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">User Management</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100"><tr><th className="py-2 px-4 text-left">Name</th><th className="py-2 px-4 text-left">Role</th><th className="py-2 px-4 text-left">Status</th><th className="py-2 px-4 text-left">Actions</th></tr></thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">
                                <div>{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                            </td>
                            <td className="py-2 px-4">{user.role}</td>
                            <td className="py-2 px-4">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-2 px-4">
                              <button onClick={() => setEditingUser(user)} className="text-blue-500 hover:underline">Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Add New Location</h2>
                  <form onSubmit={handleLocationSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Location Name (e.g., Gaurikund Gate)</label>
                      <input type="text" value={newLocation.name} onChange={(e) => setNewLocation({...newLocation, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md text-black" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Trail Name (e.g., Kedarnath Trek)</label>
                      <input type="text" value={newLocation.trailName} onChange={(e) => setNewLocation({...newLocation, trailName: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md text-black" required />
                    </div>
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Create Location</button>
                  </form>
                </div>
            </div>
            {editingUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                  <h2 className="text-2xl font-bold mb-4">Edit User: {editingUser.name}</h2>
                  <form onSubmit={handleUserUpdate}>
                    <div className="mb-4">
                      <label className="text-sm font-medium">Role</label>
                      <select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})} className="mt-1 block w-full p-2 border rounded-md text-black">
                        <option value="TREKKER">Trekker</option>
                        <option value="VERIFIER">Verifier</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm font-medium">Status</label>
                      <select value={editingUser.status} onChange={(e) => setEditingUser({...editingUser, status: e.target.value})} className="mt-1 block w-full p-2 border rounded-md text-black">
                        <option value="ACTIVE">Active</option>
                        <option value="BLOCKED">Blocked</option>
                      </select>
                    </div>
                    <div className="mb-6">
                      <label className="text-sm font-medium">Assign Location (for Verifiers)</label>
                      <select value={editingUser.assignedLocation || ''} onChange={(e) => setEditingUser({...editingUser, assignedLocation: e.target.value})} className="mt-1 block w-full p-2 border rounded-md text-black">
                        <option value="">None</option>
                        {locations.map(loc => <option key={loc._id} value={loc._id}>{loc.name}</option>)}
                      </select>
                    </div>
                    <div className="flex justify-end gap-4">
                      <button type="button" onClick={() => setEditingUser(null)} className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
                      <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
        </main>
    </div>
  );
}