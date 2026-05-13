export function renderSidebar(isOwned, card) {
  if (isOwned) {
    renderPrivateSidebar(card);
  } else {
    renderPublicSidebar(card);
  }
}

function renderPublicSidebar(card) {
  // Notes: 
  // When the format is singleton, do not show add, instead just a "remove from deck"
  // When the card is 2 sided, add a transform button
  const sidebar = document.querySelector('.build-sidebar');
  let image;
  let price = card.prices.usd ? `<p class="price">${card.prices.usd} USD </p>` : "";
  if (card.card_faces != null) {
    image = card.card_faces[0].image_uris.normal;
  } else {
    image = card.image_uris.normal;
  }
  sidebar.innerHTML = `<div>
    <img class="mtg-card display-card" src="${image}">
    ${price}
    <div class="button-wrapper">
      <a href="single.html?id=${card.id}">More Card Info</a>
    </div>
  </div>`;
}

function renderPrivateSidebar(card) {
  // Notes: 
  // When the card is 2 sided, add a transform button
  const sidebar = document.querySelector('.build-sidebar');
  let image;
  let price = card.prices.usd ? `<p class="price">${card.prices.usd} USD </p>` : "";

  let elidgebleCommander = false;

  // If the card is legendary
  if (card.type_line.toLowerCase().includes("legendary")) {
    // If the card is a creature, vehicle or spacecraft
    if (card.type_line.toLowerCase().includes("creature") || card.type_line.toLowerCase().includes("spacecraft") || card.type_line.toLowerCase().includes("vehicle")) {
      elidgebleCommander = true;
    } else if (card.type_line.toLowerCase().includes("planeswalker")) {
      if (card.oracle_text.toLowerCase().includes("commander")) {
        elidgebleCommander = true;
      }
    }
  }

  let setCommander = "";
  if (elidgebleCommander) {
    setCommander = `<button type="button">Set As Commander</button>`;
  }

  if (card.card_faces != null) {
    image = card.card_faces[0].image_uris.normal;
  } else {
    image = card.image_uris.normal;
  }
  sidebar.innerHTML = `<div>
    <img class="mtg-card display-card" src="${image}">
    ${price}
    <div class="button-wrapper">
      <div class="quantity-buttons">
        <button class="minus" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
          </svg>
        </button>
        <button class="plus" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
      <a href="single.html?id=${card.id}">More Card Info</a>
      ${setCommander}
    </div>
  </div>`;
}