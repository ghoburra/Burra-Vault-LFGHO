import { ApproveDelegationType, InterestRate } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { BoxProps } from '@mui/material';
import React, { useState } from 'react';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useBurra } from 'src/hooks/burra/useBurra';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';

import { TxActionsWrapper } from '../TxActionsWrapper';

export interface BorrowActionsProps extends BoxProps {
  poolReserve: ComputedReserveData;
  amountToBorrow: string;
  poolAddress: string;
  interestRateMode: InterestRate;
  isWrongNetwork: boolean;
  symbol: string;
  blocked: boolean;
}

export const BorrowActionsBurra = React.memo(
  ({
    symbol,
    amountToBorrow,
    isWrongNetwork,
    blocked,
    sx,
  }: BorrowActionsProps) => {
    const [
      getGHOContract,
      getVaultContract,
      getCollateralContract,
      estimateGasLimit,
      getSigner,
      addTransaction,
    ] = useRootStore((state) => [
      state.getGHOContract,
      state.getVaultContract,
      state.getCollateralContract,
      state.estimateGasLimit,
      state.getSigner,
      state.addTransaction,
    ]);
    const {
      approvalTxState,
      mainTxState,
      loadingTxns,
      setMainTxState,
      setTxError,
      setGasLimit,
      setLoadingTxns,
      setApprovalTxState,
    } = useModalContext();
    const { sendTx } = useWeb3Context();
    const [requiresApproval, setRequiresApproval] = useState<boolean>(false);
    const [approvedAmount, setApprovedAmount] = useState<ApproveDelegationType | undefined>();
    const { buildApproveCollateralTx, buildBorrowGHOTx } = useBurra();

    const approval = async () => {
      try {
        const DAI_ADDRESS = '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357';
        const tx = buildApproveCollateralTx(amountToBorrow, DAI_ADDRESS);
        if (tx) {
          const gasLimitedTx = await estimateGasLimit(tx);
          const response = await sendTx(gasLimitedTx);
          await response.wait(1);
          setApprovalTxState({
            txHash: response.hash,
            loading: false,
            success: true,
          });
        }
        // }
        // fetchApprovedAmount(true);
      } catch (error) {
        const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
        setTxError(parsedError);
        setApprovalTxState({
          txHash: undefined,
          loading: false,
        });
      }
    };

    const action = async () => {
      const ghotkn = getGHOContract();
      const vaultContract = getVaultContract();

      try {
        setMainTxState({ ...mainTxState, loading: true });
        await approval();

        const tx = buildBorrowGHOTx(amountToBorrow);

        if (tx) {
          const gasLimitedTx = await estimateGasLimit(tx);
          const response = await sendTx(gasLimitedTx);
          await response.wait(1);
          setMainTxState({
            txHash: response.hash,
            loading: false,
            success: true,
          });

          addTransaction(response.hash, {
            action: 'Vault Borrow GHO',
            txState: 'success',
            asset: ghotkn.address,
            amount: amountToBorrow,
            assetName: 'GHO',
          });
        }

        // queryClient.invalidateQueries({ queryKey: queryKeysFactory.pool });
        // refetchPoolData && refetchPoolData();
        // refetchIncentiveData && refetchIncentiveData();
        // refetchGhoData && refetchGhoData();
      } catch (error) {
        const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
        setTxError(parsedError);
        setMainTxState({
          txHash: undefined,
          loading: false,
        });
      }
    };

    return (
      <TxActionsWrapper
        blocked={blocked}
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        requiresAmount={true}
        amount={amountToBorrow}
        isWrongNetwork={isWrongNetwork}
        handleAction={action}
        actionText={<Trans>Borrow {symbol}</Trans>}
        actionInProgressText={<Trans>Borrowing {symbol}</Trans>}
        handleApproval={() => approval()}
        requiresApproval={requiresApproval}
        preparingTransactions={loadingTxns}
        sx={sx}
      />
    );
  }
);
