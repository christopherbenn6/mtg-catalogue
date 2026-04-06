import"./reset-WE9h_3If.js";import{a as e,i as t,r as n,t as r}from"./api-C7lPA6Qs.js";var i=new URLSearchParams(window.location.search),a={};for(let[e,t]of i.entries())a[e]=t?decodeURIComponent(t).replace(/\+/g,` `):null;var o=await t(a.id),s=await e(o.oracle_id),c=await r(o.rulings_uri),l=a.transform==`true`?1:0,u=await n(),d={};u.data.forEach(e=>{d[e.symbol]=e.svg_uri});function f(e,t){return Object.entries(t).forEach(([t,n])=>{e=e.replaceAll(t,`<img class="symbol" src="${n}">`)}),e}function p(e,t,n){let r=!1,i;console.log(e),e.card_faces&&!e.image_uris?(i=e.card_faces[l].image_uris.normal,r=!0):e.image_uris&&(i=e.image_uris.normal);let a=``;if(r){let t=`single.html?id=${e.id}`;l===0?t+=`&transform=true`:t+=`&transform=false`,a=`<a class="flip-button" href="${t}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>
</a>`}let o=``,s=t.total_cards;s>9&&(s=9);let c=9-s;for(let e=0;e<s;e++)o+=`<tr><td class="change-print-button"><a href="single.html?id=${t.data[e].id}">${t.data[e].set_name}<span>&rarr;</span></a></td></tr>`;let u=``;for(let e=0;e<n.data.length;e++)u+=`<div>
            <p class="ruling-date">${n.data[e].published_at}</p>
            <p class="ruling-text">${n.data[e].comment}</p>
        </div>`;u==``&&(u=`<div><p>There have been no rulings made on this card.</p></div>`);let p=``,m={usd:`USD`,usd_foil:`USD Foil`,eur:`EUR`,eur_foil:`EUR Foil`,tix:`TIX`};Object.entries(e.prices).forEach(([e,t])=>{t!=null&&(p+=`<li class="price-pill">${e==`tix`?``:`$`}${t} ${m[e]}</li>`)}),p==``&&(p+=`<li class="no-prices">No prices available for this card.</li>`);let h=`<div class="container">
        <div class="single-flex">
            <div class="flip-button-container container">
                ${a}
                <img src="${i}" class="mtg-card big-mtg-card">
            </div>
            <div class="single-text">
                <section class="single-banner container">
                    <div class="name-line">
                        <h2>${e.name}</h2>
                        <div>${f(e.mana_cost??e.card_faces[l].mana_cost,d)}</div>
                    </div>
                    <p class="type-line">${e.type_line}</p>
                    <p>${f(e.oracle_text??e.card_faces[l].oracle_text,d)}</p>
                    ${e.flavor_text?`<p class="flavor-text">${f(e.flavor_text??e.card_faces[l].flavor_text,d)}</p>`:``}
                </section>
                <div class="single-extras-flex container">
                    <section class="legalities">
                        <h2>Legalities</h2>
                        <table class="legalities-table">
                            <tbody>
                                <tr>
                                    <td>Standard</td>
                                    <td class="${e.legalities.standard}">
                                        ${e.legalities.standard.toUpperCase().replace(`_`,` `)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Modern</td>
                                    <td class="${e.legalities.modern}">
                                        ${e.legalities.modern.toUpperCase().replace(`_`,` `)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Commander</td>
                                    <td class="${e.legalities.commander}">
                                        ${e.legalities.commander.toUpperCase().replace(`_`,` `)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Legacy</td>
                                    <td class="${e.legalities.legacy}">
                                        ${e.legalities.legacy.toUpperCase().replace(`_`,` `)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Vintage</td>
                                    <td class="${e.legalities.vintage}">
                                        ${e.legalities.vintage.toUpperCase().replace(`_`,` `)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Pauper</td>
                                    <td class="${e.legalities.pauper}">
                                        ${e.legalities.pauper.toUpperCase().replace(`_`,` `)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Historic</td>
                                    <td class="${e.legalities.historic}">
                                        ${e.legalities.historic.toUpperCase().replace(`_`,` `)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Timeless</td>
                                    <td class="${e.legalities.timeless}">
                                        ${e.legalities.timeless.toUpperCase().replace(`_`,` `)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Oathbreaker</td>
                                    <td class="${e.legalities.oathbreaker}">
                                        ${e.legalities.oathbreaker.toUpperCase().replace(`_`,` `)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section class="prints">
                        <h2>Printings</h2>
                        <table class="prints-table">
                            <tbody>
                                ${o}
                                <tr><td style="height:${c*31}px" class="prints-filler"></td><tr>
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
                    ${u}
                </div>
            </section>
            <section class="single-price">
                <h2>Price</h2>
                <div>
                    <ul class="prices">
                        ${p}
                    </ul>
                    <ul class="buy-links">
                        <li class="tcgplayer"><a href="${e.purchase_uris.tcgplayer}" target="_blank">TCGplayer</a></li>
                        <li class="cardmarket"><a href="${e.purchase_uris.cardmarket}" target="_blank">Cardmarket</a></li>
                        <li class="cardhoarder"><a href="${e.purchase_uris.cardhoarder}" target="_blank">Cardhoarder</a></li>
                    </ul>
                </div>
            </section>
        </div>
    </div>`;document.querySelector(`#card-info`).innerHTML+=h}sessionStorage.getItem(`originalPage`)||sessionStorage.setItem(`originalPage`,document.referrer),document.querySelector(`.back`).addEventListener(`click`,()=>{let e=sessionStorage.getItem(`originalPage`);sessionStorage.removeItem(`originalPage`),window.location.href=e}),p(o,s,c);