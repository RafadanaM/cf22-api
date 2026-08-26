import { Elysia } from 'elysia';

import type createAppPlugin from '@plugins/appPlugin';

import type createCirclePlugin from '../plugins/CirclePlugin';

function createCircleController(
  appPlugin: ReturnType<typeof createAppPlugin>,
  circlePlugin: ReturnType<typeof createCirclePlugin>
) {
  const billController = new Elysia({ prefix: '/circles' })
    .use(appPlugin)
    .use(circlePlugin)
    .get('/', async ({ circleService, headers, set }) => {
      const { circles, version } = await circleService.getCircles();

      if (headers['if-none-match'] === version) {
        set.status = 304;
        return undefined;
      }

      set.headers['etag'] = version;
      set.headers['cache-control'] = 'no-cache';

      return circles;
    });

  return billController;
}

export default createCircleController;
