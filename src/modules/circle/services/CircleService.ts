import { getAppConfig } from '@config/appConfig';
import logger from '@core/logger/logger';

import type { CacheClient } from '../../../infrastructure/cloudflare/cloudflareClient';
import type { CircleRepository } from '../repositories/CircleRepository';
import type { NormalizedCircles } from '../types/Circle';
import hashCircleData from '../utils/hashCircleData';

export interface CircleService {
  getCircles: () => Promise<{ version: string; circles: NormalizedCircles }>;
  updateCircles: () => Promise<void>;
}

function createCircleService(
  circleRepository: CircleRepository,
  cacheClient: CacheClient
): CircleService {
  let version: string = '';

  const appConfig = getAppConfig();

  async function getCircles() {
    const circles = await circleRepository.getCircles();

    version = `"${hashCircleData(circles).toString(16)}"`;

    return {
      version,
      circles
    };
  }

  async function updateCircles() {
    try {
      logger.info('[CIRCLE_SERVICE] Scrapping circles...');
      const scrapedCircles = await circleRepository.scrapeCircles();
      logger.info('[CIRCLE_SERVICE] Scrapping circles complete');

      const existingCircles: NormalizedCircles = await circleRepository
        .getCircles()
        .catch(() => ({
          circles: [],
          fandoms: [],
          fillerCircles: []
        }));

      const scrapedCirclesHash = hashCircleData(scrapedCircles);
      const existingCirclesHash = hashCircleData(existingCircles);

      if (scrapedCirclesHash === existingCirclesHash) {
        logger.info('[CIRCLE_SERVICE] Existing and scraped circle is the same, noop');
        return;
      }

      logger.info(
        '[CIRCLE_SERVICE] Existing and scraped circle is different, Syncing circles...'
      );
      await circleRepository.syncCircles(scrapedCircles);
      logger.info('[CIRCLE_SERVICE] Syncing circles complete');

      if (appConfig.environment === 'production') {
        logger.info('[CIRCLE_SERVICE] Purging cache..');
        try {
          const res = await cacheClient.purgeUrls([appConfig.origin]);
          logger.info(`[CIRCLE_SERVICE] Purging cache complete, id: ${res?.id}`);
        } catch (e) {
          logger.error(
            `[CIRCLE_SERVICE] Purging cache failed: ${Error.isError(e) ? e : ''}`
          );
        }
      }
    } catch (e) {
      const message = Error.isError(e) ? e.message : 'Failed to scrape circles';
      logger.error(`[CIRCLE_SERVICE] ${message}`);
    }
  }

  return {
    getCircles,
    updateCircles
  };
}

export default createCircleService;
