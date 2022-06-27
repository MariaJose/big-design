import { theme as defaultTheme } from '@bigcommerce/big-design-theme';
import styled from 'styled-components';

import { withTransition } from '../../../mixins/transitions';

interface StyledTableRowProps {
  isDragging: boolean;
  isSelected: boolean;
}

export const StyledTableRow = styled.tr<StyledTableRowProps>`
  ${withTransition(['background-color'])}
  display: ${({ isDragging }) => (isDragging ? 'table' : 'table-row')};

  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary10 : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary10};
  }
`;

export const StyledExpandedIcon = styled.button`
  color: ${({ theme }) => theme.colors.secondary60};
  background-color: transparent;
  border-color: transparent;
  padding: 0;
`;

StyledTableRow.defaultProps = { theme: defaultTheme };
StyledExpandedIcon.defaultProps = { theme: defaultTheme };
