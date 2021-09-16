import { css } from '@bigcommerce/big-design-theme/stitches';

import { tokenVariants } from '../../utils';

export const paddingVariants = css({
  variants: {
    padding: tokenVariants({ token: 'space', css: (value) => ({ padding: value }) }),
    paddingTop: tokenVariants({ token: 'space', css: (value) => ({ paddingTop: value }) }),
    paddingRight: tokenVariants({ token: 'space', css: (value) => ({ paddingRight: value }) }),
    paddingBottom: tokenVariants({ token: 'space', css: (value) => ({ paddingBottom: value }) }),
    paddingLeft: tokenVariants({ token: 'space', css: (value) => ({ paddingLeft: value }) }),
    paddingHorizontal: tokenVariants({
      token: 'space',
      css: (value) => ({
        paddingLeft: value,
        paddingRight: value,
      }),
    }),
    paddingVertical: tokenVariants({
      token: 'space',
      css: (value) => ({
        paddingTop: value,
        paddingBottom: value,
      }),
    }),
  },
});
