import levelOneHTML from "../../utils/level1";
import levelTwoHTML from "../../utils/level2";
import levelThreeHTML from "../../utils/level3";
import SinglePlayer from "../bin/singlePlayer";
import shipsLevelOne from "../../utils/shipsLevelOne";
import shipsLevelTwo from "../../utils/shipsLevelTwo";
import shipsForClassicGame from "../../utils/ships";
import SELECTORS from "../../utils/selectors";
import Translate from "./translate/translate";
export default class LevelRoute{
    route;
    currentPage;
    constructor(){
        this.route = document.querySelector(SELECTORS.levelRoute) as HTMLDivElement;
        this.currentPage = document.querySelector(SELECTORS.currentPage) as HTMLDivElement;
    }
    changeLevel(level:string){
        switch(level){
            case '1':
                levelOneHTML(this.currentPage);
                new SinglePlayer(shipsLevelOne,10).build();
                Translate.translate(sessionStorage.getItem('language') || 'en');
                break;
            case '2':
                levelTwoHTML(this.currentPage);
                new SinglePlayer(shipsLevelTwo,10).build();
                Translate.translate(sessionStorage.getItem('language') || 'en');
                break;
            case '3':
                levelThreeHTML(this.currentPage);
                new SinglePlayer(shipsForClassicGame,10).build();
                Translate.translate(sessionStorage.getItem('language') || 'en');
            
        }
    }
    routeHandler(){
        this.route.addEventListener('click',(e)=>{
            let elem = e.target as HTMLButtonElement;
            if(elem.classList.contains('level')){
                let level = elem.textContent?.match(/\d/);
                if(level){
                    this.changeLevel(level[0]);
                }
            }
        })
    }
    build(){
        this.routeHandler();
    }
}