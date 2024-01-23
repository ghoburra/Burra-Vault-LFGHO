import { InterestRate } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { BoxProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useBurra } from 'src/hooks/burra/useBurra';
import { SignedParams } from 'src/hooks/useApprovalTx';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';

import { TxActionsWrapper } from '../TxActionsWrapper';
import { checkRequiresApproval } from '../utils';

export interface RepayActionProps extends BoxProps {
  amountToRepay: string;
  poolReserve?: ComputedReserveData;
  isWrongNetwork: boolean;
  customGasPrice?: string;
  poolAddress?: string;
  symbol: string;
  debtType?: InterestRate;
  repayWithATokens?: boolean;
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
  const { VAULT, ghoContract } = useBurra();
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
    setSuccessTx
  } = useModalContext();
  const { currentAccount } = useWeb3Context();
  const [requiresPermission, setRequiresPermission] = useState(false);

  const { buildApproveCollateralTx, buildRepayTx, userPositionData, GHO } = useBurra();

  const approval = async () => {
    try {
      const needAllowance = await checkNeedAllowance()
      if (!needAllowance) return
      const GHO_ADDRESS = GHO;
      const tx = buildApproveCollateralTx('10000000000000000000000000000', GHO_ADDRESS);
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

  const action = async () => {
    try {
      setSuccessTx(false)
      setMainTxState({ ...mainTxState, loading: true });
      await approval();
      const tx = buildRepayTx(amountToRepay);
      if (tx) {
        const estimatedTx = await estimateGasLimit(tx);
        const response = await sendTx(estimatedTx);
        await response.wait(1);

        setMainTxState({
          txHash: response.hash,
          loading: false,
          success: true,
        });
        addTransaction(response.hash, {
          txState: 'success',
          asset: VAULT,
          amount: amountToRepay,
          assetName: symbol,
        });
        setSuccessTx(true)
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
  const checkNeedAllowance = async () => {
    if (ghoContract) {
      const allowance = await ghoContract?.allowance(currentAccount, VAULT)
      const needAllowance: boolean =
       Number(allowance) < Number(amountToRepay)*1000000000000000000;
      return needAllowance
    }
  };
  return (
    <TxActionsWrapper
      blocked={false}
      preparingTransactions={loadingTxns}
      symbol={'GHO'}
      mainTxState={mainTxState}
      approvalTxState={approvalTxState}
      requiresAmount
      amount={amountToRepay}
      requiresApproval={false}
      isWrongNetwork={isWrongNetwork}
      sx={sx}
      {...props}
      handleAction={action}
      handleApproval={approval}
      actionText={<Trans>Repay GHO</Trans>}
      actionInProgressText={<Trans>Repaying GHO</Trans>}
      tryPermit={false}
    />
  );
};
