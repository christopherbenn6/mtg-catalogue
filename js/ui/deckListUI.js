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

export function renderPrivateDeckList(decks, container) {
  container.innerHTML =`<section><a class="create-new-deck" href="#">
    Create New Deck
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </a></section>`;

  decks.forEach(deck => {
    const section = document.createElement("section");

    section.innerHTML = `<a class="create-new-deck" href="deckbuilder.html?id=${deck.id}">
        ${deck.Title}
    </a>`;

    container.appendChild(section);
  })
}