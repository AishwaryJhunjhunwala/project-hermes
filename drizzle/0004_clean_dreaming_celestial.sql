CREATE TABLE "speakers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "speakers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256) NOT NULL,
	"designation" varchar(256) NOT NULL,
	"company" varchar(256) NOT NULL,
	"image_url" text NOT NULL,
	"linkedin_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
