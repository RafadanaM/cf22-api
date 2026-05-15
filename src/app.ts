import { cors } from '@elysia/cors';
import { Elysia } from 'elysia';

import type { AppConfig } from '@config/types';
import type { initDB } from '@db/db';
import errorHandler from '@core/errors/errorHandler';
import loggerPlugin from '@core/logger/loggerPlugin';

import createBookmarkController from './modules/bookmarks/controllers/BookmarkController';
import createBookmarkPlugin from './modules/bookmarks/plugins/BookmarkPlugin';
import createBookmarkRepository from './modules/bookmarks/repositories/BookmarkRepository';
import createBookmarkService from './modules/bookmarks/services/BookmarkService';
import createCircleController from './modules/circle/controllers/CircleController';
import createCirclePlugin from './modules/circle/plugins/CirclePlugin';
import createAppPlugin from './plugins/appPlugin';

interface CreateAppArgs {
  db: ReturnType<typeof initDB>;
  appConfig: AppConfig;
}

function createApp({ appConfig, db }: CreateAppArgs) {
  const bookmarkRepository = createBookmarkRepository(db);
  const bookmarkService = createBookmarkService(bookmarkRepository);

  const appPlugin = createAppPlugin(appConfig);
  const circlePlugin = createCirclePlugin();
  const bookmarkPlugin = createBookmarkPlugin(bookmarkService);

  const circleController = createCircleController(appPlugin, circlePlugin);
  const bookmarkController = createBookmarkController(appPlugin, bookmarkPlugin);

  const v1Routes = new Elysia({ prefix: '/v1' })
    .use(circleController)
    .use(bookmarkController);

  const app = new Elysia()
    .use(
      cors({
        origin: appConfig.origin
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
