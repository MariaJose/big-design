import { theme } from '@bigcommerce/big-design-theme/stitches';
import type { CSS } from '@stitches/react';
import { Token } from '@stitches/react/types/theme';

export const tokenVariants = <T extends keyof typeof theme>(config: {
  token: T;
  css: (value: Token) => CSS;
}): Record<keyof typeof theme[T], CSS> =>
  Object.entries(theme[config.token]).reduce(
    (previousValue, [key, value]) => ({
      ...previousValue,

      [key]: config.css(value),
    }),
    {} as Record<keyof typeof theme[T], CSS>,
  );
