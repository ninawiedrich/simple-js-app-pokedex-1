// Create a pokemon repository using an IIFE
let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  let modalContainer = document.querySelector("#modal-container");

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

  // Function to get all the pokemon in the repository
  function getAll() {
    return pokemonList;
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
      console.log("Object is missing required keys");
      return false;
    }
  }

  // Function to find pokemon by name in the repository
  function findByName(name) {
    return pokemonList.filter(
      (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Function to add a click event listener to the pokemon list button
  function addClickListener(buttonElement, pokemon) {
    buttonElement.addEventListener("click", function () {
      showDetails(pokemon);
    });
  }

  // Function to add a new pokemon list item to the DOM
  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list");
    let listItem = document.createElement("li");
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("button-pokemon-list");

    // Add click event listener to the button
    addClickListener(button, pokemon);

    listItem.appendChild(button);
    pokemonList.appendChild(listItem);
  }

  // Function to fetch the pokemon list from API
  function loadList() {
    showLoadingMessage();
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        hideLoadingMessage();
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
          console.log(pokemon);
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
    modalContainer.innerHTML = "";
    let modal = document.createElement("div");
    modal.classList.add("modal");

    let closeButtonElement = document.createElement("span");
    closeButtonElement.classList.add("modal-close");
    closeButtonElement.innerHTML = "&times;";
    closeButtonElement.addEventListener("click", hideModal);

    let modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    let titleElement = document.createElement("h1");
    titleElement.innerText = pokemon.name;

    let typeNames = pokemon.types.map((t) => t.type.name).join(", ");

    let contentElement = document.createElement("p");
    contentElement.innerText =
      "Height: " + pokemon.height + "\n" + "Type: " + typeNames;

    let imageElement = document.createElement("img"); // Image of the Pokemon
    imageElement.src = pokemon.imageUrl;

    modalContent.appendChild(closeButtonElement);
    modalContent.appendChild(titleElement);
    modalContent.appendChild(contentElement);
    modalContent.appendChild(imageElement);
    modalContainer.appendChild(modal);

    modal.appendChild(modalContent);

    modalContainer.classList.add("is-visible");
  }

  // Function to hide the modal
  function hideModal() {
    modalContainer.classList.remove("is-visible");
  }

  // Close the modal when the escape key is pressed
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
      hideModal();
    }
  });

  // Close the modal when the overlay is clicked
  modalContainer.addEventListener("click", (e) => {
    // Since this is also triggered when clicking INSIDE the modal
    // We only want to close if the user clicks directly on the overlay
    let target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });

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
