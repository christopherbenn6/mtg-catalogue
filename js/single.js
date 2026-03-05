import { getPrintsByOracleId, getPrintsById } from '../js/api.js'

const params = new URLSearchParams(window.location.search);
const filters = {};

for (const [key, value] of params.entries()) {
    filters[key] = value ? decodeURIComponent(value).replace(/\+/g, " ") : null;
}

let imageData = null

const allData = await getPrintsByOracleId(filters.oracle_id);
if(filters.id) {
    imageData = await getPrintsById(filters.id)
}

function setCardInfo (allData, imageData = null) {


    let data = allData.data[0];
    let image;
    if(imageData) {
        let data = imageData;
        if (data.card_faces && !data.image_uris) {
            image = data.card_faces[0].image_uris.normal;
        } else if (data.image_uris) {
            image = data.image_uris.normal;
        }
    } else {
        if (data.card_faces && !data.image_uris) {
            image = data.card_faces[0].image_uris.normal;
        } else if (data.image_uris) {
            image = data.image_uris.normal;
        }
    }

    let allPrints = "";

    let printCount = allData.total_cards;
    if(printCount > 9) {{
        printCount = 9;
    }}
    // Only loop a max of 10 times
    for(let i = 0; i < printCount; i++) {
        allPrints += `<tr><td><a href="single.html?oracle_id=${allData.data[i].oracle_id}&id=${allData.data[i].id}">${allData.data[i].set_name}<span>&rarr;</span></a></td></tr>`;
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
                    </tbody>
                        
                </table>
            </section>
        </div>
    </div></div>`;
    document.querySelector('#card-info').innerHTML += text;
}

setCardInfo(allData, imageData);