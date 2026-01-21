'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitInvestorApplication } from '@/app/actions/investors';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { InvestorFormData, InvestorType, StagePreference } from '@/types/investor';

interface InvestorFormProps {
  userId: number;
}

export function InvestorForm({ userId }: InvestorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const data: InvestorFormData = {
        investorName: formData.get('investorName') as string,
        phone: formData.get('phone') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        country: formData.get('country') as string,
        investorType: formData.get('investorType') as InvestorType,
        stagePreference: formData.get('stagePreference') as StagePreference,
        industryPreferences: (formData.get('industryPreferences') as string)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        socialHandle: (formData.get('socialHandle') as string) || null,
        pastInvestmentSummary: (formData.get('pastInvestmentSummary') as string) || null,
        availableForMentorship: formData.get('availableForMentorship') === 'on',
      };

      const result = await submitInvestorApplication(userId, data);

      if (result.success) {
        toast.success('Application submitted successfully!');
        router.push('/dashboard/user');
      } else {
        toast.error(result.error || 'Failed to submit application');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-md border-0 ring-1 ring-gray-200 mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Apply as Investor</CardTitle>
        <CardDescription>
          Join our network of investors and connect with promising startups.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investorName">Investor/Firm Name</Label>
                <Input
                  id="investorName"
                  name="investorName"
                  required
                  placeholder="e.g. John Doe / Acme VC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" required placeholder="+1 234 567 890" />
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
            <h3 className="text-lg font-medium">Investment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investorType">Investor Type</Label>
                <Select name="investorType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="angel">Angel Investor</SelectItem>
                    <SelectItem value="vc">Venture Capital</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="incubator">Incubator</SelectItem>
                    <SelectItem value="accelerator">Accelerator</SelectItem>
                    <SelectItem value="fund">Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stagePreference">Stage Preference</Label>
                <Select name="stagePreference" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea Stage</SelectItem>
                    <SelectItem value="seed">Seed Stage</SelectItem>
                    <SelectItem value="series_a">Series A</SelectItem>
                    <SelectItem value="series_b">Series B</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industryPreferences">Industry Preferences (Comma separated)</Label>
              <Input
                id="industryPreferences"
                name="industryPreferences"
                required
                placeholder="e.g. Fintech, Edtech, AI"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pastInvestmentSummary">Past Investment Summary (Optional)</Label>
              <Textarea
                id="pastInvestmentSummary"
                name="pastInvestmentSummary"
                placeholder="Briefly describe your previous investments..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Info</h3>
            <div className="space-y-2">
              <Label htmlFor="socialHandle">LinkedIn/Social URL (Optional)</Label>
              <Input
                id="socialHandle"
                name="socialHandle"
                type="url"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="availableForMentorship" name="availableForMentorship" />
              <Label htmlFor="availableForMentorship" className="font-normal cursor-pointer">
                I am available for mentorship
              </Label>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
