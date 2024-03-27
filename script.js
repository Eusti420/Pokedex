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
    let pokemonName = capitalizeFirstLetter(pokemon['name']); // Name
    let pokemonImage = pokemon['sprites']['front_default']; // Bild
    let pokemonTypeHTML = '';

    for (let i = 0; i < pokemon['types'].length; i++) {
        let pokemonType = pokemon['types'][i]['type']['name']; // Type
        pokemonTypeHTML += `<div class="pokemon-type">${pokemonType}</div>`;
    }

   /*  for (let i = 0; i < pokemon['types'][i].length; i++) {
        
    }
    let pokemonType = pokemon['types'][0]['type']['name']; // Type */

    return /*html*/`
    <div class="overview-pokemon-container">
        <div class="pokedex">
            <h1>${pokemonName}</h1>
            <div class="overview-image-container">
                <div>${pokemonTypeHTML}</div>
                <div><img class="pokemonImage" src="${pokemonImage}" alt="pokemon image"></div> 
            </div>     
        </div>
        
    </div>    
    `;
}



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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

