import { Elysia } from 'elysia';

import type { AppConfig } from '@config/types';

function createAppPlugin(appConfig: AppConfig) {
  const appPlugin = new Elysia({
    name: 'appPlugin'
  }).decorate('appConfig', appConfig);

  return appPlugin;
}

export default createAppPlugin;
