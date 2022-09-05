import dictionary from './dictionary';
import App from '../../../app/app';

class Translate {
    static translateHTML(enText: string, ruText: string) {
        const language = sessionStorage.getItem('language') || 'en';
        return language === 'en' ? enText : ruText;
    }

    static createTranslateControls() {
        const label = document.createElement('label');
        const title = document.createElement('h3');
        const select = document.createElement('select');
        const russian = document.createElement('option');
        const english = document.createElement('option');
        title.innerText = 'Language:';
        title.setAttribute('data-language', 'language');
        title.classList.add('pop-up-window__language-title');
        select.classList.add('pop-up-window__language-select');
        russian.innerText = 'Russian';
        russian.setAttribute('data-language', 'russian');
        russian.value = 'ru';
        english.innerText = 'English';
        english.setAttribute('data-language', 'english');
        english.value = 'en';
        (sessionStorage.getItem('language') || 'en') === 'en' ? (english.selected = true) : (russian.selected = true);
        select.append(russian, english);
        select.addEventListener('change', (event) => Translate.languageHandler(event));
        label.append(title, select);
        label.classList.add('pop-up-window__language-label');
        return label;
    }

    static languageHandler(event: Event) {
        const language = (event.target as HTMLSelectElement).value;
        sessionStorage.setItem('language', language);
        if (App.user) {
            App.user.options.language = String(language);
            sessionStorage.setItem('user', JSON.stringify(App.user));
        }
        Translate.translate(language);
    }
    static translate(language: string) {
        const elements = document.querySelectorAll('[data-language]');
        const usernameInput = document.querySelector('#username-input');
        const passwordInput = document.querySelector('#password-input');
        if (language === 'en') {
            usernameInput?.setAttribute('placeholder', 'Enter Username');
            passwordInput?.setAttribute('placeholder', 'Enter Password');
        } else if (language === 'ru') {
            usernameInput?.setAttribute('placeholder', 'Пользователь');
            passwordInput?.setAttribute('placeholder', 'Введите Пароль');
        }
        elements.forEach((element) => {
            (element as HTMLElement).innerHTML = dictionary[language][String(element.getAttribute('data-language'))];
        });
    }
}

export default Translate;
