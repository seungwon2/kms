const {
  CeloProvider,
  celoAllowedTransactionKeys,
  serializeCeloTransaction,
  parseCeloTransaction,
} = require("@celo-tools/celo-ethers-wrapper");

const { serializeError } = require("@ledgerhq/errors");
const { ethers, providers, Contract, utils } = require("ethers");
const { BigNumber } = require("bignumber.js");

const { ContractKit, newKit } = require("@celo/contractkit");
const {
  ReleaseGoldWrapper,
} = require("@celo/contractkit/lib/wrappers/ReleaseGold");
const {
  newReleaseGold,
} = require("@celo/contractkit/lib/generated/ReleaseGold");

const { ReadOnlyWallet } = require("@celo/connect");
const { LocalWallet } = require("@celo/wallet-local/lib/index");

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
  const provider = new CeloProvider("https://alfajores-forno.celo-testnet.org");
  const wallet = new LocalWallet();
  wallet.addAccount(address);
  console.log("wallet: ", wallet);
  // const wallet = new Wallet(address, provider);
  const kit = new newKit("https://alfajores-forno.celo-testnet.org", wallet);
  kit.defaultAccount = address;

  //create Account
  //이미 create 되어있어서 작동 안됨
  // const accounts = await kit.contracts.getAccounts();
  // tx = accounts.createAccount();
  // await tx.sendAndWaitForReceipt();

  //lockgold
  //정상 작동
  const lockedGoldWrapper = await kit.contracts.getLockedGold();
  let locked = await lockedGoldWrapper.getAccountTotalLockedGold(address);
  console.log(locked.toString());

  //authorizeVoteSigner
  //signature에 무엇을 넣어야 하는가...?
  // const txo = await accounts.authorizeVoteSigner(wallet, signature);
  // console.log(1, await txo.sendAndWaitForReceipt());

  //election
  const electionWrapper = await kit.contracts.getElection();
  const voter = await electionWrapper.getVoter(address);
  console.log(1, await electionWrapper.electableValidators());
  const validator = "0x87614eD7AF361a563C6a3624CcadD52e165f67C2";
  const tx = await electionWrapper.vote(validator, 100);
  console.log("tx: ", tx);
  await tx.sendAndWaitForReceipt();
  console.log("voter: ", voter);
}

async function signTx(path, keyStore, password, to) {
  let response;
  const accountsProxy = "0xed7f51A34B4e71fbE69B3091FcF879cD14bD73A9";
  const celoNativeTokenContract = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";
  const lockedGoldProxy = "0x6a4CC5693DC5BFA3799C699F3B941bA2Cb00c341";
  const electionProxy = "0x1c3eDf937CFc2F6F51784D20DEB1af1F9a8655fA";

  const data = getData(to);
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
