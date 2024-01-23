import { WAD_RAY_RATIO } from '@aave/math-utils';
import { BigNumber, ethers } from 'ethers';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { erc20Abi } from 'src/store/abis/erc20';

import { GHO_ABI, VAULT_ABI } from './abis';
// @ts-ignore
import { ArbitrageVault, GhoToken } from './typechain-types';

export const useBurra = () => {
  const { provider } = useWeb3Context();

  const GHO = '0x3308ff248A0Aa6EB7499A39C4c26ADF526825B0d';
  const VAULT = '0xdEC90AA22d77af136588F54F44ec66492409D740';

  const WAD = 1000000000000000000;

  const [ghoContract, setGhoContract] = useState<any>();
  const [vaultContract, setVaultContract] = useState<any>();
  const [listedBurraPerUser, setListedBurraPerUser] = useState<any>();
  const [userPositionData, setUserPositionData] = useState<{
    interestStrategy: any;
    deposit: any;
    burraOwned: any;
    ghoOwned: any;
    totalDebt: any;
    ghoOwnedInDollar: any;
    debtInDollars: any;
  }>();
  const [bucketCap, setBucketCapacity] = useState<{ cap: number; level: number }>();
  const [currentRate, setCurrentRate] = useState<number>();
  const [price, setCurrentPrice] = useState<number>();
  const [collateralData, setCollateralData] = useState<{
    symbol: string;
    name: string;
    address: string;
    balance: string | number;
  }>();
  const [error, setError] = useState('');
  const { currentAccount } = useWeb3Context();

  useEffect(() => {
    const initializeContracts = async () => {
      try {
        // Replace 'GhoToken' and 'GHO_ABI' with your actual contract name and ABI
        const ghoContract: any = new ethers.Contract(
          GHO,
          GHO_ABI,
          provider
        ) as unknown as any;

        setGhoContract(ghoContract);
        const vault: any = new ethers.Contract(
          VAULT,
          VAULT_ABI,
          provider
        ) as unknown as any;

        setGhoContract(ghoContract);
        setVaultContract(vault);
      } catch (err) {
        console.error('Error initializing GHO contract:', err.message);
        setError('Error initializing GHO contract');
      }
    };

    initializeContracts();
  }, []); // Run the effect only once on component mount

  const getCollateralContract = (collateralAddress: string) => {
    const contract = new ethers.Contract(collateralAddress, erc20Abi, provider);
    return contract;
  };
  const buildApproveCollateralTx = useCallback(
    (amount: string, asset: string) => {
      if (ghoContract) {
        const collateral = getCollateralContract(asset);
        const spenderAddress = vaultContract?.address;
        const amountToApprove = ethers.constants.MaxUint256;

        // const amountToApprove = ethers.utils.parseUnits(amount, 'ether');
        const encodedTransaction = collateral.interface.encodeFunctionData('approve', [
          spenderAddress,
          amountToApprove,
        ]);

        const tx = {
          from: currentAccount,
          to: asset,
          data: encodedTransaction,
        };
        return tx;
      }
    },
    [currentAccount, ghoContract]
  );
  const buildBorrowGHOTx = useCallback(
    (amount: string) => {
      if (vaultContract) {
        const am = ethers.utils.parseUnits(amount, 'ether');
        const encodedTransaction = vaultContract?.interface.encodeFunctionData('borrowGho', [am]);
        const tx = {
          from: currentAccount,
          to: vaultContract?.address,
          data: encodedTransaction,
        };
        return tx;
      }
    },
    [currentAccount, vaultContract]
  );
  const buildRepayTx = useCallback(
    (amount: string) => {
      if (vaultContract) {
        const am = ethers.utils.parseUnits(amount, 'ether');
        const encodedTransaction = vaultContract?.interface.encodeFunctionData('repayGHO', [am]);
        const tx = {
          from: currentAccount,
          to: vaultContract?.address,
          data: encodedTransaction,
        };
        return tx;
      }
    },
    [currentAccount, vaultContract]
  );

  const buildListBurraTx = useCallback(
    (amount: string) => {
      if (vaultContract) {
        const am = ethers.utils.parseUnits(amount, 'ether');
        const encodedTransaction = vaultContract?.interface.encodeFunctionData('listBurra', [am]);
        const tx = {
          from: currentAccount,
          to: vaultContract?.address,
          data: encodedTransaction,
        };
        return tx;
      }
    },
    [currentAccount, vaultContract]
  );

  // need to return:
  // Interest strategy for user OK
  // collateral OK
  // burra tokens OK
  // gho tokens borrowed
  useEffect(() => {
    const fetchData = async () => {
      if (vaultContract) {
        console.log(currentAccount);
        const interestStrategy = await vaultContract?.getInterestStrategyForUser(currentAccount);
        const deposit = await vaultContract?.getDepositForUser(currentAccount);
        const burraOwned = await vaultContract?.balanceOf(currentAccount);
        const ghoOwned = await ghoContract?.balanceOf(currentAccount);
        const ghoMarketPrice = await vaultContract?.getGHOMarketPrice();

        const totalDebt = Number(await vaultContract?.getDebtToPay(currentAccount, deposit)) / WAD;
        const totalDebtInDollars =
          (Number(await vaultContract?.getDebtToPay(currentAccount, deposit)) *
            Number(ghoMarketPrice)) /
          WAD;
        // debugger

        const rate = Number(interestStrategy.rate) / WAD;
        const depositBase10 = Number(deposit) / WAD;
        const burraOwnedBase10 = Number(burraOwned) / WAD;
        const ghoOwnedBase10 = Number(ghoOwned) / WAD;
        const ghoOwnedInDollarBase10 = (Number(ghoMarketPrice) / WAD) * (Number(ghoOwned) / WAD);

        // const depositDollarBase10 = (Number(ghoMarketPrice) / WAD) * (Number(totalDebt) / WAD)
        setUserPositionData({
          interestStrategy: { rate },
          deposit: depositBase10,
          burraOwned: burraOwnedBase10,
          ghoOwned: ghoOwnedBase10,
          ghoOwnedInDollar: ghoOwnedInDollarBase10,
          totalDebt,
          debtInDollars: totalDebtInDollars,
        });
      }
    };

    fetchData();
  }, [vaultContract, currentAccount]);

  useEffect(() => {
    const getBucketCapacity = async () => {
      if (vaultContract) {
        const capacity = await ghoContract?.getFacilitatorBucket(vaultContract.address);
        if (capacity) {
          const cap = Number(capacity[0]) / WAD;
          const level = Number(capacity[1]) / WAD;
          setBucketCapacity({
            cap,
            level,
          });
        }
      }
    };

    getBucketCapacity();
  }, [vaultContract, currentAccount]);

  useEffect(() => {
    const getUnderlyingData = async () => {
      const DAI_ADDRESS = '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357'; // our vault accept DAI
      const coll = getCollateralContract(DAI_ADDRESS);
      const symbol = await coll.symbol();
      const name = await coll.name();
      const balance = (Number(await coll.balanceOf(currentAccount)) / WAD).toString();

      setCollateralData({
        symbol,
        name,
        address: DAI_ADDRESS,
        balance,
      });
    };

    getUnderlyingData();
  }, [vaultContract, currentAccount]);

  useEffect(() => {
    const getAllListedBurra = async () => {
      const filters = vaultContract?.filters.BurraListed();
      let evs;
      if (filters) evs = await vaultContract?.queryFilter(filters, 5121116);
      const grouped = _.groupBy(evs, 'args.owner');

      const listedPerUser = Object.keys(grouped).map((k: any) => {
        return {
          owner: k,
          amount: _.sumBy(Object.values(grouped[k]).map((x: any) => Number(x.args.amount) / WAD)),
        };
      });

      setListedBurraPerUser(listedPerUser);
    };

    // if (vaultContract)
    getAllListedBurra();
  }, [vaultContract, currentAccount]);

  useEffect(() => {
    const getCurrentRate = async () => {
      const rate = Number(await vaultContract?.getBorrowRate()) / WAD;
      setCurrentRate(rate);
    };

    if (vaultContract) getCurrentRate();
  }, [vaultContract, currentAccount]);

  useEffect(() => {
    const getCurrentPrice = async () => {
      const price = Number(await vaultContract?.getGHOMarketPrice()) / WAD;
      setCurrentPrice(price);
    };

    if (vaultContract) getCurrentPrice();
  }, [vaultContract, currentAccount]);

  return {
    buildApproveCollateralTx,
    buildBorrowGHOTx,
    buildRepayTx,
    buildListBurraTx,
    listedBurraPerUser,
    userPositionData,
    bucketCap,
    collateralData,
    ghoContract,
    vaultContract,
    currentRate,
    error,
    VAULT,
    GHO,
    price,
    WAD,
  };
};
