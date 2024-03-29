let allPokemon = [];
let currentPokemon;

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
        currentPokemon = await response.json();
        renderPokemonInfo(currentPokemon, i); // Übergabe des Index i
    }
}

function renderPokemonInfo(currentPokemon, index) {
    let container = document.getElementById('pokemon-overview-container');
    let pokemon = currentPokemon;
    let pokemonType = pokemon['types'][0]['type']['name']; 

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
    }

    container.innerHTML += getPokemonHTML(pokemon, pokedexClass, index); // Übergabe des Index index
}

function getPokemonHTML(pokemon, pokedexClass, index) {
    let pokemonName = capitalizeFirstLetter(pokemon['name']); 
    let pokemonImage = pokemon['sprites']['front_default']; 
    let pokemonTypes = '';

    for (let i = 0; i < pokemon['types'].length; i++) {
        let pokemonType = pokemon['types'][i]['type']['name']; 
        pokemonTypes += `<div class="pokemon-type">${pokemonType}</div>`;
    }

    return /*html*/`
    <div id="pokemon${index}" class="${pokedexClass}">
        <h1>${pokemonName}</h1>
        <div class="overview-image-container">
            <div>${pokemonTypes}</div>
            <div><img class="pokemonImage" src="${pokemonImage}" alt="pokemon image"></div> 
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





// aktuell nur Namen, render Bedingung muss der if Abfrage hinzugefügt werden. Vorher richtiges HTML Gerüst und Struktur
function searchNames() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();

    let list = document.getElementById('pokedex');
   

    for (let i = 0; i < currentPokemon.length; i++) {
        const pokemonName = currentPokemon['names'][index];
        if (pokemonName.toLocalLowerCase().includes(search)) {
            list.innerHTML = renderPokemonOverview();
        }
        
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

