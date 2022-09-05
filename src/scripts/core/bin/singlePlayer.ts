import ClassicGame from './classicGame';
import RandomComputerField from '../logic/RandomComputerField';
import shipsLevelOne from '../../utils/shipsLevelOne';
import SELECTORS from '../../utils/selectors';
import tube from '../../utils/tube';
import bottle from '../../utils/bottle';
import gun from '../../utils/gun';
import Translate from '../logic/translate/translate';
import Achive from '../components/achives/achives';
type Ship = {
    name: string;
    directions: number[][];
};
type Obj = {
    [key: string]: number;
};
type Ships = {
    [key: string]: Obj;
};
export default class SinglePlayer extends ClassicGame {
    helpCount;
    tubeElem;
    bottleRum;
    rumCount;
    gunElem;
    gunCount;
    constructor(...args: [Ships, number]) {
        super(...args);
        this.helpCount = 0;
        this.rumCount = 0;
        this.tubeElem = document.querySelector(SELECTORS.tube) as HTMLParagraphElement;
        this.bottleRum = document.querySelector(SELECTORS.rum) as HTMLParagraphElement;
        this.gunElem = document.querySelector(SELECTORS.gun) as HTMLParagraphElement;
        this.gunCount = 0;
    }
    createToolSpan(parent: HTMLParagraphElement, content: string) {
        let elem = document.createElement('span');
        elem.textContent = content;
        elem.classList.add('tooltiptext');
        parent.append(elem);
    }
    renderPerks() {
        this.tubeElem.innerHTML = tube;
        this.createToolSpan(
            this.tubeElem,
            Translate.translateHTML(
                'Shows one of the decks of an enemy ship',
                'Показывает один сегмент вражеского корабля'
            )
        );
        this.bottleRum.innerHTML = bottle;
        this.createToolSpan(
            this.bottleRum,
            Translate.translateHTML('Yyyyeee baby, its rum!', 'Ееееееее, детка, это ром!')
        );
        this.gunElem.innerHTML = gun;
        this.createToolSpan(
            this.gunElem,
            Translate.translateHTML(
                'Shows three coordinates, one of which is the deck of the ship',
                'Показывает три координаты, одна из которых - вражеский корабль'
            )
        );
    }
    perksEvent() {
        this.tubeElem.addEventListener('click', this.helpHandler.bind(this));
        this.bottleRum.addEventListener('click', this.rumHandler.bind(this));
        this.gunElem.addEventListener('click', this.gunHandler.bind(this));
    }
    rumHandler() {
        if (!this.rumCount && this.allShipsPlaced) {
            let randomValue = RandomComputerField.getRandomDiraction(99);
            this.controller.rumId = randomValue;
            this.bottleRum.style.opacity = '0.5';
            this.rumCount += 1;
            Achive.earnAchiveNotification('whatabottle');
        } else return;
    }

    shuffle(array: number[]) {
        return array.sort(() => Math.random() - 0.5);
    }

    gunHandler() {
        if (this.gunCount == 0 && this.allShipsPlaced) {
            let result = this.gunCoords();
            result.forEach((v) => {
                this.computerField[v].classList.add('help');
                setTimeout(() => {
                    this.computerField[v].classList.remove('help');
                }, 5000);
            });
            this.gunCount += 1;
            this.gunElem.style.opacity = '0.5';
        } else return;
    }

    gunCoords() {
        let rows = [];
        let temp: number[] = [];
        let result = [];
        rows.push(
            RandomComputerField.getRandomDiraction(9),
            RandomComputerField.getRandomDiraction(9),
            RandomComputerField.getRandomDiraction(9)
        );
        rows.forEach((v) => {
            outerloop: for (let i = 0; i < this.computer.matrix.length; i++) {
                if (v == 0) continue;
                if (this.computer.matrix[v][i] == 1) {
                    temp.push(Number(`${v}${i}`));
                    break outerloop;
                }
            }
        });
        temp = this.shuffle(temp);
        if (temp) {
            result.push(temp[0]);
        }
        result.push(
            RandomComputerField.getRandomDiraction(99),
            RandomComputerField.getRandomDiraction(99),
            RandomComputerField.getRandomDiraction(99)
        );
        result = result.filter((v) => v !== undefined);
        if (result.length > 3) {
            result = result.slice(0, 3);
        }
        return result;
    }

    showHelp(id: number) {
        if (this.helpCount == 0) {
            this.computerField[id].classList.add('help');
            this.tubeElem.style.opacity = '0.5';
        }
    }
    helpHandler() {
        if (this.allShipsPlaced) {
            outerLoop: for (let i = 0; i < this.computer.matrix.length; i++) {
                for (let j = 0; j < this.computer.matrix.length; j++) {
                    if (this.computer.matrix[i][j] == 1) {
                        let id = `${i}${j}`;
                        this.showHelp(Number(id));
                        break outerLoop;
                    }
                }
            }
            this.helpCount += 1;
        } else return;
    }
    build(): void {
        super.build();
        this.renderPerks();
        this.perksEvent();
    }
}
