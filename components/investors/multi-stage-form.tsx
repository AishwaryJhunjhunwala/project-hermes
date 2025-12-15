'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { InvestorFormData, InvestorType, StagePreference } from '@/types/investor';

interface MultiStageFormProps {
  initialData?: Partial<InvestorFormData>;
  onSubmit: (data: InvestorFormData) => Promise<void>;
  isEditing?: boolean;
}

const STEPS = [
  { id: 1, title: 'Basic Information', description: 'Your details' },
  { id: 2, title: 'Location', description: 'Where you are based' },
  { id: 3, title: 'Investment Profile', description: 'Your preferences' },
  { id: 4, title: 'Additional Details', description: 'Optional information' },
];

const INDUSTRY_PREFERENCES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'E-commerce',
  'SaaS',
  'AI/ML',
  'Blockchain',
  'IoT',
  'Fintech',
  'Edtech',
  'Healthtech',
  'AgriTech',
  'CleanTech',
  'Other',
];

export function InvestorMultiStageForm({
  initialData,
  onSubmit,
  isEditing = false,
}: MultiStageFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<InvestorFormData>>({
    industryPreferences: [],
    availableForMentorship: false,
    ...initialData,
  });

  const progress = (currentStep / STEPS.length) * 100;

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.investorName?.trim()) {
          toast.error('Investor name is required');
          return false;
        }
        if (!formData.phone?.trim()) {
          toast.error('Phone number is required');
          return false;
        }
        return true;
      case 2:
        if (!formData.city?.trim() || !formData.state?.trim() || !formData.country?.trim()) {
          toast.error('All location fields are required');
          return false;
        }
        return true;
      case 3:
        if (!formData.investorType) {
          toast.error('Investor type is required');
          return false;
        }
        if (!formData.stagePreference) {
          toast.error('Stage preference is required');
          return false;
        }
        if (!formData.industryPreferences || formData.industryPreferences.length === 0) {
          toast.error('Select at least one industry preference');
          return false;
        }
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Convert empty strings to null for optional fields
      const cleanedData = {
        ...formData,
        socialHandle: formData.socialHandle?.trim() || null,
        pastInvestmentSummary: formData.pastInvestmentSummary?.trim() || null,
      } as InvestorFormData;

      await onSubmit(cleanedData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (data: Partial<InvestorFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const toggleIndustryPreference = (industry: string) => {
    const current = formData.industryPreferences || [];
    if (current.includes(industry)) {
      updateFormData({ industryPreferences: current.filter((i) => i !== industry) });
    } else {
      updateFormData({ industryPreferences: [...current, industry] });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex-1 text-center ${
                step.id === currentStep ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              <div className="text-sm">{step.title}</div>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-sm text-muted-foreground text-center mt-2">
          Step {currentStep} of {STEPS.length}
        </div>
      </div>

      {/* Form Steps */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldSet>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <FieldGroup>
                <Field>
                  <Label htmlFor="investorName">Investor Name / Organization Name *</Label>
                  <Input
                    id="investorName"
                    value={formData.investorName || ''}
                    onChange={(e) => updateFormData({ investorName: e.target.value })}
                    placeholder="Enter investor or organization name"
                  />
                </Field>

                <Field>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => updateFormData({ phone: e.target.value })}
                    placeholder="+1234567890"
                  />
                </Field>
              </FieldGroup>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <FieldGroup>
                <Field>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => updateFormData({ city: e.target.value })}
                    placeholder="Enter city"
                  />
                </Field>

                <Field>
                  <Label htmlFor="state">State / Province *</Label>
                  <Input
                    id="state"
                    value={formData.state || ''}
                    onChange={(e) => updateFormData({ state: e.target.value })}
                    placeholder="Enter state or province"
                  />
                </Field>

                <Field>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country || ''}
                    onChange={(e) => updateFormData({ country: e.target.value })}
                    placeholder="Enter country"
                  />
                </Field>
              </FieldGroup>
            )}

            {/* Step 3: Investment Profile */}
            {currentStep === 3 && (
              <FieldGroup>
                <Field>
                  <Label htmlFor="investorType">Investor Type *</Label>
                  <Select
                    value={formData.investorType}
                    onValueChange={(value) =>
                      updateFormData({ investorType: value as InvestorType })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select investor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="angel">Angel Investor</SelectItem>
                      <SelectItem value="vc">Venture Capital</SelectItem>
                      <SelectItem value="corporate">Corporate Investor</SelectItem>
                      <SelectItem value="incubator">Incubator</SelectItem>
                      <SelectItem value="accelerator">Accelerator</SelectItem>
                      <SelectItem value="fund">Investment Fund</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <Label htmlFor="stagePreference">Preferred Investment Stage *</Label>
                  <Select
                    value={formData.stagePreference}
                    onValueChange={(value) =>
                      updateFormData({ stagePreference: value as StagePreference })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea Stage</SelectItem>
                      <SelectItem value="seed">Seed Stage</SelectItem>
                      <SelectItem value="series_a">Series A</SelectItem>
                      <SelectItem value="series_b">Series B</SelectItem>
                      <SelectItem value="growth">Growth Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <Label>Industry Preferences * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {INDUSTRY_PREFERENCES.map((industry) => (
                      <div key={industry} className="flex items-center space-x-2">
                        <Checkbox
                          id={`industry-${industry}`}
                          checked={formData.industryPreferences?.includes(industry)}
                          onCheckedChange={() => toggleIndustryPreference(industry)}
                        />
                        <label
                          htmlFor={`industry-${industry}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {industry}
                        </label>
                      </div>
                    ))}
                  </div>
                </Field>
              </FieldGroup>
            )}

            {/* Step 4: Additional Details */}
            {currentStep === 4 && (
              <FieldGroup>
                <Field>
                  <Label htmlFor="socialHandle">Social Media Handle (Optional)</Label>
                  <Input
                    id="socialHandle"
                    value={formData.socialHandle || ''}
                    onChange={(e) => updateFormData({ socialHandle: e.target.value })}
                    placeholder="@username or profile URL"
                  />
                </Field>

                <Field>
                  <Label htmlFor="pastInvestmentSummary">Past Investment Summary (Optional)</Label>
                  <Textarea
                    id="pastInvestmentSummary"
                    value={formData.pastInvestmentSummary || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateFormData({ pastInvestmentSummary: e.target.value })
                    }
                    placeholder="Brief summary of your past investments..."
                    rows={4}
                  />
                </Field>

                <Field>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="availableForMentorship"
                      checked={formData.availableForMentorship}
                      onCheckedChange={(checked: boolean) =>
                        updateFormData({ availableForMentorship: !!checked })
                      }
                    />
                    <label
                      htmlFor="availableForMentorship"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Available for mentorship opportunities
                    </label>
                  </div>
                </Field>
              </FieldGroup>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>

              {currentStep < STEPS.length ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting
                    ? isEditing
                      ? 'Updating...'
                      : 'Submitting...'
                    : isEditing
                      ? 'Update Application'
                      : 'Submit Application'}
                </Button>
              )}
            </div>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  );
}
