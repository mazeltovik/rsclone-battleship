import Page from '../../core/templates/page';
import multiplayerGameHTML from '../../utils/multiplayerGameHTML';

class MultiPlayerPage extends Page {
    render() {
        const title = this.createHeaderTitle('Multiplayer');
        this.container.append(title);
        multiplayerGameHTML(this.container);
        return this.container;
    }
}

export default MultiPlayerPage;
