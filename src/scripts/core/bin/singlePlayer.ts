import ClassicGame from "./classicGame";
import RandomComputerField from '../logic/RandomComputerField';
import shipsLevelOne from '../../utils/shipsLevelOne'
import SELECTORS from '../../utils/selectors'
import tube from '../../utils/tube'
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
export default class SinglePlayer extends ClassicGame{
    helpCount;
    tubeElem;
    bottleRum;
    constructor(...args:[Ships,number]){
        super(...args);
        this.helpCount = 0;
        this.tubeElem = document.querySelector(SELECTORS.tube) as HTMLParagraphElement;
        this.bottleRum = document.querySelector(SELECTORS.rum) as HTMLParagraphElement;
    }
    renderPerks(){
        this.tubeElem.innerHTML = tube;
        this.bottleRum.innerHTML = bottle;
    }
    perksEvent(){
        this.tubeElem.addEventListener('click',this.helpHandler.bind(this));
        this.bottleRum.addEventListener('click',this.rumHandler.bind(this));
    }
    rumHandler(){
        let randomValue = RandomComputerField.getRandomDiraction(99);
        console.log(randomValue);
        this.controller.rumId = randomValue;
    }

    showHelp(id:number){
        if(this.helpCount == 0){
            this.computerField[id].classList.add('help');
        }
    }
    helpHandler(){
        if(this.allShipsPlaced){
            outerLoop:for(let i = 0;i<this.computer.matrix.length;i++){
                for(let j = 0;j<this.computer.matrix.length;j++){
                    if(this.computer.matrix[i][j] == 1){
                        let id = `${i}${j}`;
                        this.showHelp(Number(id));
                        break outerLoop;
                    }
                }
            }
            this.helpCount+=1; 
        } else return;
    }
    build(): void {
        super.build();
        this.renderPerks();
        this.perksEvent();
    }
}