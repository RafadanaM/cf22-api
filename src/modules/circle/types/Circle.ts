type NormalizedCircleType = 'BOOTH_B' | 'BOOTH_A' | '1_SPACE' | '4_SPACE' | '2_SPACE';

type AttendingDay = 'SAT' | 'SUN';

type SocialMediaKind = 'FACEBOOK' | 'TWITTER' | 'INSTAGRAM' | 'OTHER';

type SocialMediaDetail = {
  kind: SocialMediaKind;
  url: string;
};

export type CircleId = string;

type Rating = 'M' | 'PG' | 'GA';

export type Circle = {
  id: CircleId;
  code: string;
  imageUrl: string | null;
  name: string;
  fandoms: string[];
  workTypes: string[];
  attendingDays: AttendingDay[];
  socialMedias: SocialMediaDetail[];
  rating: Rating;
  circleType: NormalizedCircleType;
  rect: BoothRect;
};

type BoothRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'VERTICAL' | 'HORIZONTAL' | 'SQUARE';
};

export type NormalizedCircles = {
  circles: Circle[];
  fandoms: string[];
};
