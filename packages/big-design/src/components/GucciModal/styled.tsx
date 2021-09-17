import { colors } from '@bigcommerce/big-design-theme/src/system/colors';
import { styled } from '@bigcommerce/big-design-theme/stitches';
import { rgba } from 'polished';

import { Flex } from '../Flex';

export const StyledModal = styled('div', {
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  left: 0,
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: '$modalBackdrop',

  variants: {
    variant: {
      dialog: {},
      modal: {},
    },
    backdrop: { true: {} },
  },

  compoundVariants: [
    {
      backdrop: true,
      variant: 'dialog',
      css: {
        background: rgba(colors.secondary70, 0.5), //TODO: Check how to do this with stitches.
      },
    },
    {
      backdrop: true,
      variant: 'modal',
      css: {
        background: rgba(colors.secondary70, 0.7), //TODO: Check how to do this with stitches.
      },
    },
  ],
});

export const StyledModalContent = styled(Flex, {
  background: '$white',
  boxSizing: 'border-box',
  position: 'fixed',
  zIndex: '$modal',

  variants: {
    variant: {
      dialog: {
        boxShadow: '$floating',
        borderRadius: '$normal',
        maxWidth: '$tablet',
        width: '90%',
      },
      modal: {
        height: '100%',
        width: '100%',
        '@tablet': {
          boxShadow: '$floating',
          borderRadius: '$normal',
          height: 'auto',
          maxHeight: '90vh',
          maxWidth: '$tablet',
        },
        '@desktop': {
          maxHeight: '80vh',
        },
      },
    },
  },
});

// TODO: Add GucciFlex component.
export const StyledModalActions = styled(Flex, {
  padding: '$medium',

  '@tablet': {
    padding: '$xLarge',
  },
});

export const StyledModalHeader = styled('div', {
  padding: '$medium',

  '@tablet': {
    padding: '$xLarge',
  },
});

export const StyledModalClose = styled('div', {
  position: 'absolute',
  top: '$xxSmall',
  right: '$xxSmall',

  '@tablet': {
    display: 'none',
  },
});

export const StyledModalBody = styled('div', {
  flexGrow: 1,
  padding: '0 $medium',
  overflowY: 'auto',

  '@tablet': {
    padding: '0 $xLarge',
  },
});
