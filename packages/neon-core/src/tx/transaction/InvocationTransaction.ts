import { Fixed8, fixed82num, num2VarInt, StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";

export interface InvocationTransactionLike extends TransactionLike {
  script: string;
  gas: number | Fixed8;
}

export class InvocationTransaction extends BaseTransaction {
  public static deserializeExclusive(
    ss: StringStream,
    tx: Partial<TransactionLike>
  ): Partial<InvocationTransactionLike> {
    const script = ss.readVarBytes();
    const version = parseInt(ss.str.substr(2, 2), 16);
    const gas = version >= 1 ? fixed82num(ss.read(8)) : 0;
    return Object.assign(tx, { script, gas });
  }

  public readonly type: TransactionType = 0xd1;
  public script: string;
  public gas: Fixed8;

  get exclusiveData() {
    return { gas: this.gas, script: this.script };
  }

  get fees() {
    return this.gas.toNumber();
  }

  constructor(obj: Partial<InvocationTransactionLike> = {}) {
    super(obj);
    this.script = obj.script || "";
    this.gas = new Fixed8(obj.gas);
  }

  public serializeExclusive(): string {
    let out = num2VarInt(this.script.length / 2);
    out += this.script;
    if (this.version >= 1) {
      out += this.gas.toReverseHex();
    }
    return out;
  }

  public equals(other: Partial<TransactionLike>): boolean {
    if (this.type !== other.type) {
      return false;
    }
    if (other instanceof InvocationTransaction) {
      return this.hash === other.hash;
    }
    return this.hash === new InvocationTransaction(other).hash;
  }

  public export(): InvocationTransactionLike {
    return Object.assign(super.export(), {
      script: this.script,
      gas: this.gas.toNumber()
    });
  }
}

export default InvocationTransaction;
