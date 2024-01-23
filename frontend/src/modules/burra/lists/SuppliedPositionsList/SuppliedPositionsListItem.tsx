import { Trans } from '@lingui/macro';
import { Button } from '@mui/material';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useBurra } from 'src/hooks/burra/useBurra';
import { useAssetCaps } from 'src/hooks/useAssetCaps';
import { useModalContext } from 'src/hooks/useModal';
import { useRootStore } from 'src/store/root';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { ListColumn } from '../../../../components/lists/ListColumn';
import { useProtocolDataContext } from '../../../../hooks/useProtocolDataContext';
import { isFeatureEnabled } from '../../../../utils/marketsAndNetworksConfig';
import { ListAPRColumn } from '../ListAPRColumn';
import { ListButtonsColumn } from '../ListButtonsColumn';
import { ListItemUsedAsCollateral } from '../ListItemUsedAsCollateral';
import { ListItemWrapper } from '../ListItemWrapper';
import { ListValueColumn } from '../ListValueColumn';

export const SuppliedPositionsListItem = ({}: // reserve,
// underlyingBalance,
// underlyingBalanceUSD,
// usageAsCollateralEnabledOnUser,
// underlyingAsset,
any) => {
  const { user } = useAppDataContext();
  // const { isIsolated, aIncentivesData, isFrozen, isActive, isPaused } = reserve;
  const { currentMarketData, currentMarket } = useProtocolDataContext();
  const { debtCeiling } = useAssetCaps();
  const isSwapButton = isFeatureEnabled.liquiditySwap(currentMarketData);
  const trackEvent = useRootStore((store) => store.trackEvent);
  const { userPositionData, collateralData } = useBurra();

  // const canBeEnabledAsCollateral =
  //   !debtCeiling.isMaxed &&
  //   reserve.reserveLiquidationThreshold !== '0' &&
  //   ((!reserve.isIsolated && !user.isInIsolationMode) ||
  //     user.isolatedReserve?.underlyingAsset === reserve.underlyingAsset ||
  //     (reserve.isIsolated && user.totalCollateralMarketReferenceCurrency === '0'));

  return (
    <ListItemWrapper
      symbol={collateralData?.symbol || 'DAI'}
      iconSymbol={'dai'}
      name={collateralData?.name || 'DAI'}
      detailsAddress={collateralData?.address || ''}
      currentMarket={currentMarket}
      frozen={false}
      paused={false}
      data-cy={'Collateral'}
      showSupplyCapTooltips={false}
      showDebtCeilingTooltips={false}
    >
      <ListValueColumn
        symbol={'/icons/tokens/dai.svg'}
        value={userPositionData?.deposit}
        subValue={userPositionData?.deposit}
        disabled={userPositionData?.deposit === 0}
      />

      <ListAPRColumn value={0} incentives={undefined} symbol={'DAI'} />

      <ListColumn>
        <ListItemUsedAsCollateral
          disabled={true}
          isIsolated={false}
          usageAsCollateralEnabledOnUser={false}
          canBeEnabledAsCollateral={true}
          onToggleSwitch={() => alert('to be impl')}
          data-cy={`collateralStatus`}
        />
      </ListColumn>

      <ListButtonsColumn>
        <Button disabled={true}>
          <Trans>Withdraw</Trans>
        </Button>
      </ListButtonsColumn>
    </ListItemWrapper>
  );
};
