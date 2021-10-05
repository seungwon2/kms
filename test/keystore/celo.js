const {
  CeloProvider,
  celoAllowedTransactionKeys,
  serializeCeloTransaction,
  parseCeloTransaction,
} = require("@celo-tools/celo-ethers-wrapper");

const { serializeError } = require("@ledgerhq/errors");
const { ethers, providers, Wallet, Contract, utils } = require("ethers");
const { BigNumber } = require("bignumber.js");

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
  console.log("address", address);
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
      inputs: [],
      name: "createAccount",
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
      name: "totalNonvoting",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
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
  ];
  const electionABI = [
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "min", type: "uint256" },
        { internalType: "uint256", name: "max", type: "uint256" },
      ],
      name: "setElectableValidators",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
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
      ],
      name: "vote",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const provider = new CeloProvider("https://alfajores-forno.celo-testnet.org");
  const signer = new Wallet(address, provider);

  const accountContract = new ethers.utils.Interface(rgABI);
  const electionContract = new ethers.utils.Interface(electionABI);
  const data = electionContract.encodeFunctionData("vote", [signer]);
  console.log("data", data);

  // const signature = signer.signDigest(
  //   utils.keccak256(
  //     serializeCeloTransaction(accountContract.functions.authorizeVoteSigner())
  //   )
  // );

  //  * @dev The v,r and s signature should be signed by the authorized signer
  //      key, with the ReleaseGold contract address as the message.

  // const rgIface = new ethers.utils.Interface(rgABI);
  // const lgIface = new ethers.utils.Interface(lgABI);
  // const electionIface = new ethers.utils.Interface(electionABI);
  return data;
}

async function signTx(path, keyStore, password, to) {
  let response;
  const data = await getData(to);
  console.log(data);
  const accountsProxy = "0xed7f51A34B4e71fbE69B3091FcF879cD14bD73A9";
  const celoNativeTokenContract = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";
  const lockedGoldProxy = "0x6a4CC5693DC5BFA3799C699F3B941bA2Cb00c341";
  const electionProxy = "0x1c3eDf937CFc2F6F51784D20DEB1af1F9a8655fA";

  try {
    const mnemonic = await getMnemonic(password, keyStore);
    response = await signTxFromKeyStore(path, mnemonic, {
      nonce: "0x6c",
      gasPrice: "0xffffffff",
      gasLimit: "0xffffff",
      feeCurrency: "",
      gatewayFeeRecipient: "",
      gatewayFee: "",
      to: electionProxy,
      data: data,
      value: "0x00",
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
