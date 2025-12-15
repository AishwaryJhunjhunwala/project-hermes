ALTER TABLE "investors" ADD COLUMN "application_status" "application_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "investors" ADD COLUMN "rejection_reason" text;