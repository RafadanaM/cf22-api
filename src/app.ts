import { cors } from '@elysia/cors';
import { Elysia } from 'elysia';

import type { AppConfig } from '@config/types';
import type { initDB } from '@db/db';
import errorHandler from '@core/errors/errorHandler';
import loggerPlugin from '@core/logger/loggerPlugin';

import createBookmarkController from '@modules/bookmarks/controllers/BookmarkController';
import createBookmarkPlugin from '@modules/bookmarks/plugins/BookmarkPlugin';
import createBookmarkRepository from '@modules/bookmarks/repositories/BookmarkRepository';
import createBookmarkService from '@modules/bookmarks/services/BookmarkService';
import createCircleController from '@modules/circle/controllers/CircleController';
import createCirclePlugin from '@modules/circle/plugins/CirclePlugin';
import createCircleRepository from '@modules/circle/repositories/CircleRepository';
import createCircleService from '@modules/circle/services/CircleService';

import logger from '@core/logger/logger';
import createCloudflareClient from './infrastructure/cloudflare/cloudflareClient';
import createAppPlugin from './plugins/appPlugin';

interface CreateAppArgs {
  db: ReturnType<typeof initDB>;
  appConfig: AppConfig;
}

function createApp({ appConfig, db }: CreateAppArgs) {
  const cloudflareClient = createCloudflareClient({
    apiKey: appConfig.cfAPIKey,
    zoneId: appConfig.cfZoneId
  });

  const bookmarkRepository = createBookmarkRepository(db);
  const bookmarkService = createBookmarkService(bookmarkRepository);

  const circleRepository = createCircleRepository();
  const circleService = createCircleService(circleRepository, cloudflareClient);

  const appPlugin = createAppPlugin(appConfig);
  const circlePlugin = createCirclePlugin(circleService);
  const bookmarkPlugin = createBookmarkPlugin(bookmarkService);

  const circleController = createCircleController(appPlugin, circlePlugin);
  const bookmarkController = createBookmarkController(appPlugin, bookmarkPlugin);

  logger.info('Updating circle data...');
  void circleService.updateCircles();

  // scrape every 6 hours
  Bun.cron('0 */6 * * *', async () => {
    logger.info('[CRON] Running scheduled circle update...');
    void circleService.updateCircles();
  });

  const v1Routes = new Elysia({ prefix: '/v1' })
    .use(circleController)
    .use(bookmarkController);

  const app = new Elysia()
    .use(
      cors({
        origin: appConfig.origin,
        exposeHeaders: ['etag', 'ETag', 'eTag']
      })
    )
    .use(loggerPlugin)
    .use(errorHandler)
    .group('/api', (group) => group.use(v1Routes))
    .get('/healthcheck', () => {
      return { status: 'healthy', version: appConfig.commitHash };
    });

  return app;
}

export default createApp;
