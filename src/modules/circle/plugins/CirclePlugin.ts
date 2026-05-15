import { Elysia } from 'elysia';

import createCircleService from '../services/CircleService';

function createCirclePlugin() {
  const circleService = createCircleService();
  const circlePlugin = new Elysia({
    name: 'circlePlugin'
  }).decorate('circleService', circleService);

  return circlePlugin;
}

export default createCirclePlugin;
