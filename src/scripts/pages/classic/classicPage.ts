import Page from '../../core/templates/page';
import classicGameHTML from '../../utils/classicGameHTML';
import SELECTORS from '../../utils/selectors';
import shipsForClassicGame from '../../utils/ships';
import RandomComputerField from '../../core/logic/RandomComputerField';

class ClassicPage extends Page {
    static createGame() {
        enum BasicSettings {
            Width = 10,
        }

        type Ship = {
            name: string;
            directions: number[][];
        };

        //Переменные необходимые для игры

        let isHorizontal = true;
        let selectedShipNameWithIndex: string;
        let draggedShip: HTMLDivElement;
        let draggedShipLength: string;
        let lastChildId: string;
        let userSquares: HTMLDivElement[];
        let displayGrid: HTMLDivElement;
        let allShipsPlaced = false;

        // Set используется для отслеживания недопустимых клеток для расстановки кораблей
        let set = new Set();

        // Класс отвечающий за формирование матрицы для радномного раставления кораблей
        let randomComputerField = new RandomComputerField(shipsForClassicGame, 10);

        //Игровой класс

        class ClassGame {
            // Статический метод для добавления красных полей вокруг кораблей,
            // чтобы показать, в какие поля нельзя ставить корабль
            static addRedClass(id: number) {
                document.querySelector(`[data-id="${id}"]`)?.classList.add('red');
            }
            userGrid;
            computerGrid;
            userField: HTMLDivElement[];
            computerField: HTMLDivElement[];
            ships;
            btnRotate;
            constructor() {
                this.userGrid = document.querySelector(SELECTORS.userGrid) as HTMLDivElement;
                this.computerGrid = document.querySelector(SELECTORS.computerGrid) as HTMLDivElement;
                this.btnRotate = document.querySelector(SELECTORS.rotateButton) as HTMLButtonElement;
                this.ships = document.querySelectorAll(SELECTORS.ships);
                this.userField = [];
                this.computerField = [];
            }

            // Функция создает игровое поле
            createField(grid: HTMLDivElement, squares: HTMLDivElement[]) {
                for (let i = 0; i < BasicSettings.Width * BasicSettings.Width; i++) {
                    const square = document.createElement('div');
                    square.dataset.id = String(i);
                    grid.appendChild(square);
                    squares.push(square);
                }
                displayGrid = document.querySelector(SELECTORS.displayGrid) as HTMLDivElement;
            }
            // Генерирует поле компьютера и заполняет его
            generateComputerClass() {
                let arr: number[] = [];
                randomComputerField.matrix.forEach((v) => {
                    arr.push(...v);
                });
                arr.forEach((v, i) => {
                    if (v === 1) this.computerField[i].classList.add('taken', 'red');
                });
            }

            // Функция отвечате за поворот кораблей в горизонтально и вертикальное положение
            rotate() {
                if (isHorizontal) {
                    document.querySelectorAll(SELECTORS.doubleDeckContainer).forEach((v) => {
                        v.classList.toggle(SELECTORS.doubleDeckVertical);
                    });
                    document.querySelectorAll(SELECTORS.tripleDeckContainer).forEach((v) => {
                        v.classList.toggle(SELECTORS.tripleDeckVertical);
                    });
                    document.querySelector(SELECTORS.fourDeck)?.classList.toggle(SELECTORS.fourDeckVertical);
                    isHorizontal = false;
                    return;
                }
                if (!isHorizontal) {
                    document.querySelectorAll(SELECTORS.doubleDeckContainer).forEach((v) => {
                        v.classList.toggle(SELECTORS.doubleDeckVertical);
                    });
                    document.querySelectorAll(SELECTORS.tripleDeckContainer).forEach((v) => {
                        v.classList.toggle(SELECTORS.tripleDeckVertical);
                    });
                    document.querySelector(SELECTORS.fourDeck)?.classList.toggle(SELECTORS.fourDeckVertical);
                    isHorizontal = true;
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

            // Функия вешает обработчики drag&drop

            moveAround() {
                this.ships.forEach((ship) => ship.addEventListener('dragstart', this.dragStart));
                this.userField.forEach((square) => square.addEventListener('dragstart', this.dragStart));
                this.userField.forEach((square) => square.addEventListener('dragover', this.dragOver));
                this.userField.forEach((square) => square.addEventListener('dragenter', this.dragEnter));
                this.userField.forEach((square) => square.addEventListener('dragleave', this.dragLeave));
                this.userField.forEach((square) => square.addEventListener('drop', this.dragDrop));
                this.userField.forEach((square) => square.addEventListener('dragend', this.dragEnd));
                this.ships.forEach((ship) =>
                    ship.addEventListener('mousedown', (e) => {
                        let elem = e.target as HTMLDivElement;
                        selectedShipNameWithIndex = elem.id;
                    })
                );
            }
            dragStart(this: HTMLDivElement) {
                draggedShip = this;
                draggedShipLength = this.childNodes.length.toString();
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
                if (draggedShip) {
                    lastChildId = (draggedShip?.lastChild as HTMLDivElement).id;
                    let shipNameWithLastId = lastChildId;
                    let shipClass = shipNameWithLastId.slice(0, -2);
                    let lastShipIndex = parseInt(shipNameWithLastId.slice(-1));
                    let shipLastId = lastShipIndex + parseInt(String(this.dataset.id));
                    const notAllowedHorizontal = [
                        0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 22, 32, 42, 52,
                        62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93,
                    ];
                    const notAllowedVertical = [
                        99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76,
                        75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60,
                    ];
                    let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
                    let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex);
                    let selectedShipIndex = parseInt(selectedShipNameWithIndex.slice(-1));
                    shipLastId = shipLastId - selectedShipIndex;
                    if (
                        isHorizontal &&
                        !newNotAllowedHorizontal.includes(shipLastId) &&
                        !set.has(Number(this.dataset.id))
                    ) {
                        for (let i = 0; i < Number(draggedShipLength); i++) {
                            const filterHorizontal = (newId: number, id: number) =>
                                (newId - 9) % 10 === 0 || newId % 10 === 0 ? id : newId;

                            const id = parseInt(String(this.dataset.id)) - selectedShipIndex + i;
                            console.log(id);
                            set.add(id);
                            if (i === 0) {
                                set.add(filterHorizontal(id + 10, id));
                                console.log(filterHorizontal(id + 10, id));
                                set.add(filterHorizontal(id - 10, id));
                                set.add(filterHorizontal(id - 1, id));
                                set.add(filterHorizontal(id - 11, id));
                                set.add(filterHorizontal(id + 9, id));
                            }
                            set.forEach((v) => {
                                ClassGame.addRedClass(Number(v));
                            });
                            /////////////////////////////////////////////
                            // let id1 = parseInt(String(this.dataset.id)) - selectedShipIndex + i + 1;
                            // set.add(id1);
                            // ClassGame.addRedClass(id1);
                            // // let id2 = parseInt(String(this.dataset.id)) - selectedShipIndex + i + 2;
                            // // set.add(id2);
                            // // ClassGame.addRedClass(id2);
                            // // ////////////////////////////////////////////////////////
                            // let id3 = parseInt(String(this.dataset.id)) - selectedShipIndex + i - 2;
                            // set.add(id3);
                            // ClassGame.addRedClass(id3);
                            // ///////////////////////////////////////////////////////
                            // let id4 = parseInt(String(this.dataset.id)) - selectedShipIndex + i - 1;
                            // set.add(id4);
                            // ClassGame.addRedClass(id4);
                            // //////////////////////////////////////////////////////////
                            // let id5 = parseInt(String(this.dataset.id)) - selectedShipIndex + i - 1;
                            // set.add(id5);
                            // ClassGame.addRedClass(id5);
                            // /////////////////////////////////////////////////////////
                            // let id6 = parseInt(String(this.dataset.id)) - selectedShipIndex + i - 1;
                            // set.add(id6);
                            // ClassGame.addRedClass(id6);
                            // /////////////////////////////////////////////////////////
                            // let id7 = parseInt(String(this.dataset.id)) - selectedShipIndex + i + 10;
                            // set.add(id7);
                            // ClassGame.addRedClass(id7);
                            // /////////////////////////////////////
                            // let id8 = parseInt(String(this.dataset.id)) - selectedShipIndex + i - 10;
                            // set.add(id8);
                            // ClassGame.addRedClass(id8);
                            // /////////////////////////////////////////////
                            // let id9 = parseInt(String(this.dataset.id)) - selectedShipIndex + i + 9;
                            // set.add(id9);
                            // ClassGame.addRedClass(id9);
                            // //////////////////////////////////////////////////
                            // let id10 = parseInt(String(this.dataset.id)) - selectedShipIndex + i - 9;
                            // set.add(id10);
                            // // ClassGame.addRedClass(id10);
                            // //////////////////////////////////////////////
                            // let id11 = parseInt(String(this.dataset.id)) - selectedShipIndex + i + 11;
                            // set.add(id11);
                            // ClassGame.addRedClass(id11);
                            // //////////////////////////////////////////////////
                            // let id12 = parseInt(String(this.dataset.id)) - selectedShipIndex + i - 11;
                            // set.add(id12);
                            // ClassGame.addRedClass(id12);
                            console.log(set);
                            let directionClass: string = 'nope';
                            if (Number(draggedShipLength) == 1) {
                                userSquares[parseInt(String(this.dataset.id)) - selectedShipIndex + i].classList.add(
                                    'taken',
                                    'horizontal',
                                    'single',
                                    shipClass
                                );
                            } else {
                                if (i === 0) directionClass = 'start';
                                if (i === Number(draggedShipLength) - 1) directionClass = 'end';
                                userSquares[parseInt(String(this.dataset.id)) - selectedShipIndex + i].classList.add(
                                    'taken',
                                    'horizontal',
                                    directionClass,
                                    shipClass
                                );
                            }
                        }
                    } else if (
                        !isHorizontal &&
                        !newNotAllowedVertical.includes(shipLastId) &&
                        !set.has(Number(this.dataset.id))
                    ) {
                        for (let i = 0; i < Number(draggedShipLength); i++) {
                            // set.add(parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i - 9);
                            // ///////////////////////////////////////
                            // set.add(parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i - 19);
                            // ////////////////////////////////////////////
                            // set.add(parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i - 29);
                            // ///////////////////////////////////////////////////////////////////////////
                            // set.add(parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i + 11);
                            // /////////////////////////////////////////
                            // set.add(parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i + 1);
                            // /////////////////////////////////////////
                            // set.add(parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i + 2);
                            // //////////////////////////////////////////////////
                            // set.add(parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i - 10);
                            // ////////////////////////////////////////////////////
                            // set.add(parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i - 20);
                            // //////////////////////////////////////////////////////////////////////////////
                            // set.add(parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i);
                            // /////////////////////////////////////////////////////
                            // set.add(parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i + 2 - 10);
                            // //////////////////////////////////////////////////////
                            // set.add(parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i + 2 - 20);
                            // ////////////////////////////////////////////////
                            console.log(set);
                            let directionClass: string = 'nope';
                            if (Number(draggedShipLength) === 1) {
                                userSquares[parseInt(String(this.dataset.id)) - selectedShipIndex + i].classList.add(
                                    'taken',
                                    'horizontal',
                                    'single',
                                    shipClass
                                );
                            } else {
                                if (i === 0) directionClass = 'start';
                                if (i === Number(draggedShipLength) - 1) directionClass = 'end';

                                userSquares[
                                    parseInt(String(this.dataset.id)) - selectedShipIndex + 10 * i - 9
                                ].classList.add('taken', 'vertical', directionClass, shipClass);
                            }
                        }
                    } else return;

                    displayGrid.removeChild(draggedShip);
                    if (!displayGrid.querySelector('.ship')) allShipsPlaced = true;
                }
            }
            dragEnd() {
                // console.log('dragend')
            }
        }
        // Генерирует разметку для страницы
        let classicGame = new ClassGame();

        // Генерирует поле
        classicGame.createField(classicGame.userGrid, classicGame.userField);
        // Копируем поля пользователя в переменную, тк в обработчике this призваевается event.target
        userSquares = classicGame.userField;
        classicGame.createField(classicGame.computerGrid, classicGame.computerField);
        // Вешаем обработчик события на кнопку поворота кораблей
        classicGame.btnClickRotate();
        //Создаем матрицу с кораблями для компьютера
        randomComputerField.randomLocationShips();
        console.log(randomComputerField.matrix);
        console.log(randomComputerField.squadron);
        classicGame.generateComputerClass();
        // Вешаем обработчики drag&drop
        classicGame.moveAround();
    }
    render() {
        // this.gameModeStatusChange();
        const title = this.createHeaderTitle('Classic');
        this.container.append(title);
        classicGameHTML(this.container);
        return this.container;
    }
}

export default ClassicPage;
