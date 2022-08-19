import Component from "../../templates/component";
import { PageIds } from "../../../app/app";

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
  private createMenu() {
    const pageMenuButtons = document.createElement('div');
    menuButtons.forEach((button) => {
      const buttonHTML = document.createElement('a');
      buttonHTML.href = `#${button.id}`;
      buttonHTML.innerText = button.text;
      buttonHTML.classList.add('menu__item')
      pageMenuButtons.append(buttonHTML);
    });
    pageMenuButtons.classList.add('header-container__menu');
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
