import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./app/.server/database/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		url: "postgres://tkl:1230984576@localhost:5432/exe-learning-app",
	}
});

