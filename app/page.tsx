import Link from 'next/link';
import { auth } from '@/lib/auth';

const Home = async () => {
  const session = await auth();

  return (
    <div className="bg-black h-screen w-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl mb-8">Project Hermes</h1>
      <p className="text-xl mb-8">Connecting Startups with Investors</p>
      <div className="flex gap-4">
        {session ? (
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/auth/signin"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default Home;
