// Import GPIO here later

export default class BoardDriver {
  // #region DEBUG
  private static _debug: boolean = false;
  private static _debugBoard: boolean[][];
  public static get debug(): boolean {
    return this._debug;
  }
  public static set debug(value: boolean) {
    if (value && !this._debug) {
      // Init spoofed board
      this._debugBoard = [];
      for (let c = 0; c < 8; c++) {
        this._debugBoard[c] = [];
        for (let r = 0; r < 8; r++) {
          this._debugBoard[c][r] = (r <= 1 || r >= 6);
        }
      }
    }
    this._debug = value;
  }
  public static debug_setCell(x: number, y: number, occupied: boolean) {
    this._debugBoard[x][y] = occupied;
  }
  // #endregion

  private static _nextCol: number = 0;
  public static get readCol(): number {
    return this._nextCol <= 0 ? 7 : this._nextCol - 1;
  }
  
  public static setColumn(c: number): void {
    if (c < 0 || c > 7)
      throw `Column must be within the range [0,7]. Actual: ${c}`;
    // TODO Set multiplexer GPIO
  }

  public static cycleColumn(): number {
    if (++this._nextCol > 7)
      this._nextCol = 0;
    return this._nextCol;
  }
  
  public static readColumn(): boolean[] {
    if (this._debug)
      return this._debugBoard[this._nextCol];
    // TODO Read inputs from GPIO
    return [ false, false, false, false, false, false, false, false ];
  }
}