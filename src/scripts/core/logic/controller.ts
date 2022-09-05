import SELECTORS from '../../utils/selectors';
import ClassicGame from '../bin/classicGame';
import RandomComputerField from './RandomComputerField';
import Translate from '../logic/translate/translate';
import Achives from '../components/achives/achives';
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

type removeCoords = number[];

type TempShips = {
    hits: number;
    firstHit: number[];
    kx: number;
    ky: number;
    x0: number;
    y0: number;
};

type ListenerShot = (e?: MouseEvent) => void;

export default class Controller {
    // массив базовых координат для формирования coordsFixedHit
    static START_POINTS = [
        [
            [6, 0],
            [2, 0],
            [0, 2],
            [0, 6],
        ],
        [
            [3, 0],
            [7, 0],
            [9, 2],
            [9, 6],
        ],
    ];

    static getRandom(n: number) {
        return Math.floor(Math.random() * (n + 1));
    }
    static getDecimial(num: number) {
        let str = String(num / 10);
        let pointPos = str.indexOf('.');
        if (~pointPos) {
            return +str[`${pointPos + 1}`];
        }
        return 0;
    }
    // удаление ненужных координат из массива
    static removeElementArray = (arr: number[][], [x, y]: removeCoords) => {
        return arr.filter((item) => item[0] != x || item[1] != y);
    };
    // Блок, в который выводятся информационные сообщения по ходу игры
    // static SERVICE_TEXT = getElement('service_text');
    // static showServiceText = text => {
    // 	Controller.SERVICE_TEXT.innerHTML = text;
    // }
    player: number[][];
    opponent: number[][];
    text;
    coordsRandomHit: number[][];
    coordsFixedHit: number[][];
    coordsAroundHit: number[][];
    turnDisplay;
    compShot;
    isHandlerController: boolean;
    tempShip: TempShips;
    listenerMakeShot!: ListenerShot;
    rumId: number;
    constructor(
        public userField: HTMLDivElement[],
        public computerGrid: HTMLDivElement,
        public computerField: HTMLDivElement[],
        public humanMatrix: number[][],
        public compMatrix: number[][],
        public humanSquadron: Squadron,
        public computerSquadron: Squadron
    ) {
        this.player = [...Array(10)].map(() => Array(10).fill(0));
        this.opponent = [...Array(10)].map(() => Array(10).fill(0));
        this.text = '';
        // массив с координатами выстрелов при рандомном выборе
        this.coordsRandomHit = [];
        // массив с заранее вычисленными координатами выстрелов
        this.coordsFixedHit = [];
        // массив с координатами вокруг клетки с попаданием
        this.coordsAroundHit = [];
        this.turnDisplay = document.querySelector(SELECTORS.turnDisplay) as HTMLHeadingElement;
        // временный объект корабля, куда будем заносить координаты
        // попаданий, расположение корабля, количество попаданий
        // this.resetTempShip();
        this.compShot = false;
        this.isHandlerController = false;
        this.resetTempShip();
        this.tempShip = { hits: 0, firstHit: [], kx: 0, ky: 0, x0: 0, y0: 0 };
        this.rumId = 0;
    }

    resetTempShip() {
        this.tempShip = {
            hits: 0,
            firstHit: [],
            kx: 0,
            ky: 0,
            x0: 0,
            y0: 0,
        };
    }

    makeShot(e?: MouseEvent) {
        let x, y, id;
        if (e !== undefined) {
            if (this.compShot) return;
            // if (this.turnDisplay.textContent === 'You Won!') {
            //     this.computerGrid.style.display = 'none';
            // }

            [x, y, id] = this.transformCoordsInMatrix(e, this.opponent);
        } else {
            // получаем координаты для выстрела компьютера
            let arr = this.getCoordsForShot();
            if (arr) {
                [x, y] = arr;
                id = Number(String(x) + String(y));
            }
        }
        const v = this.opponent[Number(x)][Number(y)];
        switch (v) {
            case 0: //промах
                this.miss(Number(x), Number(y), Number(id));
                break;
            case 1: // попадание
                this.hit(Number(x), Number(y), Number(id));
                break;
            case 3: // повторный обстрел
            case 4:
                this.turnDisplay.textContent = Translate.translateHTML(
                    "You've already fired at these coordinates!",
                    'Вы уже стреляли в эту координату'
                );
                setTimeout(() => {
                    this.turnDisplay.textContent = Translate.translateHTML('You Go', 'Вы ходите');
                }, 1000);
                break;
        }
    }
    transformCoordsInMatrix(e: MouseEvent, opponent: number[][]) {
        let x, y, id;
        if (this.rumId) {
            id = this.rumId;
            this.rumId = 0;
        } else {
            id = Number((e.target as HTMLDivElement).dataset.id);
        }

        if (id < 10) {
            x = 0;
        } else {
            x = Math.trunc(id / 10);
        }
        y = Controller.getDecimial(id);
        return [x, y, id];
    }
    // //Промах

    miss(x: number, y: number, id: number) {
        this.opponent[x][y] = 3; //промах
        // console.log(this.opponent);
        if (this.player === this.humanMatrix) {
            this.turnDisplay.textContent = Translate.translateHTML(
                'You Miss, Computer Go',
                'Вы Промахнулись, Компьютер ходит'
            );
            this.player = this.compMatrix;
            this.opponent = this.humanMatrix;
            this.compShot = true;
            this.computerField[id].classList.add('miss');
            setTimeout(() => this.makeShot(), 1000);
        } else {
            this.turnDisplay.textContent = Translate.translateHTML(
                'Computer Miss, You Go',
                'Компьютер промахнулся, вы ходите'
            );
            if (this.coordsAroundHit.length == 0 && this.tempShip.hits > 0) {
                // корабль потоплен, отмечаем useless cell вокруг него
                this.markUselessCellAroundShip();
                this.resetTempShip();
            }
            this.player = this.humanMatrix;
            this.opponent = this.compMatrix;
            this.compShot = false;
            this.userField[id].classList.add('miss');
        }
    }
    showInfo(info: string) {
        let sunkShip = document.querySelector(SELECTORS.info) as HTMLHeadingElement;
        sunkShip.textContent = `${Translate.translateHTML('You sunk', 'Вы потопили')} ${info}`;
        setTimeout(() => {
            sunkShip.textContent = '';
        }, 3000);
    }
    // //Попадание
    hit(x: number, y: number, id: number) {
        this.opponent[x][y] = 4;
        let squadron: Squadron;
        if (this.player === this.humanMatrix) {
            squadron = this.computerSquadron;
            if (this.computerField[id].classList.contains('help')) {
                this.computerField[id].classList.remove('help');
            }
            this.computerField[id].classList.add('boom');
            Achives.earnAchiveNotification('youdidit');
        } else {
            squadron = this.humanSquadron;
        }
        outerloop: for (let name in squadron) {
            const dataShip = squadron[name];
            for (let value of dataShip.arrDecks) {
                if (value[0] != x || value[1] != y) continue;
                dataShip.hits++;
                if (dataShip.hits < dataShip.arrDecks.length) {
                    break outerloop;
                }
                if (this.opponent === this.humanMatrix) {
                    this.tempShip.x0 = dataShip.x;
                    this.tempShip.y0 = dataShip.y;
                }
                if (this.player === this.humanMatrix) {
                    this.showInfo(name.slice(0, -1));
                }
                // console.log(squadron[name]);
                delete squadron[name];
                break outerloop;
            }
        }
        if (Object.keys(squadron).length == 0) {
            if (this.opponent === this.humanMatrix) {
                this.userField[id].classList.add('boom');
                this.turnDisplay.textContent = Translate.translateHTML('You Lose!', 'Вы Проиграли!');
            } else {
                this.turnDisplay.textContent = Translate.translateHTML('You Won!', 'Вы Выиграли');
            }
            if (location.hash == '#classic-page') {
                Achives.earnAchiveNotification('blackspot');
                const buttonReset = document.querySelector(SELECTORS.btnRestart) as HTMLButtonElement;
                buttonReset.style.display = 'block';
                buttonReset.addEventListener('click', () => {
                    sessionStorage.setItem('restartClassic', 'true');
                    location.reload();
                });
            }
            if (location.hash == '#single-player-page') {
                Achives.earnAchiveNotification('pirate');
                this.turnDisplay.textContent += Translate.translateHTML(
                    ' You complete this level, try another',
                    ' Вы завершили этот уровень, попробуйте другой'
                );
            }
            this.computerGrid.removeEventListener('click', this.listenerMakeShot);
        } else if (this.opponent === this.humanMatrix) {
            this.userField[id].classList.add('boom');
            let coords;
            this.tempShip.hits++;
            // отмечаем клетки по диагонали, где точно не может стоять корабль
            coords = [
                [x - 1, y - 1],
                [x - 1, y + 1],
                [x + 1, y - 1],
                [x + 1, y + 1],
            ];
            // проверяем и отмечаем полученные координаты клеток
            this.markUselessCell(coords);
            // формируем координаты обстрела вокруг попадания
            coords = [
                [x - 1, y],
                [x + 1, y],
                [x, y - 1],
                [x, y + 1],
            ];
            this.setCoordsAroundHit(x, y, coords);
            this.isShipSunk();

            // после небольшой задержки, компьютер делает новый выстрел
            setTimeout(() => this.makeShot(), 2000);
        }
    }

    markUselessCell(coords: number[][]) {
        let n = 1,
            x,
            y;
        for (let coord of coords) {
            x = coord[0];
            y = coord[1];
            // координаты за пределами игрового поля
            if (x < 0 || x > 9 || y < 0 || y > 9) continue;
            // по этим координатам в матрице уже прописан промах или маркер пустой клетки
            if (this.humanMatrix[x][y] == 2 || this.humanMatrix[x][y] == 3) continue;
            // прописываем значение, соответствующее маркеру пустой клетки
            this.humanMatrix[x][y] = 2;
            // вывоим маркеры пустых клеток по полученным координатам
            // для того, чтобы маркеры выводились поочерёдно, при каждой итерации
            // увеличиваем задержку перед выводом маркера
            // setTimeout(() => this.showIcons(human, coord, 'shaded-cell'), 350 * n);
            // удаляем полученные координаты из всех массивов
            this.removeCoordsFromArrays(coord);
            n++;
        }
    }
    setCoordsAroundHit(x: number, y: number, coords: number[][]) {
        let { firstHit, kx, ky } = this.tempShip;

        // массив пустой, значит это первое попадание в данный корабль
        if (firstHit.length == 0) {
            this.tempShip.firstHit = [x, y];
            // второе попадание, т.к. оба коэффициента равны 0
        } else if (kx == 0 && ky == 0) {
            // зная координаты первого и второго попадания,
            // можно вычислить направление расположение корабля
            this.tempShip.kx = Math.abs(firstHit[0] - x) == 1 ? 1 : 0;
            this.tempShip.ky = Math.abs(firstHit[1] - y) == 1 ? 1 : 0;
        }
        // проверяем корректность полученных координат обстрела
        for (let coord of coords) {
            x = coord[0];
            y = coord[1];
            // координаты за пределами игрового поля
            if (x < 0 || x > 9 || y < 0 || y > 9) continue;
            // по данным координатам установлен промах или маркер пустой клетки
            if (this.humanMatrix[x][y] != 0 && this.humanMatrix[x][y] != 1) continue;
            // валидные координаты добавляем в массив
            this.coordsAroundHit.push([x, y]);
        }
    }

    isShipSunk() {
        // max кол-во палуб у оставшихся кораблей
        let obj = Object.values(this.humanSquadron).reduce((a, b) => (a.arrDecks.length > b.arrDecks.length ? a : b));

        // определяем, есть ли ещё корабли, с кол-вом палуб больше, чем попаданий
        if (this.tempShip.hits >= obj.arrDecks.length || this.coordsAroundHit.length == 0) {
            // корабль потоплен, отмечаем useless cell вокруг него
            this.markUselessCellAroundShip();
            // очищаем массив coordsAroundHit и объект resetTempShip для
            // обстрела следующего корабля
            this.coordsAroundHit = [];
            this.resetTempShip();
        }
    }

    markUselessCellAroundShip() {
        // присваиваем переменным соответствующие значения из объекта tempShip
        const { hits, kx, ky, x0, y0 } = this.tempShip;
        let coords;

        // рассчитываем координаты пустых клеток
        // однопалубный корабль
        if (this.tempShip.hits == 1) {
            coords = [
                // верхняя
                [x0 - 1, y0],
                // нижняя
                [x0 + 1, y0],
                // левая
                [x0, y0 - 1],
                // правая
                [x0, y0 + 1],
            ];
            // многопалубный корабль
        } else {
            coords = [
                // левая / верхняя
                [x0 - kx, y0 - ky],
                // правая / нижняя
                [x0 + kx * hits, y0 + ky * hits],
            ];
        }
        this.markUselessCell(coords);
    }

    setCoordsShot() {
        // получаем координаты каждой клетки игрового поля
        // и записываем их в массив

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                this.coordsRandomHit.push([i, j]);
            }
        }
        // рандомно перемешиваем массив с координатами
        this.coordsRandomHit.sort((a, b) => Math.random() - 0.5);
        let x, y;
        // получаем координаты для обстрела по диагонали вправо-вниз
        for (let arr of Controller.START_POINTS[0]) {
            x = arr[0];
            y = arr[1];
            while (x <= 9 && y <= 9) {
                this.coordsFixedHit.push([x, y]);
                x = x <= 9 ? x : 9;
                y = y <= 9 ? y : 9;
                x++;
                y++;
            }
        }
        // получаем координаты для обстрела по диагонали вправо-вверх
        for (let arr of Controller.START_POINTS[1]) {
            x = arr[0];
            y = arr[1];
            while (x >= 0 && x <= 9 && y <= 9) {
                this.coordsFixedHit.push([x, y]);
                x = x >= 0 && x <= 9 ? x : x < 0 ? 0 : 9;
                y = y <= 9 ? y : 9;
                x--;
                y++;
            }
        }
        // изменим порядок следования элементов на обратный,
        this.coordsFixedHit = this.coordsFixedHit.reverse();
    }

    getCoordsForShot() {
        const coords =
            this.coordsAroundHit.length > 0
                ? this.coordsAroundHit.pop()
                : this.coordsFixedHit.length > 0
                ? this.coordsFixedHit.pop()
                : this.coordsRandomHit.pop();
        // удаляем полученные координаты из всех массивов
        this.removeCoordsFromArrays(coords as number[]);
        return coords;
    }

    removeCoordsFromArrays(coords: number[]) {
        if (this.coordsAroundHit.length > 0) {
            this.coordsAroundHit = Controller.removeElementArray(this.coordsAroundHit, coords as number[]);
        }
        if (this.coordsFixedHit.length > 0) {
            this.coordsFixedHit = Controller.removeElementArray(this.coordsFixedHit, coords as number[]);
        }
        this.coordsRandomHit = Controller.removeElementArray(this.coordsRandomHit, coords as number[]);
    }
    init() {
        const random = Controller.getRandom(1);
        this.player = random == 0 ? this.humanMatrix : this.compMatrix;
        this.opponent = this.player === this.humanMatrix ? this.compMatrix : this.humanMatrix;
        // генерируем координаты выстрелов компьютера и заносим их в
        // массивы coordsRandomHit и coordsFixedHit
        this.setCoordsShot();
        if (!this.isHandlerController) {
            this.listenerMakeShot = this.makeShot.bind(this);
            this.computerGrid.addEventListener('click', this.listenerMakeShot);
            this.isHandlerController = true;
        }
        if (this.player === this.humanMatrix) {
            this.compShot = false;
            this.turnDisplay.textContent = Translate.translateHTML('You Go', 'Ваш Ход');
        } else {
            this.turnDisplay.textContent = Translate.translateHTML('Computer Go', 'Ход Компьютера');
            this.compShot = true;
            setTimeout(() => this.makeShot(), 1000);
        }
    }
}
