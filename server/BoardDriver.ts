import { DigitalInput, DigitalOutput, PULL_UP, HIGH, LOW } from 'raspi-gpio';

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


  
  public static i_col0: DigitalInput;
  public static i_col1: DigitalInput;
  public static i_col2: DigitalInput;
  public static i_col3: DigitalInput;
  public static i_col4: DigitalInput;
  public static i_col5: DigitalInput;
  public static i_col6: DigitalInput;
  public static i_col7: DigitalInput;
  public static o_mux0: DigitalOutput;
  public static o_mux1: DigitalOutput;
  public static o_mux2: DigitalOutput;

  public static init(): void {
    this.i_col0 = new DigitalInput({ pin: 'P1-03', pullResistor: PULL_UP });
    this.i_col1 = new DigitalInput({ pin: 'P1-05', pullResistor: PULL_UP });
    this.i_col2 = new DigitalInput({ pin: 'P1-07', pullResistor: PULL_UP });
    this.i_col3 = new DigitalInput({ pin: 'P1-11', pullResistor: PULL_UP });
    this.i_col4 = new DigitalInput({ pin: 'P1-13', pullResistor: PULL_UP });
    this.i_col5 = new DigitalInput({ pin: 'P1-15', pullResistor: PULL_UP });
    this.i_col6 = new DigitalInput({ pin: 'P1-19', pullResistor: PULL_UP });
    this.i_col7 = new DigitalInput({ pin: 'P1-21', pullResistor: PULL_UP });
    this.o_mux0 = new DigitalOutput('P1-08');
    this.o_mux1 = new DigitalOutput('P1-10');
    this.o_mux2 = new DigitalOutput('P1-12');
  }

  private static _nextCol: number = 0;
  public static get readCol(): number {
    return this._nextCol <= 0 ? 7 : this._nextCol - 1;
  }
  
  public static setColumn(c: number): void {
    if (c < 0 || c > 7)
      throw `Column must be within the range [0,7]. Actual: ${c}`;
    this.o_mux0.write(c % 2 ? HIGH : LOW);
    this.o_mux1.write(c / 2 % 2 ? HIGH : LOW);
    this.o_mux2.write(c / 4 % 2 ? HIGH : LOW);
  }

  public static cycleColumn(): number {
    if (++this._nextCol > 7)
      this._nextCol = 0;
    return this._nextCol;
  }
  
  public static readColumn(): boolean[] {
    if (this._debug)
      return this._debugBoard[this._nextCol];
    return [
      this.i_col0.read() === HIGH,
      this.i_col1.read() === HIGH,
      this.i_col2.read() === HIGH,
      this.i_col3.read() === HIGH,
      this.i_col4.read() === HIGH,
      this.i_col5.read() === HIGH,
      this.i_col6.read() === HIGH,
      this.i_col7.read() === HIGH,
    ];
  }
}
