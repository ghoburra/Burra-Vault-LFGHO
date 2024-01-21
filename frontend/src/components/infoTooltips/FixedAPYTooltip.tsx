import { Trans } from '@lingui/macro';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { Link } from '../primitives/Link';
import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';

type FixedToolTipProps = TextWithTooltipProps;

export const FixedAPYTooltipText = (
  <Trans>
    The interest Rate For GHO minted by this Facilitator is custom,{' '}
    If market price is {'>'} than 1$ the rate will be smaller, otherwise, bigger.
  </Trans>
);

export const FixedAPYTooltip = (props: FixedToolTipProps) => {
  return (
    <TextWithTooltip
      event={{
        eventName: GENERAL.TOOL_TIP,
        eventParams: { tooltip: 'GHO APY' },
      }}
      {...props}
    >
      {FixedAPYTooltipText}
    </TextWithTooltip>
  );
};
