class Burger {
    private toogleActive(burger: Element, menu: Element) {
        burger.classList.toggle('header-container__burger_active');
        menu.classList.toggle('header-container__menu_active');
    }

    private removeActive(burger: Element, menu: Element) {
        burger.classList.remove('header-container__burger_active');
        menu.classList.remove('header-container__menu_active');
    }

    burgerHandler() {
        const burger = <Element>document.querySelector('.header-container__burger');
        const menu = <Element>document.querySelector('.header-container__menu');
        const menuItems = document.querySelectorAll('.menu__item');
        burger.addEventListener('click', () => {
            this.toogleActive(burger, menu);
        });
        menuItems.forEach((item) =>
            item.addEventListener('click', () => {
                this.removeActive(burger, menu);
            })
        );
    }
}

export default Burger;
