import Component from '../../templates/component';
import logo from '../../../../assets/svg/rss-logo.svg';

const authors = [
    {
        author: 'agtugchik',
        github: 'https://github.com/agtugchik',
    },
    {
        author: 'ams2302',
        github: 'https://github.com/ams2302',
    },
    {
        author: 'mazeltovik',
        github: 'https://github.com/mazeltovik',
    },
];

class Footer extends Component {
    private createSchoolLogo() {
        const container = document.createElement('a');
        container.setAttribute('target', '_blank');
        container.href = 'https://rs.school/js/';
        const img = document.createElement('img');
        img.src = logo;
        img.height = 30;
        container.append(img);
        return container;
    }

    private createAuthors() {
        const container = document.createElement('div');
        container.append('Ⓒ ');
        authors.forEach((author) => {
            const authorHTML = document.createElement('a');
            authorHTML.setAttribute('target', '_blank');
            authorHTML.innerText = author.author;
            authorHTML.href = author.github;
            container.append(authorHTML, ', ');
        });
        container.append('2022');
        return container;
    }

    render() {
        this.container.append(this.createSchoolLogo(), this.createAuthors());
        return this.container;
    }
}

export default Footer;
