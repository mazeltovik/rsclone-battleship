import gun from '../../../../assets/svg/gun.svg';
import blackspot from '../../../../assets/svg/blackspot.svg';
import pirate from '../../../../assets/svg/pirate.svg';
import bottle from '../../../../assets/svg/bottle.svg';
import undying from '../../../../assets/svg/undying.svg';

const achivesImages: { [key: string]: '*.svg' } = {
    youdidit: gun,
    blackspot: blackspot,
    pirate: pirate,
    whatabottle: bottle,
    undying: undying,
};

class Achives {
    private static createAchiveBlock(name: string, image: '*.svg') {
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
        const achives = Object.entries(achivesImages);
        const achivesHTML: HTMLElement[] = [];
        achives.forEach((achive) => {
            achivesHTML.push(this.createAchiveBlock(achive[0], achive[1]));
        });
        return achivesHTML;
    }
    static earnAchiveNotification(achive: string) {
        const body = document.body;
        const container = document.createElement('div');
        const title = document.createElement('h2');
        const achiveHTML = Achives.createAchiveBlock(achive, achivesImages[achive]);
        title.classList.add('earned-achive-container__title');
        title.setAttribute('data-language', 'earnedachivetitle');
        achiveHTML.classList.remove('achive-container_disabled');
        achiveHTML.classList.add('earned-achive-container__achive');
        container.classList.add('earned-achive-container');
        container.append(title, achiveHTML);
        body.append(container);
    }
}

export default Achives;
