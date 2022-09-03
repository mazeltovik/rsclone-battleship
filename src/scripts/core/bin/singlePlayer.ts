import ClassicGame from "./classicGame";
import RandomComputerField from '../logic/RandomComputerField';
import shipsLevelOne from '../../utils/shipsLevelOne'
import SELECTORS from '../../utils/selectors'
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
}