import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Users, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

const Home = async () => {
  const session = await auth();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Project Hermes
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/startups" className="text-slate-700 hover:text-slate-900 font-medium">
              Startups
            </Link>
            <Link href="/events" className="text-slate-700 hover:text-slate-900 font-medium">
              Events
            </Link>
            <Link href="/contact" className="text-slate-700 hover:text-slate-900 font-medium">
              Contact
            </Link>
            {session ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link href="/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
          Connecting Startups with Investors
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Join our thriving ecosystem where innovative startups meet visionary investors. Build
          connections, attend events, and grow your venture.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/startups">
            <Button size="lg" variant="outline">
              Explore Startups
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Rocket className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>For Startups</CardTitle>
              <CardDescription>
                Showcase your innovation and connect with potential investors
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>For Investors</CardTitle>
              <CardDescription>
                Discover promising startups and investment opportunities
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Events</CardTitle>
              <CardDescription>
                Attend networking events, pitch sessions, and workshops
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Growth</CardTitle>
              <CardDescription>
                Access mentorship and resources to scale your business
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-linear-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardHeader className="text-center py-12">
            <CardTitle className="text-3xl mb-4">Ready to Get Started?</CardTitle>
            <CardDescription className="text-blue-100 text-lg mb-6">
              Join hundreds of startups and investors in our ecosystem
            </CardDescription>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-slate-50">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2025 Project Hermes. All rights reserved.</p>
          <div className="flex gap-6 justify-center mt-4">
            <Link href="/startups" className="hover:text-slate-900">
              Startups
            </Link>
            <Link href="/events" className="hover:text-slate-900">
              Events
            </Link>
            <Link href="/contact" className="hover:text-slate-900">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Home;
