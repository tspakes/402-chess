export type PieceType = 'king' | 'queen' | 'bishop' | 'knight' | 'rook' | 'pawn' | 'unknown';
export type Team = 'black' | 'white' | 'unknown';

export class PieceModel {

    public type: PieceType;
    public team: Team;

    public row: number;
    public column: number;
}
