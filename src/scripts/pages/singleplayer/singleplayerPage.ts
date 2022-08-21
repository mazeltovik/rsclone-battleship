import Page from '../../core/templates/page';

class SinglePlayerPage extends Page {
    render() {
        const title = this.createHeaderTitle('Single Player');
        this.container.append(title);
        return this.container;
    }
}

export default SinglePlayerPage;
