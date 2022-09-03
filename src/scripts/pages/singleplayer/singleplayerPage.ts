import Page from '../../core/templates/page';
import classicGameHTML from '../../utils/classicGameHTML';
class SinglePlayerPage extends Page {
    render() {
        const title = this.createHeaderTitle('Single Player');
        this.container.append(title);
        classicGameHTML(this.container);
        return this.container;
    }
}

export default SinglePlayerPage;
