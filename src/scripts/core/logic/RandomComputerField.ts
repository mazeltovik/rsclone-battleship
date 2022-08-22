type Obj = {
    [key: string]: number;
};
type Options = {
    [key: string]: number;
};
type Ships = {
    [key: string]: Obj;
};

type Squadron = {
    [key: string]: SquadronOptions;
};

type SquadronOptions = {
    arrDecks: number[][];
    hits: number;
    x: number;
    y: number;
    kx: number;
    ky: number;
};

export default class RandomComputerField {
    static getRandomDiraction(n: number) {
        return Math.floor(Math.random() * (n + 1));
    }
    matrix: number[][];
    squadron: Squadron;
    constructor(public ships: Ships, public amount: number) {
        this.matrix = [...Array(this.amount)].map(() => Array(this.amount).fill(0));
        this.squadron = {};
    }
    createShip(obj: Options, shipname: string) {
        let { decks, x, y, kx, ky } = obj;
        let k = 0;
        let arrDecks: number[][] = [];
        let hits = 0;
        while (k < decks) {
            let i = Number(x) + Number(k) * Number(kx);
            let j = Number(y) + Number(k) * Number(ky);
            this.matrix[i][j] = 1;
            arrDecks.push([i, j]);
            k++;
        }
        this.squadron[shipname] = { arrDecks, hits, x, y, kx, ky };
    }
    randomLocationShips() {
        for (let ship in this.ships) {
            let count = this.ships[ship].count;
            let decks = this.ships[ship].deck;
            let shipName: string = '';
            let i = 0;
            while (i < count) {
                let options: Options = this.getCoordsDecks(decks);
                options.decks = decks;
                shipName = ship + String(i + 1);
                this.createShip(options, shipName);
                i++;
            }
        }
    }
    getCoordsDecks(decks: number): Obj {
        let kx = RandomComputerField.getRandomDiraction(1),
            ky;
        let x, y;
        if (kx === 0) {
            ky = 1;
        } else ky = 0;
        if (kx == 0) {
            x = RandomComputerField.getRandomDiraction(this.amount - 1);
            y = RandomComputerField.getRandomDiraction(this.amount - decks);
        } else {
            x = RandomComputerField.getRandomDiraction(this.amount - decks);
            y = RandomComputerField.getRandomDiraction(this.amount - 1);
        }
        let coords = { x, y, kx, ky };
        let result = this.validateShip(coords, decks);
        if (!result) return this.getCoordsDecks(decks);
        return coords;
    }
    validateShip(obj: Obj, decks: number) {
        let { x, y, kx, ky, fromX, toX, fromY, toY } = obj;
        fromX = x == 0 ? x : x - 1;
        if (x + kx * decks == this.amount && kx == 1) {
            toX = x + kx * decks;
        } else if (x + kx * decks < this.amount && kx == 1) {
            toX = x + kx * decks + 1;
        } else if (x == this.amount - 1 && kx == 0) {
            toX = x + 1;
        } else if (x < this.amount - 1 && kx == 0) {
            toX = x + 2;
        }

        fromY = y == 0 ? y : y - 1;
        if (y + ky * decks == this.amount && ky == 1) {
            toY = y + ky * decks;
        } else if (y + ky * decks < this.amount && ky == 1) {
            toY = y + ky * decks + 1;
        } else if (y == this.amount - 1 && ky == 0) {
            toY = y + 1;
        } else if (y < this.amount && ky == 0) {
            toY = y + 2;
        }
        if (toX === undefined || toY === undefined) return false;
        if (this.matrix.slice(fromX, toX).filter((arr) => arr.slice(fromY, toY).includes(1)).length > 0) return false;
        return true;
    }
}
