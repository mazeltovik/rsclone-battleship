import Component from "../../templates/component";
import { PageIds } from "../../../app/app";
import options from "../../../../assets/svg/options.svg";
import achives from "../../../../assets/svg/achives.svg";
import leaderboard from "../../../../assets/svg/leaderboard.svg";
const obj: { [key: string]: string } = {
  options,
  achives,
  leaderboard,
};

const menuButtons = [
  {
    id: PageIds.MenuPageId,
    text: 'Menu',
  },
  {
    id: PageIds.ClassicPageId,
    text: 'Classic Game',
  },
  {
    id: PageIds.SinglePlayerPageId,
    text: 'Single Player',
  },
  {
    id: PageIds.MultiPlayerPageId,
    text: 'Multiplayer',
  },
];

class Header extends Component {
  private createPopUpElements(target: HTMLElement) {
    const elements = ['options', 'achives', 'leaderboard'];
    elements.forEach((element) => {
      const button = document.createElement('img');
      button.src = obj[element];
      button.width = 40;
      button.classList.add(`menu__${element}`);
      target.append(button);
    });
  }

  private createMenu() {
    const pageMenuButtons = document.createElement('div');
    pageMenuButtons.classList.add('header-container__menu');
    menuButtons.forEach((button) => {
      const buttonHTML = document.createElement('a');
      buttonHTML.href = `#${button.id}`;
      buttonHTML.innerText = button.text;
      buttonHTML.classList.add('menu__item')
      pageMenuButtons.append(buttonHTML);
    });
    this.createPopUpElements(pageMenuButtons);
    return pageMenuButtons;
  }

  private createBurger() {
    const burger = document.createElement('div');
    const span = document.createElement('span');
    burger.append(span);
    burger.classList.add('header-container__burger');
    return burger;
  }

  render() {
    this.container.append(this.createMenu(), this.createBurger());
    return this.container;
  }
}

export default Header;
