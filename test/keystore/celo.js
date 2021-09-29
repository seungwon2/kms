const {
  CeloProvider,
  celoAllowedTransactionKeys,
  serializeCeloTransaction,
} = require("@celo-tools/celo-ethers-wrapper");

const { serializeError } = require("@ledgerhq/errors");
const { ethers, providers } = require("ethers");
const { BigNumber } = require("bignumber.js");

// for staking
const { newKit } = require("@celo/contractkit");

const {
  createKeyStore,
  getAccount,
  getMnemonic,
  CHAIN,
  signTxFromKeyStore,
  MNEMONIC,
} = require("./_getAccount");

const TYPE = CHAIN.CELO;
const INDEX = 0;

// /* transaction send
async function sendTx(signedTx) {
  const provider = new CeloProvider("https://alfajores-forno.celo-testnet.org");
  const result = await provider.sendTransaction(signedTx.serializedTx);
  const temp = await result.wait();
  console.log("sendTxResult: ", temp);
}
// */

async function getData(address) {
  const rgABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "beneficiary",
          type: "address",
        },
      ],
      name: "BeneficiarySet",
      type: "event",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },

    {
      constant: false,
      inputs: [
        {
          internalType: "address payable",
          name: "newBeneficiary",
          type: "address",
        },
      ],
      name: "setBeneficiary",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "withdraw",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "refundAndFinalize",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "revoke",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "expire",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getTotalBalance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getRemainingTotalBalance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getRemainingUnlockedBalance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getRemainingLockedBalance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getCurrentReleasedTotalAmount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
      name: "lockGold",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
      name: "unlockGold",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "index", type: "uint256" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "relockGold",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
      name: "withdrawLockedGold",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address payable", name: "signer", type: "address" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "authorizeVoteSigner",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "string", name: "name", type: "string" },
        { internalType: "bytes", name: "dataEncryptionKey", type: "bytes" },
        { internalType: "address", name: "walletAddress", type: "address" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "setAccount",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "createAccount",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "string", name: "name", type: "string" }],
      name: "setAccountName",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "walletAddress", type: "address" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "setAccountWalletAddress",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "bytes", name: "dataEncryptionKey", type: "bytes" },
      ],
      name: "setAccountDataEncryptionKey",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "string", name: "metadataURL", type: "string" }],
      name: "setAccountMetadataURL",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "group", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
        { internalType: "address", name: "lesser", type: "address" },
        { internalType: "address", name: "greater", type: "address" },
        { internalType: "uint256", name: "index", type: "uint256" },
      ],
      name: "revokeActive",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "group", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
        { internalType: "address", name: "lesser", type: "address" },
        { internalType: "address", name: "greater", type: "address" },
        { internalType: "uint256", name: "index", type: "uint256" },
      ],
      name: "revokePending",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const lgABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "slashed",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "penalty",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "reporter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "reward",
          type: "uint256",
        },
      ],
      name: "AccountSlashed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "GoldLocked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "GoldRelocked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "available",
          type: "uint256",
        },
      ],
      name: "GoldUnlocked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "GoldWithdrawn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "registryAddress",
          type: "address",
        },
      ],
      name: "RegistrySet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "string",
          name: "slasherIdentifier",
          type: "string",
        },
      ],
      name: "SlasherWhitelistAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "string",
          name: "slasherIdentifier",
          type: "string",
        },
      ],
      name: "SlasherWhitelistRemoved",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "period",
          type: "uint256",
        },
      ],
      name: "UnlockingPeriodSet",
      type: "event",
    },
    {
      constant: true,
      inputs: [],
      name: "initialized",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "isOwner",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "registry",
      outputs: [
        { internalType: "contract IRegistry", name: "", type: "address" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "registryAddress", type: "address" },
      ],
      name: "setRegistry",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "slashingWhitelist",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalNonvoting",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "unlockingPeriod",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "slasher", type: "address" }],
      name: "isSlasher",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getVersionNumber",
      outputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      payable: false,
      stateMutability: "pure",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "registryAddress", type: "address" },
        { internalType: "uint256", name: "_unlockingPeriod", type: "uint256" },
      ],
      name: "initialize",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
      name: "setUnlockingPeriod",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "lock",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "incrementNonvotingAccountBalance",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "decrementNonvotingAccountBalance",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
      name: "unlock",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "index", type: "uint256" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "relock",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
      name: "withdraw",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getTotalLockedGold",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getNonvotingLockedGold",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "getAccountTotalLockedGold",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "getAccountNonvotingLockedGold",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "getPendingWithdrawals",
      outputs: [
        { internalType: "uint256[]", name: "", type: "uint256[]" },
        { internalType: "uint256[]", name: "", type: "uint256[]" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "getTotalPendingWithdrawals",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getSlashingWhitelist",
      outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "string", name: "slasherIdentifier", type: "string" },
      ],
      name: "addSlasher",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "string", name: "slasherIdentifier", type: "string" },
        { internalType: "uint256", name: "index", type: "uint256" },
      ],
      name: "removeSlasher",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256", name: "penalty", type: "uint256" },
        { internalType: "address", name: "reporter", type: "address" },
        { internalType: "uint256", name: "reward", type: "uint256" },
        { internalType: "address[]", name: "lessers", type: "address[]" },
        { internalType: "address[]", name: "greaters", type: "address[]" },
        { internalType: "uint256[]", name: "indices", type: "uint256[]" },
      ],
      name: "slash",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const rgIface = new ethers.utils.Interface(rgABI);
  const lgIface = new ethers.utils.Interface(lgABI);
  // const data = rgIface.encodeFunctionData("transfer", [address, 1]);
  const data = lgIface.encodeFunctionData("lock");
  // const data = lgIface.encodeFunctionData("");

  return data;
  // console.log(33, releaseGoldContract.functions);
}

async function signTx(path, keyStore, password, to) {
  let response;
  const data = await getData(to);
  const accountsProxy = "0xed7f51A34B4e71fbE69B3091FcF879cD14bD73A9";
  const celoNativeContract = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";
  const lockedGoldProxy = "0x6a4CC5693DC5BFA3799C699F3B941bA2Cb00c341";

  try {
    const mnemonic = await getMnemonic(password, keyStore);
    response = await signTxFromKeyStore(path, mnemonic, {
      nonce: "0x52",
      gasPrice: "0xffffffff",
      gasLimit: "0xffffff",
      feeCurrency: "",
      gatewayFeeRecipient: "",
      gatewayFee: "",
      to: lockedGoldProxy,
      data: data,
      value: "0xfffffff",
      chainId: 44787,
    });
    // eslint-disable-next-line no-console
    console.log("response - ", response);
    // eslint-disable-next-line no-console
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  return response;
}

async function run() {
  const PASSWORD = MNEMONIC.password;
  const keyStore = await createKeyStore(PASSWORD);
  const account = await getAccount(
    { type: TYPE, account: 0, index: INDEX },
    keyStore,
    PASSWORD
  );
  const signedTx = await signTx(
    { type: TYPE, account: 0, index: INDEX },
    keyStore,
    PASSWORD,
    account
  );

  // const kit = newKit("https://alfajores-forno.celo-testnet.org");
  // console.log(1, await kit.contracts.getContract());

  await sendTx(signedTx.signedTx);
  // test(account);
  // lockGold(account);
}

run();
