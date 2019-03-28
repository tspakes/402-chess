import { Piece, PieceSerialized, PieceType, Team, PieceMinimal } from "./Piece";
import { Turn } from "./Turn";
import Chalk from 'chalk';

export class Board { // Single state of the board
  public lastTurn: Turn;
  public grid: Piece[][]; // Rows denoted by numbers, columns by letters A-H (y, x here)
  /* Notation: display/internal, ███'s are black squares
   *     A/0 B/1 C/2 D/3 E/4 F/5 G/6 H/7
   * 8/7 ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███
   * 7/6 ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬
   * 6/5 ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███
   * 5/4 ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬
   * 4/3 ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███
   * 3/2 ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬
   * 2/1 ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███
   * 1/0 ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬
   */

  /**
   * Board is completely empty when constructed. 
   */
  constructor() {
    this.grid = [];
    for (let y = 0; y < 8; y++) {
      this.grid[y] = [];
      for (let x = 0; x < 8; x++)
        this.grid[y].push(null);
    }
  }

  public get pieces(): Piece[] {
    let list = [];
    for (let column of this.grid)
      for (let piece of column)
        list.push(piece);
    return list;
  }

  /**
   * Set up the board with all 32 pieces in their starting positions. 
   */
  public initPieces(): void {
    // Black (higher indexes)
    this.placePiece('rook', 'black', 0, 7);
    this.placePiece('knight', 'black', 1, 7);
    this.placePiece('bishop', 'black', 2, 7);
    this.placePiece('queen', 'black', 3, 7);
    this.placePiece('king', 'black', 4, 7);
    this.placePiece('bishop', 'black', 5, 7);
    this.placePiece('knight', 'black', 6, 7);
    this.placePiece('rook', 'black', 7, 7);
    for (let x = 0; x < 8; x++)
      this.placePiece('pawn', 'black', x, 6);

    // White (lower indexes)
    for (let x = 0; x < 8; x++)
      this.placePiece('pawn', 'white', x, 1);
    this.placePiece('rook', 'white', 0, 0);
    this.placePiece('knight', 'white', 1, 0);
    this.placePiece('bishop', 'white', 2, 0);
    this.placePiece('queen', 'white', 3, 0);
    this.placePiece('king', 'white', 4, 0);
    this.placePiece('bishop', 'white', 5, 0);
    this.placePiece('knight', 'white', 6, 0);
    this.placePiece('rook', 'white', 7, 0);
  }

  public placePiece(type: PieceType, team: Team, x: number, y: number): void {
    let p = new Piece(type, team, x, y);
    this.grid[y][x] = p;
  }

  public toString(): string {
    let str: string = Chalk.gray('  A B C D E F G H\n');
    for (let y = 7; y >= 0; y--) {
      str += Chalk.gray(`${y + 1} `); // Row demarkation
      for (let x = 0; x < 8; x++) {
        // Piece '-' for empty, 'P' for pawn, notation for others; cyan for white, blue for black
        if (this.grid[y][x] === null) str += Chalk.gray('-');
        else {
          if (this.grid[y][x].team === 'white')
            str += Chalk.cyanBright(this.grid[y][x].notation === '' ? 'P' : this.grid[y][x].notation);
          else
            str += Chalk.blue(this.grid[y][x].notation === '' ? 'P' : this.grid[y][x].notation);
        }
        str += ' ';
      }
      str = str.slice(0, str.length - 1) + '\n';
    }
    return str.slice(0, str.length - 1);
  }

  public applyTurn(turn: Turn): void {
    if (turn.type === 'invalid') throw 'Could not apply invalid move to the board.';

    // Update board
    this.grid[turn.y1][turn.x1] = null;
    if (turn.type === 'enpassant')
      this.grid[turn.target.y][turn.target.x] = null;
    this.grid[turn.y2][turn.x2] = turn.actor;
    if (turn.type === 'castle') {
      this.grid[turn.y3][turn.x3] = null;
      this.grid[turn.y4][turn.x4] = turn.actor2;
    }

    // Update piece
    turn.actor.updatePosition(turn.x2, turn.y2);
    turn.actor.hasMoved = true;
    if (turn.type === 'castle')
      turn.actor2.updatePosition(turn.x4, turn.y4);
    // Don't need to handle turn.actor2.hasMoved because it will never be involved w/ en passant
    this.lastTurn = turn;
  }

  public undoTurn(turn: Turn): void {
    if (turn.type === 'invalid') throw 'Could not apply invalid move to the board.';

    // Update board
    this.grid[turn.y2][turn.x2] = null;
    this.grid[turn.y1][turn.x1] = turn.actor;
    // Assuming that the target cannot be modified after being removed, place it in its
    //  previous position which may or may not be turn.x2,y2
    if (turn.target)
      this.grid[turn.target.y][turn.target.x] = turn.target;
    if (turn.type === 'castle') {
      this.grid[turn.y4][turn.x4] = null;
      this.grid[turn.y3][turn.x3] = turn.actor2;
    }

    // Update piece
    turn.actor.updatePosition(turn.x1, turn.y1);
    if (turn.type === 'pawnpromotion')
      turn.actor.demote();
    if (turn.meta.firstMove)
      turn.actor.hasMoved = false;
    if (turn.type === 'castle')
      turn.actor2.updatePosition(turn.x3, turn.y3);
    // Note that this.lastTurn is updated in BoardAPI.postUndo()
  }

  // Check which board spaces are threatened - this is for castling and king movement/check checking
  public getThreatenedSpaces(threatTeam: Team, turnToApply: Turn = null): boolean[][] {
    let threatenedSpaces: boolean[][] = [];
    for (let y = 0; y < 8; y++) { // Initialize return spaces to false
      threatenedSpaces[y] = [];
      for (let x = 0; x < 8; x++) {
        threatenedSpaces[y][x] = false;
      }
    }

    if (turnToApply != null) { // Temporarily apply turn to the board
      this.applyTurn(turnToApply);
    }

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        let piece = this.grid[y][x];
        if (piece != null && piece.team == threatTeam) { // Piece found
          if (piece.type == 'king') { // Threatens the 8 spaces around it unless off the board
            if (y == 0 && x == 0) { // Bottom left corner
              threatenedSpaces[y][x + 1] = true;
              threatenedSpaces[y + 1][x] = true;
              threatenedSpaces[y + 1][x + 1] = true;
            } else if (y == 0 && x == 7) { // Bottom right corner
              threatenedSpaces[y][x - 1] = true;
              threatenedSpaces[y + 1][x] = true;
              threatenedSpaces[y + 1][x - 1] = true;
            } else if (y == 7 && x == 0) { // Top left corner
              threatenedSpaces[y][x + 1] = true;
              threatenedSpaces[y - 1][x] = true;
              threatenedSpaces[y - 1][x + 1] = true;
            } else if (y == 7 && x == 7) { // Top right corner
              threatenedSpaces[y][x - 1] = true;
              threatenedSpaces[y - 1][x] = true;
              threatenedSpaces[y - 1][x - 1] = true;
            } else if (y == 7) { // Top row
              threatenedSpaces[y][x + 1] = true;
              threatenedSpaces[y - 1][x] = true;
              threatenedSpaces[y][x - 1] = true;
              threatenedSpaces[y - 1][x + 1] = true;
              threatenedSpaces[y - 1][x - 1] = true;
            } else if (y == 0) { // Bottom row
              threatenedSpaces[y][x + 1] = true;
              threatenedSpaces[y][x - 1] = true;
              threatenedSpaces[y + 1][x] = true;
              threatenedSpaces[y + 1][x - 1] = true;
              threatenedSpaces[y + 1][x + 1] = true;
            } else if (x == 0) { // Left column
              threatenedSpaces[y][x + 1] = true;
              threatenedSpaces[y - 1][x] = true;
              threatenedSpaces[y + 1][x] = true;
              threatenedSpaces[y - 1][x + 1] = true;
              threatenedSpaces[y + 1][x + 1] = true;
            } else if (x == 7) { // Right column
              threatenedSpaces[y - 1][x] = true;
              threatenedSpaces[y][x - 1] = true;
              threatenedSpaces[y + 1][x] = true;
              threatenedSpaces[y - 1][x - 1] = true;
              threatenedSpaces[y + 1][x - 1] = true;
            } else { // None of the edges
              threatenedSpaces[y][x + 1] = true;
              threatenedSpaces[y - 1][x] = true;
              threatenedSpaces[y][x - 1] = true;
              threatenedSpaces[y + 1][x] = true;
              threatenedSpaces[y - 1][x + 1] = true;
              threatenedSpaces[y - 1][x - 1] = true;
              threatenedSpaces[y + 1][x - 1] = true;
              threatenedSpaces[y + 1][x + 1] = true;
            }
          } else if (piece.type == 'queen') {
            let b: number;
            let a: number;

            // Right
            a = x + 1;
            b = y;
            while (a < 8) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break; // Stop if piece found
              a++;
            }

            // Down
            a = x;
            b = y - 1;
            while (b > -1) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              b--;
            }

            // Left
            a = x - 1;
            b = y;
            while (a > -1) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              a--;
            }

            // Up
            a = x;
            b = y + 1;
            while (b < 8) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              b++;
            }

            // Down-right
            a = x + 1;
            b = y - 1;
            while (b > -1 && a < 8) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              a++;
              b--;
            }

            // Down-left
            a = x - 1;
            b = y - 1;
            while (b > -1 && a > -1) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              a--;
              b--;
            }

            // Up-left
            a = x - 1;
            b = y + 1;
            while (b < 8 && a > -1) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              a--;
              b++;
            }

            // Up-right
            a = x + 1;
            b = y + 1;
            while (b < 8 && a < 8) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              a++;
              b++;
            }
          } else if (piece.type == 'bishop') {
            let b: number;
            let a: number;

            // Down-right
            a = x + 1;
            b = y - 1;
            while (b > -1 && a < 8) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              a++;
              b--;
            }

            // Down-left
            a = x - 1;
            b = y - 1;
            while (b > -1 && a > -1) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              a--;
              b--;
            }

            // Up-left
            a = x - 1;
            b = y + 1;
            while (b < 8 && a > -1) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              a--;
              b++;
            }

            // Up-right
            a = x + 1;
            b = y + 1;
            while (b < 8 && a < 8) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              a++;
              b++;
            }
          } else if (piece.type == 'knight') {
            // Attempt to threaten all 8 possible moves
            let b: number;
            let a: number;

            for (let c = 0; c < 8; c++) {
              if (c == 0) {
                a = x + 2;
                b = y + 1;
              } else if (c == 1) {
                a = x + 2;
                b = y - 1;
              } else if (c == 2) {
                a = x + 1;
                b = y - 2;
              } else if (c == 3) {
                a = x - 1;
                b = y - 2;
              } else if (c == 4) {
                a = x - 2;
                b = y - 1;
              } else if (c == 5) {
                a = x - 2;
                b = y + 1;
              } else if (c == 6) {
                a = x - 1;
                b = y + 2;
              } else {
                a = x + 1;
                b = y + 2;
              }
              // L determined, now threaten it if possible
              if (a < 8 && a > -1 && b < 8 && b > -1) threatenedSpaces[b][a] = true;
            }
          } else if (piece.type == 'rook') {
            let b: number;
            let a: number;

            // Right
            a = x + 1;
            b = y;
            while (a < 8) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break; // Stop if piece found
              a++;
            }

            // Down
            a = x;
            b = y - 1;
            while (b > -1) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              b--;
            }

            // Left
            a = x - 1;
            b = y;
            while (a > -1) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              a--;
            }

            // Up
            a = x;
            b = y + 1;
            while (b < 8) {
              threatenedSpaces[b][a] = true;
              if (this.grid[b][a] != null) break;
              b++;
            }
          } else if (piece.type == 'pawn') {
            let b: number;
            let a: number;

            if (piece.team == 'white') {
              b = y + 1; // Up for white
            } else {
              b = y - 1 // Down for black
            }
            a = x + 1; // Diagonal-right
            if (a < 8 && b < 8 && b > -1) threatenedSpaces[b][a] = true;
            a = x - 1; // Diagonal-left
            if (a > -1 && b < 8 && b > -1) threatenedSpaces[b][a] = true;
          } else { // Leftover piece type - shouldn't be reached
            console.log('Unknown piece in threat mapping')
          }
        }
      }
    }

    if (turnToApply != null) { // Undo temporarily applied turn
      this.undoTurn(turnToApply);
    }

    /* FOR PRINTING OUR A THREAT REPRESENTATION OF THE BOARD
    let s: string;
    let square: string;
    for (let j = 7; j > -1; j--) {
      s = '';
      for (let i = 0; i < 8; i++) {
        if (threatenedSpaces[j][i] == true) {
          square = 'T';
        } else {
          square = 'x';
        }
        s = s + square;
      }
      console.log(s);
    } */
    return threatenedSpaces;
  }

  /**
   * Remove the board's functions, getters, and setters in preparation for stringification. 
   */
  public serialize(): PieceSerialized[][] {
    let ser = [];
    for (let y = 0; y < 8; y++) {
      ser[y] = [];
      for (let x = 0; x < 8; x++)
        ser[y].push(this.grid[y][x] ? this.grid[y][x].serialize() : null);
    }
    return ser;
  }

  /**
   * Keep only needed information for detecting moves at runtime. 
   */
  public minimize(): PieceMinimal[][] {
    let min = [];
    for (let y = 0; y < 8; y++) {
      min[y] = [];
      for (let x = 0; x < 8; x++)
        min[y].push(this.grid[y][x] ? this.grid[y][x].minimize() : null);
    }
    return min;
  }
}