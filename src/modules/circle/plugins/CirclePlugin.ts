import { Elysia } from 'elysia';

import type { CircleService } from '../services/CircleService';

function createCirclePlugin(circleService: CircleService) {
  const circlePlugin = new Elysia({
    name: 'circlePlugin'
  }).decorate('circleService', circleService);

  return circlePlugin;
}

export default createCirclePlugin;
