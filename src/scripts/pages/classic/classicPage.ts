import Page from "../../core/templates/page";

class ClassicPage extends Page {
  render() {
    const title = this.createHeaderTitle('Classic');
    this.container.append(title);
    return this.container;
  }
}

export default ClassicPage;
  