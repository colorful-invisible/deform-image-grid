// State
let currentCols = 4;
let onColsChange = null;
let onShuffle = null;
let onImageUpload = null;
let onClear = null;
let panel = null;
let colsInput = null;
let shuffleButton = null;
let clearButton = null;
let imageUploadInput = null;
let isOpen = false;

// Initialize and set up listeners
export function initSettings() {
  setupEventListeners();
}

function setupEventListeners() {
  panel = document.getElementById("settings-panel");
  colsInput = document.getElementById("cols-input");
  shuffleButton = document.getElementById("shuffle-button");
  clearButton = document.getElementById("clear-button");
  imageUploadInput = document.getElementById("image-upload-input");

  const trigger = document.getElementById("settings-trigger");

  // Panel toggle
  trigger.addEventListener("click", togglePanel);

  // Columns input
  if (colsInput) {
    colsInput.addEventListener("input", handleColsChange);
    colsInput.value = currentCols;
    updateColsDisplay();
  }

  // Shuffle button
  if (shuffleButton) {
    shuffleButton.addEventListener("click", handleShuffle);
  }

  // Clear button
  if (clearButton) {
    clearButton.addEventListener("click", handleClear);
  }

  // Image upload input
  if (imageUploadInput) {
    imageUploadInput.addEventListener("change", handleImageUpload);
  }

  // Close panel when clicking outside
  document.addEventListener("click", (e) => {
    if (isOpen && !panel.contains(e.target) && !trigger.contains(e.target)) {
      closePanel();
    }
  });
}

function togglePanel() {
  if (isOpen) {
    closePanel();
  } else {
    openPanel();
  }
}

function openPanel() {
  panel.classList.add("open");
  document.body.classList.add("has-open-panel");
  isOpen = true;
}

function closePanel() {
  panel.classList.remove("open");
  document.body.classList.remove("has-open-panel");
  isOpen = false;
}

function handleColsChange(e) {
  const newCols = parseInt(e.target.value);
  setCurrentCols(newCols);
}

function handleShuffle() {
  if (onShuffle) {
    onShuffle();
  }
}

function handleClear() {
  if (onClear) {
    onClear();
  }
}

function handleImageUpload(e) {
  const files = Array.from(e.target.files);
  if (files.length > 0) {
    const repeatInput = document.getElementById("repeat-input");
    const repeatCount = repeatInput ? parseInt(repeatInput.value) : 1;

    // Process each file
    files.forEach((file) => {
      // Add each image the specified number of times
      for (let i = 0; i < repeatCount; i++) {
        loadImageFromFile(file);
      }
    });

    // Reset the file input so the same file can be selected again
    e.target.value = "";
  }
}

function setCurrentCols(cols) {
  currentCols = cols;
  updateColsDisplay();

  // Notify the main application
  if (onColsChange) {
    onColsChange(currentCols);
  }
}

async function loadImageFromFile(file) {
  if (!file.type.includes("image")) {
    alert("Please select a valid image file (JPG, PNG, etc.).");
    return;
  }

  // Create a data URL from the file
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      // Notify the main application with the loaded image
      if (onImageUpload) {
        onImageUpload(event.target.result);
      }
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function updateColsDisplay() {
  if (colsInput) {
    colsInput.value = currentCols;
  }
}

// Public method to set columns change callback
export function setColsChangeCallback(callback) {
  onColsChange = callback;
}

// Public method to set shuffle callback
export function setShuffleCallback(callback) {
  onShuffle = callback;
}

// Public method to set image upload callback
export function setImageUploadCallback(callback) {
  onImageUpload = callback;
}

// Public method to set clear callback
export function setClearCallback(callback) {
  onClear = callback;
}

// Public method to get current columns
export function getCurrentCols() {
  return currentCols;
}

// Public method to set columns programmatically
export function setCols(cols) {
  currentCols = cols;
  updateColsDisplay();
  if (onColsChange) {
    onColsChange(currentCols);
  }
}
