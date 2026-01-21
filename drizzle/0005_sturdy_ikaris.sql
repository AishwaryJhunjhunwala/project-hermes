CREATE TABLE "sessions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sessions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256) NOT NULL,
	"date" varchar(50) NOT NULL,
	"start_time" varchar(50) NOT NULL,
	"end_time" varchar(50) NOT NULL,
	"location" text NOT NULL,
	"mode" "event_mode" DEFAULT 'offline' NOT NULL,
	"link" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
