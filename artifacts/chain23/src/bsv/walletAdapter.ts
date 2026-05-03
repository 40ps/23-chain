// BRC-100 compatible wallet adapter interface
// Live mode requires @bsv/sdk with Chronicle (post-Chronicle SIGHASH support).
// Until the SDK supports OTDA Chronicle flags, only Simulation Mode is active.

export type CreateActionParams = any;
export type WalletActionResult = any;
export type SignActionParams = any;
export type SignedActionResult = any;

export interface WalletAdapter {
  isAvailable(): Promise<boolean>;
  getBalance(): Promise<bigint>;
  createAction(params: CreateActionParams): Promise<WalletActionResult>;
  signAction?(params: SignActionParams): Promise<SignedActionResult>;
}

/**
 * Simulation-mode wallet. Holds a virtual satoshi balance and deducts fees.
 * No real keys, no real broadcasting.
 */
export class SimulationWalletAdapter implements WalletAdapter {
  private _balance: bigint;
  private readonly _feePerStep: bigint;

  constructor(
    initialBalance: bigint = 100_000n, // 100,000 satoshis to start
    feePerStep: bigint = 1n             // 1 satoshi per step
  ) {
    this._balance = initialBalance;
    this._feePerStep = feePerStep;
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async getBalance(): Promise<bigint> {
    return this._balance;
  }

  get feePerStep(): bigint {
    return this._feePerStep;
  }

  /**
   * Returns true if the fee was deducted, false if out of funds.
   */
  deductFee(): boolean {
    if (this._balance === 0n) return false;
    this._balance -= this._feePerStep;
    return true;
  }

  fund(amount: bigint): void {
    this._balance += amount;
  }

  async createAction(_params: CreateActionParams): Promise<WalletActionResult> {
    throw new Error(
      'Live mode not available. Chronicle (@bsv/sdk) OTDA SIGHASH support required.'
    );
  }
}
