import { styled } from '@bigcommerce/big-design-theme/stitches';

import { marginVariants } from '../../variants';

export const StyledGucciBadge = styled('span', marginVariants, {
  color: '$white',
  borderRadius: '$normal',
  display: 'inline-block',
  fontSize: '.75rem', // TODO: remCalc(12)
  fontWeight: '$semiBold',
  lineHeight: '$small',
  textAlign: 'center',
  textTransform: 'uppercase',
  padding: '0 $xSmall',

  variants: {
    variant: {
      danger: {
        backgroundColor: '$danger40',
      },
      secondary: {
        backgroundColor: '$secondary60',
      },
      success: {
        backgroundColor: '$success50',
      },
      primary: {
        backgroundColor: '$primary40',
      },
      warning: {
        color: '$secondary70',
        backgroundColor: '$warning40',
      },
    },
  },

  defaultVariants: {
    variant: 'secondary',
  },
});
