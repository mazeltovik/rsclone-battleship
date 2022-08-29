export default function multiplayerGameHTML(elem: HTMLElement) {
    elem.innerHTML = `
    <div class="container">
    <div class="battleship-grid grid-user"></div>
    <div class="battleship-grid grid-enemy"></div>
  </div>

  <div class="container hidden-info">
    <div class="setup-buttons" id="setup-buttons">
      <button id="start" class="btn">Start Game</button>
      <button id="rotate" class="btn">Rotate Your Ships</button>
    </div>
    <h3 id="whose-go" class="info-text">Your Go</h3>
    <h3 id="info" class="info-text"></h3>
  </div>

  <div class="container">
    <div class="grid-display">
      <div class="ship singleDeck-container" id = singledeck1 draggable="true"><div id="singleDeck-0"></div></div>
      <div class="ship singleDeck-container"  id = singledeck2 draggable="true"><div id="singleDeck-0"></div></div>
      <div class="ship singleDeck-container"  id = singledeck3 draggable="true"><div id="singleDeck-0"></div></div>
      <div class="ship singleDeck-container"   id = singledeck4 draggable="true"><div id="singleDeck-0"></div></div>
      <div class="ship doubleDeck-container" id = doubledeck1 draggable="true"><div id="doubleDeck-0"></div><div id="doubleDeck-1"></div></div>
      <div class="ship doubleDeck-container" id = doubledeck2 draggable="true"><div id="doubleDeck-0"></div><div id="doubleDeck-1"></div></div>
      <div class="ship doubleDeck-container" id = doubledeck3 draggable="true"><div id="doubleDeck-0"></div><div id="doubleDeck-1"></div></div>
      <div class="ship tripleDeck-container" id = tripledeck1 draggable="true"><div id="tripleDeck-0"></div><div id="tripleDeck-1"></div><div id="tripleDeck-2"></div></div>
      <div class="ship tripleDeck-container" id = tripledeck2 draggable="true"><div id="tripleDeck-0"></div><div id="tripleDeck-1"></div><div id="tripleDeck-2"></div></div>
      <div class="ship fourDeck-container" id = fourdeck1 draggable="true"><div id="fourDeck-0"></div><div id="fourDeck-1"></div><div id="fourDeck-2"></div><div id="fourDeck-3"></div></div>
    </div>
  </div>
    `;
}