import p5 from "p5";
import {
  initSettings,
  setColsChangeCallback,
  setShuffleCallback,
  setImageUploadCallback,
  setClearCallback,
  getCurrentCols,
} from "./settings.js";
import { saveSnapshot, pulse } from "./utils.js";

// Import all images using url: prefix to get string URLs from Parcel
import img01 from "url:../assets/image-array/abstract-01.jpg";
import img02 from "url:../assets/image-array/abstract-02.jpg";
import img03 from "url:../assets/image-array/abstract-03.jpg";
import img04 from "url:../assets/image-array/abstract-04.jpg";
import img05 from "url:../assets/image-array/abstract-05.jpg";
import img06 from "url:../assets/image-array/abstract-06.jpg";
import img07 from "url:../assets/image-array/abstract-07.jpg";
import img08 from "url:../assets/image-array/abstract-08.jpg";
import img09 from "url:../assets/image-array/abstract-09.jpg";
import img10 from "url:../assets/image-array/abstract-10.jpg";
import img11 from "url:../assets/image-array/abstract-11.jpg";
import img12 from "url:../assets/image-array/abstract-12.jpg";

new p5((sk) => {
  let draggedHandle = null;
  let hoveredHandle = null;
  let imageArray = [];
  let gridVertices = [];
  let defaultDensity;

  let cols = getCurrentCols();
  let rows = 0; // Will be set after images load
  let showHandles = true;
  const handleSize = 24;

  // Store image paths
  const imagePaths = [
    img01,
    img02,
    img03,
    img04,
    img05,
    img06,
    img07,
    img08,
    img09,
    img10,
    img11,
    img12,
  ];

  sk.preload = () => {
    // Load all images - now these should be URL strings
    console.log("Image paths:", imagePaths);
    console.log("First path type:", typeof imagePaths[0], imagePaths[0]);
    imagePaths.forEach((path) => {
      imageArray.push(sk.loadImage(path));
    });
  };

  const shuffleImages = () => {
    // Fisher-Yates shuffle algorithm
    for (let i = imageArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [imageArray[i], imageArray[j]] = [imageArray[j], imageArray[i]];
    }
  };

  const addUploadedImage = (imgDataUrl) => {
    const img = sk.loadImage(imgDataUrl, () => {
      rows = Math.ceil(imageArray.length / cols);
      setupGrid();
    });
    imageArray.push(img);
  };

  const clearAllImages = () => {
    imageArray = [];
    rows = 0;
    setupGrid();
  };

  const setupGrid = () => {
    const stepX = sk.width / cols;
    const stepY = sk.height / rows;
    const offsetX = sk.width / 2;
    const offsetY = sk.height / 2;

    gridVertices = [];
    for (let col = 0; col <= cols; col++) {
      gridVertices[col] = [];
      for (let row = 0; row <= rows; row++) {
        gridVertices[col][row] = {
          x: col * stepX - offsetX,
          y: row * stepY - offsetY,
        };
      }
    }
  };

  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);
    defaultDensity = sk.displayDensity();
    rows = Math.ceil(imageArray.length / cols);
    initSettings();

    setColsChangeCallback((newCols) => {
      cols = newCols;
      rows = Math.ceil(imageArray.length / cols);
      setupGrid();
    });

    setShuffleCallback(() => {
      shuffleImages();
    });

    setImageUploadCallback((img) => {
      addUploadedImage(img);
    });

    setClearCallback(() => {
      clearAllImages();
    });

    setupGrid();
  };

  sk.draw = () => {
    sk.background(36);

    // Draw textured quads with images
    sk.noStroke();
    let imageIndex = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (imageIndex < imageArray.length) {
          sk.tint(255);
          sk.texture(imageArray[imageIndex]);
          const topLeft = gridVertices[col][row];
          const topRight = gridVertices[col + 1][row];
          const bottomRight = gridVertices[col + 1][row + 1];
          const bottomLeft = gridVertices[col][row + 1];
          sk.quad(
            topLeft.x,
            topLeft.y,
            topRight.x,
            topRight.y,
            bottomRight.x,
            bottomRight.y,
            bottomLeft.x,
            bottomLeft.y
          );
        }
        imageIndex++;
      }
    }

    // Draw handles only if showHandles is true
    if (showHandles) {
      sk.fill(0);
      const pulseValue = pulse(sk, 12, 18, 2);
      for (let col = 1; col < cols; col++) {
        for (let row = 1; row < rows; row++) {
          const vertex = gridVertices[col][row];
          sk.ellipse(vertex.x, vertex.y, pulseValue, pulseValue);
        }
      }
    }

    // Update hovered handle (only when handles are visible)
    hoveredHandle = null;
    if (showHandles) {
      const mouseX = sk.mouseX - sk.width / 2;
      const mouseY = sk.mouseY - sk.height / 2;
      for (let col = 1; col < cols; col++) {
        for (let row = 1; row < rows; row++) {
          const vertex = gridVertices[col][row];
          if (sk.dist(mouseX, mouseY, vertex.x, vertex.y) < handleSize) {
            hoveredHandle = { col, row };
            break;
          }
        }
        if (hoveredHandle) break;
      }
    }

    // Update cursor
    if (draggedHandle) {
      document.body.style.cursor = "grabbing";
    } else if (hoveredHandle) {
      document.body.style.cursor = "grab";
    } else {
      document.body.style.cursor = "default";
    }
  };

  sk.mousePressed = () => {
    if (hoveredHandle) {
      draggedHandle = { col: hoveredHandle.col, row: hoveredHandle.row };
    }
  };

  sk.mouseDragged = () => {
    if (draggedHandle) {
      const deltaX = sk.mouseX - sk.pmouseX;
      const deltaY = sk.mouseY - sk.pmouseY;
      gridVertices[draggedHandle.col][draggedHandle.row].x += deltaX;
      gridVertices[draggedHandle.col][draggedHandle.row].y += deltaY;
    }
  };

  sk.mouseReleased = () => {
    draggedHandle = null;
  };

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
    setupGrid();
  };

  sk.keyPressed = () => {
    if (sk.key === "h" || sk.key === "H") {
      showHandles = !showHandles;
    }
    if (sk.key === "s" || sk.key === "S") {
      saveSnapshot(sk, defaultDensity, 2);
    }
  };
});
