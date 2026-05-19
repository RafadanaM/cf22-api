import type { NormalizedCircles } from '../types/Circle';

interface CircleService {
  getCircles: () => Promise<NormalizedCircles>;
}

function createCircleService(): CircleService {
  return {
    getCircles: async () => {
      const file = Bun.file('./live_data/circles.json');
      const circleData = (await file.json()) as NormalizedCircles;

      // temporarily disable fandoms as it is not used and there are dozens of them
      circleData.fandoms = [];

      return circleData;
    }
  };
}

export default createCircleService;
