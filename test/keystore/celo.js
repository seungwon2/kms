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

const Web3 = require("web3");

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
  // celo 자동 딜리게이션 최종 단계 authorizevotesigner 컨트랙트 키트로 테스트 완료했고 셀로 보트 테스트 하고 액티베잇 되는 것 까지 확인 완료.
  // revoke, deactivate, withdraw celovote로 한번 해보기 필요
  // 이제 컨트랙트 키트 빼고 이더리움쪽 라이브러리로 변경하고, 셀로 수동으로 딜리게이션하고 리워드 얻는 과정 다음주에 완료하겠습니다.

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

  // const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
  // const singerForWallet = await web3.eth.accounts.create();
  // console.log("signer: ", singerForWallet);
  const wallet = new LocalWallet();
  wallet.addAccount(
    "b91f14a9ae714093ae294e82c159e6a1a78ddb1dc4fa1938e0934391e001cae0"
  );
  console.log(wallet);
  const kit = new newKit("https://alfajores-forno.celo-testnet.org", wallet);
  // const signer = kit.web3.eth.accounts.create();
  //create account
  kit.defaultAccount = address;
  console.log(kit.defaultAccount);
  const accounts = await kit.contracts.getAccounts();
  tx1 = accounts.createAccount();
  console.log(111, tx1);
  await tx1.sendAndWaitForReceipt();
  // console.log("result: ", result1);

  //lock gold
  // const lockedGoldWrapper = await kit.contracts.getLockedGold();
  // const value = 1000000000000000000;
  // const tx2 = await lockedGoldWrapper.lock();
  // const result = await tx2.sendAndWaitForReceipt({ value });
  // console.log("result: ", result);

  //authorizeVoteSigner

  const signature = await accounts.generateProofOfKeyPossessionLocally(
    kit.defaultAccount,
    singerForWallet.address,
    singerForWallet.privateKey
  );
  console.log("sig: ", signature);
  // const tx2 = await accounts.authorizeVoteSigner(
  //   "0x2138AAE169B83c1AFC3D36dD0a554123c21f3FBC",
  //   signature
  // );
  // console.log("tx: ", tx2);
  // const result = await tx2.sendAndWaitForReceipt();
  // console.log("result: ", result);

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
