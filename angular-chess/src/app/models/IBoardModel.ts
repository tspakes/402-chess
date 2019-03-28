import {IPieceModel, Team} from './IPieceModel';
import {IHistoryModel} from "./IHistoryModel";

export interface IBoardModel {

    message: string;

    currentTeam: Team;

    board: [];

    pieces: IPieceModel[];

    history: IHistoryModel[];


}
