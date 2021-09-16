import { css } from '@bigcommerce/big-design-theme/stitches';

export const cssDisplay = css({
  variants: {
    display: {
      block: {
        display: 'block',
      },
      'inline-block': {
        display: 'inline-block',
      },
      inline: {
        display: 'inline',
      },
      'inline-flex': {
        display: 'inline-flex',
      },
      flex: {
        display: 'flex',
      },
      grid: {
        display: 'grid',
      },
      'inline-grid': {
        display: 'inline-grid',
      },
      none: {
        display: 'none',
      },
    },
  },
});
