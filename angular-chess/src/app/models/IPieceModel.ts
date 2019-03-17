export type PieceType = 'king' | 'queen' | 'bishop' | 'knight' | 'rook' | 'pawn' | 'unknown';
export type Team = 'black' | 'white' | 'unknown';

export class IPieceModel {

    public type: PieceType;
    public team: Team;

    public row: number;
    public column: number;
    public id: number;
}
