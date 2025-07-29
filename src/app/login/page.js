"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    const toastId = toast.loading('Signing in...');
    setLoading(true);
    
    try {
      const response = await axios.post('/api/auth/login', user);
      toast.success('Login successful!', { id: toastId });
      
      if (response.data.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (response.data.role === 'VERIFIER') {
        router.push('/verifier/dashboard');
      } else {
        router.push('/dashboard');
      }

    } catch (error) {
      console.log('Login failed', error.message);
      toast.error('Login failed. Please check your credentials.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-green-600">Harit Himalaya</h1>
          <p className="mt-2 text-gray-500">Welcome back! Please login to your account.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            onClick={onLogin}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </div>
        
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-green-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}