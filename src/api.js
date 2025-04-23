const API_BASE_URL = "https://www.dnd5eapi.co/api"
const MOCK_API_URL = "https://67d2f8148bca322cc268a7de.mockapi.io/"

// Función para obtener datos de la API de D&D
async function fetchFromAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`)

    if (!response.ok) {
      throw new Error(`request error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`getting error ${endpoint}:`, error)
    throw error
  }
}

// Funciones para interactuar con MockAPI
async function fetchCharacters() {
  try {
    const response = await fetch(`${MOCK_API_URL}/characters`)

    if (!response.ok) {
      throw new Error(`Error fetching characters: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching characters:", error)
    return []
  }
}

async function createCharacter(character) {
  try {
    const response = await fetch(`${MOCK_API_URL}/characters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(character),
    })

    if (!response.ok) {
      throw new Error(`Error creating character: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating character:", error)
    throw error
  }
}

async function updateCharacter(id, updates) {
  try {
    const response = await fetch(`${MOCK_API_URL}/characters/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error(`Error updating character: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating character ${id}:`, error)
    throw error
  }
}

async function deleteCharacter(id) {
  try {
    const response = await fetch(`${MOCK_API_URL}/characters/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Error deleting character: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error deleting character ${id}:`, error)
    throw error
  }
}

async function toggleFavoriteCharacter(id, isFavorite) {
  return updateCharacter(id, { isFavorite })
}

export { fetchFromAPI, fetchCharacters, createCharacter, updateCharacter, deleteCharacter, toggleFavoriteCharacter }
