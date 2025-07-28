"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', trailName: '' });
  const [editingUser, setEditingUser] = useState(null); 
  const fetchData = async () => {
    try {
      const meResponse = await axios.get('/api/users/me');
      if (meResponse.data.data.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }
      setIsAuthorized(true);
      const [usersResponse, locationsResponse] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/locations'), 
      ]);
      setUsers(usersResponse.data.data);
      setLocations(locationsResponse.data.data);
    } catch (error) {
      setIsAuthorized(false);
      toast.error('Access Denied. You are not an Admin.');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/locations', newLocation);
      toast.success('Location created successfully!');
      setNewLocation({ name: '', trailName: '' });
      fetchData(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create location.');
    }
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/users/${editingUser._id}`, {
        role: editingUser.role,
        assignedLocation: editingUser.assignedLocation,
      });
      toast.success('User updated successfully!');
      setEditingUser(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user.');
    }
  };

  if (loading) return <p className="p-4 text-center">Loading Admin Panel...</p>;
  if (!isAuthorized) return <div />; 

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                    <td className="py-2 px-4">
                      <button onClick={() => setEditingUser(user)} className="text-blue-500 hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Location Management Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Add New Location</h2>
          <form onSubmit={handleLocationSubmit} className="space-y-4">
            <div>
              <label>Location Name (e.g., Gaurikund Gate)</label>
              <input type="text" value={newLocation.name} onChange={(e) => setNewLocation({...newLocation, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md text-black" required />
            </div>
            <div>
              <label>Trail Name (e.g., Kedarnath Trek)</label>
              <input type="text" value={newLocation.trailName} onChange={(e) => setNewLocation({...newLocation, trailName: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md text-black" required />
            </div>
            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Create Location</button>
          </form>
        </div>
      </div>
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit User: {editingUser.name}</h2>
            <form onSubmit={handleUserUpdate}>
              <div className="mb-4">
                <label>Role</label>
                <select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md text-black">
                  <option value="TREKKER">Trekker</option>
                  <option value="VERIFIER">Verifier</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="mb-6">
                <label>Assign Location (for Verifiers)</label>
                <select value={editingUser.assignedLocation || ''} onChange={(e) => setEditingUser({...editingUser, assignedLocation: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md text-black">
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
    </div>
  );
}