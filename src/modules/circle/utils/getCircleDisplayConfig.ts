import type { CircleDisplayConfig } from '../types/Circle';

const displayConfig = new Map<string, CircleDisplayConfig>([
  [
    'A',
    {
      backgroundColor: '#fff0f0',
      borderColor: '#ffb3b3',
      backgroundColorHover: '#ffe0e0'
    }
  ], // Soft Red
  [
    'B',
    {
      backgroundColor: '#fff5eb',
      borderColor: '#ffd1a4',
      backgroundColorHover: '#ffebd6'
    }
  ], // Soft Orange
  [
    'C',
    {
      backgroundColor: '#fffbeb',
      borderColor: '#ffe6a4',
      backgroundColorHover: '#fff5d6'
    }
  ], // Soft Yellow-Orange
  [
    'D',
    {
      backgroundColor: '#fffdeb',
      borderColor: '#fff3a4',
      backgroundColorHover: '#fffbe0'
    }
  ], // Soft Yellow
  [
    'E',
    {
      backgroundColor: '#faffeb',
      borderColor: '#f0ffa4',
      backgroundColorHover: '#f5ffd6'
    }
  ], // Soft Lime-Yellow
  [
    'F',
    {
      backgroundColor: '#f5fbeb',
      borderColor: '#ddffa4',
      backgroundColorHover: '#ebffd6'
    }
  ], // Crisp Lime
  [
    'G',
    {
      backgroundColor: '#ebfbe3',
      borderColor: '#c1fca3',
      backgroundColorHover: '#defcd1'
    }
  ], // Light Lime Green
  [
    'H',
    {
      backgroundColor: '#e3fbe3',
      borderColor: '#a3fca3',
      backgroundColorHover: '#d1fcd1'
    }
  ], // Soft Mint Green
  [
    'I',
    {
      backgroundColor: '#e3fbeb',
      borderColor: '#a3fcd1',
      backgroundColorHover: '#d1fced'
    }
  ], // Mint Cyan
  [
    'J',
    {
      backgroundColor: '#e3fbf5',
      borderColor: '#a3fceb',
      backgroundColorHover: '#d1fcf7'
    }
  ], // Soft Cyan
  [
    'K',
    {
      backgroundColor: '#e3fbfb',
      borderColor: '#a3fcfc',
      backgroundColorHover: '#d1fcfc'
    }
  ], // Ice Blue
  [
    'L',
    {
      backgroundColor: '#eebffb',
      borderColor: '#a4efff',
      backgroundColorHover: '#d6f7ff'
    }
  ], // Sky Blue
  [
    'M',
    {
      backgroundColor: '#ebf3ff',
      borderColor: '#a4cbff',
      backgroundColorHover: '#d6e7ff'
    }
  ], // Soft Blue
  [
    'N',
    {
      backgroundColor: '#ebebff',
      borderColor: '#a4a4ff',
      backgroundColorHover: '#d6d6ff'
    }
  ], // Periwinkle Blue
  [
    'O',
    {
      backgroundColor: '#f0ebff',
      borderColor: '#bda4ff',
      backgroundColorHover: '#e2d6ff'
    }
  ], // Lavender Blue
  [
    'P',
    {
      backgroundColor: '#f5ebff',
      borderColor: '#d1a4ff',
      backgroundColorHover: '#ebd6ff'
    }
  ], // Soft Violet
  [
    'Q',
    {
      backgroundColor: '#ffebff',
      borderColor: '#ffa4ff',
      backgroundColorHover: '#ffd6ff'
    }
  ], // Pale Orchid
  [
    'R',
    {
      backgroundColor: '#ffebf5',
      borderColor: '#ffa4d1',
      backgroundColorHover: '#ffd6eb'
    }
  ], // Light Magenta
  [
    'S',
    {
      backgroundColor: '#ffebf0',
      borderColor: '#ffa4be',
      backgroundColorHover: '#ffd6e0'
    }
  ], // Rose Pink
  [
    'Z',
    {
      backgroundColor: '#fff0f2',
      borderColor: '#ffb3bf',
      backgroundColorHover: '#ffe0e5'
    }
  ], // Soft Crimson
  [
    'AA',
    {
      backgroundColor: '#fff2ea',
      borderColor: '#ffc299',
      backgroundColorHover: '#ffe4d3'
    }
  ], // Peach
  [
    'AB',
    {
      backgroundColor: '#fff8ea',
      borderColor: '#ffd899',
      backgroundColorHover: '#ffeed3'
    }
  ], // Warm Cream
  [
    'AC',
    {
      backgroundColor: '#f7f9e8',
      borderColor: '#dae697',
      backgroundColorHover: '#eff2d3'
    }
  ], // Sage Green Tint
  [
    'AD',
    {
      backgroundColor: '#eaf7ee',
      borderColor: '#aee6bd',
      backgroundColorHover: '#daf2e1'
    }
  ], // Pale Emerald
  [
    'AE',
    {
      backgroundColor: '#eaf6f7',
      borderColor: '#aedee6',
      backgroundColorHover: '#daf0f2'
    }
  ], // Soft Turquoise
  [
    'AF',
    {
      backgroundColor: '#edf0f9',
      borderColor: '#bac7ec',
      backgroundColorHover: '#e2e6f4'
    }
  ], // Slate Blue Tint
  [
    'AG',
    {
      backgroundColor: '#f6eff9',
      borderColor: '#dec5ec',
      backgroundColorHover: '#f0e4f4'
    }
  ] // Soft Mauve
]);

function getCircleDisplayConfig(circleLetter: string): CircleDisplayConfig {
  return (
    displayConfig.get(circleLetter.toUpperCase()) ?? {
      backgroundColor: '#def7c9',
      borderColor: '#7cd123',
      backgroundColorHover: '#b3e582'
    }
  );
}

export default getCircleDisplayConfig;
