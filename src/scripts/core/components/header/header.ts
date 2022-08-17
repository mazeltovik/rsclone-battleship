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
      pageMenuButtons.append(buttonHTML);
    });
    return pageMenuButtons;
  }

  render() {
    this.container.append(this.createMenu());
    return this.container;
  }
}

export default Header;
