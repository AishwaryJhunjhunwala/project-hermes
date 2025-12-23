CREATE TYPE "public"."application_status" AS ENUM('pending', 'approved', 'rejected', 'banned');--> statement-breakpoint
CREATE TYPE "public"."business_stage" AS ENUM('idea', 'prototype', 'early_revenue', 'growth', 'scale');--> statement-breakpoint
CREATE TYPE "public"."funding_status" AS ENUM('bootstrapped', 'angel', 'seed', 'series_a', 'none');--> statement-breakpoint
CREATE TYPE "public"."investor_type" AS ENUM('angel', 'vc', 'corporate', 'incubator', 'accelerator', 'fund');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'investor', 'startup', 'normal_user');--> statement-breakpoint
CREATE TYPE "public"."stage_preference" AS ENUM('idea', 'seed', 'series_a', 'series_b', 'growth');--> statement-breakpoint
CREATE TABLE "investors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "investors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"investor_name" varchar(256) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"investor_type" "investor_type" NOT NULL,
	"stage_preference" "stage_preference" NOT NULL,
	"industry_preferences" text[] NOT NULL,
	"social_handle" varchar(256),
	"past_investment_summary" text,
	"available_for_mentorship" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "investors_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "startups" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "startups_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"startup_name" varchar(256) NOT NULL,
	"founder_name" varchar(256) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"contact_phone" varchar(20) NOT NULL,
	"contact_email" varchar(256) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"industry_sectors" text[] NOT NULL,
	"business_stage" "business_stage" NOT NULL,
	"funding_status" "funding_status" NOT NULL,
	"team_size" integer NOT NULL,
	"website_url" varchar(512),
	"social_handle" varchar(256),
	"pitch_deck_url" varchar(512),
	"application_status" "application_status" DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(256) NOT NULL,
	"password" varchar(512) NOT NULL,
	"name" varchar(256) NOT NULL,
	"is_banned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "investors" ADD CONSTRAINT "investors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "startups" ADD CONSTRAINT "startups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; 