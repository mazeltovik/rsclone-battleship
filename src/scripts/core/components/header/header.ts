import Component from '../../templates/component';
import { PageIds } from '../../../app/app';
import options from '../../../../assets/svg/options.svg';
import achives from '../../../../assets/svg/achives.svg';
import leaderboard from '../../../../assets/svg/leaderboard.svg';
import close from '../../../../assets/svg/close.svg';
import AudioPlayer from './audio-player/audioPlayer';
import Authorization from './authorization/authorization';
import Translate from '../../logic/translate/translate';

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
        popUpWindow.classList.add('pop-up-window');
        // popUpWindow.append(popUpWindowClose);
        document.body.append(popUpWindow);
    }

    private static createPopUpTitle(title: string) {
        const titleHTML = document.createElement('h2');
        titleHTML.innerText = title[0].toUpperCase() + title.slice(1);
        titleHTML.classList.add(`pop-up-window__title`);
        return titleHTML;
    }

    private static openPopUpWindow() {
        const targets: { [key: string]: Element } = {
            options: <Element>document.querySelector('.menu__options'),
            achives: <Element>document.querySelector('.menu__achives'),
            leaderboard: <Element>document.querySelector('.menu__leaderboard'),
        };
        const popUpWindow = <Element>document.querySelector('.pop-up-window');

        for (const target in targets) {
            targets[target].addEventListener('click', (event) => {
                popUpWindow.classList.add('pop-up-window_active');
                popUpWindow.innerHTML = '';
                const target = <Element>document.querySelector('.pop-up-window');
                const popUpWindowClose = document.createElement('img');
                popUpWindowClose.src = close;
                popUpWindowClose.classList.add('pop-up-window__close');
                if (event.target === targets.options) {
                    target.append(
                        popUpWindowClose,
                        Header.createPopUpTitle('options'),
                        AudioPlayer.createAudioControls(),
                        Translate.createTranslateControls()
                    );
                }
            });
        }
    }

    private static closePopUpWindow() {
        const popUpWindow = <Element>document.querySelector('.pop-up-window');
        document.body.addEventListener('mousedown', (event) => {
            if (
                !(event.target as Element).closest('.pop-up-window') ||
                (event.target as Element).closest('.pop-up-window__close')
            )
                popUpWindow.classList.remove('pop-up-window_active');
        });
    }

    static popUpElementsListeners() {
        Header.createPopUpWindow();
        Header.openPopUpWindow();
        Header.closePopUpWindow();
        Header.createPopUpConfirm();
        Header.addMenuButtonsListeners();
    }

    private createMenu() {
        const pageMenuButtons = document.createElement('div');
        pageMenuButtons.classList.add('header-container__menu');
        menuButtons.forEach((button, index) => {
            const buttonHTML = document.createElement('button');
            if (index === 0) buttonHTML.disabled = true;
            buttonHTML.id = `${button.id}-button`;
            buttonHTML.innerText = button.text;
            buttonHTML.classList.add('menu__button');
            pageMenuButtons.append(buttonHTML);
        });
        this.createPopUpElements(pageMenuButtons);
        return pageMenuButtons;
    }

    private static addMenuButtonsListeners() {
        const menuButtons = document.querySelectorAll('.menu__button');
        const popUpConfirm = <Element>document.querySelector('.pop-up-confirm');
        menuButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                popUpConfirm.classList.add('pop-up-confirm_active');
                Header.popUpYesNoListeners(popUpConfirm, (event.target as Element).id, menuButtons);
                if ((menuButtons[0] as HTMLButtonElement).disabled === true)
                    (document.querySelector('.pop-up-confirm__button-yes') as HTMLButtonElement).click();
            });
        });
    }

    private static popUpYesNoListeners(target: Element, id: string, buttons: NodeListOf<Element>) {
        const buttonYes = <Element>document.querySelector('.pop-up-confirm__button-yes');
        const buttonNo = <Element>document.querySelector('.pop-up-confirm__button-no');
        const headerContainerMenu = <Element>document.querySelector('.header-container__menu');
        const headerContainerBurger = <Element>document.querySelector('.header-container__burger');
        const yesHandler = () => {
            headerContainerMenu.classList.remove('header-container__menu_active');
            headerContainerBurger.classList.remove('header-container__burger_active');
            buttonNo.removeEventListener('click', noHandler);
            target.classList.remove('pop-up-confirm_active');
            history.replaceState(null, 'null', `#${id.slice(0, -7)}`);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
            buttons.forEach((button) =>
                button.id === id
                    ? ((button as HTMLButtonElement).disabled = true)
                    : ((button as HTMLButtonElement).disabled = false)
            );
        };
        const noHandler = () => {
            buttonYes.removeEventListener('click', yesHandler);
            target.classList.remove('pop-up-confirm_active');
        };
        buttonYes.addEventListener('click', yesHandler, { once: true });
        buttonNo.addEventListener('click', noHandler, { once: true });
    }

    private static createPopUpConfirm() {
        const popUpConfirm = document.createElement('div');
        const warning = document.createElement('p');
        const buttonYes = document.createElement('button');
        const buttonNo = document.createElement('button');
        warning.innerHTML = 'Do you really want to leave?<br> All progress will be lost!';
        warning.classList.add('pop-up-confirm__text');
        buttonYes.innerText = 'Yes';
        buttonYes.classList.add('pop-up-confirm__button-yes');
        buttonNo.innerText = 'No';
        buttonNo.classList.add('pop-up-confirm__button-no');
        popUpConfirm.classList.add('pop-up-confirm');
        popUpConfirm.append(warning, buttonYes, buttonNo);
        document.body.append(popUpConfirm);
    }

    private createBurger() {
        const burger = document.createElement('div');
        const span = document.createElement('span');
        burger.append(span);
        burger.classList.add('header-container__burger');
        return burger;
    }

    render() {
        this.container.append(
            this.createMenu(),
            this.createBurger(),
            new AudioPlayer('div', 'audio').render(),
            new Authorization('div', 'header-container__authorization').render()
        );
        return this.container;
    }
}

export default Header;
