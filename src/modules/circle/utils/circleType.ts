import type { CircleType, DefaultCircleType, LargeCircleType } from '../types/Circle';

export function isDefaultCircle(circleType: CircleType): circleType is DefaultCircleType {
  return circleType === '1_SPACE' || circleType === '2_SPACE' || circleType === '4_SPACE';
}

export function isLargeCircle(circleType: CircleType): circleType is LargeCircleType {
  return circleType === 'BOOTH_B' || circleType === 'BOOTH_A';
}
