import type { NormalizedCircles } from '../types/Circle';

interface CircleService {
  getCircles: () => Promise<NormalizedCircles>;
}

function createCircleService(): CircleService {
  return {
    getCircles: async () => {
      const file = Bun.file('./live_data/circles.json');
      const circleData = (await file.json()) as NormalizedCircles;

      return circleData;
    }
  };
}

export default createCircleService;
