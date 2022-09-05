export type Options = {
    [key: string]: number;
};

export type SquadronOptions = {
    arrDecks: number[][];
    hits: number;
    x: number;
    y: number;
    kx: number;
    ky: number;
};

export type Squadron = {
    [key: string]: SquadronOptions;
};

export enum BasicSettings {
    Width = 10,
}

export type Ship = {
    name: string;
    directions: number[][];
};
