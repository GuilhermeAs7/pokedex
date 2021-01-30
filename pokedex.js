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
<div class="card" id="card-{id}">
<div class="title">
    <h2>{name}</h2>
    <small># {id}</small>
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

const cards = document.querySelector('.cards');

const getType = (data) => {
    const apiTypes = data.map(type => type.type.name);
    const type = types.find(type => apiTypes.indexOf(type) > -1);
    return type;
}

const fetchPokemon = async (pokemon) => {
    if (pokemon === undefined) return;
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`; 
    const response = await fetch(url).then((response) =>response.json());
    const {id, name, types } = response;
    const type = getType(types);
    return {id, name, type};
};

const replacer = (text, source, destination) => {
    const regex = new RegExp(source, 'gi');
    return text.replace(regex, destination);
}

const creatPokemonCard = (pokemon) => {
    const {id, name, type} = pokemon;
    let newCard = replacer(cardHTML, `\{id\}`, id);
    newCard = replacer(newCard, `\{name\}`, name);
    newCard = replacer(newCard, `\{type\}`, type);

    cards.innerHTML += newCard;
};

const fetchAllPokemons = async () => {
    for (let i = 1; i <= pokemonCount; i++){
        const pokemon = await fetchPokemon(i);
        creatPokemonCard(pokemon);
    }
};

fetchAllPokemons();

const clearDiv = () => {
    let divCards = document.getElementById('cards-0');
    while(divCards.firstChild){
        divCards.removeChild(divCards.firstChild);
    }
};

const findField = document.getElementById('txtBusca');
findField.onblur = function(){
    clearDiv();
    findPokemon();
};

const findPokemon = async () => {
    const nome = document.getElementById("txtBusca").value 
    if (nome != '') {
        const pokemon = await fetchPokemon(nome.toLowerCase());  
        creatPokemonCard(pokemon);  
    }
    else fetchAllPokemons();
};