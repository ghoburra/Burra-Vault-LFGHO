import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";
import { GHO_ABI, VAULT_ABI } from "./abis";
import { ArbitrageVault, GhoToken } from "./typechain-types";
import { erc20Abi } from "src/store/abis/erc20";
import _ from "lodash";
import { WAD_RAY_RATIO } from "@aave/math-utils";


export const useBurra = () => {

  const { provider } = useWeb3Context();

  const GHO = "0x8a4FcC53C2D19C69AEB51dfEF05a051d40927CE2"
  const VAULT = "0x78A3022d16340412eCf82BAF5d5b6486CCc95869"
  const WAD = 1000000000000000000



  const [ghoContract, setGhoContract] = useState<GhoToken>();
  const [vaultContract, setVaultContract] = useState<ArbitrageVault>();
  const [listedBurraPerUser, setListedBurraPerUser] = useState<any>();
  const [userPositionData, setUserPositionData] = useState<{ interestStrategy: any, deposit: any, burraOwned: any, ghoOwned: any, totalDebt: any, ghoOwnedInDollar: any, debtInDollars: any }>();
  const [bucketCap, setBucketCapacity] = useState<{ cap: number, level: number }>();
  const [currentRate, setCurrentRate] = useState<number>();
  const [collateralData, setCollateralData] = useState<{ symbol: string, name: string, address: string, balance: string | number }>();
  const [error, setError] = useState("");
  const { currentAccount } = useWeb3Context();

  useEffect(() => {

    const initializeContracts = async () => {
      try {

        // Replace 'GhoToken' and 'GHO_ABI' with your actual contract name and ABI
        const ghoContract: GhoToken = new ethers.Contract(GHO, GHO_ABI, provider) as unknown as GhoToken;

        setGhoContract(ghoContract);
        const vault: ArbitrageVault = new ethers.Contract(VAULT, VAULT_ABI, provider) as unknown as ArbitrageVault

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
    return contract
  }
  const buildApproveCollateralTx = useCallback(
    (amount: string, asset: string) => {
      if (ghoContract) {

        const collateral = getCollateralContract(asset)
        const spenderAddress = vaultContract?.address;
        const amountToApprove = ethers.constants.MaxUint256

        // const amountToApprove = ethers.utils.parseUnits(amount, 'ether');
        const encodedTransaction = collateral.interface.encodeFunctionData('approve', [spenderAddress, amountToApprove]);

        const tx = {
          from: currentAccount,
          to: asset,
          data: encodedTransaction,
        }
        return tx
      }
    }, [currentAccount, ghoContract]
  )
  const buildBorrowGHOTx = useCallback(
    (amount: string) => {
      if (vaultContract) {
        const am = ethers.utils.parseUnits(amount, 'ether');
        const encodedTransaction = vaultContract?.interface.encodeFunctionData('borrowGho', [am]);
        let tx = {
          from: currentAccount,
          to: vaultContract?.address,
          data: encodedTransaction,
        }
        return tx
      }
    }, [currentAccount, vaultContract]
  )
  const buildRepayTx = useCallback(
    (amount: string) => {
      if (vaultContract) {
        const am = ethers.utils.parseUnits(amount, 'ether');
        const encodedTransaction = vaultContract?.interface.encodeFunctionData('repayGHO', [am]);
        let tx = {
          from: currentAccount,
          to: vaultContract?.address,
          data: encodedTransaction,
        }
        return tx
      }
    }, [currentAccount, vaultContract]
  )

  const buildListBurraTx = useCallback(
    (amount: string) => {
      if (vaultContract) {
        const am = ethers.utils.parseUnits(amount, 'ether');
        const encodedTransaction = vaultContract?.interface.encodeFunctionData('listBurra', [am]);
        let tx = {
          from: currentAccount,
          to: vaultContract?.address,
          data: encodedTransaction,
        }
        return tx
      }
    }, [currentAccount, vaultContract]
  )

  // need to return:
  // Interest strategy for user OK
  // collateral OK
  // burra tokens OK
  // gho tokens borrowed
  useEffect(() => {
    const fetchData = async () => {
      if (vaultContract) {
        console.log(currentAccount)
        const interestStrategy = await vaultContract?.getInterestStrategyForUser(currentAccount)
        const deposit = await vaultContract?.getDepositForUser(currentAccount)
        const burraOwned = await vaultContract?.balanceOf(currentAccount)
        const ghoOwned = await ghoContract?.balanceOf(currentAccount)
        const ghoMarketPrice = await vaultContract?.getGHOMarketPrice()

        const totalDebt = Number(await vaultContract?.getDebtToPay(currentAccount, deposit)) / WAD
        const totalDebtInDollars = (Number(await vaultContract?.getDebtToPay(currentAccount, deposit)) * Number(ghoMarketPrice)) / WAD
        // debugger

        const rate = (Number(interestStrategy.rate) / WAD)
        const depositBase10 = Number(deposit) / WAD
        const burraOwnedBase10 = Number(burraOwned) / WAD
        const ghoOwnedBase10 = Number(ghoOwned) / WAD
        const ghoOwnedInDollarBase10 = (Number(ghoMarketPrice) / WAD) * (Number(ghoOwned) / WAD)


        // const depositDollarBase10 = (Number(ghoMarketPrice) / WAD) * (Number(totalDebt) / WAD)
        setUserPositionData({
          interestStrategy: { rate }, deposit: depositBase10, burraOwned: burraOwnedBase10, ghoOwned: ghoOwnedBase10, ghoOwnedInDollar: ghoOwnedInDollarBase10, totalDebt, debtInDollars: totalDebtInDollars
        })
      }

    }

    fetchData()

  }, [vaultContract, currentAccount])

  useEffect(() => {
    const getBucketCapacity = async () => {
      if (vaultContract) {
        const capacity = await ghoContract?.getFacilitatorBucket(vaultContract.address)
        if (capacity) {
          const cap = Number(capacity[0]) / 10000000000000000
          const level = Number(capacity[1]) / 10000000000000000
          setBucketCapacity({
            cap,
            level
          })

        }
      }

    }

    getBucketCapacity()


  }, [vaultContract, currentAccount])

  useEffect(() => {
    const getUnderlyingData = async () => {
      const DAI_ADDRESS = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357" // our vault accept DAI
      const coll = getCollateralContract(DAI_ADDRESS)
      const symbol = await coll.symbol()
      const name = await coll.name()
      const balance = (Number(await coll.balanceOf(currentAccount)) / 10000000000000000).toString()

      setCollateralData({
        symbol, name, address: DAI_ADDRESS, balance
      })
    }

    getUnderlyingData()


  }, [vaultContract, currentAccount])

  useEffect(() => {
    const getAllListedBurra = async () => {
      const filters = vaultContract?.filters.BurraListed()
      let evs;
      if (filters)
        evs = await vaultContract?.queryFilter(filters, 5121116)
      const grouped = _.groupBy(evs, "args.owner")

      const listedPerUser = Object.keys(grouped).map((k: string) => {
        return {
          owner: k,
          amount: grouped[k].reduce((prv: any, cur: any) => Number(cur.args.amount) / WAD, 0)

        }
      })
      console.log("listedPerUser", listedPerUser)
      setListedBurraPerUser(listedPerUser)

    }

    // if (vaultContract)
      getAllListedBurra()


  }, [vaultContract, currentAccount])


  useEffect(() => {
    const getCurrentRate = async () => {
      const rate = Number(await vaultContract?.getBorrowRate()) / WAD
      setCurrentRate(rate)
    }

    if (vaultContract)
      getCurrentRate()


  }, [vaultContract, currentAccount])







  return { buildApproveCollateralTx, buildBorrowGHOTx, buildRepayTx, buildListBurraTx, listedBurraPerUser, userPositionData, bucketCap, collateralData, ghoContract, vaultContract, currentRate, error };


};
