import Component from '../../../templates/component';
import userIcon from '../../../../../assets/svg/user-icon.svg';
import { getUser, registrationUser, pushUser } from '../../../../serverInteraction/server';
import App from '../../../../app/app';
import Translate from '../../../logic/translate/translate';
import { achivesImages } from '../../achives/achives';

class Authorization extends Component {
    private body = document.body;

    private addIcon() {
        const icon = document.createElement('img');
        icon.src = userIcon;
        icon.width = 30;
        this.authorizationListeners(icon);
        return icon;
    }

    private authorizationListeners(target: Element) {
        target.addEventListener('click', () => {
            const authorizationWindow = <Element>document.querySelector('.pop-up-authorization');
            authorizationWindow.classList.toggle('pop-up-authorization_active');
        });
        this.body.addEventListener('click', (event) => {
            const authorizationWindow = <Element>document.querySelector('.pop-up-authorization');
            if (
                !(event.target as Element).closest('.header-container__authorization') &&
                !(event.target as Element).closest('.pop-up-authorization__form')
            )
                authorizationWindow.classList.remove('pop-up-authorization_active');
        });
    }

    static unloadListener() {
        window.addEventListener('beforeunload', async () => {
            if (App.user) await pushUser(App.user);
        });
    }

    static authorizationCheck() {
        const userIcon = <HTMLElement>document.querySelector('.header-container__authorization');
        if (sessionStorage.getItem('logined') === 'true') userIcon.style.backgroundColor = 'green';
    }

    private async loginHandler(inputName: HTMLInputElement, inputPass: HTMLInputElement) {
        const userIcon = <HTMLElement>document.querySelector('.header-container__authorization');
        const form = <HTMLElement>document.querySelector('.pop-up-authorization__form');
        const popUp = <HTMLElement>document.querySelector('.pop-up-authorization');
        const error = document.querySelector('.form__error');
        const player = <HTMLAudioElement>document.querySelector('.audio-player');
        try {
            const user = await getUser(inputName.value, inputPass.value);
            App.user = user;
            const achives = Object.keys(achivesImages);
            const volume = App.user.options.volume;
            const language = App.user.options.language;
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('logined', 'true');
            userIcon.style.backgroundColor = 'green';
            popUp.classList.remove('pop-up-authorization_active');
            sessionStorage.setItem('volume', volume);
            player.volume = Number(sessionStorage.getItem('volume')) / 100;
            sessionStorage.setItem('language', language);
            Translate.translate(language);
            achives.forEach((achive) => {
                const sessionAchive = sessionStorage.getItem(achive);
                if (sessionAchive === 'false') sessionStorage.setItem(achive, user.achives[achive]);
                else if (sessionAchive === 'true') user.achives[achive] = 'true';
            });
        } catch {
            error?.remove();
            const err = document.createElement('p');
            err.classList.add('form__error');
            const language = sessionStorage.getItem('language');
            !language || language === 'en'
                ? (err.innerText = 'Invalid username or password')
                : (err.innerText = 'Неверное имя или пароль');
            form.append(err);
        }
        userIcon.addEventListener('click', () => {
            const error = document.querySelector('.form__error');
            error?.remove();
            inputName.value = '';
            inputPass.value = '';
        });
    }

    private async registrationHandler(inputName: HTMLInputElement, inputPass: HTMLInputElement) {
        const form = <HTMLElement>document.querySelector('.pop-up-authorization__form');
        const error = document.querySelector('.form__error');
        error?.remove();
        const newUser = await registrationUser(inputName.value, inputPass.value);
        if (newUser.status === 400) {
            const err = document.createElement('p');
            err.classList.add('form__error');
            const language = sessionStorage.getItem('language');
            !language || language === 'en'
                ? (err.innerText = 'Username is not available')
                : (err.innerText = 'Имя пользователя недоступно');
            form.append(err);
        }
    }

    private buttonListener(
        target: Element,
        inputName: HTMLInputElement,
        inputPass: HTMLInputElement,
        type: 'log' | 'reg'
    ) {
        target.addEventListener('click', async (event) => {
            const checkLength = inputName.value.length > 0 && inputPass.value.length > 0;
            if (checkLength) event.preventDefault();
            if (type === 'log' && checkLength) await this.loginHandler(inputName, inputPass);
            if (type === 'reg' && checkLength) await this.registrationHandler(inputName, inputPass);
        });
    }

    private createAuthorizationForm() {
        const container = document.createElement('div');
        const form = document.createElement('form');
        const labelUserName = document.createElement('label');
        const userNameText = document.createElement('p');
        const inputUserName = document.createElement('input');
        const labelPassword = document.createElement('label');
        const passwordText = document.createElement('label');
        const inputPassword = document.createElement('input');
        const loginButton = document.createElement('button');
        const registerButton = document.createElement('button');
        labelUserName.setAttribute('for', 'user-name');
        userNameText.innerText = 'User:';
        userNameText.setAttribute('data-language', 'username');
        labelUserName.append(userNameText, inputUserName);
        inputUserName.setAttribute('type', 'text');
        inputUserName.setAttribute('placeholder', 'Enter Username');
        inputUserName.setAttribute('name', 'user-name');
        inputUserName.required = true;
        inputUserName.id = 'username-input';
        labelPassword.setAttribute('for', 'user-password');
        passwordText.innerText = 'Password:';
        passwordText.setAttribute('data-language', 'password');
        labelPassword.append(passwordText, inputPassword);
        inputPassword.setAttribute('type', 'password');
        inputPassword.setAttribute('placeholder', 'Enter Password');
        inputPassword.setAttribute('name', 'user-password');
        inputPassword.required = true;
        inputPassword.id = 'password-input';
        loginButton.innerText = 'Log In';
        loginButton.setAttribute('data-language', 'login');
        loginButton.classList.add('form__login');
        this.buttonListener(loginButton, inputUserName, inputPassword, 'log');
        registerButton.innerText = 'Registration';
        registerButton.setAttribute('data-language', 'registration');
        registerButton.classList.add('form__registration');
        this.buttonListener(registerButton, inputUserName, inputPassword, 'reg');
        form.classList.add('pop-up-authorization__form');
        form.append(labelUserName, labelPassword, loginButton, registerButton);
        container.classList.add('pop-up-authorization');
        container.append(form);
        return container;
    }

    render() {
        this.container.append(this.addIcon());
        this.body.append(this.createAuthorizationForm());
        return this.container;
    }
}

export default Authorization;
