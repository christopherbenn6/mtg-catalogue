import { getPrintsByOracleId, getPrintsById, getAllSymbols } from '../js/api.js'

const params = new URLSearchParams(window.location.search);
const filters = {};

for (const [key, value] of params.entries()) {
    filters[key] = value ? decodeURIComponent(value).replace(/\+/g, " ") : null;
}

let imageData = null

// Which Image Info to use (if clicks on different print, it changes to id rather than oracle id)
const allData = await getPrintsByOracleId(filters.oracle_id);
if(filters.id) {
    imageData = await getPrintsById(filters.id)
}

// gets card_face[0] or card_face[1]
let transformFace;
if(filters.transform == "true") {
    transformFace = 1;
} else {
    transformFace = 0;
}

// Get all symbols to edit text
const symbolData = await getAllSymbols();
console.log(symbolData)
let symbolImagesAssoc = {};
symbolData.data.forEach(symbol => {
    symbolImagesAssoc[symbol.symbol] = symbol.svg_uri;
});

function exchangeWithSymbols(string, symbolImagesAssoc) {
    Object.entries(symbolImagesAssoc).forEach(([key, value]) => {
        string = string.replaceAll(key, `<img class="symbol" src="${value}">`)
    });
    return string;
}

// Image Data is data if a print was selected
function setCardInfo (allData, imageData = null) {

    let data = allData.data[0];
    let isFlipCard = false;
    let image;
    if(imageData) {
        let data = imageData;
        if (data.card_faces && !data.image_uris) {
            image = data.card_faces[transformFace].image_uris.normal;
            isFlipCard = true;
        } else if (data.image_uris) {
            image = data.image_uris.normal;
        }
    } else {
        if (data.card_faces && !data.image_uris) {
            image = data.card_faces[transformFace].image_uris.normal;
            isFlipCard = true;
        } else if (data.image_uris) {
            image = data.image_uris.normal;
        }
    }

    // Flip Card
    let flipButton = "";
    if(isFlipCard) {
        let transformURL = `single.html?oracle_id=${allData.data.oracle_id}`;
        if(filters.id) {
            transformURL += `&id=${allData.data.card_faces[transformFace].id}`;
        }
        if(transformFace === 0) {
            // If its not flipped, clicking will flip it
            transformURL += `&transform=true`;
        } else {
            transformURL += `&transform=false`;
        }
        flipButton = `<a class="flip-button" href="${transformURL}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>
</a>`;
    }

    let allPrints = "";

    let printCount = allData.total_cards;
    if(printCount > 9) {{
        printCount = 9;
    }}
    const printSlotsMissing = 9 - printCount;
    const printSlotSize = 31;
    // Only loop a max of 10 times
    for(let i = 0; i < printCount; i++) {
        allPrints += `<tr><td class="change-print-button"><a href="single.html?oracle_id=${allData.data[i].oracle_id}&id=${allData.data[i].id}">${allData.data[i].set_name}<span>&rarr;</span></a></td></tr>`;
    }

    const text = `${flipButton}<div class="single-flex"><img src="${image}" class="mtg-card big-mtg-card container"><div class="single-text">
        <section class="single-banner container">
            <div class="name-line">
                <h2>${data.name}</h2>
                <div>${exchangeWithSymbols(data.mana_cost ?? data.card_faces[transformFace].mana_cost, symbolImagesAssoc)}</div>
            </div>
            <p class="type-line">${data.type_line}</p>
            <p>${exchangeWithSymbols(data.oracle_text ?? data.card_faces[transformFace].oracle_text, symbolImagesAssoc)}</p>
            ${data.flavor_text ? `<p class="flavor-text">${exchangeWithSymbols(data.flavor_text ?? data.card_faces[transformFace].flavor_text, symbolImagesAssoc)}</p>` : ``}
        </section>
        <div class="single-extras-flex container">
            <section class="legalities">
                <h2>Legalities</h2>
                <table class="legalities-table">
                    <thead>
                        <tr>
                            <th>Format</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Standard</td>
                            <td class="${data.legalities.standard}">
                                ${data.legalities.standard.toUpperCase().replace("_", " ")}
                            </td>
                        </tr>
                        <tr>
                            <td>Modern</td>
                            <td class="${data.legalities.modern}">
                                ${data.legalities.modern.toUpperCase().replace("_", " ")}
                            </td>
                        </tr>
                        <tr>
                            <td>Commander</td>
                            <td class="${data.legalities.commander}">
                                ${data.legalities.commander.toUpperCase().replace("_", " ")}
                            </td>
                        </tr>
                        <tr>
                            <td>Legacy</td>
                            <td class="${data.legalities.legacy}">
                                ${data.legalities.legacy.toUpperCase().replace("_", " ")}
                            </td>
                        </tr>
                        <tr>
                            <td>Vintage</td>
                            <td class="${data.legalities.vintage}">
                                ${data.legalities.vintage.toUpperCase().replace("_", " ")}
                            </td>
                        </tr>
                        <tr>
                            <td>Pauper</td>
                            <td class="${data.legalities.pauper}">
                                ${data.legalities.pauper.toUpperCase().replace("_", " ")}
                            </td>
                        </tr>
                        <tr>
                            <td>Historic</td>
                            <td class="${data.legalities.historic}">
                                ${data.legalities.historic.toUpperCase().replace("_", " ")}
                            </td>
                        </tr>
                        <tr>
                            <td>Timeless</td>
                            <td class="${data.legalities.timeless}">
                                ${data.legalities.timeless.toUpperCase().replace("_", " ")}
                            </td>
                        </tr>
                        <tr>
                            <td>Oathbreaker</td>
                            <td class="${data.legalities.oathbreaker}">
                                ${data.legalities.oathbreaker.toUpperCase().replace("_", " ")}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <section class="prints">
                <h2>Printings</h2>
                <table class="prints-table">
                    <thead>
                        <tr>
                            <th>Set Released</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allPrints}
                        <tr><td style="height:${printSlotsMissing * printSlotSize}px" class="prints-filler"></td><tr>
                    </tbody>
                        
                </table>
            </section>
        </div>
    </div></div>`;
    document.querySelector('#card-info').innerHTML += text;
}

const backButton = document.querySelector('.back');
backButton.addEventListener('click', ev => {
    window.history.back()
})

setCardInfo(allData, imageData);