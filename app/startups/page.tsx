'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  TrendingUp,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { getApprovedStartups, getIndustrySectors } from '@/app/actions/public/startups';
import type { BusinessStage, FundingStatus } from '@/types/startup';

type Startup = Awaited<ReturnType<typeof getApprovedStartups>>['startups'][0];

export default function StartupsClientPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [businessStage, setBusinessStage] = useState<BusinessStage | 'all'>('all');
  const [fundingStatus, setFundingStatus] = useState<FundingStatus | 'all'>('all');
  const [industrySector, setIndustrySector] = useState<string | 'all'>('all');

  const loadStartupsAndSectors = async () => {
    setLoading(true);
    const [startupsResult, sectorsResult] = await Promise.all([
      getApprovedStartups(),
      getIndustrySectors(),
    ]);

    if (startupsResult.success) {
      setStartups(startupsResult.startups);
    }
    if (sectorsResult.success) {
      setSectors(sectorsResult.sectors);
    }
    setLoading(false);
  };

  const loadStartups = async () => {
    const result = await getApprovedStartups({
      search,
      businessStage,
      fundingStatus,
      industrySector,
    });

    if (result.success) {
      setStartups(result.startups);
    }
  };

  useEffect(() => {
    loadStartupsAndSectors();
  }, []);

  useEffect(() => {
    loadStartups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, businessStage, fundingStatus, industrySector]);
  const resetFilters = () => {
    setSearch('');
    setBusinessStage('all');
    setFundingStatus('all');
    setIndustrySector('all');
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      idea: 'bg-purple-100 text-purple-800',
      prototype: 'bg-blue-100 text-blue-800',
      early_revenue: 'bg-green-100 text-green-800',
      growth: 'bg-orange-100 text-orange-800',
      scale: 'bg-red-100 text-red-800',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const formatStage = (stage: string) => {
    return stage
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Startup Directory</h1>
          <p className="text-lg text-slate-600">Explore innovative startups in our ecosystem</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search by name, founder, or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Business Stage Filter */}
              <Select
                value={businessStage}
                onValueChange={(value) => setBusinessStage(value as BusinessStage | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Business Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="prototype">Prototype</SelectItem>
                  <SelectItem value="early_revenue">Early Revenue</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                </SelectContent>
              </Select>

              {/* Funding Status Filter */}
              <Select
                value={fundingStatus}
                onValueChange={(value) => setFundingStatus(value as FundingStatus | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Funding Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Funding</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                  <SelectItem value="angel">Angel</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series_a">Series A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Industry Sector Filter */}
            <div className="grid md:grid-cols-2 gap-4">
              <Select value={industrySector} onValueChange={setIndustrySector}>
                <SelectTrigger>
                  <SelectValue placeholder="Industry Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-slate-600">
            {loading
              ? 'Loading...'
              : `${startups.length} startup${startups.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Startups Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : startups.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600">No startups found matching your criteria.</p>
              <Button variant="outline" onClick={resetFilters} className="mt-4">
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <Card key={startup.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <Badge className={getStageColor(startup.businessStage)}>
                      {formatStage(startup.businessStage)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{startup.startupName}</CardTitle>
                  <CardDescription>Founded by {startup.founderName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>
                        {startup.city}, {startup.state}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="h-4 w-4 shrink-0" />
                      <span>Team Size: {startup.teamSize}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <TrendingUp className="h-4 w-4 shrink-0" />
                      <span>Funding: {formatStage(startup.fundingStatus)}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {startup.industrySectors.slice(0, 3).map((sector) => (
                        <Badge key={sector} variant="outline" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                      {startup.industrySectors.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{startup.industrySectors.length - 3}
                        </Badge>
                      )}
                    </div>

                    {(startup.websiteUrl || startup.socialHandle) && (
                      <div className="flex gap-2 mt-4">
                        {startup.websiteUrl && (
                          <a
                            href={startup.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            <Globe className="h-4 w-4" />
                            Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-slate-50">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2025 Project Hermes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
