import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'file:./data/rebank.db',
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'node src/db/seed.js',
  },
});
