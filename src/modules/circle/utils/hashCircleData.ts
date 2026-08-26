import type { NormalizedCircles } from '../types/Circle';

function hashCircleData(normalizedCircles: NormalizedCircles) {
  return Bun.hash(JSON.stringify(normalizedCircles));
}

export default hashCircleData;
