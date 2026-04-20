import * as THREE from "https://esm.sh/three@0.164.1";
import { PointerLockControls } from "https://esm.sh/three@0.164.1/examples/jsm/controls/PointerLockControls.js";
import { Inventory } from "./inventory.js?v=20260420-arrowhover";
import { RoomManager } from "./roomManager.js?v=20260420-arrowhover";
import { UI } from "./ui.js?v=20260420-arrowhover";

const PLAYER_RADIUS = 0.45;
const MOVE_SPEED = 4.2;
const INTERACT_DISTANCE = 5.5;

const canvas = document.getElementById("game-canvas");
const playButton = document.getElementById("play-button");
const restartButton = document.getElementById("restart-button");
const inventoryContainer = document.getElementById("inventory-items");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd8d0c4);
scene.fog = new THREE.Fog(0xd8d0c4, 10, 28);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-6, 1.6, 0);

const controls = new PointerLockControls(camera, document.body);
controls.pointerSpeed = 0.72;

const ui = new UI();
const inventory = new Inventory(inventoryContainer);
const roomManager = new RoomManager(scene, inventory, ui);
inventory.setChangeHandler((selectedItem) => {
  roomManager.setSelectedItem(selectedItem);
});

function closeCodeUI(shouldRelock = true) {
  ui.closeCodeEntry();
  clearPressedKeys();
  if (shouldRelock && gameStarted && !gameFlow.popupOpen) {
    controls.lock();
  }
}

function openCodeEntryUI(config) {
  controls.unlock();
  clearPressedKeys();
  ui.openCodeEntry(
    config,
    (value) => {
      const result = roomManager.submitCode(config.type, value);
      playSoundCue(result?.playSound);
      if (result?.success) {
        closeCodeUI(false);
        if (result.won) {
          completeRoom(roomManager.currentRoomData.id);
          return;
        }
        if (gameStarted && !gameFlow.popupOpen) {
          controls.lock();
        }
      }
    },
    () => {
      closeCodeUI(true);
    },
  );
}

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const direction = new THREE.Vector3();
const right = new THREE.Vector3();
let audioContext = null;
let recordMusicTimeouts = [];
let recordMusicSession = 0;

const pressed = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

function clearPressedKeys() {
  pressed.forward = false;
  pressed.backward = false;
  pressed.left = false;
  pressed.right = false;
}

let hoveredObject = null;
let gameStarted = false;
let isPaused = false;
const gameFlow = {
  currentRoomNumber: 1,
  currentRoomObject: null,
  inventory,
  roomTimers: {},
  roomCompletionStatus: {
    1: false,
    2: false,
    3: false,
    4: false,
  },
  popupOpen: false,
  onStartScreen: true,
  inGame: false,
};

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function makeEnvelopeGain(context, volume = 0.12) {
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.01);
  return gain;
}

function playPianoNote(note) {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const noteFrequencies = {
    red: 261.63,
    blue: 329.63,
    yellow: 392.0,
    green: 523.25,
  };

  const frequency = noteFrequencies[note] || 329.63;
  const osc = context.createOscillator();
  const osc2 = context.createOscillator();
  const gain = makeEnvelopeGain(context, 0.16);
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1800;

  osc.type = "triangle";
  osc.frequency.setValueAtTime(frequency, context.currentTime);
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(frequency * 2, context.currentTime);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.55);
  osc.start();
  osc2.start();
  osc.stop(context.currentTime + 0.48);
  osc2.stop(context.currentTime + 0.48);
}

function playDrawerClick() {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(640, context.currentTime);
  osc.frequency.exponentialRampToValueAtTime(180, context.currentTime + 0.05);
  gain.gain.setValueAtTime(0.26, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.11);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start();
  osc.stop(context.currentTime + 0.09);
}

function playUnlockChime() {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const frequencies = [523.25, 659.25, 783.99];
  frequencies.forEach((frequency, index) => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, context.currentTime + index * 0.06);
    gain.gain.setValueAtTime(0.0001, context.currentTime + index * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + index * 0.06 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + index * 0.06 + 0.22);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start(context.currentTime + index * 0.06);
    osc.stop(context.currentTime + index * 0.06 + 0.24);
  });
}

function playNoiseBurst(filterType, startFreq, endFreq, duration, volume) {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  const source = context.createBufferSource();
  source.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.setValueAtTime(startFreq, context.currentTime);
  filter.frequency.exponentialRampToValueAtTime(endFreq, context.currentTime + duration);
  const gain = context.createGain();
  gain.gain.setValueAtTime(volume, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start();
  source.stop(context.currentTime + duration);
}

function playDrumSound(drum) {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  if (drum === "kick") {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(110, context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(42, context.currentTime + 0.16);
    gain.gain.setValueAtTime(0.36, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + 0.18);
    return;
  }

  if (drum === "snare") {
    playNoiseBurst("highpass", 2200, 1200, 0.14, 0.34);
    return;
  }

  playNoiseBurst("bandpass", 460, 220, 0.22, 0.3);
}

function playDrumRhythmSequence(sequence) {
  const delays = [0, 240, 520, 860, 1120, 1380];
  sequence.forEach((drum, index) => {
    window.setTimeout(() => {
      playDrumSound(drum);
    }, delays[index] ?? index * 240);
  });
}

function playGuitarPluck(stringNumber) {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const stringFrequencies = {
    1: 329.63,
    2: 246.94,
    3: 196.0,
    4: 146.83,
  };

  const frequency = stringFrequencies[stringNumber] || 196.0;
  const osc = context.createOscillator();
  const osc2 = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(frequency, context.currentTime);
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(frequency * 2, context.currentTime);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2400, context.currentTime);
  filter.frequency.exponentialRampToValueAtTime(700, context.currentTime + 0.45);

  gain.gain.setValueAtTime(0.34, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.52);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  osc.start();
  osc2.start();
  osc.stop(context.currentTime + 0.44);
  osc2.stop(context.currentTime + 0.44);
}

function playCabinetButtonTone(colorName) {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const noteFrequencies = {
    blue: 392.0,
    red: 523.25,
    yellow: 659.25,
    green: 783.99,
  };

  const frequency = noteFrequencies[colorName] || 440;
  const osc = context.createOscillator();
  const osc2 = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(frequency, context.currentTime);
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(frequency * 0.5, context.currentTime);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2200, context.currentTime);
  filter.frequency.exponentialRampToValueAtTime(1200, context.currentTime + 0.18);

  gain.gain.setValueAtTime(0.24, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  osc.start();
  osc2.start();
  osc.stop(context.currentTime + 0.18);
  osc2.stop(context.currentTime + 0.18);
}

function clearRecordMusicLoop() {
  recordMusicSession += 1;
  for (const timeoutId of recordMusicTimeouts) {
    window.clearTimeout(timeoutId);
  }
  recordMusicTimeouts = [];
}

function playSoftSynthNote(frequency, duration = 0.34, volume = 0.11) {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const osc = context.createOscillator();
  const osc2 = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(frequency, context.currentTime);
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(frequency * 1.5, context.currentTime);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, context.currentTime);
  filter.frequency.exponentialRampToValueAtTime(900, context.currentTime + duration);
  gain.gain.setValueAtTime(volume, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  osc.start();
  osc2.start();
  osc.stop(context.currentTime + duration);
  osc2.stop(context.currentTime + duration);
}

function startRecordMusicLoop() {
  clearRecordMusicLoop();
  const session = recordMusicSession;
  const phrase = [
    { note: 392.0, delay: 0, duration: 0.24 },
    { note: 523.25, delay: 260, duration: 0.22 },
    { note: 587.33, delay: 520, duration: 0.22 },
    { note: 523.25, delay: 820, duration: 0.22 },
    { note: 392.0, delay: 1120, duration: 0.3 },
    { note: 440.0, delay: 1600, duration: 0.22 },
    { note: 493.88, delay: 1860, duration: 0.22 },
    { note: 523.25, delay: 2140, duration: 0.34 },
  ];
  const loopDuration = 3200;
  const totalDuration = 20000;

  const scheduleLoop = () => {
    if (session !== recordMusicSession) {
      return;
    }

    for (const step of phrase) {
      const timeoutId = window.setTimeout(() => {
        if (session !== recordMusicSession) {
          return;
        }
        playSoftSynthNote(step.note, step.duration, 0.11);
      }, step.delay);
      recordMusicTimeouts.push(timeoutId);
    }

    const loopId = window.setTimeout(() => {
      if (session !== recordMusicSession) {
        return;
      }
      scheduleLoop();
    }, loopDuration);
    recordMusicTimeouts.push(loopId);
  };

  scheduleLoop();

  const stopId = window.setTimeout(() => {
    if (session !== recordMusicSession) {
      return;
    }
    clearRecordMusicLoop();
  }, totalDuration);
  recordMusicTimeouts.push(stopId);
}

function playSoundCue(cue) {
  if (!cue) {
    return;
  }

  if (cue.type === "piano") {
    playPianoNote(cue.note);
    return;
  }

  if (cue.type === "drawerClick") {
    playDrawerClick();
    return;
  }

  if (cue.type === "unlock") {
    playUnlockChime();
    return;
  }

  if (cue.type === "drum") {
    playDrumSound(cue.drum);
    return;
  }

  if (cue.type === "rhythmSequence") {
    playDrumRhythmSequence(cue.sequence || []);
    return;
  }

  if (cue.type === "guitar") {
    playGuitarPluck(cue.stringNumber);
    return;
  }

  if (cue.type === "cabinetButton") {
    playCabinetButtonTone(cue.colorName);
    return;
  }

  if (cue.type === "recordMusic") {
    startRecordMusicLoop();
    return;
  }

  if (cue.type === "bounceWall") {
    const context = getAudioContext();
    if (!context) {
      return;
    }

    const osc = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(220, context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, context.currentTime + 0.12);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, context.currentTime);
    gain.gain.setValueAtTime(0.24, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + 0.16);
  }
}

// Basic lights keep the room bright and friendly for younger players.
const ambientLight = new THREE.AmbientLight(0xf4ede0, 0.74);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffdcb8, 0.26);
sunLight.position.set(6, 7, -3);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(1024, 1024);
scene.add(sunLight);

const lampGlow = new THREE.PointLight(0xffddb2, 28, 13, 2);
lampGlow.position.set(0, 3.78, 0);
lampGlow.castShadow = true;
lampGlow.shadow.mapSize.set(1024, 1024);
scene.add(lampGlow);

const cornerLamp = new THREE.PointLight(0xffc892, 2.6, 9);
cornerLamp.position.set(-7, 2.5, 1.5);
scene.add(cornerLamp);

function clearCurrentRoomState() {
  clearRecordMusicLoop();
  hoveredObject = null;
  roomManager.setHoveredObject(null);
  roomManager.clearCurrentRoomState();
  inventory.clear();
  clearPressedKeys();
  ui.hideFlowPopup();
  ui.hideEnd();
  ui.closeCodeEntry();
  ui.showPauseTip(false);
  ui.setLookLabel("");
  ui.setCrosshairActive(false);
}

function movePlayerTo(position) {
  camera.position.copy(position);
  camera.rotation.set(0, roomManager.getSpawnYaw(), 0);
}

function resumeGameplayAfterPopup() {
  gameFlow.popupOpen = false;
  ui.hideFlowPopup();
  if (gameStarted) {
    controls.lock();
  }
}

function loadRoom(roomNumber) {
  clearRecordMusicLoop();
  const spawn = roomManager.loadRoom(roomNumber, true);
  movePlayerTo(spawn);
  gameFlow.currentRoomNumber = roomNumber;
  gameFlow.currentRoomObject = roomManager.currentRoomData;
  gameFlow.roomTimers[roomNumber] = roomManager.getRemainingTime();
  clearPressedKeys();
  ui.setGameUiVisible(true);
  if (gameStarted) {
    controls.lock();
  }
}

function returnToStartScreen() {
  clearRecordMusicLoop();
  gameFlow.popupOpen = false;
  gameFlow.onStartScreen = true;
  gameFlow.inGame = false;
  gameStarted = false;
  isPaused = false;
  clearCurrentRoomState();
  for (const roomNumber of Object.keys(gameFlow.roomCompletionStatus)) {
    gameFlow.roomCompletionStatus[roomNumber] = false;
  }
  gameFlow.roomTimers = {};
  gameFlow.currentRoomNumber = 1;
  gameFlow.currentRoomObject = null;
  if (controls.isLocked) {
    controls.unlock();
  }
  ui.setGameUiVisible(false);
  ui.showStart(true);
}

function returnToRootHomePage() {
  returnToStartScreen();
  window.location.href = "../index.html";
}

function restartGame() {
  clearRecordMusicLoop();
  gameFlow.popupOpen = false;
  gameFlow.onStartScreen = false;
  gameFlow.inGame = true;
  gameStarted = true;
  isPaused = false;
  for (const roomNumber of Object.keys(gameFlow.roomCompletionStatus)) {
    gameFlow.roomCompletionStatus[roomNumber] = false;
  }
  const spawn = roomManager.restartGame();
  movePlayerTo(spawn);
  gameFlow.currentRoomNumber = 1;
  gameFlow.currentRoomObject = roomManager.currentRoomData;
  gameFlow.roomTimers = { 1: roomManager.getRemainingTime() };
  ui.hideFlowPopup();
  ui.hideEnd();
  ui.showStart(false);
  ui.setGameUiVisible(true);
  clearPressedKeys();
  try {
    controls.lock();
  } catch (error) {
    console.warn("Pointer lock did not start yet. Click the game screen to continue.", error);
  }
}

function showSecondChoicePopup() {
  ui.showFlowPopup(
    {
      title: "Do you wish to",
      text: "",
      primaryLabel: "Go back to the start",
      secondaryLabel: "Finish here",
    },
    () => {
      restartGame();
    },
    () => {
      returnToRootHomePage();
    },
  );
}

function showContinuePopup(roomNumber) {
  ui.showFlowPopup(
    {
      title: "Do you wish to continue",
      text: "",
      primaryLabel: "Yes",
      secondaryLabel: "No",
    },
    () => {
      resumeGameplayAfterPopup();
      loadRoom(roomNumber + 1);
    },
    () => {
      showSecondChoicePopup();
    },
  );
}

function showFinalRoomPopup() {
  ui.showFlowPopup(
    {
      title: "Amazing! You finished in time!",
      text: "Do you wish to play again?",
      primaryLabel: "Yes",
      secondaryLabel: "No",
      celebration: true,
    },
    () => {
      restartGame();
    },
    () => {
      returnToStartScreen();
    },
  );
}

function completeRoom(roomNumber) {
  gameFlow.roomCompletionStatus[roomNumber] = true;
  gameFlow.roomTimers[roomNumber] = roomManager.getRemainingTime();
  gameFlow.popupOpen = true;
  clearPressedKeys();
  if (controls.isLocked) {
    controls.unlock();
  }
  ui.showPauseTip(false);
  if (roomNumber === 4) {
    showFinalRoomPopup();
    return;
  }
  showContinuePopup(roomNumber);
}

function startGame() {
  restartGame();
}

function setMovementKey(event, isDown) {
  const code = event.code;
  const key = event.key;
  if (code === "KeyW" || code === "ArrowUp" || key === "w" || key === "W" || key === "ArrowUp") {
    pressed.forward = isDown;
  }
  if (code === "KeyS" || code === "ArrowDown" || key === "s" || key === "S" || key === "ArrowDown") {
    pressed.backward = isDown;
  }
  if (code === "KeyA" || code === "ArrowLeft" || key === "a" || key === "A" || key === "ArrowLeft") {
    pressed.left = isDown;
  }
  if (code === "KeyD" || code === "ArrowRight" || key === "d" || key === "D" || key === "ArrowRight") {
    pressed.right = isDown;
  }
}

function handleInventoryShortcut(event) {
  const match = event.code.match(/^Digit([1-9])$/);
  if (!match) {
    return false;
  }

  const index = Number(match[1]) - 1;
  const selectedItem = inventory.selectByIndex(index);
  const itemAtIndex = inventory.getItems()[index];

  if (!itemAtIndex) {
    return false;
  }

  if (selectedItem) {
    ui.showMessage(`${selectedItem.label} selected.`);
  } else {
    ui.showMessage(`${itemAtIndex.label} unselected.`);
  }

  return true;
}

function intersectsSolid(x, z) {
  const bounds = roomManager.getRoomBounds();
  if (x < bounds.minX || x > bounds.maxX || z < bounds.minZ || z > bounds.maxZ) {
    return true;
  }

  const solids = roomManager.getSolidBoxes();
  for (const box of solids) {
    if (
      x > box.min.x - PLAYER_RADIUS &&
      x < box.max.x + PLAYER_RADIUS &&
      z > box.min.z - PLAYER_RADIUS &&
      z < box.max.z + PLAYER_RADIUS
    ) {
      return true;
    }
  }

  return false;
}

function updateMovement(delta) {
  if (!controls.isLocked || !gameStarted || isPaused || gameFlow.popupOpen) {
    return;
  }

  const move = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const left = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;

  if (forward.lengthSq() === 0) {
    return;
  }

  forward.normalize();
  // Build the sideways direction from the current forward direction.
  // This keeps left/right consistent with what the player sees on screen.
  left.set(forward.z, 0, -forward.x).normalize();

  if (pressed.forward) move.addScaledVector(forward, MOVE_SPEED * delta);
  if (pressed.backward) move.addScaledVector(forward, -MOVE_SPEED * delta);
  if (pressed.left) move.addScaledVector(left, MOVE_SPEED * delta);
  if (pressed.right) move.addScaledVector(left, -MOVE_SPEED * delta);

  if (move.lengthSq() === 0) {
    return;
  }

  const nextX = camera.position.x + move.x;
  const nextZ = camera.position.z + move.z;

  if (!intersectsSolid(nextX, camera.position.z)) {
    camera.position.x = nextX;
  }

  if (!intersectsSolid(camera.position.x, nextZ)) {
    camera.position.z = nextZ;
  }
}

function updateHoverState() {
  hoveredObject = null;
  ui.setCrosshairActive(false);
  roomManager.setHoveredObject(null);
  ui.setLookLabel("");
  canvas.style.cursor = "default";

  if (!gameStarted || gameFlow.popupOpen || ui.isFlowPopupOpen()) {
    return;
  }

  raycaster.setFromCamera({ x: 0, y: 0 }, camera);
  const hits = raycaster.intersectObjects(roomManager.getInteractiveObjects(), false);
  const hit = hits.find((entry) => entry.distance <= INTERACT_DISTANCE);
  if (!hit) {
    return;
  }

  hoveredObject = hit.object;
  roomManager.setHoveredObject(hoveredObject);
  ui.setCrosshairActive(true);
  ui.setLookLabel(roomManager.getHoverLabel(hoveredObject));

  if (!controls.isLocked) {
    canvas.style.cursor = "pointer";
  }
}

function interact() {
  if (!controls.isLocked || !hoveredObject || gameFlow.popupOpen || ui.isFlowPopupOpen()) {
    return;
  }

  const result = roomManager.handleInteraction(hoveredObject, inventory.getSelectedItem());
  playSoundCue(result.playSound);
  if (result.spawn) {
    movePlayerTo(result.spawn);
  }

  if (result.openCodeEntry) {
    openCodeEntryUI(result.openCodeEntry);
    return;
  }

  if (result.won) {
    completeRoom(roomManager.currentRoomData.id);
  }
}

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);

  if (gameStarted && !isPaused && !gameFlow.popupOpen) {
    updateMovement(delta);
    const updateResult = roomManager.update(delta);
    gameFlow.roomTimers[gameFlow.currentRoomNumber] = roomManager.getRemainingTime();
    if (updateResult?.spawn) {
      if (ui.isCodeEntryOpen()) {
        closeCodeUI(false);
      }
      movePlayerTo(updateResult.spawn);
      controls.lock();
    }
  }

  updateHoverState();
  renderer.render(scene, camera);
}

playButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

document.addEventListener("keydown", (event) => {
  if (gameFlow.popupOpen && event.code !== "Escape") {
    return;
  }

  if (event.code === "Escape" && gameStarted && !ui.isCodeEntryOpen() && !gameFlow.popupOpen) {
    if (controls.isLocked) {
      event.preventDefault();
      controls.unlock();
      return;
    }

    if (!controls.isLocked && isPaused) {
      event.preventDefault();
      controls.lock();
      return;
    }
  }

  if (gameFlow.popupOpen || ui.isFlowPopupOpen()) {
    return;
  }

  if (handleInventoryShortcut(event)) {
    return;
  }

  if (event.code.startsWith("Arrow")) {
    event.preventDefault();
  }

  setMovementKey(event, true);
  if (event.code === "Space") {
    event.preventDefault();
    interact();
  }
});

document.addEventListener("keyup", (event) => {
  setMovementKey(event, false);
});

document.addEventListener("mousedown", (event) => {
  if (!gameStarted) {
    return;
  }

  if (event.target.closest("#pause-tip")) {
    if (!controls.isLocked) {
      controls.lock();
    }
    return;
  }

  if (
    event.target.closest("#inventory-panel") ||
    event.target.closest("#start-screen") ||
    event.target.closest("#code-screen") ||
    event.target.closest("#flow-screen") ||
    event.target.closest("#end-screen")
  ) {
    return;
  }

  if (gameFlow.popupOpen || ui.isFlowPopupOpen()) {
    return;
  }

  if (!controls.isLocked) {
    controls.lock();
    return;
  }

  interact();
});

controls.addEventListener("lock", () => {
  isPaused = false;
  clearPressedKeys();
  ui.showPauseTip(false);
});

controls.addEventListener("unlock", () => {
  clearPressedKeys();
  if (
    gameStarted &&
    !gameFlow.popupOpen &&
    document.getElementById("end-screen").classList.contains("hidden") &&
    !ui.isCodeEntryOpen()
  ) {
    isPaused = true;
    ui.showPauseTip(true);
  }
});

window.addEventListener("blur", () => {
  clearPressedKeys();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearPressedKeys();
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

ui.showPauseTip(false);
ui.setGameUiVisible(false);
animate();
