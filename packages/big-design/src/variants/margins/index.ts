import { css } from '@bigcommerce/big-design-theme/stitches';

import { tokenVariants } from '../../utils';

export const marginVariants = css({
  variants: {
    margin: tokenVariants({ token: 'space', css: (value) => ({ margin: value }) }),
    marginTop: tokenVariants({ token: 'space', css: (value) => ({ marginTop: value }) }),
    marginRight: tokenVariants({ token: 'space', css: (value) => ({ marginRight: value }) }),
    marginBottom: tokenVariants({ token: 'space', css: (value) => ({ marginBottom: value }) }),
    marginLeft: tokenVariants({ token: 'space', css: (value) => ({ marginLeft: value }) }),
    marginHorizontal: tokenVariants({
      token: 'space',
      css: (value) => ({
        marginLeft: value,
        marginRight: value,
      }),
    }),
    marginVertical: tokenVariants({
      token: 'space',
      css: (value) => ({
        marginTop: value,
        marginBottom: value,
      }),
    }),
  },
});
