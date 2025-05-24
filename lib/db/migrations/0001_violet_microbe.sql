CREATE TABLE "unicorns" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"company" varchar(255) NOT NULL,
	"valuation" numeric(10, 2) NOT NULL,
	"date_joined" timestamp NOT NULL,
	"country" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"industry" varchar(255) NOT NULL,
	"select_investors" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
