// ---- SAVE P5 CANVAS SNAPSHOT AS PNG
// -----------------------------------
let countSaved = 1;
function saveSnapshot(sk, defaultDensity, densityFactor = 2) {
  const currentDensity = sk.pixelDensity();
  sk.pixelDensity(defaultDensity * densityFactor);
  sk.redraw();
  sk.saveCanvas(`sketch_${countSaved}`, "png");
  countSaved++;
  sk.pixelDensity(currentDensity);
  sk.redraw();
}

// ---- SINOIDAL PULSE
// -------------------
function pulse(sk, min, max, time) {
  const mid = (min + max) / 2;
  const amplitude = (max - min) / 2;
  const period = time * 1000; // Convert time from seconds to milliseconds
  const currentTime = sk.millis();
  return (
    amplitude * sk.sin((currentTime % period) * (sk.TWO_PI / period)) + mid
  );
}

export { saveSnapshot, pulse };
