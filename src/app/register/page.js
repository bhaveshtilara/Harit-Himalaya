"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', user);
      console.log('Registration success', response.data);
      alert('Registration successful! Please log in.');
      router.push('/login'); 
    } catch (error) {
      console.log('Registration failed', error.response?.data?.message || error.message);
      alert(`Registration failed: ${error.response?.data?.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl mb-4">{loading ? 'Processing...' : 'Register'}</h1>
      <hr />
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Name</label>
        <input
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black"
          id="name"
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="Your Name"
        />
        <label htmlFor="email">Email</label>
        <input
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black"
          id="email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="email"
        />
        <label htmlFor="password">Password</label>
        <input
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black"
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="password"
        />
        <button
          onClick={onRegister}
          className="p-2 border border-gray-300 rounded-lg mt-4 hover:bg-gray-100"
        >
          Register
        </button>
        <Link href="/login" className="text-sm mt-4 text-center">
          Already have an account? Login here.
        </Link>
      </div>
    </div>
  );
}