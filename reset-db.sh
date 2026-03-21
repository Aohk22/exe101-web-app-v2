#!/bin/bash

dropdb "${DATABASE_NAME}"
createdb "${DATABASE_NAME}"
pnpm run db:push
psql "${DATABASE_URL}" -f "./app/.server/database/user-to-lesson-trigger.sql"
pnpm run db:seed
