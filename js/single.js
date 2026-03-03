import { getCardById } from '../js/api.js'

const params = new URLSearchParams(window.location.search);
const filters = {};

for (const [key, value] of params.entries()) {
    filters[key] = value ? decodeURIComponent(value).replace(/\+/g, " ") : null;
}

const data = await getCardById(filters.id);

function setCardInfo (data) {

    let image;
    if (data.card_faces && !data.image_uris) {
        image = data.card_faces[0].image_uris.normal;
    } else if (data.image_uris) {
        image = data.image_uris.normal;
    }

    const img = `<div class="single-flex"><img src="${image}" class="mtg-card big-mtg-card">`;
    const text = `<div class="single-text">
        <section>
            <h2>${data.name}</h2>
            <p>${data.oracle_text}</p>
        </section>
        <section class="legalities">
            <h2>Legalities</h2>
            <p class="legality">Standard: <span>${data.legalities.standard}</span></p>
            <p class="legality">Modern: <span>${data.legalities.modern}</span></p>
            <p class="legality">Commander: <span>${data.legalities.commander}</span></p>
            <p class="legality">Legacy: <span>${data.legalities.legacy}</span></p>
            <p class="legality">Vintage: <span>${data.legalities.vintage}</span></p>
            <p class="legality">Pauper: <span>${data.legalities.pauper}</span></p>
            <p class="legality">Historic: <span>${data.legalities.historic}</span></p>
            <p class="legality">Timeless: <span>${data.legalities.timeless}</span></p>
            <p class="legality">Oathbreaker: <span>${data.legalities.oathbreaker}</span></p>
        </section>
    </div></div>`;
    document.querySelector('#card-info').innerHTML += img + text;
}

setCardInfo(data);