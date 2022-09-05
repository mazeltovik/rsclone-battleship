export default function LevelRouteHTML(elem: HTMLElement) {
    elem.innerHTML = `
    <div class="level_container">
    <button data-language="level1" class = 'level'></button>
    <button data-language="level2" class = 'level'></button>
    <button data-language="level3" class = 'level'></button>
  </div>
    `;
}
