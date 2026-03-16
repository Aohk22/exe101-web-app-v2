CREATE TABLE "courses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "courses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"description" varchar(255) NOT NULL,
	"instructor" varchar(255) NOT NULL,
	"thumbnail" text NOT NULL,
	"category" text NOT NULL,
	"length" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lesson_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"length" integer NOT NULL,
	"module_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "module" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "module_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"course_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reviews_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"course_id" integer,
	"content" varchar(255) NOT NULL,
	"rating" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_to_courses" (
	"user_id" integer,
	"course_id" integer,
	CONSTRAINT "users_to_courses_pkey" PRIMARY KEY("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "users_to_lessons" (
	"user_id" integer,
	"lesson_id" integer,
	"completed" boolean DEFAULT false,
	CONSTRAINT "users_to_lessons_pkey" PRIMARY KEY("user_id","lesson_id")
);
--> statement-breakpoint
ALTER TABLE "users_to_courses" ADD CONSTRAINT "users_to_courses_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "users_to_courses" ADD CONSTRAINT "users_to_courses_course_id_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id");--> statement-breakpoint
ALTER TABLE "users_to_lessons" ADD CONSTRAINT "users_to_lessons_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "users_to_lessons" ADD CONSTRAINT "users_to_lessons_lesson_id_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id");