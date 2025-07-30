"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (user.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const apiCallPromise = axios.post('/api/auth/register', {
        name: user.name,
        email: user.email,
        password: user.password,
      });
      await toast.promise(apiCallPromise, {
        loading: 'Creating account...',
        success: 'Registration successful! Please log in.',
        error: (err) => `Registration failed: ${err.response?.data?.message || 'Please try again.'}`
      });
      
      router.push('/login'); 

    } catch (error) {
      console.error("Registration error caught in component:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-green-600">Harit Himalaya</h1>
          <p className="mt-2 text-gray-500">Create your account to join the mission.</p>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              id="name"
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password"  className="text-sm font-medium text-gray-700">Password</label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="•••••••• (min. 6 characters)"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword"  className="text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              id="confirmPassword"
              type="password"
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              placeholder="••••••••"
            />
          </div>
        </div>
        <div>
          <button
            onClick={onRegister}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </div>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-green-600 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}