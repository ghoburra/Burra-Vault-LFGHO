import { gasLimitRecommendations, InterestRate, ProtocolAction } from '@aave/contract-helpers';
import { TransactionResponse } from '@ethersproject/providers';
import { Trans } from '@lingui/macro';
import { BoxProps } from '@mui/material';
import { parseUnits } from 'ethers/lib/utils';
import { queryClient } from 'pages/_app.page';
import { useEffect, useState } from 'react';
import { useBackgroundDataProvider } from 'src/hooks/app-data-provider/BackgroundDataProvider';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { SignedParams, useApprovalTx } from 'src/hooks/useApprovalTx';
import { usePoolApprovedAmount } from 'src/hooks/useApprovedAmount';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { ApprovalMethod } from 'src/store/walletSlice';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';
import { queryKeysFactory } from 'src/ui-config/queries';

import { TxActionsWrapper } from '../TxActionsWrapper';
import { APPROVAL_GAS_LIMIT, checkRequiresApproval } from '../utils';
import { useBurra } from 'src/hooks/burra/useBurra';

export interface RepayActionProps extends BoxProps {
  amountToRepay: string;
  poolReserve: ComputedReserveData;
  isWrongNetwork: boolean;
  customGasPrice?: string;
  poolAddress: string;
  symbol: string;
  debtType: InterestRate;
  repayWithATokens: boolean;
  blocked?: boolean;
  maxApproveNeeded: string;
}

export const RepayActionsBurra = ({
  amountToRepay,
  poolReserve,
  poolAddress,
  isWrongNetwork,
  sx,
  symbol,
  debtType,
  repayWithATokens,
  blocked,
  maxApproveNeeded,
  ...props
}: RepayActionProps) => {
  const [
    repay,
    repayWithPermit,
    encodeRepayParams,
    encodeRepayWithPermit,
    tryPermit,
    walletApprovalMethodPreference,
    estimateGasLimit,
    addTransaction,
    optimizedPath,
    currentMarketData,
  ] = useRootStore((store) => [
    store.repay,
    store.repayWithPermit,
    store.encodeRepayParams,
    store.encodeRepayWithPermitParams,
    store.tryPermit,
    store.walletApprovalMethodPreference,
    store.estimateGasLimit,
    store.addTransaction,
    store.useOptimizedPath,
    store.currentMarketData,
  ]);
  const { sendTx } = useWeb3Context();
  // const { refetchGhoData, refetchIncentiveData, refetchPoolData } = useBackgroundDataProvider();
  const [signatureParams, setSignatureParams] = useState<SignedParams | undefined>();
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

  const {
    data: approvedAmount,
    refetch: fetchApprovedAmount,
    isFetching: fetchingApprovedAmount,
    isFetchedAfterMount,
  } = usePoolApprovedAmount(currentMarketData, poolAddress);

  const permitAvailable = tryPermit({
    reserveAddress: poolAddress,
    isWrappedBaseAsset: poolReserve.isWrappedBaseAsset,
  });
  const usePermit = permitAvailable && walletApprovalMethodPreference === ApprovalMethod.PERMIT;

  setLoadingTxns(fetchingApprovedAmount);

  const requiresApproval =
    !repayWithATokens &&
    Number(amountToRepay) !== 0 &&
    checkRequiresApproval({
      approvedAmount: approvedAmount?.amount || '0',
      amount: Number(amountToRepay) === -1 ? maxApproveNeeded : amountToRepay,
      signedAmount: signatureParams ? signatureParams.amount : '0',
    });

  if (requiresApproval && approvalTxState?.success) {
    // There was a successful approval tx, but the approval amount is not enough.
    // Clear the state to prompt for another approval.
    setApprovalTxState({});
  }

  const { buildApproveCollateralTx, buildListBurraTx, userPositionData } = useBurra()

  const approval = async () => {
    try {
      //need to approve burra to be transferred to others
      const BURRA_ADDRESS = "0x78A3022d16340412eCf82BAF5d5b6486CCc95869"
      const tx = buildApproveCollateralTx("10000000000000000000000000000", BURRA_ADDRESS)
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
    } catch (error) {
      const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
      setTxError(parsedError);
      setApprovalTxState({
        txHash: undefined,
        loading: false,
      });
    }
  };

  useEffect(() => {
    if (!isFetchedAfterMount && !repayWithATokens) {
      fetchApprovedAmount();
    }
  }, [fetchApprovedAmount, isFetchedAfterMount, repayWithATokens]);

  const action = async () => {
    try {
      setMainTxState({ ...mainTxState, loading: true });
      const tx = buildListBurraTx(amountToRepay)
      if (tx) {
        const estimatedTx = await estimateGasLimit(tx);
        const response = await sendTx(estimatedTx);
        await response.wait(1);
        await approval()
        setMainTxState({
          txHash: response.hash,
          loading: false,
          success: true,
        });
        addTransaction(response.hash, {
          txState: 'success',
          asset: poolAddress,
          amount: amountToRepay,
          assetName: symbol,
        });

      }
    } catch (error) {
      const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
      setTxError(parsedError);
      setMainTxState({
        txHash: undefined,
        loading: false,
      });
    }
  };



  // useEffect(() => {
  //   let supplyGasLimit = 0;
  //   if (usePermit) {
  //     supplyGasLimit = Number(gasLimitRecommendations[ProtocolAction.supplyWithPermit].recommended);
  //   } else {
  //     supplyGasLimit = Number(gasLimitRecommendations[ProtocolAction.supply].recommended);
  //     if (requiresApproval && !approvalTxState.success) {
  //       supplyGasLimit += Number(APPROVAL_GAS_LIMIT);
  //     }
  //   }
  //   setGasLimit(supplyGasLimit.toString());
  // }, [requiresApproval, approvalTxState, usePermit, setGasLimit]);

  return (
    <TxActionsWrapper
      blocked={blocked}
      preparingTransactions={loadingTxns || !approvedAmount}
      symbol={poolReserve.symbol}
      mainTxState={mainTxState}
      approvalTxState={approvalTxState}
      requiresAmount
      amount={amountToRepay}
      requiresApproval={requiresApproval}
      isWrongNetwork={isWrongNetwork}
      sx={sx}
      {...props}
      handleAction={action}
      handleApproval={approval}
      actionText={<Trans>List Burra (BU)</Trans>}
      actionInProgressText={<Trans>Listing Burra (BU)</Trans>}
      tryPermit={permitAvailable}
    />
  );
};
