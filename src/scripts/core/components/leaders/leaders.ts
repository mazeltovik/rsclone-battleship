import { getLeaders } from '../../../serverInteraction/server';

class Leaders {
    static async addLeaders() {
        const leaders = await getLeaders();
        console.log(leaders);
        const elements: Array<Element> = [];
        for (let i = 0; i < 9; i += 2) {
            const container = document.createElement('div');
            container.classList.add('leaders-container');
            const leaderContainer = document.createElement('div');
            leaderContainer.classList.add('leaders-container__item');
            leaderContainer.innerHTML = `<div class = "item__position">${i + 1}.</div>
            <div class = "item__name">${leaders[i] ? leaders[i][0] : ''}</div>
            <div class = "item__score">${leaders[i] ? leaders[i][1] : ''}</div>`;
            const anotherLeaderContainer = document.createElement('div');
            anotherLeaderContainer.classList.add('leaders-container__item');
            anotherLeaderContainer.innerHTML = `<div class = "item__position">${i + 2}.</div>
            <div class = "item__name">${leaders[i + 1] ? leaders[i + 1][0] : ''}</div>
            <div class = "item__score">${leaders[i + 1] ? leaders[i + 1][1] : ''}</div>`;
            container.append(leaderContainer, anotherLeaderContainer);
            elements.push(container);
        }
        return elements;
    }
}

export default Leaders;
