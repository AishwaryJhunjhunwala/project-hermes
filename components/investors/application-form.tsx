'use client';

import { useRouter } from 'next/navigation';
import { InvestorMultiStageForm } from './multi-stage-form';
import { submitInvestorApplication } from '@/app/actions/investors';
import { toast } from 'sonner';
import type { InvestorFormData } from '@/types/investor';

interface InvestorApplicationFormProps {
  userId: number;
}

export function InvestorApplicationForm({ userId }: InvestorApplicationFormProps) {
  const router = useRouter();

  const handleSubmit = async (data: InvestorFormData) => {
    const result = await submitInvestorApplication(userId, data);

    if (result.success) {
      toast.success('Investor application submitted successfully!');
      router.push('/dashboard/user');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to submit application');
    }
  };

  return <InvestorMultiStageForm onSubmit={handleSubmit} />;
}
