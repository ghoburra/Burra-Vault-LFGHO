import { InterestRate } from '@aave/contract-helpers';
import { InformationCircleIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, Button, SvgIcon, useMediaQuery, useTheme } from '@mui/material';
import { ContentWithTooltip } from 'src/components/ContentWithTooltip';
import { GhoIncentivesCard } from 'src/components/incentives/GhoIncentivesCard';
import { FixedAPYTooltipText } from 'src/components/infoTooltips/FixedAPYTooltip';
import { ROUTES } from 'src/components/primitives/Link';
import { Row } from 'src/components/primitives/Row';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';
import { CustomMarket } from 'src/ui-config/marketsConfig';
import { getMaxGhoMintAmount } from 'src/utils/getMaxAmountAvailableToBorrow';
import { weightedAverageAPY } from 'src/utils/ghoUtilities';
import { isFeatureEnabled } from 'src/utils/marketsAndNetworksConfig';

import { ListColumn } from '../../../../components/lists/ListColumn';
import {
  ComputedReserveData,
  ComputedUserReserveData,
  useAppDataContext,
} from '../../../../hooks/app-data-provider/useAppDataProvider';
import { ListButtonsColumn } from '../ListButtonsColumn';
import { ListItemWrapper } from '../ListItemWrapper';
import { ListMobileItemWrapper } from '../ListMobileItemWrapper';
import { ListValueColumn } from '../ListValueColumn';
import { ListValueRow } from '../ListValueRow';
import { useBurra } from 'src/hooks/burra/useBurra';

export const GhoBorrowedPositionsListItem = ({
  reserve,
  borrowRateMode,
}: ComputedUserReserveData & { borrowRateMode: InterestRate }) => {
  const { openBorrow, openRepay, openDebtSwitch } = useModalContext();
  const { currentMarket, currentMarketData } = useProtocolDataContext();
  const { ghoLoadingData, ghoReserveData, ghoUserData, user } = useAppDataContext();
  // const [ghoUserDataFetched, ghoUserQualifiesForDiscount] = useRootStore((store) => [
  //   store.ghoUserDataFetched,
  //   store.ghoUserQualifiesForDiscount,
  // ]);
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));
const {bucketCap} = useBurra()
  const discountableAmount =
    ghoUserData.userGhoBorrowBalance >= ghoReserveData.ghoMinDebtTokenBalanceForDiscount
      ? ghoUserData.userGhoAvailableToBorrowAtDiscount
      : 0;
  const borrowRateAfterDiscount = weightedAverageAPY(
    ghoReserveData.ghoVariableBorrowAPY,
    ghoUserData.userGhoBorrowBalance,
    discountableAmount,
    ghoReserveData.ghoBorrowAPYWithMaxDiscount
  );

  // const hasDiscount = ghoUserQualifiesForDiscount();

  // const { isActive, isFrozen, isPaused, borrowingEnabled } = reserve;
  const maxAmountUserCanMint = bucketCap?.level || 100

  const props: any = {
    userGhoBorrowBalance: ghoUserData.userGhoBorrowBalance,
    // hasDiscount,
    ghoLoadingData,
    // ghoUserDataFetched,
    borrowRateAfterDiscount,
    currentMarket,
    userDiscountTokenBalance: ghoUserData.userDiscountTokenBalance,
    borrowDisabled:false,
    showSwitchButton: false,
    onRepayClick: () =>
      openRepay(
        reserve.underlyingAsset,
        InterestRate.Stable,
        false,
        currentMarket,
        reserve.symbol,
        "dashboard"
      ),
    onBorrowClick: () =>
      openBorrow("0x8a4FcC53C2D19C69AEB51dfEF05a051d40927CE2", currentMarket, "GHO", 'dashboard'),
    onSwitchClick: () => openDebtSwitch(reserve.underlyingAsset, borrowRateMode),
  };

  if (downToXSM) {
    return <GhoBorrowedPositionsListItemMobile {...props} />;
  } else {
    return <GhoBorrowedPositionsListItemDesktop {...props} />;
  }
};

interface GhoBorrowedPositionsListItemProps {
  reserve: ComputedReserveData;
  borrowRateMode: InterestRate;
  userGhoBorrowBalance: number;
  hasDiscount: boolean;
  ghoLoadingData: boolean;
  ghoUserDataFetched: boolean;
  borrowRateAfterDiscount: number;
  currentMarket: CustomMarket;
  userDiscountTokenBalance: number;
  borrowDisabled: boolean;
  showSwitchButton: boolean;
  disableSwitch: boolean;
  disableRepay: boolean;
  onRepayClick: () => void;
  onBorrowClick: () => void;
  onSwitchClick: () => void;
}

const GhoBorrowedPositionsListItemDesktop = ({
  reserve,
  hasDiscount,
  currentMarket,
  userDiscountTokenBalance,
  onRepayClick,
  disableRepay,
}: GhoBorrowedPositionsListItemProps) => {
  // const { symbol, iconSymbol, name, isFrozen, underlyingAsset } = reserve;
  const {  userPositionData} = useBurra()

  return (
    <ListItemWrapper
      symbol={"GHO"}
      iconSymbol={"GHO"}
      name={"GHO"}
      detailsAddress={"underlyingAsset"}
      currentMarket={currentMarket}
      frozen={false}
      data-cy={`dashboardBorrowedListItem_${"GHO".toUpperCase()}_${"Stable"}`}
      showBorrowCapTooltips
    >
      <ListValueColumn
        symbol={"GHO"}
        value={userPositionData?.ghoOwned}
        subValue={userPositionData?.ghoOwnedInDollar}
      />
      <ListColumn>
        <GhoIncentivesCard
          withTokenIcon={hasDiscount}
          value={userPositionData?.interestStrategy.rate}
          data-cy={`apyType`}
          stkAaveBalance={userDiscountTokenBalance}
          ghoRoute={ROUTES.reserveOverview("underlyingAsset", currentMarket) + '/#discount'}
          userQualifiesForDiscount={hasDiscount}
        />
      </ListColumn>
      <ListColumn>
      
        <ContentWithTooltip tooltipContent={FixedAPYTooltipText} offset={[0, -4]} withoutHover>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            disabled
            data-cy={`apyButton_fixed`}
          >
            Custom Rate
            <SvgIcon sx={{ marginLeft: '2px', fontSize: '14px' }}>
              <InformationCircleIcon />
            </SvgIcon>
          </Button>
        </ContentWithTooltip>
      </ListColumn>
      <ListButtonsColumn>
        <Button disabled={disableRepay} variant="outlined" onClick={onRepayClick}>
          <Trans>Repay</Trans>
        </Button>
      </ListButtonsColumn>
    </ListItemWrapper>
  );
};

const GhoBorrowedPositionsListItemMobile = ({
  reserve,
  userGhoBorrowBalance,
  hasDiscount,
  ghoLoadingData,
  borrowRateAfterDiscount,
  currentMarket,
  userDiscountTokenBalance,
  onRepayClick,
  disableRepay,
}: GhoBorrowedPositionsListItemProps) => {
  const { symbol, iconSymbol, name } = reserve;

  return (
    <ListMobileItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      underlyingAsset={reserve.underlyingAsset}
      currentMarket={currentMarket}
      frozen={reserve.isFrozen}
      showBorrowCapTooltips
    >
      <ListValueRow
        title={<Trans>Debt</Trans>}
        value={userGhoBorrowBalance}
        subValue={userGhoBorrowBalance}
        disabled={userGhoBorrowBalance === 0}
      />
      <Row caption={<Trans>APY</Trans>} align="flex-start" captionVariant="description" mb={2}>
        <GhoIncentivesCard
          withTokenIcon={hasDiscount}
          value={ghoLoadingData ? -1 : borrowRateAfterDiscount}
          data-cy={`apyType`}
          stkAaveBalance={userDiscountTokenBalance}
          ghoRoute={ROUTES.reserveOverview(reserve.underlyingAsset, currentMarket) + '/#discount'}
          userQualifiesForDiscount={hasDiscount}
        />
      </Row>
      <Row caption={<Trans>APY type</Trans>} captionVariant="description" mb={2}>
        <ContentWithTooltip tooltipContent={FixedAPYTooltipText} offset={[0, -4]} withoutHover>
          <Button variant="outlined" size="small" color="primary">
            GHO RATE
            <SvgIcon sx={{ marginLeft: '2px', fontSize: '14px' }}>
              <InformationCircleIcon />
            </SvgIcon>
          </Button>
        </ContentWithTooltip>
      </Row>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 5 }}>
        {/* {showSwitchButton ? (
          <Button disabled={disableSwitch} variant="contained" fullWidth onClick={onSwitchClick}>
            <Trans>Switch</Trans>
          </Button>
        ) : (
          <Button disabled={borrowDisabled} variant="outlined" onClick={onBorrowClick} fullWidth>
            <Trans>Borrow</Trans>
          </Button>
        )} */}
        <Button
          disabled={disableRepay}
          variant="outlined"
          onClick={onRepayClick}
          sx={{ mr: 1.5 }}
          fullWidth
        >
          <Trans>Repay</Trans>
        </Button>
      </Box>
    </ListMobileItemWrapper>
  );
};
