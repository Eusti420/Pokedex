let allPokemon = [];
let currentLoadedPokemon = [];
let currentIndex = 0;

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

        renderPokemonInfo(loadedPokemon, currentIndex); 
        currentIndex++; 
    }
}

function renderPokemonInfo(loadedPokemon, index) {
    let container = document.getElementById('pokemon-overview-container');
    let pokemon = loadedPokemon;
    let pokemonType = pokemon['types'][0]['type']['name']; 
    let pokedexClass = getPokedexClass(pokemonType);
    let pokemonName = capitalizeFirstLetter(pokemon['name']); 
    let pokemonImage = pokemon['sprites']['front_shiny']; 
    let pokemonTypes = '';
    

    for (let i = 0; i < pokemon['types'].length; i++) {
        let pokemonType = pokemon['types'][i]['type']['name']; 
        pokemonTypes += `<div class="pokemon-type">${pokemonType}</div>`;
    }


    container.innerHTML += getPokemonHTML(pokedexClass, index, pokemonTypes, pokemonName, pokemonImage);
}


function getPokemonHTML(pokedexClass, index, pokemonTypes, pokemonName, pokemonImage) {
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
    let pokemon = currentLoadedPokemon[index];
    let pokemonName = capitalizeFirstLetter(pokemon['name']);
    let pokemonImage = pokemon['sprites']['front_shiny'];
    let pokemonType = pokemon['types'][0]['type']['name'];
    let pokedexDetailClass = getPokedexDetailClass(pokemonType);
    let pokemonTypes = '';
        for (let i = 0; i < pokemon['types'].length; i++) {
            let pokemonType = pokemon['types'][i]['type']['name'];
            pokemonTypes += `<div class="pokemon-type">${pokemonType}</div>`;
        };
    let statsNames = [];
    let statsValues = [];
    pokemon.stats.forEach(stat => {
        statsNames.push(stat.stat.name);
        statsValues.push(stat.base_stat);
    });
    renderPokemonDetailView(index, pokemonName, pokemonImage, pokedexDetailClass, pokemonTypes, statsNames, statsValues);
}


function renderPokemonDetailView(index, pokemonName, pokemonImage, pokedexDetailClass, pokemonTypes, statsNames, statsValues) {
    let pokemonDetailContainer = document.getElementById('pokemon-detail-view');
    document.body.style.overflowY = 'hidden';
    pokemonDetailContainer.classList.remove('d-hide');
    pokemonDetailContainer.classList.add('d-block');
    pokemonDetailContainer.innerHTML = '';
    pokemonDetailContainer.innerHTML = pokemonDetailHTML(index, pokedexDetailClass, pokemonName, pokemonImage, pokemonTypes);
    createPokemonChart(statsNames, statsValues);
}


function pokemonDetailHTML(index, pokedexDetailClass, pokemonName, pokemonImage, pokemonTypes) {
    return /*html*/`
        <button class="sliderArrow" onclick="previousPokemon(${index - 1})"><</button>
        <div onclick="closePokemonDetailView()" id="pokemon${index}" class="${pokedexDetailClass}">
            <h1 class="pokemon-name">${pokemonName}</h1>
            <div class="overview-image-container">
                <div><img class="pokemon-detail-image" src="${pokemonImage}" alt="pokemon image"></div> 
            </div>     
            <div>${pokemonTypes}</div>
            <div style="height: 260px" class="chart-container"><canvas id="myChart"></canvas></div>
        </div> 
        <button class="sliderArrow" onclick="nextPokemon(${index + 1})">></button>
    `;
}


function createPokemonChart(statsNames, statsValues) {
    const config = document.getElementById('myChart');
    const backgroundColors = [
        'rgba(255, 99, 132, 0.5)',   
        'rgba(54, 162, 235, 0.5)',   
        'rgba(255, 206, 86, 0.5)',   
        'rgba(75, 192, 192, 0.5)',   
        'rgba(153, 102, 255, 0.5)',  
        'rgba(255, 159, 64, 0.5)'    
    ];

    new Chart(config, {
        type: 'bar',
        data: {
            labels: statsNames,
            datasets: [{
                label: 'Attribute',
                data: statsValues,
                backgroundColor: backgroundColors, 
                borderWidth: 1,
            }]
        },
        options: {
            scales: {y: {beginAtZero: true}},
            maintainAspectRatio: false,
            responsive: true,
        }
    });   
}


function closePokemonDetailView() {
    let pokemonDetailContainer = document.getElementById('pokemon-detail-view');
    pokemonDetailContainer.classList.add('d-hide');
    pokemonDetailContainer.classList.remove('d-block');
    pokemonDetailContainer.innerHTML = '';
    document.body.style.overflowY = 'auto';
}


function nextPokemon(index) {
    if (index >= currentLoadedPokemon.length) {
        index = 0;
    }
    openPokemonDetailView(index);
}


function previousPokemon(index) {
    if (index == -1) {
        index = currentLoadedPokemon.length -1;
    }
    openPokemonDetailView(index);
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


async function filterPokemon() {
    let search = document.getElementById('search').value.toLowerCase();
    let container = document.getElementById('pokemon-overview-container');
    container.innerHTML = '';

    for (let index = 0; index < currentLoadedPokemon.length; index++) {
        let pokemon = currentLoadedPokemon[index];
        let pokemonName = pokemon['name'].toLowerCase();

        if (pokemonName.startsWith(search)) {
            renderPokemonInfo(pokemon, index);
        }
    }
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