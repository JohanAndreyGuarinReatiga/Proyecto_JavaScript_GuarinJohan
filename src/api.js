const API_BASE_URL = "https://www.dnd5eapi.co/api"


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