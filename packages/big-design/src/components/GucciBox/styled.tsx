import { styled } from '@bigcommerce/big-design-theme/stitches';
import { clearFix } from 'polished';

import { tokenVariants } from '../../utils';
import { displayVariants, marginVariants, paddingVariants } from '../../variants';

export const StyledGucciBox = styled('div', marginVariants, paddingVariants, displayVariants, {
  boxSizing: 'border-box',

  variants: {
    backgroundColor: tokenVariants({
      token: 'colors',
      css: (value) => ({ backgroundColor: value }),
    }),
    border: tokenVariants({
      token: 'border',
      css: (value) => ({ border: value }),
    }),
    borderTop: tokenVariants({
      token: 'border',
      css: (value) => ({ borderTop: value }),
    }),
    borderRight: tokenVariants({
      token: 'border',
      css: (value) => ({ borderRight: value }),
    }),
    borderBottom: tokenVariants({
      token: 'border',
      css: (value) => ({ borderBottom: value }),
    }),
    borderLeft: tokenVariants({
      token: 'border',
      css: (value) => ({ borderLeft: value }),
    }),
    borderRadius: tokenVariants({
      token: 'radii',
      css: (value) => ({ borderRadius: value }),
    }),
    clearfix: {
      true: clearFix(),
    },
    shadow: tokenVariants({
      token: 'shadows',
      css: (value) => ({
        boxShadow: value,
        borderRadius: '$normal',
      }),
    }),
    zIndex: tokenVariants({
      token: 'zIndices',
      css: (value) => ({ zIndex: value }),
    }),
  },
});
