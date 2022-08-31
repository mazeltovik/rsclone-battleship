import Component from '../../../templates/component';
import userIcon from '../../../../../assets/svg/user-icon.svg';

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
        loginButton.setAttribute('type', 'submit');
        registerButton.innerText = 'Registration';
        registerButton.setAttribute('data-language', 'registration');
        registerButton.setAttribute('type', 'submit');
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
