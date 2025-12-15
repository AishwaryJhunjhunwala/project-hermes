export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'banned';

export type BusinessStage = 'idea' | 'prototype' | 'early_revenue' | 'growth' | 'scale';

export type FundingStatus = 'bootstrapped' | 'angel' | 'seed' | 'series_a' | 'none';

export interface StartupFormData {
  // Basic Information
  startupName: string;
  founderName: string;

  // Contact Information
  phone: string; // Founder's personal phone
  contactPhone: string; // Startup's main contact
  contactEmail: string; // Startup's contact email

  // Location
  city: string;
  state: string;
  country: string;

  // Business Details
  industrySectors: string[];
  businessStage: BusinessStage;
  fundingStatus: FundingStatus;
  teamSize: number;

  // Optional Information
  websiteUrl: string | null;
  socialHandle: string | null;
  pitchDeckUrl: string | null;
}

export interface Startup extends StartupFormData {
  id: number;
  userId: number;
  applicationStatus: ApplicationStatus;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}
