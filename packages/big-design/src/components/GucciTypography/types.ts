import { VariantProps } from '@stitches/react';
import React from 'react';

import { StyledH0, StyledHR, StyledText } from './styled';

export interface TextModifiers {
  bold?: boolean;
  capitalize?: boolean;
  italic?: boolean;
  lowercase?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  uppercase?: boolean;
}

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TextTag =
  | 'abbr'
  | 'b'
  | 'bdi'
  | 'bdo'
  | 'blockquote'
  | 'caption'
  | 'cite'
  | 'code'
  | 'em'
  | 'figcaption'
  | 'i'
  | 'label'
  | 'legend'
  | 'p'
  | 'pre'
  | 'q'
  | 's'
  | 'small'
  | 'span'
  | 'strong'
  | 'title';

export type TextProps = React.HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof StyledText> & {
    as?: TextTag;
  };

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof StyledH0> & {
    as?: HeadingTag;
  };

export type HRProps = React.HTMLAttributes<HTMLHRElement> & VariantProps<typeof StyledHR>;
