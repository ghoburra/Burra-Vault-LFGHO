import { Trans } from '@lingui/macro';

import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';

export const CollateralSwitchTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>
       This is the asset you supplied the facilitator with to borrow GHO. this would generate the APY here.
      </Trans>
    </TextWithTooltip>
  );
};
