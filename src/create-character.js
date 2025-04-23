import { fetchFromAPI, createCharacter } from "./api.js"

// Estado del formulario
const formState = {
  name: "",
  race: null,
  class: null,
  gender: "",
  description: "",
  image: "",
  stats: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  equipment: [],
  traits: [],
  abilities: [],
}

// Elementos DOM
const elements = {
  form: document.getElementById("create-character-form"),
  nameInput: document.getElementById("character-name"),
  raceSelect: document.getElementById("character-race"),
  classSelect: document.getElementById("character-class"),
  genderSelect: document.getElementById("character-gender"),
  descriptionInput: document.getElementById("character-description"),
  imageInput: document.getElementById("character-image"),
  statInputs: {
    strength: document.getElementById("stat-strength"),
    dexterity: document.getElementById("stat-dexterity"),
    constitution: document.getElementById("stat-constitution"),
    intelligence: document.getElementById("stat-intelligence"),
    wisdom: document.getElementById("stat-wisdom"),
    charisma: document.getElementById("stat-charisma"),
  },
  equipmentSelect: document.getElementById("equipment-select"),
  characterEquipment: document.getElementById("character-equipment"),
  addEquipmentBtn: document.getElementById("add-equipment"),
  removeEquipmentBtn: document.getElementById("remove-equipment"),
  traitInput: document.getElementById("trait-input"),
  addTraitBtn: document.getElementById("add-trait"),
  traitsList: document.getElementById("traits-list"),
  abilityInput: document.getElementById("ability-input"),
  addAbilityBtn: document.getElementById("add-ability"),
  abilitiesList: document.getElementById("abilities-list"),
  characterPreview: document.getElementById("character-preview"),
}

// Inicialización
async function init() {
  if (!elements.form) return // No estamos en la página de creación

  // Cargar datos de la API
  await Promise.all([loadRaces(), loadClasses(), loadEquipment()])

  // Configurar event listeners
  setupEventListeners()

  // Inicializar preview
  updateCharacterPreview()
}

// Cargar razas desde la API
async function loadRaces() {
  try {
    const racesData = await fetchFromAPI("races")

    // Actualizar el select de razas
    if (elements.raceSelect) {
      racesData.results.forEach((race) => {
        const option = document.createElement("option")
        option.value = JSON.stringify(race)
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

    // Actualizar el select de clases
    if (elements.classSelect) {
      classesData.results.forEach((cls) => {
        const option = document.createElement("option")
        option.value = JSON.stringify(cls)
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
    const equipment = equipmentData.equipment || []

    // Actualizar el select de equipamiento
    if (elements.equipmentSelect) {
      equipment.forEach((item) => {
        const option = document.createElement("option")
        option.value = JSON.stringify(item)
        option.textContent = item.name
        elements.equipmentSelect.appendChild(option)
      })
    }
  } catch (error) {
    console.error("Error loading equipment:", error)

    // Cargar algunos equipos de ejemplo si falla la API
    const sampleEquipment = [
      { index: "sword", name: "Sword" },
      { index: "bow", name: "Bow" },
      { index: "staff", name: "Staff" },
      { index: "dagger", name: "Dagger" },
      { index: "axe", name: "Axe" },
    ]

    if (elements.equipmentSelect) {
      sampleEquipment.forEach((item) => {
        const option = document.createElement("option")
        option.value = JSON.stringify(item)
        option.textContent = item.name
        elements.equipmentSelect.appendChild(option)
      })
    }
  }
}

// Configurar event listeners
function setupEventListeners() {
  // Inputs básicos
  elements.nameInput.addEventListener("input", () => {
    formState.name = elements.nameInput.value
    updateCharacterPreview()
  })

  elements.raceSelect.addEventListener("change", () => {
    try {
      formState.race = JSON.parse(elements.raceSelect.value)
      updateCharacterPreview()
    } catch (e) {
      formState.race = null
    }
  })

  elements.classSelect.addEventListener("change", () => {
    try {
      formState.class = JSON.parse(elements.classSelect.value)
      updateCharacterPreview()
    } catch (e) {
      formState.class = null
    }
  })

  elements.genderSelect.addEventListener("change", () => {
    formState.gender = elements.genderSelect.value
    updateCharacterPreview()
  })

  elements.descriptionInput.addEventListener("input", () => {
    formState.description = elements.descriptionInput.value
    updateCharacterPreview()
  })

  elements.imageInput.addEventListener("input", () => {
    formState.image = elements.imageInput.value
    updateCharacterPreview()
  })

  // Stats
  Object.entries(elements.statInputs).forEach(([stat, input]) => {
    input.addEventListener("input", () => {
      formState.stats[stat] = Number.parseInt(input.value) || 10
      updateCharacterPreview()
    })
  })

  // Equipment
  elements.addEquipmentBtn.addEventListener("click", addEquipment)
  elements.removeEquipmentBtn.addEventListener("click", removeEquipment)

  // Traits
  elements.addTraitBtn.addEventListener("click", addTrait)
  elements.traitInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTrait()
    }
  })

  // Abilities
  elements.addAbilityBtn.addEventListener("click", addAbility)
  elements.abilityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addAbility()
    }
  })

  // Form submission
  elements.form.addEventListener("submit", handleFormSubmit)
}

// Añadir equipamiento
function addEquipment() {
  const selectedOptions = Array.from(elements.equipmentSelect.selectedOptions)

  selectedOptions.forEach((option) => {
    try {
      const equipment = JSON.parse(option.value)

      // Comprobar si ya está añadido
      if (!formState.equipment.some((e) => e.index === equipment.index)) {
        formState.equipment.push(equipment)

        // Añadir a la lista visual
        const equipmentOption = document.createElement("option")
        equipmentOption.value = option.value
        equipmentOption.textContent = equipment.name
        elements.characterEquipment.appendChild(equipmentOption)
      }
    } catch (e) {
      console.error("Error parsing equipment:", e)
    }
  })

  updateCharacterPreview()
}

// Quitar equipamiento
function removeEquipment() {
  const selectedOptions = Array.from(elements.characterEquipment.selectedOptions)

  selectedOptions.forEach((option) => {
    try {
      const equipment = JSON.parse(option.value)

      // Quitar del estado
      formState.equipment = formState.equipment.filter((e) => e.index !== equipment.index)

      // Quitar de la lista visual
      elements.characterEquipment.removeChild(option)
    } catch (e) {
      console.error("Error parsing equipment:", e)
    }
  })

  updateCharacterPreview()
}

// Añadir rasgo
function addTrait() {
  const trait = elements.traitInput.value.trim()

  if (trait && !formState.traits.includes(trait)) {
    formState.traits.push(trait)

    // Añadir a la lista visual
    const li = document.createElement("li")
    li.innerHTML = `
      ${trait}
      <button type="button" class="remove-trait" data-trait="${trait}">×</button>
    `
    elements.traitsList.appendChild(li)

    // Añadir event listener para quitar
    li.querySelector(".remove-trait").addEventListener("click", function () {
      const traitToRemove = this.getAttribute("data-trait")
      formState.traits = formState.traits.filter((t) => t !== traitToRemove)
      elements.traitsList.removeChild(li)
      updateCharacterPreview()
    })

    // Limpiar input
    elements.traitInput.value = ""
    updateCharacterPreview()
  }
}

// Añadir habilidad
function addAbility() {
  const ability = elements.abilityInput.value.trim()

  if (ability && !formState.abilities.includes(ability)) {
    formState.abilities.push(ability)

    // Añadir a la lista visual
    const li = document.createElement("li")
    li.innerHTML = `
      ${ability}
      <button type="button" class="remove-ability" data-ability="${ability}">×</button>
    `
    elements.abilitiesList.appendChild(li)

    // Añadir event listener para quitar
    li.querySelector(".remove-ability").addEventListener("click", function () {
      const abilityToRemove = this.getAttribute("data-ability")
      formState.abilities = formState.abilities.filter((a) => a !== abilityToRemove)
      elements.abilitiesList.removeChild(li)
      updateCharacterPreview()
    })

    // Limpiar input
    elements.abilityInput.value = ""
    updateCharacterPreview()
  }
}

// Actualizar preview del personaje
function updateCharacterPreview() {
  // Si no hay datos suficientes, mostrar placeholder
  if (!formState.name || !formState.race || !formState.class || !formState.gender) {
    elements.characterPreview.innerHTML = `
      <div class="preview-placeholder">
        <p>Fill out the form to see a preview of your character</p>
      </div>
    `
    return
  }

  // Determinar imagen
  const characterImage = formState.image || `/placeholder.svg?height=200&width=200`

  // Construir HTML de preview
  elements.characterPreview.innerHTML = `
    <div class="preview-character">
      <div class="preview-header">
        <img src="${characterImage}" alt="${formState.name}">
        <div>
          <h3>${formState.name}</h3>
          <p>Race: ${formState.race.name} | Class: ${formState.class.name} | Gender: ${formState.gender.charAt(0).toUpperCase() + formState.gender.slice(1)}</p>
          <p>${formState.description || "No description available."}</p>
        </div>
      </div>
      
      <div>
        <h4>Character Stats</h4>
        <div class="preview-stats">
          ${Object.entries(formState.stats)
            .map(
              ([stat, value]) => `
            <div class="preview-stat">
              <div class="preview-stat-name">${stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
              <div class="preview-stat-value">${value}</div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
      
      <div>
        <h4>Equipment</h4>
        ${
          formState.equipment.length > 0
            ? `
          <ul>
            ${formState.equipment.map((item) => `<li>${item.name}</li>`).join("")}
          </ul>
        `
            : "<p>No equipment selected</p>"
        }
      </div>
      
      <div>
        <h4>Character Traits</h4>
        ${
          formState.traits.length > 0
            ? `
          <ul>
            ${formState.traits.map((trait) => `<li>${trait}</li>`).join("")}
          </ul>
        `
            : "<p>No traits added</p>"
        }
      </div>
      
      <div>
        <h4>Special Abilities</h4>
        ${
          formState.abilities.length > 0
            ? `
          <ul>
            ${formState.abilities.map((ability) => `<li>${ability}</li>`).join("")}
          </ul>
        `
            : "<p>No abilities added</p>"
        }
      </div>
    </div>
  `
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
  e.preventDefault()

  // Validar datos mínimos
  if (!formState.name || !formState.race || !formState.class || !formState.gender) {
    alert("Please fill out all required fields (name, race, class, gender)")
    return
  }

  // Crear objeto de personaje
  const character = {
    name: formState.name,
    race: formState.race,
    class: formState.class,
    gender: formState.gender,
    description: formState.description,
    image: formState.image || `/placeholder.svg?height=200&width=200`,
    stats: { ...formState.stats },
    equipment: [...formState.equipment],
    traits: [...formState.traits],
    abilities: [...formState.abilities],
    type: "custom",
    isFavorite: false,
    createdAt: new Date().toISOString(),
  }

  try {
    // Guardar en MockAPI
    await createCharacter(character)

    // Mostrar mensaje de éxito
    alert("Character created successfully!")

    // Redireccionar a la página de personajes
    window.location.href = "characters.html"
  } catch (error) {
    console.error("Error saving character:", error)
    alert("There was an error saving your character. Please try again.")
  }
}

// Iniciar cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", init)
