import Page from '../core/templates/page';
import MenuPage from '../pages/menu/menuPage';
import ClassicPage from '../pages/classic/classicPage';
import SinglePlayerPage from '../pages/singleplayer/singleplayerPage';
import MultiPlayerPage from '../pages/multiplayer/multiplayerPage';
import ErrorPage from '../pages/error/errorPage';
import Header from '../core/components/header/header';
import Footer from '../core/components/footer/footer';
import Burger from '../core/components/header/burger/burger';
import ClassicGame from '../core/bin/classicGame';
import shipsForClassicGame from '../utils/ships';
import Translate from '../core/logic/translate/translate';
import MultiplayerGame from '../core/bin/multiplayerGame';
import Achives from '../core/components/achives/achives';
import Authorization from '../core/components/header/authorization/authorization';
import LevelRoute from '../core/logic/levelRoute';

export const enum PageIds {
    MenuPageId = 'menu-page',
    ClassicPageId = 'classic-page',
    SinglePlayerPageId = 'single-player-page',
    MultiPlayerPageId = 'multi-player-page',
}

class App {
    static user: any = JSON.parse(<string>sessionStorage.getItem('user'));
    private static container: HTMLElement = document.body;
    private static currentPageId: string = 'current-page';
    private header: Header;
    private footer: Footer;
    private burger: Burger;

    constructor() {
        this.header = new Header('header', 'header-container');
        this.footer = new Footer('footer', 'footer-container');
        this.burger = new Burger();
    }

    private replaceHash() {
        history.replaceState(null, 'null', '#menu-page');
    }

    private enableRouteChange() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            const oldCurrentPage = <Element>document.querySelector('#current-page');
            const newCurrentPage = App.renderNewPage(hash);
            (oldCurrentPage.parentNode as Element).replaceChild(newCurrentPage, oldCurrentPage);
            if (hash === 'menu-page') Page.gameModeStatusChange('remove');
            else Page.gameModeStatusChange('add');
            switch (hash) {
                case 'classic-page':
                    new ClassicGame(shipsForClassicGame, 10).build();
                    Translate.translate(sessionStorage.getItem('language') || 'en');
                    break;
                case 'multi-player-page':
                    new MultiplayerGame().start();
                    break;
                case 'single-player-page':
                    new LevelRoute().build();
                    Translate.translate(sessionStorage.getItem('language') || 'en');
                    break;
            }
            Translate.translate(sessionStorage.getItem('language') || 'en');
        });
    }

    static renderNewPage(idPage: string) {
        let page: Page;

        switch (idPage) {
            case PageIds.MenuPageId:
                page = new MenuPage(idPage);
                break;
            case PageIds.ClassicPageId:
                page = new ClassicPage(idPage);
                break;
            case PageIds.SinglePlayerPageId:
                page = new SinglePlayerPage(idPage);
                break;
            case PageIds.MultiPlayerPageId:
                page = new MultiPlayerPage(idPage);
                break;
            default:
                page = new ErrorPage(idPage);
                break;
        }

        const pageHTML = page.render();
        pageHTML.id = App.currentPageId;
        return pageHTML;
    }

    run() {
        this.replaceHash();
        Achives.init();
        App.container.append(this.header.render(), App.renderNewPage('menu-page'), this.footer.render());
        this.burger.burgerHandler();
        Header.popUpElementsListeners();
        this.enableRouteChange();
        Translate.translate(sessionStorage.getItem('language') || 'en');
        Authorization.authorizationCheck();
        Authorization.unloadListener();
        if (sessionStorage.getItem('restartClassic') === 'true') {
            (<HTMLButtonElement>document.querySelector('#classic-page-button')).click();
            sessionStorage.setItem('restartClassic', 'false');
        }
    }
}

export default App;
