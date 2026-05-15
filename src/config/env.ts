import { z } from 'zod';

export const AppEnv = z.object({
  APP_PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['production', 'development']).default('development'),
  COMMIT_HASH: z.string().default('development')
});

export type AppEnvSchema = z.infer<typeof AppEnv>;
