import { getPrintsId } from '../js/api.js'

const params = new URLSearchParams(window.location.search);
const filters = {};

for (const [key, value] of params.entries()) {
    filters[key] = value ? decodeURIComponent(value).replace(/\+/g, " ") : null;
}

const allData = await getPrintsId(filters.id);
const data = allData.data[0];
console.log(data);

function setCardInfo (data) {

    let image;
    if (data.card_faces && !data.image_uris) {
        image = data.card_faces[0].image_uris.normal;
    } else if (data.image_uris) {
        image = data.image_uris.normal;
    }

    const text = `<div class="single-flex"><img src="${image}" class="mtg-card big-mtg-card container"><div class="single-text">
        <section class="single-banner container">
            <div class="name-line">
                <h2>${data.name}</h2>
            </div>
            <p class="type-line">${data.type_line}</p>
            <p>${data.oracle_text}</p>
            ${data.flavor_text ? `<p class="flavor-text">${data.flavor_text}</p>` : ``}
        </section>
        <div class="single-extras-flex container">
            <section class="legalities">
                <h2>Legalities</h2>
                <p class="legality">Standard: <span class="${data.legalities.standard}">${data.legalities.standard.toUpperCase().replace("_", " ")}</span></p>
                <p class="legality">Modern: <span class="${data.legalities.modern}">${data.legalities.modern.toUpperCase().replace("_", " ")}</span></p>
                <p class="legality">Commander: <span class="${data.legalities.commander}">${data.legalities.commander.toUpperCase().replace("_", " ")}</span></p>
                <p class="legality">Legacy: <span class="${data.legalities.legacy}">${data.legalities.legacy.toUpperCase().replace("_", " ")}</span></p>
                <p class="legality">Vintage: <span class="${data.legalities.vintage}">${data.legalities.vintage.toUpperCase().replace("_", " ")}</span></p>
                <p class="legality">Pauper: <span class="${data.legalities.pauper}">${data.legalities.pauper.toUpperCase().replace("_", " ")}</span></p>
                <p class="legality">Historic: <span class="${data.legalities.historic}">${data.legalities.historic.toUpperCase().replace("_", " ")}</span></p>
                <p class="legality">Timeless: <span class="${data.legalities.timeless}">${data.legalities.timeless.toUpperCase().replace("_", " ")}</span></p>
                <p class="legality">Oathbreaker: <span class="${data.legalities.oathbreaker}">${data.legalities.oathbreaker.toUpperCase().replace("_", " ")}</span></p>
            </section>
        </div>
    </div></div>`;
    document.querySelector('#card-info').innerHTML += text;
}

setCardInfo(data);