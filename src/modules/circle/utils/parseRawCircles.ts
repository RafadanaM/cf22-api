import { DOMParser, HTMLScriptElement } from 'linkedom';

import { ParsingError } from '@core/errors/errors';

import logger from '@core/logger/logger';
import type {
  AttendingDay,
  BoothRect,
  Circle,
  CircleType,
  DefaultCircleType,
  LargeCircleType,
  NormalizedCircles,
  Rating,
  SocialMediaDetail
} from '../types/Circle';
import { isDefaultCircle, isLargeCircle } from './circleType';
import getCircleDisplayConfig from './getCircleDisplayConfig';

type RawDay = 'Both Days' | 'SAT' | 'SUN';

type RawCircleType = 'Booth_B' | 'Booth_A' | '1 Space(s)' | '2 Space(s)' | '4 Space(s)';

type RawCircle = {
  id: number;
  user_id: string;
  circle_code: string;
  name: string;
  circle_cut: string;
  SellsCommision: boolean;
  SellsComic: boolean;
  SellsArtbook: boolean;
  SellsPhotobookGeneral: boolean;
  SellsNovel: boolean;
  SellsGame: boolean;
  SellsMusic: boolean;
  SellsGoods: boolean;
  circle_facebook: string | null;
  circle_instagram: string | null;
  circle_twitter: string | null;
  circle_other_socials: string | null;
  marketplace_link: string | null;
  fandom: string;
  other_fandom: string;
  rating: Rating;
  sampleworks_images: string[] | null;
  day: RawDay;
  SellsHandmadeCrafts: boolean;
  SellsMagazine: boolean;
  SellsPhotobookCosplay: boolean;
  circle_type: RawCircleType;
};

type RawState = {
  circle: {
    allCircle: RawCircle[];
  };
};

const MAP_WIDTH = 7680;
const MAP_HEIGHT = 3981;

const FANDOM_SPLIT_PATTERN = /,\s*(?![^(]*\))/;

function parseRawCircles(htmlString: string): NormalizedCircles {
  const parser = new DOMParser();

  const doc = parser.parseFromString(htmlString, 'text/html');

  const scripts = doc.querySelectorAll('script') as HTMLScriptElement[];

  const selectedScript = scripts.find((script) =>
    script.textContent.includes('window.__INITIAL_STATE__')
  );

  if (!selectedScript) {
    throw new ParsingError('Expected Script Not Found');
  }

  const scriptContent = selectedScript.textContent.trim();

  const openBracket = scriptContent.indexOf('{');
  const closeBracket = scriptContent.lastIndexOf('}');

  const stringObj = scriptContent.slice(openBracket, closeBracket + 1);

  try {
    const obj = JSON.parse(stringObj) as RawState;
    return parseAllCircle(obj.circle.allCircle);
  } catch (e) {
    let message = Error.isError(e) ? e.message : '';

    throw new ParsingError('Failed to Parse string object: ' + message);
  }
}

export default parseRawCircles;

function parseAllCircle(allCircles: RawCircle[]): NormalizedCircles {
  const normalizedCirles: Circle[] = [];
  const allFandoms = new Set<string>();
  const start = performance.now();

  allCircles.forEach((rawCircle) => {
    const code = normalizeCircleCode(rawCircle.circle_code);
    const circleType = normalizeRawCircleType(rawCircle.circle_type);
    const fandoms = normalizeFandoms(rawCircle.fandom, rawCircle.other_fandom);

    normalizedCirles.push({
      id: String(rawCircle.id),
      code,
      name: rawCircle.name.trim(),
      imageUrl: rawCircle.circle_cut,
      sampleWorks: rawCircle.sampleworks_images ?? [],
      rating: rawCircle.rating,
      circleType,
      attendingDays: normalizeDay(rawCircle.day),
      fandoms,
      socialMedias: normalizeSocialMedia(rawCircle),
      workTypes: normalizeWorkTypes(rawCircle),
      rect: getBoothRect(code, circleType),
      displayConfig: getCircleDisplayConfig(parseCircleCode(code, circleType).boothLetter)
    });

    fandoms.forEach((fandom) => {
      allFandoms.add(fandom);
    });
  });
  const end = performance.now();

  logger.info(`time taken: ${end - start}`);

  return {
    circles: normalizedCirles,
    fillerCircles: [],
    fandoms: Array.from(allFandoms)
  };
}

type ParsedDefaultCircleCode = {
  boothLetter: string;
  boothStartNumber: number;
  boothSize: number;
  boothSubLetter: string;
  circleType: DefaultCircleType;
};

type ParsedLargeCircleCode = {
  boothLetter: string;
  boothStartNumber: number;
  boothSize: number;
  boothSubLetter: undefined;
  circleType: LargeCircleType;
};
/**
 * there's definitely better way to express raw circle code,
 * but I just want to get this done
 */
type ParsedCircleCode = ParsedDefaultCircleCode | ParsedLargeCircleCode;
function parseCircleCode(circleCode: string, circleType: CircleType): ParsedCircleCode {
  const defaultValue = isLargeCircle(circleType)
    ? {
        boothLetter: '',
        boothStartNumber: 0,
        boothSize: 0,
        circleType: circleType
      }
    : {
        boothLetter: '',
        boothStartNumber: 0,
        boothSize: 0,
        circleType: circleType,
        boothSubLetter: ''
      };
  return circleCode
    .split('/')
    .reduce<ParsedCircleCode>((acc: ParsedCircleCode, boothCode, idx) => {
      const [letter, rightSide] = boothCode.split('-');

      if (idx === 0 && letter && rightSide) {
        acc.boothLetter = letter;
        acc.boothStartNumber = Number(rightSide.slice(0, 2));
      }

      if (rightSide && rightSide.length > 2) {
        const subLetter = rightSide.slice(2, 4).trim();

        acc.boothSize += subLetter.length - 1;
        acc.boothSubLetter = subLetter;
      }

      acc.boothSize += 1;

      return acc;
    }, defaultValue);
}

function getBoothRect(circleCode: string, circleType: CircleType): BoothRect {
  // assume a circles will not have booths that have different letter
  const parsedCircleCode = parseCircleCode(circleCode, circleType);
  return calculateRect(parsedCircleCode);
}

function calculateRect(parsedCircleCode: ParsedCircleCode): BoothRect {
  // AA Booths
  if (
    parsedCircleCode.boothLetter === 'AA' &&
    isLargeParsedCircleCode(parsedCircleCode)
  ) {
    return calculateAABoothRect(parsedCircleCode);
  }

  // Ab - Ag  Booths
  if (
    parsedCircleCode.boothLetter.length === 2 &&
    isLargeParsedCircleCode(parsedCircleCode)
  ) {
    return calculateAxBoothRect(parsedCircleCode);
  }

  if (
    parsedCircleCode.boothLetter === 'A' &&
    isDefaultParsedCircleCode(parsedCircleCode)
  ) {
    return calculateABoothRect(parsedCircleCode);
  }

  if (parsedCircleCode.boothLetter === 'Z') {
  }

  return {
    height: 0,
    width: 0,
    direction: 'VERTICAL',
    x: 0,
    y: 0
  };
}

function calculateABoothRect({
  circleType,
  boothStartNumber,
  boothLetter,
  boothSize,
  boothSubLetter
}: ParsedDefaultCircleCode): BoothRect {
  const baseX = 4590;
  const baseY = 3008;

  const boothNumberOffsetX = (boothStartNumber - 1) * 40;
  const boothSubLetterOffsetX =
    boothSubLetter === 'ab' || boothSubLetter === 'b' ? 20 : 0;

  const boothSizeOffsetX = Math.max(boothSize - 2, 0) * 20;

  return {
    x: baseX - boothNumberOffsetX - boothSubLetterOffsetX - boothSizeOffsetX,
    y: baseY,
    direction: 'HORIZONTAL',
    height: 40,
    width: 20 * boothSize
  };
}

const BOOTH_AA_SIZE = 45;
const BOOTH_Ax_Size = 45;
const BOOTH_Ax_FIRST_GAP_X_CHAR_CODE = 'B'.charCodeAt(0);
const BOOTH_Ax_SECOND_GAP_X_CHAR_CODE = 'E'.charCodeAt(0);

function calculateAxBoothRect(parsedCircleCode: ParsedLargeCircleCode): BoothRect {
  const baseX = 5663;
  const baseY = 2778;

  const boothLetter = parsedCircleCode.boothLetter;
  const lastLetterCode = boothLetter.charCodeAt(1);

  const isHorizontal =
    (parsedCircleCode.boothStartNumber === 26 ||
      parsedCircleCode.boothStartNumber === 20 ||
      parsedCircleCode.boothStartNumber === 13 ||
      parsedCircleCode.boothStartNumber === 6) &&
    parsedCircleCode.boothSize === 2;
  const isUpwards = parsedCircleCode.boothStartNumber <= 26;

  // ############## X OFFSET #################
  const numberOffsetX = ((parsedCircleCode.boothStartNumber / 27) | 0) * BOOTH_Ax_Size;

  const sizeOffsetX = isHorizontal ? BOOTH_Ax_Size * (parsedCircleCode.boothSize - 1) : 0;

  // gap until Ae
  const boothLetterFirstDiffX = lastLetterCode - BOOTH_Ax_FIRST_GAP_X_CHAR_CODE;
  const boothLetterFirstOffsetX = Math.min(boothLetterFirstDiffX, 3) * 160;

  // gap until Af
  const boothLetterSecondOffsetX =
    Math.min(Math.max(lastLetterCode - BOOTH_Ax_SECOND_GAP_X_CHAR_CODE, 0), 1) * 208;

  // gap until AG
  const boothLetterThirdOffsetX = boothLetter === 'AG' ? 234 : 0;

  // ############## Y OFFSET #################
  const columnIndex = isUpwards
    ? parsedCircleCode.boothStartNumber - 1
    : 52 - parsedCircleCode.boothStartNumber;

  const numberOffsetY = BOOTH_Ax_Size * columnIndex;

  /**
   * offset for size ex: a circle with 2 booths AB-01/AB-02
   * boothStartNumber is 1,
   * size is 2
   * Y coord of the booth should start at AB-02 instead of AB-02
   * there are no booths that has a size > 1 horizontally so it's fine for now
   */
  const sizeOffsetY =
    isHorizontal || !isUpwards ? 0 : BOOTH_Ax_Size * (parsedCircleCode.boothSize - 1);

  const firstGapOffsetY =
    parsedCircleCode.boothStartNumber > 6 && parsedCircleCode.boothStartNumber < 47
      ? 100
      : 0;
  const secondGapOffetY =
    parsedCircleCode.boothStartNumber > 13 && parsedCircleCode.boothStartNumber < 40
      ? 230
      : 0;
  const thirdGapOffsetY =
    parsedCircleCode.boothStartNumber > 20 && parsedCircleCode.boothStartNumber < 33
      ? 110
      : 0;

  return {
    height: isHorizontal ? BOOTH_Ax_Size : parsedCircleCode.boothSize * BOOTH_Ax_Size,
    width: isHorizontal ? parsedCircleCode.boothSize * BOOTH_Ax_Size : BOOTH_Ax_Size,
    direction: isHorizontal ? 'HORIZONTAL' : 'VERTICAL',
    x:
      baseX -
      numberOffsetX -
      sizeOffsetX -
      boothLetterFirstOffsetX -
      boothLetterSecondOffsetX -
      boothLetterThirdOffsetX,
    y:
      baseY -
      numberOffsetY -
      sizeOffsetY -
      firstGapOffsetY -
      secondGapOffetY -
      thirdGapOffsetY
  };
}

function calculateAABoothRect(parsedCircleCode: ParsedLargeCircleCode): BoothRect {
  // base coords
  let baseX = 5660;
  let baseY = 2990;
  let numberOffset = 1;

  if (parsedCircleCode.boothStartNumber >= 11) {
    baseX = 5900;
    baseY = 1005;
    numberOffset = 11;
  }

  const sizeOffset = (parsedCircleCode.boothSize - 1) * BOOTH_AA_SIZE;
  const startNumberOffset =
    (parsedCircleCode.boothStartNumber - numberOffset) * BOOTH_AA_SIZE;

  const firstSpaceOffset = parsedCircleCode.boothStartNumber >= 15 ? 184 : 0;

  return {
    height: BOOTH_AA_SIZE,
    width: BOOTH_AA_SIZE * parsedCircleCode.boothSize,
    direction: 'HORIZONTAL',
    x: baseX - sizeOffset - startNumberOffset - firstSpaceOffset,
    y: baseY
  };
}

function normalizeWorkTypes(rawCircle: RawCircle): string[] {
  const workTypes: string[] = [];

  if (rawCircle.SellsArtbook) {
    workTypes.push('artbook');
  }

  if (rawCircle.SellsComic) {
    workTypes.push('comic');
  }

  if (rawCircle.SellsCommision) {
    workTypes.push('commision');
  }

  if (rawCircle.SellsGame) {
    workTypes.push('game');
  }

  if (rawCircle.SellsGoods) {
    workTypes.push('goods');
  }

  if (rawCircle.SellsHandmadeCrafts) {
    workTypes.push('handmade crafts');
  }

  if (rawCircle.SellsMagazine) {
    workTypes.push('magazine');
  }

  if (rawCircle.SellsMusic) {
    workTypes.push('music');
  }

  if (rawCircle.SellsPhotobookCosplay) {
    workTypes.push('photobook cosplay');
  }

  if (rawCircle.SellsPhotobookGeneral) {
    workTypes.push('photobook general');
  }

  return workTypes;
}

function normalizeSocialMedia(rawCircle: RawCircle): SocialMediaDetail[] {
  const socialMediaDetails: SocialMediaDetail[] = [];

  if (rawCircle.circle_facebook) {
    socialMediaDetails.push({
      kind: 'FACEBOOK',
      url: normalizeExternalUrl(rawCircle.circle_facebook)
    });
  }

  if (rawCircle.circle_instagram) {
    socialMediaDetails.push({
      kind: 'INSTAGRAM',
      url: normalizeExternalUrl(rawCircle.circle_instagram)
    });
  }

  if (rawCircle.circle_twitter) {
    socialMediaDetails.push({
      kind: 'TWITTER',
      url: normalizeExternalUrl(rawCircle.circle_twitter)
    });
  }

  if (rawCircle.circle_other_socials) {
    socialMediaDetails.push({
      kind: 'OTHER',
      url: normalizeExternalUrl(rawCircle.circle_other_socials)
    });
  }

  return socialMediaDetails;
}

function normalizeFandoms(fandoms: string, otherFandoms: string): string[] {
  const normalizedOtherFandoms = otherFandoms === '-' ? '' : otherFandoms;
  return fandoms
    .split(FANDOM_SPLIT_PATTERN)
    .concat(normalizedOtherFandoms.split(FANDOM_SPLIT_PATTERN))
    .filter(Boolean)
    .map((f) => f.trim().toLowerCase().replace(/\s+/g, ' '));
}

function normalizeDay(day: RawDay): AttendingDay[] {
  if (day === 'Both Days') {
    return ['SAT', 'SUN'];
  }

  if (day === 'SAT') {
    return ['SAT'];
  }

  return ['SUN'];
}

function normalizeRawCircleType(rawCircleType: RawCircleType): CircleType {
  return rawCircleType
    .toUpperCase()
    .replaceAll(' ', '_')
    .replaceAll('(S)', '') as CircleType;
}

function normalizeCircleCode(rawCode: string): string {
  return rawCode.replaceAll('/u002', '/');
}

export function normalizeExternalUrl(url: string): string {
  if (!url) return '';

  const trimmedUrl = url.trim();

  // Checks if the url starts with http:// or https:// or //
  const hasProtocol = /^(https?:)?\/\//i.test(trimmedUrl);

  if (hasProtocol) {
    return trimmedUrl;
  }

  // Prepend https:// for absolute external routing
  return `https://${trimmedUrl}`;
}

function isLargeParsedCircleCode(
  parsedCircleCode: ParsedCircleCode
): parsedCircleCode is ParsedLargeCircleCode {
  return isLargeCircle(parsedCircleCode.circleType);
}

function isDefaultParsedCircleCode(
  parsedCircleCode: ParsedCircleCode
): parsedCircleCode is ParsedDefaultCircleCode {
  return isDefaultCircle(parsedCircleCode.circleType);
}
