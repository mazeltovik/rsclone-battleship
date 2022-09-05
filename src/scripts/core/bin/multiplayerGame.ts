import { io, Socket } from 'socket.io-client';
import SELECTORS from '../../utils/selectors';
import { BasicSettings, Options, Squadron } from './game.types';

export default class MultiplayerGame {
    static isHorizontal = true;
    static selectedShipNameWithIndex: string;
    static draggedShip: HTMLDivElement;
    static draggedShipLength: string;
    static lastChildId: string;
    static displayGrid: HTMLDivElement;
    static allShipsPlaced = false;
    static set = new Set();
    static userField: HTMLDivElement[] = [];
    static matrix: number[][] = [...Array(10)].map(() => Array(10).fill(0));
    static squadron: Squadron = {};
    static addRedClass(id: number) {
        document.querySelector(`[data-id="${id}"]`)?.classList.add('red');
    }
    static getDecimal(num: number) {
        let str = String(num / 10);
        let pointPos = str.indexOf('.');
        if (~pointPos) {
            return +str[`${pointPos + 1}`];
        }
        return 0;
    }
    static getIntegral(num: number) {
        return Math.trunc(num / 10);
    }
    static makeOption(decks: number, kx: number, ky: number, x: number, y: number) {
        return {
            decks: decks,
            kx: kx,
            ky: ky,
            x: x,
            y: y,
        };
    }
    static createShip(opt: Options) {
        let { decks, kx, ky, x, y } = opt;
        let shipName = MultiplayerGame.draggedShip.id;
        let k = 0;
        let arrDecks: number[][] = [];
        let hits = 0;
        while (k < decks) {
            let i = x + k * kx;
            let j = y + k * ky;
            MultiplayerGame.matrix[i][j] = 1;
            arrDecks.push([i, j]);
            k++;
        }
        MultiplayerGame.squadron[shipName] = { arrDecks, hits, x, y, kx, ky };
    }
    userGrid;
    enemyGrid;
    // userField: HTMLDivElement[];
    enemyField: HTMLDivElement[];
    ships;
    // btnRotate;

    // * ========================================================

    socket: Socket;
    playerNumber: number;
    isReady: boolean;
    isEnemyReady: boolean;
    // isShipsPlaced: boolean;
    currentPlayer: string;
    messageContainer;
    messageForm;
    messageInput;
    // btnRotate;
    constructor() {
        this.userGrid = document.querySelector(SELECTORS.userGrid) as HTMLDivElement;
        this.enemyGrid = document.querySelector(SELECTORS.enemyGrid) as HTMLDivElement;
        this.ships = document.querySelectorAll(SELECTORS.ships);
        this.enemyField = [];
        this.messageContainer = document.getElementById('message-container') as HTMLDivElement;
        this.messageForm = document.getElementById('send-container') as HTMLFormElement;
        this.messageInput = document.getElementById('message-input') as HTMLInputElement;
        this.socket = io('http://localhost:3000/');
        this.currentPlayer = 'user';
        this.playerNumber = 0;
        this.isReady = false;
        this.isEnemyReady = false;
        // this.isShipsPlaced = false;
        // this.shotFired = -1;
    }

    createField(grid: HTMLDivElement, squares: HTMLDivElement[]) {
        for (let i = 0; i < BasicSettings.Width * BasicSettings.Width; i++) {
            const square = document.createElement('div');
            square.dataset.id = String(i);
            grid.appendChild(square);
            squares.push(square);
        }
        MultiplayerGame.displayGrid = document.querySelector(SELECTORS.displayGrid) as HTMLDivElement;
    }

    rotate() {
        if (MultiplayerGame.isHorizontal) {
            document.querySelectorAll(SELECTORS.doubleDeckContainer).forEach((v) => {
                v.classList.toggle(SELECTORS.doubleDeckVertical);
            });
            document.querySelectorAll(SELECTORS.tripleDeckContainer).forEach((v) => {
                v.classList.toggle(SELECTORS.tripleDeckVertical);
            });
            document.querySelector(SELECTORS.fourDeck)?.classList.toggle(SELECTORS.fourDeckVertical);
            MultiplayerGame.isHorizontal = false;
            return;
        }
        if (!MultiplayerGame.isHorizontal) {
            document.querySelectorAll(SELECTORS.doubleDeckContainer).forEach((v) => {
                v.classList.toggle(SELECTORS.doubleDeckVertical);
            });
            document.querySelectorAll(SELECTORS.tripleDeckContainer).forEach((v) => {
                v.classList.toggle(SELECTORS.tripleDeckVertical);
            });
            document.querySelector(SELECTORS.fourDeck)?.classList.toggle(SELECTORS.fourDeckVertical);
            MultiplayerGame.isHorizontal = true;
            return;
        }
    }

    btnClickRotate() {
        document.addEventListener('keydown', (e) => {
            if (e.key == 'Control') this.rotate();
        });
    }

    moveAround() {
        this.ships.forEach((ship) => ship.addEventListener('dragstart', this.dragStart));
        MultiplayerGame.userField.forEach((square) => square.addEventListener('dragstart', this.dragStart));
        MultiplayerGame.userField.forEach((square) => square.addEventListener('dragover', this.dragOver));
        MultiplayerGame.userField.forEach((square) => square.addEventListener('dragenter', this.dragEnter));
        MultiplayerGame.userField.forEach((square) => square.addEventListener('dragleave', this.dragLeave));
        MultiplayerGame.userField.forEach((square) => square.addEventListener('drop', this.dragDrop));
        MultiplayerGame.userField.forEach((square) => square.addEventListener('dragend', this.dragEnd));
        this.ships.forEach((ship) =>
            ship.addEventListener('mousedown', (e) => {
                let elem = e.target as HTMLDivElement;
                MultiplayerGame.selectedShipNameWithIndex = elem.id;
            })
        );
    }
    dragStart(this: HTMLDivElement) {
        MultiplayerGame.draggedShip = this;
        MultiplayerGame.draggedShipLength = this.childNodes.length.toString();
    }
    dragOver(e: Event) {
        e.preventDefault();
    }
    dragEnter(e: Event) {
        e.preventDefault();
    }
    dragLeave() {
        // console.log('drag leave')
    }
    dragDrop(this: HTMLDivElement) {
        //Количество палуб корабля
        let decks = Number(MultiplayerGame.draggedShipLength);
        //Расположение корабля, kx=0 и ky = 1 - корабль расположен горизонтально
        //  kx=1 и ky = 0 - корабль расположен вертикально
        let kx = 0;
        let ky = 0;
        //координаты корабля
        let x = 0;
        let y = 0;
        if (MultiplayerGame.draggedShip) {
            MultiplayerGame.lastChildId = (MultiplayerGame.draggedShip?.lastChild as HTMLDivElement).id;
            let shipNameWithLastId = MultiplayerGame.lastChildId;
            let shipClass = shipNameWithLastId.slice(0, -2);
            let lastShipIndex = parseInt(shipNameWithLastId.slice(-1));
            let shipLastId = lastShipIndex + parseInt(String(this.dataset.id));
            const notAllowedHorizontal = [
                0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 22, 32, 42, 52, 62, 72,
                82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93,
            ];
            const notAllowedVertical = [
                99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74,
                73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60,
            ];
            let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
            let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex);
            let selectedShipIndex = parseInt(MultiplayerGame.selectedShipNameWithIndex.slice(-1));
            shipLastId = shipLastId - selectedShipIndex;
            const allowCheck = (length: string, lastIndex: number, type: 'horizontal' | 'vertical') => {
                let allow = true;
                const typeFactor = type === 'horizontal' ? 1 : 10;
                for (let i = 0; i < Number(length); i++)
                    if (MultiplayerGame.set.has(lastIndex - i * typeFactor)) allow = false;
                return allow;
            };
            if (
                (MultiplayerGame.isHorizontal ||
                    (!MultiplayerGame.isHorizontal && Number(MultiplayerGame.draggedShipLength) === 1)) &&
                !newNotAllowedHorizontal.includes(shipLastId) &&
                allowCheck(MultiplayerGame.draggedShipLength, shipLastId, 'horizontal')
            ) {
                for (let i = 0; i < Number(MultiplayerGame.draggedShipLength); i++) {
                    const id = parseInt(String(this.dataset.id)) - selectedShipIndex + i;
                    const filterHorizontal = (id: number, index: number, draggedShipLength: string): Array<number> => {
                        const arr: Array<number> = [];
                        if (Number(draggedShipLength) === 1) {
                            if (id % 10 === 0) arr.push(id + 10, id - 10, id + 1, id + 11, id - 9);
                            else if ((id - 9) % 10 === 0) arr.push(id + 10, id - 10, id - 1, id - 11, id + 9);
                            else arr.push(id + 10, id - 10, id + 1, id + 11, id - 9, id - 1, id - 11, id + 9);
                        } else if (
                            (index === 0 && id % 10 === 0) ||
                            (index === Number(draggedShipLength) - 1 && (id - 9) % 10 === 0) ||
                            (index > 0 && index < Number(draggedShipLength) - 1)
                        ) {
                            arr.push(id - 10, id + 10);
                        } else if (index === 0) {
                            arr.push(id - 10, id + 10, id - 1, id - 11, id + 9);
                        } else if (index === Number(draggedShipLength) - 1) {
                            arr.push(id - 10, id + 10, id + 1, id + 11, id - 9);
                        }
                        return arr;
                    };
                    MultiplayerGame.set.add(id);
                    filterHorizontal(id, i, MultiplayerGame.draggedShipLength).forEach((value) =>
                        MultiplayerGame.set.add(value)
                    );
                    MultiplayerGame.set.forEach((v) => {
                        MultiplayerGame.addRedClass(Number(v));
                    });

                    let directionClass: string = 'nope';
                    if (Number(MultiplayerGame.draggedShipLength) == 1) {
                        MultiplayerGame.userField[
                            parseInt(String(this.dataset.id)) - selectedShipIndex + i
                        ].classList.add('taken', 'horizontal', 'single', shipClass);
                    } else {
                        if (i === 0) directionClass = 'start';
                        if (i === Number(MultiplayerGame.draggedShipLength) - 1) directionClass = 'end';
                        MultiplayerGame.userField[
                            parseInt(String(this.dataset.id)) - selectedShipIndex + i
                        ].classList.add('taken', 'horizontal', directionClass, shipClass);
                    }
                }
            } else if (
                !MultiplayerGame.isHorizontal &&
                !newNotAllowedVertical.includes(shipLastId) &&
                allowCheck(MultiplayerGame.draggedShipLength, shipLastId, 'vertical')
            ) {
                for (let i = 0; i < Number(MultiplayerGame.draggedShipLength); i++) {
                    const id = parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i - 9;
                    const filterVertical = (id: number, index: number, draggedShipLength: string): Array<number> => {
                        const arr: Array<number> = [];
                        if (id % 10 < 9 && id % 10 > 0) {
                            if (index === 0) arr.push(id - 9, id - 10, id - 11);
                            else if (index === Number(draggedShipLength) - 1) arr.push(id + 9, id + 10, id + 11);
                            arr.push(id - 1, id + 1);
                        } else if (id % 10 === 9) {
                            arr.push(id - 1);
                            if (index === 0) arr.push(id - 10, id - 11);
                            else if (index === Number(draggedShipLength) - 1) arr.push(id + 9, id + 10);
                        } else if (id % 10 === 0) {
                            arr.push(id + 1);
                            if (index === 0) arr.push(id - 9, id - 10);
                            else if (index === Number(draggedShipLength) - 1) arr.push(id + 10, id + 11);
                        }
                        return arr;
                    };
                    MultiplayerGame.set.add(id);
                    filterVertical(id, i, MultiplayerGame.draggedShipLength).forEach((value) =>
                        MultiplayerGame.set.add(value)
                    );
                    MultiplayerGame.set.forEach((v) => {
                        MultiplayerGame.addRedClass(Number(v));
                    });
                    let directionClass: string = 'nope';
                    if (Number(MultiplayerGame.draggedShipLength) === 1) {
                        MultiplayerGame.userField[
                            parseInt(String(this.dataset.id)) - selectedShipIndex + i
                        ].classList.add('taken', 'horizontal', 'single', shipClass);
                    } else {
                        if (i === 0) directionClass = 'start';
                        if (i === Number(MultiplayerGame.draggedShipLength) - 1) directionClass = 'end';

                        MultiplayerGame.userField[
                            parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i - 9
                        ].classList.add('taken', 'vertical', directionClass, shipClass);
                    }
                }
            } else return;

            MultiplayerGame.displayGrid.removeChild(MultiplayerGame.draggedShip);
            if (!MultiplayerGame.displayGrid.querySelector('.ship')) {
                MultiplayerGame.allShipsPlaced = true;
                const startButton = document.querySelector('#start') as HTMLButtonElement;
                startButton.removeAttribute('disabled');
                startButton.classList.remove('disabled');
            }
            if (MultiplayerGame.isHorizontal) {
                let idVertical = parseInt(String(this.dataset.id)) - selectedShipIndex;
                kx = 0;
                ky = 1;
                if (idVertical < 10) {
                    x = 0;
                    y = MultiplayerGame.getDecimal(idVertical);
                } else {
                    x = MultiplayerGame.getIntegral(idVertical);
                    y = MultiplayerGame.getDecimal(idVertical);
                }
            } else {
                let idHorizontal = parseInt(String(this.dataset.id)) - selectedShipIndex - 9;
                kx = 1;
                ky = 0;
                x = MultiplayerGame.getIntegral(idHorizontal);
                if (MultiplayerGame.draggedShipLength === '1') {
                    x = MultiplayerGame.getIntegral(parseInt(String(this.dataset.id)) - selectedShipIndex);
                    y = MultiplayerGame.getDecimal(parseInt(String(this.dataset.id)) - selectedShipIndex);
                } else {
                    y = MultiplayerGame.getDecimal(idHorizontal);
                }
            }
            MultiplayerGame.createShip(MultiplayerGame.makeOption(decks, kx, ky, x, y));
        }
    }
    dragEnd() {
        // console.log('dragend')
    }

    // * =========================================================

    getPlayerNumber() {
        this.socket.on('player-number', (obj: { player: string; status: string }) => {
            const number = parseInt(obj.player);
            if (number === -1) {
                console.log('Server is full');
                //todo: решить как реализовать на странице
            } else {
                this.playerNumber = number;
                if (this.playerNumber === 1) this.currentPlayer = 'enemy';

                console.log(`Your player number is ${this.playerNumber}`);
            }
            this.controlPlayerConnection(obj);
            this.socket.emit('check-players');
        });
    }

    controlPlayerConnection(obj: { player: string; status: string }) {
        const statusSelector = parseInt(obj.player) !== this.playerNumber ? 'enemy' : 'player';
        const element = document.querySelector(`.${statusSelector}-connection`) as Element;
        if (obj.status === 'connected') {
            element.classList.add('active');
            element.innerHTML = 'connected';
        } else if (obj.status === 'disconnected') {
            element.classList.remove('active');
            element.innerHTML = 'disconnected';
        }
    }

    playerReady() {
        const startButton = document.querySelector('#start') as HTMLButtonElement;
        startButton.addEventListener('click', () => {
            console.log('You are ready');
            startButton.setAttribute('disabled', 'disabled');
            startButton.classList.add('disabled');
            this.isReady = true;
            const status = document.querySelector('.player-ready') as HTMLElement;
            status.innerHTML = 'ready';
            status.classList.add('active');
            this.socket.emit('player-ready');
            if (this.isReady && this.isEnemyReady) this.showWhoGo();
        });
    }

    showWhoGo() {
        const element = document.querySelector('#whose-go') as HTMLElement;
        element.innerHTML = `${this.currentPlayer} go...`;
    }

    appendMessage(message: string) {
        const messageElem = document.createElement('div');
        messageElem.textContent = message;
        this.messageContainer.append(messageElem);
    }

    start() {
        this.createField(this.userGrid, MultiplayerGame.userField);
        this.createField(this.enemyGrid, this.enemyField);
        this.btnClickRotate();
        this.moveAround();

        //  * =======================================================

        console.log('Multiplayer is started');

        this.getPlayerNumber();

        this.socket.on('player-connection', (obj: { player: string; status: string }) => {
            this.controlPlayerConnection(obj);
        });

        this.playerReady();

        this.socket.on('enemy-ready', (string: string) => {
            this.isEnemyReady = true;
            console.log(string);
            const status = document.querySelector('.enemy-ready') as HTMLElement;
            status.innerHTML = 'ready';
            status.classList.add('active');
            this.socket.emit('enemy-ready');
            if (this.isReady && this.isEnemyReady) this.showWhoGo();
        });

        this.socket.on('check-players', (players: string[]) => {
            for (let i = 0; i < players.length; i++) {
                const statusSelector = i !== this.playerNumber ? 'enemy' : 'player';
                const element = document.querySelector(`.${statusSelector}-connection`) as Element;
                if (players[i] === 'connected') {
                    element.classList.add('active');
                    element.innerHTML = 'connected';
                } else if (players[i] === 'disconnected') {
                    element.classList.remove('active');
                    element.innerHTML = 'disconnected';
                }
            }
            if (this.isReady && this.isEnemyReady) this.showWhoGo();
        });

        window.addEventListener('hashchange', () => {
            console.log('You are disconnected');
            // todo: решить как реализовать на странице
            this.socket.disconnect();
        });

        this.enemyGrid.addEventListener('click', (event) => {
            const target: HTMLElement = event.target as HTMLElement;
            if (this.currentPlayer === 'user' && this.isReady && this.isEnemyReady) {
                const shotFired: string = target.dataset.id as string;
                this.socket.emit('fire', shotFired);
            }
        });

        this.socket.on('fire', (id: number) => {
            const target = MultiplayerGame.userField[id];
            let reply: 'boom' | 'miss';

            if (target.classList.contains('taken')) {
                reply = 'boom';
                this.currentPlayer = 'enemy';
            } else {
                reply = 'miss';
                this.currentPlayer = 'user';
            }

            this.showWhoGo();

            this.socket.emit('fire-reply', {
                id: id,
                reply: reply,
            });
        });

        this.socket.on('fire-reply', (obj: { id: string; reply: string }) => {
            this.enemyField[parseInt(obj.id)].classList.add(obj.reply);

            if (obj.reply === 'boom') {
                this.currentPlayer = 'user';
            } else if (obj.reply === 'miss') {
                this.currentPlayer = 'enemy';
            }

            this.showWhoGo();
        });

        this.messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let message = this.messageInput.value;
            this.appendMessage(`You: ${message}`);
            this.socket.emit('send-chat-message', message);
            this.messageInput.value = '';
        });
        this.socket.on('chat-message', (data) => {
            this.appendMessage(`${data.name}: ${data.message}`);
        });
        this.socket.on('user-connected', (name) => {
            this.appendMessage(name);
        });
        this.socket.emit('new-user', name);
        this.socket.on('user-connected', (name) => {
            this.appendMessage(`${name} connected`);
        });
    }
}
