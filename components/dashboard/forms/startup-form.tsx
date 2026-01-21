'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitStartupApplication } from '@/app/actions/startups';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { StartupFormData, BusinessStage, FundingStatus } from '@/types/startup';

interface StartupFormProps {
  userId: number;
}

export function StartupForm({ userId }: StartupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const data: StartupFormData = {
        startupName: formData.get('startupName') as string,
        founderName: formData.get('founderName') as string,
        phone: formData.get('phone') as string,
        contactPhone: formData.get('contactPhone') as string,
        contactEmail: formData.get('contactEmail') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        country: formData.get('country') as string,
        industrySectors: (formData.get('industrySectors') as string)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        businessStage: formData.get('businessStage') as BusinessStage,
        fundingStatus: formData.get('fundingStatus') as FundingStatus,
        teamSize: parseInt(formData.get('teamSize') as string) || 1,
        websiteUrl: (formData.get('websiteUrl') as string) || null,
        socialHandle: (formData.get('socialHandle') as string) || null,
        pitchDeckUrl: (formData.get('pitchDeckUrl') as string) || null,
      };

      const result = await submitStartupApplication(userId, data);

      if (result.success) {
        toast.success('Startup registered successfully!');
        router.push('/dashboard/user');
      } else {
        toast.error(result.error || 'Failed to register startup');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-md border-0 ring-1 ring-gray-200 mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Register Your Startup</CardTitle>
        <CardDescription>showcase your innovation to investors and the community.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startupName">Startup Name</Label>
                <Input
                  id="startupName"
                  name="startupName"
                  required
                  placeholder="e.g. NextGen Tech"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founderName">Founder Name</Label>
                <Input id="founderName" name="founderName" required placeholder="e.g. Jane Doe" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Personal Phone</Label>
                <Input id="phone" name="phone" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Business Phone</Label>
                <Input id="contactPhone" name="contactPhone" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Business Email</Label>
                <Input id="contactEmail" name="contactEmail" type="email" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business Details</h3>

            <div className="space-y-2">
              <Label htmlFor="industrySectors">Industry Sectors (Comma separated)</Label>
              <Input
                id="industrySectors"
                name="industrySectors"
                required
                placeholder="e.g. Renewable Energy, SaaS, HealthTech"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessStage">Stage</Label>
                <Select name="businessStage" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="prototype">Prototype</SelectItem>
                    <SelectItem value="early_revenue">Early Revenue</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="scale">Scale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fundingStatus">Funding Status</Label>
                <Select name="fundingStatus" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                    <SelectItem value="angel">Angel</SelectItem>
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="series_a">Series A</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  name="teamSize"
                  type="number"
                  min="1"
                  required
                  defaultValue="1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Resources (Optional)</h3>
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input id="websiteUrl" name="websiteUrl" type="url" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialHandle">Social/LinkedIn URL</Label>
              <Input id="socialHandle" name="socialHandle" type="url" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pitchDeckUrl">Pitch Deck URL</Label>
              <Input
                id="pitchDeckUrl"
                name="pitchDeckUrl"
                type="url"
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register Startup'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
