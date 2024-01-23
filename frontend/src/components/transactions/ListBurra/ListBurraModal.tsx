import { InterestRate, PERMISSION } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import React, { useState } from 'react';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { AssetInputBurra } from '../AssetInputBurra';
import { ModalWrapper } from '../FlowCommons/ModalWrapper';
import { ModalWrapperIndie } from '../FlowCommons/ModalWrapperIndie';
import { ListBurraModalContentV2 } from './ListBurraModalContentV2';
import { RepayType } from './RepayTypeSelector';

export const ListBurraModal = () => {
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
    <BasicModal open={type === ModalType.ListBurraForSales} setOpen={handleClose}>
      <></>
      <ModalWrapperIndie
        title={<Trans>List Burra (BU) For Sale</Trans>}
        underlyingAsset={args.underlyingAsset}
        requiredPermission={PERMISSION.BORROWER}
      >
        {(params) => {
          return <ListBurraModalContentV2 {...params} debtType={InterestRate.Stable} />;
        }}
      </ModalWrapperIndie>
    </BasicModal>
  );
};
