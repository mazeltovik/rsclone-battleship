class Translate {
    static createTranslateControls() {
        const label = document.createElement('label');
        const title = document.createElement('h3');
        const select = document.createElement('select');
        const russian = document.createElement('option');
        const english = document.createElement('option');
        title.innerText = 'Language:';
        title.classList.add('pop-up-window__language-title');
        select.classList.add('pop-up-window__language-select');
        russian.innerText = 'Russian';
        russian.value = 'ru';
        english.innerText = 'English';
        english.value = 'en';
        english.selected = true;
        select.append(russian, english);
        select.addEventListener('change', (event) => Translate.languageHandler(event));
        label.append(title, select);
        label.classList.add('pop-up-window__language-label');
        return label;
    }

    static languageHandler(event: Event) {
        console.log((event.target as HTMLSelectElement).value);
    }
}

export default Translate;
