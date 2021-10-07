const { CeloProvider } = require("@celo-tools/celo-ethers-wrapper");
const { ethers, providers, Wallet } = require("ethers");
const { newKit } = require("@celo/contractkit");
const { LocalWallet } = require("@celo/wallet-local");

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

async function getData(address) {
  // const rgABI = [
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: true,
  //         internalType: "address",
  //         name: "beneficiary",
  //         type: "address",
  //       },
  //     ],
  //     name: "BeneficiarySet",
  //     type: "event",
  //   },
  //   {
  //     constant: false,
  //     inputs: [
  //       { internalType: "address", name: "to", type: "address" },
  //       { internalType: "uint256", name: "value", type: "uint256" },
  //     ],
  //     name: "transfer",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },

  //   {
  //     constant: false,
  //     inputs: [
  //       {
  //         internalType: "address payable",
  //         name: "newBeneficiary",
  //         type: "address",
  //       },
  //     ],
  //     name: "setBeneficiary",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
  //     name: "withdraw",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [],
  //     name: "refundAndFinalize",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [],
  //     name: "revoke",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [],
  //     name: "expire",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: true,
  //     inputs: [],
  //     name: "getTotalBalance",
  //     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  //     payable: false,
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     constant: true,
  //     inputs: [],
  //     name: "getRemainingTotalBalance",
  //     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  //     payable: false,
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     constant: true,
  //     inputs: [],
  //     name: "getRemainingUnlockedBalance",
  //     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  //     payable: false,
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     constant: true,
  //     inputs: [],
  //     name: "getRemainingLockedBalance",
  //     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  //     payable: false,
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     constant: true,
  //     inputs: [],
  //     name: "getCurrentReleasedTotalAmount",
  //     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  //     payable: false,
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
  //     name: "lockGold",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
  //     name: "unlockGold",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [
  //       { internalType: "uint256", name: "index", type: "uint256" },
  //       { internalType: "uint256", name: "value", type: "uint256" },
  //     ],
  //     name: "relockGold",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
  //     name: "withdrawLockedGold",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [
  //       { internalType: "address payable", name: "signer", type: "address" },
  //       { internalType: "uint8", name: "v", type: "uint8" },
  //       { internalType: "bytes32", name: "r", type: "bytes32" },
  //       { internalType: "bytes32", name: "s", type: "bytes32" },
  //     ],
  //     name: "authorizeVoteSigner",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [],
  //     name: "createAccount",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [{ internalType: "string", name: "metadataURL", type: "string" }],
  //     name: "setAccountMetadataURL",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [
  //       { internalType: "address", name: "group", type: "address" },
  //       { internalType: "uint256", name: "value", type: "uint256" },
  //       { internalType: "address", name: "lesser", type: "address" },
  //       { internalType: "address", name: "greater", type: "address" },
  //       { internalType: "uint256", name: "index", type: "uint256" },
  //     ],
  //     name: "revokeActive",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [
  //       { internalType: "address", name: "group", type: "address" },
  //       { internalType: "uint256", name: "value", type: "uint256" },
  //       { internalType: "address", name: "lesser", type: "address" },
  //       { internalType: "address", name: "greater", type: "address" },
  //       { internalType: "uint256", name: "index", type: "uint256" },
  //     ],
  //     name: "revokePending",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  // ];
  // const rgIface = new ethers.utils.Interface(rgABI);
  // const data = rgIface.encodeFunctionData("createAccount", []);

  const wallet = new LocalWallet();
  wallet.addAccount("pk");
  const kit = new newKit("https://alfajores-forno.celo-testnet.org", wallet);
  kit.defaultAccount = address;
  console.log(kit.defaultAccount);
  const accounts = await kit.contracts.getAccounts();
  tx = accounts.createAccount();
  await tx.sendAndWaitForReceipt();

  // return data;
}

async function signTx(path, keyStore, password, to) {
  let response;
  const accountsProxy = "0xed7f51A34B4e71fbE69B3091FcF879cD14bD73A9";
  const celoNativeTokenContract = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";
  const lockedGoldProxy = "0x6a4CC5693DC5BFA3799C699F3B941bA2Cb00c341";
  const electionProxy = "0x1c3eDf937CFc2F6F51784D20DEB1af1F9a8655fA";

  const signUser = "0x3b9E4a4F0E9fAc88715835A5587B56764bcA94B2";
  const user1 = "0x2138AAE169B83c1AFC3D36dD0a554123c21f3FBC";
  const user2 = "0x981bab2A67AcC7b577df1328F13434c775590063";

  const data = await getData(signUser);
  try {
    const mnemonic = await getMnemonic(password, keyStore);
    response = await signTxFromKeyStore(path, mnemonic, {
      nonce: "0x01",
      gasPrice: "0xffffffff",
      gasLimit: "0xffffff",
      feeCurrency: "",
      gatewayFeeRecipient: "",
      gatewayFee: "",
      to: accountsProxy,
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
  // const signedTx = await signTx(
  //   { type: TYPE, account: 0, index: INDEX },
  //   keyStore,
  //   PASSWORD,
  //   account
  // );

  // await sendTx(signedTx.signedTx);
  await getData(account);
}

run();
