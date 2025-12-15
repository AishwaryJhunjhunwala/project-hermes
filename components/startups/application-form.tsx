'use client';

import { StartupMultiStageForm } from './multi-stage-form';
import { submitStartupApplication } from '@/app/actions/startups';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { StartupFormData } from '@/types/startup';

interface StartupApplicationFormProps {
  userId: number;
}

export function StartupApplicationForm({ userId }: StartupApplicationFormProps) {
  const router = useRouter();

  const handleSubmit = async (data: StartupFormData) => {
    const result = await submitStartupApplication(userId, data);

    if (result.success) {
      toast.success('Application submitted successfully! We will review it shortly.');
      router.push('/dashboard/user');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to submit application');
    }
  };

  return <StartupMultiStageForm onSubmit={handleSubmit} />;
}
