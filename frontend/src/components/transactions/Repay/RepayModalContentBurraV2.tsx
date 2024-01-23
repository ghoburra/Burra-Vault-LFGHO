import { InterestRate } from '@aave/contract-helpers';
import { valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React, { useEffect, useRef, useState } from 'react';
import { useBurra } from 'src/hooks/burra/useBurra';
import { useModalContext } from 'src/hooks/useModal';

import { AssetInputBurraV2 } from '../AssetInputBurraV2';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';
import { TxSuccessView } from '../FlowCommons/Success';
import { DetailsNumberLineWithSub, TxModalDetails } from '../FlowCommons/TxModalDetails';
import { RepayActionsBurra } from './RepayActionsBurra';

export const RepayModalContentBurraV2 = ({}: { debtType: InterestRate }) => {
  const { gasLimit, mainTxState: repayTxState, txError } = useModalContext();
  const WAD = 1000000000000000000;

  const [repayMax, setRepayMax] = useState('');
  const [_amount, setAmount] = useState('');
  const amountRef = useRef<string>();
  const { userPositionData, price } = useBurra();

  const debt = userPositionData?.totalDebt;

  let maxAmountToRepay: BigNumber;

  const isMaxSelected = _amount === '-1';
  const amount = _amount;

  const handleChange = (value: string) => {
    const maxSelected = value === '-1';
    amountRef.current = maxSelected ? maxAmountToRepay.toString(10) : value;
    setAmount(value);
  };

  // token info
  useEffect(() => {
    console.log(
      'calculation:',
      'amount',
      amount,
      'price',
      price,
      'userPositionData?.debtInDollars',
      userPositionData?.debtInDollars
    );
    console.log('amount * price:', Number(amount) * Number(price));
    console.log(
      'calcolo:',
      Number(userPositionData?.debtInDollars) / WAD - Number(amount) * Number(price)
    );
  }, [amount]);

  const amountAfterRepay = valueToBigNumber(debt)
    .minus(amount || '0')
    .toString(10);

  const usdValue = price ? (Number(amount) * price).toString() : '100';

  if (repayTxState.success)
    return (
      <TxSuccessView action={<Trans>repaid</Trans>} amount={amountRef.current} symbol={'GHO'} />
    );

  return (
    <>
      <AssetInputBurraV2
        value={amount}
        inputTitle={'Input Titel (amount)'}
        onChange={handleChange}
        usdValue={usdValue.toString()}
        symbol={'GHO'}
        assets={[
          {
            symbol: 'GHO',
          },
        ]}
        isMaxSelected={isMaxSelected}
        balanceText={<Trans>Wallet balance</Trans>}
      />

      <TxModalDetails gasLimit={gasLimit}>
        <DetailsNumberLineWithSub
          description={<Trans>Remaining debt</Trans>}
          futureValue={amountAfterRepay}
          futureValueUSD={(
            Number(userPositionData?.debtInDollars) / WAD -
            Number(amount) * Number(price)
          ).toString()}
          value={debt}
          valueUSD={Number(userPositionData?.debtInDollars).toString()}
          symbol={'GHO'}
        />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <RepayActionsBurra
        maxApproveNeeded={'1000000000000000000'}
        amountToRepay={amount}
        isWrongNetwork={false}
        symbol={'GHO'}
      />
    </>
  );
};
