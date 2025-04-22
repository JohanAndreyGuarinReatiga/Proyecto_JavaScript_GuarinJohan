const API_BASE_URL = "https://www.dnd5eapi.co/api"
const MOCK_API_URL = "https://67d2f8148bca322cc268a7de.mockapi.io"

// api function
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

// mockapi 
async function getAllCharacters() {
  try {
    const response = await fetch(`${MOCK_API_URL}/characters`)

    if (!response.ok) {
      throw new Error(`Error fetching characters: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting characters from MockAPI:", error)
    return []
  }
}

async function createCharacter(characterData) {
  try {
    const response = await fetch(`${MOCK_API_URL}/characters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(characterData),
    })

    if (!response.ok) {
      throw new Error(`Error creating character: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating character in MockAPI:", error)
    throw error
  }
}