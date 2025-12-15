'use client';

import { useRouter } from 'next/navigation';
import { InvestorMultiStageForm } from './multi-stage-form';
import { updateInvestorApplication } from '@/app/actions/investors';
import { toast } from 'sonner';
import type { Investor, InvestorFormData } from '@/types/investor';

interface InvestorEditFormProps {
  userId: number;
  investor: Investor;
  isReapplying?: boolean;
}

export function InvestorEditForm({
  userId,
  investor,
  isReapplying = false,
}: InvestorEditFormProps) {
  const router = useRouter();

  const handleSubmit = async (data: InvestorFormData) => {
    const result = await updateInvestorApplication(investor.id, userId, data);

    if (result.success) {
      toast.success(
        isReapplying
          ? 'Application resubmitted successfully!'
          : 'Investor application updated successfully!'
      );
      router.push('/dashboard/user/apply-investor');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to update application');
    }
  };

  // Convert Investor to InvestorFormData for initial values
  const initialData: InvestorFormData = {
    investorName: investor.investorName,
    phone: investor.phone,
    city: investor.city,
    state: investor.state,
    country: investor.country,
    investorType: investor.investorType,
    stagePreference: investor.stagePreference,
    industryPreferences: investor.industryPreferences,
    socialHandle: investor.socialHandle,
    pastInvestmentSummary: investor.pastInvestmentSummary,
    availableForMentorship: investor.availableForMentorship,
  };

  return <InvestorMultiStageForm onSubmit={handleSubmit} initialData={initialData} />;
}
