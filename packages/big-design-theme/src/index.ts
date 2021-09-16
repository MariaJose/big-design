import { createStitches, defaultThemeMap } from '@stitches/react';

import { createHelpers, Helpers } from './helpers';
import { ThemeOptions, themeOptions } from './options';
import { Border, BorderRadius, createBorder, createBorderRadius } from './system/border';
import { Breakpoints, breakpoints, BreakpointValues, breakpointValues } from './system/breakpoints';
import { Colors, colors } from './system/colors';
import * as keyframes from './system/keyframes';
import { createLineHeight, LineHeight } from './system/line-height';
import { Shadow, shadow } from './system/shadow';
import { createSpacing, Spacing } from './system/spacing';
import { createTypography, Typography } from './system/typography';
import { ZIndex, zIndex } from './system/z-index';

export * from './helpers';
export * from './system';

export interface ThemeInterface {
  border: Border;
  borderRadius: BorderRadius;
  breakpointValues: BreakpointValues;
  breakpoints: Breakpoints;
  colors: Colors;
  helpers: Helpers;
  keyframes: typeof keyframes;
  lineHeight: LineHeight;
  shadow: Shadow;
  spacing: Spacing;
  typography: Typography;
  zIndex: ZIndex;
}

export const createTheme = (customOptions: Partial<ThemeOptions> = {}): ThemeInterface => {
  themeOptions.setOptions(customOptions);

  return {
    border: createBorder(),
    borderRadius: createBorderRadius(),
    breakpointValues,
    breakpoints,
    colors,
    helpers: createHelpers(),
    keyframes,
    lineHeight: createLineHeight(),
    shadow,
    spacing: createSpacing(),
    typography: createTypography(),
    zIndex,
  };
};

export const theme: ThemeInterface = createTheme();

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeInterface {} // eslint-disable-line
}

export const bdStitches = createStitches({
  theme: {
    colors: { ...colors },
    space: { ...createSpacing() },
    sizes: { ...createSpacing() },
    radii: { ...createBorderRadius() },
    lineHeights: { ...createLineHeight() },
    fonts: {
      sans: createTypography().fontFamily,
    },
    fontSizes: { ...createTypography().fontSize },
    fontWeights: { ...createTypography().fontWeight },
    zIndices: { ...zIndex },
    shadows: {
      floating: `0px 2px 12px ${createHelpers().createRGBA(colors.secondary70, 0.2)}`,
      raised: `0px 1px 6px ${createHelpers().createRGBA(colors.secondary70, 0.2)}`,
    },
    border: {
      box: '1px solid $colors$secondary30',
      boxError: '1px solid $colors$danger40',
    },
  },
  themeMap: {
    ...defaultThemeMap,
    border: 'border',
  },
});

export const { styled } = bdStitches;
