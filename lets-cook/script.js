document.addEventListener('DOMContentLoaded', function() {
    const board = document.querySelector('.board');
    const redDice = document.getElementById('red-dice');
    const blueDice = document.getElementById('blue-dice');
    const spinSection = document.getElementById('spin-section');
    const startWheel = document.getElementById('start-wheel');
    const spinButton = document.getElementById('spin-button');
    const spinResult = document.getElementById('spin-result');
    const rollRedButton = document.getElementById('roll-red-button');
    const rollBlueButton = document.getElementById('roll-blue-button');
    const restartButton = document.getElementById('restart-button');
    const resetPawnsButton = document.getElementById('reset-pawns-button');
    const redScoreSpan = document.getElementById('red-score');
    const blueScoreSpan = document.getElementById('blue-score');
    const winnerPopup = document.getElementById('winner-popup');
    const cellsByNumber = new Map();
    const BURNT_FOOD_CELL = 7;
    const BURNT_FOOD_BACK_STEPS = 2;
    const COOKIE_CONTEST_CELL = 16;
    const COOKIE_CONTEST_FORWARD_STEPS = 2;
    const BAD_PIZZA_CELL = 25;
    const BAD_PIZZA_BACK_STEPS = 3;
    const PERFECT_CAKE_CELL = 31;
    const PERFECT_CAKE_FORWARD_STEPS = 3;
    const LAST_IN_CONTEST_CELL = 39;
    const LAST_IN_CONTEST_BACK_STEPS = 2;
    const MUFFINS_SAVED_CELL = 46;
    const MUFFINS_SAVED_FORWARD_STEPS = 2;
    const FLOUR_SPILLED_CELL = 53;
    const FLOUR_SPILLED_BACK_STEPS = 3;
    const FLOUR_CAUGHT_CELL = 61;
    const FLOUR_CAUGHT_FORWARD_STEPS = 3;
    const AMAZING_COOKIES_CELL = 68;
    const AMAZING_COOKIES_FORWARD_STEPS = 1;
    const PASTA_SPILLED_CELL = 74;
    const PASTA_SPILLED_BACK_STEPS = 2;
    const CHEATED_CONTEST_CELL = 79;
    const CHEATED_CONTEST_BACK_STEPS = 3;
    const AMAZING_PIZZA_CELL = 86;
    const AMAZING_PIZZA_FORWARD_STEPS = 2;
    const LOST_INGREDIENTS_CELL = 93;
    const LOST_INGREDIENTS_BACK_STEPS = 1;
    const ARROW_UP_CELL = 18;
    const ARROW_UP_TARGET_CELL = 23;
    const ARROW_UP_CELL_2 = 84;
    const ARROW_UP_TARGET_CELL_2 = 97;
    const BACK_STEP_DELAY_MS = 450;
    const SPECIAL_ACTION_DELAY_MS = 700;
    const LADDER_STEP_DELAY_MS = 420;
    const ARROW_ACTION_DELAY_MS = 1100;
    const LADDER_ACTION_DELAY_MS = 1100;
    const LADDER_DOWN_MAP = new Map([
        [77, 44],
        [32, 9]
    ]);
    const LADDER_TOP_SET = new Set(LADDER_DOWN_MAP.keys());
    const LADDER_BOTTOM_SET = new Set(LADDER_DOWN_MAP.values());
    let currentTurn = 'red';
    let gameStarted = false;
    let firstMoveDone = false;
    let wheelRotation = 0;
    let winnerPopupTimeoutId = null;
    let autoResetTimeoutId = null;
    let ladderOverlay = null;
    let audioContext = null;
    const voiceCache = {
        natural: null,
        warm: null,
        bright: null
    };

    // Generate a 1-100 Snakes-and-Ladders style board (numbers only).
    // Bottom row is 1-10, next is 20-11, continuing in zigzag rows.
    for (let r = 0; r < 10; r++) {
        const rowFromBottom = 9 - r;
        for (let c = 0; c < 10; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            let num;

            if (rowFromBottom % 2 === 0) {
                num = rowFromBottom * 10 + c + 1;
            } else {
                num = rowFromBottom * 10 + (10 - c);
            }

            cell.dataset.number = String(num);

            const label = document.createElement('span');
            label.className = 'cell-number';
            if (num === BURNT_FOOD_CELL) {
                cell.classList.add('special-seven');
                label.textContent = "7. Oh no! Your food burned! Move back two steps.";
            } else if (num === COOKIE_CONTEST_CELL) {
                cell.classList.add('special-sixteen');
                label.textContent = "16. Yay! Your cookies won a contest! Move ahead 2 steps.";
            } else if (num === BAD_PIZZA_CELL) {
                cell.classList.add('special-twentyfive');
                label.textContent = "25. Oh no! Your pizza tastes bad! Move back 3 steps.";
            } else if (num === PERFECT_CAKE_CELL) {
                cell.classList.add('special-thirtyone');
                label.textContent = "31. Wow! Your cake is perfect! Move forwad 3 steps.";
            } else if (num === LAST_IN_CONTEST_CELL) {
                cell.classList.add('special-thirtynine');
                label.textContent = "39. Oh no! You were last in a cooking contest! Move back 2 steps.";
            } else if (num === MUFFINS_SAVED_CELL) {
                cell.classList.add('special-fortysix');
                label.textContent = "46. Yay! You saved your muffins from being burnt! Move ahead 2 steps.";
            } else if (num === FLOUR_SPILLED_CELL) {
                cell.classList.add('special-fiftythree');
                label.textContent = "53. Oh no! Your flour slipped and spilled! Move back 3 steps.";
            } else if (num === FLOUR_CAUGHT_CELL) {
                cell.classList.add('special-sixtyone');
                label.textContent = "61. You caught your flour before it spilt! Move ahead 3 steps";
            } else if (num === AMAZING_COOKIES_CELL) {
                cell.classList.add('special-sixtyeight');
                label.textContent = "68. Wow your cookies smell amazing! Move ahead 1 step";
            } else if (num === PASTA_SPILLED_CELL) {
                cell.classList.add('special-seventyfour');
                label.textContent = "74. Your pasta spilled! Move back two steps";
            } else if (num === CHEATED_CONTEST_CELL) {
                cell.classList.add('special-seventynine');
                label.textContent = "79. You cheated in a cooking contest! Move back 3 steps";
            } else if (num === AMAZING_PIZZA_CELL) {
                cell.classList.add('special-eightysix');
                label.textContent = "86. Your pizza tastes amazing! move ahead 2 steps";
            } else if (num === LOST_INGREDIENTS_CELL) {
                cell.classList.add('special-ninetythree');
                label.textContent = "93. Oh no! Your ingredients are lost! Move back 1 step";
            } else {
                label.textContent = num;
            }
            if (num === ARROW_UP_CELL) {
                cell.classList.add('arrow-up-cell');
            }
            if (num === ARROW_UP_CELL_2) {
                cell.classList.add('arrow-up-cell');
            }
            if (LADDER_TOP_SET.has(num)) {
                cell.classList.add('ladder-top-cell');
            }
            if (LADDER_BOTTOM_SET.has(num)) {
                cell.classList.add('ladder-bottom-cell');
            }

            cell.appendChild(label);

            if (LADDER_TOP_SET.has(num) || LADDER_BOTTOM_SET.has(num)) {
                const ladderNote = document.createElement('span');
                const isLadderTop = LADDER_TOP_SET.has(num);
                ladderNote.className = `ladder-note ${isLadderTop ? 'ladder-note-top' : 'ladder-note-bottom'}`;
                ladderNote.textContent = isLadderTop ? 'Start of ladder' : 'End of ladder';
                cell.appendChild(ladderNote);
            }

            const pawnStack = document.createElement('div');
            pawnStack.className = 'pawn-stack';
            cell.appendChild(pawnStack);

            cellsByNumber.set(num, cell);
            board.appendChild(cell);
        }
    }

    function createSvgElement(tag) {
        return document.createElementNS('http://www.w3.org/2000/svg', tag);
    }

    function drawSingleLadder(topCell, bottomCell) {
        if (!ladderOverlay) {
            return;
        }

        const boardRect = board.getBoundingClientRect();
        const topRect = topCell.getBoundingClientRect();
        const bottomRect = bottomCell.getBoundingClientRect();

        const topX = topRect.left - boardRect.left + (topRect.width / 2);
        const topY = topRect.top - boardRect.top + (topRect.height / 2);
        const bottomX = bottomRect.left - boardRect.left + (bottomRect.width / 2);
        const bottomY = bottomRect.top - boardRect.top + (bottomRect.height / 2);

        const dx = bottomX - topX;
        const dy = bottomY - topY;
        const length = Math.hypot(dx, dy);
        if (length === 0) {
            return;
        }

        const perpX = -dy / length;
        const perpY = dx / length;
        const railOffset = Math.max(5, Math.min(10, length * 0.05));
        const rungCount = Math.max(5, Math.floor(length / 24));

        const rail1 = createSvgElement('line');
        rail1.setAttribute('class', 'ladder-rail');
        rail1.setAttribute('x1', String(topX + perpX * railOffset));
        rail1.setAttribute('y1', String(topY + perpY * railOffset));
        rail1.setAttribute('x2', String(bottomX + perpX * railOffset));
        rail1.setAttribute('y2', String(bottomY + perpY * railOffset));
        ladderOverlay.appendChild(rail1);

        const rail2 = createSvgElement('line');
        rail2.setAttribute('class', 'ladder-rail');
        rail2.setAttribute('x1', String(topX - perpX * railOffset));
        rail2.setAttribute('y1', String(topY - perpY * railOffset));
        rail2.setAttribute('x2', String(bottomX - perpX * railOffset));
        rail2.setAttribute('y2', String(bottomY - perpY * railOffset));
        ladderOverlay.appendChild(rail2);

        for (let i = 1; i < rungCount; i++) {
            const t = i / rungCount;
            const midX = topX + dx * t;
            const midY = topY + dy * t;
            const rung = createSvgElement('line');
            rung.setAttribute('class', 'ladder-rung');
            rung.setAttribute('x1', String(midX + perpX * railOffset * 0.95));
            rung.setAttribute('y1', String(midY + perpY * railOffset * 0.95));
            rung.setAttribute('x2', String(midX - perpX * railOffset * 0.95));
            rung.setAttribute('y2', String(midY - perpY * railOffset * 0.95));
            ladderOverlay.appendChild(rung);
        }
    }

    function drawLadderOverlay() {
        if (!ladderOverlay) {
            ladderOverlay = createSvgElement('svg');
            ladderOverlay.setAttribute('class', 'ladder-overlay');
            board.appendChild(ladderOverlay);
        }

        const width = board.clientWidth;
        const height = board.clientHeight;
        ladderOverlay.setAttribute('width', String(width));
        ladderOverlay.setAttribute('height', String(height));
        ladderOverlay.setAttribute('viewBox', `0 0 ${width} ${height}`);

        while (ladderOverlay.firstChild) {
            ladderOverlay.removeChild(ladderOverlay.firstChild);
        }

        LADDER_DOWN_MAP.forEach(function(bottom, top) {
            const topCell = cellsByNumber.get(top);
            const bottomCell = cellsByNumber.get(bottom);
            if (topCell && bottomCell) {
                drawSingleLadder(topCell, bottomCell);
            }
        });
    }

    function movePawnToCell(pawn, targetCell) {
        const targetStack = targetCell.querySelector('.pawn-stack');
        targetStack.appendChild(pawn);
    }

    function getCellCenterInBoard(cell) {
        const boardRect = board.getBoundingClientRect();
        const cellRect = cell.getBoundingClientRect();
        return {
            x: cellRect.left - boardRect.left + (cellRect.width / 2),
            y: cellRect.top - boardRect.top + (cellRect.height / 2)
        };
    }

    function createPawn(id, colorClass) {
        const pawn = document.createElement('div');
        pawn.id = id;
        pawn.className = `pawn ${colorClass}`;
        pawn.title = id.replace('-', ' ');
        return pawn;
    }

    const pawnRed = createPawn('pawn-red', 'pawn-red');
    const pawnBlue = createPawn('pawn-blue', 'pawn-blue');
    const pawns = [pawnRed, pawnBlue];
    const scores = {
        red: 0,
        blue: 0
    };
    const pawnState = new Map([
        [pawnRed.id, { color: 'red', position: 1 }],
        [pawnBlue.id, { color: 'blue', position: 1 }]
    ]);
    drawLadderOverlay();
    window.requestAnimationFrame(drawLadderOverlay);
    window.addEventListener('resize', drawLadderOverlay);
    refreshVoiceCache();
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = refreshVoiceCache;
    }

    function updateScoreboard() {
        redScoreSpan.textContent = scores.red;
        blueScoreSpan.textContent = scores.blue;
    }

    function showWinnerPopup(color) {
        if (winnerPopupTimeoutId) {
            window.clearTimeout(winnerPopupTimeoutId);
        }
        if (autoResetTimeoutId) {
            window.clearTimeout(autoResetTimeoutId);
        }

        const winnerText = `${color === 'red' ? 'Red' : 'Blue'} wins`;
        winnerPopup.textContent = winnerText;
        winnerPopup.classList.remove('hidden');
        speakAnnouncement(winnerText);

        winnerPopupTimeoutId = window.setTimeout(function() {
            winnerPopup.classList.add('hidden');
            winnerPopupTimeoutId = null;
            autoResetTimeoutId = window.setTimeout(function() {
                resetPawnsToStart();
                autoResetTimeoutId = null;
            }, 500);
        }, 5000);
    }

    function placePawn(pawn, targetCell, shouldCount) {
        const state = pawnState.get(pawn.id);
        const targetNumber = Number(targetCell.dataset.number);
        const previousNumber = state.position;

        movePawnToCell(pawn, targetCell);
        state.position = targetNumber;

        if (shouldCount && previousNumber !== 100 && targetNumber === 100) {
            scores[state.color] += 1;
            updateScoreboard();
            showWinnerPopup(state.color);
        }
    }

    function sleep(ms) {
        return new Promise(function(resolve) {
            window.setTimeout(resolve, ms);
        });
    }

    function ensureDicePips(diceEl) {
        if (diceEl.querySelector('.pip')) {
            return;
        }
        diceEl.textContent = '';
        for (let i = 0; i < 9; i++) {
            const pip = document.createElement('span');
            pip.className = 'pip';
            diceEl.appendChild(pip);
        }
    }

    function setPipPosition(pip, gridPos) {
        const positions = {
            1: { x: 50, y: 50 },
            2: { x: 20, y: 20 },
            3: { x: 50, y: 20 },
            4: { x: 80, y: 20 },
            5: { x: 20, y: 50 },
            6: { x: 50, y: 50 },
            7: { x: 80, y: 50 },
            8: { x: 20, y: 80 },
            9: { x: 50, y: 80 },
            10: { x: 80, y: 80 }
        };
        const pos = positions[gridPos];
        pip.style.left = `${pos.x}%`;
        pip.style.top = `${pos.y}%`;
    }

    function renderDiceFace(diceEl, value) {
        ensureDicePips(diceEl);
        const pips = Array.from(diceEl.querySelectorAll('.pip'));
        pips.forEach(function(pip) {
            pip.classList.remove('show');
        });

        const layouts = {
            1: [6],
            2: [2, 10],
            3: [2, 6, 10],
            4: [2, 4, 8, 10],
            5: [2, 4, 6, 8, 10],
            6: [2, 4, 5, 7, 8, 10]
        };
        const layout = layouts[value] || layouts[1];

        layout.forEach(function(gridPos, index) {
            const pip = pips[index];
            if (!pip) {
                return;
            }
            setPipPosition(pip, gridPos);
            pip.classList.add('show');
        });
    }

    async function animateDiceRoll(diceEl, finalValue) {
        const frames = 12;
        diceEl.classList.add('dice-rolling');

        for (let i = 0; i < frames; i++) {
            const tempValue = Math.floor(Math.random() * 6) + 1;
            renderDiceFace(diceEl, tempValue);
            diceEl.classList.toggle('dice-hidden', i % 2 === 0);
            await sleep(70);
        }

        diceEl.classList.remove('dice-hidden');
        diceEl.classList.remove('dice-rolling');
        renderDiceFace(diceEl, finalValue);
    }

    function pickSpeechVoice(preferredNameParts) {
        if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
            return null;
        }

        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) {
            return null;
        }

        for (const part of preferredNameParts) {
            const found = voices.find(function(voice) {
                return voice.name.toLowerCase().includes(part.toLowerCase());
            });
            if (found) {
                return found;
            }
        }

        const englishVoice = voices.find(function(voice) {
            return voice.lang && voice.lang.toLowerCase().startsWith('en');
        });
        return englishVoice || voices[0];
    }

    function scoreVoice(voice, preferredParts) {
        const name = (voice.name || '').toLowerCase();
        let score = 0;

        if (name.includes('natural') || name.includes('neural') || name.includes('premium') || name.includes('enhanced')) {
            score += 7;
        }
        if (voice.lang && voice.lang.toLowerCase().startsWith('en')) {
            score += 3;
        }
        preferredParts.forEach(function(part) {
            if (name.includes(part.toLowerCase())) {
                score += 5;
            }
        });
        if (name.includes('espeak') || name.includes('compact') || name.includes('robot')) {
            score -= 6;
        }
        return score;
    }

    function pickBestVoice(preferredParts) {
        if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
            return null;
        }
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) {
            return null;
        }

        let best = null;
        let bestScore = -Infinity;
        voices.forEach(function(voice) {
            const score = scoreVoice(voice, preferredParts);
            if (score > bestScore) {
                best = voice;
                bestScore = score;
            }
        });
        return best;
    }

    function refreshVoiceCache() {
        voiceCache.natural = pickBestVoice([
            'google uk english female',
            'google us english',
            'samantha',
            'microsoft aria',
            'microsoft zira',
            'jenny',
            'allison',
            'ava'
        ]);
        voiceCache.warm = pickBestVoice([
            'samantha',
            'microsoft aria',
            'google uk english female',
            'karen',
            'moira',
            'tessa'
        ]) || voiceCache.natural;
        voiceCache.bright = pickBestVoice([
            'zira',
            'allison',
            'ava',
            'jenny',
            'google us english',
            'google uk english female'
        ]) || voiceCache.natural;
    }

    function pickHumanLikeVoice() {
        return pickSpeechVoice([
            'Natural',
            'Neural',
            'Premium',
            'Enhanced',
            'Google UK English Female',
            'Google US English',
            'Samantha',
            'Ava',
            'Allison',
            'Microsoft Aria',
            'Microsoft Zira',
            'Jenny',
            'Guy',
            'Karen',
            'Tessa',
            'Moira',
            'Veena'
        ]);
    }

    function speakText(text, options) {
        try {
            if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            const voice = options && options.voice ? options.voice : pickSpeechVoice([
                'Google UK English Female',
                'Samantha',
                'Microsoft Aria',
                'Microsoft Zira',
                'Google US English'
            ]);
            if (voice) {
                utterance.voice = voice;
                utterance.lang = voice.lang;
            }
            utterance.rate = options && options.rate ? options.rate : 1.0;
            utterance.pitch = options && options.pitch ? options.pitch : 1.0;
            utterance.volume = options && options.volume ? options.volume : 1.0;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        } catch (err) {
            // Ignore voice failures to keep gameplay uninterrupted.
        }
    }

    function speakAnnouncement(text) {
        speakText(text, {
            voice: voiceCache.natural || pickHumanLikeVoice(),
            rate: 0.98,
            pitch: 1.0,
            volume: 1
        });
    }

    function playOhNoSound() {
        try {
            if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
                speakText('Oh no!', {
                    voice: voiceCache.warm || pickHumanLikeVoice(),
                    rate: 0.82,
                    pitch: 0.78,
                    volume: 1
                });
                return;
            }

            if (!audioContext) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) {
                    return;
                }
                audioContext = new AudioCtx();
            }

            // Fallback tone when speech synthesis is unavailable.
            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            const osc2 = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sawtooth';
            osc2.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(170, now + 0.5);
            osc2.frequency.setValueAtTime(180, now);
            osc2.frequency.exponentialRampToValueAtTime(110, now + 0.5);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.24, now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now);
            osc2.start(now);
            osc.stop(now + 0.55);
            osc2.stop(now + 0.55);
        } catch (err) {
            // Ignore audio failures to keep gameplay uninterrupted.
        }
    }

    function playYaySound() {
        try {
            if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
                speakText('Yay, amazing!', {
                    voice: voiceCache.bright || pickHumanLikeVoice(),
                    rate: 0.9,
                    pitch: 1.08,
                    volume: 1
                });
                return;
            }

            if (!audioContext) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) {
                    return;
                }
                audioContext = new AudioCtx();
            }

            // Fallback tone when speech synthesis is unavailable.
            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        } catch (err) {
            // Ignore audio failures to keep gameplay uninterrupted.
        }
    }

    function playWowSound() {
        try {
            if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
                speakText('Wow!', {
                    voice: voiceCache.bright || pickHumanLikeVoice(),
                    rate: 1.0,
                    pitch: 1.16,
                    volume: 1
                });
                return;
            }

            if (!audioContext) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) {
                    return;
                }
                audioContext = new AudioCtx();
            }

            // Fallback tone when speech synthesis is unavailable.
            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(720, now + 0.2);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now);
            osc.stop(now + 0.25);
        } catch (err) {
            // Ignore audio failures to keep gameplay uninterrupted.
        }
    }

    async function animateMoveBack(pawn, startPosition, steps) {
        let currentPosition = startPosition;

        for (let i = 0; i < steps; i++) {
            if (currentPosition <= 1) {
                break;
            }
            await sleep(BACK_STEP_DELAY_MS);
            currentPosition -= 1;
            const backCell = cellsByNumber.get(currentPosition);
            placePawn(pawn, backCell, false);
        }
    }

    async function animateMoveForward(pawn, startPosition, steps) {
        let currentPosition = startPosition;

        for (let i = 0; i < steps; i++) {
            if (currentPosition >= 100) {
                break;
            }
            await sleep(BACK_STEP_DELAY_MS);
            currentPosition += 1;
            const forwardCell = cellsByNumber.get(currentPosition);
            placePawn(pawn, forwardCell, true);
        }
    }

    async function animateLadderDown(pawn, topPosition, bottomPosition) {
        const topCell = cellsByNumber.get(topPosition);
        const bottomCell = cellsByNumber.get(bottomPosition);
        if (!topCell || !bottomCell) {
            return;
        }

        const topPoint = getCellCenterInBoard(topCell);
        const bottomPoint = getCellCenterInBoard(bottomCell);
        const dx = bottomPoint.x - topPoint.x;
        const dy = bottomPoint.y - topPoint.y;
        const distance = Math.hypot(dx, dy);
        const rungCount = Math.max(6, Math.floor(distance / 24));

        // Float pawn over board and move along the visible ladder.
        board.appendChild(pawn);
        pawn.classList.add('pawn-floating');
        pawn.style.left = `${topPoint.x}px`;
        pawn.style.top = `${topPoint.y}px`;

        for (let i = 1; i <= rungCount; i++) {
            await sleep(LADDER_STEP_DELAY_MS);
            const t = i / rungCount;
            pawn.style.left = `${topPoint.x + (dx * t)}px`;
            pawn.style.top = `${topPoint.y + (dy * t)}px`;
        }

        pawn.classList.remove('pawn-floating');
        pawn.style.left = '';
        pawn.style.top = '';
        placePawn(pawn, bottomCell, false);
    }

    async function movePawnByRoll(pawn, roll) {
        const state = pawnState.get(pawn.id);
        const startPosition = state.position;
        const nextPosition = startPosition + roll;

        if (nextPosition > 100) {
            return;
        }

        // Main dice movement now happens step-by-step.
        await animateMoveForward(pawn, startPosition, roll);

        const specialCells = new Set([
            BURNT_FOOD_CELL,
            COOKIE_CONTEST_CELL,
            BAD_PIZZA_CELL,
            PERFECT_CAKE_CELL,
            LAST_IN_CONTEST_CELL,
            MUFFINS_SAVED_CELL,
            FLOUR_SPILLED_CELL,
            FLOUR_CAUGHT_CELL,
            AMAZING_COOKIES_CELL,
            PASTA_SPILLED_CELL,
            CHEATED_CONTEST_CELL,
            AMAZING_PIZZA_CELL,
            LOST_INGREDIENTS_CELL
        ]);

        if (specialCells.has(nextPosition)) {
            await sleep(SPECIAL_ACTION_DELAY_MS);
        }

        if (nextPosition === BURNT_FOOD_CELL) {
            playOhNoSound();
            await animateMoveBack(pawn, nextPosition, BURNT_FOOD_BACK_STEPS);
        } else if (nextPosition === COOKIE_CONTEST_CELL) {
            playYaySound();
            await animateMoveForward(pawn, nextPosition, COOKIE_CONTEST_FORWARD_STEPS);
        } else if (nextPosition === BAD_PIZZA_CELL) {
            playOhNoSound();
            await animateMoveBack(pawn, nextPosition, BAD_PIZZA_BACK_STEPS);
        } else if (nextPosition === PERFECT_CAKE_CELL) {
            playYaySound();
            await animateMoveForward(pawn, nextPosition, PERFECT_CAKE_FORWARD_STEPS);
        } else if (nextPosition === LAST_IN_CONTEST_CELL) {
            playOhNoSound();
            await animateMoveBack(pawn, nextPosition, LAST_IN_CONTEST_BACK_STEPS);
        } else if (nextPosition === MUFFINS_SAVED_CELL) {
            playYaySound();
            await animateMoveForward(pawn, nextPosition, MUFFINS_SAVED_FORWARD_STEPS);
        } else if (nextPosition === FLOUR_SPILLED_CELL) {
            playOhNoSound();
            await animateMoveBack(pawn, nextPosition, FLOUR_SPILLED_BACK_STEPS);
        } else if (nextPosition === FLOUR_CAUGHT_CELL) {
            playYaySound();
            await animateMoveForward(pawn, nextPosition, FLOUR_CAUGHT_FORWARD_STEPS);
        } else if (nextPosition === AMAZING_COOKIES_CELL) {
            playYaySound();
            await animateMoveForward(pawn, nextPosition, AMAZING_COOKIES_FORWARD_STEPS);
        } else if (nextPosition === PASTA_SPILLED_CELL) {
            playOhNoSound();
            await animateMoveBack(pawn, nextPosition, PASTA_SPILLED_BACK_STEPS);
        } else if (nextPosition === CHEATED_CONTEST_CELL) {
            playOhNoSound();
            await animateMoveBack(pawn, nextPosition, CHEATED_CONTEST_BACK_STEPS);
        } else if (nextPosition === AMAZING_PIZZA_CELL) {
            playYaySound();
            await animateMoveForward(pawn, nextPosition, AMAZING_PIZZA_FORWARD_STEPS);
        } else if (nextPosition === LOST_INGREDIENTS_CELL) {
            playOhNoSound();
            await animateMoveBack(pawn, nextPosition, LOST_INGREDIENTS_BACK_STEPS);
        }

        const suppressArrow18Sound = nextPosition === COOKIE_CONTEST_CELL;
        const afterSpecialPosition = pawnState.get(pawn.id).position;
        if (afterSpecialPosition === ARROW_UP_CELL) {
            if (!suppressArrow18Sound) {
                playWowSound();
            }
            await sleep(ARROW_ACTION_DELAY_MS);
            const arrowTargetCell = cellsByNumber.get(ARROW_UP_TARGET_CELL);
            placePawn(pawn, arrowTargetCell, false);
        } else if (afterSpecialPosition === ARROW_UP_CELL_2) {
            playWowSound();
            await sleep(ARROW_ACTION_DELAY_MS);
            const arrowTargetCell2 = cellsByNumber.get(ARROW_UP_TARGET_CELL_2);
            placePawn(pawn, arrowTargetCell2, false);
        }

        const landingPosition = pawnState.get(pawn.id).position;
        if (LADDER_DOWN_MAP.has(landingPosition)) {
            await sleep(LADDER_ACTION_DELAY_MS);
            const ladderBottom = LADDER_DOWN_MAP.get(landingPosition);
            await animateLadderDown(pawn, landingPosition, ladderBottom);
        }
    }

    function resetGame() {
        const startCell = cellsByNumber.get(1);
        scores.red = 0;
        scores.blue = 0;
        updateScoreboard();
        pawns.forEach(function(pawn) {
            placePawn(pawn, startCell, false);
        });
        renderDiceFace(redDice, 1);
        renderDiceFace(blueDice, 1);
        currentTurn = 'red';
        gameStarted = false;
        firstMoveDone = false;
        spinSection.classList.remove('hidden');
        spinButton.disabled = false;
        spinResult.textContent = 'Spin to decide: Red or Blue';
        wheelRotation = 0;
        startWheel.style.transform = 'rotate(0deg)';
        winnerPopup.classList.add('hidden');
        if (winnerPopupTimeoutId) {
            window.clearTimeout(winnerPopupTimeoutId);
            winnerPopupTimeoutId = null;
        }
        if (autoResetTimeoutId) {
            window.clearTimeout(autoResetTimeoutId);
            autoResetTimeoutId = null;
        }
        updateTurnButtons();
    }

    function resetPawnsToStart() {
        const startCell = cellsByNumber.get(1);
        pawns.forEach(function(pawn) {
            placePawn(pawn, startCell, false);
        });
        currentTurn = 'red';
        gameStarted = false;
        firstMoveDone = false;
        spinSection.classList.remove('hidden');
        spinButton.disabled = false;
        spinResult.textContent = 'Spin to decide: Red or Blue';
        wheelRotation = 0;
        startWheel.style.transform = 'rotate(0deg)';
        winnerPopup.classList.add('hidden');
        if (winnerPopupTimeoutId) {
            window.clearTimeout(winnerPopupTimeoutId);
            winnerPopupTimeoutId = null;
        }
        if (autoResetTimeoutId) {
            window.clearTimeout(autoResetTimeoutId);
            autoResetTimeoutId = null;
        }
        updateTurnButtons();
    }

    function updateTurnButtons() {
        if (!gameStarted) {
            rollRedButton.disabled = true;
            rollBlueButton.disabled = true;
            return;
        }

        if (currentTurn === 'red') {
            rollRedButton.disabled = false;
            rollBlueButton.disabled = true;
        } else {
            rollRedButton.disabled = true;
            rollBlueButton.disabled = false;
        }
    }

    resetGame();

    spinButton.addEventListener('click', function() {
        if (gameStarted) {
            return;
        }

        spinButton.disabled = true;
        const winner = Math.random() < 0.5 ? 'red' : 'blue';
        const extraTurns = 6;
        // Keep the pointer (at 12 o'clock) landing near the center of each color half.
        // For this wheel orientation, red center is reached near +270deg and blue near +90deg.
        const centerAngle = winner === 'red' ? 270 : 90;
        const centerJitter = (Math.random() * 30) - 15;
        const landingAngle = centerAngle + centerJitter;
        wheelRotation += extraTurns * 360 + landingAngle;
        startWheel.style.transform = `rotate(${wheelRotation}deg)`;

        window.setTimeout(function() {
            currentTurn = winner;
            gameStarted = true;
            const firstText = `${winner === 'red' ? 'Red' : 'Blue'} goes first`;
            spinResult.textContent = firstText;
            speakAnnouncement(firstText);
            updateTurnButtons();
        }, 1850);
    });

    // Roll red dice and move red pawn.
    rollRedButton.addEventListener('click', async function() {
        if (currentTurn !== 'red') {
            return;
        }
        const roll = Math.floor(Math.random() * 6) + 1;
        rollRedButton.disabled = true;
        rollBlueButton.disabled = true;
        await animateDiceRoll(redDice, roll);
        await movePawnByRoll(pawnRed, roll);
        if (!firstMoveDone) {
            firstMoveDone = true;
            spinSection.classList.add('hidden');
        }
        currentTurn = 'blue';
        updateTurnButtons();
    });

    // Roll blue dice and move blue pawn.
    rollBlueButton.addEventListener('click', async function() {
        if (currentTurn !== 'blue') {
            return;
        }
        const roll = Math.floor(Math.random() * 6) + 1;
        rollRedButton.disabled = true;
        rollBlueButton.disabled = true;
        await animateDiceRoll(blueDice, roll);
        await movePawnByRoll(pawnBlue, roll);
        if (!firstMoveDone) {
            firstMoveDone = true;
            spinSection.classList.add('hidden');
        }
        currentTurn = 'red';
        updateTurnButtons();
    });

    restartButton.addEventListener('click', function() {
        resetGame();
    });

    resetPawnsButton.addEventListener('click', function() {
        resetPawnsToStart();
    });
});
