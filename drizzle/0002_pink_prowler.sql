CREATE TYPE "public"."event_mode" AS ENUM('online', 'offline');--> statement-breakpoint
CREATE TABLE "events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"date" varchar(50) NOT NULL,
	"time" varchar(50) NOT NULL,
	"mode" "event_mode" DEFAULT 'offline' NOT NULL,
	"location" text,
	"link" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);  
