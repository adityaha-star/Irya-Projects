import * as THREE from "https://esm.sh/three@0.164.1";
import { ITEM_INFO, ROOM_INFO } from "./puzzles.js?v=20260419-hiddenpanellarge";

const ROOM_WIDTH = 24;
const ROOM_DEPTH = 18;
const HALF_WIDTH = ROOM_WIDTH / 2;
const HALF_DEPTH = ROOM_DEPTH / 2;
const PLAYER_HEIGHT = 1.6;
const FRUIT_ORDER = ["apple", "banana", "pear"];
const BREAD_BOX_CLUE_WORDS = ["APPLE", "OVEN"];
const PIANO_COLOR_ORDER = ["red", "blue", "yellow", "green"];
const DRUM_RHYTHM_ORDER = ["snare", "snare", "kick", "floorTom", "floorTom", "floorTom"];
const GUITAR_STRING_ORDER = [2, 4, 1];

export class RoomManager {
  constructor(scene, inventory, ui) {
    this.scene = scene;
    this.inventory = inventory;
    this.ui = ui;
    this.roomGroup = new THREE.Group();
    this.scene.add(this.roomGroup);

    this.interactiveObjects = [];
    this.solidBoxes = [];
    this.currentRoomIndex = 0;
    this.currentRoomData = ROOM_INFO[this.currentRoomIndex];
    this.remainingTime = this.currentRoomData.timeLimit;
    this.selectedItem = null;
    this.hoverOutline = null;
    this.hoveredObject = null;
    this.state = this.createInitialState();
    this.clueWordsFound = new Set();

    this.resetRefs();
  }

  createInitialState() {
    return {
      livingDrawerOpened: false,
      hammerTaken: false,
      frameBroken: false,
      livingKeyTaken: false,
      uvTorchTaken: false,
      uvClueShownOnce: false,
      cupboardUnlocked: false,
      livingKnifeTaken: false,
      boxOpened: false,
      room1DoorUnlocked: false,
      cabinetHandleTaken: false,
      upperCabinetOpened: false,
      batteryTaken: false,
      scalePowered: false,
      scaleSolved: false,
      fruitSequence: [],
      placedFruitItems: [],
      drawerUnlocked: false,
      spoonTaken: false,
      jarKeyTaken: false,
      pantryUnlocked: false,
      recipeSeen: false,
      breadBoxHintReady: false,
      breadBoxUnlocked: false,
      knifeTaken: false,
      flourBagOpened: false,
      finalTilesShown: false,
      doorUnlocked: false,
      pianoSequence: [],
      musicDrawerUnlocked: false,
      musicDrawerOpened: false,
      headphonesTaken: false,
      audioCableTaken: false,
      mixingConsolePowered: false,
      rhythmClueHeard: false,
      drumSequence: [],
      guitarCaseUnlocked: false,
      guitarCaseOpened: false,
      guitarPickTaken: false,
      noteCardTaken: false,
      guitarStringSequence: [],
      recordPlayerOpened: false,
      vinylRecordTaken: false,
      vinylRecordPlaced: false,
      wallButtonSequence: [],
      finalCabinetUnlocked: false,
      beatTilesShown: false,
      finalCabinetOpened: false,
      room4DrawerOpened: false,
      room4BallSequence: [],
      room4BallPlacedItems: [],
      room4LockerUnlocked: false,
      room4LockerOpened: false,
      badmintonRacketTaken: false,
      shuttlecockTaken: false,
      room4TargetSequence: [],
      room4CodeRevealed: false,
      room4SportsRackUnlocked: false,
      room4SportsRackOpened: false,
      tennisRacketTaken: false,
      tennisBallTaken: false,
      room4BounceSequenceStep: 0,
      room4LastBounceAt: 0,
      room4ToyChestOpened: false,
      room4WordSequence: [],
      room4PlacedBlocks: [],
      room4HiddenPanelOpened: false,
      room4UvTorchTaken: false,
      room4ArrowsShownOnce: false,
      room4ArrowPanelSequence: [],
      room4FinalCabinetUnlocked: false,
      room4FinalCabinetOpened: false,
      room4GameTilesShown: false,
      roomComplete: false,
    };
  }

  resetRefs() {
    this.collectibleGroups = new Map();
    this.livingDrawerBody = null;
    this.livingDrawerFront = null;
    this.livingDrawerHitbox = null;
    this.frameBack = null;
    this.frameGlass = null;
    this.frameHitbox = null;
    this.cupboardBody = null;
    this.cupboardDoor = null;
    this.cupboardHitbox = null;
    this.smallBoxBody = null;
    this.smallBoxLid = null;
    this.smallBoxHitbox = null;
    this.uvClue = null;
    this.lockClue = null;
    this.upperCabinetBody = null;
    this.upperCabinetLeftDoor = null;
    this.upperCabinetRightDoor = null;
    this.upperCabinetBrokenHandle = null;
    this.upperCabinetAttachedHandle = null;
    this.scaleBody = null;
    this.scalePlate = null;
    this.scaleScreen = null;
    this.scaleHitbox = null;
    this.scaleDisplayText = null;
    this.scaleFruitMarkers = [];
    this.drawerBody = null;
    this.drawerFront = null;
    this.jarGlass = null;
    this.jarLid = null;
    this.jarKeyVisual = null;
    this.pantryBody = null;
    this.pantryDoor = null;
    this.recipeCard = null;
    this.breadBoxBody = null;
    this.breadBoxLid = null;
    this.breadBoxHitbox = null;
    this.flourBag = null;
    this.spoonMesh = null;
    this.knifeMesh = null;
    this.finalTileMeshes = [];
    this.exitDoor = null;
    this.exitPanel = null;
    this.musicDrawerBody = null;
    this.musicDrawerFront = null;
    this.room4DrawerBody = null;
    this.room4DrawerFront = null;
    this.room4DrawerHitbox = null;
    this.room4DrawerClue = [];
    this.room4ColorBoard = null;
    this.room4ColorBoardHitbox = null;
    this.room4ColorBoardMarkers = [];
    this.room4LockerBody = null;
    this.room4LockerLeftDoor = null;
    this.room4LockerRightDoor = null;
    this.room4LockerHitbox = null;
    this.room4Targets = [];
    this.room4CodeCard = null;
    this.room4Scoreboard = null;
    this.room4ScoreboardHitbox = null;
    this.room4SportsRackBody = null;
    this.room4SportsRackDoor = null;
    this.room4SportsRackHitbox = null;
    this.room4BounceWall = null;
    this.room4BounceWallHitbox = null;
    this.room4ToyChestBody = null;
    this.room4ToyChestLid = null;
    this.room4ToyChestHitbox = null;
    this.room4PlayBlockMeshes = [];
    this.room4ShapeSlots = [];
    this.room4ShapeSlotDefs = [];
    this.room4PlacedLetterMeshes = [];
    this.room4HiddenPanel = null;
    this.room4HiddenPanelFrame = null;
    this.room4HiddenPanelLabel = null;
    this.room4ArrowClues = [];
    this.room4ArrowPanels = [];
    this.room4FinalCabinetBody = null;
    this.room4FinalCabinetLeftDoor = null;
    this.room4FinalCabinetRightDoor = null;
    this.room4FinalCabinetHitbox = null;
    this.room4GameTileMeshes = [];
    this.musicPianoKeys = [];
    this.mixingConsoleDesk = null;
    this.mixingConsoleTop = null;
    this.mixingConsoleMeter = null;
    this.guitarCase = null;
    this.guitarCaseLid = null;
    this.guitarCaseHitbox = null;
    this.recordPlayerBase = null;
    this.recordPlayerLid = null;
    this.recordPlayerHitbox = null;
    this.recordPlayerRecordVisual = null;
    this.finalCabinetBody = null;
    this.finalCabinetDoor = null;
    this.wallButtons = [];
    this.beatTileMeshes = [];
    this.musicLightBeams = [];
    this.musicLightPatternIndex = 0;
    this.musicLightPatternTimer = 0;
  }

  startGame(startRoomIndex = 0) {
    this.currentRoomIndex = startRoomIndex;
    return this.enterRoom(true);
  }

  enterRoom(clearInventory = false) {
    this.currentRoomData = ROOM_INFO[this.currentRoomIndex];
    this.remainingTime = this.currentRoomData.timeLimit;

    if (clearInventory) {
      this.inventory.clear();
    }

    this.selectedItem = null;
    // Rebuilding the room from this one starting state resets every puzzle cleanly.
    this.state = this.createInitialState();
    this.clueWordsFound = new Set();
    this.resetRefs();
    this.clearHoverOutline();
    this.ui.setRoomLabel(this.currentRoomData.name);
    this.ui.setTimer(this.getRemainingTime());
    this.ui.showObjective(`${this.currentRoomData.name}\n${this.currentRoomData.objective}`, 4200);
    this.buildRoom();
    this.updateRoomClues();
    return this.getSpawnPoint();
  }

  enterRoomByIndex(roomIndex, clearInventory = false) {
    this.currentRoomIndex = roomIndex;
    return this.enterRoom(clearInventory);
  }

  restartRoom() {
    return this.enterRoom(true);
  }

  restartGame() {
    this.currentRoomIndex = 0;
    return this.enterRoom(true);
  }

  loadRoom(roomNumber, clearInventory = true) {
    return this.enterRoomByIndex(roomNumber - 1, clearInventory);
  }

  clearCurrentRoomState() {
    this.clearHoverOutline();
    this.clearRoom();
    this.resetRefs();
    this.selectedItem = null;
    this.state = this.createInitialState();
    this.clueWordsFound = new Set();
    this.remainingTime = 0;
    this.ui.setTimer(0);
  }

  getSpawnPoint() {
    if (this.currentRoomData.id === 1) {
      return new THREE.Vector3(-HALF_WIDTH + 2.2, PLAYER_HEIGHT, 4.2);
    }

    if (this.currentRoomData.id === 3) {
      return new THREE.Vector3(-1.2, PLAYER_HEIGHT, 4.0);
    }

    if (this.currentRoomData.id === 4) {
      return new THREE.Vector3(-10.0, PLAYER_HEIGHT, 4.5);
    }

    return new THREE.Vector3(-HALF_WIDTH + 2.6, PLAYER_HEIGHT, 3.8);
  }

  getSpawnYaw() {
    if (this.currentRoomData.id === 1) {
      return -0.38;
    }

    if (this.currentRoomData.id === 3) {
      return -0.22;
    }

    if (this.currentRoomData.id === 4) {
      return -0.4;
    }

    return -0.2;
  }

  getInteractiveObjects() {
    return this.interactiveObjects;
  }

  getSolidBoxes() {
    return this.solidBoxes;
  }

  getRoomBounds() {
    if (this.currentRoomData.id === 3) {
      return {
        minX: -HALF_WIDTH + 2.45,
        maxX: HALF_WIDTH - 2.45,
        minZ: -HALF_DEPTH + 1.95,
        maxZ: HALF_DEPTH - 2.1,
      };
    }

    if (this.currentRoomData.id === 4) {
      return {
        minX: -HALF_WIDTH + 1.35,
        maxX: HALF_WIDTH - 1.15,
        minZ: -HALF_DEPTH + 1.25,
        maxZ: HALF_DEPTH - 1.15,
      };
    }

    return {
      minX: -HALF_WIDTH + 0.8,
      maxX: HALF_WIDTH - 0.8,
      minZ: -HALF_DEPTH + 0.8,
      maxZ: HALF_DEPTH - 0.8,
    };
  }

  getRemainingTime() {
    return Math.max(0, Math.ceil(this.remainingTime));
  }

  update(deltaSeconds = 0) {
    if (this.state.roomComplete) {
      return null;
    }

    if (this.currentRoomData.id === 3 && this.state.vinylRecordPlaced && this.musicLightBeams.length > 0) {
      const pattern = [0x6b9ef3, 0xe46a73, 0x6b9ef3, 0x71d77b];
      this.musicLightPatternTimer += deltaSeconds;
      if (this.musicLightPatternTimer >= 0.45) {
        this.musicLightPatternTimer = 0;
        this.musicLightPatternIndex = (this.musicLightPatternIndex + 1) % pattern.length;
      }

      const activeColor = pattern[this.musicLightPatternIndex];
      for (const beam of this.musicLightBeams) {
        beam.material.color.setHex(activeColor);
        if (beam.material.emissive) {
          beam.material.emissive.setHex(activeColor);
          beam.material.emissiveIntensity = 1.7;
        }
      }
    }

    if (this.currentRoomData.timeLimit > 0) {
      this.remainingTime -= deltaSeconds;
    }

    this.ui.setTimer(this.getRemainingTime());

    if (this.currentRoomData.timeLimit > 0 && this.remainingTime <= 0) {
      this.ui.showMessage("Time's up!", 2200);
      return { type: "restart", spawn: this.restartRoom() };
    }

    return null;
  }

  setSelectedItem(selectedItem) {
    this.selectedItem = selectedItem;
    this.updateRoomClues();
  }

  updateRoomClues() {
    if (this.uvClue) {
      const shouldShow = this.currentRoomData.id === 1 && this.selectedItem?.id === "uvTorch";
      this.uvClue.visible = shouldShow;

      if (shouldShow && !this.state.uvClueShownOnce) {
        this.state.uvClueShownOnce = true;
        this.ui.showMessage("The torch reveals glowing letters: TRUE.", 2600);
      }
    }

    if (this.lockClue) {
      this.lockClue.visible = this.currentRoomData.id === 1 && this.state.boxOpened;
    }

    if (this.room4ArrowClues.length > 0) {
      const shouldShow = this.currentRoomData.id === 4 && this.selectedItem?.id === "room4UvTorch";
      for (const arrow of this.room4ArrowClues) {
        arrow.visible = shouldShow;
      }

      if (shouldShow && !this.state.room4ArrowsShownOnce) {
        this.state.room4ArrowsShownOnce = true;
        this.ui.showMessage("There are arrows on the walls.", 2600);
      }
    }
  }

  getHoverLabel(object) {
    if (!object) {
      return "";
    }

    if (object.userData.kind === "mixingConsole") {
      return this.state.mixingConsolePowered ? "Powered Console" : "Mixing Console";
    }

    return object.userData.label || "";
  }

  setHoveredObject(object) {
    if (this.hoveredObject === object) {
      return;
    }

    this.hoveredObject = object;
    this.clearHoverOutline();

    if (!object) {
      return;
    }

    const highlightObjects = this.getHighlightObjects(object).filter(Boolean);
    if (highlightObjects.length === 0) {
      return;
    }

    const bounds = new THREE.Box3();
    for (const highlightObject of highlightObjects) {
      bounds.expandByObject(highlightObject);
    }

    if (bounds.isEmpty()) {
      return;
    }

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bounds.getSize(size);
    bounds.getCenter(center);

    const outlineGeometry = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(size.x + 0.08, size.y + 0.08, size.z + 0.08),
    );
    const outlineMaterial = new THREE.LineBasicMaterial({
      color: 0xffd447,
      depthTest: false,
      transparent: true,
      opacity: 0.95,
    });

    this.hoverOutline = new THREE.LineSegments(outlineGeometry, outlineMaterial);
    this.hoverOutline.position.copy(center);
    this.hoverOutline.renderOrder = 10;
    this.roomGroup.add(this.hoverOutline);
  }

  clearHoverOutline() {
    if (!this.hoverOutline) {
      return;
    }

    this.roomGroup.remove(this.hoverOutline);
    this.hoverOutline.geometry.dispose();
    this.hoverOutline.material.dispose();
    this.hoverOutline = null;
  }

  clearRoom() {
    this.interactiveObjects = [];
    this.solidBoxes = [];

    while (this.roomGroup.children.length > 0) {
      const child = this.roomGroup.children[0];
      this.roomGroup.remove(child);
      child.traverse((node) => {
        if (node.geometry) {
          node.geometry.dispose();
        }
        if (node.material) {
          if (Array.isArray(node.material)) {
            for (const material of node.material) {
              material.dispose();
            }
          } else {
            node.material.dispose();
          }
        }
      });
    }
  }

  buildRoom() {
    this.clearRoom();
    if (this.currentRoomData.id === 1) {
      this.buildLivingRoom();
      return;
    }

    if (this.currentRoomData.id === 4) {
      this.buildPlayRoom();
      return;
    }

    if (this.currentRoomData.id === 3) {
      this.buildMusicRoom();
      return;
    }

    this.buildKitchen();
  }

  buildKitchen() {
    this.addRoomShell();
    this.addCeilingFixture();
    this.addWindow();
    this.addCounters();
    this.addFridge();
    this.addUpperCabinet();
    this.addScale();
    this.addKitchenTable();
    this.addLooseCabinetHandle();
    this.addFruitItems();
    this.addDrawerBank();
    this.addJarArea();
    this.addPantryCupboard();
    this.addClueNotes();
    this.addBreadBox();
    this.addFlourBag();
    this.addExitDoor();
  }

  buildLivingRoom() {
    this.addLivingRoomShell();
    this.addLivingRoomWindow();
    this.addLivingRoomLights();
    this.addSofaArea();
    this.addTvArea();
    this.addLivingDrawer();
    this.addPictureFramePuzzle();
    this.addLivingCupboard();
    this.addSmallBox();
    this.addRoom1Door();
    this.addUvClue();
  }

  buildMusicRoom() {
    this.addMusicRoomShell();
    this.addMusicWindowNook();
    this.addMusicRoomBoundaryFeatures();
    this.addMusicRoomLights();
    this.addMusicWallDecor();
    this.addPianoArea();
    this.addSheetMusicStand();
    this.addSpeakerStack();
    this.addMixingConsole();
    this.addDrumSet();
    this.addGuitarArea();
    this.addAmpAndBench();
    this.addRecordPlayerStation();
    this.addRecordShelf();
    this.addMusicDrawer();
    this.addMusicFinalCabinet();
    this.addCozySeating();
    this.addMusicStorage();
    this.addMusicExitDoor();
  }

  buildPlayRoom() {
    this.addPlayRoomShell();
    this.addPlayRoomLights();
    this.addPlayRoomWindow();
    this.addPlayRoomDecor();
    this.addEntranceDrawerArea();
    this.addBallPitZone();
    this.addRoom4ClueBalls();
    this.addRoom4ColorBoard();
    this.addToyShelfZone();
    this.addLockerZone();
    this.addBadmintonZone();
    this.addBadmintonTargetArea();
    this.addRoom4Scoreboard();
    this.addSportsRackZone();
    this.addBounceWallZone();
    this.addToyChestZone();
    this.addShapePuzzleWall();
    this.addHiddenWallPanel();
    this.addRoom4ArrowPanels();
    this.addPlayFinalCabinet();
    this.addPlayExitDoor();
  }

  addPlayRoomShell() {
    const floor = this.makeTexturedBox([ROOM_WIDTH, 0.35, ROOM_DEPTH], "wood", {
      color: 0xffffff,
      roughness: 0.78,
      metalness: 0.04,
    });
    floor.position.y = -0.18;
    this.roomGroup.add(floor);

    const rugColors = [0xff8b6b, 0x6cb8ff, 0xffd85d, 0x77d980];
    for (let index = 0; index < 4; index += 1) {
      const mat = this.makeTexturedBox([3.8, 0.04, 3.1], "rug", {
        color: rugColors[index],
        roughness: 0.94,
        metalness: 0.01,
      });
      mat.position.set(-6.2 + index * 4.15, 0.02, 0.3 + (index % 2 === 0 ? 0.25 : -0.2));
      mat.rotation.y = index % 2 === 0 ? 0.04 : -0.05;
      this.roomGroup.add(mat);
    }

    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_WIDTH, 0.35, ROOM_DEPTH),
      new THREE.MeshStandardMaterial({ color: 0xfffbf2, roughness: 0.96, metalness: 0.01 }),
    );
    ceiling.position.y = 5.2;
    this.roomGroup.add(ceiling);

    const wallDefs = [
      { size: [0.35, 5, ROOM_DEPTH], pos: [-HALF_WIDTH, 2.5, 0], color: 0xfff0cc },
      { size: [0.35, 5, ROOM_DEPTH], pos: [HALF_WIDTH, 2.5, 0], color: 0xfff3d5 },
      { size: [ROOM_WIDTH, 5, 0.35], pos: [0, 2.5, -HALF_DEPTH], color: 0xe6f3ff },
      { size: [ROOM_WIDTH, 5, 0.35], pos: [0, 2.5, HALF_DEPTH], color: 0xfff4e5 },
    ];

    for (const wall of wallDefs) {
      const mesh = this.makeTexturedBox(wall.size, "wall", {
        color: wall.color,
        roughness: 0.97,
        metalness: 0.01,
      });
      mesh.position.set(...wall.pos);
      this.roomGroup.add(mesh);
    }

    const rainbowBand = [
      { x: -8.6, color: 0xff7f66 },
      { x: -4.3, color: 0xffca61 },
      { x: 0, color: 0x79d67b },
      { x: 4.3, color: 0x69b7ff },
      { x: 8.6, color: 0xc58cf1 },
    ];
    for (const stripe of rainbowBand) {
      const band = this.makeBox([4.3, 0.22, 0.16], stripe.color);
      band.position.set(stripe.x, 4.28, HALF_DEPTH - 0.18);
      this.roomGroup.add(band);
    }

    const cloudDefs = [
      [-7.4, 4.08, -1.6],
      [-1.8, 4.18, 2.5],
      [4.6, 4.1, -2.6],
    ];
    for (const cloudDef of cloudDefs) {
      const puffLeft = this.makeBox([0.82, 0.36, 0.38], 0xffffff);
      puffLeft.position.set(cloudDef[0] - 0.35, cloudDef[1], cloudDef[2]);
      this.roomGroup.add(puffLeft);

      const puffCenter = this.makeBox([1.0, 0.44, 0.42], 0xffffff);
      puffCenter.position.set(cloudDef[0], cloudDef[1] + 0.06, cloudDef[2]);
      this.roomGroup.add(puffCenter);

      const puffRight = this.makeBox([0.82, 0.36, 0.38], 0xffffff);
      puffRight.position.set(cloudDef[0] + 0.35, cloudDef[1], cloudDef[2]);
      this.roomGroup.add(puffRight);
    }
  }

  addPlayRoomLights() {
    const ceilingShade = this.makeGlossyBox([1.6, 0.18, 1.6], 0xfff2c4, 140);
    ceilingShade.position.set(0, 4.3, 0);
    this.roomGroup.add(ceilingShade);

    const bulb = this.makeGlossyBox([0.24, 0.24, 0.24], 0xffedb4, 180);
    bulb.position.set(0, 4.0, 0);
    this.roomGroup.add(bulb);

    const centerGlow = new THREE.PointLight(0xffd78b, 18, 18, 2);
    centerGlow.position.set(0, 3.85, 0);
    this.roomGroup.add(centerGlow);

    const cornerGlow = new THREE.PointLight(0x88d8ff, 9, 12, 2);
    cornerGlow.position.set(-9.2, 2.8, -4.8);
    this.roomGroup.add(cornerGlow);

    const playGlow = new THREE.PointLight(0xff98be, 8, 11, 2);
    playGlow.position.set(8.2, 2.9, 3.4);
    this.roomGroup.add(playGlow);

    const floorLampPole = this.makeBox([0.08, 2.0, 0.08], 0x8b8f9a);
    floorLampPole.material = new THREE.MeshStandardMaterial({ color: 0x8b8f9a, roughness: 0.32, metalness: 0.8 });
    floorLampPole.position.set(9.6, 1.08, 5.8);
    this.roomGroup.add(floorLampPole);

    const floorLampShade = this.makeTexturedBox([0.74, 0.32, 0.74], "fabric", {
      color: 0xffd3a8,
      roughness: 0.95,
      metalness: 0.01,
    });
    floorLampShade.position.set(9.6, 2.4, 5.8);
    this.roomGroup.add(floorLampShade);

    const floorLampBase = this.makeBox([0.5, 0.06, 0.5], 0x8b8f9a);
    floorLampBase.position.set(9.6, 0.03, 5.8);
    this.roomGroup.add(floorLampBase);
  }

  addPlayRoomWindow() {
    const frame = this.makeBox([0.26, 2.8, 4.6], 0xf8f2e8);
    frame.position.set(-HALF_WIDTH + 0.22, 2.55, -2.5);
    this.roomGroup.add(frame);

    const glow = this.makeGlossyBox([0.06, 2.36, 3.9], 0xd9f0ff, 160);
    glow.position.set(-HALF_WIDTH + 0.34, 2.55, -2.5);
    glow.material.transparent = true;
    glow.material.opacity = 0.78;
    this.roomGroup.add(glow);

    const mullionH = this.makeBox([0.05, 0.06, 3.6], 0xf8f2e8);
    mullionH.position.set(-HALF_WIDTH + 0.38, 2.55, -2.5);
    this.roomGroup.add(mullionH);

    const mullionV = this.makeBox([0.05, 2.3, 0.06], 0xf8f2e8);
    mullionV.position.set(-HALF_WIDTH + 0.38, 2.55, -2.5);
    this.roomGroup.add(mullionV);

    const curtainLeft = this.makeTexturedBox([0.16, 2.54, 0.98], "fabric", {
      color: 0xff8cac,
      roughness: 0.96,
      metalness: 0.01,
    });
    curtainLeft.position.set(-HALF_WIDTH + 0.48, 2.48, -3.92);
    this.roomGroup.add(curtainLeft);

    const curtainRight = this.makeTexturedBox([0.16, 2.54, 0.98], "fabric", {
      color: 0x76c6ff,
      roughness: 0.96,
      metalness: 0.01,
    });
    curtainRight.position.set(-HALF_WIDTH + 0.48, 2.48, -1.08);
    this.roomGroup.add(curtainRight);
  }

  addPlayRoomDecor() {
    for (let index = 0; index < 5; index += 1) {
      const banner = this.makeWordNote("★", ["#ff8b6b", "#6fb0ff", "#ffd55a", "#7fdd83", "#c48ef6"][index], [-7.6 + index * 3.8, 3.72, HALF_DEPTH - 0.24], Math.PI);
      banner.scale.set(0.38, 0.5, 1);
      this.roomGroup.add(banner);
    }

    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 6; column += 1) {
        const foam = this.makeBox([0.46, 0.46, 0.08], row === 0 ? 0x90b5f7 : 0xffcf7a);
        foam.position.set(4.4 + column * 0.52, 2.0 + row * 0.56, HALF_DEPTH - 0.18);
        this.roomGroup.add(foam);
      }
    }

    const plantPotA = this.makeBox([0.52, 0.44, 0.52], 0xc48f67);
    plantPotA.position.set(-9.4, 0.22, 1.6);
    this.roomGroup.add(plantPotA);
    for (let index = 0; index < 3; index += 1) {
      const leaf = this.makeBox([0.18, 0.9, 0.18], 0x72bf67);
      leaf.position.set(-9.48 + index * 0.12, 0.86, 1.56 + (index % 2) * 0.08);
      leaf.rotation.z = -0.28 + index * 0.22;
      this.roomGroup.add(leaf);
    }

    const plantPotB = this.makeBox([0.48, 0.38, 0.48], 0xb77f59);
    plantPotB.position.set(9.2, 0.19, -5.0);
    this.roomGroup.add(plantPotB);
    for (let index = 0; index < 4; index += 1) {
      const leaf = this.makeBox([0.14, 0.82, 0.14], 0x7bcb74);
      leaf.position.set(9.14 + (index - 1.5) * 0.09, 0.82, -5.0 + (index % 2) * 0.06);
      leaf.rotation.z = -0.35 + index * 0.18;
      this.roomGroup.add(leaf);
    }

    const sideTable = this.makeTexturedBox([0.92, 0.56, 0.78], "wood", {
      color: 0xffffff,
      roughness: 0.76,
      metalness: 0.05,
    });
    sideTable.position.set(7.9, 0.29, 5.5);
    sideTable.userData = { kind: "hint", label: "Side Table", hint: "A little side table is full of play room bits and pieces." };
    this.roomGroup.add(sideTable);
    this.addSolid(sideTable, 1.2, 1.0, 0.56);
    this.interactiveObjects.push(sideTable);

    const mug = this.makeBox([0.14, 0.16, 0.14], 0xf9fdff);
    mug.position.set(7.72, 0.62, 5.38);
    this.roomGroup.add(mug);

    const notebook = this.makeTexturedBox([0.34, 0.03, 0.24], "wall", {
      color: 0xfef5dd,
      roughness: 0.86,
      metalness: 0.01,
    });
    notebook.position.set(8.06, 0.59, 5.58);
    this.roomGroup.add(notebook);
  }

  addEntranceDrawerArea() {
    const bench = this.makeTexturedBox([2.1, 0.7, 1.0], "wood", {
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.05,
    });
    bench.position.set(-8.8, 0.35, 5.9);
    bench.userData = { kind: "hint", label: "Entrance Bench", hint: "A bench sits by the entrance with a little drawer underneath." };
    this.roomGroup.add(bench);
    this.addSolid(bench, 2.4, 1.35, 0.7);
    this.interactiveObjects.push(bench);

    const cushionA = this.makeBox([0.8, 0.18, 0.72], 0xffc65d);
    cushionA.position.set(-9.28, 0.74, 5.92);
    this.roomGroup.add(cushionA);

    const cushionB = this.makeBox([0.8, 0.18, 0.72], 0x7ec7ff);
    cushionB.position.set(-8.32, 0.74, 5.92);
    this.roomGroup.add(cushionB);

    this.room4DrawerBody = this.makeBox([1.34, 0.36, 0.74], 0xf6b07e);
    this.room4DrawerBody.position.set(-8.8, 0.25, 5.74);
    this.room4DrawerBody.userData = { kind: "room4Drawer", label: "Small Drawer" };
    this.roomGroup.add(this.room4DrawerBody);
    this.interactiveObjects.push(this.room4DrawerBody);

    this.room4DrawerFront = this.makeBox([1.24, 0.28, 0.08], 0xff9676);
    this.room4DrawerFront.position.set(-8.8, 0.34, 5.44);
    this.room4DrawerFront.userData = { kind: "room4Drawer", label: "Small Drawer" };
    this.roomGroup.add(this.room4DrawerFront);
    this.interactiveObjects.push(this.room4DrawerFront);

    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xe8d59d, roughness: 0.24, metalness: 0.85 }),
    );
    knob.position.set(-8.8, 0.34, 5.38);
    knob.userData = { kind: "room4Drawer", label: "Small Drawer" };
    this.roomGroup.add(knob);
    this.interactiveObjects.push(knob);

    this.room4DrawerHitbox = this.makeBox([1.7, 0.9, 1.0], 0xffffff);
    this.room4DrawerHitbox.position.set(-8.8, 0.38, 5.74);
    this.room4DrawerHitbox.material.transparent = true;
    this.room4DrawerHitbox.material.opacity = 0;
    this.room4DrawerHitbox.userData = { kind: "room4Drawer", label: "Small Drawer" };
    this.roomGroup.add(this.room4DrawerHitbox);
    this.interactiveObjects.push(this.room4DrawerHitbox);

    const clueColors = [0x71b8ff, 0xff6f6f, 0xffd85e, 0x79da7d];
    const clueY = [0.96, 0.8, 0.64, 0.48];
    for (let index = 0; index < clueColors.length; index += 1) {
      const clueDot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 0.04, 20),
        new THREE.MeshStandardMaterial({ color: clueColors[index], roughness: 0.38, metalness: 0.04 }),
      );
      clueDot.position.set(-8.8, clueY[index], 5.1);
      clueDot.rotation.x = Math.PI / 2;
      clueDot.visible = false;
      clueDot.userData = { kind: "room4DrawerClue", label: "Color Clue" };
      this.roomGroup.add(clueDot);
      this.room4DrawerClue.push(clueDot);
    }
  }

  addBallPitZone() {
    const pitHint = { kind: "hint", label: "Ball Pit", hint: "A big ball pit looks bouncy and fun." };

    const floorPad = this.makeBox([4.7, 0.18, 4.3], 0x79c8ff);
    floorPad.position.set(-7.4, 0.09, -4.0);
    floorPad.userData = pitHint;
    this.roomGroup.add(floorPad);
    this.interactiveObjects.push(floorPad);
    this.addSolid(floorPad, 4.95, 4.45, 0.75);

    const leftWall = this.makeBox([0.36, 1.1, 4.28], 0x67b7f4);
    leftWall.position.set(-9.56, 0.55, -4.0);
    leftWall.userData = pitHint;
    this.roomGroup.add(leftWall);
    this.interactiveObjects.push(leftWall);

    const rightWall = this.makeBox([0.36, 1.1, 4.28], 0x67b7f4);
    rightWall.position.set(-5.24, 0.55, -4.0);
    rightWall.userData = pitHint;
    this.roomGroup.add(rightWall);
    this.interactiveObjects.push(rightWall);

    const backWall = this.makeBox([4.28, 1.1, 0.36], 0x67b7f4);
    backWall.position.set(-7.4, 0.55, -6.14);
    backWall.userData = pitHint;
    this.roomGroup.add(backWall);
    this.interactiveObjects.push(backWall);

    const frontWall = this.makeBox([4.28, 0.82, 0.36], 0x67b7f4);
    frontWall.position.set(-7.4, 0.41, -1.86);
    frontWall.userData = pitHint;
    this.roomGroup.add(frontWall);
    this.interactiveObjects.push(frontWall);

    const innerPad = this.makeBox([3.96, 0.08, 3.56], 0x9ddaff);
    innerPad.position.set(-7.4, 0.04, -4.0);
    this.roomGroup.add(innerPad);

    const rimColor = 0xffd77a;
    const leftRim = this.makeBox([0.18, 0.1, 4.16], rimColor);
    leftRim.position.set(-9.38, 1.02, -4.0);
    this.roomGroup.add(leftRim);

    const rightRim = this.makeBox([0.18, 0.1, 4.16], rimColor);
    rightRim.position.set(-5.42, 1.02, -4.0);
    this.roomGroup.add(rightRim);

    const backRim = this.makeBox([4.16, 0.1, 0.18], rimColor);
    backRim.position.set(-7.4, 1.02, -5.96);
    this.roomGroup.add(backRim);

    const frontRim = this.makeBox([4.16, 0.1, 0.18], rimColor);
    frontRim.position.set(-7.4, 0.75, -2.04);
    this.roomGroup.add(frontRim);

    const ballColors = [0xff6f6f, 0xffd15e, 0x75d579, 0x67b2ff, 0xd48af4, 0xff8fc0];
    const ballGeometry = new THREE.SphereGeometry(0.18, 10, 10);
    const ballMaterials = ballColors.map(
      (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.48, metalness: 0.02 }),
    );
    const totalBalls = 336;
    const minX = -9.02;
    const maxX = -5.78;
    const minZ = -5.44;
    const maxZ = -2.66;

    for (let index = 0; index < totalBalls; index += 1) {
      const ball = new THREE.Mesh(ballGeometry, ballMaterials[index % ballMaterials.length]);
      const seedA = Math.sin(index * 12.9898) * 43758.5453;
      const seedB = Math.sin((index + 31) * 78.233) * 24634.6345;
      const seedC = Math.sin((index + 79) * 45.164) * 15843.1739;
      const randA = seedA - Math.floor(seedA);
      const randB = seedB - Math.floor(seedB);
      const randC = seedC - Math.floor(seedC);

      const x = minX + randA * (maxX - minX);
      const z = minZ + randC * (maxZ - minZ);
      const centerFalloffX = 1 - Math.min(1, Math.abs(x + 7.4) / 1.75);
      const centerFalloffZ = 1 - Math.min(1, Math.abs(z + 4.0) / 1.45);
      const surfaceLift = Math.max(0, centerFalloffX * centerFalloffZ) * 0.22;
      ball.position.set(
        x,
        0.2 + randB * 0.18 + surfaceLift,
        z,
      );
      ball.rotation.set(randA * Math.PI, randB * Math.PI, randC * Math.PI);
      this.roomGroup.add(ball);
    }

    const slideHint = { kind: "hint", label: "Mini Slide", hint: "A mini slide drops right into the ball pit." };

    const platform = this.makeBox([0.96, 0.14, 0.98], 0x6fc0ff);
    platform.position.set(-4.48, 1.56, -4.1);
    platform.userData = slideHint;
    this.roomGroup.add(platform);
    this.interactiveObjects.push(platform);

    const platformRailFront = this.makeBox([0.08, 0.56, 1.0], 0xffc16e);
    platformRailFront.position.set(-4.04, 1.82, -4.1);
    platformRailFront.userData = slideHint;
    this.roomGroup.add(platformRailFront);
    this.interactiveObjects.push(platformRailFront);

    const platformRailLeft = this.makeBox([0.74, 0.34, 0.08], 0xffc16e);
    platformRailLeft.position.set(-4.48, 1.74, -4.54);
    platformRailLeft.userData = slideHint;
    this.roomGroup.add(platformRailLeft);
    this.interactiveObjects.push(platformRailLeft);

    const platformRailRight = this.makeBox([0.74, 0.34, 0.08], 0xffc16e);
    platformRailRight.position.set(-4.48, 1.74, -3.66);
    platformRailRight.userData = slideHint;
    this.roomGroup.add(platformRailRight);
    this.interactiveObjects.push(platformRailRight);

    const slideBed = this.makeBox([2.0, 0.12, 0.72], 0xff8d66);
    slideBed.position.set(-5.62, 1.02, -4.1);
    slideBed.rotation.z = 0.44;
    slideBed.userData = slideHint;
    this.roomGroup.add(slideBed);
    this.interactiveObjects.push(slideBed);

    const slideSideLeft = this.makeBox([1.92, 0.22, 0.08], 0xffc16e);
    slideSideLeft.position.set(-5.64, 1.12, -4.42);
    slideSideLeft.rotation.z = 0.44;
    slideSideLeft.userData = slideHint;
    this.roomGroup.add(slideSideLeft);
    this.interactiveObjects.push(slideSideLeft);

    const slideSideRight = this.makeBox([1.92, 0.22, 0.08], 0xffc16e);
    slideSideRight.position.set(-5.64, 1.12, -3.78);
    slideSideRight.rotation.z = 0.44;
    slideSideRight.userData = slideHint;
    this.roomGroup.add(slideSideRight);
    this.interactiveObjects.push(slideSideRight);

    const slideLip = this.makeBox([0.38, 0.08, 0.82], 0xffd17b);
    slideLip.position.set(-6.66, 0.56, -4.1);
    slideLip.userData = slideHint;
    this.roomGroup.add(slideLip);
    this.interactiveObjects.push(slideLip);

    const stairLeft = this.makeBox([0.08, 1.62, 0.08], 0xffc16e);
    stairLeft.position.set(-3.98, 0.81, -4.38);
    this.roomGroup.add(stairLeft);

    const stairRight = this.makeBox([0.08, 1.62, 0.08], 0xffc16e);
    stairRight.position.set(-3.98, 0.81, -3.82);
    this.roomGroup.add(stairRight);

    const stairBackLeft = this.makeBox([0.08, 1.62, 0.08], 0xffc16e);
    stairBackLeft.position.set(-4.62, 0.81, -4.38);
    this.roomGroup.add(stairBackLeft);

    const stairBackRight = this.makeBox([0.08, 1.62, 0.08], 0xffc16e);
    stairBackRight.position.set(-4.62, 0.81, -3.82);
    this.roomGroup.add(stairBackRight);

    for (let index = 0; index < 5; index += 1) {
      const step = this.makeBox([0.56, 0.06, 0.46], 0xf7f0db);
      step.position.set(-4.3, 0.26 + index * 0.31, -4.1);
      this.roomGroup.add(step);
    }
  }

  addRoom4ClueBalls() {
    const clueDefs = [
      { itemId: "blueBall", color: 0x71b8ff, label: "B", position: [-8.52, 0.72, -3.08] },
      { itemId: "redBall", color: 0xff6f6f, label: "R", position: [-7.74, 0.76, -2.72] },
      { itemId: "yellowBall", color: 0xffd85e, label: "Y", position: [-6.92, 0.72, -3.22] },
      { itemId: "greenBall", color: 0x79da7d, label: "G", position: [-6.24, 0.75, -2.84] },
    ];

    for (const clueDef of clueDefs) {
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 14, 14),
        new THREE.MeshStandardMaterial({ color: clueDef.color, roughness: 0.46, metalness: 0.02 }),
      );
      ball.position.set(...clueDef.position);
      ball.userData = { kind: "collectItem", itemId: clueDef.itemId };
      this.roomGroup.add(ball);

      const letter = this.makeWordNote(clueDef.label, "#ffffff", [clueDef.position[0], clueDef.position[1] + 0.02, clueDef.position[2] + 0.02], 0);
      letter.scale.set(0.14, 0.16, 1);
      letter.userData = { kind: "collectItem", itemId: clueDef.itemId };
      this.roomGroup.add(letter);

      const hitbox = this.makeBox([0.68, 0.62, 0.68], 0xffffff);
      hitbox.position.set(clueDef.position[0], clueDef.position[1], clueDef.position[2]);
      hitbox.material.transparent = true;
      hitbox.material.opacity = 0;
      hitbox.userData = { kind: "collectItem", itemId: clueDef.itemId };
      this.roomGroup.add(hitbox);

      this.registerCollectible(clueDef.itemId, [ball, letter, hitbox]);
    }
  }

  addRoom4ColorBoard() {
    const hint = { kind: "room4ColorBoard", label: "Color Board" };

    this.room4ColorBoard = this.makeBox([2.3, 1.18, 0.14], 0xf6f8fd);
    this.room4ColorBoard.position.set(-1.4, 1.2, -1.86);
    this.room4ColorBoard.userData = hint;
    this.roomGroup.add(this.room4ColorBoard);
    this.interactiveObjects.push(this.room4ColorBoard);

    const frame = this.makeBox([2.48, 1.34, 0.1], 0x7b8ca6);
    frame.position.set(-1.4, 1.2, -1.98);
    this.roomGroup.add(frame);

    const slotColors = [0x71b8ff, 0xff6f6f, 0xffd85e, 0x79da7d];
    for (let index = 0; index < slotColors.length; index += 1) {
      const slot = this.makeBox([0.38, 0.38, 0.08], slotColors[index]);
      slot.position.set(-2.16 + index * 0.5, 1.2, -1.72);
      this.roomGroup.add(slot);
    }

    this.room4ColorBoardHitbox = this.makeBox([2.7, 1.5, 0.7], 0xffffff);
    this.room4ColorBoardHitbox.position.set(-1.4, 1.2, -1.8);
    this.room4ColorBoardHitbox.material.transparent = true;
    this.room4ColorBoardHitbox.material.opacity = 0;
    this.room4ColorBoardHitbox.userData = hint;
    this.roomGroup.add(this.room4ColorBoardHitbox);
    this.interactiveObjects.push(this.room4ColorBoardHitbox);
  }

  clearRoom4BoardMarkers() {
    for (const marker of this.room4ColorBoardMarkers) {
      this.roomGroup.remove(marker);
      marker.geometry.dispose?.();
      if (marker.material?.map) {
        marker.material.map.dispose?.();
      }
      marker.material.dispose?.();
    }
    this.room4ColorBoardMarkers = [];
  }

  addRoom4BoardMarker(itemId) {
    const markerColors = {
      blueBall: "#71b8ff",
      redBall: "#ff6f6f",
      yellowBall: "#ffd85e",
      greenBall: "#79da7d",
    };
    const markerLabels = {
      blueBall: "B",
      redBall: "R",
      yellowBall: "Y",
      greenBall: "G",
    };
    const slotIndex = this.state.room4BallPlacedItems.length - 1;
    const marker = this.makeWordNote(
      markerLabels[itemId],
      markerColors[itemId],
      [-2.16 + slotIndex * 0.5, 1.2, -1.63],
      0,
    );
    marker.scale.set(0.18, 0.22, 1);
    marker.userData = { kind: "room4ColorBoard", label: "Color Board" };
    this.roomGroup.add(marker);
    this.room4ColorBoardMarkers.push(marker);
  }

  addToyShelfZone() {
    const shelf = this.makeTexturedBox([3.4, 2.4, 0.7], "wood", {
      color: 0xffffff,
      roughness: 0.78,
      metalness: 0.05,
    });
    shelf.position.set(-1.8, 1.2, -7.9);
    shelf.userData = { kind: "hint", label: "Toy Shelves", hint: "Bright toy shelves are packed with games, books, and blocks." };
    this.roomGroup.add(shelf);
    this.addSolid(shelf, 3.7, 1.0, 1.25);
    this.interactiveObjects.push(shelf);

    const shelfLines = [0.62, 1.2, 1.78];
    for (const y of shelfLines) {
      const plank = this.makeBox([3.2, 0.06, 0.58], 0xd3b08c);
      plank.position.set(-1.8, y, -7.84);
      this.roomGroup.add(plank);
    }

    const dividerLeft = this.makeBox([0.08, 2.08, 0.58], 0xc49c76);
    dividerLeft.position.set(-2.56, 1.32, -7.84);
    this.roomGroup.add(dividerLeft);

    const dividerMiddle = this.makeBox([0.08, 2.08, 0.58], 0xc49c76);
    dividerMiddle.position.set(-1.8, 1.32, -7.84);
    this.roomGroup.add(dividerMiddle);

    const dividerRight = this.makeBox([0.08, 2.08, 0.58], 0xc49c76);
    dividerRight.position.set(-1.04, 1.32, -7.84);
    this.roomGroup.add(dividerRight);

    for (let index = 0; index < 9; index += 1) {
      const block = this.makeBox([0.32, 0.32, 0.32], [0xff8a6d, 0x74c0ff, 0xffd665, 0x7fd880, 0xc18df3][index % 5]);
      block.position.set(-3.0 + (index % 3) * 0.74, 0.84 + Math.floor(index / 3) * 0.56, -7.76);
      this.roomGroup.add(block);
    }

    const toyBinLeft = this.makeBox([0.62, 0.34, 0.44], 0x78c8ff);
    toyBinLeft.position.set(-2.86, 0.82, -7.78);
    this.roomGroup.add(toyBinLeft);

    const toyBinRight = this.makeBox([0.62, 0.34, 0.44], 0xffbd63);
    toyBinRight.position.set(-1.18, 0.82, -7.78);
    this.roomGroup.add(toyBinRight);

    const carBase = this.makeBox([0.42, 0.12, 0.22], 0xff6f6f);
    carBase.position.set(-2.12, 0.82, -7.8);
    this.roomGroup.add(carBase);

    const carTop = this.makeBox([0.2, 0.12, 0.18], 0x9ad0ff);
    carTop.position.set(-2.1, 0.94, -7.78);
    this.roomGroup.add(carTop);

    for (const wheelX of [-2.28, -1.94]) {
      const wheelFront = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: 0x252a31 }),
      );
      wheelFront.position.set(wheelX, 0.76, -7.7);
      wheelFront.rotation.x = Math.PI / 2;
      this.roomGroup.add(wheelFront);

      const wheelBack = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: 0x252a31 }),
      );
      wheelBack.position.set(wheelX, 0.76, -7.9);
      wheelBack.rotation.x = Math.PI / 2;
      this.roomGroup.add(wheelBack);
    }

    const stackPole = this.makeBox([0.06, 0.36, 0.06], 0xf5e9d0);
    stackPole.position.set(-1.42, 0.96, -7.8);
    this.roomGroup.add(stackPole);

    const ringColors = [0xff8d75, 0xffd25c, 0x77d980, 0x75b8ff];
    for (let index = 0; index < ringColors.length; index += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.09 + index * 0.01, 0.025, 10, 18),
        new THREE.MeshStandardMaterial({ color: ringColors[index], roughness: 0.48, metalness: 0.02 }),
      );
      ring.position.set(-1.42, 0.82 + index * 0.08, -7.8);
      ring.rotation.x = Math.PI / 2;
      this.roomGroup.add(ring);
    }

    const teddyBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xbd8d62 }),
    );
    teddyBody.position.set(-0.52, 1.44, -7.78);
    this.roomGroup.add(teddyBody);

    const teddyHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xbd8d62 }),
    );
    teddyHead.position.set(-0.52, 1.72, -7.78);
    this.roomGroup.add(teddyHead);

    const robotBody = this.makeBox([0.24, 0.32, 0.18], 0xc8d1dd);
    robotBody.position.set(-2.74, 1.44, -7.8);
    this.roomGroup.add(robotBody);

    const robotHead = this.makeBox([0.18, 0.16, 0.16], 0xe7edf6);
    robotHead.position.set(-2.74, 1.7, -7.8);
    this.roomGroup.add(robotHead);

    const robotEyeLeft = this.makeBox([0.03, 0.03, 0.02], 0x6bb7ff);
    robotEyeLeft.position.set(-2.79, 1.71, -7.71);
    this.roomGroup.add(robotEyeLeft);

    const robotEyeRight = this.makeBox([0.03, 0.03, 0.02], 0x6bb7ff);
    robotEyeRight.position.set(-2.69, 1.71, -7.71);
    this.roomGroup.add(robotEyeRight);

    for (let index = 0; index < 4; index += 1) {
      const book = this.makeTexturedBox([0.12, 0.48, 0.14], "fabric", {
        color: [0x7fc1ff, 0xffa86f, 0x82d77e, 0xc493f0][index],
        roughness: 0.84,
        metalness: 0.01,
      });
      book.position.set(-1.54 + index * 0.16, 1.42, -7.8);
      book.rotation.z = -0.04 + index * 0.03;
      this.roomGroup.add(book);
    }

    const puzzleBox = this.makeBox([0.42, 0.18, 0.3], 0xf18db3);
    puzzleBox.position.set(-1.08, 1.44, -7.8);
    this.roomGroup.add(puzzleBox);

    const starToy = this.makeWordNote("★", "#ffd863", [-2.1, 2.1, -7.54], 0);
    starToy.scale.set(0.18, 0.22, 1);
    this.roomGroup.add(starToy);
  }

  addLockerZone() {
    this.room4LockerBody = this.makeBox([1.9, 3.2, 1.0], 0x79c3ff);
    this.room4LockerBody.position.set(9.0, 1.6, -5.1);
    this.room4LockerBody.userData = { kind: "room4Locker", label: "Locker" };
    this.roomGroup.add(this.room4LockerBody);
    this.addSolid(this.room4LockerBody, 2.2, 1.3, 1.6);
    this.interactiveObjects.push(this.room4LockerBody);

    this.room4LockerLeftDoor = this.makeBox([0.84, 2.7, 0.06], 0xa5d8ff);
    this.room4LockerLeftDoor.position.set(8.54, 1.6, -4.48);
    this.room4LockerLeftDoor.userData = { kind: "room4Locker", label: "Locker" };
    this.roomGroup.add(this.room4LockerLeftDoor);
    this.interactiveObjects.push(this.room4LockerLeftDoor);

    this.room4LockerRightDoor = this.makeBox([0.84, 2.7, 0.06], 0xa5d8ff);
    this.room4LockerRightDoor.position.set(9.46, 1.6, -4.48);
    this.room4LockerRightDoor.userData = { kind: "room4Locker", label: "Locker" };
    this.roomGroup.add(this.room4LockerRightDoor);
    this.interactiveObjects.push(this.room4LockerRightDoor);

    this.room4LockerHitbox = this.makeBox([2.3, 3.4, 1.3], 0xffffff);
    this.room4LockerHitbox.position.set(9.0, 1.62, -4.9);
    this.room4LockerHitbox.material.transparent = true;
    this.room4LockerHitbox.material.opacity = 0;
    this.room4LockerHitbox.userData = { kind: "room4Locker", label: "Locker" };
    this.roomGroup.add(this.room4LockerHitbox);
    this.interactiveObjects.push(this.room4LockerHitbox);

    for (let index = 0; index < 2; index += 1) {
      const vent = this.makeBox([0.42, 0.04, 0.02], 0x5a8ab2);
      vent.position.set(8.54 + index * 0.92, 2.36, -4.44);
      this.roomGroup.add(vent);
    }
  }

  addRoom4LockerItems() {
    const racketHandle = this.makeBox([0.08, 0.54, 0.05], 0x6e5442);
    racketHandle.position.set(8.68, 1.02, -5.08);
    racketHandle.userData = { kind: "collectItem", itemId: "badmintonRacket" };
    this.roomGroup.add(racketHandle);

    const racketHead = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.025, 10, 20),
      new THREE.MeshStandardMaterial({ color: 0xd94f4f, roughness: 0.34, metalness: 0.12 }),
    );
    racketHead.position.set(8.68, 1.44, -5.08);
    racketHead.rotation.y = Math.PI / 2;
    racketHead.scale.set(0.85, 1.1, 1);
    racketHead.userData = { kind: "collectItem", itemId: "badmintonRacket" };
    this.roomGroup.add(racketHead);

    const racketHitbox = this.makeBox([0.86, 1.3, 0.6], 0xffffff);
    racketHitbox.position.set(8.68, 1.24, -5.08);
    racketHitbox.material.transparent = true;
    racketHitbox.material.opacity = 0;
    racketHitbox.userData = { kind: "collectItem", itemId: "badmintonRacket" };
    this.roomGroup.add(racketHitbox);
    this.registerCollectible("badmintonRacket", [racketHandle, racketHead, racketHitbox]);

    const shuttleBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.08, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0xf0d8b2, roughness: 0.72, metalness: 0.01 }),
    );
    shuttleBase.position.set(9.28, 1.02, -5.08);
    shuttleBase.rotation.z = Math.PI / 2;
    shuttleBase.userData = { kind: "collectItem", itemId: "shuttlecock" };
    this.roomGroup.add(shuttleBase);

    const shuttleSkirt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.1, 0.16, 8, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xfdfefe, roughness: 0.84, metalness: 0.01, side: THREE.DoubleSide }),
    );
    shuttleSkirt.position.set(9.42, 1.02, -5.08);
    shuttleSkirt.rotation.z = Math.PI / 2;
    shuttleSkirt.userData = { kind: "collectItem", itemId: "shuttlecock" };
    this.roomGroup.add(shuttleSkirt);

    const shuttleHitbox = this.makeBox([0.7, 0.7, 0.58], 0xffffff);
    shuttleHitbox.position.set(9.34, 1.02, -5.08);
    shuttleHitbox.material.transparent = true;
    shuttleHitbox.material.opacity = 0;
    shuttleHitbox.userData = { kind: "collectItem", itemId: "shuttlecock" };
    this.roomGroup.add(shuttleHitbox);
    this.registerCollectible("shuttlecock", [shuttleBase, shuttleSkirt, shuttleHitbox]);
  }

  addBadmintonZone() {
    const mat = this.makeBox([5.6, 0.03, 3.2], 0xa6ea96);
    mat.position.set(3.8, 0.02, -3.2);
    this.roomGroup.add(mat);

    const net = this.makeBox([0.08, 1.4, 3.0], 0xf3f6fb);
    net.position.set(3.8, 0.72, -3.2);
    net.material.transparent = true;
    net.material.opacity = 0.55;
    net.userData = { kind: "hint", label: "Badminton Net", hint: "A badminton area is set up for target games." };
    this.roomGroup.add(net);
    this.interactiveObjects.push(net);

    const postLeft = this.makeBox([0.08, 1.56, 0.08], 0x8591a4);
    postLeft.position.set(3.8, 0.8, -4.7);
    this.roomGroup.add(postLeft);

    const postRight = this.makeBox([0.08, 1.56, 0.08], 0x8591a4);
    postRight.position.set(3.8, 0.8, -1.7);
    this.roomGroup.add(postRight);

    const racketGroup = new THREE.Group();
    racketGroup.position.set(1.28, 0.72, -1.92);
    racketGroup.rotation.z = 0.38;

    const racketHint = { kind: "hint", label: "Badminton Racket", hint: "A red badminton racket waits by the badminton area." };
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xd94f4f, roughness: 0.34, metalness: 0.12 });
    const stringMaterial = new THREE.MeshStandardMaterial({ color: 0xf7fbff, roughness: 0.32, metalness: 0.18 });

    const head = new THREE.Mesh(
      new THREE.TorusGeometry(0.26, 0.03, 12, 28),
      frameMaterial,
    );
    head.scale.set(0.9, 1.18, 1);
    head.position.set(0.0, 0.26, 0.0);
    head.rotation.y = Math.PI / 2;
    head.userData = racketHint;
    racketGroup.add(head);
    this.interactiveObjects.push(head);

    const throatLeft = this.makeBox([0.04, 0.18, 0.03], 0xd94f4f);
    throatLeft.position.set(-0.07, 0.0, 0.0);
    throatLeft.rotation.z = -0.24;
    throatLeft.userData = racketHint;
    racketGroup.add(throatLeft);
    this.interactiveObjects.push(throatLeft);

    const throatRight = this.makeBox([0.04, 0.18, 0.03], 0xd94f4f);
    throatRight.position.set(0.07, 0.0, 0.0);
    throatRight.rotation.z = 0.24;
    throatRight.userData = racketHint;
    racketGroup.add(throatRight);
    this.interactiveObjects.push(throatRight);

    const neck = this.makeBox([0.07, 0.42, 0.04], 0xd94f4f);
    neck.position.set(0.0, -0.24, 0.0);
    neck.userData = racketHint;
    racketGroup.add(neck);
    this.interactiveObjects.push(neck);

    const handle = this.makeBox([0.08, 0.42, 0.05], 0x6d4f3b);
    handle.position.set(0.0, -0.64, 0.0);
    handle.userData = racketHint;
    racketGroup.add(handle);
    this.interactiveObjects.push(handle);

    const grip = this.makeBox([0.09, 0.28, 0.06], 0x2a2f38);
    grip.position.set(0.0, -0.78, 0.0);
    grip.userData = racketHint;
    racketGroup.add(grip);
    this.interactiveObjects.push(grip);

    for (let index = 0; index < 4; index += 1) {
      const vString = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.44, 0.01), stringMaterial);
      vString.position.set(0.0, 0.24, -0.1 + index * 0.066);
      vString.userData = racketHint;
      racketGroup.add(vString);
      this.interactiveObjects.push(vString);
    }

    for (let index = 0; index < 4; index += 1) {
      const hString = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.3), stringMaterial);
      hString.position.set(0.0, 0.12 + index * 0.09, 0.0);
      hString.userData = racketHint;
      racketGroup.add(hString);
      this.interactiveObjects.push(hString);
    }

    this.roomGroup.add(racketGroup);

    const shuttleGroup = new THREE.Group();
    shuttleGroup.position.set(1.56, 0.22, -2.36);
    shuttleGroup.rotation.z = -0.22;

    const cork = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.08, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0xf0d8b2, roughness: 0.72, metalness: 0.01 }),
    );
    cork.rotation.z = Math.PI / 2;
    shuttleGroup.add(cork);

    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.095, 0.02, 18),
      new THREE.MeshStandardMaterial({ color: 0xd84f4f, roughness: 0.38, metalness: 0.08 }),
    );
    band.position.set(0.06, 0, 0);
    band.rotation.z = Math.PI / 2;
    shuttleGroup.add(band);

    for (let index = 0; index < 8; index += 1) {
      const vane = this.makeBox([0.02, 0.22, 0.08], 0xfafcff);
      const angle = (index / 8) * Math.PI * 2;
      vane.position.set(0.17, Math.cos(angle) * 0.09, Math.sin(angle) * 0.09);
      vane.rotation.x = Math.sin(angle) * 0.35;
      vane.rotation.y = angle;
      vane.rotation.z = -0.9;
      shuttleGroup.add(vane);
    }

    const featherRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.12, 0.16, 8, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xfdfefe, roughness: 0.84, metalness: 0.01, side: THREE.DoubleSide }),
    );
    featherRing.position.set(0.18, 0, 0);
    featherRing.rotation.z = Math.PI / 2;
    shuttleGroup.add(featherRing);

    const shuttleHitbox = this.makeBox([0.34, 0.22, 0.22], 0xffffff);
    shuttleHitbox.material.transparent = true;
    shuttleHitbox.material.opacity = 0;
    shuttleHitbox.position.set(0.06, 0, 0);
    shuttleHitbox.userData = {
      kind: "hint",
      label: "Shuttlecock",
      hint: "A badminton shuttlecock rests on the floor.",
    };
    shuttleGroup.add(shuttleHitbox);
    this.interactiveObjects.push(shuttleHitbox);

    this.roomGroup.add(shuttleGroup);
  }

  addBadmintonTargetArea() {
    const targetDefs = [
      { name: "left", x: 1.54, y: 1.88, color: 0x71b8ff, label: "Left Target" },
      { name: "center", x: 2.34, y: 1.46, color: 0xffd85e, label: "Center Target" },
      { name: "right", x: 3.14, y: 1.88, color: 0xff6f6f, label: "Right Target" },
    ];

    for (const targetDef of targetDefs) {
      const target = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.08, 24),
        new THREE.MeshStandardMaterial({
          color: targetDef.color,
          roughness: 0.34,
          metalness: 0.08,
          emissive: 0x101318,
          emissiveIntensity: 0.2,
        }),
      );
      target.position.set(targetDef.x, targetDef.y, -5.88);
      target.rotation.x = Math.PI / 2;
      target.userData = { kind: "room4Target", targetName: targetDef.name, label: targetDef.label };
      this.roomGroup.add(target);
      this.interactiveObjects.push(target);
      this.room4Targets.push(target);

      const hitbox = this.makeBox([0.86, 0.86, 0.46], 0xffffff);
      hitbox.position.set(targetDef.x, targetDef.y, -5.78);
      hitbox.material.transparent = true;
      hitbox.material.opacity = 0;
      target.userData.visualTarget = target;
      hitbox.userData = {
        kind: "room4Target",
        targetName: targetDef.name,
        label: targetDef.label,
        visualTarget: target,
      };
      this.roomGroup.add(hitbox);
      this.interactiveObjects.push(hitbox);
      this.room4Targets.push(hitbox);
    }

    this.room4CodeCard = this.makeWordNote("731", "#fff6d8", [2.34, 1.0, -5.78], Math.PI);
    this.room4CodeCard.scale.set(0.34, 0.28, 1);
    this.room4CodeCard.visible = false;
    this.room4CodeCard.userData = { kind: "room4Target", targetName: "center", label: "Target Code" };
    this.roomGroup.add(this.room4CodeCard);
  }

  addRoom4Scoreboard() {
    this.room4Scoreboard = this.makeBox([1.7, 0.98, 0.14], 0x263345);
    this.room4Scoreboard.position.set(5.9, 2.26, -5.88);
    this.room4Scoreboard.userData = { kind: "room4Scoreboard", label: "Scoreboard" };
    this.roomGroup.add(this.room4Scoreboard);
    this.interactiveObjects.push(this.room4Scoreboard);

    const screen = this.makeBox([1.34, 0.62, 0.08], 0x1a2029);
    screen.position.set(5.9, 2.26, -5.79);
    this.roomGroup.add(screen);

    const note = this.makeWordNote("CODE", "#9fe4ff", [5.9, 2.28, -5.73], Math.PI);
    note.scale.set(0.28, 0.22, 1);
    note.userData = { kind: "room4Scoreboard", label: "Scoreboard" };
    this.roomGroup.add(note);
    this.interactiveObjects.push(note);

    this.room4ScoreboardHitbox = this.makeBox([2.0, 1.24, 0.6], 0xffffff);
    this.room4ScoreboardHitbox.position.set(5.9, 2.26, -5.74);
    this.room4ScoreboardHitbox.material.transparent = true;
    this.room4ScoreboardHitbox.material.opacity = 0;
    this.room4ScoreboardHitbox.userData = { kind: "room4Scoreboard", label: "Scoreboard" };
    this.roomGroup.add(this.room4ScoreboardHitbox);
    this.interactiveObjects.push(this.room4ScoreboardHitbox);

    const prompt = this.makeWordNote("SCORE", "#dbe7f5", [5.9, 2.02, -5.8], Math.PI);
    prompt.scale.set(0.22, 0.18, 1);
    prompt.userData = { kind: "room4Scoreboard", label: "Scoreboard" };
    this.roomGroup.add(prompt);
  }

  addSportsRackZone() {
    const rackHint = { kind: "room4SportsRack", label: "Sports Rack" };

    this.room4SportsRackBody = this.makeBox([1.5, 1.8, 0.7], 0xf19942);
    this.room4SportsRackBody.position.set(7.5, 0.9, -0.03);
    this.room4SportsRackBody.userData = rackHint;
    this.roomGroup.add(this.room4SportsRackBody);
    this.interactiveObjects.push(this.room4SportsRackBody);
    this.addSolid(this.room4SportsRackBody, 1.8, 1.0, 1.0);

    const leftPost = this.makeBox([0.1, 1.86, 0.1], 0xf19942);
    leftPost.position.set(6.86, 0.93, -0.2);
    leftPost.userData = rackHint;
    this.roomGroup.add(leftPost);
    this.interactiveObjects.push(leftPost);

    const rightPost = this.makeBox([0.1, 1.86, 0.1], 0xf19942);
    rightPost.position.set(8.14, 0.93, -0.2);
    rightPost.userData = rackHint;
    this.roomGroup.add(rightPost);
    this.interactiveObjects.push(rightPost);

    const backLeftPost = this.makeBox([0.1, 1.86, 0.1], 0xf19942);
    backLeftPost.position.set(6.86, 0.93, 0.14);
    this.roomGroup.add(backLeftPost);

    const backRightPost = this.makeBox([0.1, 1.86, 0.1], 0xf19942);
    backRightPost.position.set(8.14, 0.93, 0.14);
    this.roomGroup.add(backRightPost);

    const topBar = this.makeBox([1.38, 0.08, 0.1], 0xffc174);
    topBar.position.set(7.5, 1.8, -0.2);
    topBar.userData = rackHint;
    this.roomGroup.add(topBar);
    this.interactiveObjects.push(topBar);

    const backBar = this.makeBox([1.38, 0.08, 0.1], 0xffc174);
    backBar.position.set(7.5, 1.8, 0.14);
    this.roomGroup.add(backBar);

    const sideRailTop = this.makeBox([0.1, 0.08, 0.42], 0xffc174);
    sideRailTop.position.set(6.86, 1.8, -0.03);
    this.roomGroup.add(sideRailTop);

    const sideRailTopRight = this.makeBox([0.1, 0.08, 0.42], 0xffc174);
    sideRailTopRight.position.set(8.14, 1.8, -0.03);
    this.roomGroup.add(sideRailTopRight);

    for (let index = 0; index < 3; index += 1) {
      const shelf = this.makeBox([1.18, 0.06, 0.42], 0xffc174);
      shelf.position.set(7.5, 0.48 + index * 0.52, -0.03);
      shelf.userData = rackHint;
      this.roomGroup.add(shelf);
      this.interactiveObjects.push(shelf);
    }

    const rackBase = this.makeBox([1.42, 0.08, 0.46], 0xf19942);
    rackBase.position.set(7.5, 0.08, -0.03);
    rackBase.userData = rackHint;
    this.roomGroup.add(rackBase);
    this.interactiveObjects.push(rackBase);

    this.room4SportsRackDoor = this.makeBox([1.26, 1.42, 0.08], 0xffc174);
    this.room4SportsRackDoor.position.set(7.5, 0.94, 0.22);
    this.room4SportsRackDoor.userData = rackHint;
    this.roomGroup.add(this.room4SportsRackDoor);
    this.interactiveObjects.push(this.room4SportsRackDoor);

    this.room4SportsRackHitbox = this.makeBox([1.9, 2.0, 1.0], 0xffffff);
    this.room4SportsRackHitbox.position.set(7.5, 0.94, -0.03);
    this.room4SportsRackHitbox.material.transparent = true;
    this.room4SportsRackHitbox.material.opacity = 0;
    this.room4SportsRackHitbox.userData = rackHint;
    this.roomGroup.add(this.room4SportsRackHitbox);
    this.interactiveObjects.push(this.room4SportsRackHitbox);

    const ballA = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0xff7a72 }),
    );
    ballA.position.set(7.12, 1.52, -0.04);
    this.roomGroup.add(ballA);

    const ballB = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0x6bc2ff }),
    );
    ballB.position.set(7.82, 1.0, -0.02);
    this.roomGroup.add(ballB);

    const bat = this.makeBox([0.14, 1.1, 0.08], 0x8f6b50);
    bat.position.set(7.96, 0.92, 0.18);
    bat.rotation.z = -0.26;
    this.roomGroup.add(bat);
  }

  addRoom4SportsRackItems() {
    const racketHandle = this.makeBox([0.08, 0.56, 0.05], 0x4f3e33);
    racketHandle.position.set(7.22, 0.94, -0.06);
    racketHandle.userData = { kind: "collectItem", itemId: "tennisRacket" };
    this.roomGroup.add(racketHandle);

    const racketHead = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.028, 10, 22),
      new THREE.MeshStandardMaterial({ color: 0x58b76a, roughness: 0.34, metalness: 0.12 }),
    );
    racketHead.position.set(7.22, 1.36, -0.06);
    racketHead.rotation.y = Math.PI / 2;
    racketHead.scale.set(0.95, 1.18, 1);
    racketHead.userData = { kind: "collectItem", itemId: "tennisRacket" };
    this.roomGroup.add(racketHead);

    const racketHitbox = this.makeBox([0.9, 1.32, 0.62], 0xffffff);
    racketHitbox.position.set(7.22, 1.18, -0.06);
    racketHitbox.material.transparent = true;
    racketHitbox.material.opacity = 0;
    racketHitbox.userData = { kind: "collectItem", itemId: "tennisRacket" };
    this.roomGroup.add(racketHitbox);
    this.registerCollectible("tennisRacket", [racketHandle, racketHead, racketHitbox]);

    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0xb7ff63, roughness: 0.5, metalness: 0.01 }),
    );
    ball.position.set(7.82, 1.0, -0.06);
    ball.userData = { kind: "collectItem", itemId: "tennisBallItem" };
    this.roomGroup.add(ball);

    const ballHitbox = this.makeBox([0.66, 0.66, 0.66], 0xffffff);
    ballHitbox.position.set(7.82, 1.0, -0.06);
    ballHitbox.material.transparent = true;
    ballHitbox.material.opacity = 0;
    ballHitbox.userData = { kind: "collectItem", itemId: "tennisBallItem" };
    this.roomGroup.add(ballHitbox);
    this.registerCollectible("tennisBallItem", [ball, ballHitbox]);
  }

  addBounceWallZone() {
    this.room4BounceWall = this.makeTexturedBox([2.8, 2.8, 0.34], "wall", {
      color: 0x87b8ff,
      roughness: 0.94,
      metalness: 0.01,
    });
    this.room4BounceWall.position.set(0.2, 1.4, HALF_DEPTH - 0.24);
    this.room4BounceWall.userData = { kind: "room4BounceWall", label: "Bounce Wall" };
    this.roomGroup.add(this.room4BounceWall);
    this.addSolid(this.room4BounceWall, 3.0, 0.65, 1.4);
    this.interactiveObjects.push(this.room4BounceWall);

    this.room4BounceWallHitbox = this.makeBox([3.2, 3.2, 0.8], 0xffffff);
    this.room4BounceWallHitbox.position.set(0.2, 1.4, HALF_DEPTH - 0.02);
    this.room4BounceWallHitbox.material.transparent = true;
    this.room4BounceWallHitbox.material.opacity = 0;
    this.room4BounceWallHitbox.userData = { kind: "room4BounceWall", label: "Bounce Wall" };
    this.roomGroup.add(this.room4BounceWallHitbox);
    this.interactiveObjects.push(this.room4BounceWallHitbox);

    const targetRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.08, 12, 28),
      new THREE.MeshStandardMaterial({ color: 0xffdf61, roughness: 0.34, metalness: 0.08 }),
    );
    targetRing.position.set(0.24, 1.76, HALF_DEPTH - 0.02);
    targetRing.rotation.y = Math.PI / 2;
    this.roomGroup.add(targetRing);

    const tennisBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0xb4ff62, roughness: 0.5, metalness: 0.01 }),
    );
    tennisBall.position.set(-0.96, 0.18, 7.46);
    this.roomGroup.add(tennisBall);
  }

  addToyChestZone() {
    this.room4ToyChestBody = this.makeTexturedBox([2.2, 1.0, 1.2], "wood", {
      color: 0xffffff,
      roughness: 0.76,
      metalness: 0.05,
    });
    this.room4ToyChestBody.position.set(-1.0, 0.5, 6.2);
    this.room4ToyChestBody.userData = { kind: "room4ToyChest", label: "Toy Chest" };
    this.roomGroup.add(this.room4ToyChestBody);
    this.addSolid(this.room4ToyChestBody, 2.5, 1.5, 0.8);
    this.interactiveObjects.push(this.room4ToyChestBody);

    this.room4ToyChestLid = this.makeBox([2.18, 0.18, 1.16], 0xff7d6b);
    this.room4ToyChestLid.position.set(-1.0, 1.02, 6.2);
    this.room4ToyChestLid.rotation.x = -0.12;
    this.room4ToyChestLid.userData = { kind: "room4ToyChest", label: "Toy Chest" };
    this.roomGroup.add(this.room4ToyChestLid);
    this.interactiveObjects.push(this.room4ToyChestLid);

    this.room4ToyChestHitbox = this.makeBox([2.7, 1.5, 1.7], 0xffffff);
    this.room4ToyChestHitbox.position.set(-1.0, 0.9, 6.2);
    this.room4ToyChestHitbox.material.transparent = true;
    this.room4ToyChestHitbox.material.opacity = 0;
    this.room4ToyChestHitbox.userData = { kind: "room4ToyChest", label: "Toy Chest" };
    this.roomGroup.add(this.room4ToyChestHitbox);
    this.interactiveObjects.push(this.room4ToyChestHitbox);

    const plush = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xc38d67 }),
    );
    plush.position.set(-1.42, 1.16, 6.08);
    this.roomGroup.add(plush);

    const blockTowerColors = [0x6eb4ff, 0xffd35e, 0xff8f79];
    for (let index = 0; index < 3; index += 1) {
      const block = this.makeBox([0.26, 0.26, 0.26], blockTowerColors[index]);
      block.position.set(-0.34, 0.26 + index * 0.26, 6.18);
      this.roomGroup.add(block);
    }
  }

  addRoom4PlayBlocks() {
    const letters = [
      { id: "blockP", letter: "P" },
      { id: "blockA", letter: "A" },
      { id: "blockL", letter: "L" },
      { id: "blockY", letter: "Y" },
    ];
    const displayPositions = [
      [-1.62, 1.74, 5.34],
      [-1.14, 1.74, 5.34],
      [-0.66, 1.74, 5.34],
      [-0.18, 1.74, 5.34],
    ];
    const positions = [
      [-1.62, 1.02, 5.62],
      [-1.14, 1.02, 5.62],
      [-0.66, 1.02, 5.62],
      [-0.18, 1.02, 5.62],
    ];
    const colors = [0x71b8ff, 0xff6f6f, 0xffd85e, 0x79da7d];

    for (let index = 0; index < letters.length; index += 1) {
      const displayLetter = this.makeWordNote(
        letters[index].letter,
        ["#4b91ff", "#ff6f6f", "#ffd85e", "#79da7d"][index],
        [displayPositions[index][0], displayPositions[index][1], displayPositions[index][2]],
        Math.PI,
      );
      displayLetter.scale.set(0.3, 0.38, 1);
      displayLetter.renderOrder = 6;
      this.roomGroup.add(displayLetter);
      this.room4PlayBlockMeshes.push(displayLetter);
    }

    const helperLabel = this.makeWordNote("Collect these letters ↑", "#fff4a8", [-0.9, 1.32, 5.36], Math.PI);
    helperLabel.scale.set(0.58, 0.24, 1);
    helperLabel.renderOrder = 6;
    this.roomGroup.add(helperLabel);
    this.room4PlayBlockMeshes.push(helperLabel);

    for (let index = 0; index < letters.length; index += 1) {
      const cube = this.makeBox([0.26, 0.26, 0.26], colors[index]);
      cube.position.set(...positions[index]);
      cube.rotation.set(0.04, 0, 0);
      cube.userData = { kind: "collectItem", itemId: letters[index].id };
      this.roomGroup.add(cube);
      this.room4PlayBlockMeshes.push(cube);

      const letter = this.makeWordNote(
        letters[index].letter,
        "#fffdf8",
        [positions[index][0], positions[index][1] + 0.01, positions[index][2] + 0.16],
        0,
      );
      letter.scale.set(0.16, 0.22, 1);
      letter.userData = { kind: "collectItem", itemId: letters[index].id };
      this.roomGroup.add(letter);
      this.room4PlayBlockMeshes.push(letter);

      const hitbox = this.makeBox([0.46, 0.48, 0.46], 0xffffff);
      hitbox.position.set(positions[index][0], positions[index][1], positions[index][2]);
      hitbox.material.transparent = true;
      hitbox.material.opacity = 0;
      hitbox.userData = { kind: "collectItem", itemId: letters[index].id };
      this.roomGroup.add(hitbox);
      this.room4PlayBlockMeshes.push(hitbox);

      this.registerCollectible(letters[index].id, [cube, letter, hitbox]);
    }
  }

  addShapePuzzleWall() {
    const wallHint = { kind: "hint", label: "Shape Puzzle Wall", hint: "A shape puzzle wall is full of bright matching spaces." };
    const wallFaceZ = HALF_DEPTH - 0.68;
    const roomFacingZ = wallFaceZ - 0.34;
    const colors = [0xff6f6f, 0x71b8ff, 0xffd85e, 0x79da7d];

    const backPanel = this.makeBox([3.7, 2.9, 0.18], 0x27364d);
    backPanel.position.set(-4.8, 1.5, wallFaceZ - 0.12);
    backPanel.userData = wallHint;
    this.roomGroup.add(backPanel);
    this.addSolid(backPanel, 3.8, 0.45, 1.45);
    this.interactiveObjects.push(backPanel);

    for (let index = 0; index < 4; index += 1) {
      const stripe = this.makeBox([0.86, 2.55, 0.2], colors[index]);
      stripe.position.set(-5.94 + index * 0.76, 1.5, wallFaceZ);
      stripe.userData = wallHint;
      this.roomGroup.add(stripe);
      this.interactiveObjects.push(stripe);
    }

    const title = this.makeWordNote("PLAY WALL", "#ffffff", [-4.78, 2.46, roomFacingZ - 0.06], Math.PI);
    title.scale.set(0.52, 0.32, 1);
    title.userData = wallHint;
    this.roomGroup.add(title);
    this.interactiveObjects.push(title);

    const slotDefs = [
      { letter: "Y", x: -5.95, y: 1.24, color: 0xff6f6f, itemId: "blockY" },
      { letter: "A", x: -5.18, y: 1.24, color: 0x71b8ff, itemId: "blockA" },
      { letter: "L", x: -4.41, y: 1.24, color: 0xffd85e, itemId: "blockL" },
      { letter: "P", x: -3.64, y: 1.24, color: 0x79da7d, itemId: "blockP" },
    ];
    this.room4ShapeSlotDefs = slotDefs;

    for (const slotDef of slotDefs) {
      const outerFrame = this.makeBox([0.86, 0.86, 0.2], slotDef.color);
      outerFrame.position.set(slotDef.x, slotDef.y, roomFacingZ);
      outerFrame.userData = { kind: "room4ShapeSlot", label: "Letter Slot", letter: slotDef.letter, itemId: slotDef.itemId };
      this.roomGroup.add(outerFrame);
      this.interactiveObjects.push(outerFrame);
      this.room4ShapeSlots.push(outerFrame);

      const innerSlot = this.makeBox([0.62, 0.62, 0.08], 0x0f1c2c);
      innerSlot.position.set(slotDef.x, slotDef.y, roomFacingZ + 0.06);
      innerSlot.userData = { kind: "room4ShapeSlot", label: "Letter Slot", letter: slotDef.letter, itemId: slotDef.itemId };
      this.roomGroup.add(innerSlot);
      this.interactiveObjects.push(innerSlot);
      this.room4ShapeSlots.push(innerSlot);

      const slotHint = this.makeWordNote(slotDef.letter, "#ffffff", [slotDef.x, slotDef.y, roomFacingZ + 0.14], Math.PI);
      slotHint.scale.set(0.2, 0.24, 1);
      slotHint.userData = { kind: "room4ShapeSlot", label: "Letter Slot", letter: slotDef.letter, itemId: slotDef.itemId };
      this.roomGroup.add(slotHint);
      this.interactiveObjects.push(slotHint);
      this.room4ShapeSlots.push(slotHint);
    }

    const helper = this.makeWordNote("Put P L A Y here", "#fff4a8", [-4.8, 0.46, roomFacingZ + 0.12], Math.PI);
    helper.scale.set(0.6, 0.22, 1);
    helper.userData = wallHint;
    this.roomGroup.add(helper);
    this.interactiveObjects.push(helper);
  }

  clearRoom4PlacedLetters() {
    for (const mesh of this.room4PlacedLetterMeshes) {
      this.roomGroup.remove(mesh);
      mesh.geometry?.dispose?.();
      if (mesh.material?.map) {
        mesh.material.map.dispose?.();
      }
      mesh.material?.dispose?.();
    }
    this.room4PlacedLetterMeshes = [];
  }

  addRoom4PlacedLetter(slotDef) {
    const wallFaceZ = HALF_DEPTH - 0.68;
    const roomFacingZ = wallFaceZ - 0.34;
    const block = this.makeBox([0.42, 0.42, 0.08], slotDef.color);
    block.position.set(slotDef.x, slotDef.y, roomFacingZ + 0.08);
    this.roomGroup.add(block);
    this.room4PlacedLetterMeshes.push(block);

    const face = this.makeWordNote(slotDef.letter, "#ffffff", [slotDef.x, slotDef.y, roomFacingZ + 0.16], Math.PI);
    face.scale.set(0.15, 0.18, 1);
    this.roomGroup.add(face);
    this.room4PlacedLetterMeshes.push(face);
  }

  addHiddenWallPanel() {
    this.room4HiddenPanel = this.makeBox([1.95, 1.75, 0.12], 0xf8d58b);
    this.room4HiddenPanel.position.set(10.3, 2.0, 1.2);
    this.room4HiddenPanel.userData = { kind: "room4HiddenPanel", label: "Hidden Wall Panel" };
    this.roomGroup.add(this.room4HiddenPanel);
    this.interactiveObjects.push(this.room4HiddenPanel);

    this.room4HiddenPanelFrame = this.makeBox([2.14, 1.94, 0.07], 0xffffff);
    this.room4HiddenPanelFrame.position.set(10.26, 2.0, 1.14);
    this.roomGroup.add(this.room4HiddenPanelFrame);

    this.room4HiddenPanelLabel = this.makeWordNote("Hidden Panel", "#2c3140", [10.18, 2.0, 1.2], -Math.PI / 2);
    this.room4HiddenPanelLabel.scale.set(1.12, 0.46, 1);
    this.room4HiddenPanelLabel.material.side = THREE.FrontSide;
    this.room4HiddenPanelLabel.material.depthTest = false;
    this.room4HiddenPanelLabel.material.depthWrite = false;
    this.room4HiddenPanelLabel.renderOrder = 8;
    this.room4HiddenPanelLabel.visible = false;
    this.room4HiddenPanelLabel.userData = { kind: "room4HiddenPanel", label: "Hidden Wall Panel" };
    this.roomGroup.add(this.room4HiddenPanelLabel);

    const cluePosition = [-0.2, 3.28, HALF_DEPTH - 0.34];
    const clueRotation = Math.PI;

    const glowPanel = this.makeBox([5.5, 1.35, 0.08], 0xf4f0ff);
    glowPanel.position.set(...cluePosition);
    glowPanel.rotation.y = clueRotation;
    glowPanel.material.emissive = new THREE.Color(0xcfc0ff);
    glowPanel.material.emissiveIntensity = 0.55;
    glowPanel.renderOrder = 2;
    glowPanel.visible = false;
    glowPanel.userData = { kind: "room4ArrowClue", label: "Arrow Clue" };
    this.roomGroup.add(glowPanel);
    this.room4ArrowClues.push(glowPanel);

    const arrowSequence = this.makeWordNote("↑   ←   →   ↓", "#111111", [-0.2, 3.28, HALF_DEPTH - 0.26], clueRotation);
    arrowSequence.scale.set(1.55, 0.86, 1);
    arrowSequence.material.depthTest = false;
    arrowSequence.material.depthWrite = false;
    arrowSequence.renderOrder = 6;
    arrowSequence.visible = false;
    arrowSequence.userData = { kind: "room4ArrowClue", label: "Arrow Clue" };
    this.roomGroup.add(arrowSequence);
    this.room4ArrowClues.push(arrowSequence);
  }

  addRoom4UvTorch() {
    const handle = this.makeBox([0.12, 0.34, 0.12], 0x2c3140);
    handle.position.set(10.08, 1.5, 1.02);
    handle.userData = { kind: "collectItem", itemId: "room4UvTorch" };
    this.roomGroup.add(handle);

    const glowHead = this.makeBox([0.16, 0.16, 0.16], 0xb985ff);
    glowHead.position.set(10.08, 1.76, 1.02);
    glowHead.userData = { kind: "collectItem", itemId: "room4UvTorch" };
    this.roomGroup.add(glowHead);

    const hitbox = this.makeBox([0.86, 1.0, 0.72], 0xffffff);
    hitbox.position.set(10.08, 1.64, 1.02);
    hitbox.material.transparent = true;
    hitbox.material.opacity = 0;
    hitbox.userData = { kind: "collectItem", itemId: "room4UvTorch" };
    this.roomGroup.add(hitbox);

    this.registerCollectible("room4UvTorch", [handle, glowHead, hitbox]);
  }

  addRoom4ArrowPanels() {
    const panelDefs = [
      { direction: "up", label: "Up Panel", color: 0x71b8ff, position: [4.2, 1.46, 7.85], symbol: "↑" },
      { direction: "left", label: "Left Panel", color: 0xff6f6f, position: [5.35, 1.46, 7.85], symbol: "←" },
      { direction: "right", label: "Right Panel", color: 0xffd85e, position: [6.5, 1.46, 7.85], symbol: "→" },
      { direction: "down", label: "Down Panel", color: 0x79da7d, position: [7.65, 1.46, 7.85], symbol: "↓" },
    ];

    for (const panelDef of panelDefs) {
      const panel = this.makeBox([0.82, 0.82, 0.16], panelDef.color);
      panel.position.set(...panelDef.position);
      panel.userData = {
        kind: "room4ArrowPanel",
        label: panelDef.label,
        direction: panelDef.direction,
        visualTarget: null,
      };
      this.roomGroup.add(panel);
      this.interactiveObjects.push(panel);
      this.room4ArrowPanels.push(panel);

      const panelHitbox = this.makeBox([1.02, 1.02, 0.36], 0xffffff);
      panelHitbox.position.set(...panelDef.position);
      panelHitbox.material.transparent = true;
      panelHitbox.material.opacity = 0;
      panelHitbox.userData = {
        kind: "room4ArrowPanel",
        label: panelDef.label,
        direction: panelDef.direction,
        visualTarget: panel,
      };
      this.roomGroup.add(panelHitbox);
      this.interactiveObjects.push(panelHitbox);
      this.room4ArrowPanels.push(panelHitbox);

      const arrowLabel = this.makeWordNote(panelDef.symbol, "#ffffff", [panelDef.position[0], panelDef.position[1], panelDef.position[2] + 0.1], 0);
      arrowLabel.scale.set(0.18, 0.24, 1);
      arrowLabel.userData = {
        kind: "room4ArrowPanel",
        label: panelDef.label,
        direction: panelDef.direction,
        visualTarget: panel,
      };
      this.roomGroup.add(arrowLabel);
      this.interactiveObjects.push(arrowLabel);
      this.room4ArrowPanels.push(arrowLabel);

      panel.userData.visualTarget = panel;
    }
  }

  addPlayFinalCabinet() {
    const cabinetHint = { kind: "room4FinalCabinet", label: "Final Cabinet" };

    this.room4FinalCabinetBody = this.makeTexturedBox([2.0, 2.2, 0.9], "wood", {
      color: 0xffffff,
      roughness: 0.76,
      metalness: 0.04,
    });
    this.room4FinalCabinetBody.position.set(6.6, 1.1, 6.1);
    this.room4FinalCabinetBody.userData = cabinetHint;
    this.roomGroup.add(this.room4FinalCabinetBody);
    this.addSolid(this.room4FinalCabinetBody, 2.3, 1.2, 1.2);
    this.interactiveObjects.push(this.room4FinalCabinetBody);

    this.room4FinalCabinetLeftDoor = this.makeBox([0.84, 1.72, 0.06], 0xffb25f);
    this.room4FinalCabinetLeftDoor.position.set(6.15, 1.18, 6.52);
    this.room4FinalCabinetLeftDoor.userData = cabinetHint;
    this.roomGroup.add(this.room4FinalCabinetLeftDoor);
    this.interactiveObjects.push(this.room4FinalCabinetLeftDoor);

    this.room4FinalCabinetRightDoor = this.makeBox([0.84, 1.72, 0.06], 0x7ebeff);
    this.room4FinalCabinetRightDoor.position.set(7.05, 1.18, 6.52);
    this.room4FinalCabinetRightDoor.userData = cabinetHint;
    this.roomGroup.add(this.room4FinalCabinetRightDoor);
    this.interactiveObjects.push(this.room4FinalCabinetRightDoor);

    this.room4FinalCabinetHitbox = this.makeBox([2.4, 2.3, 1.2], 0xffffff);
    this.room4FinalCabinetHitbox.position.set(6.6, 1.18, 6.12);
    this.room4FinalCabinetHitbox.material.transparent = true;
    this.room4FinalCabinetHitbox.material.opacity = 0;
    this.room4FinalCabinetHitbox.userData = cabinetHint;
    this.roomGroup.add(this.room4FinalCabinetHitbox);
    this.interactiveObjects.push(this.room4FinalCabinetHitbox);

    const cabinetNote = this.makeWordNote("CABINET", "#fff8ed", [6.6, 2.3, 6.58], 0);
    cabinetNote.scale.set(0.24, 0.18, 1);
    cabinetNote.userData = cabinetHint;
    this.roomGroup.add(cabinetNote);
    this.interactiveObjects.push(cabinetNote);
  }

  addRoom4GameTiles() {
    const clueDefs = [
      { position: [6.6, 1.42, 6.94], rotation: 0, hitboxSize: [2.55, 1.2, 0.45] },
      { position: [6.6, 1.42, 5.26], rotation: Math.PI, hitboxSize: [2.55, 1.2, 0.45] },
      { position: [5.22, 1.42, 6.1], rotation: -Math.PI / 2, hitboxSize: [0.45, 1.2, 2.55] },
      { position: [7.98, 1.42, 6.1], rotation: Math.PI / 2, hitboxSize: [0.45, 1.2, 2.55] },
    ];

    for (const clueDef of clueDefs) {
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 0.78),
        new THREE.MeshBasicMaterial({
          color: 0xff5f5f,
          transparent: true,
          opacity: 0.38,
          side: THREE.DoubleSide,
        }),
      );
      glow.position.set(...clueDef.position);
      glow.rotation.y = clueDef.rotation;
      glow.material.side = THREE.FrontSide;
      glow.renderOrder = 4;
      glow.userData = { kind: "room4GameTiles", label: "Door Tiles" };
      this.roomGroup.add(glow);
      this.room4GameTileMeshes.push(glow);
      this.interactiveObjects.push(glow);

      const note = this.makeWordNote("G A M E", "#ff5f5f", clueDef.position, clueDef.rotation);
      note.scale.set(1.08, 0.5, 1);
      note.material.side = THREE.FrontSide;
      note.material.depthTest = true;
      note.material.depthWrite = true;
      note.renderOrder = 5;
      note.userData = { kind: "room4GameTiles", label: "Door Tiles" };
      this.roomGroup.add(note);
      this.room4GameTileMeshes.push(note);
      this.interactiveObjects.push(note);

      const hitbox = this.makeBox(clueDef.hitboxSize, 0xffffff);
      hitbox.position.set(...clueDef.position);
      hitbox.material.transparent = true;
      hitbox.material.opacity = 0;
      hitbox.material.depthWrite = false;
      hitbox.material.depthTest = false;
      hitbox.userData = { kind: "room4GameTiles", label: "Door Tiles" };
      this.roomGroup.add(hitbox);
      this.room4GameTileMeshes.push(hitbox);
      this.interactiveObjects.push(hitbox);
    }
  }

  clearRoom4ArrowPanels() {
    for (const panel of this.room4ArrowPanels) {
      const visiblePanel = panel.userData?.visualTarget || panel;
      if (visiblePanel.material?.emissive) {
        visiblePanel.material.emissive.setHex(0x000000);
        visiblePanel.material.emissiveIntensity = 0;
      }
    }
  }

  addPlayExitDoor() {
    const doorHint = { kind: "exitDoor", label: "Exit Door" };

    const frame = this.makeTexturedBox([1.9, 3.4, 0.34], "wood", {
      color: 0xffffff,
      roughness: 0.74,
      metalness: 0.05,
    });
    frame.position.set(9.62, 1.7, 6.0);
    this.roomGroup.add(frame);

    this.exitDoor = this.makeTexturedBox([1.5, 2.9, 0.18], "wood", {
      color: 0xc98752,
      roughness: 0.62,
      metalness: 0.04,
    });
    this.exitDoor.position.set(9.62, 1.45, 6.08);
    this.exitDoor.userData = doorHint;
    this.roomGroup.add(this.exitDoor);
    this.interactiveObjects.push(this.exitDoor);

    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xe1be76, roughness: 0.24, metalness: 0.88 }),
    );
    knob.position.set(10.14, 1.42, 6.18);
    knob.userData = doorHint;
    this.roomGroup.add(knob);
    this.interactiveObjects.push(knob);

    this.exitPanel = this.makeBox([0.22, 0.52, 0.12], 0xc9d8e8);
    this.exitPanel.position.set(9.05, 1.42, 6.18);
    this.exitPanel.userData = doorHint;
    this.roomGroup.add(this.exitPanel);
    this.interactiveObjects.push(this.exitPanel);

    const doorHitbox = this.makeBox([2.0, 3.2, 0.95], 0xffffff);
    doorHitbox.position.set(9.62, 1.55, 6.18);
    doorHitbox.material.transparent = true;
    doorHitbox.material.opacity = 0;
    doorHitbox.userData = doorHint;
    this.roomGroup.add(doorHitbox);
    this.interactiveObjects.push(doorHitbox);

    const note = this.makeWordNote("DOOR", "#ff6f6f", [9.62, 2.5, 6.22], 0);
    note.scale.set(0.32, 0.42, 1);
    note.userData = doorHint;
    this.roomGroup.add(note);
    this.interactiveObjects.push(note);
  }

  createPatternTexture(type) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");

    if (type === "wood") {
      context.fillStyle = "#6b503f";
      context.fillRect(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < 18; index += 1) {
        const y = index * 16;
        context.fillStyle = index % 2 === 0 ? "#7a5d49" : "#5f4738";
        context.fillRect(0, y, canvas.width, 16);
        context.strokeStyle = "rgba(40, 22, 15, 0.22)";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, y + 1);
        context.lineTo(canvas.width, y + 1);
        context.stroke();
      }
    } else if (type === "rug") {
      context.fillStyle = "#42538b";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#a9badc";
      context.lineWidth = 10;
      context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
      for (let index = 0; index < 10; index += 1) {
        context.fillStyle = index % 2 === 0 ? "rgba(230, 191, 123, 0.4)" : "rgba(255,255,255,0.08)";
        context.fillRect(0, index * 26, canvas.width, 10);
      }
    } else if (type === "wall") {
      context.fillStyle = "#dfded9";
      context.fillRect(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < 260; index += 1) {
        const shade = 220 + Math.floor(Math.random() * 18);
        context.fillStyle = `rgba(${shade}, ${shade - 3}, ${shade - 8}, 0.18)`;
        context.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 3, 3);
      }
    } else if (type === "speaker") {
      context.fillStyle = "#232830";
      context.fillRect(0, 0, canvas.width, canvas.height);
      for (let x = 0; x < canvas.width; x += 8) {
        for (let y = 0; y < canvas.height; y += 8) {
          context.fillStyle = (x + y) % 16 === 0 ? "#2e343c" : "#1b2026";
          context.fillRect(x, y, 5, 5);
        }
      }
    } else if (type === "fabric") {
      context.fillStyle = "#6c7fa3";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "rgba(255,255,255,0.08)";
      context.lineWidth = 2;
      for (let index = -8; index < 40; index += 1) {
        context.beginPath();
        context.moveTo(index * 10, 0);
        context.lineTo(index * 10 + 80, canvas.height);
        context.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(type === "wood" ? 6 : 3, type === "wood" ? 5 : 3);
    return texture;
  }

  makeTexturedBox(size, textureType, options = {}) {
    const material = new THREE.MeshStandardMaterial({
      color: options.color || 0xffffff,
      map: this.createPatternTexture(textureType),
      roughness: options.roughness ?? 0.7,
      metalness: options.metalness ?? 0.05,
    });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  makeGlossyBox(size, color, shininess = 90) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size[0], size[1], size[2]),
      new THREE.MeshPhongMaterial({ color, shininess, specular: 0x8a8f99 }),
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  addSheetMusicStand() {
    const standPole = this.makeBox([0.08, 1.3, 0.08], 0x7e8598);
    standPole.position.set(-2.2, 0.8, -3.2);
    standPole.userData = { kind: "sheetMusicClue", label: "Sheet Music Stand" };
    this.roomGroup.add(standPole);
    this.interactiveObjects.push(standPole);

    const standTop = this.makeBox([1.08, 0.68, 0.08], 0x2b3241);
    standTop.position.set(-2.2, 1.66, -3.2);
    standTop.rotation.x = -0.24;
    standTop.userData = { kind: "sheetMusicClue", label: "Sheet Music Stand" };
    this.roomGroup.add(standTop);
    this.interactiveObjects.push(standTop);

    const page = this.makeWordNote("RED\nBLUE\nYELLOW\nGREEN", "#f6f7ff", [-2.2, 1.66, -3.12], Math.PI);
    page.scale.set(0.7, 0.84, 1);
    page.rotation.x = -0.24;
    page.userData = { kind: "sheetMusicClue", label: "Sheet Music Stand" };
    this.roomGroup.add(page);
    this.interactiveObjects.push(page);

    const standBase = this.makeBox([0.64, 0.06, 0.64], 0x7e8598);
    standBase.position.set(-2.2, 0.12, -3.2);
    this.roomGroup.add(standBase);
  }

  addMusicRoomBoundaryFeatures() {
    const leftBooth = this.makeBox([0.9, 3.0, ROOM_DEPTH - 3.2], 0x4b435f);
    leftBooth.position.set(-HALF_WIDTH + 1.7, 1.5, 0);
    this.roomGroup.add(leftBooth);
    this.addSolid(leftBooth, 1.0, ROOM_DEPTH - 3.4, 1.5);

    const rightBooth = this.makeBox([0.9, 3.0, ROOM_DEPTH - 3.2], 0x4b435f);
    rightBooth.position.set(HALF_WIDTH - 1.7, 1.5, 0);
    this.roomGroup.add(rightBooth);
    this.addSolid(rightBooth, 1.0, ROOM_DEPTH - 3.4, 1.5);

    const backBooth = this.makeBox([ROOM_WIDTH - 4.2, 3.0, 0.9], 0x554c69);
    backBooth.position.set(0, 1.5, -HALF_DEPTH + 1.7);
    this.roomGroup.add(backBooth);
    this.addSolid(backBooth, ROOM_WIDTH - 4.4, 1.0, 1.5);

    const frontTrimLeft = this.makeBox([3.8, 2.2, 0.7], 0x5b5271);
    frontTrimLeft.position.set(-7.0, 1.1, HALF_DEPTH - 1.65);
    this.roomGroup.add(frontTrimLeft);
    this.addSolid(frontTrimLeft, 4.0, 0.9, 1.2);

    const frontTrimRight = this.makeBox([3.8, 2.2, 0.7], 0x5b5271);
    frontTrimRight.position.set(7.0, 1.1, HALF_DEPTH - 1.65);
    this.roomGroup.add(frontTrimRight);
    this.addSolid(frontTrimRight, 4.0, 0.9, 1.2);

    const ceilingBand = this.makeBox([ROOM_WIDTH - 4.4, 0.28, ROOM_DEPTH - 3.8], 0xe6e0f4);
    ceilingBand.position.set(0, 4.62, 0);
    this.roomGroup.add(ceilingBand);
  }

  addMusicRoomShell() {
    const floor = this.makeTexturedBox([ROOM_WIDTH, 0.35, ROOM_DEPTH], "wood", {
      color: 0xffffff,
      roughness: 0.72,
      metalness: 0.06,
    });
    floor.position.y = -0.18;
    floor.receiveShadow = true;
    this.roomGroup.add(floor);

    const stageRug = this.makeTexturedBox([8.2, 0.05, 5.4], "rug", {
      color: 0xffffff,
      roughness: 0.92,
      metalness: 0.02,
    });
    stageRug.position.set(0.8, 0.03, 0.4);
    stageRug.rotation.y = -0.08;
    this.roomGroup.add(stageRug);

    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_WIDTH, 0.35, ROOM_DEPTH),
      new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.95, metalness: 0.02 }),
    );
    ceiling.position.y = 5.2;
    this.roomGroup.add(ceiling);

    const wallDefs = [
      { size: [0.35, 5, ROOM_DEPTH], pos: [-HALF_WIDTH, 2.5, 0] },
      { size: [0.35, 5, ROOM_DEPTH], pos: [HALF_WIDTH, 2.5, 0] },
      { size: [ROOM_WIDTH, 5, 0.35], pos: [0, 2.5, -HALF_DEPTH] },
      { size: [ROOM_WIDTH, 5, 0.35], pos: [0, 2.5, HALF_DEPTH] },
    ];

    for (const wall of wallDefs) {
      const mesh = this.makeTexturedBox(wall.size, "wall", {
        color: this.currentRoomData.themeColor,
        roughness: 0.96,
        metalness: 0.01,
      });
      mesh.position.set(...wall.pos);
      this.roomGroup.add(mesh);
    }

    const baseTrimFront = this.makeBox([ROOM_WIDTH - 1.2, 0.18, 0.12], 0xffffff);
    baseTrimFront.material = new THREE.MeshStandardMaterial({ color: 0xf8f5ef, roughness: 0.7, metalness: 0.04 });
    baseTrimFront.position.set(0, 0.25, HALF_DEPTH - 0.18);
    this.roomGroup.add(baseTrimFront);

    const baseTrimBack = this.makeBox([ROOM_WIDTH - 1.2, 0.18, 0.12], 0xffffff);
    baseTrimBack.material = new THREE.MeshStandardMaterial({ color: 0xf8f5ef, roughness: 0.7, metalness: 0.04 });
    baseTrimBack.position.set(0, 0.25, -HALF_DEPTH + 0.18);
    this.roomGroup.add(baseTrimBack);

    for (let index = 0; index < 7; index += 1) {
      const plank = this.makeBox([0.16, 0.01, ROOM_DEPTH - 0.8], 0x7a624f);
      plank.position.set(-HALF_WIDTH + 1.2 + index * 3.35, -0.005, 0);
      plank.material.opacity = 0.35;
      plank.material.transparent = true;
      this.roomGroup.add(plank);
    }
  }

  addMusicWindowNook() {
    const windowFrame = this.makeBox([0.24, 2.5, 4.4], 0xf3eee5);
    windowFrame.position.set(-HALF_WIDTH + 0.22, 2.45, -1.2);
    windowFrame.material = new THREE.MeshStandardMaterial({ color: 0xf3eee5, roughness: 0.68, metalness: 0.03 });
    this.roomGroup.add(windowFrame);

    const windowGlow = this.makeBox([0.04, 2.1, 3.7], 0xd8ecff);
    windowGlow.position.set(-HALF_WIDTH + 0.36, 2.45, -1.2);
    windowGlow.material = new THREE.MeshPhongMaterial({
      color: 0xd7e9fb,
      transparent: true,
      opacity: 0.7,
      shininess: 120,
    });
    this.roomGroup.add(windowGlow);

    const mullionVertical = this.makeBox([0.05, 2.06, 0.06], 0xf6f1ea);
    mullionVertical.position.set(-HALF_WIDTH + 0.38, 2.45, -1.2);
    this.roomGroup.add(mullionVertical);

    const mullionHorizontal = this.makeBox([0.05, 0.06, 3.5], 0xf6f1ea);
    mullionHorizontal.position.set(-HALF_WIDTH + 0.38, 2.45, -1.2);
    this.roomGroup.add(mullionHorizontal);

    const curtainLeft = this.makeTexturedBox([0.16, 2.38, 0.92], "fabric", {
      color: 0xb98068,
      roughness: 0.94,
      metalness: 0.02,
    });
    curtainLeft.position.set(-HALF_WIDTH + 0.46, 2.4, -2.52);
    this.roomGroup.add(curtainLeft);

    const curtainRight = this.makeTexturedBox([0.16, 2.38, 0.92], "fabric", {
      color: 0xb98068,
      roughness: 0.94,
      metalness: 0.02,
    });
    curtainRight.position.set(-HALF_WIDTH + 0.46, 2.4, 0.12);
    this.roomGroup.add(curtainRight);
  }

  addMusicRoomLights() {
    const beamLeft = this.makeGlossyBox([0.42, 0.16, 0.16], 0xf0b66d, 120);
    beamLeft.position.set(-4.6, 4.5, -2.8);
    this.roomGroup.add(beamLeft);

    const beamMiddle = this.makeGlossyBox([0.42, 0.16, 0.16], 0x7fb4f6, 120);
    beamMiddle.position.set(0.0, 4.5, -2.4);
    this.roomGroup.add(beamMiddle);

    const beamRight = this.makeGlossyBox([0.42, 0.16, 0.16], 0xf59ab0, 120);
    beamRight.position.set(4.5, 4.5, -2.8);
    this.roomGroup.add(beamRight);

    const ceilingShade = this.makeBox([1.1, 0.22, 1.1], 0xf2ecdf);
    ceilingShade.position.set(0.0, 4.3, 0.0);
    ceilingShade.material = new THREE.MeshPhongMaterial({ color: 0xf2ecdf, shininess: 45, specular: 0x776e61 });
    this.roomGroup.add(ceilingShade);

    const ceilingBulb = this.makeGlossyBox([0.16, 0.24, 0.16], 0xffe0ac, 150);
    ceilingBulb.position.set(0.0, 4.0, 0.0);
    this.roomGroup.add(ceilingBulb);

    const lampShade = this.makeTexturedBox([0.86, 0.28, 0.86], "fabric", {
      color: 0xe9d7b8,
      roughness: 0.9,
      metalness: 0.01,
    });
    lampShade.position.set(-8.4, 2.8, 3.6);
    this.roomGroup.add(lampShade);

    const lampPole = this.makeBox([0.1, 2.3, 0.1], 0x786659);
    lampPole.material = new THREE.MeshStandardMaterial({ color: 0x786659, roughness: 0.4, metalness: 0.65 });
    lampPole.position.set(-8.4, 1.18, 3.6);
    this.roomGroup.add(lampPole);

    const cable = this.makeBox([0.04, 1.1, 0.04], 0x393d48);
    cable.position.set(-8.4, 3.72, 3.6);
    this.roomGroup.add(cable);

    const lampBase = this.makeBox([0.56, 0.06, 0.56], 0x786659);
    lampBase.material = new THREE.MeshStandardMaterial({ color: 0x786659, roughness: 0.45, metalness: 0.55 });
    lampBase.position.set(-8.4, 0.04, 3.6);
    this.roomGroup.add(lampBase);
  }

  addMusicWallDecor() {
    const posterLeft = this.makeWordNote("♪", "#d96f8b", [-4.8, 2.7, HALF_DEPTH - 0.26], Math.PI);
    posterLeft.scale.set(0.82, 1.08, 1);
    this.roomGroup.add(posterLeft);

    const posterMiddle = this.makeWordNote("♫", "#6f98e0", [0.0, 2.55, HALF_DEPTH - 0.26], Math.PI);
    posterMiddle.scale.set(0.95, 1.18, 1);
    this.roomGroup.add(posterMiddle);

    const posterRight = this.makeWordNote("♬", "#85c16e", [4.9, 2.7, HALF_DEPTH - 0.26], Math.PI);
    posterRight.scale.set(0.96, 1.08, 1);
    this.roomGroup.add(posterRight);

    for (let column = 0; column < 3; column += 1) {
      for (let row = 0; row < 4; row += 1) {
        const acousticLeft = this.makeBox([0.34, 0.34, 0.08], 0x5f566f);
        acousticLeft.position.set(-10.46 + column * 0.38, 1.34 + row * 0.42, -0.8);
        this.roomGroup.add(acousticLeft);

        const acousticRight = this.makeBox([0.34, 0.34, 0.08], 0x5f566f);
        acousticRight.position.set(9.84 + column * 0.38, 1.34 + row * 0.42, -0.6);
        this.roomGroup.add(acousticRight);
      }
    }

    for (let index = 0; index < 4; index += 1) {
      const wallRecord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.03, 20),
        new THREE.MeshStandardMaterial({ color: 0x181b22 }),
      );
      wallRecord.position.set(-1.8 + index * 1.1, 1.92 + (index % 2) * 0.64, -8.72);
      wallRecord.rotation.x = Math.PI / 2;
      this.roomGroup.add(wallRecord);

      const label = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: index % 2 === 0 ? 0xe1829e : 0x7db0e4 }),
      );
      label.position.copy(wallRecord.position);
      label.position.z += 0.01;
      label.rotation.x = Math.PI / 2;
      this.roomGroup.add(label);
    }

    const wallShelf = this.makeBox([2.2, 0.1, 0.24], 0x7c6353);
    wallShelf.position.set(5.7, 2.44, -8.68);
    this.roomGroup.add(wallShelf);

    for (let index = 0; index < 4; index += 1) {
      const book = this.makeTexturedBox([0.18, 0.62, 0.16], "fabric", {
        color: [0xd89a62, 0x79a9d4, 0x89bf75, 0xd2768f][index],
        roughness: 0.85,
        metalness: 0.02,
      });
      book.position.set(5.02 + index * 0.24, 2.8, -8.62 + (index % 2) * 0.02);
      book.rotation.z = -0.05 + index * 0.03;
      this.roomGroup.add(book);
    }

    const tinyPlantPot = this.makeBox([0.26, 0.2, 0.26], 0xa2775a);
    tinyPlantPot.position.set(6.56, 2.6, -8.62);
    this.roomGroup.add(tinyPlantPot);

    const tinyLeaf = this.makeBox([0.08, 0.34, 0.08], 0x6cab66);
    tinyLeaf.position.set(6.52, 2.84, -8.6);
    tinyLeaf.rotation.z = 0.32;
    this.roomGroup.add(tinyLeaf);
  }

  addPianoArea() {
    const pianoBase = this.makeGlossyBox([3.4, 1.0, 1.3], 0x1a1f28, 130);
    pianoBase.position.set(-5.6, 0.5, -4.9);
    this.roomGroup.add(pianoBase);
    this.addSolid(pianoBase, 3.8, 1.7, 0.9);

    const pianoTop = this.makeGlossyBox([3.28, 0.14, 1.16], 0x2a313d, 140);
    pianoTop.position.set(-5.6, 1.02, -4.9);
    this.roomGroup.add(pianoTop);

    const standLeft = this.makeBox([0.12, 0.84, 0.12], 0x99a0ad);
    standLeft.material = new THREE.MeshStandardMaterial({ color: 0x99a0ad, roughness: 0.28, metalness: 0.82 });
    standLeft.position.set(-6.84, 0.46, -5.08);
    standLeft.rotation.z = 0.24;
    this.roomGroup.add(standLeft);

    const standRight = this.makeBox([0.12, 0.84, 0.12], 0x99a0ad);
    standRight.material = new THREE.MeshStandardMaterial({ color: 0x99a0ad, roughness: 0.28, metalness: 0.82 });
    standRight.position.set(-4.36, 0.46, -5.08);
    standRight.rotation.z = -0.24;
    this.roomGroup.add(standRight);

    const crossStandLeft = this.makeBox([0.12, 0.84, 0.12], 0x99a0ad);
    crossStandLeft.material = new THREE.MeshStandardMaterial({ color: 0x99a0ad, roughness: 0.28, metalness: 0.82 });
    crossStandLeft.position.set(-5.02, 0.46, -5.08);
    crossStandLeft.rotation.z = 0.24;
    this.roomGroup.add(crossStandLeft);

    const crossStandRight = this.makeBox([0.12, 0.84, 0.12], 0x99a0ad);
    crossStandRight.material = new THREE.MeshStandardMaterial({ color: 0x99a0ad, roughness: 0.28, metalness: 0.82 });
    crossStandRight.position.set(-6.18, 0.46, -5.08);
    crossStandRight.rotation.z = -0.24;
    this.roomGroup.add(crossStandRight);

    const colorKeyMap = {
      0: { colorName: "red", colorHex: 0xe35656 },
      2: { colorName: "blue", colorHex: 0x5f84e9 },
      4: { colorName: "yellow", colorHex: 0xf0d55f },
      6: { colorName: "green", colorHex: 0x67c86e },
    };

    for (let index = 0; index < 8; index += 1) {
      const colorKey = colorKeyMap[index];
      const whiteKey = this.makeBox([0.34, 0.06, 0.62], 0xfafafa);
      whiteKey.position.set(-6.74 + index * 0.33, 1.06, -4.56);
      if (colorKey) {
        whiteKey.material.color.setHex(colorKey.colorHex);
      }
      this.roomGroup.add(whiteKey);

      if (colorKey) {
        const keyHitbox = this.makeBox([0.42, 0.22, 0.92], 0xffffff);
        keyHitbox.position.set(whiteKey.position.x, 1.12, -4.5);
        keyHitbox.material.transparent = true;
        keyHitbox.material.opacity = 0;
        keyHitbox.userData = {
          kind: "pianoKey",
          colorName: colorKey.colorName,
          label: `${colorKey.colorName[0].toUpperCase()}${colorKey.colorName.slice(1)} Piano Key`,
          hint: `${colorKey.colorName[0].toUpperCase()}${colorKey.colorName.slice(1)} key`,
        };
        this.roomGroup.add(keyHitbox);
        this.interactiveObjects.push(keyHitbox);
        this.musicPianoKeys.push(whiteKey, keyHitbox);
      }
    }

    for (let index = 0; index < 5; index += 1) {
      const blackKey = this.makeBox([0.14, 0.08, 0.34], 0x11151d);
      blackKey.position.set(-6.42 + index * 0.5, 1.1, -4.68);
      this.roomGroup.add(blackKey);
    }

    for (let index = 0; index < 3; index += 1) {
      const pedal = this.makeBox([0.08, 0.04, 0.16], 0xd8b66a);
      pedal.position.set(-5.92 + index * 0.22, 0.08, -4.34);
      this.roomGroup.add(pedal);
    }
  }

  addSpeakerStack() {
    const leftSpeaker = this.makeTexturedBox([0.9, 2.6, 0.9], "speaker", {
      color: 0xffffff,
      roughness: 0.88,
      metalness: 0.08,
    });
    leftSpeaker.position.set(-10.0, 1.3, -5.1);
    leftSpeaker.userData = { kind: "hint", hint: "These speakers look powerful." };
    this.roomGroup.add(leftSpeaker);
    this.addSolid(leftSpeaker, 1.2, 1.2, 1.3);
    this.interactiveObjects.push(leftSpeaker);

    const rightSpeaker = this.makeTexturedBox([0.9, 2.6, 0.9], "speaker", {
      color: 0xffffff,
      roughness: 0.88,
      metalness: 0.08,
    });
    rightSpeaker.position.set(8.9, 1.3, -5.1);
    rightSpeaker.userData = { kind: "hint", hint: "These speakers look powerful." };
    this.roomGroup.add(rightSpeaker);
    this.addSolid(rightSpeaker, 1.2, 1.2, 1.3);
    this.interactiveObjects.push(rightSpeaker);

    const coneLeft = this.makeBox([0.42, 0.42, 0.04], 0x6c75a6);
    coneLeft.position.set(-10.0, 1.7, -4.62);
    this.roomGroup.add(coneLeft);

    const coneRight = this.makeBox([0.42, 0.42, 0.04], 0x6c75a6);
    coneRight.position.set(8.9, 1.7, -4.62);
    this.roomGroup.add(coneRight);

    const tweeterLeft = this.makeBox([0.18, 0.18, 0.04], 0xb5bfd3);
    tweeterLeft.position.set(-10.0, 2.4, -4.62);
    this.roomGroup.add(tweeterLeft);

    const tweeterRight = this.makeBox([0.18, 0.18, 0.04], 0xb5bfd3);
    tweeterRight.position.set(8.9, 2.4, -4.62);
    this.roomGroup.add(tweeterRight);

    const leftLed = this.makeGlossyBox([0.12, 0.04, 0.02], 0x6fe6f0, 180);
    leftLed.position.set(-10.0, 0.64, -4.54);
    this.roomGroup.add(leftLed);

    const rightLed = this.makeGlossyBox([0.12, 0.04, 0.02], 0x6fe6f0, 180);
    rightLed.position.set(8.9, 0.64, -4.54);
    this.roomGroup.add(rightLed);
  }

  addMixingConsole() {
    this.mixingConsoleDesk = this.makeTexturedBox([2.8, 0.96, 1.32], "wood", {
      color: 0xffffff,
      roughness: 0.72,
      metalness: 0.08,
    });
    this.mixingConsoleDesk.position.set(5.2, 0.48, 3.0);
    this.mixingConsoleDesk.userData = { kind: "mixingConsole", label: "Mixing Console" };
    this.addSolid(this.mixingConsoleDesk, 3.2, 1.7, 0.86);
    this.roomGroup.add(this.mixingConsoleDesk);
    this.interactiveObjects.push(this.mixingConsoleDesk);

    this.mixingConsoleTop = this.makeGlossyBox([2.42, 0.16, 1.08], 0x39404f, 95);
    this.mixingConsoleTop.position.set(5.2, 1.02, 3.0);
    this.mixingConsoleTop.rotation.x = -0.22;
    this.mixingConsoleTop.userData = { kind: "mixingConsole", label: "Mixing Console" };
    this.roomGroup.add(this.mixingConsoleTop);
    this.interactiveObjects.push(this.mixingConsoleTop);

    for (let index = 0; index < 6; index += 1) {
      const slider = this.makeBox([0.08, 0.04, 0.36], 0xe8ebf5);
      slider.position.set(4.38 + index * 0.28, 1.12, 2.9);
      slider.rotation.x = -0.22;
      this.roomGroup.add(slider);
    }

    for (let index = 0; index < 8; index += 1) {
      const knob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: index % 2 === 0 ? 0xd2dae7 : 0xf0b86a }),
      );
      knob.position.set(4.26 + index * 0.23, 1.18, 3.18);
      knob.rotation.x = Math.PI / 2 - 0.22;
      this.roomGroup.add(knob);
    }

    this.mixingConsoleMeter = this.makeBox([0.46, 0.16, 0.05], 0x4d5a52);
    this.mixingConsoleMeter.position.set(6.06, 1.2, 3.14);
    this.mixingConsoleMeter.rotation.x = -0.22;
    this.mixingConsoleMeter.userData = { kind: "mixingConsole", label: "Mixing Console" };
    this.roomGroup.add(this.mixingConsoleMeter);
    this.interactiveObjects.push(this.mixingConsoleMeter);
  }

  addDrumSet() {
    const drumBase = this.makeBox([2.6, 0.04, 2.0], 0x5b4d7f);
    drumBase.position.set(3.0, 0.03, -2.7);
    this.roomGroup.add(drumBase);

    const kick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.58, 0.58, 0.82, 18),
      new THREE.MeshStandardMaterial({ color: 0xc95f5f }),
    );
    kick.position.set(3.0, 0.68, -2.7);
    kick.rotation.z = Math.PI / 2;
    kick.userData = { kind: "drumPad", drumName: "kick", label: "Kick" };
    kick.castShadow = true;
    kick.receiveShadow = true;
    this.roomGroup.add(kick);
    this.interactiveObjects.push(kick);
    this.addSolid(kick, 2.0, 1.6, 0.8);

    const kickHitbox = this.makeBox([1.3, 1.05, 1.1], 0xffffff);
    kickHitbox.position.set(3.0, 0.86, -2.68);
    kickHitbox.material.transparent = true;
    kickHitbox.material.opacity = 0;
    kickHitbox.userData = { kind: "drumPad", drumName: "kick", label: "Kick" };
    this.roomGroup.add(kickHitbox);
    this.interactiveObjects.push(kickHitbox);

    const snare = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.28, 16),
      new THREE.MeshStandardMaterial({ color: 0x6ca7d8 }),
    );
    snare.position.set(2.18, 1.04, -2.08);
    snare.userData = { kind: "drumPad", drumName: "snare", label: "Snare" };
    snare.castShadow = true;
    snare.receiveShadow = true;
    this.roomGroup.add(snare);
    this.interactiveObjects.push(snare);

    const snareHitbox = this.makeBox([0.9, 0.78, 0.8], 0xffffff);
    snareHitbox.position.set(2.18, 1.08, -2.08);
    snareHitbox.material.transparent = true;
    snareHitbox.material.opacity = 0;
    snareHitbox.userData = { kind: "drumPad", drumName: "snare", label: "Snare" };
    this.roomGroup.add(snareHitbox);
    this.interactiveObjects.push(snareHitbox);

    const floorTom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.42, 16),
      new THREE.MeshStandardMaterial({ color: 0x6ca7d8 }),
    );
    floorTom.position.set(3.94, 0.98, -2.06);
    floorTom.userData = { kind: "drumPad", drumName: "floorTom", label: "Floor Tom" };
    floorTom.castShadow = true;
    floorTom.receiveShadow = true;
    this.roomGroup.add(floorTom);
    this.interactiveObjects.push(floorTom);

    const floorTomHitbox = this.makeBox([1.0, 0.92, 0.9], 0xffffff);
    floorTomHitbox.position.set(3.94, 1.0, -2.06);
    floorTomHitbox.material.transparent = true;
    floorTomHitbox.material.opacity = 0;
    floorTomHitbox.userData = { kind: "drumPad", drumName: "floorTom", label: "Floor Tom" };
    this.roomGroup.add(floorTomHitbox);
    this.interactiveObjects.push(floorTomHitbox);

    const hiHat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.03, 20),
      new THREE.MeshStandardMaterial({ color: 0xdcb96b }),
    );
    hiHat.position.set(1.88, 1.38, -2.72);
    hiHat.userData = { kind: "hint", hint: "A drum set waits for a rhythm puzzle later." };
    this.roomGroup.add(hiHat);
    this.interactiveObjects.push(hiHat);
    const hiHatStand = this.makeBox([0.06, 1.0, 0.06], 0xbfc7d3);
    hiHatStand.position.set(1.88, 0.82, -2.72);
    this.roomGroup.add(hiHatStand);

    const crash = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.34, 0.03, 20),
      new THREE.MeshStandardMaterial({ color: 0xe0c77c }),
    );
    crash.position.set(3.92, 1.56, -3.16);
    crash.rotation.z = 0.18;
    crash.userData = { kind: "hint", hint: "A drum set waits for a rhythm puzzle later." };
    this.roomGroup.add(crash);
    this.interactiveObjects.push(crash);
    const crashStand = this.makeBox([0.06, 1.14, 0.06], 0xbfc7d3);
    crashStand.position.set(3.92, 0.98, -3.16);
    this.roomGroup.add(crashStand);

    const ride = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.03, 20),
      new THREE.MeshStandardMaterial({ color: 0xd8b96a }),
    );
    ride.position.set(3.98, 1.42, -2.08);
    ride.rotation.z = -0.12;
    ride.userData = { kind: "hint", hint: "A drum set waits for a rhythm puzzle later." };
    this.roomGroup.add(ride);
    this.interactiveObjects.push(ride);
    const rideStand = this.makeBox([0.06, 1.02, 0.06], 0xbfc7d3);
    rideStand.position.set(3.98, 0.88, -2.08);
    this.roomGroup.add(rideStand);

    const stool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.28, 0.18, 16),
      new THREE.MeshStandardMaterial({ color: 0x252934 }),
    );
    stool.position.set(3.0, 0.46, -1.38);
    stool.userData = { kind: "hint", hint: "A drum stool sits behind the kit." };
    this.roomGroup.add(stool);
    this.interactiveObjects.push(stool);
  }

  addGuitarArea() {
    const addStringInstrument = (x, y, z, bodyColor, scale, hint, type = "guitar") => {
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: bodyColor });
      const accentMaterial = new THREE.MeshStandardMaterial({ color: 0x2a1e18 });
      const stringCount = type === "violin" ? 4 : type === "ukulele" ? 4 : 6;
      const neckHeight = type === "violin" ? 0.78 * scale : 1.05 * scale;
      const headHeight = type === "violin" ? 0.16 * scale : 0.22 * scale;
      const bodyDepth = type === "violin" ? 0.2 : 0.24;

      const lowerBody = new THREE.Mesh(new THREE.SphereGeometry(0.28 * scale, 20, 20), bodyMaterial);
      lowerBody.position.set(x, y, z);
      lowerBody.scale.set(1.2, 1.38, bodyDepth);
      lowerBody.userData = { kind: "hint", hint };
      lowerBody.castShadow = true;
      this.roomGroup.add(lowerBody);
      this.interactiveObjects.push(lowerBody);

      const upperLeft = new THREE.Mesh(new THREE.SphereGeometry(0.18 * scale, 18, 18), bodyMaterial);
      upperLeft.position.set(x - 0.13 * scale, y + 0.34 * scale, z);
      upperLeft.scale.set(0.96, 1.1, bodyDepth);
      upperLeft.userData = { kind: "hint", hint };
      upperLeft.castShadow = true;
      this.roomGroup.add(upperLeft);
      this.interactiveObjects.push(upperLeft);

      const upperRight = new THREE.Mesh(new THREE.SphereGeometry(0.18 * scale, 18, 18), bodyMaterial);
      upperRight.position.set(x + 0.13 * scale, y + 0.34 * scale, z);
      upperRight.scale.set(0.96, 1.1, bodyDepth);
      upperRight.userData = { kind: "hint", hint };
      upperRight.castShadow = true;
      this.roomGroup.add(upperRight);
      this.interactiveObjects.push(upperRight);

      const waist = this.makeBox([0.14 * scale, 0.26 * scale, 0.08], bodyColor);
      waist.position.set(x, y + 0.18 * scale, z);
      waist.userData = { kind: "hint", hint };
      this.roomGroup.add(waist);
      this.interactiveObjects.push(waist);

      const soundBoard = this.makeBox([0.38 * scale, 0.7 * scale, 0.02], 0xf2d29d);
      soundBoard.position.set(x, y + 0.12 * scale, z - 0.085);
      this.roomGroup.add(soundBoard);

      const bridge = this.makeBox([0.12 * scale, 0.04 * scale, 0.03], 0x4f3629);
      bridge.position.set(x, y - 0.02 * scale, z - 0.096);
      this.roomGroup.add(bridge);

      const soundHole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055 * scale, 0.055 * scale, 0.03, 18),
        accentMaterial,
      );
      soundHole.position.set(x, y + 0.16 * scale, z - 0.098);
      soundHole.rotation.x = Math.PI / 2;
      this.roomGroup.add(soundHole);

      if (type === "violin") {
        const fHoleLeft = this.makeBox([0.018, 0.14 * scale, 0.02], 0x1a1614);
        fHoleLeft.position.set(x - 0.07 * scale, y + 0.12 * scale, z - 0.098);
        this.roomGroup.add(fHoleLeft);

        const fHoleRight = this.makeBox([0.018, 0.14 * scale, 0.02], 0x1a1614);
        fHoleRight.position.set(x + 0.07 * scale, y + 0.12 * scale, z - 0.098);
        this.roomGroup.add(fHoleRight);
      }

      const neck = this.makeBox([0.08 * scale, neckHeight, 0.06], type === "violin" ? 0x3c2b23 : 0x7a5a3c);
      neck.position.set(x, y + 0.74 * scale, z);
      neck.userData = { kind: "hint", hint };
      this.roomGroup.add(neck);
      this.interactiveObjects.push(neck);

      const fretBoard = this.makeBox([0.05 * scale, neckHeight * 0.92, 0.02], 0x1a1c22);
      fretBoard.position.set(x, y + 0.76 * scale, z - 0.04);
      this.roomGroup.add(fretBoard);

      if (type !== "violin") {
        for (let index = 0; index < 5; index += 1) {
          const fret = this.makeBox([0.1 * scale, 0.008, 0.012], 0xd8dde6);
          fret.position.set(x, y + 0.48 * scale + index * 0.14 * scale, z - 0.046);
          this.roomGroup.add(fret);
        }
      }

      const head = this.makeBox([0.16 * scale, headHeight, 0.08], 0x654a31);
      head.position.set(x, y + 1.32 * scale, z);
      head.userData = { kind: "hint", hint };
      this.roomGroup.add(head);
      this.interactiveObjects.push(head);

      for (let index = 0; index < stringCount; index += 1) {
        const offset = ((index / (stringCount - 1 || 1)) - 0.5) * 0.1 * scale;
        const string = this.makeBox([0.006, 1.12 * scale, 0.006], 0xe8ebef);
        string.position.set(x + offset, y + 0.7 * scale, z - 0.104);
        this.roomGroup.add(string);
      }

      for (let index = 0; index < 2; index += 1) {
        const pegLeft = this.makeBox([0.04 * scale, 0.018, 0.018], 0xe3d2ab);
        pegLeft.position.set(x - 0.09 * scale, y + 1.3 * scale + index * 0.07 * scale, z - 0.04);
        this.roomGroup.add(pegLeft);

        const pegRight = this.makeBox([0.04 * scale, 0.018, 0.018], 0xe3d2ab);
        pegRight.position.set(x + 0.09 * scale, y + 1.3 * scale + index * 0.07 * scale, z - 0.04);
        this.roomGroup.add(pegRight);
      }
    };

    addStringInstrument(-9.0, 1.82, 5.2, 0xe2a14d, 1.0, "A guitar hangs on the wall.");
    addStringInstrument(-7.88, 1.76, 5.16, 0xb56ad1, 0.72, "A ukulele hangs beside the guitar.");
    addStringInstrument(-6.96, 1.7, 5.16, 0xc9824d, 0.62, "A violin hangs on the wall.", "violin");

    const wallRail = this.makeBox([3.2, 0.08, 0.12], 0x5b6275);
    wallRail.position.set(-7.96, 3.22, 5.18);
    this.roomGroup.add(wallRail);

    const stand = this.makeBox([3.0, 0.12, 0.34], 0x2d3340);
    stand.position.set(-7.96, 0.12, 5.2);
    this.roomGroup.add(stand);

    const pick = new THREE.Mesh(
      new THREE.CircleGeometry(0.12, 18),
      new THREE.MeshStandardMaterial({ color: 0xf0c64f }),
    );
    pick.position.set(-8.42, 0.34, 5.34);
    pick.rotation.y = Math.PI / 2;
    pick.userData = { kind: "hint", hint: "A guitar pick rests near the instruments." };
    pick.castShadow = true;
    this.roomGroup.add(pick);
    this.interactiveObjects.push(pick);

    const bowStick = this.makeBox([0.04, 1.28, 0.04], 0x7a5b40);
    bowStick.position.set(-6.34, 1.04, 5.3);
    bowStick.rotation.z = -0.28;
    bowStick.userData = { kind: "hint", hint: "A violin bow leans near the violin." };
    this.roomGroup.add(bowStick);
    this.interactiveObjects.push(bowStick);

    const bowHair = this.makeBox([0.012, 1.16, 0.012], 0xf0f0e6);
    bowHair.position.set(-6.28, 1.0, 5.34);
    bowHair.rotation.z = -0.28;
    this.roomGroup.add(bowHair);

    const stringMarkerDefs = [
      { number: 1, x: -8.68, y: 2.34, color: 0xf1b26b },
      { number: 2, x: -8.88, y: 2.12, color: 0x78aedf },
      { number: 3, x: -9.08, y: 1.9, color: 0xd88ac0 },
      { number: 4, x: -9.28, y: 1.68, color: 0x8fd776 },
    ];

    for (const markerDef of stringMarkerDefs) {
      const marker = this.makeBox([0.14, 0.14, 0.08], markerDef.color);
      marker.position.set(markerDef.x, markerDef.y, 5.02);
      marker.userData = {
        kind: "guitarString",
        stringNumber: markerDef.number,
        label: `String ${markerDef.number}`,
      };
      this.roomGroup.add(marker);
      this.interactiveObjects.push(marker);

      const markerLabel = this.makeWordNote(String(markerDef.number), "#ffffff", [markerDef.x, markerDef.y + 0.18, 4.98], 0);
      markerLabel.scale.set(0.2, 0.28, 1);
      markerLabel.userData = {
        kind: "guitarString",
        stringNumber: markerDef.number,
        label: `String ${markerDef.number}`,
      };
      this.roomGroup.add(markerLabel);
      this.interactiveObjects.push(markerLabel);
    }
  }

  addAmpAndBench() {
    const amp = this.makeBox([1.3, 1.3, 0.72], 0x2d313b);
    amp.position.set(-1.8, 0.66, -5.3);
    amp.userData = { kind: "hint", hint: "A guitar amp hums softly." };
    this.roomGroup.add(amp);
    this.addSolid(amp, 1.55, 1.0, 0.8);
    this.interactiveObjects.push(amp);

    const ampCloth = this.makeBox([0.98, 0.74, 0.05], 0x4a5672);
    ampCloth.position.set(-1.8, 0.72, -4.92);
    this.roomGroup.add(ampCloth);

    const ampKnobRow = this.makeBox([0.84, 0.1, 0.05], 0xb9c2d2);
    ampKnobRow.position.set(-1.8, 1.08, -4.91);
    this.roomGroup.add(ampKnobRow);

    for (let index = 0; index < 4; index += 1) {
      const knob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.03, 16),
        new THREE.MeshStandardMaterial({ color: 0xe6e8ee }),
      );
      knob.position.set(-2.08 + index * 0.18, 1.1, -4.88);
      knob.rotation.x = Math.PI / 2;
      this.roomGroup.add(knob);
    }

    const bench = this.makeBox([1.72, 0.46, 0.72], 0x8e6650);
    bench.position.set(-3.9, 0.26, -3.9);
    bench.userData = { kind: "hint", hint: "A bench sits near the piano." };
    this.roomGroup.add(bench);
    this.addSolid(bench, 2.0, 1.0, 0.5);
    this.interactiveObjects.push(bench);

    const micStandPole = this.makeBox([0.08, 1.72, 0.08], 0x8993a3);
    micStandPole.position.set(0.4, 0.9, -3.9);
    micStandPole.userData = { kind: "hint", hint: "A microphone stand is ready for singing." };
    this.roomGroup.add(micStandPole);
    this.interactiveObjects.push(micStandPole);

    const micTop = this.makeBox([0.24, 0.12, 0.12], 0xc0c9d6);
    micTop.position.set(0.58, 1.7, -3.9);
    micTop.userData = { kind: "hint", hint: "A microphone stand is ready for singing." };
    this.roomGroup.add(micTop);
    this.interactiveObjects.push(micTop);
  }

  addRecordPlayerStation() {
    const table = this.makeBox([1.8, 0.82, 1.0], 0x83604c);
    table.position.set(8.1, 0.42, 5.6);
    table.userData = { kind: "hint", hint: "A record player sits on this table." };
    this.roomGroup.add(table);
    this.addSolid(table, 2.1, 1.4, 0.82);

    this.recordPlayerBase = this.makeBox([1.18, 0.18, 0.86], 0x2a3040);
    this.recordPlayerBase.position.set(8.1, 0.94, 5.6);
    this.recordPlayerBase.userData = { kind: "recordPlayer" };
    this.roomGroup.add(this.recordPlayerBase);
    this.interactiveObjects.push(this.recordPlayerBase);

    this.recordPlayerLid = this.makeBox([1.18, 0.08, 0.86], 0x95b2d7);
    this.recordPlayerLid.position.set(8.1, 1.12, 5.6);
    this.recordPlayerLid.userData = { kind: "recordPlayer" };
    this.roomGroup.add(this.recordPlayerLid);
    this.interactiveObjects.push(this.recordPlayerLid);

    this.recordPlayerHitbox = this.makeBox([1.54, 0.82, 1.18], 0xffffff);
    this.recordPlayerHitbox.position.set(8.1, 1.16, 5.6);
    this.recordPlayerHitbox.material.transparent = true;
    this.recordPlayerHitbox.material.opacity = 0;
    this.recordPlayerHitbox.userData = { kind: "recordPlayer" };
    this.roomGroup.add(this.recordPlayerHitbox);
    this.interactiveObjects.push(this.recordPlayerHitbox);

    const leftLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.08, 0.06),
      new THREE.MeshStandardMaterial({
        color: 0x6e7a88,
        emissive: 0x101318,
        emissiveIntensity: 1.2,
        roughness: 0.26,
        metalness: 0.35,
      }),
    );
    leftLed.position.set(7.68, 1.0, 5.14);
    leftLed.castShadow = true;
    this.roomGroup.add(leftLed);

    const middleLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.08, 0.06),
      new THREE.MeshStandardMaterial({
        color: 0x6e7a88,
        emissive: 0x101318,
        emissiveIntensity: 1.2,
        roughness: 0.26,
        metalness: 0.35,
      }),
    );
    middleLed.position.set(8.08, 1.0, 5.14);
    middleLed.castShadow = true;
    this.roomGroup.add(middleLed);

    const rightLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.08, 0.06),
      new THREE.MeshStandardMaterial({
        color: 0x6e7a88,
        emissive: 0x101318,
        emissiveIntensity: 1.2,
        roughness: 0.26,
        metalness: 0.35,
      }),
    );
    rightLed.position.set(8.48, 1.0, 5.14);
    rightLed.castShadow = true;
    this.roomGroup.add(rightLed);

    this.musicLightBeams = [leftLed, middleLed, rightLed];

    const record = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.03, 20),
      new THREE.MeshStandardMaterial({ color: 0x131722 }),
    );
    record.position.set(7.92, 1.05, 5.6);
    this.roomGroup.add(record);

    const platterArm = this.makeBox([0.42, 0.04, 0.04], 0xcfd6df);
    platterArm.position.set(8.34, 1.08, 5.46);
    platterArm.rotation.z = -0.42;
    this.roomGroup.add(platterArm);

    const needleHead = this.makeBox([0.08, 0.06, 0.08], 0xe2ab63);
    needleHead.position.set(8.47, 1.0, 5.34);
    this.roomGroup.add(needleHead);
  }

  addVinylRecord() {
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.03, 20),
      new THREE.MeshStandardMaterial({ color: 0x161a24 }),
    );
    disc.position.set(7.92, 1.0, 5.6);
    disc.userData = { kind: "collectItem", itemId: "vinylRecord" };
    this.roomGroup.add(disc);

    const label = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.032, 18),
      new THREE.MeshStandardMaterial({ color: 0xe58ba0 }),
    );
    label.position.set(7.92, 1.02, 5.6);
    label.userData = { kind: "collectItem", itemId: "vinylRecord" };
    this.roomGroup.add(label);

    const hitbox = this.makeBox([1.3, 0.52, 1.1], 0xffffff);
    hitbox.position.set(8.04, 1.04, 5.58);
    hitbox.material.transparent = true;
    hitbox.material.opacity = 0;
    hitbox.userData = { kind: "collectItem", itemId: "vinylRecord" };
    this.roomGroup.add(hitbox);

    this.registerCollectible("vinylRecord", [disc, label, hitbox]);
  }

  addPlayingRecordVisual() {
    if (this.recordPlayerRecordVisual) {
      return;
    }

    this.recordPlayerRecordVisual = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.03, 20),
      new THREE.MeshStandardMaterial({ color: 0x11141c }),
    );
    this.recordPlayerRecordVisual.position.set(7.92, 1.05, 5.6);
    this.roomGroup.add(this.recordPlayerRecordVisual);

    const label = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.032, 18),
      new THREE.MeshStandardMaterial({ color: 0x7fb0e8 }),
    );
    label.position.set(7.92, 1.07, 5.6);
    this.roomGroup.add(label);
  }

  addBeatTiles() {
    if (this.state.beatTilesShown) {
      return;
    }

    this.state.beatTilesShown = true;
    const letters = ["B", "E", "A", "T"];
    const startX = 8.1;
    const y = 1.78;
    const z = -0.74;

    for (let index = 0; index < letters.length; index += 1) {
      const tile = this.makeBox([0.72, 0.08, 0.72], 0xf3e2bb);
      tile.position.set(startX + index * 0.62, y, z);
      tile.userData = { kind: "beatTiles" };
      this.roomGroup.add(tile);
      this.interactiveObjects.push(tile);
      this.beatTileMeshes.push(tile);

      const letter = this.makeWordNote(
        letters[index],
        "#37414e",
        [startX + index * 0.62, y + 0.44, z + 0.08],
        0,
      );
      letter.scale.set(0.82, 1.28, 1);
      letter.userData = { kind: "beatTiles" };
      this.roomGroup.add(letter);
      this.interactiveObjects.push(letter);
      this.beatTileMeshes.push(letter);
    }

    const clueBar = this.makeBox([3.4, 0.08, 0.32], 0x7f654f);
    clueBar.position.set(9.03, 1.26, z);
    clueBar.userData = { kind: "beatTiles" };
    this.roomGroup.add(clueBar);
    this.interactiveObjects.push(clueBar);
    this.beatTileMeshes.push(clueBar);

    const bigClue = this.makeWordNote("BEAT", "#d94d4d", [9.68, 2.34, 0.56], -0.82);
    bigClue.scale.set(1.12, 1.52, 1);
    bigClue.userData = { kind: "beatTiles" };
    this.roomGroup.add(bigClue);
    this.interactiveObjects.push(bigClue);
    this.beatTileMeshes.push(bigClue);
  }

  addRecordShelf() {
    const shelf = this.makeTexturedBox([2.4, 1.64, 0.56], "wood", {
      color: 0xffffff,
      roughness: 0.76,
      metalness: 0.06,
    });
    shelf.position.set(6.0, 0.82, 5.55);
    shelf.userData = { kind: "hint", hint: "A shelf is packed with records and music books." };
    this.roomGroup.add(shelf);
    this.addSolid(shelf, 2.7, 0.9, 0.9);
    this.interactiveObjects.push(shelf);

    const dividerOne = this.makeBox([0.08, 1.44, 0.5], 0x5d493f);
    dividerOne.position.set(5.24, 0.82, 5.55);
    this.roomGroup.add(dividerOne);

    const dividerTwo = this.makeBox([0.08, 1.44, 0.5], 0x5d493f);
    dividerTwo.position.set(6.0, 0.82, 5.55);
    this.roomGroup.add(dividerTwo);

    const dividerThree = this.makeBox([0.08, 1.44, 0.5], 0x5d493f);
    dividerThree.position.set(6.76, 0.82, 5.55);
    this.roomGroup.add(dividerThree);

    const colors = [0xd76f8e, 0x6a95db, 0x8dc26a, 0xe0b15f, 0xad80d3, 0x66b4c8];
    for (let index = 0; index < 6; index += 1) {
      const record = this.makeBox([0.22, 0.86, 0.04], colors[index]);
      record.position.set(5.12 + index * 0.28, 0.74, 5.34);
      this.roomGroup.add(record);
    }

    const bookOne = this.makeBox([0.24, 0.46, 0.12], 0xf0d58a);
    bookOne.position.set(6.92, 1.18, 5.46);
    this.roomGroup.add(bookOne);

    const bookTwo = this.makeBox([0.2, 0.4, 0.12], 0x88b0d8);
    bookTwo.position.set(6.62, 1.15, 5.46);
    this.roomGroup.add(bookTwo);

    for (let index = 0; index < 3; index += 1) {
      const stackedRecord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.03, 18),
        new THREE.MeshStandardMaterial({ color: 0x151922, roughness: 0.42, metalness: 0.18 }),
      );
      stackedRecord.position.set(5.18, 1.48 + index * 0.04, 5.54);
      stackedRecord.rotation.x = Math.PI / 2;
      this.roomGroup.add(stackedRecord);
    }
  }

  addMusicDrawer() {
    this.musicDrawerBody = this.makeBox([1.4, 0.96, 0.94], 0x9a7056);
    this.musicDrawerBody.position.set(-7.6, 0.48, 4.6);
    this.musicDrawerBody.userData = { kind: "musicDrawer", label: "Small Drawer" };
    this.addSolid(this.musicDrawerBody, 1.7, 1.2, 0.84);
    this.roomGroup.add(this.musicDrawerBody);
    this.interactiveObjects.push(this.musicDrawerBody);

    this.musicDrawerFront = this.makeBox([1.18, 0.42, 0.06], 0xbe8a67);
    this.musicDrawerFront.position.set(-7.6, 0.56, 4.15);
    this.musicDrawerFront.userData = { kind: "musicDrawer", label: "Small Drawer" };
    this.roomGroup.add(this.musicDrawerFront);
    this.interactiveObjects.push(this.musicDrawerFront);

    const knob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0xe8d7a4 }),
    );
    knob.position.set(-7.6, 0.56, 4.12);
    knob.rotation.x = Math.PI / 2;
    knob.userData = { kind: "musicDrawer", label: "Small Drawer" };
    this.roomGroup.add(knob);
    this.interactiveObjects.push(knob);
  }

  addMusicFinalCabinet() {
    this.finalCabinetBody = this.makeBox([2.2, 3.3, 1.2], 0x7e6252);
    this.finalCabinetBody.position.set(9.0, 1.65, -0.6);
    this.finalCabinetBody.userData = { kind: "finalCabinet" };
    this.roomGroup.add(this.finalCabinetBody);
    this.addSolid(this.finalCabinetBody, 2.5, 1.55, 1.8);
    this.interactiveObjects.push(this.finalCabinetBody);

    this.finalCabinetDoor = this.makeBox([1.84, 2.92, 0.06], 0xa98774);
    this.finalCabinetDoor.position.set(9.0, 1.65, -0.02);
    this.finalCabinetDoor.userData = { kind: "finalCabinet" };
    this.roomGroup.add(this.finalCabinetDoor);
    this.interactiveObjects.push(this.finalCabinetDoor);

    const buttonDefs = [
      { colorName: "blue", colorHex: 0x6a9be8, y: 2.55 },
      { colorName: "red", colorHex: 0xe26b72, y: 2.05 },
      { colorName: "green", colorHex: 0x77cd7d, y: 1.55 },
      { colorName: "blue", colorHex: 0x6a9be8, y: 1.05 },
    ];

    for (const buttonDef of buttonDefs) {
      const button = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.08, 20),
        new THREE.MeshStandardMaterial({ color: buttonDef.colorHex }),
      );
      button.position.set(7.78, buttonDef.y, -0.02);
      button.rotation.z = Math.PI / 2;
      button.userData = { kind: "wallButton", colorName: buttonDef.colorName };
      this.roomGroup.add(button);
      this.interactiveObjects.push(button);
      this.wallButtons.push(button);
    }
  }

  addCozySeating() {
    const couchBase = this.makeTexturedBox([2.8, 0.72, 1.28], "fabric", {
      color: 0x7d8fae,
      roughness: 0.96,
      metalness: 0.01,
    });
    couchBase.position.set(-5.6, 0.42, 5.5);
    couchBase.userData = { kind: "hint", hint: "A soft couch makes this room feel cozy." };
    this.roomGroup.add(couchBase);
    this.addSolid(couchBase, 3.2, 1.6, 0.8);
    this.interactiveObjects.push(couchBase);

    const couchBack = this.makeBox([2.8, 0.74, 0.24], 0x5d6f97);
    couchBack.position.set(-5.6, 0.84, 4.9);
    this.roomGroup.add(couchBack);

    const pillowLeft = this.makeBox([0.62, 0.22, 0.56], 0xe2a25d);
    pillowLeft.position.set(-6.28, 0.82, 5.56);
    this.roomGroup.add(pillowLeft);

    const pillowRight = this.makeBox([0.62, 0.22, 0.56], 0xd96889);
    pillowRight.position.set(-4.92, 0.82, 5.56);
    this.roomGroup.add(pillowRight);

    const beanBag = new THREE.Mesh(
      new THREE.SphereGeometry(0.68, 18, 18),
      new THREE.MeshStandardMaterial({ color: 0x9e68c6 }),
    );
    beanBag.position.set(-0.8, 0.42, 5.5);
    beanBag.scale.set(1.0, 0.65, 0.92);
    beanBag.userData = { kind: "hint", hint: "A comfy bean bag sits by the records." };
    beanBag.castShadow = true;
    beanBag.receiveShadow = true;
    this.roomGroup.add(beanBag);
    this.interactiveObjects.push(beanBag);
    this.addSolid(beanBag, 1.5, 1.3, 0.5);

    const sideTable = this.makeTexturedBox([0.72, 0.52, 0.72], "wood", {
      color: 0xffffff,
      roughness: 0.74,
      metalness: 0.05,
    });
    sideTable.position.set(-2.2, 0.28, 5.5);
    sideTable.userData = { kind: "hint", hint: "A side table holds a warm lamp and notes." };
    this.roomGroup.add(sideTable);
    this.addSolid(sideTable, 0.95, 0.95, 0.5);
    this.interactiveObjects.push(sideTable);

    const lamp = this.makeGlossyBox([0.24, 0.54, 0.24], 0xf6d88a, 150);
    lamp.position.set(-2.2, 0.82, 5.5);
    this.roomGroup.add(lamp);

    const mug = this.makeBox([0.14, 0.16, 0.14], 0xf0f3fb);
    mug.position.set(-2.04, 0.58, 5.38);
    this.roomGroup.add(mug);

    const notePad = this.makeTexturedBox([0.3, 0.03, 0.22], "wall", {
      color: 0xf5edd9,
      roughness: 0.86,
      metalness: 0.01,
    });
    notePad.position.set(-2.3, 0.55, 5.62);
    this.roomGroup.add(notePad);
  }

  addMusicStorage() {
    this.guitarCase = this.makeBox([1.8, 0.24, 0.64], 0x2f343e);
    this.guitarCase.position.set(0.8, 0.12, 6.4);
    this.guitarCase.rotation.y = 0.18;
    this.guitarCase.userData = { kind: "guitarCase" };
    this.roomGroup.add(this.guitarCase);
    this.addSolid(this.guitarCase, 2.0, 0.95, 0.28);
    this.interactiveObjects.push(this.guitarCase);

    this.guitarCaseLid = this.makeBox([1.66, 0.08, 0.52], 0x4b515f);
    this.guitarCaseLid.position.set(0.8, 0.26, 6.4);
    this.guitarCaseLid.rotation.y = 0.18;
    this.guitarCaseLid.userData = { kind: "guitarCase" };
    this.roomGroup.add(this.guitarCaseLid);
    this.interactiveObjects.push(this.guitarCaseLid);

    this.guitarCaseHitbox = this.makeBox([2.2, 0.8, 1.0], 0xffffff);
    this.guitarCaseHitbox.position.set(0.8, 0.42, 6.4);
    this.guitarCaseHitbox.rotation.y = 0.18;
    this.guitarCaseHitbox.material.transparent = true;
    this.guitarCaseHitbox.material.opacity = 0;
    this.guitarCaseHitbox.userData = { kind: "guitarCase" };
    this.roomGroup.add(this.guitarCaseHitbox);
    this.interactiveObjects.push(this.guitarCaseHitbox);

    const caseTwo = this.makeBox([1.5, 0.2, 0.56], 0x464d58);
    caseTwo.position.set(2.4, 0.1, 6.0);
    caseTwo.rotation.y = -0.12;
    caseTwo.userData = { kind: "hint", hint: "Instrument cases are stacked near the wall." };
    this.roomGroup.add(caseTwo);
    this.addSolid(caseTwo, 1.8, 0.85, 0.24);
    this.interactiveObjects.push(caseTwo);

    const violinCase = this.makeBox([1.12, 0.18, 0.42], 0x3f4752);
    violinCase.position.set(1.62, 0.28, 6.58);
    violinCase.rotation.y = -0.06;
    violinCase.userData = { kind: "hint", hint: "Instrument cases are stacked near the wall." };
    this.roomGroup.add(violinCase);
    this.interactiveObjects.push(violinCase);

    const crate = this.makeBox([1.0, 0.82, 0.82], 0x8c654e);
    crate.position.set(9.6, 0.42, 4.8);
    crate.userData = { kind: "hint", hint: "A crate holds cables and music gear." };
    this.roomGroup.add(crate);
    this.addSolid(crate, 1.2, 1.0, 0.7);
    this.interactiveObjects.push(crate);

    const cableLoop = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.03, 10, 20),
      new THREE.MeshStandardMaterial({ color: 0x161a21 }),
    );
    cableLoop.position.set(9.56, 0.88, 4.82);
    cableLoop.rotation.x = Math.PI / 2;
    this.roomGroup.add(cableLoop);

    const cableLine = this.makeBox([1.6, 0.01, 0.05], 0x171a20);
    cableLine.position.set(8.66, 0.02, 4.18);
    cableLine.rotation.y = 0.36;
    this.roomGroup.add(cableLine);

    const plantPot = this.makeBox([0.5, 0.46, 0.5], 0x9a7359);
    plantPot.position.set(10.0, 0.24, 2.5);
    this.roomGroup.add(plantPot);

    const leafOne = this.makeBox([0.18, 0.92, 0.18], 0x6fae67);
    leafOne.position.set(9.88, 0.88, 2.5);
    leafOne.rotation.z = 0.28;
    this.roomGroup.add(leafOne);

    const leafTwo = this.makeBox([0.18, 0.86, 0.18], 0x82c977);
    leafTwo.position.set(10.12, 0.84, 2.54);
    leafTwo.rotation.z = -0.26;
    this.roomGroup.add(leafTwo);

    const headphonesHook = this.makeBox([0.08, 0.24, 0.08], 0xc4cad4);
    headphonesHook.material = new THREE.MeshStandardMaterial({ color: 0xc4cad4, roughness: 0.22, metalness: 0.88 });
    headphonesHook.position.set(4.12, 1.64, 3.56);
    this.roomGroup.add(headphonesHook);

    const hangingHeadphones = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.03, 12, 24, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x232933, roughness: 0.42, metalness: 0.16 }),
    );
    hangingHeadphones.position.set(4.12, 1.42, 3.56);
    hangingHeadphones.rotation.x = Math.PI / 2;
    this.roomGroup.add(hangingHeadphones);
  }

  addMusicExitDoor() {
    const frame = this.makeTexturedBox([0.78, 3.2, 1.7], "wood", {
      color: 0xffffff,
      roughness: 0.7,
      metalness: 0.06,
    });
    frame.position.set(9.38, 1.6, 3.0);
    this.roomGroup.add(frame);

    this.exitDoor = this.makeTexturedBox([0.42, 2.82, 1.28], "wood", {
      color: 0xb07a4d,
      roughness: 0.58,
      metalness: 0.05,
    });
    this.exitDoor.position.set(9.36, 1.42, 3.0);
    this.exitDoor.userData = { kind: "exitDoor" };
    this.roomGroup.add(this.exitDoor);
    this.interactiveObjects.push(this.exitDoor);

    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xd6b577, roughness: 0.26, metalness: 0.85 }),
    );
    knob.position.set(9.62, 1.4, 3.28);
    knob.userData = { kind: "exitDoor" };
    this.roomGroup.add(knob);
    this.interactiveObjects.push(knob);

    this.exitPanel = this.makeBox([0.22, 0.48, 0.18], 0xc7cfec);
    this.exitPanel.position.set(9.64, 1.02, 3.62);
    this.exitPanel.userData = { kind: "exitDoor" };
    this.roomGroup.add(this.exitPanel);
    this.interactiveObjects.push(this.exitPanel);

    const doorLabel = this.makeWordNote("DOOR", "#c6d7f1", [9.7, 2.42, 3.0], -Math.PI / 2);
    doorLabel.scale.set(0.28, 0.4, 1);
    doorLabel.userData = { kind: "exitDoor" };
    this.roomGroup.add(doorLabel);
    this.interactiveObjects.push(doorLabel);
  }

  addLivingRoomShell() {
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_WIDTH, 0.35, ROOM_DEPTH),
      new THREE.MeshStandardMaterial({ color: 0x9f7b5f }),
    );
    floor.position.y = -0.18;
    floor.receiveShadow = true;
    this.roomGroup.add(floor);

    const rug = this.makeBox([7.0, 0.04, 4.6], 0x6f93bf);
    rug.position.set(-0.2, 0.03, 1.8);
    this.roomGroup.add(rug);

    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_WIDTH, 0.35, ROOM_DEPTH),
      new THREE.MeshStandardMaterial({ color: 0xf7fbff }),
    );
    ceiling.position.y = 5.2;
    this.roomGroup.add(ceiling);

    const wallDefs = [
      { size: [0.35, 5, ROOM_DEPTH], pos: [-HALF_WIDTH, 2.5, 0] },
      { size: [0.35, 5, ROOM_DEPTH], pos: [HALF_WIDTH, 2.5, 0] },
      { size: [ROOM_WIDTH, 5, 0.35], pos: [0, 2.5, -HALF_DEPTH] },
      { size: [ROOM_WIDTH, 5, 0.35], pos: [0, 2.5, HALF_DEPTH] },
    ];

    for (const wall of wallDefs) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(...wall.size),
        new THREE.MeshStandardMaterial({ color: this.currentRoomData.themeColor }),
      );
      mesh.position.set(...wall.pos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.roomGroup.add(mesh);
    }

    const trim = this.makeBox([ROOM_WIDTH, 0.24, 0.12], 0xbed0e3);
    trim.position.set(0, 0.4, HALF_DEPTH - 0.2);
    this.roomGroup.add(trim);
  }

  addLivingRoomWindow() {
    const glass = this.makeBox([0.08, 1.9, 3.3], 0xc6e9ff);
    glass.position.set(-HALF_WIDTH + 0.22, 2.5, -1.2);
    glass.material.transparent = true;
    glass.material.opacity = 0.52;
    this.roomGroup.add(glass);

    const curtainLeft = this.makeBox([0.12, 2.15, 0.9], 0xe88f76);
    curtainLeft.position.set(-HALF_WIDTH + 0.32, 2.45, -2.45);
    this.roomGroup.add(curtainLeft);

    const curtainRight = this.makeBox([0.12, 2.15, 0.9], 0xe88f76);
    curtainRight.position.set(-HALF_WIDTH + 0.32, 2.45, 0.1);
    this.roomGroup.add(curtainRight);
  }

  addLivingRoomLights() {
    const lampShade = this.makeBox([1.3, 0.26, 1.3], 0xf7f1df);
    lampShade.position.set(0.2, 4.36, -0.2);
    this.roomGroup.add(lampShade);

    const bulb = this.makeBox([0.18, 0.28, 0.18], 0xffefb0);
    bulb.position.set(0.2, 4.06, -0.2);
    this.roomGroup.add(bulb);

    const floorLamp = this.makeBox([0.12, 2.4, 0.12], 0x8b6f55);
    floorLamp.position.set(-7.4, 1.22, 4.7);
    this.roomGroup.add(floorLamp);

    const lampTop = this.makeBox([0.74, 0.3, 0.74], 0xf3e9cf);
    lampTop.position.set(-7.4, 2.72, 4.7);
    this.roomGroup.add(lampTop);
  }

  addSofaArea() {
    const sofaBase = this.makeBox([3.6, 0.8, 1.45], 0x5e8fb0);
    sofaBase.position.set(-5.9, 0.48, 3.2);
    sofaBase.userData = { kind: "hint", hint: "A cozy sofa faces the TV." };
    this.addSolid(sofaBase, 4.0, 1.9, 0.8);
    this.interactiveObjects.push(sofaBase);

    const sofaBack = this.makeBox([3.6, 0.82, 0.3], 0x507998);
    sofaBack.position.set(-5.9, 0.92, 2.48);
    this.roomGroup.add(sofaBack);

    const armLeft = this.makeBox([0.26, 0.62, 1.36], 0x507998);
    armLeft.position.set(-7.62, 0.58, 3.2);
    this.roomGroup.add(armLeft);

    const armRight = this.makeBox([0.26, 0.62, 1.36], 0x507998);
    armRight.position.set(-4.18, 0.58, 3.2);
    this.roomGroup.add(armRight);

    const cushionOne = this.makeBox([0.82, 0.22, 0.74], 0xf2d178);
    cushionOne.position.set(-6.72, 0.92, 3.16);
    this.roomGroup.add(cushionOne);

    const cushionTwo = this.makeBox([0.82, 0.22, 0.74], 0xe4907d);
    cushionTwo.position.set(-5.08, 0.92, 3.18);
    this.roomGroup.add(cushionTwo);

    const coffeeTable = this.makeBox([2.1, 0.18, 1.18], 0xb47f52);
    coffeeTable.position.set(-1.4, 0.56, 2.0);
    coffeeTable.userData = { kind: "hint", hint: "A small coffee table sits in the middle of the room." };
    this.addSolid(coffeeTable, 2.4, 1.45, 0.62);
    this.interactiveObjects.push(coffeeTable);

    const tableLegs = [
      [-2.2, 0.28, 1.52],
      [-0.6, 0.28, 1.52],
      [-2.2, 0.28, 2.48],
      [-0.6, 0.28, 2.48],
    ];
    for (const [x, y, z] of tableLegs) {
      const leg = this.makeBox([0.12, 0.56, 0.12], 0x7a5437);
      leg.position.set(x, y, z);
      this.roomGroup.add(leg);
    }
  }

  addTvArea() {
    const tvStand = this.makeBox([2.9, 0.82, 1.0], 0x826347);
    tvStand.position.set(5.4, 0.42, 3.35);
    tvStand.userData = { kind: "hint", hint: "The TV stand holds the television and clues nearby." };
    this.addSolid(tvStand, 3.2, 1.35, 0.84);
    this.interactiveObjects.push(tvStand);

    const tvScreen = this.makeBox([2.36, 1.42, 0.08], 0x1d2734);
    tvScreen.position.set(5.4, 1.7, 2.88);
    tvScreen.userData = { kind: "hint", hint: "The TV is off right now." };
    this.roomGroup.add(tvScreen);
    this.interactiveObjects.push(tvScreen);

    const tvGlow = this.makeBox([2.18, 1.22, 0.03], 0x567ba1);
    tvGlow.position.set(5.4, 1.7, 2.82);
    tvGlow.material.transparent = true;
    tvGlow.material.opacity = 0.55;
    this.roomGroup.add(tvGlow);

    const picture = this.makeWordNote("HOME", "#98b7dc", [-5.9, 2.65, 2.68], 0);
    picture.scale.set(0.8, 0.85, 1);
    this.roomGroup.add(picture);
  }

  addLivingDrawer() {
    this.livingDrawerBody = this.makeBox([1.5, 0.96, 0.95], 0xc08a61);
    this.livingDrawerBody.position.set(8.2, 0.48, 4.25);
    this.livingDrawerBody.userData = { kind: "livingDrawer" };
    this.roomGroup.add(this.livingDrawerBody);
    this.addSolid(this.livingDrawerBody, 1.85, 1.2, 0.86);
    this.interactiveObjects.push(this.livingDrawerBody);

    this.livingDrawerFront = this.makeBox([1.26, 0.48, 0.06], 0xd89e75);
    this.livingDrawerFront.position.set(8.2, 0.58, 3.78);
    this.livingDrawerFront.userData = { kind: "livingDrawer" };
    this.roomGroup.add(this.livingDrawerFront);
    this.interactiveObjects.push(this.livingDrawerFront);

    this.livingDrawerHitbox = this.makeBox([1.9, 1.05, 1.15], 0xffffff);
    this.livingDrawerHitbox.position.set(8.2, 0.56, 4.0);
    this.livingDrawerHitbox.material.transparent = true;
    this.livingDrawerHitbox.material.opacity = 0;
    this.livingDrawerHitbox.userData = { kind: "livingDrawer" };
    this.roomGroup.add(this.livingDrawerHitbox);
    this.interactiveObjects.push(this.livingDrawerHitbox);
  }

  addHammer() {
    const handle = this.makeBox([0.1, 0.44, 0.1], 0x8d6247);
    handle.position.set(8.2, 0.92, 3.38);
    handle.rotation.z = 0.5;
    handle.userData = { kind: "collectItem", itemId: "hammer" };
    this.roomGroup.add(handle);

    const head = this.makeBox([0.34, 0.14, 0.14], 0xc9d5df);
    head.position.set(8.32, 1.06, 3.3);
    head.rotation.z = 0.5;
    head.userData = { kind: "collectItem", itemId: "hammer" };
    this.roomGroup.add(head);

    const hitbox = this.makeBox([0.95, 0.85, 0.9], 0xffffff);
    hitbox.position.set(8.18, 0.98, 3.36);
    hitbox.material.transparent = true;
    hitbox.material.opacity = 0;
    hitbox.userData = { kind: "collectItem", itemId: "hammer" };
    this.roomGroup.add(hitbox);

    this.registerCollectible("hammer", [handle, head, hitbox]);
  }

  addPictureFramePuzzle() {
    this.frameBack = this.makeBox([1.05, 0.88, 0.08], 0x845d45);
    this.frameBack.position.set(6.9, 1.98, 2.86);
    this.frameBack.userData = { kind: "pictureFrame" };
    this.roomGroup.add(this.frameBack);
    this.interactiveObjects.push(this.frameBack);

    const photo = this.makeBox([0.84, 0.64, 0.03], 0xf2e7d2);
    photo.position.set(6.9, 1.98, 2.81);
    this.roomGroup.add(photo);

    this.frameGlass = this.makeBox([0.88, 0.68, 0.02], 0xbfe8ff);
    this.frameGlass.position.set(6.9, 1.98, 2.78);
    this.frameGlass.material.transparent = true;
    this.frameGlass.material.opacity = 0.38;
    this.frameGlass.userData = { kind: "pictureFrame" };
    this.roomGroup.add(this.frameGlass);
    this.interactiveObjects.push(this.frameGlass);

    this.frameHitbox = this.makeBox([1.35, 1.1, 0.7], 0xffffff);
    this.frameHitbox.position.set(6.9, 1.98, 3.03);
    this.frameHitbox.material.transparent = true;
    this.frameHitbox.material.opacity = 0;
    this.frameHitbox.userData = { kind: "pictureFrame" };
    this.roomGroup.add(this.frameHitbox);
    this.interactiveObjects.push(this.frameHitbox);
  }

  addFrameLoot() {
    const keyBody = this.makeBox([0.24, 0.08, 0.08], 0xf0d46b);
    keyBody.position.set(6.62, 1.52, 2.56);
    keyBody.userData = { kind: "collectItem", itemId: "livingKey" };
    this.roomGroup.add(keyBody);

    const keyRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.02, 8, 18),
      new THREE.MeshStandardMaterial({ color: 0xf0d46b }),
    );
    keyRing.position.set(6.46, 1.52, 2.56);
    keyRing.rotation.y = Math.PI / 2;
    keyRing.userData = { kind: "collectItem", itemId: "livingKey" };
    this.roomGroup.add(keyRing);

    const keyHitbox = this.makeBox([0.7, 0.5, 0.45], 0xffffff);
    keyHitbox.position.set(6.55, 1.52, 2.56);
    keyHitbox.material.transparent = true;
    keyHitbox.material.opacity = 0;
    keyHitbox.userData = { kind: "collectItem", itemId: "livingKey" };
    this.roomGroup.add(keyHitbox);
    this.registerCollectible("livingKey", [keyBody, keyRing, keyHitbox]);

    const torchBody = this.makeBox([0.16, 0.46, 0.16], 0x51667c);
    torchBody.position.set(7.18, 1.5, 2.54);
    torchBody.rotation.z = 0.5;
    torchBody.userData = { kind: "collectItem", itemId: "uvTorch" };
    this.roomGroup.add(torchBody);

    const torchTip = this.makeBox([0.16, 0.14, 0.16], 0xbcd1e3);
    torchTip.position.set(7.29, 1.68, 2.54);
    torchTip.rotation.z = 0.5;
    torchTip.userData = { kind: "collectItem", itemId: "uvTorch" };
    this.roomGroup.add(torchTip);

    const torchHitbox = this.makeBox([0.72, 0.72, 0.5], 0xffffff);
    torchHitbox.position.set(7.22, 1.58, 2.54);
    torchHitbox.material.transparent = true;
    torchHitbox.material.opacity = 0;
    torchHitbox.userData = { kind: "collectItem", itemId: "uvTorch" };
    this.roomGroup.add(torchHitbox);
    this.registerCollectible("uvTorch", [torchBody, torchTip, torchHitbox]);
  }

  addUvClue() {
    this.uvClue = this.makeWordNote("TRUE", "#7dffce", [-1.6, 2.32, -8.56], 0);
    this.uvClue.scale.set(0.98, 0.82, 1);
    this.uvClue.visible = false;
    this.roomGroup.add(this.uvClue);
  }

  addLivingCupboard() {
    this.cupboardBody = this.makeBox([1.95, 3.2, 1.18], 0xbf8556);
    this.cupboardBody.position.set(-8.8, 1.6, 5.55);
    this.cupboardBody.userData = { kind: "livingCupboard" };
    this.roomGroup.add(this.cupboardBody);
    this.addSolid(this.cupboardBody, 2.3, 1.55, 1.7);
    this.interactiveObjects.push(this.cupboardBody);

    this.cupboardDoor = this.makeBox([1.68, 2.86, 0.06], 0xd89f71);
    this.cupboardDoor.position.set(-8.8, 1.6, 6.12);
    this.cupboardDoor.userData = { kind: "livingCupboard" };
    this.roomGroup.add(this.cupboardDoor);
    this.interactiveObjects.push(this.cupboardDoor);

    this.cupboardHitbox = this.makeBox([2.4, 3.4, 1.65], 0xffffff);
    this.cupboardHitbox.position.set(-8.8, 1.64, 5.82);
    this.cupboardHitbox.material.transparent = true;
    this.cupboardHitbox.material.opacity = 0;
    this.cupboardHitbox.userData = { kind: "livingCupboard" };
    this.roomGroup.add(this.cupboardHitbox);
    this.interactiveObjects.push(this.cupboardHitbox);
  }

  addLivingKnife() {
    const blade = this.makeBox([0.12, 0.44, 0.05], 0xd7dfe8);
    blade.position.set(-8.88, 1.02, 5.26);
    blade.userData = { kind: "collectItem", itemId: "livingKnife" };
    this.roomGroup.add(blade);

    const handle = this.makeBox([0.12, 0.22, 0.08], 0x443228);
    handle.position.set(-8.88, 0.78, 5.26);
    handle.userData = { kind: "collectItem", itemId: "livingKnife" };
    this.roomGroup.add(handle);

    const hitbox = this.makeBox([1.05, 0.95, 0.72], 0xffffff);
    hitbox.position.set(-8.88, 0.9, 5.28);
    hitbox.material.transparent = true;
    hitbox.material.opacity = 0;
    hitbox.userData = { kind: "collectItem", itemId: "livingKnife" };
    this.roomGroup.add(hitbox);

    this.registerCollectible("livingKnife", [blade, handle, hitbox]);
  }

  addSmallBox() {
    this.smallBoxBody = this.makeBox([0.82, 0.42, 0.58], 0x7c593f);
    this.smallBoxBody.position.set(1.46, 0.78, 2.04);
    this.smallBoxBody.userData = { kind: "smallBox" };
    this.roomGroup.add(this.smallBoxBody);
    this.interactiveObjects.push(this.smallBoxBody);

    this.smallBoxLid = this.makeBox([0.84, 0.08, 0.6], 0x9c7456);
    this.smallBoxLid.position.set(1.46, 1.04, 2.04);
    this.smallBoxLid.userData = { kind: "smallBox" };
    this.roomGroup.add(this.smallBoxLid);
    this.interactiveObjects.push(this.smallBoxLid);

    this.smallBoxHitbox = this.makeBox([1.2, 0.9, 0.95], 0xffffff);
    this.smallBoxHitbox.position.set(1.46, 0.9, 2.04);
    this.smallBoxHitbox.material.transparent = true;
    this.smallBoxHitbox.material.opacity = 0;
    this.smallBoxHitbox.userData = { kind: "smallBox" };
    this.roomGroup.add(this.smallBoxHitbox);
    this.interactiveObjects.push(this.smallBoxHitbox);
  }

  addLockClue() {
    if (this.lockClue) {
      return;
    }

    this.lockClue = this.makeWordNote("LOCK", "#fff7e2", [1.46, 1.44, 2.04], 0);
    this.lockClue.scale.set(0.76, 0.62, 1);
    this.lockClue.visible = false;
    this.lockClue.userData = { kind: "smallBox" };
    this.roomGroup.add(this.lockClue);
  }

  addRoom1Door() {
    this.exitDoor = this.makeBox([0.62, 3.5, 2.6], 0x5d6f83);
    this.exitDoor.position.set(HALF_WIDTH - 0.62, 1.75, -3.2);
    this.exitDoor.userData = { kind: "room1Door" };
    this.roomGroup.add(this.exitDoor);
    this.interactiveObjects.push(this.exitDoor);

    this.exitPanel = this.makeBox([0.2, 0.48, 0.18], 0xc8dceb);
    this.exitPanel.position.set(HALF_WIDTH - 0.25, 1.3, -2.18);
    this.exitPanel.userData = { kind: "room1Door" };
    this.roomGroup.add(this.exitPanel);
    this.interactiveObjects.push(this.exitPanel);
  }

  addRoomShell() {
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_WIDTH, 0.35, ROOM_DEPTH),
      new THREE.MeshStandardMaterial({ color: 0xa88667 }),
    );
    floor.position.y = -0.18;
    floor.receiveShadow = true;
    this.roomGroup.add(floor);

    const rug = this.makeBox([5.2, 0.04, 3.5], 0x5e9bb1);
    rug.position.set(-0.2, 0.03, 2.4);
    this.roomGroup.add(rug);

    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_WIDTH, 0.35, ROOM_DEPTH),
      new THREE.MeshStandardMaterial({ color: 0xf8fbff }),
    );
    ceiling.position.y = 5.2;
    this.roomGroup.add(ceiling);

    const wallDefs = [
      { size: [0.35, 5, ROOM_DEPTH], pos: [-HALF_WIDTH, 2.5, 0] },
      { size: [0.35, 5, ROOM_DEPTH], pos: [HALF_WIDTH, 2.5, 0] },
      { size: [ROOM_WIDTH, 5, 0.35], pos: [0, 2.5, -HALF_DEPTH] },
      { size: [ROOM_WIDTH, 5, 0.35], pos: [0, 2.5, HALF_DEPTH] },
    ];

    for (const wall of wallDefs) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(...wall.size),
        new THREE.MeshStandardMaterial({ color: this.currentRoomData.themeColor }),
      );
      mesh.position.set(...wall.pos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.roomGroup.add(mesh);
    }

    const pantryStripe = this.makeBox([5.6, 5, 0.08], 0xf6d56d);
    pantryStripe.position.set(6.1, 2.5, HALF_DEPTH - 0.22);
    this.roomGroup.add(pantryStripe);
  }

  addCeilingFixture() {
    const fixture = this.makeBox([3.0, 0.12, 1.4], 0xf6fbff);
    fixture.position.set(-1.2, 4.98, -0.8);
    this.roomGroup.add(fixture);

    const trim = this.makeBox([3.2, 0.18, 1.6], 0xcbd9df);
    trim.position.set(-1.2, 5.02, -0.8);
    this.roomGroup.add(trim);
  }

  addWindow() {
    const glass = this.makeBox([0.08, 1.9, 3.2], 0xbfe5ff);
    glass.position.set(-HALF_WIDTH + 0.22, 2.45, 1.2);
    glass.material.transparent = true;
    glass.material.opacity = 0.55;
    this.roomGroup.add(glass);

    const curtainLeft = this.makeBox([0.12, 2.2, 0.8], 0xf28e6d);
    curtainLeft.position.set(-HALF_WIDTH + 0.32, 2.4, -0.15);
    this.roomGroup.add(curtainLeft);

    const curtainRight = this.makeBox([0.12, 2.2, 0.8], 0xf28e6d);
    curtainRight.position.set(-HALF_WIDTH + 0.32, 2.4, 2.55);
    this.roomGroup.add(curtainRight);
  }

  addCounters() {
    const leftCounter = this.makeBox([5.2, 0.92, 1.35], 0x8db8aa);
    leftCounter.position.set(-3.8, 0.46, -6.28);
    leftCounter.userData = { kind: "hint", hint: "These kitchen counters have lots of work space." };
    this.addSolid(leftCounter, 5.6, 1.8, 1.0);
    this.interactiveObjects.push(leftCounter);

    const leftTop = this.makeBox([5.35, 0.08, 1.48], 0xf2f6f3);
    leftTop.position.set(-3.8, 0.96, -6.28);
    this.roomGroup.add(leftTop);

    const rightCounter = this.makeBox([5.2, 0.92, 1.35], 0x7da1b0);
    rightCounter.position.set(4.1, 0.46, -6.28);
    rightCounter.userData = { kind: "hint", hint: "There are more counters and cabinets on this side." };
    this.addSolid(rightCounter, 5.6, 1.8, 1.0);
    this.interactiveObjects.push(rightCounter);

    const rightTop = this.makeBox([5.35, 0.08, 1.48], 0xf2f6f3);
    rightTop.position.set(4.1, 0.96, -6.28);
    this.roomGroup.add(rightTop);

    const oven = this.makeBox([1.7, 1.0, 1.18], 0x4d5865);
    oven.position.set(0.6, 0.5, -6.18);
    oven.userData = { kind: "hint", hint: "A shiny oven sits under the counter." };
    this.addSolid(oven, 1.9, 1.35, 1.0);
    this.interactiveObjects.push(oven);

    const ovenDoor = this.makeBox([1.35, 0.55, 0.05], 0xb7dfff);
    ovenDoor.position.set(0.6, 0.42, -5.56);
    ovenDoor.material.transparent = true;
    ovenDoor.material.opacity = 0.35;
    this.roomGroup.add(ovenDoor);
  }

  addFridge() {
    const fridge = this.makeBox([1.55, 3.4, 1.22], 0xeaf1f6);
    fridge.position.set(-9.5, 1.7, -6.35);
    fridge.userData = { kind: "fridgeClue" };
    this.addSolid(fridge, 1.9, 1.55, 1.7);
    this.interactiveObjects.push(fridge);

    const split = this.makeBox([1.42, 0.04, 0.04], 0xc0cbd3);
    split.position.set(-9.5, 2.12, -5.73);
    this.roomGroup.add(split);

    const handleTop = this.makeBox([0.08, 1.0, 0.05], 0x99a6b2);
    handleTop.position.set(-8.92, 2.86, -5.7);
    this.roomGroup.add(handleTop);

    const handleBottom = this.makeBox([0.08, 0.8, 0.05], 0x99a6b2);
    handleBottom.position.set(-8.92, 1.22, -5.7);
    this.roomGroup.add(handleBottom);

    const redMagnet = this.makeBox([0.18, 0.18, 0.03], 0xe75a5a);
    redMagnet.position.set(-8.7, 2.42, -5.66);
    redMagnet.userData = { kind: "fridgeClue" };
    this.roomGroup.add(redMagnet);
    this.interactiveObjects.push(redMagnet);

    const yellowMagnet = this.makeBox([0.18, 0.18, 0.03], 0xf0dc63);
    yellowMagnet.position.set(-8.7, 2.12, -5.66);
    yellowMagnet.userData = { kind: "fridgeClue" };
    this.roomGroup.add(yellowMagnet);
    this.interactiveObjects.push(yellowMagnet);

    const greenMagnet = this.makeBox([0.18, 0.18, 0.03], 0x71c679);
    greenMagnet.position.set(-8.7, 1.82, -5.66);
    greenMagnet.userData = { kind: "fridgeClue" };
    this.roomGroup.add(greenMagnet);
    this.interactiveObjects.push(greenMagnet);
  }

  addScale() {
    // The digital scale sits on the counter and will light up once it gets a battery.
    this.scaleBody = this.makeBox([1.05, 0.14, 0.9], 0xe7edf3);
    this.scaleBody.position.set(-1.8, 1.06, -6.12);
    this.scaleBody.userData = { kind: "scale" };
    this.roomGroup.add(this.scaleBody);
    this.interactiveObjects.push(this.scaleBody);

    this.scalePlate = this.makeBox([0.9, 0.08, 0.74], 0xf7fbff);
    this.scalePlate.position.set(-1.8, 1.16, -6.12);
    this.scalePlate.userData = { kind: "scale" };
    this.roomGroup.add(this.scalePlate);
    this.interactiveObjects.push(this.scalePlate);

    this.scaleScreen = this.makeBox([0.42, 0.08, 0.16], 0x1f2b32);
    this.scaleScreen.position.set(-1.8, 1.1, -5.76);
    this.scaleScreen.userData = { kind: "scale" };
    this.roomGroup.add(this.scaleScreen);
    this.interactiveObjects.push(this.scaleScreen);

    const scaleButton = this.makeBox([0.18, 0.04, 0.12], 0x7ca7d3);
    scaleButton.position.set(-1.44, 1.1, -5.82);
    scaleButton.userData = { kind: "scale" };
    this.roomGroup.add(scaleButton);
    this.interactiveObjects.push(scaleButton);

    // Large invisible helper so the player can easily click the scale.
    this.scaleHitbox = this.makeBox([1.55, 0.9, 1.35], 0xffffff);
    this.scaleHitbox.position.set(-1.8, 1.28, -6.02);
    this.scaleHitbox.material.transparent = true;
    this.scaleHitbox.material.opacity = 0;
    this.scaleHitbox.userData = { kind: "scale" };
    this.roomGroup.add(this.scaleHitbox);
    this.interactiveObjects.push(this.scaleHitbox);

    this.setScaleText("OFF", "#e8f4ff", "rgba(25, 36, 45, 0.95)");
  }

  addUpperCabinet() {
    this.upperCabinetBody = this.makeBox([2.8, 1.24, 0.74], 0xd39f69);
    this.upperCabinetBody.position.set(4.2, 3.35, -6.34);
    this.upperCabinetBody.userData = { kind: "upperCabinet" };
    this.roomGroup.add(this.upperCabinetBody);
    this.interactiveObjects.push(this.upperCabinetBody);

    this.upperCabinetLeftDoor = this.makeBox([1.22, 1.06, 0.05], 0xe4b581);
    this.upperCabinetLeftDoor.position.set(3.5, 3.35, -5.96);
    this.upperCabinetLeftDoor.userData = { kind: "upperCabinet" };
    this.roomGroup.add(this.upperCabinetLeftDoor);
    this.interactiveObjects.push(this.upperCabinetLeftDoor);

    this.upperCabinetRightDoor = this.makeBox([1.22, 1.06, 0.05], 0xe4b581);
    this.upperCabinetRightDoor.position.set(4.9, 3.35, -5.96);
    this.upperCabinetRightDoor.userData = { kind: "upperCabinet" };
    this.roomGroup.add(this.upperCabinetRightDoor);
    this.interactiveObjects.push(this.upperCabinetRightDoor);

    const leftHandle = this.makeBox([0.06, 0.28, 0.03], 0xf1e8dc);
    leftHandle.position.set(4.0, 3.35, -5.92);
    this.roomGroup.add(leftHandle);

    this.upperCabinetBrokenHandle = this.makeBox([0.05, 0.12, 0.02], 0xf1e8dc);
    this.upperCabinetBrokenHandle.position.set(4.42, 3.52, -5.92);
    this.roomGroup.add(this.upperCabinetBrokenHandle);
  }

  addKitchenTable() {
    const tableTop = this.makeBox([2.6, 0.16, 1.7], 0xb47f52);
    tableTop.position.set(-1.7, 0.84, 2.0);
    tableTop.userData = { kind: "hint", hint: "A kitchen table with room for fruit and clues later." };
    this.addSolid(tableTop, 3.0, 2.0, 0.84);
    this.interactiveObjects.push(tableTop);

    const legPositions = [
      [-2.6, 0.4, 1.3],
      [-0.8, 0.4, 1.3],
      [-2.6, 0.4, 2.7],
      [-0.8, 0.4, 2.7],
    ];

    for (const [x, y, z] of legPositions) {
      const leg = this.makeBox([0.12, 0.8, 0.12], 0x734d31);
      leg.position.set(x, y, z);
      this.roomGroup.add(leg);
    }

    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.26, 0.16, 16),
      new THREE.MeshStandardMaterial({ color: 0xf6f2e8 }),
    );
    bowl.position.set(-1.72, 0.98, 2.02);
    bowl.castShadow = true;
    bowl.receiveShadow = true;
    this.roomGroup.add(bowl);
  }

  addLooseCabinetHandle() {
    // The loose handle sits on the table so it is easy to spot and click.
    const grip = this.makeBox([0.34, 0.08, 0.08], 0xe4d9cb);
    grip.position.set(-0.95, 1.02, 1.32);
    grip.userData = { kind: "collectItem", itemId: "cabinetHandle" };
    this.roomGroup.add(grip);

    const postLeft = this.makeBox([0.04, 0.08, 0.04], 0xb8ab98);
    postLeft.position.set(-1.06, 0.95, 1.32);
    postLeft.userData = { kind: "collectItem", itemId: "cabinetHandle" };
    this.roomGroup.add(postLeft);

    const postRight = this.makeBox([0.04, 0.08, 0.04], 0xb8ab98);
    postRight.position.set(-0.84, 0.95, 1.32);
    postRight.userData = { kind: "collectItem", itemId: "cabinetHandle" };
    this.roomGroup.add(postRight);

    this.registerCollectible("cabinetHandle", [grip, postLeft, postRight]);
  }

  addFruitItems() {
    const apple = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 18, 18),
      new THREE.MeshStandardMaterial({ color: 0xe45757 }),
    );
    apple.position.set(-2.2, 1.18, 1.88);
    apple.userData = { kind: "collectItem", itemId: "apple" };
    apple.castShadow = true;
    this.roomGroup.add(apple);

    const appleHitbox = this.makeBox([0.7, 0.7, 0.7], 0xffffff);
    appleHitbox.position.set(-2.2, 1.18, 1.88);
    appleHitbox.material.transparent = true;
    appleHitbox.material.opacity = 0;
    appleHitbox.userData = { kind: "collectItem", itemId: "apple" };
    this.roomGroup.add(appleHitbox);

    const banana = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.42, 14),
      new THREE.MeshStandardMaterial({ color: 0xf1df60 }),
    );
    banana.position.set(-1.72, 1.14, 1.62);
    banana.rotation.z = 1.15;
    banana.userData = { kind: "collectItem", itemId: "banana" };
    banana.castShadow = true;
    this.roomGroup.add(banana);

    const bananaHitbox = this.makeBox([0.78, 0.65, 0.7], 0xffffff);
    bananaHitbox.position.set(-1.72, 1.14, 1.62);
    bananaHitbox.material.transparent = true;
    bananaHitbox.material.opacity = 0;
    bananaHitbox.userData = { kind: "collectItem", itemId: "banana" };
    this.roomGroup.add(bananaHitbox);

    const pearTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x74c864 }),
    );
    pearTop.position.set(-1.24, 1.24, 2.05);
    pearTop.userData = { kind: "collectItem", itemId: "pear" };
    pearTop.castShadow = true;
    this.roomGroup.add(pearTop);

    const pearBottom = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x74c864 }),
    );
    pearBottom.position.set(-1.24, 1.08, 2.05);
    pearBottom.userData = { kind: "collectItem", itemId: "pear" };
    pearBottom.castShadow = true;
    this.roomGroup.add(pearBottom);

    const pearHitbox = this.makeBox([0.75, 0.85, 0.75], 0xffffff);
    pearHitbox.position.set(-1.24, 1.16, 2.05);
    pearHitbox.material.transparent = true;
    pearHitbox.material.opacity = 0;
    pearHitbox.userData = { kind: "collectItem", itemId: "pear" };
    this.roomGroup.add(pearHitbox);

    this.registerCollectible("apple", [apple, appleHitbox]);
    this.registerCollectible("banana", [banana, bananaHitbox]);
    this.registerCollectible("pear", [pearTop, pearBottom, pearHitbox]);
  }

  addBattery() {
    const body = this.makeBox([0.22, 0.42, 0.22], 0x43586d);
    body.position.set(4.22, 3.18, -6.05);
    body.userData = { kind: "collectItem", itemId: "battery" };
    this.roomGroup.add(body);

    const cap = this.makeBox([0.14, 0.08, 0.14], 0xe0c968);
    cap.position.set(4.22, 3.44, -6.05);
    cap.userData = { kind: "collectItem", itemId: "battery" };
    this.roomGroup.add(cap);

    const hitbox = this.makeBox([0.56, 0.72, 0.5], 0xffffff);
    hitbox.position.set(4.22, 3.26, -6.05);
    hitbox.material.transparent = true;
    hitbox.material.opacity = 0;
    hitbox.userData = { kind: "collectItem", itemId: "battery" };
    this.roomGroup.add(hitbox);

    this.registerCollectible("battery", [body, cap, hitbox]);
  }

  addDrawerBank() {
    this.drawerBody = this.makeBox([1.5, 0.92, 1.02], 0xbe8458);
    this.drawerBody.position.set(6.25, 0.46, -6.16);
    this.drawerBody.userData = { kind: "drawer" };
    this.roomGroup.add(this.drawerBody);
    this.addSolid(this.drawerBody, 1.8, 1.3, 0.92);
    this.interactiveObjects.push(this.drawerBody);

    this.drawerFront = this.makeBox([1.24, 0.44, 0.06], 0xd89d69);
    this.drawerFront.position.set(6.25, 0.54, -5.62);
    this.drawerFront.userData = { kind: "drawer" };
    this.roomGroup.add(this.drawerFront);
    this.interactiveObjects.push(this.drawerFront);

    const handle = this.makeBox([0.34, 0.06, 0.04], 0xf1e8dc);
    handle.position.set(6.25, 0.54, -5.58);
    this.roomGroup.add(handle);

    const keypad = this.makeBox([0.28, 0.24, 0.03], 0x32424d);
    keypad.position.set(6.72, 0.56, -5.58);
    keypad.userData = { kind: "drawer" };
    this.roomGroup.add(keypad);
    this.interactiveObjects.push(keypad);
  }

  addJarArea() {
    this.jarGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.72, 18),
      new THREE.MeshStandardMaterial({
        color: 0xcce8ff,
        transparent: true,
        opacity: 0.35,
      }),
    );
    this.jarGlass.position.set(7.85, 1.36, -6.0);
    this.jarGlass.userData = { kind: "jar" };
    this.jarGlass.castShadow = true;
    this.jarGlass.receiveShadow = true;
    this.roomGroup.add(this.jarGlass);
    this.interactiveObjects.push(this.jarGlass);

    this.jarLid = this.makeBox([0.48, 0.08, 0.48], 0xe7e4dc);
    this.jarLid.position.set(7.85, 1.74, -6.0);
    this.jarLid.userData = { kind: "jar" };
    this.roomGroup.add(this.jarLid);
    this.interactiveObjects.push(this.jarLid);

    this.jarKeyVisual = this.makeBox([0.18, 0.08, 0.08], 0xf0d56d);
    this.jarKeyVisual.position.set(7.85, 1.18, -6.0);
    this.roomGroup.add(this.jarKeyVisual);
  }

  addPantryCupboard() {
    this.pantryBody = this.makeBox([2.0, 3.8, 1.4], 0xc98c5a);
    this.pantryBody.position.set(8.9, 1.9, 5.05);
    this.pantryBody.userData = { kind: "pantry" };
    this.roomGroup.add(this.pantryBody);
    this.addSolid(this.pantryBody, 2.35, 1.9, 1.9);
    this.interactiveObjects.push(this.pantryBody);

    this.pantryDoor = this.makeBox([1.72, 3.34, 0.06], 0xdd9f6b);
    this.pantryDoor.position.set(8.9, 1.9, 5.72);
    this.pantryDoor.userData = { kind: "pantry" };
    this.roomGroup.add(this.pantryDoor);
    this.interactiveObjects.push(this.pantryDoor);

    const handle = this.makeBox([0.08, 0.42, 0.04], 0xf3ebdf);
    handle.position.set(9.45, 1.9, 5.68);
    this.roomGroup.add(handle);
  }

  addRecipeCard() {
    if (this.recipeCard) {
      return;
    }

    this.recipeCard = this.makeBox([0.74, 0.96, 0.04], 0xf7f0de);
    this.recipeCard.position.set(8.56, 1.96, 4.58);
    this.recipeCard.rotation.y = 0.16;
    this.recipeCard.userData = { kind: "recipeCard" };
    this.roomGroup.add(this.recipeCard);
    this.interactiveObjects.push(this.recipeCard);

    const clip = this.makeBox([0.12, 0.08, 0.05], 0x9e8f79);
    clip.position.set(8.56, 2.42, 4.6);
    clip.rotation.y = 0.16;
    this.roomGroup.add(clip);
  }

  addClueNotes() {
    // These small word notes are the hidden recipe clues for the bread box code.
    const appleNote = this.makeWordNote("APPLE", 0xe45b5b, [-3.45, 1.24, -5.54], Math.PI);
    appleNote.userData = { kind: "clueNote", word: "APPLE" };
    this.roomGroup.add(appleNote);
    this.interactiveObjects.push(appleNote);

    const ovenNote = this.makeWordNote("OVEN", 0xb7804e, [0.58, 1.52, -5.5], Math.PI);
    ovenNote.userData = { kind: "clueNote", word: "OVEN" };
    this.roomGroup.add(ovenNote);
    this.interactiveObjects.push(ovenNote);
  }

  addBreadBox() {
    this.breadBoxBody = this.makeBox([1.0, 0.56, 0.72], 0xca6855);
    this.breadBoxBody.position.set(2.55, 1.23, -6.0);
    this.breadBoxBody.userData = { kind: "breadBox" };
    this.roomGroup.add(this.breadBoxBody);
    this.interactiveObjects.push(this.breadBoxBody);

    this.breadBoxLid = this.makeBox([0.84, 0.28, 0.06], 0xe6a393);
    this.breadBoxLid.position.set(2.55, 1.14, -5.62);
    this.breadBoxLid.userData = { kind: "breadBox" };
    this.roomGroup.add(this.breadBoxLid);
    this.interactiveObjects.push(this.breadBoxLid);

    const codeTag = this.makeBox([0.18, 0.2, 0.03], 0x364a57);
    codeTag.position.set(2.94, 1.16, -5.58);
    codeTag.userData = { kind: "breadBox" };
    this.roomGroup.add(codeTag);
    this.interactiveObjects.push(codeTag);

    // Large invisible helper so the bread box is easy to click from the front.
    this.breadBoxHitbox = this.makeBox([1.55, 1.0, 1.25], 0xffffff);
    this.breadBoxHitbox.position.set(2.55, 1.22, -5.9);
    this.breadBoxHitbox.material.transparent = true;
    this.breadBoxHitbox.material.opacity = 0;
    this.breadBoxHitbox.userData = { kind: "breadBox" };
    this.roomGroup.add(this.breadBoxHitbox);
    this.interactiveObjects.push(this.breadBoxHitbox);
  }

  addFlourBag() {
    this.flourBag = this.makeBox([0.65, 0.92, 0.4], 0xf3efe6);
    this.flourBag.position.set(6.9, 0.47, 3.6);
    this.flourBag.userData = { kind: "flourBag" };
    this.roomGroup.add(this.flourBag);
    this.interactiveObjects.push(this.flourBag);

    const topFold = this.makeBox([0.52, 0.16, 0.32], 0xe6ddcf);
    topFold.position.set(6.9, 0.95, 3.6);
    topFold.userData = { kind: "flourBag" };
    this.roomGroup.add(topFold);
    this.interactiveObjects.push(topFold);
  }

  addExitDoor() {
    this.exitDoor = this.makeBox([0.62, 3.5, 2.6], 0x7d5840);
    this.exitDoor.position.set(HALF_WIDTH - 0.62, 1.75, -0.2);
    this.exitDoor.userData = { kind: "exitDoor" };
    this.roomGroup.add(this.exitDoor);
    this.interactiveObjects.push(this.exitDoor);

    this.exitPanel = this.makeBox([0.2, 0.48, 0.18], 0xcfdbe5);
    this.exitPanel.position.set(HALF_WIDTH - 0.25, 1.28, 0.78);
    this.exitPanel.userData = { kind: "exitDoor" };
    this.roomGroup.add(this.exitPanel);
    this.interactiveObjects.push(this.exitPanel);
  }

  addHeadphones() {
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.03, 12, 24, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x1f2430 }),
    );
    band.position.set(-7.62, 0.98, 4.02);
    band.rotation.x = Math.PI / 2;
    band.userData = { kind: "collectItem", itemId: "headphones" };
    this.roomGroup.add(band);

    const leftCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0x495066 }),
    );
    leftCup.position.set(-7.76, 0.86, 4.02);
    leftCup.rotation.z = Math.PI / 2;
    leftCup.userData = { kind: "collectItem", itemId: "headphones" };
    this.roomGroup.add(leftCup);

    const rightCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0x495066 }),
    );
    rightCup.position.set(-7.48, 0.86, 4.02);
    rightCup.rotation.z = Math.PI / 2;
    rightCup.userData = { kind: "collectItem", itemId: "headphones" };
    this.roomGroup.add(rightCup);

    const hitbox = this.makeBox([0.72, 0.7, 0.55], 0xffffff);
    hitbox.position.set(-7.62, 0.92, 4.02);
    hitbox.material.transparent = true;
    hitbox.material.opacity = 0;
    hitbox.userData = { kind: "collectItem", itemId: "headphones" };
    this.roomGroup.add(hitbox);

    this.registerCollectible("headphones", [band, leftCup, rightCup, hitbox]);
  }

  addAudioCable() {
    const loop = new THREE.Mesh(
      new THREE.TorusGeometry(0.13, 0.018, 10, 26),
      new THREE.MeshStandardMaterial({ color: 0x262a35 }),
    );
    loop.position.set(-7.26, 0.88, 4.0);
    loop.rotation.x = Math.PI / 2;
    loop.userData = { kind: "collectItem", itemId: "audioCable" };
    this.roomGroup.add(loop);

    const plugLeft = this.makeBox([0.03, 0.08, 0.03], 0xd7c179);
    plugLeft.position.set(-7.12, 0.88, 4.0);
    plugLeft.userData = { kind: "collectItem", itemId: "audioCable" };
    this.roomGroup.add(plugLeft);

    const plugRight = this.makeBox([0.03, 0.08, 0.03], 0xd7c179);
    plugRight.position.set(-7.4, 0.88, 4.0);
    plugRight.userData = { kind: "collectItem", itemId: "audioCable" };
    this.roomGroup.add(plugRight);

    const hitbox = this.makeBox([0.62, 0.54, 0.48], 0xffffff);
    hitbox.position.set(-7.26, 0.9, 4.0);
    hitbox.material.transparent = true;
    hitbox.material.opacity = 0;
    hitbox.userData = { kind: "collectItem", itemId: "audioCable" };
    this.roomGroup.add(hitbox);

    this.registerCollectible("audioCable", [loop, plugLeft, plugRight, hitbox]);
  }

  addGuitarPick() {
    const pick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.02, 3),
      new THREE.MeshStandardMaterial({ color: 0xf2cc61 }),
    );
    pick.position.set(0.56, 0.42, 6.34);
    pick.rotation.x = Math.PI / 2;
    pick.rotation.z = 0.5;
    pick.userData = { kind: "collectItem", itemId: "guitarPick" };
    this.roomGroup.add(pick);

    const hitbox = this.makeBox([0.5, 0.42, 0.4], 0xffffff);
    hitbox.position.set(0.56, 0.42, 6.34);
    hitbox.material.transparent = true;
    hitbox.material.opacity = 0;
    hitbox.userData = { kind: "collectItem", itemId: "guitarPick" };
    this.roomGroup.add(hitbox);

    this.registerCollectible("guitarPick", [pick, hitbox]);
  }

  addNoteCard() {
    const card = this.makeWordNote("♪", "#90a9f0", [1.05, 0.48, 6.4], 0);
    card.scale.set(0.36, 0.42, 1);
    card.rotation.x = -1.1;
    card.rotation.y = 0.18;
    card.userData = { kind: "collectItem", itemId: "noteCard" };
    this.roomGroup.add(card);

    const hitbox = this.makeBox([0.6, 0.42, 0.38], 0xffffff);
    hitbox.position.set(1.05, 0.42, 6.4);
    hitbox.material.transparent = true;
    hitbox.material.opacity = 0;
    hitbox.userData = { kind: "collectItem", itemId: "noteCard" };
    this.roomGroup.add(hitbox);

    this.registerCollectible("noteCard", [card, hitbox]);
  }

  registerCollectible(itemId, meshes) {
    this.collectibleGroups.set(itemId, meshes);
    for (const mesh of meshes) {
      this.interactiveObjects.push(mesh);
    }
  }

  removeCollectible(itemId) {
    const meshes = this.collectibleGroups.get(itemId) || [];
    for (const mesh of meshes) {
      this.roomGroup.remove(mesh);
    }
    this.interactiveObjects = this.interactiveObjects.filter((entry) => !meshes.includes(entry));
    this.collectibleGroups.delete(itemId);
  }

  setScaleText(text, textColor = "#bfffc4", backgroundColor = "rgba(25, 36, 45, 0.95)") {
    if (this.scaleDisplayText) {
      this.roomGroup.remove(this.scaleDisplayText);
      this.interactiveObjects = this.interactiveObjects.filter((entry) => entry !== this.scaleDisplayText);
      this.scaleDisplayText.geometry.dispose();
      this.scaleDisplayText.material.map?.dispose?.();
      this.scaleDisplayText.material.dispose();
      this.scaleDisplayText = null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 192;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = backgroundColor;
    context.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
    context.strokeStyle = "#7dc8ff";
    context.lineWidth = 8;
    context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    context.fillStyle = textColor;
    context.font = "700 110px Trebuchet MS, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 6);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });
    this.scaleDisplayText = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.18), material);
    this.scaleDisplayText.position.set(-1.8, 1.12, -5.73);
    this.scaleDisplayText.rotation.y = Math.PI;
    this.scaleDisplayText.userData = { kind: "scale" };
    this.roomGroup.add(this.scaleDisplayText);
    this.interactiveObjects.push(this.scaleDisplayText);
  }

  makeWordNote(word, fillColor, position, rotationY = 0) {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = fillColor;
    context.fillRect(16, 16, canvas.width - 32, canvas.height - 32);
    context.strokeStyle = "#fff5df";
    context.lineWidth = 8;
    context.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
    context.fillStyle = "#fffaf0";
    context.font = "700 120px Trebuchet MS, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(word, canvas.width / 2, canvas.height / 2 + 6);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const note = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.34), material);
    note.position.set(...position);
    note.rotation.y = rotationY;
    note.renderOrder = 3;
    return note;
  }

  checkBreadBoxHint() {
    const hasAllWords = BREAD_BOX_CLUE_WORDS.every((word) => this.clueWordsFound.has(word));
    if (this.state.pantryUnlocked && hasAllWords && !this.state.breadBoxHintReady) {
      this.state.breadBoxHintReady = true;
      this.ui.showMessage("That must be the bread box code.", 3000);
    }
  }

  clearScaleFruitMarkers() {
    for (const marker of this.scaleFruitMarkers) {
      this.roomGroup.remove(marker);
      marker.geometry.dispose();
      marker.material.dispose();
    }
    this.scaleFruitMarkers = [];
  }

  restorePlacedFruits() {
    // If the player gets the order wrong, put the used fruits back into the toolbox.
    for (const itemId of this.state.placedFruitItems) {
      const item = ITEM_INFO[itemId];
      if (item) {
        this.inventory.add(item);
      }
    }
    this.state.placedFruitItems = [];
  }

  addScaleFruitMarker(itemId) {
    const colors = {
      apple: 0xe45757,
      banana: 0xf1df60,
      pear: 0x74c864,
    };
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 12),
      new THREE.MeshStandardMaterial({ color: colors[itemId] }),
    );
    marker.position.set(-2.04 + this.scaleFruitMarkers.length * 0.18, 1.23, -6.1);
    marker.castShadow = true;
    this.roomGroup.add(marker);
    this.scaleFruitMarkers.push(marker);
  }

  addSpoon() {
    const spoonMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfe6ee,
      roughness: 0.24,
      metalness: 0.88,
    });

    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 0.08), spoonMaterial);
    handle.position.set(6.25, 0.56, -5.88);
    handle.userData = { kind: "collectItem", itemId: "spoon" };
    handle.castShadow = true;
    this.roomGroup.add(handle);

    const bowl = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      spoonMaterial.clone(),
    );
    bowl.scale.set(1.18, 0.42, 0.95);
    bowl.position.set(6.47, 0.56, -5.88);
    bowl.userData = { kind: "collectItem", itemId: "spoon" };
    bowl.castShadow = true;
    this.roomGroup.add(bowl);

    const hitbox = this.makeBox([1.18, 0.44, 0.62], 0xffffff);
    hitbox.position.set(6.34, 0.58, -5.88);
    hitbox.material.transparent = true;
    hitbox.material.opacity = 0;
    hitbox.userData = { kind: "collectItem", itemId: "spoon" };
    this.roomGroup.add(hitbox);

    this.registerCollectible("spoon", [handle, bowl, hitbox]);
  }

  addKnife() {
    const blade = this.makeBox([0.12, 0.48, 0.05], 0xd5dde7);
    blade.position.set(2.55, 1.08, -5.48);
    blade.userData = { kind: "collectItem", itemId: "knife" };
    this.roomGroup.add(blade);

    const handle = this.makeBox([0.12, 0.22, 0.08], 0x433229);
    handle.position.set(2.55, 0.82, -5.48);
    handle.userData = { kind: "collectItem", itemId: "knife" };
    this.roomGroup.add(handle);

    const hitbox = this.makeBox([1.15, 1.0, 0.95], 0xffffff);
    hitbox.position.set(2.55, 0.98, -5.48);
    hitbox.material.transparent = true;
    hitbox.material.opacity = 0;
    hitbox.userData = { kind: "collectItem", itemId: "knife" };
    this.roomGroup.add(hitbox);

    this.registerCollectible("knife", [blade, handle, hitbox]);
  }

  addFinalTiles() {
    if (this.state.finalTilesShown) {
      return;
    }

    this.state.finalTilesShown = true;
    const letters = ["C", "O", "O", "K"];
    const startX = 5.86;

    for (let index = 0; index < letters.length; index += 1) {
      const tile = this.makeBox([0.46, 0.08, 0.46], 0xf7e5bf);
      tile.position.set(startX + index * 0.56, 0.2, 2.72);
      tile.userData = { kind: "finalTiles" };
      this.roomGroup.add(tile);
      this.interactiveObjects.push(tile);
      this.finalTileMeshes.push(tile);

      const letter = this.makeWordNote(letters[index], "#31414d", [startX + index * 0.56, 0.48, 2.72], 0);
      letter.scale.set(0.42, 0.7, 1);
      letter.rotation.x = -0.92;
      letter.userData = { kind: "finalTiles" };
      this.roomGroup.add(letter);
      this.interactiveObjects.push(letter);
      this.finalTileMeshes.push(letter);
    }
  }

  makeBox(size, color) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size[0], size[1], size[2]),
      new THREE.MeshStandardMaterial({ color }),
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  addSolid(mesh, width, depth, offsetY = 0) {
    const box = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(mesh.position.x, offsetY || mesh.position.y, mesh.position.z),
      new THREE.Vector3(width, 2.6, depth),
    );
    this.solidBoxes.push(box);
  }

  getHighlightObjects(object) {
    const kind = object.userData.kind;

    if (kind === "livingDrawer") {
      return [this.livingDrawerBody, this.livingDrawerFront, this.livingDrawerHitbox];
    }

    if (kind === "pictureFrame") {
      return [this.frameBack, this.frameGlass, this.frameHitbox];
    }

    if (kind === "livingCupboard") {
      return [this.cupboardBody, this.cupboardDoor, this.cupboardHitbox];
    }

    if (kind === "smallBox") {
      return [this.smallBoxBody, this.smallBoxLid, this.smallBoxHitbox, this.lockClue];
    }

    if (kind === "upperCabinet") {
      return [this.upperCabinetBody, this.upperCabinetLeftDoor, this.upperCabinetRightDoor];
    }

    if (kind === "scale") {
      return [this.scaleBody, this.scalePlate, this.scaleScreen, this.scaleDisplayText, this.scaleHitbox];
    }

    if (kind === "drawer") {
      return [this.drawerBody, this.drawerFront];
    }

    if (kind === "musicDrawer") {
      return [this.musicDrawerBody, this.musicDrawerFront];
    }

    if (kind === "room4Drawer" || kind === "room4DrawerClue") {
      return [this.room4DrawerBody, this.room4DrawerFront, this.room4DrawerHitbox, ...this.room4DrawerClue];
    }

    if (kind === "room4ColorBoard") {
      return [this.room4ColorBoard, this.room4ColorBoardHitbox, ...this.room4ColorBoardMarkers];
    }

    if (kind === "room4Locker") {
      return [this.room4LockerBody, this.room4LockerLeftDoor, this.room4LockerRightDoor, this.room4LockerHitbox];
    }

    if (kind === "room4Target") {
      return [...this.room4Targets, this.room4CodeCard];
    }

    if (kind === "room4Scoreboard") {
      return [this.room4Scoreboard, this.room4ScoreboardHitbox];
    }

    if (kind === "room4SportsRack") {
      return [this.room4SportsRackBody, this.room4SportsRackDoor, this.room4SportsRackHitbox];
    }

    if (kind === "room4BounceWall") {
      return [this.room4BounceWall, this.room4BounceWallHitbox];
    }

    if (kind === "room4ToyChest") {
      return [this.room4ToyChestBody, this.room4ToyChestLid, this.room4ToyChestHitbox];
    }

    if (kind === "room4ShapeSlot") {
      return this.room4ShapeSlots;
    }

    if (kind === "room4HiddenPanel") {
      return [this.room4HiddenPanel, this.room4HiddenPanelFrame];
    }

    if (kind === "room4ArrowPanel") {
      return this.room4ArrowPanels;
    }

    if (kind === "room4FinalCabinet") {
      return [
        this.room4FinalCabinetBody,
        this.room4FinalCabinetLeftDoor,
        this.room4FinalCabinetRightDoor,
        this.room4FinalCabinetHitbox,
      ];
    }

    if (kind === "room4GameTiles") {
      return this.room4GameTileMeshes;
    }

    if (kind === "mixingConsole") {
      return [this.mixingConsoleDesk, this.mixingConsoleTop, this.mixingConsoleMeter];
    }

    if (kind === "drumPad") {
      return [object];
    }

    if (kind === "guitarCase") {
      return [this.guitarCase, this.guitarCaseLid, this.guitarCaseHitbox];
    }

    if (kind === "guitarString") {
      return [object];
    }

    if (kind === "recordPlayer") {
      return [this.recordPlayerBase, this.recordPlayerLid, this.recordPlayerHitbox];
    }

    if (kind === "wallButton") {
      return [object];
    }

    if (kind === "finalCabinet") {
      return [this.finalCabinetBody, this.finalCabinetDoor];
    }

    if (kind === "beatTiles") {
      return this.beatTileMeshes;
    }

    if (kind === "jar") {
      return [this.jarGlass, this.jarLid, this.jarKeyVisual];
    }

    if (kind === "pantry") {
      return [this.pantryBody, this.pantryDoor];
    }

    if (kind === "recipeCard") {
      return [object];
    }

    if (kind === "clueNote") {
      return [object];
    }

    if (kind === "breadBox") {
      return [this.breadBoxBody, this.breadBoxLid, this.breadBoxHitbox];
    }

    if (kind === "flourBag") {
      return [this.flourBag];
    }

    if (kind === "finalTiles") {
      return this.finalTileMeshes;
    }

    if (kind === "exitDoor") {
      return [this.exitDoor, this.exitPanel];
    }

    if (kind === "room1Door") {
      return [this.exitDoor, this.exitPanel];
    }

    if (kind === "collectItem") {
      return this.collectibleGroups.get(object.userData.itemId) || [object];
    }

    return [object];
  }

  handleInteraction(object, selectedItem) {
    if (!object) {
      return { changedRoom: false, spawn: null, won: false };
    }

    const kind = object.userData.kind;

    if (kind === "collectItem") {
      return this.handleCollectItem(object.userData.itemId);
    }

    if (kind === "hint" && object.userData.hint) {
      this.ui.showMessage(object.userData.hint, 2200);
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "sheetMusicClue") {
      this.ui.showMessage("Red\nBlue\nYellow\nGreen\n\nThis music sheet looks important.", 3200);
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "room4DrawerClue") {
      this.ui.showMessage("Blue\nRed\nYellow\nGreen\n\nThese colors seem important.", 3200);
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "pianoKey") {
      const pianoSound = { type: "piano", note: object.userData.colorName };
      const expectedColor = PIANO_COLOR_ORDER[this.state.pianoSequence.length];
      if (object.userData.colorName !== expectedColor) {
        this.state.pianoSequence = [];
        this.ui.showMessage("That didn't sound right.");
        return { changedRoom: false, spawn: null, won: false, playSound: pianoSound };
      }

      this.state.pianoSequence.push(object.userData.colorName);

      if (this.state.pianoSequence.length === PIANO_COLOR_ORDER.length) {
        this.state.pianoSequence = [];
        this.state.musicDrawerUnlocked = true;
        if (this.musicDrawerFront) {
          this.musicDrawerFront.material.color.setHex(0x8fdca3);
        }
        this.ui.showMessage("You hear a click near the small drawer.");
      } else {
        const colorLabel = object.userData.colorName[0].toUpperCase() + object.userData.colorName.slice(1);
        this.ui.showMessage(`${colorLabel} key played.`);
      }

      return { changedRoom: false, spawn: null, won: false, playSound: pianoSound };
    }

    if (kind === "room4Drawer") {
      if (this.state.room4DrawerOpened) {
        this.ui.showMessage("Blue\nRed\nYellow\nGreen\n\nThese colors seem important.", 3200);
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.room4DrawerOpened = true;
      if (this.room4DrawerFront) {
        this.room4DrawerFront.position.z -= 0.42;
      }
      if (this.room4DrawerHitbox) {
        this.room4DrawerHitbox.position.z -= 0.2;
      }
      for (const clueDot of this.room4DrawerClue) {
        clueDot.visible = true;
      }
      this.ui.showMessage("Blue\nRed\nYellow\nGreen\n\nThese colors seem important.", 3200);
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "room4ColorBoard") {
      const expectedOrder = ["blueBall", "redBall", "yellowBall", "greenBall"];
      if (!selectedItem || !expectedOrder.includes(selectedItem.id)) {
        this.ui.showMessage("Maybe the colored clue balls fit here.");
        return { changedRoom: false, spawn: null, won: false };
      }

      const expectedItemId = expectedOrder[this.state.room4BallSequence.length];
      if (selectedItem.id !== expectedItemId) {
        for (const itemId of this.state.room4BallPlacedItems) {
          this.inventory.add(ITEM_INFO[itemId]);
        }
        this.state.room4BallSequence = [];
        this.state.room4BallPlacedItems = [];
        this.clearRoom4BoardMarkers();
        this.ui.showMessage("That order seems wrong.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.room4BallSequence.push(selectedItem.id);
      this.state.room4BallPlacedItems.push(selectedItem.id);
      this.inventory.remove(selectedItem.id);
      this.addRoom4BoardMarker(selectedItem.id);

      if (this.state.room4BallSequence.length === expectedOrder.length) {
        this.state.room4BallSequence = [];
        this.state.room4BallPlacedItems = [];
        this.state.room4LockerUnlocked = true;
        if (this.room4LockerLeftDoor) {
          this.room4LockerLeftDoor.material.color.setHex(0x9ee4aa);
        }
        if (this.room4LockerRightDoor) {
          this.room4LockerRightDoor.material.color.setHex(0x9ee4aa);
        }
        this.ui.showMessage("You hear the locker unlock.");
        return { changedRoom: false, spawn: null, won: false, playSound: { type: "unlock" } };
      } else {
        this.ui.showMessage("A colored ball clicks into place.");
        const colorMap = {
          blueBall: "blue",
          redBall: "red",
          yellowBall: "yellow",
          greenBall: "green",
        };
        return {
          changedRoom: false,
          spawn: null,
          won: false,
          playSound: { type: "cabinetButton", colorName: colorMap[selectedItem.id] },
        };
      }
    }

    if (kind === "room4Locker") {
      if (!this.state.room4LockerUnlocked) {
        this.ui.showMessage("The locker is locked.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.state.room4LockerOpened) {
        if (this.state.badmintonRacketTaken && this.state.shuttlecockTaken) {
          this.ui.showMessage("The locker is open and empty now.");
        } else {
          this.ui.showMessage("The locker is open. There are sports items inside.");
        }
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.room4LockerOpened = true;
      if (this.room4LockerLeftDoor) {
        this.room4LockerLeftDoor.position.x -= 0.36;
        this.room4LockerLeftDoor.position.z += 0.2;
        this.room4LockerLeftDoor.rotation.y = 0.56;
      }
      if (this.room4LockerRightDoor) {
        this.room4LockerRightDoor.position.x += 0.36;
        this.room4LockerRightDoor.position.z += 0.2;
        this.room4LockerRightDoor.rotation.y = -0.56;
      }
      this.interactiveObjects = this.interactiveObjects.filter(
        (entry) =>
          entry !== this.room4LockerBody &&
          entry !== this.room4LockerLeftDoor &&
          entry !== this.room4LockerRightDoor &&
          entry !== this.room4LockerHitbox,
      );
      this.addRoom4LockerItems();
      this.ui.showMessage("The locker opened.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "room4Target") {
      const litTarget = object.userData.visualTarget || object;

      if (!(this.inventory.has("badmintonRacket") && this.inventory.has("shuttlecock"))) {
        this.ui.showMessage("Collect both the badminton racquet and shuttlecock first.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.state.room4CodeRevealed) {
        this.ui.showMessage("The targets reveal numbers: 731");
        return { changedRoom: false, spawn: null, won: false };
      }

      const expectedOrder = ["left", "right", "center"];
      const expectedTarget = expectedOrder[this.state.room4TargetSequence.length];
      if (object.userData.targetName !== expectedTarget) {
        this.state.room4TargetSequence = [];
        for (const target of this.room4Targets) {
          const visibleTarget = target.userData?.visualTarget || target;
          if (visibleTarget.material?.emissive) {
            visibleTarget.material.emissive.setHex(0x101318);
            visibleTarget.material.emissiveIntensity = 0.2;
          }
        }
        this.ui.showMessage("Missed the pattern.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.room4TargetSequence.push(object.userData.targetName);
      if (litTarget.material?.emissive) {
        litTarget.material.emissive.setHex(litTarget.material.color.getHex());
        litTarget.material.emissiveIntensity = 1.1;
      }

      if (this.state.room4TargetSequence.length === expectedOrder.length) {
        this.state.room4TargetSequence = [];
        this.state.room4CodeRevealed = true;
        if (this.room4CodeCard) {
          this.room4CodeCard.visible = true;
        }
        this.ui.showMessage("The targets reveal numbers: 731");
        const targetToneMap = {
          left: "blue",
          center: "yellow",
          right: "red",
        };
        return {
          changedRoom: false,
          spawn: null,
          won: false,
          playSound: { type: "cabinetButton", colorName: targetToneMap[object.userData.targetName] },
        };
      } else {
        this.ui.showMessage(`${object.userData.label} lights up. Keep going.`);
        const targetToneMap = {
          left: "blue",
          center: "yellow",
          right: "red",
        };
        return {
          changedRoom: false,
          spawn: null,
          won: false,
          playSound: { type: "cabinetButton", colorName: targetToneMap[object.userData.targetName] },
        };
      }
    }

    if (kind === "room4Scoreboard") {
      if (!this.state.room4CodeRevealed) {
        this.ui.showMessage("Maybe the badminton targets hide a number code.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.state.room4SportsRackUnlocked) {
        this.ui.showMessage("The sports rack is already unlocked.");
        return { changedRoom: false, spawn: null, won: false };
      }

      return {
        changedRoom: false,
        spawn: null,
        won: false,
        openCodeEntry: {
          type: "room4Scoreboard",
          title: "Scoreboard Code",
          prompt: "Enter the 3-digit code.",
          maxLength: 3,
          submitLabel: "Unlock",
        },
      };
    }

    if (kind === "room4SportsRack") {
      if (!this.state.room4SportsRackUnlocked) {
        this.ui.showMessage("The sports rack is locked.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.state.room4SportsRackOpened) {
        if (this.state.tennisRacketTaken && this.state.tennisBallTaken) {
          this.ui.showMessage("The sports rack is open and empty now.");
        } else {
          this.ui.showMessage("The sports rack is open. There are tennis items inside.");
        }
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.room4SportsRackOpened = true;
      if (this.room4SportsRackDoor) {
        this.room4SportsRackDoor.position.x += 0.46;
        this.room4SportsRackDoor.position.z += 0.18;
        this.room4SportsRackDoor.rotation.y = -0.6;
      }
      this.interactiveObjects = this.interactiveObjects.filter((entry) => entry.userData.kind !== "room4SportsRack");
      this.addRoom4SportsRackItems();
      this.ui.showMessage("The sports rack opened.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "room4BounceWall") {
      if (!selectedItem || selectedItem.id !== "tennisBallItem") {
        this.ui.showMessage("You need the tennis ball.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!this.inventory.has("tennisRacket")) {
        this.ui.showMessage("You need the tennis racquet too.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.state.room4ToyChestOpened) {
        this.ui.showMessage("The chest is already open.");
        return { changedRoom: false, spawn: null, won: false };
      }

      const now = performance.now();
      const expectedPattern = ["short", "pause", "short", "short", "short"];

      if (this.state.room4BounceSequenceStep === 0) {
        this.state.room4BounceSequenceStep = 1;
        this.state.room4LastBounceAt = now;
        if (this.room4BounceWall?.material?.emissive) {
          this.room4BounceWall.material.emissive.setHex(0x40678f);
          this.room4BounceWall.material.emissiveIntensity = 0.4;
        }
        this.ui.showMessage("Bounce Bounce Pause Bounce Bounce Bounce Bounce");
        return { changedRoom: false, spawn: null, won: false, playSound: { type: "bounceWall" } };
      }

      const gap = now - this.state.room4LastBounceAt;
      const expectedBeat = expectedPattern[this.state.room4BounceSequenceStep - 1];
      const isCorrectGap =
        (expectedBeat === "short" && gap >= 120 && gap <= 700) ||
        (expectedBeat === "pause" && gap >= 850 && gap <= 1800);

      if (!isCorrectGap) {
        this.state.room4BounceSequenceStep = 0;
        this.state.room4LastBounceAt = 0;
        if (this.room4BounceWall?.material?.emissive) {
          this.room4BounceWall.material.emissive.setHex(0x000000);
          this.room4BounceWall.material.emissiveIntensity = 0;
        }
        this.ui.showMessage("That rhythm is off.");
        return { changedRoom: false, spawn: null, won: false, playSound: { type: "bounceWall" } };
      }

      this.state.room4BounceSequenceStep += 1;
      this.state.room4LastBounceAt = now;

      if (this.state.room4BounceSequenceStep === 6) {
        this.state.room4BounceSequenceStep = 0;
        this.state.room4LastBounceAt = 0;
        this.state.room4ToyChestOpened = true;
        if (this.room4BounceWall?.material?.emissive) {
          this.room4BounceWall.material.emissive.setHex(0x7fd2ff);
          this.room4BounceWall.material.emissiveIntensity = 0.8;
        }
        if (this.room4ToyChestLid) {
          this.room4ToyChestLid.position.y += 0.34;
          this.room4ToyChestLid.position.z -= 0.24;
          this.room4ToyChestLid.rotation.x = -0.94;
        }
        this.interactiveObjects = this.interactiveObjects.filter(
          (entry) => entry !== this.room4ToyChestBody && entry !== this.room4ToyChestLid && entry !== this.room4ToyChestHitbox,
        );
        this.addRoom4PlayBlocks();
        this.ui.showMessage("You hear a chest open.");
      } else {
        this.ui.showMessage("Bounce Bounce Pause Bounce Bounce Bounce Bounce");
      }
      return { changedRoom: false, spawn: null, won: false, playSound: { type: "bounceWall" } };
    }

    if (kind === "room4ToyChest") {
      if (!this.state.room4ToyChestOpened) {
        this.ui.showMessage("The toy chest is still closed.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.ui.showMessage("The toy chest is open. There are letter blocks inside.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "room4ShapeSlot") {
      const remainingBlocks = ["blockP", "blockL", "blockA", "blockY"].filter((itemId) => this.inventory.has(itemId));

      if (remainingBlocks.length === 0) {
        this.ui.showMessage("Maybe the letter blocks belong here.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.state.room4HiddenPanelOpened) {
        this.ui.showMessage("The hidden panel is already open.");
        return { changedRoom: false, spawn: null, won: false };
      }

      const selectedBlockMap = {
        blockP: "P",
        blockL: "L",
        blockA: "A",
        blockY: "Y",
      };

      if (!selectedItem || !selectedBlockMap[selectedItem.id]) {
        this.ui.showMessage("Select a letter block from your toolbox first.");
        return { changedRoom: false, spawn: null, won: false };
      }

      const selectedLetter = selectedBlockMap[selectedItem.id];
      if (
        this.state.room4PlacedBlocks.includes(object.userData.itemId) ||
        selectedLetter !== object.userData.letter ||
        object.userData.itemId !== selectedItem.id
      ) {
        for (const itemId of this.state.room4PlacedBlocks) {
          this.inventory.add(ITEM_INFO[itemId]);
        }
        this.state.room4WordSequence = [];
        this.state.room4PlacedBlocks = [];
        this.clearRoom4PlacedLetters();
        for (const slot of this.room4ShapeSlots) {
          if (slot.material?.emissive) {
            slot.material.emissive.setHex(0x000000);
            slot.material.emissiveIntensity = 0;
          }
        }
        this.ui.showMessage("That arrangement reset.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.room4WordSequence.push(object.userData.letter);
      this.state.room4PlacedBlocks.push(selectedItem.id);
      this.inventory.remove(selectedItem.id);
      if (object.material?.emissive) {
        object.material.emissive.setHex(0xffffff);
        object.material.emissiveIntensity = 0.45;
      }
      const slotDef = this.room4ShapeSlotDefs.find((entry) => entry.letter === object.userData.letter);
      if (slotDef) {
        this.addRoom4PlacedLetter(slotDef);
      }

      if (this.state.room4PlacedBlocks.length === 4) {
        this.state.room4WordSequence = [];
        this.state.room4PlacedBlocks = [];
        for (const slot of this.room4ShapeSlots) {
          if (slot.material?.emissive) {
            slot.material.emissive.setHex(0x000000);
            slot.material.emissiveIntensity = 0;
          }
        }
        this.state.room4HiddenPanelOpened = true;
        if (this.room4HiddenPanel) {
          this.room4HiddenPanel.position.x += 0.95;
          this.room4HiddenPanel.position.z -= 0.28;
          this.room4HiddenPanel.rotation.y = -0.72;
        }
        if (this.room4HiddenPanelLabel) {
          this.room4HiddenPanelLabel.visible = true;
          // Put the words on the opened panel side that faces the exit door.
          this.room4HiddenPanelLabel.position.set(11.08, 2.03, 1.4);
          this.room4HiddenPanelLabel.rotation.y = 0;
        }
        if (this.room4HiddenPanelFrame) {
          this.room4HiddenPanelFrame.material.color.setHex(0xffefad);
          this.room4HiddenPanelFrame.material.emissive = new THREE.Color(0xffd76a);
          this.room4HiddenPanelFrame.material.emissiveIntensity = 0.45;
        }
        this.interactiveObjects = this.interactiveObjects.filter((entry) => entry.userData.kind !== "room4HiddenPanel");
        this.addRoom4UvTorch();
        this.ui.showMessage("A hidden panel opened.");
        return { changedRoom: false, spawn: null, won: false, playSound: { type: "drawerClick" } };
      } else {
        this.ui.showMessage(`${object.userData.letter} fits.`);
        const slotToneMap = {
          P: "green",
          L: "yellow",
          A: "blue",
          Y: "red",
        };
        return {
          changedRoom: false,
          spawn: null,
          won: false,
          playSound: { type: "cabinetButton", colorName: slotToneMap[object.userData.letter] },
        };
      }
    }

    if (kind === "room4HiddenPanel") {
      if (!this.state.room4HiddenPanelOpened) {
        this.ui.showMessage("The panel is still shut.");
      } else {
        if (this.state.room4UvTorchTaken) {
          this.ui.showMessage("The panel is open and empty now.");
        } else {
          this.ui.showMessage("A hidden panel opened.");
        }
      }
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "room4ArrowPanel") {
      const litPanel = object.userData.visualTarget || object;

      if (!this.inventory.has("room4UvTorch")) {
        this.ui.showMessage("Maybe something can reveal the arrow path first.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.selectedItem?.id !== "room4UvTorch" && !this.state.room4ArrowsShownOnce) {
        this.ui.showMessage("Use the UV torch to find the arrows first.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.state.room4FinalCabinetUnlocked) {
        this.ui.showMessage("The final cabinet is already unlocked.");
        return { changedRoom: false, spawn: null, won: false };
      }

      const expectedOrder = ["up", "left", "right", "down"];
      const expectedDirection = expectedOrder[this.state.room4ArrowPanelSequence.length];

      if (object.userData.direction !== expectedDirection) {
        this.state.room4ArrowPanelSequence = [];
        this.clearRoom4ArrowPanels();
        this.ui.showMessage("That path reset.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.room4ArrowPanelSequence.push(object.userData.direction);
      if (litPanel.material?.emissive) {
        litPanel.material.emissive.setHex(0xffffff);
        litPanel.material.emissiveIntensity = 0.95;
      }

      if (this.state.room4ArrowPanelSequence.length === expectedOrder.length) {
        this.state.room4ArrowPanelSequence = [];
        this.state.room4FinalCabinetUnlocked = true;
        this.clearRoom4ArrowPanels();
        if (this.room4FinalCabinetLeftDoor) {
          this.room4FinalCabinetLeftDoor.material.color.setHex(0x9ee4aa);
        }
        if (this.room4FinalCabinetRightDoor) {
          this.room4FinalCabinetRightDoor.material.color.setHex(0x9ee4aa);
        }
        this.ui.showMessage("You hear something unlock.");
        return { changedRoom: false, spawn: null, won: false, playSound: { type: "unlock" } };
      } else {
        this.ui.showMessage(`${object.userData.label} lights up.`);
        const arrowToneMap = {
          up: "blue",
          left: "red",
          right: "yellow",
          down: "green",
        };
        return {
          changedRoom: false,
          spawn: null,
          won: false,
          playSound: { type: "cabinetButton", colorName: arrowToneMap[object.userData.direction] },
        };
      }
    }

    if (kind === "room4FinalCabinet") {
      if (!this.state.room4FinalCabinetUnlocked) {
        this.ui.showMessage("The final cabinet is locked.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.state.room4FinalCabinetOpened) {
        this.ui.showMessage("The final cabinet is already open.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.room4FinalCabinetOpened = true;
      if (this.room4FinalCabinetLeftDoor) {
        this.room4FinalCabinetLeftDoor.position.x -= 0.34;
        this.room4FinalCabinetLeftDoor.position.z += 0.18;
        this.room4FinalCabinetLeftDoor.rotation.y = 0.56;
      }
      if (this.room4FinalCabinetRightDoor) {
        this.room4FinalCabinetRightDoor.position.x += 0.34;
        this.room4FinalCabinetRightDoor.position.z += 0.18;
        this.room4FinalCabinetRightDoor.rotation.y = -0.56;
      }
      this.interactiveObjects = this.interactiveObjects.filter((entry) => entry.userData.kind !== "room4FinalCabinet");
      if (!this.state.room4GameTilesShown) {
        this.state.room4GameTilesShown = true;
        this.addRoom4GameTiles();
      }
      this.ui.showMessage("These must be for the door.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "room4GameTiles") {
      this.ui.showMessage("These must be for the door.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "mixingConsole") {
      if (this.state.mixingConsolePowered && selectedItem?.id === "headphones") {
        this.state.rhythmClueHeard = true;
        this.ui.showMessage(
          "Snare - Snare - Kick - Floor Tom - Floor Tom - Floor Tom\n\nYou hear a rhythm clue.",
          3400,
        );
        return {
          changedRoom: false,
          spawn: null,
          won: false,
          playSound: {
            type: "rhythmSequence",
            sequence: ["snare", "snare", "kick", "floorTom", "floorTom", "floorTom"],
          },
        };
      }

      if (this.state.mixingConsolePowered) {
        this.ui.showMessage("The console is already on.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!selectedItem || selectedItem.id !== "audioCable") {
        this.ui.showMessage("It has no connection.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.mixingConsolePowered = true;
      this.inventory.remove("audioCable");
      if (this.mixingConsoleMeter) {
        this.mixingConsoleMeter.material.color.setHex(0x8de48e);
      }
      this.ui.showMessage("The console turned on.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "drumPad") {
      if (!this.state.rhythmClueHeard) {
        this.ui.showMessage("Maybe another clue tells you the drum rhythm.");
        return { changedRoom: false, spawn: null, won: false };
      }

      const expectedDrum = DRUM_RHYTHM_ORDER[this.state.drumSequence.length];
      if (object.userData.drumName !== expectedDrum) {
        this.state.drumSequence = [];
        this.ui.showMessage("Wrong rhythm.");
        return {
          changedRoom: false,
          spawn: null,
          won: false,
          playSound: { type: "drum", drum: object.userData.drumName },
        };
      }

      this.state.drumSequence.push(object.userData.drumName);
      if (this.state.drumSequence.length === DRUM_RHYTHM_ORDER.length) {
        this.state.drumSequence = [];
        this.state.guitarCaseUnlocked = true;
        if (this.guitarCase) {
          this.guitarCase.material.color.setHex(0x495661);
        }
        if (this.guitarCaseLid) {
          this.guitarCaseLid.material.color.setHex(0x7ed99d);
        }
        this.ui.showMessage("The guitar case unlocked.");
      } else {
        this.ui.showMessage("Tap.");
      }
      return {
        changedRoom: false,
        spawn: null,
        won: false,
        playSound: { type: "drum", drum: object.userData.drumName },
      };
    }

    if (kind === "guitarCase") {
      if (!this.state.guitarCaseUnlocked) {
        this.ui.showMessage("The guitar case is locked.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.state.guitarCaseOpened) {
        if (this.state.guitarPickTaken && this.state.noteCardTaken) {
          this.ui.showMessage("The guitar case is open and empty now.");
        } else {
          this.ui.showMessage("The guitar case is open. There are two things inside.");
        }
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.guitarCaseOpened = true;
      if (this.guitarCaseLid) {
        this.guitarCaseLid.position.y += 0.18;
        this.guitarCaseLid.position.z -= 0.18;
        this.guitarCaseLid.rotation.x = -0.84;
      }
      this.interactiveObjects = this.interactiveObjects.filter(
        (entry) => entry !== this.guitarCase && entry !== this.guitarCaseLid && entry !== this.guitarCaseHitbox,
      );
      this.addGuitarPick();
      this.addNoteCard();
      this.ui.showMessage("The guitar case opened.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "guitarString") {
      const guitarSound = { type: "guitar", stringNumber: object.userData.stringNumber };
      if (!selectedItem || selectedItem.id !== "guitarPick") {
        this.ui.showMessage("You need a guitar pick.");
        return { changedRoom: false, spawn: null, won: false };
      }

      const expectedString = GUITAR_STRING_ORDER[this.state.guitarStringSequence.length];
      if (object.userData.stringNumber !== expectedString) {
        this.state.guitarStringSequence = [];
        this.ui.showMessage("Wrong note order.");
        return { changedRoom: false, spawn: null, won: false, playSound: guitarSound };
      }

      this.state.guitarStringSequence.push(object.userData.stringNumber);
      if (this.state.guitarStringSequence.length === GUITAR_STRING_ORDER.length) {
        this.state.guitarStringSequence = [];
        this.state.recordPlayerOpened = true;
        if (this.recordPlayerLid) {
          this.recordPlayerLid.position.y += 0.28;
          this.recordPlayerLid.position.z -= 0.22;
          this.recordPlayerLid.rotation.x = -0.92;
        }
        this.addVinylRecord();
        this.ui.showMessage("The record player clicked open.");
      } else {
        this.ui.showMessage(`String ${object.userData.stringNumber}.`);
      }
      return { changedRoom: false, spawn: null, won: false, playSound: guitarSound };
    }

    if (kind === "recordPlayer") {
      if (!this.state.recordPlayerOpened) {
        this.ui.showMessage("The record player is shut tight.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.state.vinylRecordPlaced) {
        this.ui.showMessage("The lights are blinking in a pattern.", 2800);
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!this.state.vinylRecordTaken) {
        return this.handleCollectItem("vinylRecord");
      }

      if (!selectedItem || selectedItem.id !== "vinylRecord") {
        this.ui.showMessage("Maybe the record belongs on the player.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.vinylRecordPlaced = true;
      this.inventory.remove("vinylRecord");
      this.addPlayingRecordVisual();
      this.ui.showMessage("Music starts.\n\nThe lights are blinking in a pattern.", 3200);
      return { changedRoom: false, spawn: null, won: false, playSound: { type: "recordMusic" } };
    }

    if (kind === "wallButton") {
      const buttonSound = { type: "cabinetButton", colorName: object.userData.colorName };
      if (!this.state.vinylRecordPlaced) {
        this.ui.showMessage("The blinking lights must be the clue.");
        return { changedRoom: false, spawn: null, won: false, playSound: buttonSound };
      }

      if (this.state.finalCabinetUnlocked) {
        this.ui.showMessage("The cabinet is already unlocked.");
        return { changedRoom: false, spawn: null, won: false, playSound: buttonSound };
      }

      const expectedOrder = ["blue", "red", "blue", "green"];
      const expectedColor = expectedOrder[this.state.wallButtonSequence.length];
      if (object.userData.colorName !== expectedColor) {
        this.state.wallButtonSequence = [];
        this.ui.showMessage("Wrong order.");
        return { changedRoom: false, spawn: null, won: false, playSound: buttonSound };
      }

      this.state.wallButtonSequence.push(object.userData.colorName);
      if (this.state.wallButtonSequence.length === expectedOrder.length) {
        this.state.wallButtonSequence = [];
        this.state.finalCabinetUnlocked = true;
        if (this.finalCabinetDoor) {
          this.finalCabinetDoor.material.color.setHex(0x8dd8a1);
        }
        this.ui.showMessage("The cabinet unlocked.");
      } else {
        this.ui.showMessage(`${object.userData.colorName[0].toUpperCase()}${object.userData.colorName.slice(1)} button.`);
      }
      return { changedRoom: false, spawn: null, won: false, playSound: buttonSound };
    }

    if (kind === "finalCabinet") {
      if (!this.state.finalCabinetUnlocked) {
        this.ui.showMessage("The cabinet is locked.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!this.state.finalCabinetOpened) {
        this.state.finalCabinetOpened = true;
        if (this.finalCabinetDoor) {
          this.finalCabinetDoor.position.x += 0.46;
          this.finalCabinetDoor.position.z -= 0.22;
          this.finalCabinetDoor.rotation.y = -0.82;
        }
        this.interactiveObjects = this.interactiveObjects.filter(
          (entry) => entry !== this.finalCabinetBody && entry !== this.finalCabinetDoor,
        );
        this.addBeatTiles();
        this.ui.showMessage("These letters must be for the door.", 3000);
        return { changedRoom: false, spawn: null, won: false };
      }

      this.ui.showMessage("These letters must be for the door.", 3000);
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "beatTiles") {
      this.ui.showMessage("These letters must be for the door.", 3000);
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "livingDrawer") {
      if (this.state.livingDrawerOpened) {
        if (this.state.hammerTaken) {
          this.ui.showMessage("The drawer is already open and empty.");
        } else {
          this.ui.showMessage("The drawer is open. There is a hammer inside.");
        }
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.livingDrawerOpened = true;
      if (this.livingDrawerFront) {
        this.livingDrawerFront.position.z -= 0.52;
      }
      this.interactiveObjects = this.interactiveObjects.filter(
        (entry) => entry !== this.livingDrawerFront && entry !== this.livingDrawerHitbox,
      );
      this.addHammer();
      this.ui.showMessage("The drawer opened.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "pictureFrame") {
      if (this.state.frameBroken) {
        if (this.state.livingKeyTaken && this.state.uvTorchTaken) {
          this.ui.showMessage("The frame is broken and empty now.");
        } else {
          this.ui.showMessage("There are items hidden behind the broken frame.");
        }
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!selectedItem || selectedItem.id !== "hammer") {
        this.ui.showMessage("The glass looks fragile. Maybe a hammer could break it.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.frameBroken = true;
      if (this.frameGlass) {
        this.frameGlass.material.opacity = 0.08;
        this.frameGlass.material.color.setHex(0x7facc8);
      }
      this.interactiveObjects = this.interactiveObjects.filter(
        (entry) => entry !== this.frameBack && entry !== this.frameGlass && entry !== this.frameHitbox,
      );
      this.addFrameLoot();
      this.ui.showMessage("The picture frame broke open.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "livingCupboard") {
      if (this.state.cupboardUnlocked) {
        if (this.state.livingKnifeTaken) {
          this.ui.showMessage("The cupboard is open and empty now.");
        } else {
          this.ui.showMessage("The cupboard is open. There is a knife inside.");
        }
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!this.inventory.has("livingKey")) {
        this.ui.showMessage("It's locked. You need a key.");
        return { changedRoom: false, spawn: null, won: false };
      }

      return {
        changedRoom: false,
        spawn: null,
        won: false,
        openCodeEntry: {
          type: "livingCupboard",
          title: "Cupboard Code",
          prompt: "Enter the 4-letter code.",
          maxLength: 4,
          submitLabel: "Open",
        },
      };
    }

    if (kind === "smallBox") {
      if (this.state.boxOpened) {
        this.ui.showMessage("The clue says LOCK.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!selectedItem || selectedItem.id !== "livingKnife") {
        this.ui.showMessage("The box is taped shut.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.boxOpened = true;
      if (this.smallBoxLid) {
        this.smallBoxLid.position.y += 0.18;
        this.smallBoxLid.position.z -= 0.18;
        this.smallBoxLid.rotation.x = -0.9;
      }
      this.addLockClue();
      this.updateRoomClues();
      this.ui.showMessage("Inside the box, the clue says LOCK.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "room1Door") {
      if (this.state.room1DoorUnlocked) {
        this.state.roomComplete = true;
        this.ui.showMessage("You Escaped!");
        return { changedRoom: false, spawn: null, won: true };
      }

      if (!this.state.boxOpened) {
        this.ui.showMessage("The door needs the clue from the box.");
        return { changedRoom: false, spawn: null, won: false };
      }

      return {
        changedRoom: false,
        spawn: null,
        won: false,
        openCodeEntry: {
          type: "room1Door",
          title: "Exit Door Code",
          prompt: "Enter the 4-letter code.",
          maxLength: 4,
          submitLabel: "Unlock",
        },
      };
    }

    if (kind === "fridgeClue") {
      this.ui.showMessage("Red, Yellow, Green\nThis looks important.", 2800);
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "musicDrawer") {
      if (!this.state.musicDrawerUnlocked) {
        this.ui.showMessage("The drawer is locked.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.state.musicDrawerOpened) {
        if (this.state.headphonesTaken && this.state.audioCableTaken) {
          this.ui.showMessage("The drawer is open and empty now.");
        } else {
          this.ui.showMessage("The drawer is open. There are music tools inside.");
        }
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.musicDrawerOpened = true;
      if (this.musicDrawerFront) {
        this.musicDrawerFront.position.z -= 0.46;
      }
      this.interactiveObjects = this.interactiveObjects.filter((entry) => entry.userData.kind !== "musicDrawer");
      this.addHeadphones();
      this.addAudioCable();
      this.ui.showMessage("The drawer opened.");
      return {
        changedRoom: false,
        spawn: null,
        won: false,
        playSound: { type: "drawerClick" },
      };
    }

    if (kind === "upperCabinet") {
      if (this.state.upperCabinetOpened) {
        if (this.state.batteryTaken) {
          this.ui.showMessage("The upper cabinet is open and empty now.");
        } else {
          this.ui.showMessage("The upper cabinet is open. A battery is inside.");
        }
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!selectedItem || selectedItem.id !== "cabinetHandle") {
        this.ui.showMessage("This upper cabinet has a broken handle.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.upperCabinetOpened = true;
      this.inventory.remove("cabinetHandle");
      if (this.upperCabinetBrokenHandle) {
        this.roomGroup.remove(this.upperCabinetBrokenHandle);
        this.upperCabinetBrokenHandle = null;
      }

      this.upperCabinetAttachedHandle = this.makeBox([0.06, 0.28, 0.03], 0xf1e8dc);
      this.upperCabinetAttachedHandle.position.set(4.42, 3.35, -5.92);
      this.roomGroup.add(this.upperCabinetAttachedHandle);

      this.upperCabinetLeftDoor.position.x -= 0.54;
      this.upperCabinetLeftDoor.position.z += 0.16;
      this.upperCabinetLeftDoor.rotation.y = 0.78;

      this.upperCabinetRightDoor.position.x += 0.54;
      this.upperCabinetRightDoor.position.z += 0.16;
      this.upperCabinetRightDoor.rotation.y = -0.78;

      this.addBattery();
      this.ui.showMessage("You fixed the handle and opened the cabinet.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "scale") {
      if (!this.state.scalePowered) {
        if (!selectedItem || selectedItem.id !== "battery") {
          this.ui.showMessage("The scale needs a battery.");
          return { changedRoom: false, spawn: null, won: false };
        }

        this.state.scalePowered = true;
        this.inventory.remove("battery");
        this.scaleScreen.material.color.setHex(0x76d17d);
        this.setScaleText("ON");
        this.ui.showMessage("The scale turned on.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.state.scaleSolved) {
        this.ui.showMessage("The scale shows 482.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!selectedItem || !FRUIT_ORDER.includes(selectedItem.id)) {
        this.ui.showMessage("Try placing the fruits on the scale.");
        return { changedRoom: false, spawn: null, won: false };
      }

      const expectedFruit = FRUIT_ORDER[this.state.fruitSequence.length];
      if (selectedItem.id !== expectedFruit) {
        this.state.fruitSequence = [];
        this.restorePlacedFruits();
        this.clearScaleFruitMarkers();
        this.setScaleText("ERR", "#ffd1d1", "rgba(65, 18, 18, 0.95)");
        this.ui.showMessage("That order was wrong.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.fruitSequence.push(selectedItem.id);
      this.state.placedFruitItems.push(selectedItem.id);
      this.addScaleFruitMarker(selectedItem.id);
      this.inventory.remove(selectedItem.id);

      if (this.state.fruitSequence.length === FRUIT_ORDER.length) {
        this.state.scaleSolved = true;
        this.state.placedFruitItems = [];
        this.setScaleText("482");
        this.ui.showMessage("The scale shows 482.");
      } else {
        this.setScaleText(String(this.state.fruitSequence.length));
        this.ui.showMessage(`${selectedItem.label} is on the scale.`);
      }

      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "drawer") {
      if (this.state.drawerUnlocked) {
        if (this.state.spoonTaken) {
          this.ui.showMessage("The drawer is open and empty now.");
        } else {
          this.ui.showMessage("The drawer is open. There is a spoon inside.");
        }
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!this.state.scaleSolved) {
        this.ui.showMessage("Maybe the scale has a number code.");
        return { changedRoom: false, spawn: null, won: false };
      }

      return {
        changedRoom: false,
        spawn: null,
        won: false,
        openCodeEntry: {
          type: "drawer",
          title: "Drawer Code",
          prompt: "Enter the 3-digit code.",
          maxLength: 3,
          submitLabel: "Open",
        },
      };
    }

    if (kind === "jar") {
      if (this.state.jarKeyTaken) {
        this.ui.showMessage("The jar is empty now.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!selectedItem || selectedItem.id !== "spoon") {
        this.ui.showMessage("I can't reach it.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.jarKeyTaken = true;
      this.inventory.add(ITEM_INFO.smallKey);
      if (this.jarKeyVisual) {
        this.roomGroup.remove(this.jarKeyVisual);
        this.jarKeyVisual = null;
      }
      this.ui.showMessage("You fished out a key.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "pantry") {
      if (this.state.pantryUnlocked) {
        this.ui.showMessage("The pantry cupboard is open. There is a recipe card inside.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!this.inventory.has("smallKey")) {
        this.ui.showMessage("The pantry cupboard is locked.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.pantryUnlocked = true;
      this.pantryDoor.position.x -= 0.54;
      this.pantryDoor.position.z -= 0.28;
      this.pantryDoor.rotation.y = 0.82;
      this.interactiveObjects = this.interactiveObjects.filter(
        (entry) => entry !== this.pantryBody && entry !== this.pantryDoor,
      );
      this.addRecipeCard();
      this.state.recipeSeen = true;
      this.checkBreadBoxHint();
      this.ui.showMessage("What do these words make you think of?\nOven\nPie\nCake\nCook", 3600);
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "recipeCard") {
      this.state.recipeSeen = true;
      this.checkBreadBoxHint();
      this.ui.showMessage("What do these words make you think of?\nOven\nPie\nCake\nCook", 3600);
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "clueNote") {
      this.clueWordsFound.add(object.userData.word);
      this.ui.showMessage(object.userData.word, 2200);
      this.checkBreadBoxHint();
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "breadBox") {
      if (this.state.breadBoxUnlocked) {
        if (this.state.knifeTaken) {
          this.ui.showMessage("The bread box is open and empty now.");
        } else {
          this.ui.showMessage("The bread box is open. There is a knife inside.");
        }
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!this.state.pantryUnlocked || !this.state.recipeSeen) {
        this.ui.showMessage("The recipe clues should help with this code.");
        return { changedRoom: false, spawn: null, won: false };
      }

      return {
        changedRoom: false,
        spawn: null,
        won: false,
        openCodeEntry: {
          type: "breadBox",
          title: "Bread Box Code",
          prompt: "Enter the 4-letter code.",
          maxLength: 4,
          submitLabel: "Open",
        },
      };
    }

    if (kind === "flourBag") {
      if (this.state.flourBagOpened) {
        this.ui.showMessage("These letters must be for the door.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (!selectedItem || selectedItem.id !== "knife") {
        this.ui.showMessage("The flour bag is sealed shut.");
        return { changedRoom: false, spawn: null, won: false };
      }

      this.state.flourBagOpened = true;
      this.flourBag.position.x += 0.18;
      this.flourBag.rotation.z = -0.2;
      this.addFinalTiles();
      this.ui.showMessage("These letters must be for the door.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "finalTiles") {
      this.ui.showMessage("These letters must be for the door.");
      return { changedRoom: false, spawn: null, won: false };
    }

    if (kind === "exitDoor") {
      if (this.state.doorUnlocked) {
        this.state.roomComplete = true;
        this.ui.showMessage("You Escaped!");
        return { changedRoom: false, spawn: null, won: true };
      }

      if (this.currentRoomData.id === 3 && !this.state.beatTilesShown) {
        this.ui.showMessage("You still need the final door code.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.currentRoomData.id === 4 && !this.state.room4GameTilesShown) {
        this.ui.showMessage("You still need the final door code.");
        return { changedRoom: false, spawn: null, won: false };
      }

      if (this.currentRoomData.id !== 3 && this.currentRoomData.id !== 4 && !this.state.finalTilesShown) {
        this.ui.showMessage("You still need the final door code.");
        return { changedRoom: false, spawn: null, won: false };
      }

      return {
        changedRoom: false,
        spawn: null,
        won: false,
        openCodeEntry: {
          type: "exitDoor",
          title: "Exit Door Code",
          prompt: "Enter the 4-letter code.",
          maxLength: 4,
          submitLabel: "Unlock",
        },
      };
    }

    return { changedRoom: false, spawn: null, won: false };
  }

  submitCode(type, value) {
    const code = value.trim().toUpperCase();

    if (type === "livingCupboard") {
      if (code !== "TRUE") {
        this.ui.showMessage("Wrong code.");
        return { success: false };
      }

      this.state.cupboardUnlocked = true;
      if (this.cupboardDoor) {
        this.cupboardDoor.position.x += 0.52;
        this.cupboardDoor.position.z -= 0.26;
        this.cupboardDoor.rotation.y = -0.82;
      }
      this.interactiveObjects = this.interactiveObjects.filter(
        (entry) => entry !== this.cupboardBody && entry !== this.cupboardDoor && entry !== this.cupboardHitbox,
      );
      this.addLivingKnife();
      this.ui.showMessage("The cupboard opened.");
      return { success: true };
    }

    if (type === "room1Door") {
      if (code !== "LOCK") {
        this.ui.showMessage("Wrong code.");
        return { success: false };
      }

      this.state.room1DoorUnlocked = true;
      this.state.roomComplete = true;
      if (this.exitDoor) {
        this.exitDoor.material.color.setHex(0x7eddb0);
      }
      if (this.exitPanel) {
        this.exitPanel.material.color.setHex(0x7eddb0);
      }
      this.ui.showMessage("The door unlocked.");
      return { success: true, won: true };
    }

    if (type === "drawer") {
      if (code !== "482") {
        this.ui.showMessage("That didn't work.");
        return { success: false };
      }

      this.state.drawerUnlocked = true;
      if (this.drawerFront) {
        this.drawerFront.position.z += 0.5;
      }
      this.interactiveObjects = this.interactiveObjects.filter(
        (entry) => entry !== this.drawerBody && entry !== this.drawerFront,
      );
      this.addSpoon();
      this.ui.showMessage("The drawer opened.");
      return { success: true };
    }

    if (type === "breadBox") {
      if (code !== "BAKE") {
        this.ui.showMessage("That didn't work.");
        return { success: false };
      }

      this.state.breadBoxUnlocked = true;
      if (this.breadBoxLid) {
        this.breadBoxLid.position.y += 0.22;
        this.breadBoxLid.position.z -= 0.2;
        this.breadBoxLid.rotation.x = -0.8;
      }
      this.interactiveObjects = this.interactiveObjects.filter(
        (entry) => entry !== this.breadBoxBody && entry !== this.breadBoxLid && entry !== this.breadBoxHitbox,
      );
      this.addKnife();
      this.ui.showMessage("The bread box opened.");
      return { success: true };
    }

    if (type === "room4Scoreboard") {
      if (code !== "731") {
        this.ui.showMessage("That didn't work.");
        return { success: false };
      }

      this.state.room4SportsRackUnlocked = true;
      if (this.room4SportsRackBody) {
        this.room4SportsRackBody.material.color.setHex(0xf2b56a);
      }
      if (this.room4SportsRackDoor) {
        this.room4SportsRackDoor.material.color.setHex(0x9ee4aa);
      }
      this.ui.showMessage("The rack unlocked.");
      return { success: true, playSound: { type: "unlock" } };
    }

    if (type === "exitDoor") {
      const expectedCode =
        this.currentRoomData.id === 3 ? "BEAT" : this.currentRoomData.id === 4 ? "GAME" : "COOK";
      if (code !== expectedCode) {
        this.ui.showMessage("That didn't work.");
        return { success: false };
      }

      this.state.doorUnlocked = true;
      this.state.roomComplete = true;
      if (this.exitDoor) {
        this.exitDoor.material.color.setHex(0x6cf2a7);
      }
      if (this.exitPanel) {
        this.exitPanel.material.color.setHex(0x6cf2a7);
      }
      if (this.currentRoomData.id === 4 && this.room4FinalCabinetBody) {
        this.room4FinalCabinetBody.material.color.setHex(0xf2ecd9);
      }
      this.ui.showMessage("The door unlocked.");
      return { success: true, won: true };
    }

    return { success: false };
  }

  handleCollectItem(itemId) {
    const item = ITEM_INFO[itemId];
    if (!item || this.inventory.has(itemId)) {
      return { changedRoom: false, spawn: null, won: false };
    }

    this.inventory.add(item);
    this.removeCollectible(itemId);

    if (itemId === "hammer") {
      this.state.hammerTaken = true;
      this.ui.showMessage("You found a hammer.");
    } else if (itemId === "livingKey") {
      this.state.livingKeyTaken = true;
      this.ui.showMessage("You found a key.");
    } else if (itemId === "uvTorch") {
      this.state.uvTorchTaken = true;
      this.ui.showMessage("You found a UV torch.");
    } else if (itemId === "livingKnife") {
      this.state.livingKnifeTaken = true;
      this.ui.showMessage("You found a knife.");
    } else if (itemId === "cabinetHandle") {
      this.state.cabinetHandleTaken = true;
      this.ui.showMessage("You found a cabinet handle.");
    } else if (itemId === "battery") {
      this.state.batteryTaken = true;
      this.ui.showMessage("You found a battery.");
    } else if (itemId === "apple") {
      this.ui.showMessage("You found an apple.");
    } else if (itemId === "banana") {
      this.ui.showMessage("You found a banana.");
    } else if (itemId === "pear") {
      this.ui.showMessage("You found a pear.");
    } else if (itemId === "spoon") {
      this.state.spoonTaken = true;
      this.ui.showMessage("You found a spoon.");
    } else if (itemId === "knife") {
      this.state.knifeTaken = true;
      this.ui.showMessage("You found a knife.");
    } else if (itemId === "headphones") {
      this.state.headphonesTaken = true;
      this.ui.showMessage("You found headphones.");
    } else if (itemId === "audioCable") {
      this.state.audioCableTaken = true;
      this.ui.showMessage("You found an audio cable.");
    } else if (itemId === "guitarPick") {
      this.state.guitarPickTaken = true;
      this.ui.showMessage("You found a guitar pick.");
    } else if (itemId === "noteCard") {
      this.state.noteCardTaken = true;
      this.ui.showMessage("You found a note card.");
    } else if (itemId === "vinylRecord") {
      this.state.vinylRecordTaken = true;
      this.ui.showMessage("You found a record.");
    } else if (itemId === "blueBall") {
      this.ui.showMessage("You found a blue clue ball.");
    } else if (itemId === "redBall") {
      this.ui.showMessage("You found a red clue ball.");
    } else if (itemId === "yellowBall") {
      this.ui.showMessage("You found a yellow clue ball.");
    } else if (itemId === "greenBall") {
      this.ui.showMessage("You found a green clue ball.");
    } else if (itemId === "badmintonRacket") {
      this.state.badmintonRacketTaken = true;
      if (this.state.shuttlecockTaken) {
        this.ui.showMessage(
          "You found a badminton racquet. You only need both items in your inventory. Go to the badminton targets and click Left, Right, Center.",
          4200,
        );
      } else {
        this.ui.showMessage("You found a badminton racquet.");
      }
    } else if (itemId === "shuttlecock") {
      this.state.shuttlecockTaken = true;
      if (this.state.badmintonRacketTaken) {
        this.ui.showMessage(
          "You found a shuttlecock. You only need both items in your inventory. Go to the badminton targets and click Left, Right, Center.",
          4200,
        );
      } else {
        this.ui.showMessage("You found a shuttlecock.");
      }
    } else if (itemId === "tennisRacket") {
      this.state.tennisRacketTaken = true;
      this.ui.showMessage("You found a tennis racquet.");
    } else if (itemId === "tennisBallItem") {
      this.state.tennisBallTaken = true;
      this.ui.showMessage("You found a tennis ball.");
    } else if (itemId === "blockP" || itemId === "blockL" || itemId === "blockA" || itemId === "blockY") {
      this.ui.showMessage("These look like part of a word.");
    } else if (itemId === "room4UvTorch") {
      this.state.room4UvTorchTaken = true;
      this.ui.showMessage("You found a UV torch.");
    }

    return { changedRoom: false, spawn: null, won: false };
  }
}
