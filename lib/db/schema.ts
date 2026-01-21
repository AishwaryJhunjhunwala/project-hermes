import { pgTable, integer, varchar, timestamp, pgEnum, text, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['admin', 'investor', 'startup', 'normal_user']);

export const applicationStatusEnum = pgEnum('application_status', [
  'pending',
  'approved',
  'rejected',
  'banned',
]);

export const businessStageEnum = pgEnum('business_stage', [
  'idea',
  'prototype',
  'early_revenue',
  'growth',
  'scale',
]);

export const fundingStatusEnum = pgEnum('funding_status', [
  'bootstrapped',
  'angel',
  'seed',
  'series_a',
  'none',
]);

export const investorTypeEnum = pgEnum('investor_type', [
  'angel',
  'vc',
  'corporate',
  'incubator',
  'accelerator',
  'fund',
]);

export const stagePreferenceEnum = pgEnum('stage_preference', [
  'idea',
  'seed',
  'series_a',
  'series_b',
  'growth',
]);

export const eventModeEnum = pgEnum('event_mode', ['online', 'offline']);

// Tables
export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 512 }).notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  isBanned: boolean('is_banned').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userRoles = pgTable('user_roles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const startups = pgTable('startups', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Basic Information
  startupName: varchar('startup_name', { length: 256 }).notNull(),
  founderName: varchar('founder_name', { length: 256 }).notNull(),

  // Contact Information
  phone: varchar('phone', { length: 20 }).notNull(), // Founder's personal phone
  contactPhone: varchar('contact_phone', { length: 20 }).notNull(), // Startup's main contact
  contactEmail: varchar('contact_email', { length: 256 }).notNull(), // Startup's contact email

  // Location
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),

  // Business Details
  industrySectors: text('industry_sectors').array().notNull(),
  businessStage: businessStageEnum('business_stage').notNull(),
  fundingStatus: fundingStatusEnum('funding_status').notNull(),
  teamSize: integer('team_size').notNull(),

  // Optional Information
  websiteUrl: varchar('website_url', { length: 512 }),
  socialHandle: varchar('social_handle', { length: 256 }),
  pitchDeckUrl: varchar('pitch_deck_url', { length: 512 }),

  // Application Status
  applicationStatus: applicationStatusEnum('application_status').default('pending').notNull(),
  rejectionReason: text('rejection_reason'), // Admin feedback when rejecting

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const investors = pgTable('investors', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  investorName: varchar('investor_name', { length: 256 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  investorType: investorTypeEnum('investor_type').notNull(),
  stagePreference: stagePreferenceEnum('stage_preference').notNull(),
  industryPreferences: text('industry_preferences').array().notNull(),
  socialHandle: varchar('social_handle', { length: 256 }),
  pastInvestmentSummary: text('past_investment_summary'),
  availableForMentorship: boolean('available_for_mentorship').default(false).notNull(),

  // Application Status
  applicationStatus: applicationStatusEnum('application_status').default('pending').notNull(),
  rejectionReason: text('rejection_reason'), // Admin feedback when rejecting

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  roles: many(userRoles),
  startups: many(startups),
  investor: one(investors, {
    fields: [users.id],
    references: [investors.userId],
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
}));

export const startupsRelations = relations(startups, ({ one }) => ({
  user: one(users, {
    fields: [startups.userId],
    references: [users.id],
  }),
}));

export const investorsRelations = relations(investors, ({ one }) => ({
  user: one(users, {
    fields: [investors.userId],
    references: [users.id],
  }),
}));

// Events table
export const events = pgTable('events', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description').notNull(),
  date: varchar('date', { length: 50 }).notNull(), // Store as YYYY-MM-DD
  time: varchar('time', { length: 50 }).notNull(), // Store as HH:MM
  mode: eventModeEnum('mode').notNull().default('offline'),
  location: text('location'), // For offline events
  link: text('link'), // For online events
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

//members
export const memberTypeEnum = pgEnum('member_type', ['EXECUTIVE', 'CORE']);

export const members = pgTable('members', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  year: integer('year').notNull(),
  memberType: memberTypeEnum('member_type').notNull(),
  designation: text('designation'), // only for EXECUTIVE
  role: text('role'), // only for CORE
  imageUrl: text('image_url').notNull(),
  linkedinUrl: text('linkedin_url'),
  githubUrl: text('github_url'),
  twitterUrl: text('twitter_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const speakers = pgTable('speakers', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 256 }).notNull(),
  designation: varchar('designation', { length: 256 }).notNull(),
  company: varchar('company', { length: 256 }).notNull(),
  imageUrl: text('image_url').notNull(),
  linkedinUrl: text('linkedin_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 256 }).notNull(),
  date: varchar('date', { length: 50 }).notNull(), // YYYY-MM-DD
  startTime: varchar('start_time', { length: 50 }).notNull(), // HH:MM
  endTime: varchar('end_time', { length: 50 }).notNull(), // HH:MM
  location: text('location').notNull(),
  mode: eventModeEnum('mode').notNull().default('offline'),
  link: text('link'), // Optional link for online sessions
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
