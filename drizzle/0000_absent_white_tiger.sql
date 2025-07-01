CREATE TABLE "mock_interview" (
	"id" serial PRIMARY KEY NOT NULL,
	"mock_id" varchar(36) NOT NULL,
	"json_mock_resp" text NOT NULL,
	"job_position" varchar(255) NOT NULL,
	"job_desc" varchar(255) NOT NULL,
	"job_experience" varchar(10) NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" varchar(20)
);
