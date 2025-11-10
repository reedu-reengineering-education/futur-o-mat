// State management
const state = {
  currentStep: 'body', // 'body' or 'values'
  selectedCategory: 'bodytype', // Start with bodytype to show skin selector
  selectedValuesTab: 'werte', // 'werte' or 'eigenschaften'
  selectedParts: {},
  selectedItems: [],
  availableParts: [],
  currentSkinTone: 'Hell', // Default skin tone
  currentHairColor: 'black', // Default hair color
  currentBrustAnsatz: false, // Default BrustAnsatz
  visitedTabs: new Set(['head']), // Track visited tabs for progress indicator
  imageCache: new Map(), // Cache for preloaded images
  isLoading: false // Track loading state
};
// Avatar part categories - organized by purpose
const singleSelectCategories = ['head', 'bodytype', 'shoes', 'brust', 'hair', 'values', 'strengths']; // Only one item can be selected
const multiSelectCategories = ['face', 'clothes', 'accessoires', 'handicap']; // Multiple items can be selected
const allCategories = [...singleSelectCategories, ...multiSelectCategories];

// Progress tracking - all tabs in order
const allTabs = ['head', 'face', 'hair', 'bodytype', 'clothes', 'shoes', 'accessoires', 'handicap', 'werte', 'eigenschaften'];
const totalTabs = allTabs.length; // 10 total tabs

// DOM Elements
let avatarCanvas;
let valuesCanvas;
let avatarCtx;
let valuesCtx;
let infoButton;
let infoDialog;
let closeDialog;
let bodyEditorStep;
let valuesEditorStep;
let categoryTabs;
let valuesTabs;
let partsGrid;
let valuesGrid;
let propertiesGrid;
let step1Button; // New: Step 1 button for body editor
let step2Button; // New: Step 2 button for body editor
let step1ButtonValues; // New: Step 1 button for values editor
let step2ButtonValues; // New: Step 2 button for values editor
let downloadButton;
let shareButton;
let surpriseButton; // Added surpriseButton here as it's used later
let downloadButtonValues; // Download button for values step
let shareButtonValues; // Share button for values step
let surpriseButtonValues; // Surprise button for values step
let skinColorSelector; // Skin color selector element
let skinColorOptions; // Skin color option buttons
let hairColorSelector; // Hair color selector element
let hairColorOptions; // Hair color option buttons
let hairRemoveOption; // Hair remove option button (X for "no hair")
let progressBar; // Progress bar element for body editor
let progressBarValues; // Progress bar element for values editor
let tabsContainers; // All tabs containers for fade-out effects
let brustansatzOption; // New: Brustansatz button

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Initialize the app
async function init() { // Make init async
  console.log('Initializing app...');

  // Fetch and load avatar parts from the manifest file
  try {
    const response = await fetch('avatar_parts_manifest.json'); // Path to your generated JSON
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - Could not load avatar_parts_manifest.json`);
    }
    state.availableParts = await response.json();
    if (!state.availableParts || state.availableParts.length === 0) {
        console.warn('Avatar parts manifest loaded, but it is empty. Ensure generate_parts_manifest.js ran correctly and found images.');
        // You might want to add a fallback here or display an error to the user
    }
  } catch (error) {
    console.error("Failed to load avatar parts manifest:", error);
    // Fallback or error handling:
    // For example, you could stop the app or use a predefined minimal set of parts.
    // alert("Could not load avatar parts. The application might not work correctly.");
    // return; // Or stop further initialization if parts are critical
  }

  // Get references to DOM elements
  avatarCanvas = document.getElementById('avatarCanvas'); //
  valuesCanvas = document.getElementById('valuesCanvas'); //

  if (!avatarCanvas || !valuesCanvas) { //
    console.error('Canvas elements not found!'); //
    return;
  }

  avatarCtx = avatarCanvas.getContext('2d'); //
  valuesCtx = valuesCanvas.getContext('2d'); //

  infoButton = document.getElementById('infoButton'); //
  infoDialog = document.getElementById('infoDialog'); //
  closeDialog = document.getElementById('closeDialog'); //
  bodyEditorStep = document.getElementById('bodyEditorStep'); //
  valuesEditorStep = document.getElementById('valuesEditorStep'); //
  categoryTabs = document.querySelectorAll('.tab-button'); //
  valuesTabs = document.querySelectorAll('.values-tab-button'); //
  partsGrid = document.getElementById('partsGrid'); //
  valuesGrid = document.getElementById('valuesGrid'); //
  propertiesGrid = document.getElementById('propertiesGrid'); //

  step1Button = document.getElementById('step1Button'); //
  step2Button = document.getElementById('step2Button'); //
  step1ButtonValues = document.getElementById('step1ButtonValues'); //
  step2ButtonValues = document.getElementById('step2ButtonValues'); //

  surpriseButton = document.getElementById('surpriseButton'); //
  downloadButton = document.getElementById('downloadButton'); //
  shareButton = document.getElementById('shareButton'); //

  surpriseButtonValues = document.getElementById('surpriseButtonValues'); //
  downloadButtonValues = document.getElementById('downloadButtonValues'); //
  shareButtonValues = document.getElementById('shareButtonValues'); //

  skinColorSelector = document.getElementById('skinColorSelector'); //
  skinColorOptions = document.querySelectorAll('.skin-color-option'); //
  hairColorSelector = document.getElementById('hairColorSelector'); //
  hairColorOptions = document.querySelectorAll('.hair-color-option'); //
  hairRemoveOption = document.getElementById('hairRemoveOption'); //

  progressBar = document.getElementById('progressBar'); //
  progressBarValues = document.getElementById('progressBarValues'); //
  tabsContainers = document.querySelectorAll('.tabs-container'); //
  brustansatzOption = document.getElementById('brustansatzOption'); //

  // Ensure parts are loaded before proceeding with dependent functions
  if (state.availableParts && state.availableParts.length > 0) {
    analyzePartNamingPatterns(); // Add this line to debug naming patterns

    // Show initial loading and start preloading images
    showLoadingIndicator();
    preloadAllImages().then(() => {
      console.log('Image preloading completed');
      hideLoadingIndicator();
      // Re-render with cached images for instant display
      render();
    }).catch(error => {
      console.error('Error during image preloading:', error);
      hideLoadingIndicator();
      // Still try to render, images will load on demand
      render();
    });

    // Check for avatar state in URL on initialization
    const urlParams = new URLSearchParams(window.location.search);
    const encodedAvatarState = urlParams.get('avatar_state');

    if (encodedAvatarState) {
      console.log('Found avatar state in URL, decoding and applying...');
      const decodedSuccessfully = decodeAvatarState(encodedAvatarState);
      if (!decodedSuccessfully) {
        console.warn('Failed to decode avatar state from URL, generating random avatar instead.');
        await generateRandomAvatar();
      } else {
        // If decoded successfully, ensure UI reflects the loaded state
        updateSkinColorUI();
        updateHairColorUI();
        updatebrustansatzOptionUI();
        // Re-render grids to show selected parts
        renderPartsGrid();
        renderValuesGrid();
        renderPropertiesGrid();
      }
    } else {
      // If no avatar state in URL, initialize with random avatar
      console.log('No avatar state found in URL, generating random avatar.');
      await generateRandomAvatar(); // Made this await as generateRandomAvatar is async
    }

    // Render initial parts grid
    renderPartsGrid(); //

    // Render initial values grid
    renderValuesGrid(); //
    renderPropertiesGrid(); //

    // Initialize skin color selector
    if (skinColorSelector && state.selectedCategory === 'bodytype') {
      skinColorSelector.style.display = 'block';
      updateSkinColorUI();
    }

    // Initialize hair color selector
    if (hairColorSelector && state.selectedCategory === 'hair') {
      hairColorSelector.style.display = 'block';
      updateHairColorUI();
    }
  } else {
    console.error("Cannot initialize avatar components because avatar parts are not available.");
    // Optionally, display a message in the UI.
  }

  // Setup event listeners
  setupEventListeners(); //

  // Initialize Brustansatz button UI
  updatebrustansatzOptionUI();

  // Initialize progress indicator
  updateProgressIndicator();

  // Initialize tab fade-out effects
  setupTabFadeEffects();

  console.log('App initialized!'); //
}

// Setup event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');

// Info dialog
  infoButton.addEventListener('click', function() {
    console.log('Info button clicked');
    infoDialog.classList.add('active');
  });

 closeDialog.addEventListener('click', function() {
    console.log('Close button clicked');
    infoDialog.classList.remove('active');
  });

  infoDialog.addEventListener('click', function(event) {
    if (event.target === infoDialog) {
      infoDialog.classList.remove('active');
    }
  });

  // Category tabs
  categoryTabs.forEach(tab => {
     tab.addEventListener('click', function() {
      const category = tab.getAttribute('data-category');
      console.log(`Category tab clicked: ${category}`);
      selectCategory(category);
    });
  });

  // Values tabs
  valuesTabs.forEach(tab => {
        tab.addEventListener('click', function() {
      const tabName = tab.getAttribute('data-tab');
      console.log(`Values tab clicked: ${tabName}`);
      selectValuesTab(tabName);
    });
  });

  // Skin color options
  skinColorOptions.forEach(option => {
    option.addEventListener('click', async function() {
      const skinTone = option.getAttribute('data-skin-tone');
      console.log(`Skin color clicked: ${skinTone}`);
      await selectSkinTone(skinTone);
    });
  });

  // Hair color options
  hairColorOptions.forEach(option => {
    option.addEventListener('click', function() {
      const hairColor = option.getAttribute('data-hair-color');
      console.log(`Hair color clicked: ${hairColor}`);
      selectHairColor(hairColor);
    });
  });

  // Hair remove option (X button for "no hair")
  if (hairRemoveOption) {
    hairRemoveOption.addEventListener('click', function() {
      console.log('Hair remove option clicked - removing hair');
      removeHair();
    });
  }

  // Brustansatz button
  if (brustansatzOption) {
    brustansatzOption.addEventListener('click', e => {
      e.stopPropagation();
      toggleBrustansatz();
    });
  }

  // Step navigation
  step1Button.addEventListener('click', function() {
    console.log('Step 1 button clicked');
    goToBodyStep();
  });

  step2Button.addEventListener('click', function() {
    console.log('Step 2 button clicked');
    goToValuesStep();
  });

  step1ButtonValues.addEventListener('click', function() {
    console.log('Step 1 button clicked from values editor');
    goToBodyStep();
  });

  step2ButtonValues.addEventListener('click', function() {
    console.log('Step 2 button clicked from values editor');
    goToValuesStep();
  });

  // Actions
  surpriseButton.addEventListener('click', function() {
    console.log('Suprise button clicked');
    generateRandomAvatar();
  });

  downloadButton.addEventListener('click', async function() { // Made async
    console.log('Download button clicked');
    await render(); // Ensure render completes before download
    downloadAvatar();
  });

  shareButton.addEventListener('click', async function() { // Made async
    console.log('Share button clicked');
    await render(); // Ensure render completes before share
    shareAvatar();
  });

  // Values step buttons
  if (surpriseButtonValues) {
    surpriseButtonValues.addEventListener('click', function() {
      console.log('Surprise button (values) clicked');
      generateRandomAvatar();
    });
  }

  if (downloadButtonValues) {
    downloadButtonValues.addEventListener('click', async function() {
      console.log('Download button (values) clicked');
      await render(); // Ensure render completes before download
      downloadAvatar();
    });
  }

  if (shareButtonValues) {
    shareButtonValues.addEventListener('click', async function() {
      console.log('Share button (values) clicked');
      await render(); // Ensure render completes before share
      shareAvatar();
    });
  }

  console.log('Event listeners setup complete');
}

// Helper function to get the current body type from the selected bodytype part
function getCurrentBodyType() {
  const selectedBodytypeId = state.selectedParts['bodytype'];
  if (!selectedBodytypeId) return null;

  const selectedBodytypePart = state.availableParts.find(part => part.id === selectedBodytypeId);
  if (!selectedBodytypePart) return null;

  // Extract body type from the part ID or source
  const bodyTypes = ['Breit', 'Eng', 'Normal', 'Betont'];
  for (const bodyType of bodyTypes) {
    if (selectedBodytypePart.id.includes(bodyType) || selectedBodytypePart.src.includes(bodyType)) {
      return bodyType;
    }
  }

  return null;
}

// Render parts grid based on selected category
function renderPartsGrid() {
  console.log(`Rendering parts grid for category: ${state.selectedCategory}`);

  // Check if color selectors are visible and update parts selector class
  const partsSelector = document.querySelector('.parts-selector');
  const skinColorSelector = document.getElementById('skinColorSelector');
  const hairColorSelector = document.getElementById('hairColorSelector');

  const isSkinColorVisible = skinColorSelector && skinColorSelector.style.display !== 'none';
  const isHairColorVisible = hairColorSelector && hairColorSelector.style.display !== 'none';
  const hasVisibleColorSelectors = isSkinColorVisible || isHairColorVisible;

  if (partsSelector) {
    if (hasVisibleColorSelectors) {
      partsSelector.classList.remove('no-color-selectors');
      console.log('Color selectors visible - showing one row');
    } else {
      partsSelector.classList.add('no-color-selectors');
      console.log('No color selectors visible - allowing two rows');
    }
  }

  let parts = state.availableParts.filter(part => part.category === state.selectedCategory);

  // Filter parts by skin tone for categories that have skin tone variations
  const skinToneCategories = ['bodytype', 'head'];
  if (skinToneCategories.includes(state.selectedCategory) && state.currentSkinTone) {
    console.log(`Filtering ${state.selectedCategory} parts by skin tone: ${state.currentSkinTone}`);

    const skinToneFilteredParts = parts.filter(part => {
      const matchesSkinTone = part.id.includes(state.currentSkinTone) ||
                             part.src.includes(state.currentSkinTone);

      if (matchesSkinTone) {
        console.log(`Part ${part.id} matches skin tone ${state.currentSkinTone}`);
      }

      return matchesSkinTone;
    });

    console.log(`Found ${skinToneFilteredParts.length} parts matching skin tone ${state.currentSkinTone} out of ${parts.length} total parts`);

    // Only use filtered parts if we found any, otherwise show all parts as fallback
    if (skinToneFilteredParts.length > 0) {
      parts = skinToneFilteredParts;
    } else {
      console.warn(`No parts found for skin tone ${state.currentSkinTone} in category ${state.selectedCategory}, showing all parts`);
    }
  }

  // Filter parts by hair color for hair category
  if (state.selectedCategory === 'hair' && state.currentHairColor) {
    console.log(`Filtering hair parts by hair color: ${state.currentHairColor}`);

    const hairColorFilteredParts = parts.filter(part => {
      // Check if part matches the selected hair color
      const matchesHairColor = part.id.includes(state.currentHairColor) ||
                               part.src.includes(state.currentHairColor);

      // Check if part has no hair color indicator (universal items like Käppi, Kopftuch)
      const hairColors = ['black', 'blonde', 'brunette', 'red', 'white'];
      const hasNoHairColorIndicator = !hairColors.some(color =>
        part.id.includes(color) || part.src.includes(color)
      );

      const shouldInclude = matchesHairColor || hasNoHairColorIndicator;

      if (shouldInclude) {
        console.log(`Part ${part.id} ${matchesHairColor ? 'matches hair color' : 'has no hair color indicator'}`);
      }

      return shouldInclude;
    });

    console.log(`Found ${hairColorFilteredParts.length} parts matching hair color ${state.currentHairColor} out of ${parts.length} total parts`);

    // Only use filtered parts if we found any, otherwise show all parts as fallback
    if (hairColorFilteredParts.length > 0) {
      parts = hairColorFilteredParts;
    } else {
      console.warn(`No parts found for hair color ${state.currentHairColor} in category ${state.selectedCategory}, showing all parts`);
    }
  }

  // Filter parts by body type for clothes and accessories
  const bodyTypeCategories = ['clothes', 'accessoires'];
  if (bodyTypeCategories.includes(state.selectedCategory)) {
    const currentBodyType = getCurrentBodyType();
    if (currentBodyType) {
      console.log(`Filtering ${state.selectedCategory} parts by body type: ${currentBodyType}`);

      const bodyTypeFilteredParts = parts.filter(part => {
        // Include parts that match the body type OR parts that don't have any body type indicator (case-insensitive)
        const matchesBodyType = part.id.toLowerCase().includes(currentBodyType.toLowerCase()) ||
                               part.src.toLowerCase().includes(currentBodyType.toLowerCase());
        const hasNoBodyTypeIndicator = !['Breit', 'Eng', 'Normal'].some(type =>
          part.id.toLowerCase().includes(type.toLowerCase()) || part.src.toLowerCase().includes(type.toLowerCase())
        );

        const shouldInclude = matchesBodyType || hasNoBodyTypeIndicator;

        if (shouldInclude) {
          console.log(`Part ${part.id} ${matchesBodyType ? 'matches body type' : 'has no body type indicator'}`);
        }

        return shouldInclude;
      });

      console.log(`Found ${bodyTypeFilteredParts.length} parts matching body type ${currentBodyType} (or no type) out of ${parts.length} total parts`);

      // Only use filtered parts if we found any, otherwise show all parts as fallback
      if (bodyTypeFilteredParts.length > 0) {
        parts = bodyTypeFilteredParts;
      } else {
        console.warn(`No parts found for body type ${currentBodyType} in category ${state.selectedCategory}, showing all parts`);
      }
    } else {
      console.log(`No body type selected, showing all ${state.selectedCategory} parts`);
    }
  }

  if (!partsGrid) {
    console.error('partsGrid element not found!');
    return;
  }

  partsGrid.innerHTML = '';
  parts.forEach(part => {
    // Check if this is a multiselect category (face, clothing, accessories)
    const isMultiSelectType = multiSelectCategories.includes(part.category);

    // For multiselect items, check if it's in the selectedItems array
    // For single select items, check if it's the selected part for that category
    const isSelected = isMultiSelectType
      ? state.selectedItems.includes(part.id)
      : state.selectedParts[part.category] === part.id;

    const partElement = createPartElement(part, isSelected);

    partElement.addEventListener('click', () => {
      console.log(`Part selected: ${part.id}`);

      // Handle multiselect items differently
      if (isMultiSelectType) {
        toggleItem(part);
      } else {
        selectPart(part);

        // If bodytype was selected, re-render parts grids to apply body type filtering
        if (part.category === 'bodytype') {
          renderPartsGrid(); // Re-render current grid with new body type filter
        }
      }

      render(); // Render after part selection
    });

    partsGrid.appendChild(partElement);
  });
}

// Render values grid
function renderValuesGrid() {
  console.log('Rendering values grid');
  const valueParts = state.availableParts.filter(part => part.category === 'values');

  if (!valuesGrid) {
    console.error('valuesGrid element not found!');
    return;
  }

  valuesGrid.innerHTML = '';
  valueParts.forEach(part => {
    const isSelected = state.selectedParts['values'] === part.id;
    const partElement = createPartElement(part, isSelected);

    partElement.addEventListener('click', () => {
      console.log(`Value item selected: ${part.id}`);
      selectPart(part);
      render(); // Render after part selection
    });

    valuesGrid.appendChild(partElement);
  });
}

// Render properties grid
function renderPropertiesGrid() {
  console.log('Rendering properties grid');
  const propertyParts = state.availableParts.filter(part => part.category === 'strengths');

  if (!propertiesGrid) {
    console.error('propertiesGrid element not found!');
    return;
  }

  propertiesGrid.innerHTML = '';
  propertyParts.forEach(part => {
    const isSelected = state.selectedParts['strengths'] === part.id;
    const partElement = createPartElement(part, isSelected);

    partElement.addEventListener('click', () => {
      console.log(`Property item selected: ${part.id}`);
      selectPart(part);
      render(); // Render after part selection
    });

    propertiesGrid.appendChild(partElement);
  });
}

// Create a part element for the grid with auto-cropping for thumbnails
function createPartElement(part, isSelected) {
  const partElement = document.createElement('div');
  partElement.classList.add('part-item');
  if (isSelected) {
    partElement.classList.add('selected');
  }

  // Create a temporary canvas for cropping the image
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  const img = new Image();
  
  img.crossOrigin = "Anonymous"; // Handle CORS if needed
  img.src = part.src;
  img.alt = `${part.category} option`;
  
  // Add a placeholder while loading
  const placeholderImg = document.createElement('img');
  placeholderImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect width="50" height="50" style="fill:rgb(200,200,200);" /></svg>';
  partElement.appendChild(placeholderImg);
  
  img.onload = function() {
    // Create a cropped version of the image
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    tempCtx.drawImage(img, 0, 0);
    
    // Find the bounds of non-transparent pixels
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const bounds = findVisibleBounds(imageData);
    
    if (bounds) {
      // Create a new canvas with just the visible part
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = bounds.width;
      croppedCanvas.height = bounds.height;
      const croppedCtx = croppedCanvas.getContext('2d');
      
      // Draw only the visible part
      croppedCtx.drawImage(
        img, 
        bounds.left, bounds.top, bounds.width, bounds.height,
        0, 0, bounds.width, bounds.height
      );
      
      // Replace placeholder with cropped image
      const croppedImg = document.createElement('img');
      croppedImg.src = croppedCanvas.toDataURL('image/png');
      croppedImg.alt = img.alt;
      croppedImg.classList.add('cropped-thumbnail');
      
      // Replace the placeholder
      partElement.removeChild(placeholderImg);
      partElement.appendChild(croppedImg);
    } else {
      // If no visible bounds found, just use the original image
      partElement.removeChild(placeholderImg);
      partElement.appendChild(img);
    }
  };
  
  img.onerror = function() {
    console.error(`Failed to load image: ${part.src}`);
    // Placeholder already added
  };
  
  return partElement;
}

// Helper function to find the bounds of visible pixels in an image
function findVisibleBounds(imageData) {
  const { width, height, data } = imageData;
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let foundVisible = false;
  
  // Scan through all pixels to find the bounds of non-transparent ones
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3]; // Alpha channel
      if (alpha > 10) { // Using a threshold to account for very faint pixels
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        foundVisible = true;
      }
    }
  }
  
  if (!foundVisible) return null;
  
  // Add a small padding around the visible area
  const padding = 2;
  return {
    left: Math.max(0, minX - padding),
    top: Math.max(0, minY - padding),
    width: Math.min(width, maxX - minX + 1 + padding * 2),
    height: Math.min(height, maxY - minY + 1 + padding * 2)
  };
}

// Update progress indicator based on visited tabs
function updateProgressIndicator() {
  const visitedCount = state.visitedTabs.size;
  const progressPercentage = (visitedCount / totalTabs) * 100;

  console.log(`Progress: ${visitedCount}/${totalTabs} tabs visited (${progressPercentage.toFixed(1)}%)`);

  // Update both progress bars
  if (progressBar) {
    progressBar.style.width = `${progressPercentage}%`;
  }
  if (progressBarValues) {
    progressBarValues.style.width = `${progressPercentage}%`;
  }
}

// Setup tab fade-out effects for overflow indication
function setupTabFadeEffects() {
  tabsContainers.forEach(container => {
    const tabsElement = container.querySelector('.category-tabs, .values-tabs');
    if (tabsElement) {
      // Check scroll state on load
      updateTabFadeState(container, tabsElement);

      // Update on scroll
      tabsElement.addEventListener('scroll', () => {
        updateTabFadeState(container, tabsElement);
      });

      // Update on resize
      window.addEventListener('resize', () => {
        updateTabFadeState(container, tabsElement);
      });
    }
  });
}

// Update fade-out state based on scroll position
function updateTabFadeState(container, tabsElement) {
  const scrollLeft = tabsElement.scrollLeft;
  const scrollWidth = tabsElement.scrollWidth;
  const clientWidth = tabsElement.clientWidth;
  const maxScroll = scrollWidth - clientWidth;

  // Show left fade if scrolled right
  if (scrollLeft > 5) { // 5px threshold to avoid flickering
    container.classList.add('scrollable-left');
  } else {
    container.classList.remove('scrollable-left');
  }

  // Show right fade if can scroll more
  if (scrollLeft < maxScroll - 5) { // 5px threshold
    container.classList.add('scrollable-right');
  } else {
    container.classList.remove('scrollable-right');
  }
}

// Select a category
function selectCategory(category) {
  state.selectedCategory = category;

  // Track visited tab for progress
  state.visitedTabs.add(category);
  updateProgressIndicator();

  // Update tab UI
  categoryTabs.forEach(tab => {
    if (tab.getAttribute('data-category') === category) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Show/hide skin color selector based on category
  if (skinColorSelector) {
    if (category === 'bodytype') {
      skinColorSelector.style.display = 'block';
      updateSkinColorUI();
    } else {
      skinColorSelector.style.display = 'none';
    }
  }

  // Show/hide hair color selector based on category
  if (hairColorSelector) {
    if (category === 'hair') {
      hairColorSelector.style.display = 'block';
      updateHairColorUI();
    } else {
      hairColorSelector.style.display = 'none';
    }
  }

  // Re-render parts grid
  renderPartsGrid();
  render(); // Render after category selection
}

// Select a values tab
function selectValuesTab(tabName) {
  state.selectedValuesTab = tabName;

  // Track visited tab for progress
  state.visitedTabs.add(tabName);
  updateProgressIndicator();

  // Update tab UI
  valuesTabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update content visibility
  document.querySelectorAll('.values-content').forEach(content => {
    if (content.getAttribute('data-tab-content') === tabName) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}

// Select a skin tone
async function selectSkinTone(skinTone) {
  console.log(`=== SELECTING SKIN TONE: ${skinTone} ===`);
  console.log(`Current selected parts before update:`, state.selectedParts);
  console.log(`Previous skin tone:`, state.currentSkinTone);

  state.currentSkinTone = skinTone;
  console.log(`Updated state.currentSkinTone to:`, state.currentSkinTone);

  // Update skin color UI
  updateSkinColorUI();

  // Update all body parts that have skin tone variations (force update all categories)
  updateBodyPartsForSkinTone(skinTone, true);

  console.log(`Selected parts after update:`, state.selectedParts);

  // Re-render parts grid and avatar
  renderPartsGrid();
  console.log(`About to render avatar with skin tone: ${skinTone}`);
  await render(); // Make sure render completes
  console.log(`=== SKIN TONE SELECTION COMPLETE ===`);
}

// Update skin color UI to reflect current selection
function updateSkinColorUI() {
  if (!skinColorOptions) return;

  skinColorOptions.forEach(option => {
    const skinTone = option.getAttribute('data-skin-tone');
    if (skinTone === state.currentSkinTone) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}

// Select a hair color
function selectHairColor(hairColor) {
  console.log(`Selecting hair color: ${hairColor}`);
  console.log(`Current selected parts before hair color update:`, state.selectedParts);

  state.currentHairColor = hairColor;

  // Update hair color UI
  updateHairColorUI();

  // Update hair parts to match the selected color
  updateHairPartsForColor(hairColor);

  console.log(`Selected parts after hair color update:`, state.selectedParts);

  // Re-render parts grid and avatar
  renderPartsGrid();
  render();
}

// Remove hair (set to "no hair" / bald)
function removeHair() {
  console.log('Removing hair - setting to bald/no hair');

  // Clear the selected hair part
  state.selectedParts['hair'] = null;
  state.currentHairColor = null;

  console.log('Hair removed, selectedParts:', state.selectedParts);

  // Update hair color UI
  updateHairColorUI();

  // Re-render parts grid and avatar
  renderPartsGrid();
  render();
}

// Update hair color UI to reflect current selection
function updateHairColorUI() {
  if (!hairColorOptions || !hairRemoveOption) return;

  // Check if no hair is selected (bald state)
  const isNoHair = !state.selectedParts['hair'];

  // Update hair color options
  hairColorOptions.forEach(option => {
    const hairColor = option.getAttribute('data-hair-color');
    if (!isNoHair && hairColor === state.currentHairColor) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });

  // Update hair remove option (X button)
  if (isNoHair) {
    hairRemoveOption.classList.add('active');
  } else {
    hairRemoveOption.classList.remove('active');
  }
  
}

function toggleBrustansatz() {
  // find the real ID
  const part = state.availableParts.find(p => p.category === 'brust');
  if (!part) return;
  const brustansatzPartId = part.id; // e.g. "brust_mittel"

  state.currentBrustAnsatz = !state.currentBrustAnsatz;
  if (state.currentBrustAnsatz) {
    state.selectedParts['brust'] = brustansatzPartId;
  } else {
    state.selectedParts['brust'] = null;
  }
  updatebrustansatzOptionUI();
  renderAvatar(avatarCanvas, avatarCtx);
}

// Update Brustansatz button UI to reflect current selection
function updatebrustansatzOptionUI() {
  if (!brustansatzOption) return;

  const brustansatzPartId = 'brust';
  if (state.currentBrustAnsatz) {
    brustansatzOption.classList.add('active');
  } else {
    brustansatzOption.classList.remove('active');
  }
}

// Helper function to update hair parts based on hair color
function updateHairPartsForColor(hairColor) {
  console.log(`Updating hair parts for hair color: ${hairColor}`);

  // Get the currently selected hair part
  const currentHairPartId = state.selectedParts['hair'];
  if (!currentHairPartId) {
    console.log(`No hair part selected, selecting a default part with hair color ${hairColor}`);

    // If no hair part is selected, find any part with the correct hair color
    const hairParts = state.availableParts.filter(part =>
      part.category === 'hair' &&
      (part.id.includes(hairColor) || part.src.includes(hairColor))
    );

    if (hairParts.length > 0) {
      const defaultPart = hairParts[0];
      state.selectedParts['hair'] = defaultPart.id;
      console.log(`Selected default hair part: ${defaultPart.id}`);
    } else {
      console.log(`No hair parts found with hair color ${hairColor}`);
    }
    return;
  }

  // Find a hair part with the same style but different color
  const currentPart = state.availableParts.find(p => p.id === currentHairPartId);
  if (!currentPart) {
    console.log(`Current hair part ${currentHairPartId} not found in available parts`);
    return;
  }

  // Try to find a matching hair part with the new color
  const hairPartsWithNewColor = state.availableParts.filter(part =>
    part.category === 'hair' &&
    (part.id.includes(hairColor) || part.src.includes(hairColor))
  );

  if (hairPartsWithNewColor.length > 0) {
    // Try to find a part with similar style (same hair type)
    const currentHairStyle = currentPart.id.replace(/_(black|blonde|brunette|red|white)_/g, '_');
    const matchingStylePart = hairPartsWithNewColor.find(part => {
      const partStyle = part.id.replace(/_(black|blonde|brunette|red|white)_/g, '_');
      return partStyle.includes(currentHairStyle.split('_').slice(-1)[0]) ||
             currentHairStyle.includes(partStyle.split('_').slice(-1)[0]);
    });

    const newPart = matchingStylePart || hairPartsWithNewColor[0];
    state.selectedParts['hair'] = newPart.id;
    console.log(`Updated hair part from ${currentHairPartId} to ${newPart.id}`);
  } else {
    console.log(`No hair parts found with hair color ${hairColor}`);
  }
}

// Select a part with skin tone awareness
function selectPart(part) {
  console.log(`Selecting part: ${part.id}, category: ${part.category}`);
  
  // If selecting a body part that has skin tone variations
  if (part.category === 'bodytype' || part.category === 'head') {
    // Extract the skin tone from the selected part ID
    let skinTone = '';
    
    // Check for skin tone in the part ID - be more flexible with the pattern matching
    if (part.id.includes('Hell')) skinTone = 'Hell';
    else if (part.id.includes('Braun')) skinTone = 'Braun';
    else if (part.id.includes('Dunkel')) skinTone = 'Dunkel';
    
    console.log(`Detected skin tone: ${skinTone || 'None'}`);
    
    // If we detected a skin tone, update all body parts to match
    if (skinTone) {
      // Store the current skin tone for future reference
      state.currentSkinTone = skinTone;
      console.log(`Updated current skin tone to: ${skinTone}`);
      
      // Update other body parts that have skin tone variations
      updateBodyPartsForSkinTone(skinTone);
    }
  }
  
  // Always update the selected part for its category
  state.selectedParts[part.category] = part.id;
  console.log(`Updated selected part for ${part.category}: ${part.id}`);

  // If bodytype was selected, update clothes and accessories to match the new body type
  if (part.category === 'bodytype') {
    updateClothesAndAccessoriesForBodyType();
  }

  // Re-render the appropriate grids based on the category
  if (part.category === 'values') {
    renderValuesGrid();
  } else if (part.category === 'strengths') {
    renderPropertiesGrid();
  } else {
    renderPartsGrid();
  }
}

// Helper function to update body parts based on skin tone
function updateBodyPartsForSkinTone(skinTone, forceUpdateAll = false) {
  console.log(`Updating body parts for skin tone: ${skinTone}, forceUpdateAll: ${forceUpdateAll}`);

  // Categories that have skin tone variations
  const skinToneCategories = ['bodytype', 'head'];

  // For each category that has skin tone variations
  skinToneCategories.forEach(category => {
    console.log(`Processing category: ${category}`);

    // Get the currently selected part for this category
    const currentPartId = state.selectedParts[category];

    // Find all parts for this category with the new skin tone
    const categoryParts = state.availableParts.filter(part =>
      part.category === category &&
      (part.id.includes(skinTone) || part.src.includes(skinTone))
    );

    console.log(`Found ${categoryParts.length} ${category} parts with skin tone ${skinTone}`);

    if (categoryParts.length === 0) {
      console.log(`No parts found for ${category} with skin tone ${skinTone}`);
      return;
    }

    // If no part is currently selected, just pick the first one
    if (!currentPartId) {
      const defaultPart = categoryParts[0];
      state.selectedParts[category] = defaultPart.id;
      console.log(`Selected default ${category} part: ${defaultPart.id}`);
      return;
    }

    // If a part is selected, try to find a matching one with the same body/head type
    const currentPart = state.availableParts.find(p => p.id === currentPartId);
    if (!currentPart) {
      // Current part not found, select first available
      const defaultPart = categoryParts[0];
      state.selectedParts[category] = defaultPart.id;
      console.log(`Current part not found, selected default ${category} part: ${defaultPart.id}`);
      return;
    }

    // Extract shape/type from current part (Breit, Eng, Normal, Oval, Rund, Eckig)
    const shapePatterns = ['Breit', 'Eng', 'Normal', 'Oval', 'Rund', 'Eckig'];
    let currentShape = null;

    for (const pattern of shapePatterns) {
      if (currentPart.id.includes(pattern) || currentPart.src.includes(pattern)) {
        currentShape = pattern;
        break;
      }
    }

    console.log(`Current ${category} shape: ${currentShape || 'None'}`);

    // Try to find a part with the same shape and new skin tone
    if (currentShape) {
      const matchingParts = categoryParts.filter(p =>
        p.id.includes(currentShape) || p.src.includes(currentShape)
      );

      if (matchingParts.length > 0) {
        const newPart = matchingParts[0];
        state.selectedParts[category] = newPart.id;
        console.log(`Updated ${category} to ${newPart.id} (matching shape: ${currentShape})`);
        return;
      }
    }

    // If no matching shape found, just use the first part with the new skin tone
    const defaultPart = categoryParts[0];
    state.selectedParts[category] = defaultPart.id;
    console.log(`No matching shape found, selected default ${category} part: ${defaultPart.id}`);
  });
}

// Helper function to update clothes and accessories when body type changes
function updateClothesAndAccessoriesForBodyType() {
  const currentBodyType = getCurrentBodyType();
  if (!currentBodyType) {
    console.log('No body type selected, skipping clothes/accessories update');
    return;
  }

  console.log(`Updating clothes and accessories for body type: ${currentBodyType}`);

  // Categories that need body type filtering
  const bodyTypeCategories = ['clothes', 'accessoires'];

  // Get currently selected items that are clothes or accessories
  const currentClothesAndAccessories = state.selectedItems.filter(itemId => {
    const item = state.availableParts.find(p => p.id === itemId);
    return item && bodyTypeCategories.includes(item.category);
  });

  console.log(`Current clothes/accessories: ${currentClothesAndAccessories.join(', ')}`);

  // Filter out items that don't match the new body type
  const incompatibleItems = [];
  const compatibleItems = [];

  currentClothesAndAccessories.forEach(itemId => {
    const item = state.availableParts.find(p => p.id === itemId);
    if (!item) return;

    // Check if item matches the body type OR has no body type indicator (case-insensitive)
    const matchesBodyType = item.id.toLowerCase().includes(currentBodyType.toLowerCase()) ||
                           item.src.toLowerCase().includes(currentBodyType.toLowerCase());
    const hasNoBodyTypeIndicator = !['Breit', 'Eng', 'Normal'].some(type =>
      item.id.toLowerCase().includes(type.toLowerCase()) || item.src.toLowerCase().includes(type.toLowerCase())
    );

    if (matchesBodyType || hasNoBodyTypeIndicator) {
      compatibleItems.push(itemId);
    } else {
      incompatibleItems.push(itemId);
      console.log(`Removing incompatible item: ${item.id} (doesn't match body type ${currentBodyType})`);
    }
  });

  // Remove incompatible items from selectedItems
  incompatibleItems.forEach(itemId => {
    const index = state.selectedItems.indexOf(itemId);
    if (index > -1) {
      state.selectedItems.splice(index, 1);
    }
  });

  if (incompatibleItems.length > 0) {
    console.log(`Removed ${incompatibleItems.length} incompatible items`);
    console.log(`Remaining compatible items: ${compatibleItems.join(', ')}`);
  } else {
    console.log('All current clothes/accessories are compatible with the new body type');
  }
}

// Toggle an item selection (true multiselect - allows multiple items per category)
function toggleItem(part) {
  const index = state.selectedItems.indexOf(part.id);

  if (index > -1) {
    // If already selected, deselect it
    state.selectedItems.splice(index, 1);
    console.log(`Deselected item: ${part.id}`);
  } else {
    // If not selected, add it to the selection (no removal of other items)
    state.selectedItems.push(part.id);
    console.log(`Selected item: ${part.id}`);
  }

  console.log(`Current selected items: ${state.selectedItems.join(', ')}`);

  // Re-render grids to update selection state
  renderPartsGrid();
  renderValuesGrid();
  renderPropertiesGrid();
}

// Go to values editor step
function goToValuesStep() {
  state.currentStep = 'values';
  bodyEditorStep.classList.remove('active');
  valuesEditorStep.classList.add('active');

  // Update button active states
  step1Button.classList.remove('active');
  step2Button.classList.add('active');
  step1ButtonValues.classList.remove('active');
  step2ButtonValues.classList.add('active');

  render(); // Ensure render after step change
}

// Go to body editor step
function goToBodyStep() {
  state.currentStep = 'body';
  valuesEditorStep.classList.remove('active');
  bodyEditorStep.classList.add('active');

  // Update button active states
  step1Button.classList.add('active');
  step2Button.classList.remove('active');
  step1ButtonValues.classList.add('active');
  step2ButtonValues.classList.remove('active');

  render(); // Ensure render after step change
}

// Removed finishAvatar function

// Generate random avatar
async function generateRandomAvatar() {
  console.log('Generating random avatar');

  // First, randomly select a skin tone
  const skinTones = ['Hell', 'Braun', 'Dunkel'];
  const randomSkinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
  state.currentSkinTone = randomSkinTone;
  console.log(`Selected random skin tone: ${randomSkinTone}`);

  // Update skin color UI to reflect the random selection
  updateSkinColorUI();
  
  // Select random parts for single select categories
  singleSelectCategories.forEach(category => {
    // Special handling for hair - sometimes select "no hair"
    if (category === 'hair') {
      // 20% chance of no hair (bald)
      if (Math.random() < 0.2) {
        state.selectedParts[category] = null;
        state.currentHairColor = null;
        console.log('Selected random hair: No hair (bald)');
        return;
      }

      // Otherwise, select a random hair color and part
      const hairColors = ['black', 'blonde', 'brunette', 'red', 'white'];
      const randomHairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
      state.currentHairColor = randomHairColor;

      // Filter hair parts by the selected color
      let categoryParts = state.availableParts.filter(part =>
        part.category === category &&
        (part.id.includes(randomHairColor) || part.src.includes(randomHairColor))
      );

      if (categoryParts.length) {
        const randomPart = categoryParts[Math.floor(Math.random() * categoryParts.length)];
        state.selectedParts[category] = randomPart.id;
        console.log(`Selected random ${category}: ${randomPart.id} (color: ${randomHairColor})`);
      } else {
        console.log(`No hair parts available for color ${randomHairColor}`);
        state.selectedParts[category] = null;
        state.currentHairColor = null;
      }
      return;
    }

    // For other categories, use the original logic
    let categoryParts = state.availableParts.filter(part => part.category === category);

    // For categories with skin tone, filter by the selected skin tone
    if (category === 'bodytype' || category === 'head') {
      const skinToneParts = categoryParts.filter(part =>
        part.id.includes(randomSkinTone) || part.src.includes(randomSkinTone)
      );

      console.log(`Found ${skinToneParts.length} ${category} parts with skin tone ${randomSkinTone}`);
      console.log(`Available ${category} parts:`, categoryParts.map(p => p.id));
      console.log(`Filtered ${category} parts:`, skinToneParts.map(p => p.id));

      // If we have parts with this skin tone, use only those
      if (skinToneParts.length > 0) {
        categoryParts = skinToneParts;
      } else {
        console.log(`No ${category} parts found with skin tone ${randomSkinTone}, using all parts`);
      }
    }

    if (categoryParts.length) {
      const randomPart = categoryParts[Math.floor(Math.random() * categoryParts.length)];
      state.selectedParts[category] = randomPart.id;
      console.log(`Selected random ${category}: ${randomPart.id}`);
    } else {
      console.log(`No parts available for category ${category}`);
    }
  });

  // Random multiselect items (face, clothing, accessories, brust, handicap) (0 to 4 total)
  let multiSelectParts = state.availableParts.filter(part =>
    multiSelectCategories.includes(part.category)
  );

  // Apply body type filtering for clothes and accessories
  const currentBodyType = getCurrentBodyType();
  if (currentBodyType) {
    console.log(`Applying body type filtering for random selection: ${currentBodyType}`);

    multiSelectParts = multiSelectParts.filter(part => {
      // For clothes and accessories, apply body type filtering
      if (part.category === 'clothes' || part.category === 'accessoires') {
        // Include parts that match the body type OR parts that don't have any body type indicator (case-insensitive)
        const matchesBodyType = part.id.toLowerCase().includes(currentBodyType.toLowerCase()) ||
                               part.src.toLowerCase().includes(currentBodyType.toLowerCase());
        const hasNoBodyTypeIndicator = !['Breit', 'Eng', 'Normal'].some(type =>
          part.id.toLowerCase().includes(type.toLowerCase()) || part.src.toLowerCase().includes(type.toLowerCase())
        );

        const shouldInclude = matchesBodyType || hasNoBodyTypeIndicator;

        if (!shouldInclude) {
          console.log(`Excluding ${part.id} from random selection (doesn't match body type ${currentBodyType})`);
        }

        return shouldInclude;
      }

      // For other categories (face, handicap, values, strengths), don't filter by body type
      return true;
    });

    console.log(`After body type filtering: ${multiSelectParts.length} multiselect parts available`);
  }

  state.selectedItems = [];
  const numItems = Math.floor(Math.random() * 5); // 0 to 4 items

  const availableItems = [...multiSelectParts];
  for (let i = 0; i < numItems; i++) {
    if (availableItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      state.selectedItems.push(availableItems[randomIndex].id);
      availableItems.splice(randomIndex, 1);
    }
  }

  // Randomly decide on brustansatz
  state.currentBrustAnsatz = Math.random() < 0.5; // 50% chance
  if (state.currentBrustAnsatz) {
    const brustPart = state.availableParts.find(p => p.id === 'brust' && p.category === 'brust');
    if (brustPart) {
      state.selectedParts['brust'] = brustPart.id;
      console.log('Randomly selected brustansatz');
    }
  } else {
    state.selectedParts['brust'] = null;
    console.log('Randomly deselected brustansatz');
  }

  // Update UI to reflect the random selections
  updateHairColorUI();

  renderPartsGrid();
  renderValuesGrid();
  renderPropertiesGrid();
  await render(); // Await render here as well
}

// Download avatar
function downloadAvatar() {
  console.log('Attempting download...');
  const canvas = state.currentStep === 'body' ? avatarCanvas : valuesCanvas;
  const dataUrl = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = 'mein-futuromat-avatar.png';
  link.href = dataUrl;
  link.click();
  console.log('Download initiated.');
}

// Share avatar
async function shareAvatar() {
  console.log('Attempting share...');
  const canvas = state.currentStep === 'body' ? avatarCanvas : valuesCanvas;

  try {
    // Moved uploadCanvasImage outside to be accessible
    const imageUrl = await uploadCanvasImage(canvas, state.currentStep);
    console.log('Image uploaded successfully. URL:', imageUrl);
    showSharingModal(imageUrl, state.currentStep);
  } catch (error) {
    console.error("Error during share process:", error);
    fallbackShare();
  }

  function fallbackShare() {
    console.log('Using fallback share method.');
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'mein-futuromat-avatar.png';
    link.href = dataUrl;
    link.click();
  }
}

// Helper function to upload canvas image
async function uploadCanvasImage(canvas, stepType = 'avatar') {
  console.log(`Uploading canvas image for step: ${stepType}`);
  return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
          if (!blob) {
              console.error('Failed to create image blob from canvas.');
              reject(new Error('Failed to create image blob'));
              return;
          }

          const formData = new FormData();
          formData.append('image', blob, `futur-o-mat-${stepType}-${Date.now()}.png`);
          formData.append('step', stepType);

          try {
              console.log('Sending image to upload_image.php...');
              const response = await fetch('upload_image.php', {
                  method: 'POST',
                  body: formData
              });

              console.log('Response received from upload_image.php. Status:', response.status, 'OK:', response.ok);

              if (!response.ok) {
                  const errorText = await response.text();
                  console.error('Upload failed. Server response:', errorText);
                  throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
              }

              const result = await response.json();
              console.log('Upload successful. Server result:', result);
              if (result.imageUrl) {
                resolve(result.imageUrl);
              } else {
                console.error('Server response missing imageUrl:', result);
                reject(new Error('Server response missing imageUrl'));
              }
          } catch (error) {
              console.error('Error during image upload fetch:', error);
              reject(error);
          }
      }, 'image/png', 0.9);
  });
}
// Function to encode the current avatar state into a URL-safe string
function encodeAvatarState() {
  const avatarState = {
    selectedParts: state.selectedParts,
    selectedItems: state.selectedItems,
    currentSkinTone: state.currentSkinTone,
    currentHairColor: state.currentHairColor,
    currentBrustAnsatz: state.currentBrustAnsatz
  };
  // Use JSON.stringify and then btoa (Base64 encode) for URL safety
  return btoa(JSON.stringify(avatarState));
}

// Function to decode avatar state from a URL-safe string
function decodeAvatarState(encodedState) {
  try {
    // btoa (Base64 decode) and then JSON.parse
    const decoded = JSON.parse(atob(encodedState));
    // Validate and apply the decoded state
    if (decoded.selectedParts && decoded.selectedItems && decoded.currentSkinTone && decoded.currentHairColor !== undefined && decoded.currentBrustAnsatz !== undefined) {
      state.selectedParts = decoded.selectedParts;
      state.selectedItems = decoded.selectedItems;
      state.currentSkinTone = decoded.currentSkinTone;
      state.currentHairColor = decoded.currentHairColor;
      state.currentBrustAnsatz = decoded.currentBrustAnsatz;
      console.log('Avatar state decoded and applied from URL:', state);
      return true;
    }
  } catch (e) {
    console.error('Failed to decode or apply avatar state from URL:', e);
  }
  return false;
}

function showSharingModal(imageUrl, stepType = 'avatar') {
    const title = stepType === 'avatar' ? 
        'Schau dir meinen Futur-O-Mat Avatar an!' : 
        'Meine Werte und Eigenschaften im Futur-O-Mat!';
    
    const description = 'Erstellt mit dem Futur-O-Mat - Mach dir die Zukunft, wie sie dir gefällt!';
    
    // Construct the pageUrl with dynamic parameters for sharing
    const encodedAvatarState = encodeAvatarState();
    const sharePageUrl = `${window.location.origin}${window.location.pathname.replace('.html', '.php')}?share_image=${encodeURIComponent(imageUrl)}&share_title=${encodeURIComponent(title)}&share_description=${encodeURIComponent(description)}&avatar_state=${encodeURIComponent(encodedAvatarState)}`;

    // Create modal HTML
    const modalHTML = `
        <div id="shareModal" class="dialog-overlay active" style="display: flex;">
            <div class="dialog-content" style="max-width: 500px;">
                <div class="dialog-header">
                    <h2>Teilen</h2>
                    <button class="close-button" onclick="closeShareModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </button>
                </div>
                <div class="dialog-body">
                    <div class="share-preview" style="text-align: center; margin-bottom: 20px;">
                        <img src="${imageUrl}" alt="Generated Avatar" style="max-width: 150px; border-radius: var(--radius-md); box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <p style="margin: 10px 0; font-size: 14px; var(--brand-primary);">${title}</p>
                    </div>
                    <div id="shareButtons" class="share-buttons-container">
                        <!-- Share buttons will be loaded here -->
                    </div>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                        <button onclick="copyToClipboard('${sharePageUrl}', '${title}')"
                                style="width: 100%; padding: 10px; background: var(--brand-primary); color: white; border: none; border-radius: var(--radius-md); cursor: pointer;">
                                Link kopieren (für Signal & andere Apps)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('shareModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Load share buttons from PHP
    loadShareButtons(imageUrl, title, description, sharePageUrl);
}

// Function to load share buttons from PHP
async function loadShareButtons(imageUrl, title, description, pageUrl) { // pageUrl is now sharePageUrl
    try {
        const response = await fetch('get_share_buttons.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageUrl: imageUrl,
                title: title,
                description: description,
                pageUrl: pageUrl // Use the already constructed pageUrl
            })
        });

        if (response.ok) {
            const html = await response.text();
            document.getElementById('shareButtons').innerHTML = html;
        } else {
            throw new Error('Failed to load share buttons');
        }
    } catch (error) {
        console.error('Error loading share buttons:', error);
        document.getElementById('shareButtons').innerHTML = `
            <p style="color: #999; text-align: center;">
                Sharing-Buttons konnten nicht geladen werden.<br>
                Du kannst den Link aber kopieren und manuell teilen.
            </p>
        `;
    }
}

// Function to close sharing modal
function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.remove();
    }
}

// Function to copy to clipboard
function copyToClipboard(imageUrl, title) {
    const textToCopy = `${title} ${imageUrl}`;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Link wurde kopiert! Du kannst ihn jetzt in Signal oder andere Apps einfügen.');
        }).catch(err => {
            console.error('Clipboard copy failed:', err);
            fallbackCopyToClipboard(textToCopy);
        });
    } else {
        fallbackCopyToClipboard(textToCopy);
    }
}

// Fallback copy function for older browsers
function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        alert('Link wurde kopiert! Du kannst ihn jetzt in Signal oder andere Apps einfügen.');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Kopieren fehlgeschlagen. Bitte kopiere den Link manuell: ' + text);
    }
    
    document.body.removeChild(textarea);
}

// Main sharing function
async function handleShare(stepType = 'avatar') {
    try {
        // Show loading state
        const shareButton = stepType === 'avatar' ? 
            document.getElementById('shareButton') : 
            document.getElementById('shareButtonValues');
        
        const originalText = shareButton.innerHTML;
        shareButton.innerHTML = '<span>Bild wird hochgeladen...</span>';
        shareButton.disabled = true;

        // Get the appropriate canvas
        const canvas = stepType === 'avatar' ? 
            document.getElementById('avatarCanvas') : 
            document.getElementById('valuesCanvas');

        // Upload image and get URL
        const imageUrl = await uploadCanvasImage(canvas, stepType);

        // Show sharing modal
        showSharingModal(imageUrl, stepType);

        // Reset button
        shareButton.innerHTML = originalText;
        shareButton.disabled = false;

    } catch (error) {
        console.error('Sharing failed:', error);
        alert('Teilen fehlgeschlagen. Bitte versuche es erneut.');
        
        // Reset button
        const shareButton = stepType === 'avatar' ? 
            document.getElementById('shareButton') : 
            document.getElementById('shareButtonValues');
        shareButton.innerHTML = originalText;
        shareButton.disabled = false;
    }
}

// Render avatar on canvas (optimized)
async function renderAvatar(canvas, ctx) {
  console.log('Rendering avatar on canvas');

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Collect all parts to render first
  const partsToRender = [];

  // Draw body parts in logical order (back to front)
  const renderOrder = [
    'bodytype',
    'shoes',
    'clothes',
    'head',
    'face',
    'hair',
    'handicap',
    'brust',
    'accessoires',
    'values',
    'strengths'
  ];

  for (const category of renderOrder) {
    // For single select categories (head, bodytype, hair)
    if (singleSelectCategories.includes(category)) {
      const partId = state.selectedParts[category];
      if (partId) {
        const part = state.availableParts.find(p => p.id === partId);
        if (part) {
          partsToRender.push(part);
        }
      }
    }
    // For multiselect categories (face, clothing, accessories, brust, handicap)
    else if (multiSelectCategories.includes(category)) {
      const items = state.selectedItems
        .map(itemId => state.availableParts.find(p => p.id === itemId))
        .filter(item => item && item.category === category);

      partsToRender.push(...items);
    }
  }

  // Render all parts efficiently
  console.log(`Rendering ${partsToRender.length} parts`);
  for (const part of partsToRender) {
    await drawPart(ctx, part);
  }

  console.log('Avatar rendering complete');
}

// Image preloading and caching functions
async function preloadImage(src) {
  if (state.imageCache.has(src)) {
    return state.imageCache.get(src);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;

    img.onload = () => {
      state.imageCache.set(src, img);
      resolve(img);
    };

    img.onerror = () => {
      console.error(`Failed to preload image: ${src}`);
      reject(new Error(`Failed to load ${src}`));
    };
  });
}

// Preload all images for faster rendering
async function preloadAllImages() {
  console.log('Starting image preloading...');
  const loadingPromises = state.availableParts.map(part =>
    preloadImage(part.src).catch(error => {
      console.warn(`Failed to preload ${part.src}:`, error);
      return null; // Continue with other images
    })
  );

  try {
    await Promise.all(loadingPromises);
    console.log('All images preloaded successfully');
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
}

// Helper function to draw a single part (now uses cache)
async function drawPart(ctx, part) {
  let img = state.imageCache.get(part.src);

  if (!img) {
    // If not in cache, load it now (fallback)
    try {
      img = await preloadImage(part.src);
    } catch (error) {
      console.error(`Failed to load image: ${part.src}`);
      return;
    }
  }

  ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Show/hide loading indicator
function showLoadingIndicator() {
  const indicator = state.currentStep === 'body' ?
    document.getElementById('loadingIndicator') :
    document.getElementById('loadingIndicatorValues');

  if (indicator) {
    indicator.style.display = 'flex';
  }
}

function hideLoadingIndicator() {
  const indicators = ['loadingIndicator', 'loadingIndicatorValues'];
  indicators.forEach(id => {
    const indicator = document.getElementById(id);
    if (indicator) {
      indicator.style.display = 'none';
    }
  });
}

// Main render function with loading state
async function render() {
  if (state.isLoading) {
    return; // Prevent multiple simultaneous renders
  }

  state.isLoading = true;

  const activeCanvas = state.currentStep === 'body' ? avatarCanvas : valuesCanvas;
  const activeCtx = state.currentStep === 'body' ? avatarCtx : valuesCtx;

  if (!activeCanvas || !activeCtx) {
    console.error('Canvas or context not available!');
    state.isLoading = false;
    return;
  }

  // Show loading indicator
  showLoadingIndicator();

  try {
    // Render to the appropriate canvas
    await renderAvatar(activeCanvas, activeCtx);
  } catch (error) {
    console.error('Error during rendering:', error);
  } finally {
    // Hide loading indicator
    hideLoadingIndicator();
    state.isLoading = false;
  }
}

// Add this function to help debug the file naming patterns
function analyzePartNamingPatterns() {
  console.log('Analyzing part naming patterns...');
  
  // Group parts by category
  const categorizedParts = {};
  
  state.availableParts.forEach(part => {
    if (!categorizedParts[part.category]) {
      categorizedParts[part.category] = [];
    }
    categorizedParts[part.category].push(part);
  });
  
  // Analyze bodytype and head categories
  ['bodytype', 'head'].forEach(category => {
    if (!categorizedParts[category]) return;
    
    console.log(`\nAnalyzing ${category} parts:`);
    categorizedParts[category].forEach(part => {
      console.log(`ID: ${part.id}`);
      console.log(`Source: ${part.src}`);
      
      // Try to extract skin tone
      let skinTone = 'Unknown';
      if (part.id.includes('Hell') || part.src.includes('Hell')) skinTone = 'Hell';
      else if (part.id.includes('Braun') || part.src.includes('Braun')) skinTone = 'Braun';
      else if (part.id.includes('Dunkel') || part.src.includes('Dunkel')) skinTone = 'Dunkel';
      
      console.log(`Detected skin tone: ${skinTone}`);
      
      // Try to extract body type
      let bodyType = 'Unknown';
      const bodyTypePatterns = ['Breit', 'Eng', 'Normal', 'Oval', 'Rund', 'Eckig'];
      
      for (const pattern of bodyTypePatterns) {
        if (part.id.includes(pattern) || part.src.includes(pattern)) {
          bodyType = pattern;
          break;
        }
      }
      
      console.log(`Detected body type: ${bodyType}`);
      console.log('---');
    });
  });
}

