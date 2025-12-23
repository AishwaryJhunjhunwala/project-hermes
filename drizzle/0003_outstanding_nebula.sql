CREATE TYPE "public"."member_type" AS ENUM('EXECUTIVE', 'CORE');--> statement-breakpoint
CREATE TABLE "members" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "members_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"year" integer NOT NULL,
	"member_type" "member_type" NOT NULL,
	"designation" text,
	"role" text,
	"image_url" text NOT NULL,
	"linkedin_url" text,
	"github_url" text,
	"twitter_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
