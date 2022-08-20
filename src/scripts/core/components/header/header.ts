import Component from "../../templates/component";
import { PageIds } from "../../../app/app";
import options from "../../../../assets/svg/options.svg";
import achives from "../../../../assets/svg/achives.svg";
import leaderboard from "../../../../assets/svg/leaderboard.svg";
import close from "../../../../assets/svg/close.svg";
const obj: { [key: string]: string } = {
  options,
  achives,
  leaderboard,
};
const popUpElements = ['options', 'achives', 'leaderboard'];
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

    popUpElements.forEach((element) => {
      const button = document.createElement('img');
      button.src = obj[element];
      button.width = 40;
      button.classList.add(`menu__${element}`);
      target.append(button);
    });
  }

  private static createPopUpWindow() {
    const popUpWindow = document.createElement('div');
    const popUpWindowClose = document.createElement('img');
    popUpWindowClose.src = close;
    popUpWindowClose.classList.add('pop-up-window_close');
    popUpWindow.classList.add('pop-up-window');
    popUpWindow.append(popUpWindowClose);
    document.body.append(popUpWindow);
  }

  private static openPopUpWindow() {
    const targets: { [key: string]: Element } = {
      options: <Element>document.querySelector('.menu__options'),
      achives: <Element>document.querySelector('.menu__achives'),
      leaderboard: <Element>document.querySelector('.menu__leaderboard'),
    }
    const popUpWindow = <Element>document.querySelector('.pop-up-window');

    for (const target in targets) {
      targets[target].addEventListener('click', () => {
        popUpWindow.classList.add('pop-up-window_active')
      });
    }
  }

  private static closePopUpWindow() {
    const popUpWindow = document.querySelector('.pop-up-window')
    document.body.addEventListener('mousedown', (event) => {
      if (!(event.target === popUpWindow)
        && popUpWindow?.classList.contains('pop-up-window_active')) popUpWindow.classList.remove('pop-up-window_active');
    });
  }

  static popUpElementsListeners() {
    Header.createPopUpWindow();
    Header.openPopUpWindow();
    Header.closePopUpWindow();
    Header.createPopUpConfirm();
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

  private static createPopUpConfirm() {
    const popUpConfirm = document.createElement('div');
    const warning = document.createElement('p');
    const buttonYes = document.createElement('button');
    const buttonNo = document.createElement('button');
    warning.innerHTML = 'Do you really want to leave?<br> All progress will be lost!';
    warning.classList.add('pop-up-confirm__text')
    buttonYes.innerText = 'Yes';
    buttonYes.classList.add('pop-up-confirm__button-yes')
    buttonNo.innerText = 'No';
    buttonNo.classList.add('pop-up-confirm__button-no')
    popUpConfirm.classList.add('pop-up-confirm');
    popUpConfirm.append(warning, buttonYes, buttonNo);
    document.body.append(popUpConfirm)
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
