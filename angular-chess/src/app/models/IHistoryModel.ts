export interface IHistoryModel {


    actor?: IActorModel;
    meta?: IMetaModel;

    x1?: number;
    y1?: number;

    x2?: number;
    y2?: number;

    notation?: string;
    type?: string;
    target?: IActorModel;
    check: string;
}

interface IActorModel {

    id?: number;
    team?: string;
    type?: string;
    x?: number;
    y?: number;

}

interface IMetaModel {

    doublepawn?: boolean;
    firstMove?: boolean;

}
