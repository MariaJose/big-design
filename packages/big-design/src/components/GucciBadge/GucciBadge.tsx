import { VariantProps } from '@stitches/react';
import React, { HTMLAttributes, memo } from 'react';

import { StyledGucciBadge } from './styled';

type StyledVariants = VariantProps<typeof StyledGucciBadge>;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, StyledVariants {
  label: string;
}

export const GucciBadge: React.FC<BadgeProps> = memo(({ className, style, label, ...props }) =>
  typeof label === 'string' ? <StyledGucciBadge {...props}>{label}</StyledGucciBadge> : null,
);

GucciBadge.displayName = 'Badge';
