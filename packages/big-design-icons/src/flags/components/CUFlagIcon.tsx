// **********************************
// Auto-generated file, do NOT modify
// **********************************
import React, { forwardRef, memo } from 'react';

import { PrivateIconProps } from '../../base';
import { useUniqueId } from '../../utils';
import { createStyledFlagIcon, FlagIconProps } from '../base';

const FlagIcon: React.FC<FlagIconProps & PrivateIconProps> = ({ svgRef, title = 'CU flag', theme, ...props }) => {
  const uniqueTitleId = useUniqueId('icon');
  const titleId = title ? props.titleId || uniqueTitleId : undefined;
  const ariaHidden = titleId ? undefined : true;

  return (
    <svg viewBox="0 0 640 480" aria-hidden={ariaHidden} ref={svgRef} aria-labelledby={titleId} {...props}>
      {title ? <title id={titleId}>{title}</title> : null}
      <defs>
        <clipPath id="CUFlagIcon__a">
          <path fillOpacity={0.7} d="M-32 0h682.7v512H-32z" />
        </clipPath>
      </defs>
      <g fillRule="evenodd" clipPath="url(#CUFlagIcon__a)" transform="translate(30) scale(.94)">
        <path fill="#0050f0" d="M-32 0h768v512H-32z" />
        <path fill="#fff" d="M-32 102.4h768v102.4H-32zm0 204.8h768v102.4H-32z" />
        <path fill="#ed0000" d="M-32 0l440.7 255.7L-32 511V0z" />
        <path
          fill="#fff"
          d="M161.8 325.5L114.3 290l-47.2 35.8 17.6-58.1-47.2-36 58.3-.4 18.1-58 18.5 57.8 58.3.1-46.9 36.3 18 58z"
        />
      </g>
    </svg>
  );
};

const FlagIconWithForwardedRef = forwardRef<SVGSVGElement, FlagIconProps>((iconProps, ref) => (
  <FlagIcon {...iconProps} svgRef={ref} />
));

export const CUFlagIcon = memo(createStyledFlagIcon(FlagIconWithForwardedRef as React.FC<FlagIconProps>));

CUFlagIcon.displayName = 'CUFlagIcon';
