import { Elysia } from 'elysia';

import globalLogger from './logger';

const loggerPlugin = new Elysia({ name: 'logger-plugin' })
  .derive({ as: 'global' }, () => {
    const requestId = crypto.randomUUID();
    return {
      requestId,
      logger: globalLogger.child({ requestId })
    };
  })
  .onRequest(({ request }) => {
    request.startTime = performance.now();
  })
  .onAfterResponse({ as: 'global' }, ({ logger: localLogger, request, set, path }) => {
    const logger = localLogger ?? globalLogger;
    logger.info({
      method: request.method,
      path,
      status: set.status,
      duration: performance.now() - (request.startTime || 0)
    });
  })
  .onError({ as: 'global' }, ({ code, error, logger: localLogger, request, path }) => {
    const logger = localLogger ?? globalLogger;

    const errorCtx = {
      code,
      path,
      method: request.method
    };

    switch (code) {
      case 'NOT_FOUND':
        logger.warn(errorCtx);
        break;
      case 'VALIDATION':
        logger.warn({
          ...errorCtx,
          errors: error.all
        });
        break;

      case 'INVALID_FILE_TYPE':
      case 'INVALID_COOKIE_SIGNATURE':
      case 'PARSE':
        logger.warn({
          ...errorCtx,
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause
        });
        break;

      case 'UNKNOWN':
      case 'INTERNAL_SERVER_ERROR':
        logger.error({
          ...errorCtx,
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause instanceof Error ? error.cause.message : error.cause
        });
        break;
      default:
        logger.error({ ...errorCtx, ...error });
    }
  });

export default loggerPlugin;
