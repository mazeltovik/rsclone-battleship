import Page from '../../core/templates/page';
import classicGameHTML from '../../utils/classicGameHTML';
import SELECTORS from '../../utils/selectors';
import shipsForClassicGame from '../../utils/ships';
import RandomComputerField from '../../core/logic/RandomComputerField';

class ClassicPage extends Page {
    render() {
        // this.gameModeStatusChange();
        const title = this.createHeaderTitle('Classic');
        this.container.append(title);
        classicGameHTML(this.container);
        return this.container;
    }
}

export default ClassicPage;
