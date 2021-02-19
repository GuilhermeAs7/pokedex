const types = [
    'fire',
    'grass',
    'electric',
    'water',
    'ground',
    'rock',
    'fairy',
    'poison',
    'bug',
    'dragon',
    'psychic',
    'flying',
    'fighting',
    'normal'
];

const pokemonCount = 12;

const cardHTML = `
<div class="card" id="card-{id}" onclick="loadModal({id}, '{name}', '{type}')";>
<div class="title">
    <h2>{name}</h2>
    <small id="idPokemon"># {id}</small>
</div>
<div class="image bg-{type}">
    <img src="https://pokeres.bastionbot.org/images/pokemon/{id}.png" alt=""/>
</div>
<button class="favorite" data-id={id}>
    <div class="heart"></div>
</button>
<div class="type {type}">
    <p>{type}</p>
</div>
</div>
`;

const modalHTML = `
<span class="close">&times;</span>
<div class="modal-pokemon-details">
    <div class="modal-title">
        <h2>{name}</h2>
        <small id="idPokemon"># {id}</small>
    </div><br>
    <table id="myTable">
        <thead>
            <tr>
                <th>HP</th>
                <th>Attack</th>
                <th>Defense</th>
                <th>Special Attack</th>
                <th>Special Defense</th>
                <th>Speed</th>
            </tr>
            <tr>
                <td>{hp}</td>
                <td>{attack}</td>
                <td>{defense}</td>
                <td>{specialAttack}</td>
                <td>{specialDefense}</td>
                <td>{speed}</td>
            </tr>
        </thead>
    </table><br>

    <canvas class="bar-chart"></canvas>
    
</div>
`;

const cards = document.querySelector('.cards');

const model = document.querySelector('.modal-content');

const getType = (data) => {
    const apiTypes = data.map(type => type.type.name);
    const type = types.find(type => apiTypes.indexOf(type) > -1);
    return type;
}

const fetchPokemon = async (pokemon) => {
    if (pokemon === undefined) return;
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const response = await fetch(url).then((response) => response.json());
    const { id, name, types } = response;
    const type = getType(types);
    return { id, name, type };
};

const replacer = (text, source, destination) => {
    const regex = new RegExp(source, 'gi');
    return text.replace(regex, destination);
}

const creatPokemonCard = (pokemon) => {
    const { id, name, type } = pokemon;
    let newCard = replacer(cardHTML, `\{id\}`, id);
    newCard = replacer(newCard, `\{name\}`, name);
    newCard = replacer(newCard, `\{type\}`, type);

    cards.innerHTML += newCard;
};

const fetchAllPokemons = async () => {
    for (let i = 1; i <= pokemonCount; i++) {
        const pokemon = await fetchPokemon(i);
        creatPokemonCard(pokemon);
    }
};

fetchAllPokemons();

const clearDiv = (id) => {
    let divId = document.getElementById(id);
    if (divId == null) return;
    while (divId.firstChild) {
        divId.removeChild(divId.firstChild);
    }
};

const findField = document.getElementById('txtBusca');
findField.onblur = function () {
    clearDiv('cards-0');
    findPokemon();
};

//Buscar Pokemon

const findPokemon = async () => {
    const nome = document.getElementById("txtBusca").value;
    if (nome != '') {
        const pokemon = await fetchPokemon(nome.toLowerCase());
        creatPokemonCard(pokemon);
    }
    else fetchAllPokemons();
};

//Modal

const loadModal = async (id, name, type) => {

    let hp, attack, defense, specialAttack, specialDefense, speed, i = 0;
    const details = await loadStatsPokemon(id);

    while (i < details.length) {
        if (details[i] !== undefined) {
            if (details[i].split(':')[0] == 'hp') hp = details[i].split(':')[1];
            else if (details[i].split(':')[0] == 'attack') attack = details[i].split(':')[1];
            else if (details[i].split(':')[0] == 'defense') defense = details[i].split(':')[1];
            else if (details[i].split(':')[0] == 'special-attack') specialAttack = details[i].split(':')[1];
            else if (details[i].split(':')[0] == 'special-defense') specialDefense = details[i].split(':')[1];
            else if (details[i].split(':')[0] == 'speed') speed = details[i].split(':')[1];
        }
        i++;
    }

    clearDiv('modal-content-0');

    const modal = document.getElementById("detailsModal");
    modal.style.display = "block";

    createPokemonModal(id, name, hp, attack, defense, specialAttack, specialDefense, speed);
    createGraphModal(hp, attack, defense, specialAttack, specialDefense, speed);

    const btnCloseModal = document.getElementsByClassName("close")[0];
    btnCloseModal.onclick = function () {
        modal.style.display = "none";
    }
};

const createPokemonModal = (id, name, hp, attack, defense, specialAttack, specialDefense, speed) => {
    let newModel = replacer(modalHTML, `\{id\}`, id);
    newModel = replacer(newModel, `\{name\}`, name);
    newModel = replacer(newModel, `\{hp\}`, hp);
    newModel = replacer(newModel, `\{attack\}`, attack);
    newModel = replacer(newModel, `\{defense\}`, defense);
    newModel = replacer(newModel, `\{specialAttack\}`, specialAttack);
    newModel = replacer(newModel, `\{specialDefense\}`, specialDefense);
    newModel = replacer(newModel, `\{speed\}`, speed);

    model.innerHTML += newModel;
};

const createGraphModal = (hp, attack, defense, specialAttack, specialDefense, speed) => {
    const ctx = document.getElementsByClassName("bar-chart");

    var chartGraph = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["HP", "Attack", "Defense", "Special Attack", "Special Defense", "Speed"],
            datasets: [{
                label: "Stats",
                backgroundColor: ["#6495ED", "#A52A2A","#F5DEB3", "#800000","#D2B48C","#228B22"],
                data: [hp, attack, defense, specialAttack, specialDefense, speed],
            }]
        },
        options: {
            legend: { display: false },
            title:{
                display:true,
                text:"Pokemon Base Stats"
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        max: 100, 
                    }
                }]
            }
        }        
    });

};

const loadStatsPokemon = async (id) => {
    if (id === undefined) return;

    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url).then((response) => response.json());
    const { stats } = response;
    const stat = getStats(stats);

    return stat;
};

const getStats = (data) => {
    const stats = [];

    for (let i = 0; i <= data.length; i++) {
        if (data[i] !== undefined) {
            const statNumber = data[i].base_stat;
            const statName = data[i].stat.name;
            stats.push(`${statName}:${statNumber}`);
        }
    }
    return stats;
};
