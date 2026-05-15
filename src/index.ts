import globalLogger from '@core/logger/logger';

import createApp from './app';
import bootstrap from './bootstrap';

// Handle Uncaught Exceptions
process
  .on('uncaughtException', async (err) => {
    globalLogger.fatal(err, 'Uncaught Exception thrown!');
    handleShutdown(1);
  })
  // Handle Unhandled Rejections (Async/Promises)
  .on('unhandledRejection', async (reason, promise) => {
    globalLogger.fatal({ reason, promise }, 'Unhandled Rejection at Promise');
    handleShutdown(1);
  })
  .on('SIGTERM', async () => {
    globalLogger.warn('received SIGTERM signal');
    handleShutdown(0);
  })
  .on('SIGINT', async () => {
    globalLogger.warn('received SIGINT signal');
    handleShutdown(0);
  });

globalLogger.info('bootstraping config...');
const { appConfig, db } = bootstrap();

const app = createApp({
  appConfig,
  db
});

globalLogger.info('creating app...');

app.listen(
  {
    port: appConfig.port
  },
  () => {
    globalLogger.info(`App is running on port: ${appConfig.port}`);
  }
);

function handleShutdown(exitCode: number) {
  globalLogger.info(`Received exitCode of ${exitCode}`);

  globalLogger.info('Exiting Process...');
  // oxlint-disable-next-line unicorn/no-process-exit
  process.exit(exitCode);
}
