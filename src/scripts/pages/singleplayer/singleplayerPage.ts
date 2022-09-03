import Page from '../../core/templates/page';
import LevelRouteHTML from '../../utils/levelRouteHTML';
import levelOneHTML from '../../utils/level1';
class SinglePlayerPage extends Page {
    render() {
        const title = this.createHeaderTitle('Single Player');
        this.container.append(title);
        LevelRouteHTML(this.container);
        return this.container;
    }
}

export default SinglePlayerPage;
