'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import type { Startup } from '@/types/startup';

interface StartupsListProps {
  startups: Startup[];
}

export function StartupsList({ startups }: StartupsListProps) {
  return (
    <div className="space-y-4">
      {startups.map((startup) => (
        <Card key={startup.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{startup.startupName}</CardTitle>
                <CardDescription>Founded by {startup.founderName}</CardDescription>
              </div>
              <Badge
                variant={
                  startup.applicationStatus === 'approved'
                    ? 'default'
                    : startup.applicationStatus === 'pending'
                      ? 'secondary'
                      : 'destructive'
                }
              >
                {startup.applicationStatus.charAt(0).toUpperCase() +
                  startup.applicationStatus.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Business Stage</p>
                <p className="font-medium capitalize">{startup.businessStage.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Funding Status</p>
                <p className="font-medium capitalize">{startup.fundingStatus.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Team Size</p>
                <p className="font-medium">{startup.teamSize}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium">
                  {startup.city}, {startup.state}
                </p>
              </div>
            </div>

            {startup.rejectionReason && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                <p className="text-sm text-red-700 mt-1">{startup.rejectionReason}</p>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              {startup.applicationStatus === 'pending' && (
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/user/apply-startup/${startup.id}/edit`}>
                    Edit Application
                  </Link>
                </Button>
              )}
              <Button size="sm" variant="outline" asChild>
                <Link href={`/dashboard/user/apply-startup/${startup.id}`}>View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
