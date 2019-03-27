//import { DigitalInput, DigitalOutput, PULL_UP, HIGH, LOW } from 'raspi-gpio';
import chalk from "chalk";

// Remove these within the GPIO branch, uncomment the import, and run "npm install raspi-gpio --save" for ^6.2.1
// #region GPIO Stubs
declare var PULL_UP;
declare var HIGH;
declare var LOW;
class DigitalInput {
  constructor(arg: any) {}
  public read(): any { return HIGH; }
};
class DigitalOutput {
  constructor(arg: any) {}
  write(arg0: any) {}
};
// #endregion

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
    if (!this._debug)
      throw chalk.red('Cannot set spoofed cell when not spoofing.');
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
    this.i_col0 = new DigitalInput({ pin: 'GPIO10', pullResistor: PULL_UP });
    this.i_col1 = new DigitalInput({ pin: 'GPIO9', pullResistor: PULL_UP });
    this.i_col2 = new DigitalInput({ pin: 'GPIO11', pullResistor: PULL_UP });
    this.i_col3 = new DigitalInput({ pin: 'GPIO5', pullResistor: PULL_UP });
    this.i_col4 = new DigitalInput({ pin: 'GPIO6', pullResistor: PULL_UP });
    this.i_col5 = new DigitalInput({ pin: 'GPIO13', pullResistor: PULL_UP });
    this.i_col6 = new DigitalInput({ pin: 'GPIO19', pullResistor: PULL_UP });
    this.i_col7 = new DigitalInput({ pin: 'GPIO26', pullResistor: PULL_UP });
    this.o_mux0 = new DigitalOutput('GPIO16');
    this.o_mux1 = new DigitalOutput('GPIO20');
    this.o_mux2 = new DigitalOutput('GPIO21');
  }

  private static _colSelected: number = 0;
  private static _colRead: number = 0;
  public static get readCol(): number {
    return 7 - this._colRead;
  }
  
  public static setColumn(c: number): void {
    if (c < 0 || c > 7)
      throw chalk.red(`Column must be within the range [0,7]. Actual: ${c}`);
    //console.log(`Selected col ${c}: ${c%2}${Math.floor(c/2)%2}${Math.floor(c/4)%2}`);
    this.o_mux0.write(c % 2 ? HIGH : LOW);
    this.o_mux1.write(Math.floor(c / 2) % 2 ? HIGH : LOW);
    this.o_mux2.write(Math.floor(c / 4) % 2 ? HIGH : LOW);
  }

  public static cycleColumn(): number {
    if (++this._colSelected > 7)
      this._colSelected = 0;
    this.setColumn(this._colSelected);
    return this._colSelected;
  }
  
  public static readColumn(): boolean[] {
    this._colRead = this._colSelected;
    if (this._debug)
      return this._debugBoard[this._colSelected];
    return [
      this.i_col0.read() === LOW,
      this.i_col1.read() === LOW,
      this.i_col2.read() === LOW,
      this.i_col3.read() === LOW,
      this.i_col4.read() === LOW,
      this.i_col5.read() === LOW,
      this.i_col6.read() === LOW,
      this.i_col7.read() === LOW,
    ];
  }
}
