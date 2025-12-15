import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactPage() {
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
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Contact Us</h1>
          <p className="text-lg text-slate-600">Have questions? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your full name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What is this regarding?" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>Reach out to us through any of these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                    <p className="text-slate-600">contact@projecthermes.com</p>
                    <p className="text-slate-600 text-sm mt-1">
                      We&apos;ll respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                    <p className="text-slate-600">+1 (555) 123-4567</p>
                    <p className="text-slate-600 text-sm mt-1">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Office</h3>
                    <p className="text-slate-600">
                      123 Innovation Drive
                      <br />
                      Tech Hub, TH 12345
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-linear-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle>Looking to join?</CardTitle>
                <CardDescription className="text-slate-700">
                  Whether you&apos;re a startup or an investor, we&apos;d love to have you in our
                  community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Link href="/auth/signup">
                    <Button className="w-full">Sign Up Now</Button>
                  </Link>
                  <Link href="/startups">
                    <Button variant="outline" className="w-full">
                      Browse Startups
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
}
