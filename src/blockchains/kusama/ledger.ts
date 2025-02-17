import Transport from "@ledgerhq/hw-transport";
import { newKusamaApp } from "@zondax/ledger-polkadot";
import { BIP44 } from "../../types";

// LEDGER
export class LEDGER {
  static async getAccount(path: BIP44, transport: Transport): Promise<string> {
    const instance = newKusamaApp(transport);
    const response = await instance.getAddress(
      0x80000000 + path.account,
      0x80000000,
      0x80000000 + path.index
    );
    return response.address;
  }

  /*
  static async signTx(
    path: BIP44,
    transport: Transport,
    rawTx: RawTx
  ): Promise<SignedTx> {
    // ...
  }

  export function signMessage(
    path: BIP44,
    transport: Transport,
    msg: string) {
    // ...
  }
  */
}
