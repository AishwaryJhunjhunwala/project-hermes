'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpAction } from '../../../actions/auth';
import Link from 'next/link';
import { motion } from 'motion/react';
import { LandingBackground } from '@/components/landing/background';
import { ArrowLeft } from 'lucide-react';

export default function SignUpPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await signUpAction(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/auth/signin?registered=true');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden font-sans selection:bg-black selection:text-white">
      <LandingBackground />

      <div className="w-full max-w-md p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl"
        >
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
            <p className="text-gray-600">Join our community today</p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-black focus:ring-black/5 transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-black focus:ring-black/5 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-black focus:ring-black/5 transition-all"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-black focus:ring-black/5 transition-all"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-bold text-black hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
