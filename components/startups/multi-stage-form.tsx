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
import { toast } from 'sonner';
import type { StartupFormData, BusinessStage, FundingStatus } from '@/types/startup';

interface MultiStageFormProps {
  initialData?: Partial<StartupFormData>;
  onSubmit: (data: StartupFormData) => Promise<void>;
  isEditing?: boolean;
}

const STEPS = [
  { id: 1, title: 'Basic Information', description: 'Startup and founder details' },
  { id: 2, title: 'Contact & Location', description: 'How to reach you' },
  { id: 3, title: 'Business Details', description: 'Industry and stage' },
  { id: 4, title: 'Additional Information', description: 'Optional details' },
];

const INDUSTRY_SECTORS = [
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

export function StartupMultiStageForm({
  initialData,
  onSubmit,
  isEditing = false,
}: MultiStageFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<StartupFormData>>({
    industrySectors: [],
    teamSize: 1,
    ...initialData,
  });

  const progress = (currentStep / STEPS.length) * 100;

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.startupName?.trim()) {
          toast.error('Startup name is required');
          return false;
        }
        if (!formData.founderName?.trim()) {
          toast.error('Founder name is required');
          return false;
        }
        return true;
      case 2:
        if (!formData.phone?.trim()) {
          toast.error('Personal phone is required');
          return false;
        }
        if (!formData.contactPhone?.trim()) {
          toast.error('Contact phone is required');
          return false;
        }
        if (!formData.contactEmail?.trim()) {
          toast.error('Contact email is required');
          return false;
        }
        if (!formData.city?.trim() || !formData.state?.trim() || !formData.country?.trim()) {
          toast.error('All location fields are required');
          return false;
        }
        return true;
      case 3:
        if (!formData.industrySectors || formData.industrySectors.length === 0) {
          toast.error('Select at least one industry sector');
          return false;
        }
        if (!formData.businessStage) {
          toast.error('Business stage is required');
          return false;
        }
        if (!formData.fundingStatus) {
          toast.error('Funding status is required');
          return false;
        }
        if (!formData.teamSize || formData.teamSize < 1) {
          toast.error('Team size must be at least 1');
          return false;
        }
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
        websiteUrl: formData.websiteUrl?.trim() || null,
        socialHandle: formData.socialHandle?.trim() || null,
        pitchDeckUrl: formData.pitchDeckUrl?.trim() || null,
      } as StartupFormData;

      await onSubmit(cleanedData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (data: Partial<StartupFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const toggleIndustrySector = (sector: string) => {
    const current = formData.industrySectors || [];
    if (current.includes(sector)) {
      updateFormData({ industrySectors: current.filter((s) => s !== sector) });
    } else {
      updateFormData({ industrySectors: [...current, sector] });
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
          {currentStep === 1 && <StepOne formData={formData} updateFormData={updateFormData} />}
          {currentStep === 2 && <StepTwo formData={formData} updateFormData={updateFormData} />}
          {currentStep === 3 && (
            <StepThree
              formData={formData}
              updateFormData={updateFormData}
              toggleIndustrySector={toggleIndustrySector}
            />
          )}
          {currentStep === 4 && <StepFour formData={formData} updateFormData={updateFormData} />}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
            >
              Back
            </Button>
            {currentStep < STEPS.length ? (
              <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting
                  ? 'Submitting...'
                  : isEditing
                    ? 'Update Application'
                    : 'Submit Application'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Step 1: Basic Information
function StepOne({
  formData,
  updateFormData,
}: {
  formData: Partial<StartupFormData>;
  updateFormData: (data: Partial<StartupFormData>) => void;
}) {
  return (
    <FieldSet>
      <FieldGroup>
        <Field>
          <Label>Startup Name *</Label>
          <Input
            placeholder="Enter your startup name"
            value={formData.startupName || ''}
            onChange={(e) => updateFormData({ startupName: e.target.value })}
          />
        </Field>

        <Field>
          <Label>Founder Name *</Label>
          <Input
            placeholder="Enter founder's full name"
            value={formData.founderName || ''}
            onChange={(e) => updateFormData({ founderName: e.target.value })}
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

// Step 2: Contact & Location
function StepTwo({
  formData,
  updateFormData,
}: {
  formData: Partial<StartupFormData>;
  updateFormData: (data: Partial<StartupFormData>) => void;
}) {
  return (
    <FieldSet>
      <FieldGroup>
        <Field>
          <Label>Personal Phone *</Label>
          <Input
            type="tel"
            placeholder="Founder's personal phone"
            value={formData.phone || ''}
            onChange={(e) => updateFormData({ phone: e.target.value })}
          />
        </Field>

        <Field>
          <Label>Startup Contact Phone *</Label>
          <Input
            type="tel"
            placeholder="Main contact number for startup"
            value={formData.contactPhone || ''}
            onChange={(e) => updateFormData({ contactPhone: e.target.value })}
          />
        </Field>

        <Field>
          <Label>Contact Email *</Label>
          <Input
            type="email"
            placeholder="startup@example.com"
            value={formData.contactEmail || ''}
            onChange={(e) => updateFormData({ contactEmail: e.target.value })}
          />
        </Field>

        <Field>
          <Label>City *</Label>
          <Input
            placeholder="Enter city"
            value={formData.city || ''}
            onChange={(e) => updateFormData({ city: e.target.value })}
          />
        </Field>

        <Field>
          <Label>State *</Label>
          <Input
            placeholder="Enter state"
            value={formData.state || ''}
            onChange={(e) => updateFormData({ state: e.target.value })}
          />
        </Field>

        <Field>
          <Label>Country *</Label>
          <Input
            placeholder="Enter country"
            value={formData.country || ''}
            onChange={(e) => updateFormData({ country: e.target.value })}
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

// Step 3: Business Details
function StepThree({
  formData,
  updateFormData,
  toggleIndustrySector,
}: {
  formData: Partial<StartupFormData>;
  updateFormData: (data: Partial<StartupFormData>) => void;
  toggleIndustrySector: (sector: string) => void;
}) {
  return (
    <FieldSet>
      <FieldGroup>
        <Field>
          <Label>Industry Sectors * (Select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {INDUSTRY_SECTORS.map((sector) => (
              <button
                key={sector}
                type="button"
                onClick={() => toggleIndustrySector(sector)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  formData.industrySectors?.includes(sector)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-accent'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </Field>

        <Field>
          <Label>Business Stage *</Label>
          <Select
            value={formData.businessStage}
            onValueChange={(value) => updateFormData({ businessStage: value as BusinessStage })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select business stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="prototype">Prototype</SelectItem>
              <SelectItem value="early_revenue">Early Revenue</SelectItem>
              <SelectItem value="growth">Growth</SelectItem>
              <SelectItem value="scale">Scale</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <Label>Funding Status *</Label>
          <Select
            value={formData.fundingStatus}
            onValueChange={(value) => updateFormData({ fundingStatus: value as FundingStatus })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select funding status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
              <SelectItem value="angel">Angel</SelectItem>
              <SelectItem value="seed">Seed</SelectItem>
              <SelectItem value="series_a">Series A</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <Label>Team Size *</Label>
          <Input
            type="number"
            min="1"
            placeholder="Number of team members"
            value={formData.teamSize || ''}
            onChange={(e) => updateFormData({ teamSize: parseInt(e.target.value) || 1 })}
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

// Step 4: Additional Information (Optional)
function StepFour({
  formData,
  updateFormData,
}: {
  formData: Partial<StartupFormData>;
  updateFormData: (data: Partial<StartupFormData>) => void;
}) {
  return (
    <FieldSet>
      <FieldGroup>
        <Field>
          <Label>Website URL</Label>
          <Input
            type="url"
            placeholder="https://yourstartu p.com"
            value={formData.websiteUrl || ''}
            onChange={(e) => updateFormData({ websiteUrl: e.target.value })}
          />
        </Field>

        <Field>
          <Label>Social Media Handle</Label>
          <Input
            placeholder="@yourstartup"
            value={formData.socialHandle || ''}
            onChange={(e) => updateFormData({ socialHandle: e.target.value })}
          />
        </Field>

        <Field>
          <Label>Pitch Deck URL</Label>
          <Input
            type="url"
            placeholder="https://drive.google.com/..."
            value={formData.pitchDeckUrl || ''}
            onChange={(e) => updateFormData({ pitchDeckUrl: e.target.value })}
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
