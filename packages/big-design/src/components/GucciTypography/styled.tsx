import { css, styled } from '@bigcommerce/big-design-theme/stitches';
import { ellipsis } from 'polished';

import { tokenVariants } from '../../utils';
import { marginVariants } from '../../variants';

const commonTextStyles = css({
  margin: '0 0 $medium',

  variants: {
    color: tokenVariants({ token: 'colors', css: (value) => ({ color: value }) }),
    ellipsis: {
      true: ellipsis(),
    },
  },
});

const textModifiers = css({
  variants: {
    bold: {
      true: {
        fontWeight: '$semiBold',
      },
    },
    italic: {
      true: {
        fontStyle: 'italic',
      },
    },
    underline: {
      true: {
        textDecoration: 'underline',
      },
    },
    strikethrough: {
      true: {
        textDecoration: 'line-through',
      },
    },
    capitalize: {
      true: {
        textTransform: 'capitalize',
      },
    },
    uppercase: {
      true: {
        textTransform: 'uppercase',
      },
    },
    lowercase: {
      true: {
        textTransform: 'lowercase',
      },
    },
  },
});

export const StyledH0 = styled(
  'h1',
  commonTextStyles,
  {
    fontSize: '$xxxLarge',
    fontWeight: '$extraLight',
    lineHeight: '$xxxLarge',
    margin: '0 0 $xLarge',
  },
  marginVariants,
);

export const StyledH1 = styled(
  'h1',
  commonTextStyles,
  {
    fontSize: '$xxLarge',
    fontWeight: '$light',
    lineHeight: '$xxLarge',
    margin: '0 0 $xLarge',
  },
  marginVariants,
);

export const StyledH2 = styled(
  'h2',
  commonTextStyles,
  {
    fontSize: '$xLarge',
    fontWeight: '$regular',
    lineHeight: '$xLarge',
  },
  marginVariants,
);

export const StyledH3 = styled(
  'h3',
  commonTextStyles,
  {
    fontSize: '$large',
    fontWeight: '$semiBold',
    lineHeight: '$large',
    margin: '0 0 $small',
  },
  marginVariants,
);

export const StyledH4 = styled(
  'h4',
  commonTextStyles,
  {
    fontSize: '$medium',
    fontWeight: '$semiBold',
    lineHeight: '$medium',
    margin: '0 0 $xSmall',
  },
  marginVariants,
);

export const StyledText = styled(
  'p',
  commonTextStyles,
  textModifiers,
  {
    fontSize: '$medium',
    fontWeight: '$regular',
    lineHeight: '$medium',
    margin: '0 0 $xSmall',

    '&:last-child': {
      marginBottom: 0,
    },
  },
  marginVariants,
);

export const StyledSmall = styled(
  'p',
  textModifiers,
  {
    color: '$secondary60',
    fontSize: '$small',
    fontWeight: '$regular',
    lineHeight: '$small',
    margin: '0 0 $small',

    '&:last-child': {
      marginBottom: 0,
    },
  },
  commonTextStyles,
  marginVariants,
);

export const StyledHR = styled(
  'hr',
  {
    border: 0,
    borderBottom: '1px solid $secondary30',

    variants: {
      color: tokenVariants({
        token: 'colors',
        css: (value) => ({
          borderBottomColor: value,
        }),
      }),
    },
  },
  marginVariants,
);
