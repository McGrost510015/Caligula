import './style.css';

import img69Url from '../assets/image/69.png';
import backgroundFrameUrl from '../assets/image/background.png';
import bellsUrl from '../assets/image/bells.png';
import cherryUrl from '../assets/image/cherry.png';
import doubleIngotsUrl from '../assets/image/double ingots.png';
import grapeUrl from '../assets/image/grape.png';
import ingotUrl from '../assets/image/ingot.png';

import clickSoundUrl from '../assets/sound/click.wav';
import musicSoundUrl from '../assets/sound/music.wav';
import spinSoundUrl from '../assets/sound/spin.wav';
import winSoundUrl from '../assets/sound/win.wav';

const BET_STEP = 5000;
const MIN_BET = 5000;
const MAX_BET = 500000;
const ADD_BALANCE_STEP = 50000;
const REELS_COUNT = 3;
const VISIBLE_ROWS = 3;
const BASE_SPIN_STEPS = 22;

const SYMBOLS = [
  { id: 'cherry', img: cherryUrl, multiplier: 4, group: 1, label: 'Cherry' },
  { id: 'bells', img: bellsUrl, multiplier: 4, group: 1, label: 'Bells' },
  { id: 'grape', img: grapeUrl, multiplier: 4, group: 1, label: 'Grape' },
  { id: '69', img: img69Url, multiplier: 9, group: 2, label: '69' },
  { id: 'ingot', img: ingotUrl, multiplier: 30, group: 3, label: 'Ingot' },
  { id: 'double-ingot', img: doubleIngotsUrl, multiplier: 100, group: 4, label: 'Double ingot' },
];

const SYMBOL_BY_ID = Object.fromEntries(SYMBOLS.map((symbol) => [symbol.id, symbol]));

const state = {
  balance: 0,
  bet: MIN_BET,
  spinning: false,
  reels: [],
  statusKind: 'neutral',
};

document.querySelector('#app').innerHTML = `
  <div class="volume-control text-outline">
    <label for="bg-volume">Volume</label>
    <input type="range" id="bg-volume" min="0" max="100" value="45">
  </div>

  <main class="machine-shell">
    <section class="machine-panel">
      <header class="top-panel text-outline">
        <div class="info-line">
          <span class="label">Balance:</span>
          <span class="value balance-val" id="balance-value">0$</span>
        </div>
        <div class="info-line">
          <span class="label">Bet:</span>
          <span class="value bet-val" id="bet-value">5000$</span>
        </div>
      </header>

      <section class="slots-stage" aria-label="Slot machine">
        <div class="slots-container" style="--slot-frame-image: url('${backgroundFrameUrl}')">
          <div class="slots-window" id="slots-window">
            <div class="reels-grid" id="reels-grid">
              <div class="reel"><div class="reel-track"></div></div>
              <div class="reel"><div class="reel-track"></div></div>
              <div class="reel"><div class="reel-track"></div></div>
            </div>
          </div>
        </div>
      </section>

      <div class="bottom-panel">
        <button class="btn btn-exit" id="btn-exit" type="button">Exit</button>
        <button class="btn btn-add" id="btn-add" type="button">Add $</button>
        <button class="btn btn-minus" id="btn-minus" type="button">-</button>
        <button class="btn btn-plus" id="btn-plus" type="button">+</button>
        <button class="btn btn-start" id="btn-start" type="button">Start</button>
      </div>

      <p class="status-line text-outline" id="status-line" data-kind="neutral">
        Натисніть Add $, щоб поповнити баланс.
      </p>
    </section>
  </main>
`;

const elements = {
  app: document.querySelector('#app'),
  balanceValue: document.querySelector('#balance-value'),
  betValue: document.querySelector('#bet-value'),
  statusLine: document.querySelector('#status-line'),
  slotsWindow: document.querySelector('#slots-window'),
  reels: Array.from(document.querySelectorAll('.reel')),
  volumeSlider: document.querySelector('#bg-volume'),
  btnStart: document.querySelector('#btn-start'),
  btnAdd: document.querySelector('#btn-add'),
  btnPlus: document.querySelector('#btn-plus'),
  btnMinus: document.querySelector('#btn-minus'),
  btnExit: document.querySelector('#btn-exit'),
  buttons: Array.from(document.querySelectorAll('.btn')),
};

const clickAudio = new Audio(clickSoundUrl);
const bgMusic = new Audio(musicSoundUrl);
const spinAudio = new Audio(spinSoundUrl);
const winAudio = new Audio(winSoundUrl);

bgMusic.loop = true;
bgMusic.volume = 0.45;
spinAudio.loop = true;
spinAudio.volume = 0.7;
clickAudio.volume = 0.8;
winAudio.volume = 0.8;

function formatMoney(value) {
  return `${Math.max(0, Math.trunc(value))}$`;
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomSymbolId() {
  return SYMBOLS[randomInt(SYMBOLS.length)].id;
}

function randomColumn() {
  return Array.from({ length: VISIBLE_ROWS }, () => randomSymbolId());
}

function setStatus(message, kind = 'neutral') {
  state.statusKind = kind;
  elements.statusLine.textContent = message;
  elements.statusLine.dataset.kind = kind;
}

function updateTopPanel() {
  elements.balanceValue.textContent = formatMoney(state.balance);
  elements.betValue.textContent = formatMoney(state.bet);
}

function updateButtons() {
  elements.btnStart.disabled = state.spinning;
  elements.btnAdd.disabled = state.spinning;
  elements.btnPlus.disabled = state.spinning;
  elements.btnMinus.disabled = state.spinning;
}

function cloneAndPlay(audio) {
  const sound = audio.cloneNode();
  sound.volume = audio.volume;
  sound.play().catch(() => {});
}

function tryStartMusic() {
  if (!bgMusic.paused) return;
  bgMusic.play().catch(() => {});
}

function stopSpinSound() {
  spinAudio.pause();
  spinAudio.currentTime = 0;
}

function makeSymbolCell(symbolId, cellHeight, index, total) {
  const symbol = SYMBOL_BY_ID[symbolId];
  const cell = document.createElement('div');
  cell.className = 'slot-symbol';
  cell.style.height = `${cellHeight}px`;
  const rowIndex = index % VISIBLE_ROWS;
  if (rowIndex === 0) cell.classList.add('is-top');
  else if (rowIndex === VISIBLE_ROWS - 1) cell.classList.add('is-bottom');
  else cell.classList.add('is-middle');

  const img = document.createElement('img');
  img.src = symbol.img;
  img.alt = symbol.label;
  img.draggable = false;
  cell.append(img);

  return cell;
}

function renderTrack(reelState, symbolIds) {
  const reelHeight = reelState.reel.clientHeight || 300;
  const cellHeight = Math.max(1, Math.round(reelHeight / VISIBLE_ROWS));

  reelState.cellHeight = cellHeight;
  reelState.track.style.setProperty('--cell-height', `${cellHeight}px`);
  reelState.track.textContent = '';

  const fragment = document.createDocumentFragment();
  symbolIds.forEach((symbolId, index) => {
    fragment.append(makeSymbolCell(symbolId, cellHeight, index, symbolIds.length));
  });

  reelState.track.append(fragment);
}

function resetReelToVisible(reelState) {
  renderTrack(reelState, reelState.visibleSymbols);
  reelState.track.style.transition = 'none';
  reelState.track.style.transform = 'translateY(0px)';
}

function initReels() {
  state.reels = elements.reels.map((reelEl, index) => {
    const track = reelEl.querySelector('.reel-track');
    const reelState = {
      index,
      reel: reelEl,
      track,
      visibleSymbols: randomColumn(),
      cellHeight: 0,
    };

    resetReelToVisible(reelState);
    return reelState;
  });
}

function allSame(arr) {
  return arr.length > 0 && arr.every((value) => value === arr[0]);
}

function generateSpinResult() {
  const shouldWin = Math.random() < 0.23;
  let centerLine;

  if (shouldWin) {
    const winningSymbol = randomSymbolId();
    centerLine = [winningSymbol, winningSymbol, winningSymbol];
  } else {
    do {
      centerLine = Array.from({ length: REELS_COUNT }, () => randomSymbolId());
    } while (allSame(centerLine));
  }

  const columns = centerLine.map((centerSymbolId) => {
    const top = randomSymbolId();
    const bottom = randomSymbolId();
    return [top, centerSymbolId, bottom];
  });

  return { columns, centerLine };
}

function animateReelTo(reelState, finalVisibleSymbols, durationMs, extraSteps) {
  const normalizedExtraSteps =
    Math.max(VISIBLE_ROWS * 3, Math.ceil(extraSteps / VISIBLE_ROWS) * VISIBLE_ROWS);
  const filler = Array.from({ length: normalizedExtraSteps }, () => randomSymbolId());
  const sequence = [...reelState.visibleSymbols, ...filler, ...finalVisibleSymbols];

  renderTrack(reelState, sequence);
  reelState.track.style.transition = 'none';
  reelState.track.style.transform = 'translateY(0px)';

  const targetOffset = -(sequence.length - VISIBLE_ROWS) * reelState.cellHeight;

  return new Promise((resolve) => {
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      reelState.track.removeEventListener('transitionend', onTransitionEnd);
      reelState.visibleSymbols = [...finalVisibleSymbols];
      resetReelToVisible(reelState);
      resolve();
    };

    const onTransitionEnd = (event) => {
      if (event.target === reelState.track && event.propertyName === 'transform') {
        finish();
      }
    };

    reelState.track.addEventListener('transitionend', onTransitionEnd);

    requestAnimationFrame(() => {
      reelState.track.style.transition = `transform ${durationMs}ms cubic-bezier(0.14, 0.88, 0.18, 1)`;
      reelState.track.style.transform = `translateY(${targetOffset}px)`;
    });

    setTimeout(finish, durationMs + 200);
  });
}

function getCenterLineSymbols() {
  return state.reels.map((reel) => reel.visibleSymbols[1]);
}

function flashWin() {
  elements.slotsWindow.classList.add('is-win');
  setTimeout(() => {
    elements.slotsWindow.classList.remove('is-win');
  }, 700);
}

function evaluateResult() {
  const centerLine = getCenterLineSymbols();

  if (!allSame(centerLine)) {
    setStatus('Повз. Спробуйте ще раз.', 'lose');
    return;
  }

  const symbol = SYMBOL_BY_ID[centerLine[0]];
  const winnings = state.bet * symbol.multiplier;
  state.balance += winnings;
  flashWin();
  cloneAndPlay(winAudio);

  setStatus(
    `WIN x${symbol.multiplier}! ${symbol.label} (${symbol.group} GROUP) +${formatMoney(winnings)}`,
    'win',
  );
}

async function startSpin() {
  if (state.spinning) return;

  if (state.balance < state.bet) {
    setStatus('Недостатньо коштів. Поповніть баланс через Add $.', 'warn');
    return;
  }

  state.spinning = true;
  state.balance -= state.bet;
  updateTopPanel();
  updateButtons();
  setStatus('Барабани крутяться...', 'neutral');

  tryStartMusic();
  spinAudio.currentTime = 0;
  spinAudio.play().catch(() => {});

  const { columns } = generateSpinResult();

  const reelAnimations = state.reels.map((reelState, index) =>
    animateReelTo(
      reelState,
      columns[index],
      1200 + index * 350 + randomInt(120),
      BASE_SPIN_STEPS + index * 7 + randomInt(5),
    ),
  );

  try {
    await Promise.all(reelAnimations);
  } finally {
    stopSpinSound();
    state.spinning = false;
    updateButtons();
    updateTopPanel();
  }

  evaluateResult();
  updateTopPanel();
}

function adjustBet(delta) {
  if (state.spinning) return;

  const nextBet = Math.min(MAX_BET, Math.max(MIN_BET, state.bet + delta));
  state.bet = nextBet;
  updateTopPanel();
  setStatus(`Ставка: ${formatMoney(state.bet)}`, 'neutral');
}

function addBalance() {
  if (state.spinning) return;
  state.balance += ADD_BALANCE_STEP;
  updateTopPanel();
  setStatus(`Баланс поповнено на ${formatMoney(ADD_BALANCE_STEP)}.`, 'neutral');
}

function handleExit() {
  if (state.spinning) return;
  setStatus(`Сесію завершено. Підсумковий баланс: ${formatMoney(state.balance)}.`, 'warn');
}

function attachEvents() {
  elements.volumeSlider.addEventListener('input', (event) => {
    const volumeValue = Number(event.target.value) / 100;
    bgMusic.volume = volumeValue;
    if (volumeValue > 0) {
      tryStartMusic();
    }
  });

  elements.buttons.forEach((button) => {
    button.addEventListener('click', () => {
      clickAudio.currentTime = 0;
      clickAudio.play().catch(() => {});
      tryStartMusic();
    });
  });

  elements.btnStart.addEventListener('click', startSpin);
  elements.btnAdd.addEventListener('click', addBalance);
  elements.btnPlus.addEventListener('click', () => adjustBet(BET_STEP));
  elements.btnMinus.addEventListener('click', () => adjustBet(-BET_STEP));
  elements.btnExit.addEventListener('click', handleExit);

  window.addEventListener('click', tryStartMusic, { once: false });

  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    if (state.spinning) return;
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      state.reels.forEach(resetReelToVisible);
    });
  });
}

function boot() {
  initReels();
  updateTopPanel();
  updateButtons();
  attachEvents();
}

boot();
