document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("pokemonSearchForm");
  const randomBtn = document.getElementById("randomBtn");
  const clearBtn = document.getElementById("clearBtn");
  const searchResults = document.getElementById("searchResults");
  const maxPokemonId = 898;

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTerm = document.getElementById("pokemonInput").value.trim().toLowerCase();
    if (searchTerm) {
      searchPokemon(searchTerm);
    }
  });

  randomBtn.addEventListener("click", generateRandomPokemon);
  clearBtn.addEventListener("click", () => {
    // Clear search results
    searchResults.innerHTML = "";
  
    // Reset the value of the search input field
    const searchInput = document.getElementById("pokemonInput");
    if (searchInput) {
      searchInput.value = "";
    }
  });

  async function searchPokemon(nameOrId) {
    try {
      const pokemonData = await fetchPokemonData(nameOrId);
      const speciesData = await fetchPokemonSpecies(pokemonData.species.url);
      const evolutionChainData = await fetchEvolutionChain(speciesData.evolution_chain.url);
      displayPokemonCard(pokemonData, speciesData, evolutionChainData);
    } catch (error) {
      console.error(error);
      displayError(error.message);
    }
  }

  async function generateRandomPokemon() {
    const randomId = Math.floor(Math.random() * maxPokemonId) + 1;
    await searchPokemon(randomId);
  }

  async function displayPokemonCard(pokemonData, speciesData, evolutionChainData) {
    const primaryTypeColor = getTypeColor(pokemonData.types[0].type.name);
    let secondaryTypeColor = primaryTypeColor;
    if (pokemonData.types.length > 1) {
      secondaryTypeColor = getTypeColor(pokemonData.types[1].type.name);
    }
    const typeClasses = pokemonData.types.length > 1 ? 'dual-type' : '';
   // const evolutionChainHtml = await displayEvolutionChain(evolutionChainData);

    const cardHtml = `
      <div class="col-12 col-md-10 col-lg-8 mb-4">
        <div class="pokemon-card ${typeClasses} d-flex flex-column align-items-center w-100"
             style="--primary-type-color: ${primaryTypeColor}; --secondary-type-color: ${secondaryTypeColor};">
          <div class="pokemon-img-container">
            <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="pokemon-img">
          </div>
          <div class="pokemon-info">
            <h2 class="pokemon-name">${capitalizeFirstLetter(pokemonData.name)}</h2>
            <p class="pokemon-type">Type: ${pokemonData.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ')}</p>
            <p class="pokemon-ability">Abilities: ${pokemonData.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ')}</p>
            <p class="pokemon-stats">Height: ${pokemonData.height} | Weight: ${pokemonData.weight}</p>
            <p class="pokemon-flavor">${getFlavorText(speciesData.flavor_text_entries)}</p>
          </div>
         
          </div>
        </div>
      </div>
    `;
    searchResults.insertAdjacentHTML('beforeend', cardHtml);
  }

  async function fetchPokemonData(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async function fetchPokemonSpecies(speciesUrl) {
    const response = await fetch(speciesUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async function fetchEvolutionChain(evolutionChainUrl) {
    const response = await fetch(evolutionChainUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getFlavorText(flavorTextEntries) {
    const entry = flavorTextEntries.find(
      (entry) => entry.language.name === "en"
    );
    return entry ? entry.flavor_text.replace(/\n|\f/g, ' ') : "No description available.";
  }
  function getTypeColor(type) {
    switch (type) {
      case "normal":
        return "#A8A878";
      case "fighting":
        return "#C03028";
      case "flying":
        return "#A890F0";
      case "poison":
        return "#A040A0";
      case "ground":
        return "#E0C068";
      case "rock":
        return "#B8A038";
      case "bug":
        return "#A8B820";
      case "ghost":
        return "#705898";
      case "steel":
        return "#B8B8D0";
      case "fire":
        return "#F08030";
      case "water":
        return "#6890F0";
      case "grass":
        return "#78C850";
      case "electric":
        return "#F8D030";
      case "psychic":
        return "#F85888";
      case "ice":
        return "#98D8D8";
      case "dragon":
        return "#7038F8";
      case "dark":
        return "#705848";
      case "fairy":
        return "#EE99AC";
     
      default:
        return "#777"; // Fallback color 
    }
  }
  function displayError(message) {
    searchResults.innerHTML = `<p class="error">${message}</p>`;
  }
/*
  async function displayEvolutionChain(evolutionChainData) {
    let html = '<ul class="evolution-chain">';
    let currentStage = evolutionChainData.chain;

    do {
      const speciesName = currentStage.species.name;
      const speciesData = await fetchPokemonData(speciesName); // Reusing fetchPokemonData function for species

      if (speciesData.sprites.front_default) {
        const sprite = speciesData.sprites.front_default;
        const name = capitalizeFirstLetter(speciesName);

        html += `
          <li class="evolution-item">
            <img src="${sprite}" alt="${name}" class="pokemon-sprite">
            <span class="evolution-name">${name}</span>
          </li>
        `;
      }

      currentStage = currentStage.evolves_to[0];
    } while (currentStage && currentStage.species);

    html += '</ul>';
    return html;

  } */ 
});