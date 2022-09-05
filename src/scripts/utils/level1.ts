export default function levelOneHTML(elem: HTMLElement) {
    elem.innerHTML = `
    <div class="container">
    <div class="battleship-grid grid-user"></div>
    <div class="battleship-grid grid-computer"></div>
  </div>

  <div class="container hidden-info">
    <div class="setup-buttons" id="setup-buttons">
      <button id="start" data-language="buttonStartGame" class="btn"></button>
      <button id="drop" data-language="buttonDragDrop" class="btn"></button>
      <button id="random" data-language="buttonRandomPlaceShips" class="btn"></button>
      <button id="restart" data-language="buttonRestart" class="btn"></button>
    </div>
    <h3 id="whose-go" class="info-text">Please place all ships</h3>
    <h3 id="info" class="info-text"></h3>
  </div>

  <div class="container">
    <div class="grid-display">
      <div class="ship singleDeck-container" id = singledeck1 draggable="true"><div id="singleDeck-0"></div></div>
      <div class="ship singleDeck-container"  id = singledeck2 draggable="true"><div id="singleDeck-0"></div></div>
      <div class="ship singleDeck-container"  id = singledeck3 draggable="true"><div id="singleDeck-0"></div></div>
      <div class="ship singleDeck-container"  id = singledeck4 draggable="true"><div id="singleDeck-0"></div></div>
      <div class="ship doubleDeck-container" id = doubledeck1 draggable="true"><div id="doubleDeck-0"></div><div id="doubleDeck-1"></div></div>
      <div class="ship doubleDeck-container" id = doubledeck2 draggable="true"><div id="doubleDeck-0"></div><div id="doubleDeck-1"></div></div>
      <div class="ship doubleDeck-container" id = doubledeck3 draggable="true"><div id="doubleDeck-0"></div><div id="doubleDeck-1"></div></div>
    </div>
  </div>
  <div class = "perks">
    <p class = "tube tooltip"><p>
    <p class ="rum tooltip"></p>
    <p class =  "gun tooltip"></p>
  </div>
    `;
}
