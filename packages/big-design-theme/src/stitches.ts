import { createStitches, defaultThemeMap } from '@stitches/react';

import { createHelpers } from './helpers';
import { createBorderRadius } from './system/border';
import { colors } from './system/colors';
import { createLineHeight } from './system/line-height';
import { createSpacing } from './system/spacing';
import { createTypography } from './system/typography';
import { zIndex } from './system/z-index';

export const { styled, config, createTheme, css, getCssText, globalCss, keyframes, prefix, reset, theme } =
  createStitches({
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
