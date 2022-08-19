import Page from "../../core/templates/page";

class MultiPlayerPage extends Page {
  render() {
    const title = this.createHeaderTitle('Multiplayer');
    this.container.append(title);
    return this.container;
  }
}

export default MultiPlayerPage;
