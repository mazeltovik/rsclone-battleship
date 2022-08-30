import SELECTORS from '../../utils/selectors';
import RandomComputerField from '../logic/RandomComputerField';
import shipsForClassicGame from '../../utils/ships';
import Controller from '../logic/controller';

type Options = {
    [key: string]: number;
};

type SquadronOptions = {
    arrDecks: number[][];
    hits: number;
    x: number;
    y: number;
    kx: number;
    ky: number;
};

type Squadron = {
    [key: string]: SquadronOptions;
};

enum BasicSettings {
    Width = 10,
}

type Ship = {
    name: string;
    directions: number[][];
};

type Ships = {
    [key: string]: Obj;
};

type Obj = {
    [key: string]: number;
};

// Класс отвечающий за формирование матрицы для радномного раставления кораблей
// let randomComputerField = new RandomComputerField(shipsForClassicGame, 10);

export default class ClassicGame {
    static isHorizontal = true;
    static selectedShipNameWithIndex: string;
    static draggedShip: HTMLDivElement;
    static draggedShipLength: string;
    static lastChildId: string;
    // static userSquares: HTMLDivElement[];
    static displayGrid: HTMLDivElement;
    static allShipsPlaced = false;
    static set = new Set();
    static userField: HTMLDivElement[] = [];
    static matrix: number[][] = [...Array(10)].map(() => Array(10).fill(0));
    static squadron: Squadron = {};
    static turnDisplay: HTMLHeadingElement;
    // Статический метод для добавления красных полей вокруг кораблей,
    // чтобы показать, в какие поля нельзя ставить корабль
    static addRedClass(id: number) {
        document.querySelector(`[data-id="${id}"]`)?.classList.add('red');
    }
    static getDecimial(num: number) {
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
        let shipName = ClassicGame.draggedShip.id;
        let k = 0;
        let arrDecks: number[][] = [];
        let hits = 0;
        while (k < decks) {
            let i = x + k * kx;
            let j = y + k * ky;
            ClassicGame.matrix[i][j] = 1;
            arrDecks.push([i, j]);
            k++;
        }
        ClassicGame.squadron[shipName] = { arrDecks, hits, x, y, kx, ky };
    }
    userGrid;
    computerGrid;
    // userField: HTMLDivElement[];
    computerField: HTMLDivElement[];
    ships;
    btnRotate;
    computer: RandomComputerField;
    btnStart;
    btnRandom;
    controller: Controller;
    btnDrop;
    constructor(public shipsForRandom: Ships, public amount: number) {
        this.userGrid = document.querySelector(SELECTORS.userGrid) as HTMLDivElement;
        this.computerGrid = document.querySelector(SELECTORS.computerGrid) as HTMLDivElement;
        this.btnRotate = document.querySelector(SELECTORS.rotateButton) as HTMLButtonElement;
        this.ships = document.querySelectorAll(SELECTORS.ships);
        // this.userField = [];
        this.computerField = [];
        this.btnStart = document.querySelector(SELECTORS.btnStart) as HTMLButtonElement;
        this.btnRandom = document.querySelector(SELECTORS.btnRandom) as HTMLButtonElement;
        this.btnDrop = document.querySelector(SELECTORS.btnDrop) as HTMLButtonElement;
        this.computer = new RandomComputerField(shipsForClassicGame, 10);
        this.controller = new Controller(
            ClassicGame.userField,
            this.computerGrid,
            this.computerField,
            ClassicGame.matrix,
            this.computer.matrix,
            ClassicGame.squadron,
            this.computer.squadron
        );
    }

    // Функция создает игровое поле
    createField(grid: HTMLDivElement, squares: HTMLDivElement[]) {
        for (let i = 0; i < BasicSettings.Width * BasicSettings.Width; i++) {
            const square = document.createElement('div');
            square.dataset.id = String(i);
            grid.appendChild(square);
            squares.push(square);
        }
        ClassicGame.displayGrid = document.querySelector(SELECTORS.displayGrid) as HTMLDivElement;
    }
    // Генерирует поле компьютера и заполняет его
    generateComputerClass() {
        let arr: number[] = [];
        this.computer.matrix.forEach((v) => {
            arr.push(...v);
        });
        arr.forEach((v, i) => {
            if (v === 1) this.computerField[i].classList.add('taken');
        });
    }

    // Функция отвечате за поворот кораблей в горизонтально и вертикальное положение
    rotate() {
        if (ClassicGame.isHorizontal) {
            document.querySelectorAll(SELECTORS.doubleDeckContainer).forEach((v) => {
                v.classList.toggle(SELECTORS.doubleDeckVertical);
            });
            document.querySelectorAll(SELECTORS.tripleDeckContainer).forEach((v) => {
                v.classList.toggle(SELECTORS.tripleDeckVertical);
            });
            document.querySelector(SELECTORS.fourDeck)?.classList.toggle(SELECTORS.fourDeckVertical);
            ClassicGame.isHorizontal = false;
            return;
        }
        if (!ClassicGame.isHorizontal) {
            document.querySelectorAll(SELECTORS.doubleDeckContainer).forEach((v) => {
                v.classList.toggle(SELECTORS.doubleDeckVertical);
            });
            document.querySelectorAll(SELECTORS.tripleDeckContainer).forEach((v) => {
                v.classList.toggle(SELECTORS.tripleDeckVertical);
            });
            document.querySelector(SELECTORS.fourDeck)?.classList.toggle(SELECTORS.fourDeckVertical);
            ClassicGame.isHorizontal = true;
            return;
        }
    }
    // Поворот кораблей при нажатие на Ctrl
    btnClickRotate() {
        this.btnRotate.addEventListener('click', this.rotate);
        document.addEventListener('keydown', (e) => {
            if (e.key == 'Control') this.rotate();
        });
    }

    //обработчик события при клике на кнопку start game;
    startBtnClick() {
        this.btnStart.addEventListener('click', (e) => {
            if (ClassicGame.allShipsPlaced) {
                console.log(ClassicGame.matrix);
                console.log(ClassicGame.squadron);
                this.controller.init();
                ClassicGame.userField.forEach((v) => {
                    v.classList.remove('red');
                });
                this.btnStart.style.display = 'none';
                this.btnRotate.style.display = 'none';
                this.btnRandom.style.display = 'none';
                this.btnDrop.style.display = 'none';
            } else {
                return;
            }
        });
    }

    // Расстановка при помощи drag & drop

    dropBtnClick() {
        this.btnDrop.addEventListener('click', (e) => {
            this.btnRandom.style.display = 'none';
            ClassicGame.displayGrid.style.display = 'flex';
        });
    }

    // Рандомная растановка для поля игрока
    randomBtnClick() {
        this.btnRandom.addEventListener('click', (e) => {
            this.btnRotate.style.display = 'none';
            this.btnRandom.style.display = 'none';
            this.btnDrop.style.display = 'none';
            this.randomLocationShips();
            this.drawShips();
            this.ships.forEach((v) => v.remove());
            ClassicGame.allShipsPlaced = true;
            document.querySelector(SELECTORS.turnDisplay)!.textContent = 'You Can Start Game';
        });
    }

    drawShips() {
        for (let key in ClassicGame.squadron) {
            let id: string;
            let diraction: string;
            let kx = ClassicGame.squadron[key].kx;
            let ky = ClassicGame.squadron[key].ky;
            if (kx === 0 && ky === 1) {
                diraction = 'horizontal';
            } else {
                diraction = 'vertical';
            }
            ClassicGame.squadron[key].arrDecks.forEach((v, i) => {
                let length = ClassicGame.squadron[key].arrDecks.length;
                id = this.translateCoords(v);
                // ClassicGame.userField[Number(id)].classList.add('taken', diraction);
                if (i === 0 && length > 1) {
                    ClassicGame.userField[Number(id)].classList.add('taken', 'start', diraction);
                } else if (i === 0 && length == 1) {
                    ClassicGame.userField[Number(id)].classList.add('taken', 'single', diraction);
                } else if (i === length - 1) {
                    ClassicGame.userField[Number(id)].classList.add('taken', 'end', diraction);
                } else {
                    ClassicGame.userField[Number(id)].classList.add('taken', diraction);
                }
            });
        }
    }

    translateCoords(arr: number[]) {
        if (arr[0] === 0) return String(arr[1]);
        return `${arr[0]}${arr[1]}`;
    }

    /// Рандомная генерация кораблей
    createShip(obj: Options, shipname: string) {
        let { decks, x, y, kx, ky } = obj;
        let k = 0;
        let arrDecks: number[][] = [];
        let hits = 0;
        while (k < decks) {
            let i = Number(x) + Number(k) * Number(kx);
            let j = Number(y) + Number(k) * Number(ky);
            ClassicGame.matrix[i][j] = 1;
            arrDecks.push([i, j]);
            k++;
        }
        ClassicGame.squadron[shipname] = { arrDecks, hits, x, y, kx, ky };
    }
    randomLocationShips() {
        for (let ship in this.shipsForRandom) {
            let count = this.shipsForRandom[ship].count;
            let decks = this.shipsForRandom[ship].deck;
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
        if (ClassicGame.matrix.slice(fromX, toX).filter((arr) => arr.slice(fromY, toY).includes(1)).length > 0)
            return false;
        return true;
    }
    // Функия вешает обработчики drag&drop

    moveAround() {
        this.ships.forEach((ship) => ship.addEventListener('dragstart', this.dragStart));
        ClassicGame.userField.forEach((square) => square.addEventListener('dragstart', this.dragStart));
        ClassicGame.userField.forEach((square) => square.addEventListener('dragover', this.dragOver));
        ClassicGame.userField.forEach((square) => square.addEventListener('dragenter', this.dragEnter));
        ClassicGame.userField.forEach((square) => square.addEventListener('dragleave', this.dragLeave));
        ClassicGame.userField.forEach((square) => square.addEventListener('drop', this.dragDrop));
        ClassicGame.userField.forEach((square) => square.addEventListener('dragend', this.dragEnd));
        this.ships.forEach((ship) =>
            ship.addEventListener('mousedown', (e) => {
                let elem = e.target as HTMLDivElement;
                ClassicGame.selectedShipNameWithIndex = elem.id;
            })
        );
    }
    dragStart(this: HTMLDivElement) {
        ClassicGame.draggedShip = this;
        ClassicGame.draggedShipLength = this.childNodes.length.toString();
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
        let decks = Number(ClassicGame.draggedShipLength);
        //Расположение корабля, kx=0 и ky = 1 - корабль расположен горизонтально
        //  kx=1 и ky = 0 - корабль расположен вертикально
        let kx = 0;
        let ky = 0;
        //координаты корабля
        let x = 0;
        let y = 0;
        if (ClassicGame.draggedShip) {
            ClassicGame.lastChildId = (ClassicGame.draggedShip?.lastChild as HTMLDivElement).id;
            let shipNameWithLastId = ClassicGame.lastChildId;
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
            let selectedShipIndex = parseInt(ClassicGame.selectedShipNameWithIndex.slice(-1));
            shipLastId = shipLastId - selectedShipIndex;
            const allowCheck = (length: string, lastIndex: number, type: 'horizontal' | 'vertical') => {
                let allow = true;
                const typeFactor = type === 'horizontal' ? 1 : 10;
                for (let i = 0; i < Number(length); i++)
                    if (ClassicGame.set.has(lastIndex - i * typeFactor)) allow = false;
                return allow;
            };
            if (
                (ClassicGame.isHorizontal ||
                    (!ClassicGame.isHorizontal && Number(ClassicGame.draggedShipLength) === 1)) &&
                !newNotAllowedHorizontal.includes(shipLastId) &&
                allowCheck(ClassicGame.draggedShipLength, shipLastId, 'horizontal')
            ) {
                for (let i = 0; i < Number(ClassicGame.draggedShipLength); i++) {
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
                    ClassicGame.set.add(id);
                    filterHorizontal(id, i, ClassicGame.draggedShipLength).forEach((value) =>
                        ClassicGame.set.add(value)
                    );
                    ClassicGame.set.forEach((v) => {
                        ClassicGame.addRedClass(Number(v));
                    });

                    let directionClass: string = 'nope';
                    if (Number(ClassicGame.draggedShipLength) == 1) {
                        ClassicGame.userField[parseInt(String(this.dataset.id)) - selectedShipIndex + i].classList.add(
                            'taken',
                            'horizontal',
                            'single',
                            shipClass
                        );
                    } else {
                        if (i === 0) directionClass = 'start';
                        if (i === Number(ClassicGame.draggedShipLength) - 1) directionClass = 'end';
                        ClassicGame.userField[parseInt(String(this.dataset.id)) - selectedShipIndex + i].classList.add(
                            'taken',
                            'horizontal',
                            directionClass,
                            shipClass
                        );
                    }
                }
            } else if (
                !ClassicGame.isHorizontal &&
                !newNotAllowedVertical.includes(shipLastId) &&
                allowCheck(ClassicGame.draggedShipLength, shipLastId, 'vertical')
            ) {
                for (let i = 0; i < Number(ClassicGame.draggedShipLength); i++) {
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
                    ClassicGame.set.add(id);
                    filterVertical(id, i, ClassicGame.draggedShipLength).forEach((value) => ClassicGame.set.add(value));
                    ClassicGame.set.forEach((v) => {
                        ClassicGame.addRedClass(Number(v));
                    });
                    let directionClass: string = 'nope';
                    if (Number(ClassicGame.draggedShipLength) === 1) {
                        ClassicGame.userField[parseInt(String(this.dataset.id)) - selectedShipIndex + i].classList.add(
                            'taken',
                            'horizontal',
                            'single',
                            shipClass
                        );
                    } else {
                        if (i === 0) directionClass = 'start';
                        if (i === Number(ClassicGame.draggedShipLength) - 1) directionClass = 'end';

                        ClassicGame.userField[
                            parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i - 9
                        ].classList.add('taken', 'vertical', directionClass, shipClass);
                    }
                }
            } else return;

            if (ClassicGame.isHorizontal) {
                let idVertical = parseInt(String(this.dataset.id)) - selectedShipIndex;

                kx = 0;
                ky = 1;

                if (idVertical < 10) {
                    x = 0;
                    y = ClassicGame.getDecimial(idVertical);
                } else {
                    x = ClassicGame.getIntegral(idVertical);
                    y = ClassicGame.getDecimial(idVertical);
                }
            } else {
                let idHorizontal = parseInt(String(this.dataset.id)) - selectedShipIndex - 9;

                kx = 1;
                ky = 0;
                x = ClassicGame.getIntegral(idHorizontal);
                if (ClassicGame.draggedShipLength === '1') {
                    x = ClassicGame.getIntegral(parseInt(String(this.dataset.id)) - selectedShipIndex);
                    y = ClassicGame.getDecimial(parseInt(String(this.dataset.id)) - selectedShipIndex);
                } else {
                    y = ClassicGame.getDecimial(idHorizontal);
                }
            }
            ClassicGame.createShip(ClassicGame.makeOption(decks, kx, ky, x, y));
            ClassicGame.displayGrid.removeChild(ClassicGame.draggedShip);
            if (!ClassicGame.displayGrid.querySelector('.ship')) {
                ClassicGame.allShipsPlaced = true;
                document.querySelector(SELECTORS.turnDisplay)!.textContent = 'You Can Start Game';
            }
        }
    }
    dragEnd() {
        // console.log('dragend')
    }
    build() {
        this.createField(this.userGrid, ClassicGame.userField);
        // Копируем поля пользователя в переменную, тк в обработчике this призваевается event.target

        // Убрал переменную тк происходит не нужная перезапись
        // ClassicGame.userSquares = ClassicGame.userField;
        this.createField(this.computerGrid, this.computerField);
        // Вешаем обработчик события на кнопку поворота кораблей
        this.btnClickRotate();
        //Создаем матрицу с кораблями для компьютера
        this.computer.randomLocationShips();
        console.log(this.computer.matrix);
        console.log(this.computer.squadron);
        this.generateComputerClass();
        // Вешаем обработчики drag&drop
        this.moveAround();
        this.startBtnClick();
        this.randomBtnClick();
        this.dropBtnClick();
    }
}
