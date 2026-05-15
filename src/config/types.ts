export type AppEnvironment = 'production' | 'development';

export type AppConfig = {
  environment: AppEnvironment;
  port: string;
  commitHash: string;
  origin: string;
};
