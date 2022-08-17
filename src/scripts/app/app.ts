import Page from "../core/templates/page";
import MenuPage from "../pages/menu/menuPage";
import ClassicPage from "../pages/classic/classicPage";
import SinglePlayerPage from "../pages/singleplayer/singleplayerPage";
import MultiPlayerPage from "../pages/multiplayer/multiplayerPage";
import ErrorPage from "../pages/error/errorPage";
import Header from "../core/components/header/header";
import Footer from "../core/components/footer/footer";

export const enum PageIds {
  MenuPageId = 'menu-page',
  ClassicPageId = 'classic-page',
  SinglePlayerPageId = 'single-player-page',
  MultiPlayerPageId = 'multi-player-page',
}

class App {
  private static container: HTMLElement = document.body;
  private static currentPageId: string = 'current-page';
  private initialPage: MenuPage;
  private header: Header;
  private footer: Footer;

  constructor() {
    this.initialPage = new MenuPage('menu-page');
    this.header = new Header('header', 'header-container');
    this.footer = new Footer('footer', 'footer-container');
  }

  private replaceHash() {
    history.replaceState(null, 'null', '#menu-page');
  }

  private enableRouteChange() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      const oldCurrentPage = <Element>document.querySelector('#current-page')
      const newCurrentPage = App.renderNewPage(hash);
      (oldCurrentPage.parentNode as Element).replaceChild(newCurrentPage, oldCurrentPage);
    })
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
    App.container.append(
      this.header.render(),
      App.renderNewPage('single-player-page'),
      this.footer.render()
    );
    this.enableRouteChange();
  }
}

export default App;
