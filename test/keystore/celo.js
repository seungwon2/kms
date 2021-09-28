const {
  CeloProvider,
  celoAllowedTransactionKeys,
  serializeCeloTransaction,
} = require("@celo-tools/celo-ethers-wrapper");

const { serializeError } = require("@ledgerhq/errors");
const { ethers, providers } = require("ethers");
const { BigNumber } = require("bignumber.js");

// for staking

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
  const provider = new CeloProvider("https://alfajores-forno.celo-testnet.org");
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
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "canExpire",
          type: "bool",
        },
      ],
      name: "CanExpireSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "beneficiary",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "maxDistribution",
          type: "uint256",
        },
      ],
      name: "DistributionLimitSet",
      type: "event",
    },
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
      name: "LiquidityProvisionSet",
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
          internalType: "address",
          name: "beneficiary",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "atAddress",
          type: "address",
        },
      ],
      name: "ReleaseGoldInstanceCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "beneficiary",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "atAddress",
          type: "address",
        },
      ],
      name: "ReleaseGoldInstanceDestroyed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "revokeTimestamp",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "releasedBalanceAtRevoke",
          type: "uint256",
        },
      ],
      name: "ReleaseScheduleRevoked",
      type: "event",
    },
    { payable: true, stateMutability: "payable", type: "fallback" },
    {
      constant: true,
      inputs: [],
      name: "EXPIRATION_TIME",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "beneficiary",
      outputs: [{ internalType: "address payable", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "canValidate",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "canVote",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
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
      name: "liquidityProvisionMet",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "maxDistribution",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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
      name: "refundAddress",
      outputs: [{ internalType: "address payable", name: "", type: "address" }],
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
      constant: true,
      inputs: [],
      name: "releaseOwner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "releaseSchedule",
      outputs: [
        { internalType: "uint256", name: "releaseStartTime", type: "uint256" },
        { internalType: "uint256", name: "releaseCliff", type: "uint256" },
        { internalType: "uint256", name: "numReleasePeriods", type: "uint256" },
        { internalType: "uint256", name: "releasePeriod", type: "uint256" },
        {
          internalType: "uint256",
          name: "amountReleasedPerPeriod",
          type: "uint256",
        },
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
      constant: true,
      inputs: [],
      name: "revocationInfo",
      outputs: [
        { internalType: "bool", name: "revocable", type: "bool" },
        { internalType: "bool", name: "canExpire", type: "bool" },
        {
          internalType: "uint256",
          name: "releasedBalanceAtRevoke",
          type: "uint256",
        },
        { internalType: "uint256", name: "revokeTime", type: "uint256" },
      ],
      payable: false,
      stateMutability: "view",
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
      inputs: [],
      name: "totalWithdrawn",
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
        { internalType: "uint256", name: "releaseStartTime", type: "uint256" },
        { internalType: "uint256", name: "releaseCliffTime", type: "uint256" },
        { internalType: "uint256", name: "numReleasePeriods", type: "uint256" },
        { internalType: "uint256", name: "releasePeriod", type: "uint256" },
        {
          internalType: "uint256",
          name: "amountReleasedPerPeriod",
          type: "uint256",
        },
        { internalType: "bool", name: "revocable", type: "bool" },
        {
          internalType: "address payable",
          name: "_beneficiary",
          type: "address",
        },
        { internalType: "address", name: "_releaseOwner", type: "address" },
        {
          internalType: "address payable",
          name: "_refundAddress",
          type: "address",
        },
        {
          internalType: "bool",
          name: "subjectToLiquidityProvision",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "initialDistributionRatio",
          type: "uint256",
        },
        { internalType: "bool", name: "_canValidate", type: "bool" },
        { internalType: "bool", name: "_canVote", type: "bool" },
        { internalType: "address", name: "registryAddress", type: "address" },
      ],
      name: "initialize",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "isRevoked",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "setLiquidityProvision",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "bool", name: "_canExpire", type: "bool" }],
      name: "setCanExpire",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "distributionRatio", type: "uint256" },
      ],
      name: "setMaxDistribution",
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
        { internalType: "address payable", name: "signer", type: "address" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "authorizeValidatorSigner",
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
        { internalType: "bytes", name: "ecdsaPublicKey", type: "bytes" },
      ],
      name: "authorizeValidatorSignerWithPublicKey",
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
        { internalType: "bytes", name: "ecdsaPublicKey", type: "bytes" },
        { internalType: "bytes", name: "blsPublicKey", type: "bytes" },
        { internalType: "bytes", name: "blsPop", type: "bytes" },
      ],
      name: "authorizeValidatorSignerWithKeys",
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
      name: "authorizeAttestationSigner",
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
  const rgAddress = "0xAC1A6cC40c4Dcdd294211Ec171fc7FB14896435C";
  let releaseGoldContract = new ethers.Contract(rgAddress, rgABI, provider);
  // console.log(1, await lockedGoldContract.functions.getTotalLockedGold());

  const iface = new ethers.utils.Interface(rgABI);
  const data = iface.encodeFunctionData("transfer", [address, 10000]);

  return data;
  // console.log(33, releaseGoldContract.functions);
}

async function signTx(path, keyStore, password, to) {
  let response;
  const data = await getData(to);
  try {
    const mnemonic = await getMnemonic(password, keyStore);
    response = await signTxFromKeyStore(path, mnemonic, {
      nonce: "0x2d",
      gasPrice: "0xffffffff",
      gasLimit: "0xffffff",
      feeCurrency: "",
      gatewayFeeRecipient: "",
      gatewayFee: "",
      to: to,
      data: data,
      value: "0x01",
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

  await sendTx(signedTx.signedTx);
  // test(account);
  // lockGold(account);
}

run();
