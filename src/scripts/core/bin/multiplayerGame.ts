import { io, Socket } from 'socket.io-client';

export default class MultiplayerGame {
    socket: Socket;
    playerNumber: number;
    isReady: boolean;
    isEnemyReady: boolean;
    isShipsPlaced: boolean;
    currentPlayer: string;

    constructor() {
        this.socket = io('http://localhost:3000/');
        this.currentPlayer = 'user';
        this.playerNumber = 0;
        this.isReady = false;
        this.isEnemyReady = false;
        this.isShipsPlaced = false;
        // this.shotFired = -1;
    }

    getPlayerNumber() {
        this.socket.on('player-number', (num: string) => {
            const number = parseInt(num);
            if (number === -1) {
                console.log('Server is full'); //todo: решить как реализовать на странице
            } else {
                this.playerNumber = number;
                if (this.playerNumber === 1) this.currentPlayer = 'enemy';

                console.log(this.playerNumber);
            }
        });
    }

    controlPlayerConnection(string: string) {
        console.log(`Player ${string}`); //todo: решить как реализовать на странице
    }

    start() {
        console.log('Multiplayer is started');

        this.getPlayerNumber();

        this.socket.on('player-connection', (string: string) => {
            this.controlPlayerConnection(string);
        });
    }
}
