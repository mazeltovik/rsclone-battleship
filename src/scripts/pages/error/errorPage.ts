import Page from '../../core/templates/page';

class ErrorPage extends Page {
    render() {
        const title = this.createHeaderTitle(`Error 404: Page "${this.container.id}" Was Not Found`);
        this.container.append(title);
        return this.container;
    }
}

export default ErrorPage;
