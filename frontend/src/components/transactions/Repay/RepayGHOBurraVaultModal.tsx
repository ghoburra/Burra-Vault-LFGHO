import { InterestRate, PERMISSION } from '@aave/contract-helpers';
import React, { useState } from 'react';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { RepayType } from './RepayTypeSelector';
import { ModalWrapper } from '../FlowCommons/ModalWrapper';
import { Trans } from '@lingui/macro';
import { ModalWrapperIndie } from '../FlowCommons/ModalWrapperIndie';
import { RepayModalContentBurraV2 } from './RepayModalContentBurraV2';
import { AssetInputBurra } from '../AssetInputBurra';

export const RepayGHOBurraVaultModal = () => {
  const { type, close, args, mainTxState } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
    currentRateMode: InterestRate;
    isFrozen: boolean;
  }>;
  const [repayType, setRepayType] = useState(RepayType.BALANCE);



  const handleClose = () => {
    setRepayType(RepayType.BALANCE);
    close();
  };
  return (
    <BasicModal open={type === ModalType.RepayGHOBurraVault} setOpen={handleClose}>
      <></>
      <ModalWrapperIndie
        title={<Trans>Repay GHO</Trans>}
        underlyingAsset={args.underlyingAsset}
        requiredPermission={PERMISSION.BORROWER}
      >
        {(params) => {
          return (
            <RepayModalContentBurraV2 {...params} debtType={InterestRate.Stable} />
          );
        }}
      </ModalWrapperIndie>
    </BasicModal>
  );
};
