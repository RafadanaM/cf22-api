import { createAppConfig } from '@config/appConfig';
import { AppEnv } from '@config/env';
import { initDB } from '@db/db';

function bootstrap() {
  const appEnvResult = AppEnv.safeParse(process.env);

  if (!appEnvResult.success) {
    const errorMessage = `Some environment variables are missing! ${appEnvResult.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')}`;

    throw Error(errorMessage);
  }

  const appEnv = appEnvResult.data;

  const appConfig = createAppConfig(appEnv);
  const db = initDB();

  return { appConfig, db };
}

export default bootstrap;
