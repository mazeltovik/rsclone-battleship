import Page from '../../core/templates/page';

class MenuPage extends Page {
    render() {
        const title = this.createHeaderTitle('Menu');
        this.container.append(title);
        return this.container;
    }
}

export default MenuPage;
