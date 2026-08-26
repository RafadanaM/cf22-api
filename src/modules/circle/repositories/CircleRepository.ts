import type { NormalizedCircles } from '../types/Circle';
import parseRawCircles from '../utils/parseRawCircles';

export interface CircleRepository {
  getCircles: () => Promise<NormalizedCircles>;
  scrapeCircles: () => Promise<NormalizedCircles>;
  syncCircles: (normalizedCircles: NormalizedCircles) => Promise<void>;
}

const CATALOG_API = 'https://catalog.comifuro.net/catalog';
const FILE_PATH = './live_data/normalized_circles.json';

function createCircleRepository(): CircleRepository {
  let cachedCircleData: NormalizedCircles | undefined = undefined;

  async function getCircles() {
    // TODO: Clean this up,
    let circleData: NormalizedCircles | undefined = undefined;

    // TBH I don't think caching the file is necessary because cloudflare already caches the result.
    if (cachedCircleData) {
      circleData = cachedCircleData;
    } else {
      const file = Bun.file(FILE_PATH);
      const data = (await file.json()) as NormalizedCircles;
      cachedCircleData = data;

      circleData = data;
    }

    circleData.fillerCircles = [];

    return circleData;
  }

  async function scrapeCircles(): Promise<NormalizedCircles> {
    const response = await fetch(CATALOG_API, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch API: ${CATALOG_API} status: ${response.statusText}`
      );
    }

    const rawHTML = await response.text();

    return parseRawCircles(rawHTML);
  }

  async function syncCircles(normalizedCircles: NormalizedCircles) {
    if (!cachedCircleData) {
      cachedCircleData = normalizedCircles;
      await Bun.write(FILE_PATH, JSON.stringify(normalizedCircles));
      return;
    }

    cachedCircleData = normalizedCircles;
    await Bun.write(FILE_PATH, JSON.stringify(normalizedCircles));
  }

  return {
    getCircles,
    syncCircles,
    scrapeCircles
  };
}

export default createCircleRepository;
