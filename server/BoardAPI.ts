export default class BoardAPI {
	private static history: Turn[] = [];
	private static board: Board;

	public static listen(): void {
		setTimeout(() => {

		}, 10);
		// TODO Keep invalid state boolean somewhere
	}

  public static getPositions(): Piece[] {
		return [];
	}
}

export class Board {
	public grid: Piece[][];
	public get pieces(): Piece[] {
		let list = [];
		for (let column of this.grid)
			for (let piece of column)
				list.push(piece);
		return list;
	}
}

export class Piece {
	public type: string;
	public team: 'black'|'white';
	public x: number;
	public y: number;
}

export class Turn {
	public type: 'move'|'take'|'castle'|'enpassant'|'pawnpromotion';
	public x1: number;
	public y1: number;
	public x2: number;
	public y2: number;
	public target: Piece; // Used in take, enpassant, and pawnpromotion
	// TODO Pawn promotion might also be a take, enpassant is always a take
	// Probably just type enpassant as move and take, only differentiate upon checking validity
}

export class TurnMove extends Turn {

}
export class TurnTake extends Turn {
	public capturedPiece: Piece;
}
export class TurnEnPassant extends TurnTake {

}
export class TurnPawnPromotion extends Turn {
	public promotedPiece: Piece;
}