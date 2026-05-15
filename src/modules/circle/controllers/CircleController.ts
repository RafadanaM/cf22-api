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
    .get('/', ({ circleService }) => {
      return circleService.getCircles();
    });

  return billController;
}

export default createCircleController;
