export type LargeCircleType = 'BOOTH_B' | 'BOOTH_A';
export type DefaultCircleType = '1_SPACE' | '4_SPACE' | '2_SPACE';
/**
 * BOOTH_B: Big booths (AA-Ag) that occupies 2 spaces
 * BOOTH_A: Big booths (AA-Ag) that occupies 1 space
 * 1_SPACE: Normal booths (A-Z) that occupies 1 space
 * 2_SPACE: Normal booths (A-Z) that occupies 2 spaces
 * 4_SPACE: Normal booths (A-Z) that occupies 4 spaces
 *
 */
export type CircleType = DefaultCircleType | LargeCircleType;

export type AttendingDay = 'SAT' | 'SUN';

export type SocialMediaKind = 'FACEBOOK' | 'TWITTER' | 'INSTAGRAM' | 'OTHER';

export type SocialMediaDetail = {
  kind: SocialMediaKind;
  url: string;
};

export type CircleId = string;

export type Rating = 'M' | 'PG' | 'GA';

export type CircleDisplayConfig = {
  backgroundColor: string;
  borderColor: string;
  backgroundColorHover: string;
};

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
  circleType: CircleType;
  rect: BoothRect;
  displayConfig: CircleDisplayConfig;
  sampleWorks: string[];
};

export type BoothRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  /**
   * VERTICAL: Booths are stacked vertically
   * HORIZONTAL: Booths are stacked horizontally
   */
  direction: 'VERTICAL' | 'HORIZONTAL';
};

export type NormalizedCircles = {
  circles: Circle[];
  fandoms: string[];
  fillerCircles: Circle[];
};
