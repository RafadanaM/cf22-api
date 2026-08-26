import logger from '@core/logger/logger';
import { APIPromise, Cloudflare } from 'cloudflare';

interface CreateCloudflareClientParams {
  apiKey: string;
  zoneId: string;
}

export interface CacheClient {
  purgeUrls: (urls: string[]) => APIPromise<Cloudflare.Cache.CachePurgeResponse | null>;
}

function createCloudflareClient({
  apiKey,
  zoneId
}: CreateCloudflareClientParams): CacheClient {
  if (apiKey.length === 0) {
    logger.warn('[CF] apiKey is empty, cf will not work!');
  }

  if (zoneId.length === 0) {
    logger.warn('[CF] zoneId is empty, cf will not work!');
  }

  const client = new Cloudflare({
    apiKey
  });

  const purgeUrls = (urls: string[]) => {
    return client.cache.purge({
      zone_id: zoneId,
      files: urls
    });
  };

  return {
    purgeUrls
  };
}

export default createCloudflareClient;
