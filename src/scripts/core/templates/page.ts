abstract class Page {
    protected container: HTMLElement;

    constructor(id: string) {
        this.container = document.createElement('div');
        this.container.id = id;
    }

    protected createHeaderTitle(text: string) {
        const headerTitle = document.createElement('h1');
        headerTitle.innerText = text;
        return headerTitle;
    }

    static gameModeStatusChange(type: 'add' | 'remove') {
        const headerContainer = <Element>document.querySelector('.header-container');
        const headerContainerMenu = <Element>document.querySelector('.header-container__menu');
        const currentPage = <Element>document.querySelector('#current-page');
        const burger = <Element>document.querySelector('.header-container__burger');
        const authorization = <Element>document.querySelector('.header-container__authorization');
        if (type === 'add') {
            headerContainer.classList.add('header-container_game-mode');
            headerContainerMenu.classList.add('header-container__menu_game-mode');
            currentPage.classList.add('current-page_game-mode');
            burger.classList.add('header-container__burger_game-mode');
            authorization.classList.add('header-container__authorization_game-mode');
        } else if (type === 'remove') {
            headerContainer.classList.remove('header-container_game-mode');
            headerContainerMenu.classList.remove('header-container__menu_game-mode');
            currentPage.classList.remove('current-page_game-mode');
            burger.classList.remove('header-container__burger_game-mode');
            authorization.classList.remove('header-container__authorization_game-mode');
        }
    }

    render() {
        return this.container;
    }
}

export default Page;
