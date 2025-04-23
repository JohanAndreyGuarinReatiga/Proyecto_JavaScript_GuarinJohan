import { fetchFromAPI, fetchCharacters, toggleFavoriteCharacter, deleteCharacter } from "./api.js"

// Estado global de la aplicación
const state = {
  characters: [],
  races: [],
  classes: [],
  equipment: [],
  currentFilters: {
    name: "",
    race: "",
    class: "",
    gender: "",
    equipment: "",
    type: "",
  },
  showingFavorites: false,
}

// Elementos DOM
const elements = {
  charactersContainer: document.getElementById("characters-container"),
  nameSearch: document.getElementById("name-search"),
  raceSelect: document.getElementById("race-select"),
  classSelect: document.getElementById("class-select"),
  genderSelect: document.getElementById("gender-select"),
  equipmentSelect: document.getElementById("equipment-select"),
  characterTypeSelect: document.getElementById("character-type"),
  applyFiltersBtn: document.getElementById("apply-filters"),
  resetFiltersBtn: document.getElementById("reset-filters"),
  toggleFavoritesBtn: document.getElementById("toggle-favorites"),
  resultsCount: document.getElementById("results-count"),
  favoritesCount: document.getElementById("favorites-count"),
  characterModal: document.getElementById("character-modal"),
  modalCharacterDetails: document.getElementById("modal-character-details"),
  closeModal: document.querySelector(".close-modal"),
  menuToggle: document.getElementById("menu-toggle"),
  nav: document.querySelector(".nav"),
}

// Inicialización
async function init() {
  // Inicializar eventos
  setupEventListeners()

  // Cargar datos de la API
  await Promise.all([loadRaces(), loadClasses(), loadEquipment()])

  // Cargar personajes desde MockAPI
  await loadCharacters()

  // Actualizar la UI
  updateCharactersUI()
  updateFavoritesCount()
}

// Cargar personajes desde MockAPI
async function loadCharacters() {
  try {
    // Obtener personajes de la API
    const apiCharacters = await fetchCharacters()

    if (apiCharacters.length > 0) {
      state.characters = apiCharacters
    } else {
      // Si no hay personajes, generar algunos de ejemplo
      await generateSampleCharacters()
    }
  } catch (error) {
    console.error("Error loading characters:", error)
    // Si hay un error, generar personajes de ejemplo
    await generateSampleCharacters()
  }
}

// Configurar event listeners
function setupEventListeners() {
  // Si estamos en la página de personajes
  if (elements.applyFiltersBtn) {
    elements.applyFiltersBtn.addEventListener("click", applyFilters)
    elements.resetFiltersBtn.addEventListener("click", resetFilters)
    elements.toggleFavoritesBtn.addEventListener("click", toggleFavorites)
    elements.closeModal.addEventListener("click", closeCharacterModal)

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener("click", (e) => {
      if (e.target === elements.characterModal) {
        closeCharacterModal()
      }
    })
  }

  // Toggle menu en móvil
  if (elements.menuToggle) {
    elements.menuToggle.addEventListener("click", () => {
      elements.nav.classList.toggle("active")
      elements.menuToggle.classList.toggle("active")
    })
  }
}

// Cargar razas desde la API
async function loadRaces() {
  try {
    const racesData = await fetchFromAPI("races")
    state.races = racesData.results

    // Actualizar el select de razas
    if (elements.raceSelect) {
      state.races.forEach((race) => {
        const option = document.createElement("option")
        option.value = race.index
        option.textContent = race.name
        elements.raceSelect.appendChild(option)
      })
    }
  } catch (error) {
    console.error("Error loading races:", error)
  }
}

// Cargar clases desde la API
async function loadClasses() {
  try {
    const classesData = await fetchFromAPI("classes")
    state.classes = classesData.results

    // Actualizar el select de clases
    if (elements.classSelect) {
      state.classes.forEach((cls) => {
        const option = document.createElement("option")
        option.value = cls.index
        option.textContent = cls.name
        elements.classSelect.appendChild(option)
      })
    }
  } catch (error) {
    console.error("Error loading classes:", error)
  }
}

// Cargar equipamiento desde la API
async function loadEquipment() {
  try {
    const equipmentData = await fetchFromAPI("equipment-categories/weapon")
    state.equipment = equipmentData.equipment || []

    // Actualizar el select de equipamiento
    if (elements.equipmentSelect) {
      state.equipment.forEach((item) => {
        const option = document.createElement("option")
        option.value = item.index
        option.textContent = item.name
        elements.equipmentSelect.appendChild(option)
      })
    }
  } catch (error) {
    console.error("Error loading equipment:", error)

    // Cargar algunos equipos de ejemplo si falla la API
    state.equipment = [
      { index: "sword", name: "Sword" },
      { index: "bow", name: "Bow" },
      { index: "staff", name: "Staff" },
      { index: "dagger", name: "Dagger" },
      { index: "axe", name: "Axe" },
    ]

    if (elements.equipmentSelect) {
      state.equipment.forEach((item) => {
        const option = document.createElement("option")
        option.value = item.index
        option.textContent = item.name
        elements.equipmentSelect.appendChild(option)
      })
    }
  }
}

// Generar personajes de ejemplo basados en la API
async function generateSampleCharacters() {
  if (state.characters.length > 0) return // Ya tenemos personajes

  const characterImages = [
    "img/character1.jpg",
    "img/character2.jpg",
    "img/character3.jpg",
    "img/character4.jpg",
    "img/character5.jpg",
    "img/character6.jpg",
    "img/character7.jpg",
    "img/character8.jpg",
    "img/character9.jpg",
    "img/character10.jpg",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
  ]

  const genders = ["male", "female", "other"]
  const statNames = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"]

  try {
    // Generar 15 personajes aleatorios
    for (let i = 0; i < 15; i++) {
      const randomRaceIndex = Math.floor(Math.random() * state.races.length)
      const randomClassIndex = Math.floor(Math.random() * state.classes.length)
      const randomGenderIndex = Math.floor(Math.random() * genders.length)
      const randomEquipmentIndices = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
        Math.floor(Math.random() * state.equipment.length),
      )

      // Generar estadísticas aleatorias
      const stats = {}
      statNames.forEach((stat) => {
        stats[stat] = Math.floor(Math.random() * 10) + 8 // Valores entre 8-18
      })

      // Crear personaje
      const character = {
        name: `${state.races[randomRaceIndex]?.name || "Unknown"} ${state.classes[randomClassIndex]?.name || "Adventurer"} ${i + 1}`,
        race: state.races[randomRaceIndex] || { index: "unknown", name: "Unknown" },
        class: state.classes[randomClassIndex] || { index: "unknown", name: "Unknown" },
        gender: genders[randomGenderIndex],
        equipment: randomEquipmentIndices.map(
          (idx) => state.equipment[idx] || { index: "unknown", name: "Unknown Item" },
        ),
        stats: stats,
        image: characterImages[i] || "/placeholder.svg?height=200&width=200",
        description: `A brave ${state.races[randomRaceIndex]?.name || "unknown"} ${state.classes[randomClassIndex]?.name || "adventurer"} seeking glory and adventure.`,
        traits: ["Brave in the face of danger", "Loyal to companions", "Seeks knowledge and power"],
        abilities: ["Can cast minor illusions", "Skilled in combat", "Resistant to poison"],
        type: "api",
        isFavorite: false,
        createdAt: new Date().toISOString(),
      }

      try {
        // Guardar en MockAPI
        const savedCharacter = await import("./api.js").then((module) => module.createCharacter(character))
        state.characters.push(savedCharacter)
      } catch (error) {
        console.error("Error saving sample character to API:", error)
      }
    }
  } catch (error) {
    console.error("Error generating sample characters:", error)
  }
}

// Aplicar filtros
function applyFilters() {
  state.currentFilters = {
    name: elements.nameSearch.value.toLowerCase(),
    race: elements.raceSelect.value,
    class: elements.classSelect.value,
    gender: elements.genderSelect.value,
    equipment: elements.equipmentSelect.value,
    type: elements.characterTypeSelect.value,
  }

  state.showingFavorites = false
  elements.toggleFavoritesBtn.textContent = "View Favorites"

  updateCharactersUI()
}

// Resetear filtros
function resetFilters() {
  elements.nameSearch.value = ""
  elements.raceSelect.value = ""
  elements.classSelect.value = ""
  elements.genderSelect.value = ""
  elements.equipmentSelect.value = ""
  elements.characterTypeSelect.value = ""

  state.currentFilters = {
    name: "",
    race: "",
    class: "",
    gender: "",
    equipment: "",
    type: "",
  }

  state.showingFavorites = false
  elements.toggleFavoritesBtn.textContent = "View Favorites"

  updateCharactersUI()
}

// Alternar vista de favoritos
function toggleFavorites() {
  state.showingFavorites = !state.showingFavorites

  if (state.showingFavorites) {
    elements.toggleFavoritesBtn.textContent = "View All Characters"
  } else {
    elements.toggleFavoritesBtn.textContent = "View Favorites"
  }

  updateCharactersUI()
}

// Filtrar personajes según los criterios actuales
function filterCharacters() {
  // Si estamos mostrando favoritos, filtrar solo por favoritos
  if (state.showingFavorites) {
    return state.characters.filter((char) => char.isFavorite)
  }

  // Aplicar todos los filtros
  return state.characters.filter((char) => {
    // Filtro por nombre
    if (state.currentFilters.name && !char.name.toLowerCase().includes(state.currentFilters.name)) {
      return false
    }

    // Filtro por raza
    if (state.currentFilters.race && char.race.index !== state.currentFilters.race) {
      return false
    }

    // Filtro por clase
    if (state.currentFilters.class && char.class.index !== state.currentFilters.class) {
      return false
    }

    // Filtro por género
    if (state.currentFilters.gender && char.gender !== state.currentFilters.gender) {
      return false
    }

    // Filtro por equipamiento
    if (state.currentFilters.equipment && !char.equipment.some((eq) => eq.index === state.currentFilters.equipment)) {
      return false
    }

    // Filtro por tipo de personaje (API o personalizado)
    if (state.currentFilters.type && char.type !== state.currentFilters.type) {
      return false
    }

    return true
  })
}

// Actualizar la UI de personajes
function updateCharactersUI() {
  if (!elements.charactersContainer) return

  const filteredCharacters = filterCharacters()

  // Actualizar contador de resultados
  elements.resultsCount.textContent = `${filteredCharacters.length} characters found`

  // Limpiar contenedor
  elements.charactersContainer.innerHTML = ""

  // Mostrar mensaje si no hay resultados
  if (filteredCharacters.length === 0) {
    elements.charactersContainer.innerHTML = `
      <div class="no-results">
        <p>No characters found matching your criteria.</p>
        <p>Try adjusting your filters or create a new character.</p>
      </div>
    `
    return
  }

  // Renderizar cada personaje
  filteredCharacters.forEach((character) => {
    const characterCard = document.createElement("div")
    characterCard.className = "character-card"
    characterCard.innerHTML = `
      <div class="character-image">
        <img src="${character.image}" alt="${character.name}">
        <button class="favorite ${character.isFavorite ? "active" : ""}" data-id="${character.id}">
          ❤
        </button>
      </div>
      <div class="character-info">
        <h3>${character.name}</h3>
        <p>Race: ${character.race.name}</p>
        <p>Class: ${character.class.name}</p>
        <p>Gender: ${character.gender.charAt(0).toUpperCase() + character.gender.slice(1)}</p>
        <button class="details-button" data-id="${character.id}">View Details</button>
      </div>
    `

    // Añadir event listeners
    const favoriteBtn = characterCard.querySelector(".favorite")
    favoriteBtn.addEventListener("click", () => toggleFavorite(character.id, !character.isFavorite))

    const detailsBtn = characterCard.querySelector(".details-button")
    detailsBtn.addEventListener("click", () => showCharacterDetails(character.id))

    elements.charactersContainer.appendChild(characterCard)
  })
}

// Alternar favorito
async function toggleFavorite(characterId, isFavorite) {
  try {
    // Actualizar en la API
    await toggleFavoriteCharacter(characterId, isFavorite)

    // Actualizar en el estado local
    const characterIndex = state.characters.findIndex((char) => char.id === characterId)
    if (characterIndex !== -1) {
      state.characters[characterIndex].isFavorite = isFavorite
    }

    // Actualizar UI
    updateCharactersUI()
    updateFavoritesCount()
  } catch (error) {
    console.error("Error toggling favorite:", error)
    alert("Error updating favorite status. Please try again.")
  }
}

// Actualizar contador de favoritos
function updateFavoritesCount() {
  const favoritesCountElement = document.getElementById("favorites-count")
  if (favoritesCountElement) {
    const favoritesCount = state.characters.filter((char) => char.isFavorite).length
    favoritesCountElement.textContent = `(${favoritesCount})`
  }
}

// Mostrar detalles del personaje
function showCharacterDetails(characterId) {
  // Buscar el personaje
  const character = state.characters.find((char) => char.id === characterId)

  if (!character) return

  // Construir HTML de detalles
  elements.modalCharacterDetails.innerHTML = `
    <div class="modal-character">
      <div class="modal-character-header">
        <img src="${character.image}" alt="${character.name}">
        <div>
          <h2>${character.name}</h2>
          <p>Race: ${character.race.name} | Class: ${character.class.name} | Gender: ${character.gender.charAt(0).toUpperCase() + character.gender.slice(1)}</p>
          <p>${character.description || "No description available."}</p>
        </div>
      </div>
      
      <div class="modal-character-stats">
        <h3>Character Stats</h3>
        <div class="stats-grid">
          ${Object.entries(character.stats || {})
            .map(
              ([stat, value]) => `
            <div class="stat-item">
              <span class="stat-name">${stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
              <span class="stat-value">${value}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
      
      <div class="modal-character-equipment">
        <h3>Equipment</h3>
        <div class="equipment-list">
          ${character.equipment
            .map(
              (item) => `
            <div class="equipment-item">
              <span class="equipment-name">${item.name}</span>
              <span class="equipment-type">Weapon</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
      
      <div class="modal-character-traits">
        <h3>Character Traits</h3>
        <ul>
          ${(character.traits || []).map((trait) => `<li>${trait}</li>`).join("")}
        </ul>
      </div>
      
      <div class="modal-character-abilities">
        <h3>Special Abilities</h3>
        <ul>
          ${(character.abilities || []).map((ability) => `<li>${ability}</li>`).join("")}
        </ul>
      </div>
      
      <div class="modal-actions">
        <button class="favorite-button ${character.isFavorite ? "active" : ""}" data-id="${character.id}">
          ${character.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
        <button class="delete-button" data-id="${character.id}">Delete Character</button>
      </div>
    </div>
  `

  // Añadir event listener al botón de favoritos
  const favoriteBtn = elements.modalCharacterDetails.querySelector(".favorite-button")
  favoriteBtn.addEventListener("click", async () => {
    await toggleFavorite(character.id, !character.isFavorite)
    favoriteBtn.textContent = character.isFavorite ? "Remove from Favorites" : "Add to Favorites"
    favoriteBtn.classList.toggle("active", character.isFavorite)
  })

  // Añadir event listener al botón de eliminar
  const deleteBtn = elements.modalCharacterDetails.querySelector(".delete-button")
  deleteBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete this character? This action cannot be undone.")) {
      try {
        await deleteCharacter(character.id)

        // Eliminar del estado local
        state.characters = state.characters.filter((char) => char.id !== character.id)

        // Cerrar modal y actualizar UI
        closeCharacterModal()
        updateCharactersUI()
        updateFavoritesCount()

        alert("Character deleted successfully!")
      } catch (error) {
        console.error("Error deleting character:", error)
        alert("Error deleting character. Please try again.")
      }
    }
  })

  // Mostrar modal
  elements.characterModal.style.display = "block"
}

// Cerrar modal de detalles
function closeCharacterModal() {
  elements.characterModal.style.display = "none"
}

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", init)
