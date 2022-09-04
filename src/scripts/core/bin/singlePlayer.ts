import ClassicGame from './classicGame';
import RandomComputerField from '../logic/RandomComputerField';
import shipsLevelOne from '../../utils/shipsLevelOne';
import SELECTORS from '../../utils/selectors';
import tube from '../../utils/tube';
import bottle from '../../utils/bottle';
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
    constructor(...args: [Ships, number]) {
        super(...args);
        this.helpCount = 0;
        this.rumCount = 0;
        this.tubeElem = document.querySelector(SELECTORS.tube) as HTMLParagraphElement;
        this.bottleRum = document.querySelector(SELECTORS.rum) as HTMLParagraphElement;
    }
    createToolSpan(parent: HTMLParagraphElement, content: string) {
        let elem = document.createElement('span');
        elem.textContent = content;
        elem.classList.add('tooltiptext');
        parent.append(elem);
    }
    renderPerks() {
        this.tubeElem.innerHTML = tube;
        this.createToolSpan(this.tubeElem, 'Shows one of the decks of an enemy ship');
        this.bottleRum.innerHTML = bottle;
        this.createToolSpan(this.bottleRum, 'Yyyyeee baby, its rum!');
    }
    perksEvent() {
        this.tubeElem.addEventListener('click', this.helpHandler.bind(this));
        this.bottleRum.addEventListener('click', this.rumHandler.bind(this));
    }
    rumHandler() {
        if (!this.rumCount && this.allShipsPlaced) {
            let randomValue = RandomComputerField.getRandomDiraction(99);
            this.controller.rumId = randomValue;
            this.rumCount += 1;
        } else return;
    }

    showHelp(id: number) {
        if (this.helpCount == 0) {
            this.computerField[id].classList.add('help');
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
