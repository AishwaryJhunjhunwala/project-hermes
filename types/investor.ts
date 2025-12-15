export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'banned';

export type InvestorType = 'angel' | 'vc' | 'corporate' | 'incubator' | 'accelerator' | 'fund';

export type StagePreference = 'idea' | 'seed' | 'series_a' | 'series_b' | 'growth';

export interface InvestorFormData {
  // Basic Information
  investorName: string;
  phone: string;

  // Location
  city: string;
  state: string;
  country: string;

  // Investment Details
  investorType: InvestorType;
  stagePreference: StagePreference;
  industryPreferences: string[];

  // Optional Information
  socialHandle: string | null;
  pastInvestmentSummary: string | null;
  availableForMentorship: boolean;
}

export interface Investor extends InvestorFormData {
  id: number;
  userId: number;
  applicationStatus: ApplicationStatus;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}
