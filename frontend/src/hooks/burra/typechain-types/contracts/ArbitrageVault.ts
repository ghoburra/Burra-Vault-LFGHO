/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export declare namespace ArbitrageVault {
  export type InterestStrategyStruct = {
    start_block: BigNumberish;
    rate: BigNumberish;
  };

  export type InterestStrategyStructOutput = [
    start_block: bigint,
    rate: bigint
  ] & { start_block: bigint; rate: bigint };
}

export interface ArbitrageVaultInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "allowance"
      | "approve"
      | "asset"
      | "balanceOf"
      | "borrowGho"
      | "calculateAPY"
      | "convertToAssets"
      | "convertToShares"
      | "decimals"
      | "deposit"
      | "getBorrowRate"
      | "getDebtToPay"
      | "getDepositForUser"
      | "getGHOMarketPrice"
      | "getInterestRate"
      | "getInterestRateAtPrice"
      | "getInterestStrategyForUser"
      | "getListedBurra"
      | "getShareToken"
      | "gho"
      | "listBurra"
      | "maxDeposit"
      | "maxMint"
      | "maxRedeem"
      | "maxWithdraw"
      | "mint"
      | "name"
      | "previewDeposit"
      | "previewMint"
      | "previewRedeem"
      | "previewWithdraw"
      | "priceConsumerV3"
      | "redeem"
      | "repayGHO"
      | "symbol"
      | "totalAssets"
      | "totalSupply"
      | "transfer"
      | "transferFrom"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Approval"
      | "BurraListed"
      | "Deposit"
      | "GHOBorrowed"
      | "GHORepaid"
      | "Transfer"
      | "Withdraw"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "allowance",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "asset", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "borrowGho",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateAPY",
    values: [BigNumberish, ArbitrageVault.InterestStrategyStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "convertToAssets",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "convertToShares",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getBorrowRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDebtToPay",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getDepositForUser",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getGHOMarketPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getInterestRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getInterestRateAtPrice",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getInterestStrategyForUser",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getListedBurra",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getShareToken",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "gho", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "listBurra",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "maxDeposit",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "maxMint",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "maxRedeem",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "maxWithdraw",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "previewDeposit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "previewMint",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "previewRedeem",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "previewWithdraw",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "priceConsumerV3",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [BigNumberish, AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "repayGHO",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalAssets",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish, AddressLike, AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "asset", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "borrowGho", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "calculateAPY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "convertToAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "convertToShares",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getBorrowRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDebtToPay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDepositForUser",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getGHOMarketPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInterestRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInterestRateAtPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInterestStrategyForUser",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getListedBurra",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getShareToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "gho", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "listBurra", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxDeposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxMint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxRedeem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "maxWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "previewDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "previewMint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "previewRedeem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "previewWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "priceConsumerV3",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "repayGHO", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace ApprovalEvent {
  export type InputTuple = [
    owner: AddressLike,
    spender: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [owner: string, spender: string, value: bigint];
  export interface OutputObject {
    owner: string;
    spender: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BurraListedEvent {
  export type InputTuple = [owner: AddressLike, amount: BigNumberish];
  export type OutputTuple = [owner: string, amount: bigint];
  export interface OutputObject {
    owner: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DepositEvent {
  export type InputTuple = [
    sender: AddressLike,
    owner: AddressLike,
    assets: BigNumberish,
    shares: BigNumberish
  ];
  export type OutputTuple = [
    sender: string,
    owner: string,
    assets: bigint,
    shares: bigint
  ];
  export interface OutputObject {
    sender: string;
    owner: string;
    assets: bigint;
    shares: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace GHOBorrowedEvent {
  export type InputTuple = [
    borrower: AddressLike,
    amount: BigNumberish,
    discountStrategy: BigNumberish
  ];
  export type OutputTuple = [
    borrower: string,
    amount: bigint,
    discountStrategy: bigint
  ];
  export interface OutputObject {
    borrower: string;
    amount: bigint;
    discountStrategy: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace GHORepaidEvent {
  export type InputTuple = [
    borrower: AddressLike,
    amount: BigNumberish,
    totalPaidInDollars: BigNumberish
  ];
  export type OutputTuple = [
    borrower: string,
    amount: bigint,
    totalPaidInDollars: bigint
  ];
  export interface OutputObject {
    borrower: string;
    amount: bigint;
    totalPaidInDollars: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferEvent {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [from: string, to: string, value: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawEvent {
  export type InputTuple = [
    sender: AddressLike,
    receiver: AddressLike,
    owner: AddressLike,
    assets: BigNumberish,
    shares: BigNumberish
  ];
  export type OutputTuple = [
    sender: string,
    receiver: string,
    owner: string,
    assets: bigint,
    shares: bigint
  ];
  export interface OutputObject {
    sender: string;
    receiver: string;
    owner: string;
    assets: bigint;
    shares: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface ArbitrageVault extends BaseContract {
  connect(runner?: ContractRunner | null): ArbitrageVault;
  waitForDeployment(): Promise<this>;

  interface: ArbitrageVaultInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  allowance: TypedContractMethod<
    [owner: AddressLike, spender: AddressLike],
    [bigint],
    "view"
  >;

  approve: TypedContractMethod<
    [spender: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  asset: TypedContractMethod<[], [string], "view">;

  balanceOf: TypedContractMethod<[account: AddressLike], [bigint], "view">;

  borrowGho: TypedContractMethod<
    [depositAmount: BigNumberish],
    [void],
    "nonpayable"
  >;

  calculateAPY: TypedContractMethod<
    [amount: BigNumberish, strategy: ArbitrageVault.InterestStrategyStruct],
    [bigint],
    "view"
  >;

  convertToAssets: TypedContractMethod<
    [shares: BigNumberish],
    [bigint],
    "view"
  >;

  convertToShares: TypedContractMethod<
    [assets: BigNumberish],
    [bigint],
    "view"
  >;

  decimals: TypedContractMethod<[], [bigint], "view">;

  deposit: TypedContractMethod<
    [assets: BigNumberish, receiver: AddressLike],
    [bigint],
    "nonpayable"
  >;

  getBorrowRate: TypedContractMethod<[], [bigint], "view">;

  getDebtToPay: TypedContractMethod<
    [borrower: AddressLike, nominalAmount: BigNumberish],
    [bigint],
    "view"
  >;

  getDepositForUser: TypedContractMethod<[user: AddressLike], [bigint], "view">;

  getGHOMarketPrice: TypedContractMethod<[], [bigint], "view">;

  getInterestRate: TypedContractMethod<[], [bigint], "view">;

  getInterestRateAtPrice: TypedContractMethod<
    [ghoPrice: BigNumberish],
    [bigint],
    "view"
  >;

  getInterestStrategyForUser: TypedContractMethod<
    [user: AddressLike],
    [ArbitrageVault.InterestStrategyStructOutput],
    "view"
  >;

  getListedBurra: TypedContractMethod<[owner: AddressLike], [bigint], "view">;

  getShareToken: TypedContractMethod<[], [string], "view">;

  gho: TypedContractMethod<[], [string], "view">;

  listBurra: TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;

  maxDeposit: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  maxMint: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  maxRedeem: TypedContractMethod<[owner: AddressLike], [bigint], "view">;

  maxWithdraw: TypedContractMethod<[owner: AddressLike], [bigint], "view">;

  mint: TypedContractMethod<
    [shares: BigNumberish, receiver: AddressLike],
    [bigint],
    "nonpayable"
  >;

  name: TypedContractMethod<[], [string], "view">;

  previewDeposit: TypedContractMethod<[assets: BigNumberish], [bigint], "view">;

  previewMint: TypedContractMethod<[shares: BigNumberish], [bigint], "view">;

  previewRedeem: TypedContractMethod<[shares: BigNumberish], [bigint], "view">;

  previewWithdraw: TypedContractMethod<
    [assets: BigNumberish],
    [bigint],
    "view"
  >;

  priceConsumerV3: TypedContractMethod<[], [string], "view">;

  redeem: TypedContractMethod<
    [shares: BigNumberish, receiver: AddressLike, owner: AddressLike],
    [bigint],
    "nonpayable"
  >;

  repayGHO: TypedContractMethod<
    [nominalAmount: BigNumberish],
    [void],
    "nonpayable"
  >;

  symbol: TypedContractMethod<[], [string], "view">;

  totalAssets: TypedContractMethod<[], [bigint], "view">;

  totalSupply: TypedContractMethod<[], [bigint], "view">;

  transfer: TypedContractMethod<
    [to: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferFrom: TypedContractMethod<
    [from: AddressLike, to: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  withdraw: TypedContractMethod<
    [assets: BigNumberish, receiver: AddressLike, owner: AddressLike],
    [bigint],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "allowance"
  ): TypedContractMethod<
    [owner: AddressLike, spender: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<
    [spender: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "asset"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "borrowGho"
  ): TypedContractMethod<[depositAmount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "calculateAPY"
  ): TypedContractMethod<
    [amount: BigNumberish, strategy: ArbitrageVault.InterestStrategyStruct],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "convertToAssets"
  ): TypedContractMethod<[shares: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "convertToShares"
  ): TypedContractMethod<[assets: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "decimals"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<
    [assets: BigNumberish, receiver: AddressLike],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getBorrowRate"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getDebtToPay"
  ): TypedContractMethod<
    [borrower: AddressLike, nominalAmount: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getDepositForUser"
  ): TypedContractMethod<[user: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getGHOMarketPrice"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getInterestRate"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getInterestRateAtPrice"
  ): TypedContractMethod<[ghoPrice: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getInterestStrategyForUser"
  ): TypedContractMethod<
    [user: AddressLike],
    [ArbitrageVault.InterestStrategyStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getListedBurra"
  ): TypedContractMethod<[owner: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getShareToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "gho"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "listBurra"
  ): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "maxDeposit"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxMint"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxRedeem"
  ): TypedContractMethod<[owner: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxWithdraw"
  ): TypedContractMethod<[owner: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "mint"
  ): TypedContractMethod<
    [shares: BigNumberish, receiver: AddressLike],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "previewDeposit"
  ): TypedContractMethod<[assets: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "previewMint"
  ): TypedContractMethod<[shares: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "previewRedeem"
  ): TypedContractMethod<[shares: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "previewWithdraw"
  ): TypedContractMethod<[assets: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "priceConsumerV3"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "redeem"
  ): TypedContractMethod<
    [shares: BigNumberish, receiver: AddressLike, owner: AddressLike],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "repayGHO"
  ): TypedContractMethod<[nominalAmount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "symbol"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "totalAssets"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "totalSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transfer"
  ): TypedContractMethod<
    [to: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferFrom"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [assets: BigNumberish, receiver: AddressLike, owner: AddressLike],
    [bigint],
    "nonpayable"
  >;

  getEvent(
    key: "Approval"
  ): TypedContractEvent<
    ApprovalEvent.InputTuple,
    ApprovalEvent.OutputTuple,
    ApprovalEvent.OutputObject
  >;
  getEvent(
    key: "BurraListed"
  ): TypedContractEvent<
    BurraListedEvent.InputTuple,
    BurraListedEvent.OutputTuple,
    BurraListedEvent.OutputObject
  >;
  getEvent(
    key: "Deposit"
  ): TypedContractEvent<
    DepositEvent.InputTuple,
    DepositEvent.OutputTuple,
    DepositEvent.OutputObject
  >;
  getEvent(
    key: "GHOBorrowed"
  ): TypedContractEvent<
    GHOBorrowedEvent.InputTuple,
    GHOBorrowedEvent.OutputTuple,
    GHOBorrowedEvent.OutputObject
  >;
  getEvent(
    key: "GHORepaid"
  ): TypedContractEvent<
    GHORepaidEvent.InputTuple,
    GHORepaidEvent.OutputTuple,
    GHORepaidEvent.OutputObject
  >;
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
  >;
  getEvent(
    key: "Withdraw"
  ): TypedContractEvent<
    WithdrawEvent.InputTuple,
    WithdrawEvent.OutputTuple,
    WithdrawEvent.OutputObject
  >;

  filters: {
    "Approval(address,address,uint256)": TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    Approval: TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;

    "BurraListed(address,uint256)": TypedContractEvent<
      BurraListedEvent.InputTuple,
      BurraListedEvent.OutputTuple,
      BurraListedEvent.OutputObject
    >;
    BurraListed: TypedContractEvent<
      BurraListedEvent.InputTuple,
      BurraListedEvent.OutputTuple,
      BurraListedEvent.OutputObject
    >;

    "Deposit(address,address,uint256,uint256)": TypedContractEvent<
      DepositEvent.InputTuple,
      DepositEvent.OutputTuple,
      DepositEvent.OutputObject
    >;
    Deposit: TypedContractEvent<
      DepositEvent.InputTuple,
      DepositEvent.OutputTuple,
      DepositEvent.OutputObject
    >;

    "GHOBorrowed(address,uint256,uint256)": TypedContractEvent<
      GHOBorrowedEvent.InputTuple,
      GHOBorrowedEvent.OutputTuple,
      GHOBorrowedEvent.OutputObject
    >;
    GHOBorrowed: TypedContractEvent<
      GHOBorrowedEvent.InputTuple,
      GHOBorrowedEvent.OutputTuple,
      GHOBorrowedEvent.OutputObject
    >;

    "GHORepaid(address,uint256,uint256)": TypedContractEvent<
      GHORepaidEvent.InputTuple,
      GHORepaidEvent.OutputTuple,
      GHORepaidEvent.OutputObject
    >;
    GHORepaid: TypedContractEvent<
      GHORepaidEvent.InputTuple,
      GHORepaidEvent.OutputTuple,
      GHORepaidEvent.OutputObject
    >;

    "Transfer(address,address,uint256)": TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;

    "Withdraw(address,address,address,uint256,uint256)": TypedContractEvent<
      WithdrawEvent.InputTuple,
      WithdrawEvent.OutputTuple,
      WithdrawEvent.OutputObject
    >;
    Withdraw: TypedContractEvent<
      WithdrawEvent.InputTuple,
      WithdrawEvent.OutputTuple,
      WithdrawEvent.OutputObject
    >;
  };
}
