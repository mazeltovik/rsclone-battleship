import App from '../../../../app/app';
import Component from '../../../templates/component';

class AudioPlayer extends Component {
    private createAudioPlayer() {
        const audioPlayer = document.createElement('audio');
        audioPlayer.classList.add('audio-player');
        audioPlayer.src = require('../../../../../assets/sound/main-track.mp3');
        audioPlayer.loop = true;
        if (sessionStorage.getItem('volume')) audioPlayer.volume = Number(sessionStorage.getItem('volume')) / 100;
        else audioPlayer.volume = 0.5;
        let play = setTimeout(async function tryPlay() {
            try {
                await audioPlayer.play();
            } catch {
                play = setTimeout(tryPlay, 100);
            }
        }, 100);
        return audioPlayer;
    }

    static createAudioControls() {
        const label = document.createElement('label');
        const audioPlayer = <Element>document.querySelector('.audio-player');
        const slider = document.createElement('input');
        const numberValue = document.createElement('output');
        const title = document.createElement('h3');
        slider.type = 'range';
        slider.addEventListener('input', (event) => {
            const volume = Number((event.target as HTMLInputElement).value);
            sessionStorage.setItem('volume', String(volume));
            if (App.user) {
                App.user.options.volume = String(volume);
                sessionStorage.setItem('user', JSON.stringify(App.user));
            }
            (audioPlayer as HTMLAudioElement).volume = volume / 100;
        });
        slider.value = sessionStorage.getItem('volume') || '50';
        slider.classList.add('pop-up-window__volume-slider');
        slider.setAttribute('oninput', 'outputVolume.value = this.value');
        title.innerText = 'Volume:';
        title.setAttribute('data-language', 'volume');
        title.classList.add('pop-up-window__volume-title');
        numberValue.id = 'outputVolume';
        numberValue.value = <string>sessionStorage.getItem('volume') || '50';
        label.append(title, slider, numberValue);
        label.classList.add('pop-up-window__volume-label');
        return label;
    }

    render() {
        this.container.append(this.createAudioPlayer());
        return this.container;
    }
}

export default AudioPlayer;
