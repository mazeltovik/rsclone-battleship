import gun from '../../../../assets/svg/gun.svg';
import blackspot from '../../../../assets/svg/blackspot.svg';
import pirate from '../../../../assets/svg/pirate.svg';
import bottle from '../../../../assets/svg/bottle.svg';
import undying from '../../../../assets/svg/undying.svg';

class Achives {
    private static createAchiveBlock(image: '*.svg', name: string) {
        const container = document.createElement('div');
        const achiveIcon = document.createElement('img');
        const achiveName = document.createElement('h3');
        const achiveInfo = document.createElement('p');
        achiveIcon.classList.add('achive-container__icon');
        achiveIcon.src = image;
        achiveIcon.width = 70;
        achiveName.classList.add('achive-container__name');
        achiveName.setAttribute('data-language', `${name}name`);
        achiveInfo.classList.add('achive-container__info');
        achiveInfo.setAttribute('data-language', `${name}info`);
        container.classList.add('achive-container');
        if (!sessionStorage.getItem(name)) container.classList.add('achive-container_disabled');
        container.append(achiveIcon, achiveName, achiveInfo);
        return container;
    }
    static createAchivesBlocks() {
        const achives: Array<['*.svg', string]> = [
            [gun, 'youdidit'],
            [blackspot, 'blackspot'],
            [pirate, 'pirate'],
            [bottle, 'whatabottle'],
            [undying, 'undying'],
        ];
        const achivesHTML: HTMLElement[] = [];
        achives.forEach((achive) => {
            achivesHTML.push(this.createAchiveBlock(achive[0], achive[1]));
        });
        return achivesHTML;
    }
}

export default Achives;
