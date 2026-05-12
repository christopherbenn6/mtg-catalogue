export function renderPublicDeckList(decks, container) {
  container.innerHTML = "";

  decks.forEach(deck => {
    const section = document.createElement("section");

    section.innerHTML = `<a id="${deck.id}" href="deckbuilder.html?id=${deck.id}">
        <h3>${deck.Title}</h3>
      </a>`;

    container.appendChild(section);
  });
}