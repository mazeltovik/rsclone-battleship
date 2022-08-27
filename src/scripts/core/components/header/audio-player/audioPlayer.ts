import Component from '../../../templates/component';

class AudioPlayer extends Component {
    private createAudioPlayer() {
        const audioPlayer = document.createElement('audio');
        audioPlayer.classList.add('audio-player');
        audioPlayer.src = require('../../../../../assets/sound/main-track.mp3');
        audioPlayer.loop = true;
        console.log(sessionStorage.getItem('volume'));
        audioPlayer.volume = Number(sessionStorage.getItem('volume')) / 100 || 0.5;
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
        const title = document.createElement('h3');
        slider.type = 'range';
        slider.addEventListener('input', (event) => {
            const volume = Number((event.target as HTMLInputElement).value);
            sessionStorage.setItem('volume', String(volume));
            console.log(volume);
            (audioPlayer as HTMLAudioElement).volume = volume / 100;
        });
        slider.value = <string>sessionStorage.getItem('volume') || '50';
        slider.classList.add('pop-up-window__volume-slider');
        title.innerText = 'Volume: ';
        title.classList.add('pop-up-window__volume-title');
        label.append(title, slider);
        label.classList.add('pop-up-window__volume-label');
        return label;
    }

    render() {
        this.container.append(this.createAudioPlayer());
        return this.container;
    }
}

export default AudioPlayer;
