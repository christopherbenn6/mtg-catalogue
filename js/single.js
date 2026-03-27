import { getPrintsByOracleId, getPrintsById, getAllSymbols, fetchData } from '../js/api.js'

const params = new URLSearchParams(window.location.search);
const filters = {};

for (const [key, value] of params.entries()) {
    filters[key] = value ? decodeURIComponent(value).replace(/\+/g, " ") : null;
}

// Which Image Info to use (if clicks on different print, it changes to id rather than oracle id)
const allData = await getPrintsById(filters.id);
const oracleData = await getPrintsByOracleId(allData.oracle_id);
const rulingData = await fetchData(allData.rulings_uri);

// gets card_face[0] or card_face[1]
let transformFace;
if(filters.transform == "true") {
    transformFace = 1;
} else {
    transformFace = 0;
}

// Get all symbols to edit text
const symbolData = await getAllSymbols();
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
function setCardInfo (allData, oracleData, rulingData) {

    let isFlipCard = false;
    let image;
    console.log(allData);
    if (allData.card_faces && !allData.image_uris) {
        image = allData.card_faces[transformFace].image_uris.normal;
        isFlipCard = true;
    } else if (allData.image_uris) {
        image = allData.image_uris.normal;
    }

    // Flip Card
    let flipButton = "";
    if(isFlipCard) {
        let transformURL = `single.html?id=${allData.id}`;
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


    // Printings HTML
    let allPrints = "";

    let printCount =  oracleData.total_cards;
    if(printCount > 9) {{
        printCount = 9;
    }}
    const printSlotsMissing = 9 - printCount;
    const printSlotSize = 30;
    // Only loop a max of 10 times
    for(let i = 0; i < printCount; i++) {
        allPrints += `<tr><td class="change-print-button"><a href="single.html?id=${oracleData.data[i].id}">${oracleData.data[i].set_name}<span>&rarr;</span></a></td></tr>`;
    }

    // Rulings HTML
    let allRulings = "";
    for(let i = 0; i < rulingData.data.length; i++) {
        allRulings += 
        `<div>
            <p class="ruling-date">${rulingData.data[i].published_at}</p>
            <p class="ruling-text">${rulingData.data[i].comment}</p>
        </div>`;
    }
    if(allRulings == "") {
        allRulings = `<div><p>There have been no rulings made on this card.</p></div>`
    }

    // let allPrices = "";
    // Object.entries(allData.prices).forEach(([key, value]) => {
    //     if(value == null) {

    //     }
    //     if(key != usd_etched) {
    //         `<li>${allData.prices.usd} USD</li>
    //         <li>${allData.prices.usd_foil} Foil USD</li>
    //         <li>${allData.prices.eur} EUR</li>
    //         <li>${allData.prices.eur_foil} Foil EUR</li>
    //         <li>${allData.prices.tix} Tix</li>`
    //     }
    // });

    const text = 
    `<div class="container">
        <div class="single-flex">
            <div class="flip-button-container container">
                ${flipButton}
                <img src="${image}" class="mtg-card big-mtg-card">
            </div>
            <div class="single-text">
                <section class="single-banner container">
                    <div class="name-line">
                        <h2>${allData.name}</h2>
                        <div>${exchangeWithSymbols(allData.mana_cost ?? allData.card_faces[transformFace].mana_cost, symbolImagesAssoc)}</div>
                    </div>
                    <p class="type-line">${allData.type_line}</p>
                    <p>${exchangeWithSymbols(allData.oracle_text ?? allData.card_faces[transformFace].oracle_text, symbolImagesAssoc)}</p>
                    ${allData.flavor_text ? `<p class="flavor-text">${exchangeWithSymbols(allData.flavor_text ?? allData.card_faces[transformFace].flavor_text, symbolImagesAssoc)}</p>` : ``}
                </section>
                <div class="single-extras-flex container">
                    <section class="legalities">
                        <h2>Legalities</h2>
                        <table class="legalities-table">
                            <tbody>
                                <tr>
                                    <td>Standard</td>
                                    <td class="${allData.legalities.standard}">
                                        ${allData.legalities.standard.toUpperCase().replace("_", " ")}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Modern</td>
                                    <td class="${allData.legalities.modern}">
                                        ${allData.legalities.modern.toUpperCase().replace("_", " ")}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Commander</td>
                                    <td class="${allData.legalities.commander}">
                                        ${allData.legalities.commander.toUpperCase().replace("_", " ")}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Legacy</td>
                                    <td class="${allData.legalities.legacy}">
                                        ${allData.legalities.legacy.toUpperCase().replace("_", " ")}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Vintage</td>
                                    <td class="${allData.legalities.vintage}">
                                        ${allData.legalities.vintage.toUpperCase().replace("_", " ")}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Pauper</td>
                                    <td class="${allData.legalities.pauper}">
                                        ${allData.legalities.pauper.toUpperCase().replace("_", " ")}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Historic</td>
                                    <td class="${allData.legalities.historic}">
                                        ${allData.legalities.historic.toUpperCase().replace("_", " ")}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Timeless</td>
                                    <td class="${allData.legalities.timeless}">
                                        ${allData.legalities.timeless.toUpperCase().replace("_", " ")}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Oathbreaker</td>
                                    <td class="${allData.legalities.oathbreaker}">
                                        ${allData.legalities.oathbreaker.toUpperCase().replace("_", " ")}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section class="prints">
                        <h2>Printings</h2>
                        <table class="prints-table">
                            <tbody>
                                ${allPrints}
                                <tr><td style="height:${printSlotsMissing * printSlotSize}px" class="prints-filler"></td><tr>
                            </tbody>
                                
                        </table>
                    </section>
                </div>
            </div>
        </div>
        <div class="below-single-flex">
            <section class="rulings">
                <h2>Rulings</h2>
                <div>
                    ${allRulings}
                </div>
            </section>
            <section class="single-price">
                <h2>Price</h2>
                <div>
                    <ul>
                        <li>${allData.prices.usd} USD</li>
                        <li>${allData.prices.usd_foil} Foil USD</li>
                        <li>${allData.prices.eur} EUR</li>
                        <li>${allData.prices.eur_foil} Foil EUR</li>
                        <li>${allData.prices.tix} Tix</li>
                    </ul>
                    <ul class="buy-links">
                        <li class="tcgplayer"><a href="${allData.purchase_uris.tcgplayer}" target="_blank">TCGplayer</a></li>
                        <li class="cardmarket"><a href="${allData.purchase_uris.cardmarket}" target="_blank">Cardmarket</a></li>
                        <li class="cardhoarder"><a href="${allData.purchase_uris.cardhoarder}" target="_blank">Cardhoarder</a></li>
                    </ul>
                </div>
            </section>
        </div>
    </div>`;
    document.querySelector('#card-info').innerHTML += text;
}

const backButton = document.querySelector('.back');
backButton.addEventListener('click', ev => {
    window.history.back()
})

setCardInfo(allData, oracleData, rulingData);