import { CloseIcon } from '@bigcommerce/big-design-icons';
import { VariantProps } from '@stitches/react';
import focusTrap, { FocusTrap } from 'focus-trap';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useUniqueId } from '../../hooks';
import { typedMemo } from '../../utils';
import { Button, ButtonProps } from '../Button';
import { MessagingButton } from '../Button/private';
import { H2 } from '../Typography';

import {
  StyledModal,
  StyledModalActions,
  StyledModalBody,
  StyledModalClose,
  StyledModalContent,
  StyledModalHeader,
} from './styled';

type StyledModalVariants = VariantProps<typeof StyledModal>;
type StyledModalActionsVariants = VariantProps<typeof StyledModalActions>;
type StyledModalBodyVariants = VariantProps<typeof StyledModalBody>;
type StyledModalCloseVariants = VariantProps<typeof StyledModalClose>;
type StyledModalContentVariants = VariantProps<typeof StyledModalContent>;
type StyledModalHeaderVariants = VariantProps<typeof StyledModalHeader>;

export interface ModalAction extends StyledModalActionsVariants, Omit<ButtonProps, 'children'> {
  text?: string;
}

export interface ModalProps
  extends StyledModalVariants,
    StyledModalActionsVariants,
    StyledModalBodyVariants,
    StyledModalCloseVariants,
    StyledModalContentVariants,
    StyledModalHeaderVariants {
  actions?: ModalAction[];
  closeOnClickOutside?: boolean;
  closeOnEscKey?: boolean;
  header?: string;
  isOpen?: boolean;
  onClose?(): void;
}

export const GucciModal: React.FC<ModalProps> = typedMemo((props) => {
  const [modalContainer, setModalContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = document.createElement('div');

    document.body.appendChild(container);
    setModalContainer(container);
  }, []);

  useEffect(() => {
    return () => {
      if (modalContainer) {
        document.body.removeChild(modalContainer);
      }
    };
  }, [modalContainer]);

  return props.isOpen && modalContainer ? createPortal(<InternalModal {...props} />, modalContainer) : null;
});

const InternalModal: React.FC<ModalProps> = ({
  actions,
  backdrop = true,
  children,
  closeOnClickOutside = false,
  closeOnEscKey = true,
  header,
  onClose = () => null,
  variant = 'modal',
}) => {
  const initialBodyOverflowYRef = useRef('');
  const internalTrap = useRef<FocusTrap | null>(null);
  const headerUniqueId = useUniqueId('modal_header');
  const [modalRef, setModalRef] = useState<HTMLDivElement | null>(null);

  const onClickAway = (event: React.MouseEvent) => {
    if (closeOnClickOutside && modalRef === event.target) {
      onClose();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (closeOnEscKey && event.key === 'Escape') {
      onClose();
    }
  };

  // Disable scroll on body when modal is open
  useEffect(() => {
    initialBodyOverflowYRef.current = document.body.style.overflowY || '';
    document.body.style.overflowY = 'hidden';

    return () => {
      document.body.style.overflowY = initialBodyOverflowYRef.current;
    };
  }, []);

  // Setup focus-trap
  useEffect(() => {
    if (modalRef && internalTrap.current === null) {
      internalTrap.current = focusTrap(modalRef as HTMLElement, { fallbackFocus: modalRef });
      internalTrap.current.activate();
    }

    return () => {
      internalTrap.current?.deactivate();
    };
  }, [internalTrap, modalRef]);

  const renderedClose = useMemo(
    () =>
      variant === 'modal' && (
        <StyledModalClose>
          <MessagingButton onClick={onClose} iconOnly={<CloseIcon title="Close" />} />
        </StyledModalClose>
      ),
    [onClose, variant],
  );

  const renderedHeader = useMemo(
    () =>
      header &&
      typeof header === 'string' && (
        <StyledModalHeader id={headerUniqueId}>
          <H2 margin="none">{header}</H2>
        </StyledModalHeader>
      ),
    [header, headerUniqueId],
  );

  const renderedActions = useMemo(
    () =>
      Array.isArray(actions) && (
        <StyledModalActions justifyContent="flex-end">
          {actions.map(({ text, onClick, ...props }, index) => (
            <Button
              key={index}
              {...props}
              onClick={(event) => {
                internalTrap.current?.deactivate();

                if (typeof onClick === 'function') {
                  onClick(event);
                }
              }}
            >
              {text}
            </Button>
          ))}
        </StyledModalActions>
      ),
    [actions],
  );

  return (
    <StyledModal
      aria-modal={true}
      backdrop={backdrop}
      onClick={onClickAway}
      onKeyDown={onKeyDown}
      ref={setModalRef}
      role="dialog"
      variant={variant}
      tabIndex={-1}
    >
      <StyledModalContent variant={variant} aria-labelledby={headerUniqueId} flexDirection="column">
        {renderedClose}
        {renderedHeader}
        <StyledModalBody>{children}</StyledModalBody>
        {renderedActions}
      </StyledModalContent>
    </StyledModal>
  );
};
