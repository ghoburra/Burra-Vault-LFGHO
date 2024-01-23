import { ChainId } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { ROUTES } from 'src/components/primitives/Link';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { AUTH } from 'src/utils/mixPanelEvents';

import { BorrowAssetsList } from './lists/BorrowAssetsList/BorrowAssetsList';
import { BorrowedPositionsList } from './lists/BorrowedPositionsList/BorrowedPositionsList';
import { BurraBorrowedPositionsList } from './lists/BurraPositionsList/BurraBorrowedPositionsList';
import { SuppliedPositionsList } from './lists/SuppliedPositionsList/SuppliedPositionsList';
import { SupplyAssetsList } from './lists/SupplyAssetsList/SupplyAssetsList';
import { SupplyAssetsListModified } from './lists/SupplyAssetsList/SupplyAssetsListModified';

interface BurraContentWrapperProps {
  isBorrow: boolean;
}

export const BurraContentWrapper = ({ isBorrow }: BurraContentWrapperProps) => {
  const { breakpoints } = useTheme();
  const { currentAccount } = useWeb3Context();
  const router = useRouter();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const isDesktop = useMediaQuery(breakpoints.up('lg'));
  const paperWidth = isDesktop ? 'calc(50% - 8px)' : '100%';

  const downToLg = useMediaQuery(breakpoints.down('lg'));

  const upFromSm = useMediaQuery(breakpoints.up('xsm'));

  return (
    <Box>
      {currentMarketData.chainId === ChainId.polygon && !currentMarketData.v3}
      <Box
        sx={{
          display: isDesktop ? 'flex' : 'block',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            position: 'relative',

            display: { xs: isBorrow ? 'none' : 'block', lg: 'block' },
            width: paperWidth,
          }}
        >
          {currentAccount && !isBorrow && downToLg && (
            <Box>
              <Button
                sx={{
                  position: 'absolute',
                  top: upFromSm ? '-60px' : '-90px',
                  right: '0px',
                }}
                onClick={() => {
                  router.push(ROUTES.history);
                  trackEvent(AUTH.VIEW_TX_HISTORY);
                }}
                component="a"
                variant="surface"
                size="small"
              >
                <Trans>View Transactions</Trans>
              </Button>
            </Box>
          )}

          {/* 
            asset user supplied --> need to change in assset user deposited
            
          */}
          <SuppliedPositionsList />

          {/* 
          asset user can supply 
          need to remove the supply button since DAI is deposited at mint time
          */}
          <SupplyAssetsListModified />
        </Box>

        <Box
          sx={{
            position: 'relative',

            display: { xs: !isBorrow ? 'none' : 'block', lg: 'block' },
            width: paperWidth,
          }}
        >
          {currentAccount && (
            <Box
              sx={{
                position: 'absolute',

                top: upFromSm ? '-60px' : '-90px',

                right: '0px',
              }}
            >
              <Button
                onClick={() => {
                  router.push(ROUTES.history);
                  trackEvent(AUTH.VIEW_TX_HISTORY);
                }}
                component="a"
                variant="surface"
                size="small"
              >
                <Trans>View Transactions</Trans>
              </Button>
            </Box>
          )}
          {/*  should change, just call the contract to see how many GHO the user have borrowed */}
          <BorrowedPositionsList />
          <BurraBorrowedPositionsList />

          {/*  just leave GHO here */}
          <BorrowAssetsList />
        </Box>
      </Box>
    </Box>
  );
};
