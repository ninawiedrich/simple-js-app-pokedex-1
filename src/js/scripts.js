/* eslint-disable quotes */

let pokemonRepository = (() =>{
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  // Function to show loading message while fetching data
  function showLoadingMessage() {
    let loadingMessage = document.createElement("p");
    loadingMessage.textContent = "Loading...";
    loadingMessage.id = "loading-message";

    // Adding styles
    loadingMessage.setAttribute(
      "style",
      `
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: black;
        color: white;
        padding: 20px;
        font-size: 3em;
    `
    );

    document.body.appendChild(loadingMessage);
  }

  // Function to hide loading message
  function hideLoadingMessage() {
    let loadingMessage = document.querySelector("#loading-message");
    if (loadingMessage) {
      document.body.removeChild(loadingMessage);
    }
  }

  // Function to add a new pokemon to the repository
  function add(pokemon) {
    let requiredKeys = ["name", "detailsUrl"];
    if (
      typeof pokemon === "object" &&
      requiredKeys.every((key) => key in pokemon)
    ) {
      pokemonList.push(pokemon);
      return true;
    } else {
      return false;
    }
  }

  // Function to get all the pokemon in the repository
  let getAll = () =>  pokemonList;

  // Function to find pokemon by name in the repository
  function findByName(name) {
    return pokemonList.filter(
      (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Function to add a click event listener to the pokemon list button
  function addClickListener(buttonElement, pokemon) {
    buttonElement.addEventListener("click", () => {
      showDetails(pokemon);
    });
  }

  // Function to add a new pokemon list item to the DOM
  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list");
    let listItem = document.createElement("li");
    listItem.classList.add("list-item");
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("button-pokemon-list");

    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#exampleModal");

    // Add click event listener to the button
    addClickListener(button, pokemon);

    listItem.appendChild(button);
    pokemonList.appendChild(listItem);
  }

  // Function to fetch the pokemon list from API
  function loadList() {
    showLoadingMessage();
    return fetch(apiUrl)
      .then((response) =>  response.json()
      )
      .then((json) => {
        hideLoadingMessage();
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        hideLoadingMessage();
        console.error(e);
      });
  }

  // Function to fetch the details of a single pokemon from API
  function loadDetails(item) {
    showLoadingMessage();
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        hideLoadingMessage();
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types;
      })
      .catch(function (e) {
        hideLoadingMessage();
        console.error(e);
      });
  }

  // Function to show the details of a pokemon in a modal
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon);
    });
  }

  // Function to show a modal
  function showModal(pokemon) {
    let modalTitle = document.querySelector(".modal-title");
    modalTitle.innerText = pokemon.name;

    let pokemonHeight = document.querySelector(".pokemon-height");
    pokemonHeight.innerText = "Height: " + pokemon.height / 10 + "m";

    let typeNames = pokemon.types.map((t) => t.type.name).join(", ");
    let pokemonType = document.querySelector(".pokemon-type");
    pokemonType.innerText = "Type: " + typeNames;

    let imageElement = document.querySelector(".pokemon-image");
    imageElement.src = pokemon.imageUrl;
  }

  return {
    // Expose the relevant functions
    getAll,
    add,
    findByName,
    addListItem,
    loadList,
    loadDetails,
    showDetails,
    showLoadingMessage,
    hideLoadingMessage,
  };
})();

// Load the pokemon list and populate the DOM with pokemon list items
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

// Get the search input field
let searchInput = document.querySelector(".form-control");

// Add an 'input' event listener to the search input field
searchInput.addEventListener("input", function () {
  let searchValue = searchInput.value.toLowerCase(); // Get the value from the search input field

  // Get all the pokemons
  let allPokemons = pokemonRepository.getAll();

  // Filter the pokemons based on the search value
  let foundPokemons = allPokemons.filter(function (pokemon) {
    return pokemon.name.toLowerCase().includes(searchValue);
  });

  // Clear the current list of pokemons
  let pokemonList = document.querySelector(".pokemon-list");
  pokemonList.innerHTML = "";

  // Add the found pokemons to the list
  foundPokemons.forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
