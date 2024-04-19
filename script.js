let allPokemon = [];
let currentLoadedPokemon = [];

function init() {
    loadPokemon()
}


async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0';
    let response = await fetch(url);
    let allPokemons = await response.json();

    allPokemon.push(allPokemons);
    renderPokemonOverview();
}


async function renderPokemonOverview() {
    for (let i = 0; i < allPokemon[0]['results'].length; i++) {
        let url = allPokemon[0]['results'][i]['url'];
        let response = await fetch(url);
        let loadedPokemon = await response.json();

        currentLoadedPokemon.push(loadedPokemon);

        renderPokemonInfo(loadedPokemon, i); 
    }
}

function renderPokemonInfo(loadedPokemon, index) {
    let container = document.getElementById('pokemon-overview-container');
    let pokemon = loadedPokemon;
    let pokemonType = pokemon['types'][0]['type']['name']; 
    let pokedexClass = getPokedexClass(pokemonType);

    container.innerHTML += getPokemonHTML(pokemon, pokedexClass, index);
}


function getPokedexClass(pokemonType) {
    let pokedexClass = 'pokedex';

    if (pokemonType === 'grass') {
        pokedexClass += ' grass';
    } else if (pokemonType === 'fire') {
        pokedexClass += ' fire';
    } else if (pokemonType === 'water') {
        pokedexClass += ' water';
    } else if (pokemonType === 'normal') {
        pokedexClass += ' normal';
    } else if (pokemonType === 'bug') {
        pokedexClass += ' bug';
    } else if (pokemonType === 'poison') {
        pokedexClass += ' poison';
    } else if (pokemonType === 'electric') {
        pokedexClass += ' electric';
    } else if (pokemonType === 'ground') {
        pokedexClass += ' ground';
    } else if (pokemonType === 'fairy') {
        pokedexClass += ' fairy';
    } else if (pokemonType === 'fighting') {
        pokedexClass += ' fighting';
    } else if (pokemonType === 'rock') {
        pokedexClass += ' rock';
    } else if (pokemonType === 'psychic') {
        pokedexClass += ' psychic';
    } else if (pokemonType === 'ghost') {
        pokedexClass += ' ghost';
    } else if (pokemonType === 'ice') {
        pokedexClass += ' ice';
    } else if (pokemonType === 'dragon') {
        pokedexClass += ' dragon';
    } else if (pokemonType === 'dark') {
        pokedexClass += ' dark';
    }
    return pokedexClass;
}


function getPokedexDetailClass(pokemonType) {
    let pokedexDetailClass = 'pokedex-detail-view';

    if (pokemonType === 'grass') {
        pokedexDetailClass += ' grass';
    } else if (pokemonType === 'fire') {
        pokedexDetailClass += ' fire';
    } else if (pokemonType === 'water') {
        pokedexDetailClass += ' water';
    } else if (pokemonType === 'normal') {
        pokedexDetailClass += ' normal';
    } else if (pokemonType === 'bug') {
        pokedexDetailClass += ' bug';
    } else if (pokemonType === 'poison') {
        pokedexDetailClass += ' poison';
    } else if (pokemonType === 'electric') {
        pokedexDetailClass += ' electric';
    } else if (pokemonType === 'ground') {
        pokedexDetailClass += ' ground';
    } else if (pokemonType === 'fairy') {
        pokedexDetailClass += ' fairy';
    } else if (pokemonType === 'fighting') {
        pokedexDetailClass += ' fighting';
    } else if (pokemonType === 'rock') {
        pokedexDetailClass += ' rock';
    } else if (pokemonType === 'psychic') {
        pokedexDetailClass += ' psychic';
    } else if (pokemonType === 'ghost') {
        pokedexDetailClass += ' ghost';
    } else if (pokemonType === 'ice') {
        pokedexDetailClass += ' ice';
    } else if (pokemonType === 'dragon') {
        pokedexDetailClass += ' dragon';
    } else if (pokemonType === 'dark') {
        pokedexDetailClass += ' dark';
    }
    return pokedexDetailClass;
}



function getPokemonHTML(pokemon, pokedexClass, index) {
    let pokemonName = capitalizeFirstLetter(pokemon['name']); 
    let pokemonImage = pokemon['sprites']['front_shiny']; 
    let pokemonTypes = '';

    for (let i = 0; i < pokemon['types'].length; i++) {
        let pokemonType = pokemon['types'][i]['type']['name']; 
        pokemonTypes += `<div class="pokemon-type">${pokemonType}</div>`;
    }

    return /*html*/`
    <div class="pokemon-container">
        <div onclick="openPokemonDetailView(${index})" id="pokemon${index}" class="${pokedexClass}">
            <h1 class="pokemon-name">${pokemonName}</h1>
            <div class="overview-image-container">
                <div>${pokemonTypes}</div>
                <div><img class="pokemonImage" src="${pokemonImage}" alt="pokemon image"></div> 
            </div>     
        </div> 
    </div>   
    `;
}


async function loadMorePokemon() {
    let url = allPokemon[0].next;
    let response = await fetch(url);
    let morePokemon = await response.json();

    allPokemon = [];
    
    
    await allPokemon.push(morePokemon);
    renderPokemonOverview();
}


function openPokemonDetailView(index) {
    let pokemonDetailContainer = document.getElementById('pokemon-detail-view');
    pokemonDetailContainer.classList.remove('d-hide');
    pokemonDetailContainer.classList.add('d-block');
    pokemonDetailContainer.innerHTML = '';

    let pokemon = currentLoadedPokemon[index];
    let pokemonName = capitalizeFirstLetter(pokemon['name']);
    let pokemonImage = pokemon['sprites']['front_shiny'];
    let pokemonType = pokemon['types'][0]['type']['name'];
    let pokedexDetailClass = getPokedexDetailClass(pokemonType);
    let pokemonTypes = '';
    for (let i = 0; i < pokemon['types'].length; i++) {
        let pokemonType = pokemon['types'][i]['type']['name'];
        pokemonTypes += `<div class="pokemon-type">${pokemonType}</div>`;
        
    }


    let pokemonDetailHTML = /*html*/`

    <div>
        <div onclick="closePokemonDetailView()" id="pokemon${index}" class="${pokedexDetailClass}">
            <h1 class="pokemon-name">${pokemonName}</h1>
            <div class="overview-image-container">
                <div><img class="pokemon-detail-image" src="${pokemonImage}" alt="pokemon image"></div> 
            </div>     
            <div>${pokemonTypes}</div>
        </div> 
        <div></div>
    </div>
    `;

    pokemonDetailContainer.innerHTML = pokemonDetailHTML;
}


function closePokemonDetailView() {
    let pokemonDetailContainer = document.getElementById('pokemon-detail-view');
    pokemonDetailContainer.classList.add('d-hide');
    pokemonDetailContainer.classList.remove('d-block');
    pokemonDetailContainer.innerHTML = '';
}





function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


// aktuell nur Namen, render Bedingung muss der if Abfrage hinzugefügt werden. Vorher richtiges HTML Gerüst und Struktur
function filterPokemon() {
    let search = document.getElementById('search').value.toLowerCase();
    let pokemonContainers = document.querySelectorAll('.pokemon-container');

    pokemonContainers.forEach(pokemonContainer => {
        let pokemonName = pokemonContainer.querySelector('.pokemon-name').textContent.toLowerCase();
        
        if (pokemonName.startsWith(search)) {
            pokemonContainer.style.display = '';
        } else {
            pokemonContainer.style.display = 'none';
        }
    });
}

