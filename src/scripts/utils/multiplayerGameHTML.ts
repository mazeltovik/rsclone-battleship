export default function multiplayerGameHTML(elem: HTMLElement) {
    elem.innerHTML = `
    <style>
    .chat{
      margin-right: 1rem;
    position: relative;
    height: 30%;
    width: 15%;
    margin-left: auto;
    bottom: 22%;

    }
    #message-container {
      width:100%;
      position:absolute;
      max-width: 1200px;
      height: 70%;
      overflow-y: scroll;
      background-color:white;
    }

    #message-container div {
      background-color: #CCC;
      padding: 5px;
    }

    #message-container div:nth-child(2n) {
      background-color: #FFF;
    }

    #send-container {
      width:100%;
      position:absolute;
      padding-bottom: 30px;
      bottom: 0;
      background-color: white;
      display: flex;
    }

    #message-input {
      flex-grow: 1;
    }
    #send-button{
      height:35px;
    }
  </style>
  <div class="multiplayer-container">
    <div class="multiplayer-container__block">
        <h2 class="multiplayer-container__title">Player</h2>
        <p class="multiplayer-container__text">Connection: <span class="multiplayer-container__status player-connection"></span></p>
        <p class="multiplayer-container__text">Ready: <span class="multiplayer-container__status player-ready">not ready</span></p>
    </div>
    <div class="multiplayer-container__block">
        <h2 class="multiplayer-container__title">Enemy</h2>
        <p class="multiplayer-container__text">Connection: <span class="multiplayer-container__status enemy-connection">disconnected</span></p>
        <p class="multiplayer-container__text">Ready: <span class="multiplayer-container__status enemy-ready">not ready</span></p>
    </div>
  </div>
  <div class="container">
    <div class="battleship-grid grid-user"></div>
    <div class="battleship-grid grid-enemy"></div>
  </div>

  <div class="container hidden-info">
    <div class="setup-buttons" id="setup-buttons">
      <button id="start" class="btn disabled" disabled>Start Game</button>
    </div>
    <h3 id="whose-go" class="info-text"></h3>
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
  <div class='chat'>
  <div id="message-container"></div>
  <form id="send-container">
    <input type="text" id="message-input">
    <button type="submit" id="send-button">Send</button>
  </form>
  </div>
    `;
}
