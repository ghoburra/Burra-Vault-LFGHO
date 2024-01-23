import {
  InterestRate,
  LendingPool,
  Pool,
  PoolBaseCurrencyHumanized,
  ReserveDataHumanized,
  ReservesIncentiveDataHumanized,
  UserReserveDataHumanized,
} from '@aave/contract-helpers';
import { LPBorrowParamsType } from '@aave/contract-helpers/dist/esm/lendingPool-contract/lendingPoolTypes';
import { Contract, ethers } from 'ethers';
import { StateCreator } from 'zustand';

import { erc20Abi } from './abis/erc20';
import { ghoTokenAbi } from './abis/ghoToken';
import { vaultAbi } from './abis/vault';
import { RootStore } from './root';

// TODO: what is the better name for this type?
export type PoolReserve = {
  reserves?: ReserveDataHumanized[];
  reserveIncentives?: ReservesIncentiveDataHumanized[];
  baseCurrencyData?: PoolBaseCurrencyHumanized;
  userEmodeCategoryId?: number;
  userReserves?: UserReserveDataHumanized[];
};

type RepayArgs = {
  amountToRepay: string;
  poolAddress: string;
  debtType: InterestRate;
  repayWithATokens: boolean;
  encodedTxData?: string;
};

type GenerateApprovalOpts = {
  chainId?: number;
};

type GenerateSignatureRequestOpts = {
  chainId?: number;
};

// TODO: add chain/provider/account mapping
export interface BurraSlice {
  burraBorrow: () => any;
  getGHOContract: () => Contract;
  getVaultContract: () => Contract;
  getCollateralContract: (collateralAddress: string) => Contract;
  getSigner: () => string;
}

export const createBurraSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  BurraSlice
> = (set, get) => {
  return {
    getGHOContract() {
      const provdr = get().jsonRpcProvider();
      const GHO_TOKEN_ADDRESS = '0xb16bd090F562eF9A93a47F2a52A649cCbf70c39A';

      const contract = new ethers.Contract(GHO_TOKEN_ADDRESS, ghoTokenAbi, provdr);

      return contract;
    },
    getVaultContract() {
      const provdr = get().jsonRpcProvider();
      const VAULT_ADDRESS = '0x7C2590FaCDcdeCF63d759CA321F0F95C6a53b4Bf';

      const contract = new ethers.Contract(VAULT_ADDRESS, vaultAbi, provdr);

      return contract;
    },
    getCollateralContract(collateralAddress: string) {
      const provdr = get().jsonRpcProvider();

      const contract = new ethers.Contract(collateralAddress, erc20Abi, provdr);

      return contract;
    },
    getSigner: () => {
      return get().account;
    },
    burraBorrow: () => {
      // const ghoToken = get().getBurraGhoToken()

      console.log('to be implemented');
    },
  };
};
