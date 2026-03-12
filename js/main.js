import { filterCards, fetchData } from '../js/api.js';

let maxNumberOfCards = 80;
const cardIncrement = 80;
let cardData; // store all loaded cards and next_page
let activeFilters = [];

let selectedFilterButton = null;

// Select Dropdown Functionality
let dropdownButtons = document.querySelectorAll('.dropdown-button');
dropdownButtons.forEach(button => {
    button.addEventListener('click', (ev) => {
        ev.preventDefault();
        if(!advancedFiltersAreOpen) {
            if(selectedFilterButton != null && selectedFilterButton != button) {
                const selectedDropdown = selectedFilterButton.nextElementSibling;
                selectedDropdown.classList.add('hidden');
                selectedFilterButton.classList.remove('clicked');
            }
            const dropdown = button.nextElementSibling;
            dropdown.classList.toggle('hidden');
            button.classList.toggle('clicked');
            selectedFilterButton = button;
        }   
    })
});

// SVG enable + add to active filters
let dropdownSelect = document.querySelectorAll('.dropdown:not(.sorting-dropdown) > div');
dropdownSelect.forEach(select => {
    select.addEventListener('click', () => {
        select.classList.toggle('selected');
        let svg = select.querySelector('svg');
        svg.classList.toggle('hidden');
    });
});

// Color Selection
let colorButtons = document.querySelectorAll('.color .dropdown div');
let colorInput = document.querySelector('#color')
let colors = "";

colorButtons.forEach(colorButton => {
    colorButton.addEventListener('click', () => {
        let color = colorButton.getAttribute('data-value');
        if(colors.includes(color)) {
            colors = colors.replace(color, "");
        } else {
            colors = colors + color;
        }
        colorInput.value = colors;
    })
});

// Card Type
let typeButtons = document.querySelectorAll('.card-type .dropdown div');
let typeInput = document.querySelector('#card-type')

// Types as an array thats converted to a string later
let types = [];

typeButtons.forEach(typeButton => {
    typeButton.addEventListener('click', () => {
        let cardType = typeButton.getAttribute('data-value');
        if(types.includes(cardType)) {
            // 1 means remove only the first
            types.splice(types.indexOf(cardType), 1)
        } else {
            types.push(cardType);
        }
        let typesString = types.join('-')
        typeInput.value = typesString;
    })
});

// Mana Value
let manaButtons = document.querySelectorAll('.mana-value .dropdown div');
let manaInput = document.querySelector('#mana-value');

// Mana values as an array thats converted to a string later
let manaValues = [];

manaButtons.forEach(manaButton => {
    manaButton.addEventListener('click', () => {
        let manaValue = manaButton.getAttribute('data-value');
        if(manaValues.includes(manaValue)) {
            // 1 means remove only the first
            manaValues.splice(manaValues.indexOf(manaValue), 1)
        } else {
            manaValues.push(manaValue);
        }
        let manaValuesString = manaValues.join('-')
        manaInput.value = manaValuesString;
    })
});


// Sorting Mode
let sortingButtons = document.querySelectorAll('.sorting-mode .dropdown div');
let selectedSortingOption;
let sortingInput = document.querySelector('#sorting-mode');

sortingButtons.forEach(sortingButton => {
    sortingButton.addEventListener('click', () => {
        if(sortingButton != selectedSortingOption) {
            let sortingMode = sortingButton.getAttribute('data-value');
            sortingButton.classList.toggle('selected');
            if(selectedSortingOption != null) {
                selectedSortingOption.classList.toggle('selected');
            }
            // Svg enabling
            let svg = sortingButton.querySelector('svg');
            svg.classList.remove('hidden');
            if(selectedSortingOption) {
                let prevSvg = selectedSortingOption.querySelector('svg');
                prevSvg.classList.add('hidden');
            }

            selectedSortingOption = sortingButton;
            sortingInput.value = sortingMode;
        } 
    })
});

// Sorting Direction
let sortingDirectionButtons = document.querySelectorAll('.sort-direction .dropdown div');
let selectedSortingDirectionOption;
let sortingDirectionInput = document.querySelector('#sort-direction');

sortingDirectionButtons.forEach(sortingDirectionButton => {
    sortingDirectionButton.addEventListener('click', () => {
        if(sortingDirectionButton != selectedSortingDirectionOption) {
            let sortingDirection = sortingDirectionButton.getAttribute('data-value');

            // Selected Classes
            sortingDirectionButton.classList.toggle('selected');
            if(selectedSortingDirectionOption != null) {
                selectedSortingDirectionOption.classList.toggle('selected');
            }

            // Svg enabling
            let svg = sortingDirectionButton.querySelector('svg');
            svg.classList.remove('hidden');
            if(selectedSortingDirectionOption) {
                let prevSvg = selectedSortingDirectionOption.querySelector('svg');
                prevSvg.classList.add('hidden');
            }

            selectedSortingDirectionOption = sortingDirectionButton;
            sortingDirectionInput.value = sortingDirection;
        } 
    })
});

let advancedFiltersButton = document.querySelector('.advanced-filters-button');
let advancedFilters = document.querySelector('.advanced-filters');
let advancedFiltersAreOpen = false;
advancedFiltersButton.addEventListener('click', () => {
    advancedFilters.classList.toggle('hidden');
    if(advancedFiltersAreOpen) {
        advancedFiltersButton.innerText = 'Advanced Filters';
        advancedFiltersAreOpen = false;
    } else {
        advancedFiltersButton.innerText = 'Basic Filters'
        advancedFiltersAreOpen = true;

    }
    dropdownButtons.forEach(button => {
        const dropdown = button.nextElementSibling;
        if(advancedFiltersAreOpen) {
            button.classList.add('clicked');
            dropdown.classList.remove('hidden');
        } else {
            button.classList.remove('clicked');
            dropdown.classList.add('hidden');
        }
    })
})

async function loadCardArray(filterObject) {
    // Initial fetch
    cardData = await filterCards(filterObject['sort-direction'], filterObject['sorting-mode'], filterObject);
    // If there were cards in the search
    if(cardData != false) {
        renderCards(cardData.data, 0, maxNumberOfCards);
        setupLoadMore();
    } else {
        const cardGrid = document.querySelector('#card-grid');

        // Heading
        const h2 = document.createElement('h2');
        h2.classList = "no-cards";
        h2.innerText = "404 No Cards Found";

        // Text
        const p = document.createElement('p');
        p.classList = "no-cards";
        p.innerText = "There were no cards found that match your search. Or there was an error.";

        // Add it 
        cardGrid.appendChild(h2);
        cardGrid.appendChild(p);

        // Change Styling
        cardGrid.classList.add('no-results')
    }
}

function setupLoadMore() {
    const loadMore = document.querySelector('#load-more');
    loadMore.innerHTML = '';

    if (cardData.data.length > maxNumberOfCards || cardData.next_page) {
        const button = document.createElement('p');
        button.id = 'load-more-button';
        button.textContent = 'Load More';

        button.addEventListener('click', async () => {
            const previousCount = maxNumberOfCards;
            maxNumberOfCards += cardIncrement;

            // Check if we need to fetch next page
            if (maxNumberOfCards > cardData.data.length && cardData.next_page) {
                const nextPageData = await fetchData(cardData.next_page);
                cardData.data = [...cardData.data, ...nextPageData.data];
                cardData.next_page = nextPageData.next_page;
            }

            renderCards(cardData.data, previousCount, maxNumberOfCards);

            // Recheck if the button should remain
            if (maxNumberOfCards >= cardData.data.length && !cardData.next_page) {
                loadMore.innerHTML = ''; // remove button if no more cards
            }
        });

        loadMore.appendChild(button);
    }
}

function renderCards(cards, startIndex, endIndex) {
    const cardGrid = document.querySelector('#card-grid');
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i < endIndex && i < cards.length; i++) {
        let image = 'img/blank.avif';

        if (cards[i].card_faces && !cards[i].image_uris) {
            image = cards[i].card_faces[0].image_uris.normal;
        } else if (cards[i].image_uris) {
            image = cards[i].image_uris.normal;
        }

        const img = document.createElement('img');
        img.className = 'mtg-card';
        img.src = image;
        img.loading = "lazy";
        
        const a = document.createElement('a');
        a.href = `single.html?oracle_id=${cards[i].oracle_id}`
        a.appendChild(img);

        fragment.appendChild(a);  
    }

    cardGrid.appendChild(fragment);
}

// Start loading

function filterObject() {
    const params = new URLSearchParams(window.location.search);
    const filters = {};

    for (const [key, value] of params.entries()) {
        filters[key] = value ? decodeURIComponent(value).replace(/\+/g, " ") : null;
    }

    if (Object.keys(filters).length > 0) {
        return filters;
    }

    return {
        "sorting-mode": "released",
        "sort-direction": "desc",
        "card-search": null,
        "color": null,
        "mana-value": null,
        "card-type": null,
        "rarity": null,
        "legalty": "vintage",
        "minyear": null,
        "maxyear": null,
        "minpower": null,
        "maxpower": null,
        "mintoughness": null,
        "maxtoughness": null,
        "minloyalty": null,
        "maxloyalty": null,
        "card-face": null,
        "other-card-types": null,
        "gimmick": null
    };
}

console.log(filterObject());

loadCardArray(filterObject());