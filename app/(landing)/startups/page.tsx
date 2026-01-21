'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Building2, MapPin, Users, ArrowUpRight } from 'lucide-react';
import { getApprovedStartups, getIndustrySectors } from '@/app/actions/public/startups';
import type { BusinessStage, FundingStatus } from '@/types/startup';
import { LandingBackground } from '@/components/landing/background';

type Startup = Awaited<ReturnType<typeof getApprovedStartups>>['startups'][0];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
      idea: 'bg-purple-100 text-purple-800 border-purple-200',
      prototype: 'bg-blue-100 text-blue-800 border-blue-200',
      early_revenue: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      growth: 'bg-orange-100 text-orange-800 border-orange-200',
      scale: 'bg-rose-100 text-rose-800 border-rose-200',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatStage = (stage: string) => {
    return stage
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden font-sans selection:bg-black selection:text-white">
      <LandingBackground />

      <motion.div
        className="container mx-auto px-4 py-12 pt-32 relative z-10"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-black" />
            <span className="text-sm font-bold tracking-widest uppercase">Ecosystem</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6">
            Startup Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Discover and connect with the innovative startups shaping the future of our ecosystem.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeInUp}>
          <div className="mb-12 p-1 rounded-2xl bg-linear-to-r from-emerald-50 via-purple-50 to-blue-50 border border-white/50 shadow-sm">
            <div className="bg-white/40 backdrop-blur-xl rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-black rounded-lg shadow-md">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-xl tracking-tight text-gray-900">Filter & Search</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Search - Spans 6 cols */}
                  <div className="lg:col-span-6">
                    <Input
                      placeholder="Search startups, founders, or locations..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-12 px-4 bg-white border-gray-200 focus:border-black focus:ring-black/5 rounded-xl transition-all shadow-sm"
                    />
                  </div>

                  {/* Business Stage - Spans 3 cols */}
                  <div className="lg:col-span-3">
                    <Select
                      value={businessStage}
                      onValueChange={(value) => setBusinessStage(value as BusinessStage | 'all')}
                    >
                      <SelectTrigger className="w-full h-12 bg-white border-gray-200 focus:border-black focus:ring-black/5 rounded-xl shadow-sm">
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
                  </div>

                  {/* Funding Status - Spans 3 cols */}
                  <div className="lg:col-span-3">
                    <Select
                      value={fundingStatus}
                      onValueChange={(value) => setFundingStatus(value as FundingStatus | 'all')}
                    >
                      <SelectTrigger className="w-full h-12 bg-white border-gray-200 focus:border-black focus:ring-black/5 rounded-xl shadow-sm">
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Industry Sector - Spans 3 cols (to match image layout roughly) */}
                  <div className="lg:col-span-3">
                    <Select value={industrySector} onValueChange={setIndustrySector}>
                      <SelectTrigger className="w-full h-12 bg-white border-gray-200 focus:border-black focus:ring-black/5 rounded-xl shadow-sm">
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
                  </div>

                  {/* Reset Filters - Spans remaining 9 cols */}
                  <div className="lg:col-span-9">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="w-full h-12 bg-white border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-black rounded-xl transition-all shadow-sm font-medium"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.div variants={fadeInUp} className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-black/5">
            <div
              className={`w-2.5 h-2.5 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}
            />
            <p className="text-sm font-semibold text-gray-800">
              {loading
                ? 'Syncing Ecosystem Data...'
                : `${startups.length} Active ${startups.length === 1 ? 'Startup' : 'Startups'}`}
            </p>
          </div>
        </motion.div>

        {/* Startups Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[300px] bg-white/40 rounded-3xl border border-white/50 animate-pulse"
              />
            ))}
          </div>
        ) : startups.length === 0 ? (
          <motion.div variants={fadeInUp}>
            <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-3xl p-16 text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <Search className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No matches found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                We couldn&apos;t find any startups matching your current filters. Try adjusting your
                search criteria.
              </p>
              <Button
                onClick={resetFilters}
                size="lg"
                className="bg-black text-white px-8 rounded-xl h-12"
              >
                Clear All Filters
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {startups.map((startup) => (
              <motion.div
                key={startup.id}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <div className="group h-full bg-white rounded-3xl p-1 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100">
                  <div className="bg-gray-50/50 rounded-[20px] p-6 h-full flex flex-col relative overflow-hidden group-hover:bg-white transition-colors duration-500">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Building2 className="h-7 w-7 text-gray-900" />
                      </div>
                      <Badge
                        className={`${getStageColor(startup.businessStage)} px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-none`}
                      >
                        {formatStage(startup.businessStage)}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {startup.startupName}
                      </h3>
                      <p className="text-sm font-medium text-gray-500 mb-6">
                        by {startup.founderName}
                      </p>

                      <div className="space-y-3.5">
                        <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                          <div className="p-1.5 bg-white rounded-lg shadow-sm">
                            <MapPin className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium">
                            {startup.city}, {startup.state}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                          <div className="p-1.5 bg-white rounded-lg shadow-sm">
                            <Users className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium">{startup.teamSize} Member Team</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200/60 relative z-10">
                      <div className="flex flex-wrap gap-2 mb-5">
                        {startup.industrySectors.slice(0, 3).map((sector) => (
                          <span
                            key={sector}
                            className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-600 uppercase tracking-wide"
                          >
                            {sector}
                          </span>
                        ))}
                      </div>

                      {(startup.websiteUrl || startup.socialHandle) && (
                        <div className="flex items-center justify-between">
                          {startup.websiteUrl ? (
                            <a
                              href={startup.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              Visit Website
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                          ) : (
                            <div></div>
                          )}

                          <div className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-sm">
                            <ArrowUpRight className="h-4 w-4 text-black" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
