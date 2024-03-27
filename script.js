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
        renderPokemonInfo(currentPokemon);
    }

   
}


function renderPokemonInfo(currentPokemon) {
    let container = document.getElementById('pokemon-overview-container');
    let pokemon = currentPokemon;
        
    container.innerHTML += getPokemonHTML(pokemon); 

}


function getPokemonHTML(pokemon) {
    return /*html*/`
    <div class="overview-pokemon-container">
        <div class="pokedex">
            <h1>${pokemon['name']}</h1>
        </div>    
        <div class="info-container">
            <div class="overview-image-container"><img class="pokemonImage" src="${pokemon['sprites']['front_default']}" alt="pokemon image"></div> 
        </div>
    </div>    
    `;
}

/* let pokemonName = document.getElementById('pokemonName').innerHTML = currentPokemon['name'];
let pokemonImage = document.getElementById('pokemonImage').src = `${currentPokemon['sprites']['front_default']}`; */



// aktuell nur Namen, render Bedingung muss der if Abfrage hinzugefügt werden. Vorher richtiges HTML Gerüst und Struktur
function searchNames() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();

    let list = document.getElementById('pokedex');
    list.innerHTML = '';

    for (let i = 0; i < currentPokemon.length; i++) {
        const pokemonName = currentPokemon['names'][index];
        if (pokemonName.toLocalLowerCase().includes(search)) {
            list.innerHTML = renderPokemonInfo();
        }
        
    }
}