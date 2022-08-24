import Page from '../../core/templates/page';
import '../../../assets/svg/wave.svg';

class MenuPage extends Page {
    private addBackground() {
        const target = this.container;
        const ocean = document.createElement('div');
        const firsWave = document.createElement('div');
        const secondWave = document.createElement('div');
        target.classList.add('menu-page');
        ocean.classList.add('menu-page__ocean');
        firsWave.classList.add('ocean__wave');
        secondWave.classList.add('ocean__wave');
        ocean.append(firsWave, secondWave);
        target.append(ocean);
    }

    render() {
        this.addBackground();
        return this.container;
    }
}

export default MenuPage;
