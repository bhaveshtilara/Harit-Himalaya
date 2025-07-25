"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', user);
      console.log('Login success', response.data);
      if (response.data.role === 'VERIFIER') {
        router.push('/verifier/dashboard');
      } else {
        router.push('/dashboard');
      }

    } catch (error) {
      console.log('Login failed', error.message);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl mb-4">{loading ? 'Processing...' : 'Login'}</h1>
      <hr />
      <div className="flex flex-col gap-2">
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
          onClick={onLogin}
          className="p-2 border border-gray-300 rounded-lg mt-4 hover:bg-gray-100"
        >
          Login
        </button>
        <Link href="/register" className="text-sm mt-4 text-center">
          Do not have an account? Register here.
        </Link>
      </div>
    </div>
  );
}