import './style.css';

import img69Url from '../assets/image/69.png';
import backgroundFrameUrl from '../assets/image/background.png';
import backgroundSceneOverlayUrl from '../assets/image/background2.png';
import bellsUrl from '../assets/image/bells.png';
import cherryUrl from '../assets/image/cherry.png';
import doubleIngotsUrl from '../assets/image/double ingots.png';
import grapeUrl from '../assets/image/grape.png';
import ingotUrl from '../assets/image/ingot.png';

import clickSoundUrl from '../assets/sound/click.wav';
import musicSoundUrl from '../assets/sound/music.wav';
import spinSoundUrl from '../assets/sound/spin.wav';
import winSoundUrl from '../assets/sound/win.wav';

const BET_STEP = 2000;
const MIN_BET = 2000;
const MAX_BET = 100000;
const REELS_COUNT = 3;
const VISIBLE_ROWS = 3;
const BASE_SPIN_STEPS = 22;
const WIN_GROUP_CHANCES = [
  { group: 1, chancePercent: 13.3 },
  { group: 2, chancePercent: 1.75 },
  { group: 3, chancePercent: 0.56 },
  { group: 4, chancePercent: 0.05 },
];
const REEL_START_ORDERS = [
  [0, 1, 2],
  [0, 2, 1],
  [2, 1, 0],
  [2, 0, 1],
];

const SYMBOLS = [
  { id: 'cherry', img: cherryUrl, multiplier: 4, group: 1, label: 'Cherry' },
  { id: 'bells', img: bellsUrl, multiplier: 4, group: 1, label: 'Bells' },
  { id: 'grape', img: grapeUrl, multiplier: 4, group: 1, label: 'Grape' },
  { id: '69', img: img69Url, multiplier: 9, group: 2, label: '69' },
  { id: 'ingot', img: ingotUrl, multiplier: 30, group: 3, label: 'Ingot' },
  { id: 'double-ingot', img: doubleIngotsUrl, multiplier: 200, group: 4, label: 'Double ingot' },
];

const SYMBOL_BY_ID = Object.fromEntries(SYMBOLS.map((symbol) => [symbol.id, symbol]));
const SYMBOLS_BY_GROUP = SYMBOLS.reduce((acc, symbol) => {
  if (!acc[symbol.group]) acc[symbol.group] = [];
  acc[symbol.group].push(symbol);
  return acc;
}, {});

const state = {
  balance: 0,
  bet: MIN_BET,
  spinning: false,
  reels: [],
  statusKind: 'neutral',
  depositDialogOpen: false,
  infoDialogOpen: false,
};

document.querySelector('#app').innerHTML = `
  <div class="top-controls">
    <div class="volume-control text-outline">
      <label for="bg-volume">Volume</label>
      <input type="range" id="bg-volume" min="0" max="100" value="45">
    </div>
    <button class="volume-control__info-btn" id="btn-info" type="button" aria-label="Info">i</button>
  </div>

  <div class="game-scene-overlay" style="--scene-overlay-image: url('${backgroundSceneOverlayUrl}')"></div>

  <div class="info-dialog-overlay" id="info-dialog-overlay" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="info-dialog-title">
    <div class="info-dialog" role="document">
      <div class="info-dialog__panel">
        <div class="info-dialog__title" id="info-dialog-title">Игровые слот-машины</div>
        <div class="info-dialog__content">
          <p class="info-dialog__paragraph">Инструкция:</p>
          <p class="info-dialog__paragraph">- Подойдите к любому свободному автомату (отмечаются желтым цветом).</p>
          <p class="info-dialog__paragraph">- Нажмите кнопку Add $ чтобы внести деньги на баланс автомата.</p>
          <p class="info-dialog__paragraph">- Используйте кнопки +/- для изменения ставки с шагом в 2000$.</p>
          <p class="info-dialog__paragraph">- После выставления нужной ставки нажмите START для запуска игры.</p>
          <p class="info-dialog__paragraph">- Нажмите Exit или Esc на клавиатуре для выхода. Вам будет возвращен итоговый баланс.</p>
          <p class="info-dialog__paragraph info-dialog__paragraph--spaced">Основная цель игры на слот-машине - это выпадение трёх одинаковых рисунков.</p>
          <p class="info-dialog__paragraph">В зависимости от типа рисунка, определяется размер выигрыша:</p>
          <p class="info-dialog__paragraph">1 группа: 4x</p>
          <p class="info-dialog__paragraph">2 группа: 9x</p>
          <p class="info-dialog__paragraph">3 группа: 30x</p>
          <p class="info-dialog__paragraph">4 группа: 200x</p>
          <p class="info-dialog__paragraph">(группы рисунков показаны внизу)</p>
        </div>
        <div class="info-dialog__footer">
          <button class="info-dialog__close-btn" id="info-dialog-close" type="button">Закрыть</button>
        </div>
      </div>

      <div class="info-groups">
        <div class="info-groups__row">
          <div class="info-groups__label">1 GROUP</div>
          <div class="info-groups__icons">
            <div class="info-groups__icon-card"><img src="${cherryUrl}" alt="Cherry"></div>
            <div class="info-groups__icon-card"><img src="${bellsUrl}" alt="Bells"></div>
            <div class="info-groups__icon-card"><img src="${grapeUrl}" alt="Grape"></div>
          </div>
        </div>
        <div class="info-groups__row">
          <div class="info-groups__label">2 GROUP</div>
          <div class="info-groups__icons">
            <div class="info-groups__icon-card"><img src="${img69Url}" alt="69"></div>
          </div>
        </div>
        <div class="info-groups__row">
          <div class="info-groups__label">3 GROUP</div>
          <div class="info-groups__icons">
            <div class="info-groups__icon-card"><img src="${ingotUrl}" alt="Ingot"></div>
          </div>
        </div>
        <div class="info-groups__row">
          <div class="info-groups__label">4 GROUP</div>
          <div class="info-groups__icons">
            <div class="info-groups__icon-card"><img src="${doubleIngotsUrl}" alt="Double ingot"></div>
          </div>
        </div>
      </div>
    </div>
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
          <span class="value bet-val" id="bet-value">2000$</span>
        </div>
      </header>

      <section class="slots-stage" aria-label="Slot machine">
        <div class="slots-container" style="--slot-frame-image: url('${backgroundFrameUrl}')">
          <div class="slots-window" id="slots-window">
            <div class="spin-announcement" id="spin-announcement" aria-hidden="true">START...</div>
            <div class="win-announcement" id="win-announcement" aria-hidden="true">
              <div class="win-announcement-title">YOU WIN!</div>
              <div class="win-announcement-amount" id="win-announcement-amount">+0$</div>
            </div>
            <div
              class="deposit-dialog"
              id="deposit-dialog"
              aria-hidden="true"
              role="dialog"
              aria-modal="true"
              aria-labelledby="deposit-dialog-title"
            >
              <div class="deposit-dialog__panel">
                <div class="deposit-dialog__header" id="deposit-dialog-title">Пополнить баланс</div>
                <div class="deposit-dialog__body">
                  <p class="deposit-dialog__text">Какую сумму Вы хотите положить</p>
                  <p class="deposit-dialog__text">на баланс игрового автомата?</p>
                  <input
                    class="deposit-dialog__input"
                    id="deposit-dialog-input"
                    type="text"
                    inputmode="numeric"
                    autocomplete="off"
                    maxlength="12"
                    aria-label="Сумма пополнения"
                  >
                  <div class="deposit-dialog__actions">
                    <button class="deposit-dialog__btn" id="deposit-dialog-confirm" type="button">Добавить</button>
                    <button class="deposit-dialog__btn" id="deposit-dialog-cancel" type="button">Отмена</button>
                  </div>
                </div>
              </div>
            </div>
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
  spinAnnouncement: document.querySelector('#spin-announcement'),
  winAnnouncement: document.querySelector('#win-announcement'),
  winAnnouncementAmount: document.querySelector('#win-announcement-amount'),
  depositDialog: document.querySelector('#deposit-dialog'),
  depositInput: document.querySelector('#deposit-dialog-input'),
  depositConfirm: document.querySelector('#deposit-dialog-confirm'),
  depositCancel: document.querySelector('#deposit-dialog-cancel'),
  infoDialogOverlay: document.querySelector('#info-dialog-overlay'),
  infoDialogClose: document.querySelector('#info-dialog-close'),
  reels: Array.from(document.querySelectorAll('.reel')),
  volumeSlider: document.querySelector('#bg-volume'),
  btnInfo: document.querySelector('#btn-info'),
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
let winAnnouncementTimerId = 0;

bgMusic.loop = true;
bgMusic.volume = 0.45;
spinAudio.loop = false;
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

function randomReelDirection() {
  return Math.random() < 0.5 ? 'up' : 'down';
}

function randomReelOrder() {
  return REEL_START_ORDERS[randomInt(REEL_START_ORDERS.length)];
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
  const controlsLocked = state.spinning || state.depositDialogOpen || state.infoDialogOpen;
  elements.btnStart.disabled = controlsLocked;
  elements.btnAdd.disabled = controlsLocked;
  elements.btnPlus.disabled = controlsLocked;
  elements.btnMinus.disabled = controlsLocked;
  elements.btnExit.disabled = controlsLocked;
  elements.btnInfo.disabled = state.spinning || state.depositDialogOpen || state.infoDialogOpen;
}

function cloneAndPlay(audio) {
  const sound = audio.cloneNode();
  sound.loop = false;
  sound.volume = audio.volume;
  sound.play().catch(() => {});
}

function tryStartMusic() {
  if (!bgMusic.paused) return;
  bgMusic.play().catch(() => {});
}

function playClickSound() {
  clickAudio.currentTime = 0;
  clickAudio.play().catch(() => {});
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showSpinAnnouncement() {
  elements.spinAnnouncement.classList.add('is-visible');
  elements.spinAnnouncement.setAttribute('aria-hidden', 'false');
}

function hideSpinAnnouncement() {
  elements.spinAnnouncement.classList.remove('is-visible');
  elements.spinAnnouncement.setAttribute('aria-hidden', 'true');
}

function showWinAnnouncement(amount) {
  if (winAnnouncementTimerId) {
    clearTimeout(winAnnouncementTimerId);
    winAnnouncementTimerId = 0;
  }

  elements.winAnnouncementAmount.textContent = `+${formatMoney(amount)}`;
  elements.winAnnouncement.classList.add('is-visible');
  elements.winAnnouncement.setAttribute('aria-hidden', 'false');

  winAnnouncementTimerId = window.setTimeout(() => {
    hideWinAnnouncement();
  }, 4000);
}

function hideWinAnnouncement() {
  if (winAnnouncementTimerId) {
    clearTimeout(winAnnouncementTimerId);
    winAnnouncementTimerId = 0;
  }

  elements.winAnnouncement.classList.remove('is-visible');
  elements.winAnnouncement.setAttribute('aria-hidden', 'true');
}

function openInfoDialog() {
  if (state.spinning || state.depositDialogOpen || state.infoDialogOpen) return;

  state.infoDialogOpen = true;
  updateButtons();
  elements.infoDialogOverlay.classList.add('is-visible');
  elements.infoDialogOverlay.setAttribute('aria-hidden', 'false');

  requestAnimationFrame(() => {
    elements.infoDialogClose.focus();
  });
}

function closeInfoDialog({ restoreFocus = true } = {}) {
  if (!state.infoDialogOpen) return;

  state.infoDialogOpen = false;
  elements.infoDialogOverlay.classList.remove('is-visible');
  elements.infoDialogOverlay.setAttribute('aria-hidden', 'true');
  updateButtons();

  if (restoreFocus) {
    requestAnimationFrame(() => {
      elements.btnInfo.focus();
    });
  }
}

function openDepositDialog() {
  if (state.spinning || state.depositDialogOpen || state.infoDialogOpen) return;

  state.depositDialogOpen = true;
  updateButtons();
  elements.depositDialog.classList.add('is-visible');
  elements.depositDialog.setAttribute('aria-hidden', 'false');
  elements.depositInput.value = '';

  requestAnimationFrame(() => {
    elements.depositInput.focus();
  });
}

function closeDepositDialog({ restoreFocus = true } = {}) {
  if (!state.depositDialogOpen) return;

  state.depositDialogOpen = false;
  elements.depositDialog.classList.remove('is-visible');
  elements.depositDialog.setAttribute('aria-hidden', 'true');
  updateButtons();

  if (restoreFocus) {
    requestAnimationFrame(() => {
      elements.btnAdd.focus();
    });
  }
}

function submitDepositDialog() {
  if (!state.depositDialogOpen || state.spinning) return;

  const rawValue = elements.depositInput.value.trim();
  const numericString = rawValue.replace(/[^\d]/g, '');
  const amount = Number.parseInt(numericString, 10);

  if (!Number.isFinite(amount) || amount <= 0) {
    setStatus('Введите корректную сумму пополнения.', 'warn');
    elements.depositInput.focus();
    elements.depositInput.select();
    return;
  }

  state.balance += amount;
  updateTopPanel();
  closeDepositDialog();
  setStatus(`Баланс пополнен на ${formatMoney(amount)}.`, 'neutral');
}

function makeSymbolCell(symbolId, cellHeight, index, rowPhase = 0) {
  const symbol = SYMBOL_BY_ID[symbolId];
  const cell = document.createElement('div');
  cell.className = 'slot-symbol';
  cell.style.height = `${cellHeight}px`;
  const rowIndex = ((index - rowPhase) % VISIBLE_ROWS + VISIBLE_ROWS) % VISIBLE_ROWS;
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

function renderTrack(reelState, symbolIds, rowPhase = 0) {
  const reelHeight = reelState.reel.clientHeight || 300;
  const cellHeight = Math.max(1, Math.round(reelHeight / VISIBLE_ROWS));

  reelState.cellHeight = cellHeight;
  reelState.rowPhase = rowPhase;
  reelState.track.style.setProperty('--cell-height', `${cellHeight}px`);
  reelState.track.textContent = '';

  const fragment = document.createDocumentFragment();
  symbolIds.forEach((symbolId, index) => {
    fragment.append(makeSymbolCell(symbolId, cellHeight, index, rowPhase));
  });

  reelState.track.append(fragment);
}

function resetReelToVisible(reelState) {
  renderTrack(reelState, reelState.visibleSymbols, reelState.rowPhase ?? 0);
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
      rowPhase: 0,
    };

    resetReelToVisible(reelState);
    return reelState;
  });
}

function allSame(arr) {
  return arr.length > 0 && arr.every((value) => value === arr[0]);
}

function rollWinningGroup() {
  const roll = Math.random() * 100;
  let cumulative = 0;

  for (const { group, chancePercent } of WIN_GROUP_CHANCES) {
    cumulative += chancePercent;
    if (roll < cumulative) {
      return group;
    }
  }

  return null;
}

function generateSpinResult() {
  let centerLine;
  const winningGroup = rollWinningGroup();

  if (winningGroup !== null) {
    const groupSymbols = SYMBOLS_BY_GROUP[winningGroup];
    const winningSymbol = groupSymbols[randomInt(groupSymbols.length)].id;
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

function normalizeReelExtraSteps(reelState, finalVisibleSymbols, extraSteps) {
  const clamped = Math.max(1, Math.min(10, Math.trunc(extraSteps)));
  if (clamped !== 1) return clamped;

  const targetCenter = finalVisibleSymbols[1];
  const [currentTop, , currentBottom] = reelState.visibleSymbols;
  const canUseSingleStep = currentTop === targetCenter || currentBottom === targetCenter;

  if (canUseSingleStep) return 1;

  return randomInt(9) + 2; // 2..10
}

function animateReelTo(reelState, finalVisibleSymbols, durationMs, extraSteps, direction = 'up') {
  const clampedExtraSteps = normalizeReelExtraSteps(reelState, finalVisibleSymbols, extraSteps);
  const filler = Array.from({ length: clampedExtraSteps }, () => randomSymbolId());
  const totalShiftIcons = filler.length + VISIBLE_ROWS;

  let sequence;
  let rowPhase;
  let startOffset;
  let targetOffset;

  if (direction === 'down') {
    sequence = [...finalVisibleSymbols, ...filler, ...reelState.visibleSymbols];
    rowPhase = 0;
    renderTrack(reelState, sequence, rowPhase);
    startOffset = -(totalShiftIcons * reelState.cellHeight);
    targetOffset = 0;
  } else {
    sequence = [...reelState.visibleSymbols, ...filler, ...finalVisibleSymbols];
    rowPhase = totalShiftIcons % VISIBLE_ROWS;
    renderTrack(reelState, sequence, rowPhase);
    startOffset = 0;
    targetOffset = -(totalShiftIcons * reelState.cellHeight);
  }

  return new Promise((resolve) => {
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      reelState.track.removeEventListener('transitionend', onTransitionEnd);
      reelState.visibleSymbols = [...finalVisibleSymbols];
      reelState.rowPhase = 0;
      resetReelToVisible(reelState);
      resolve();
    };

    const onTransitionEnd = (event) => {
      if (event.target === reelState.track && event.propertyName === 'transform') {
        finish();
      }
    };

    reelState.track.addEventListener('transitionend', onTransitionEnd);

    reelState.track.style.transition = 'none';
    reelState.track.style.transform = `translateY(${startOffset}px)`;
    // Force the browser to commit the start transform before enabling transition.
    void reelState.track.offsetHeight;

    requestAnimationFrame(() => {
      reelState.track.style.transition = `transform ${durationMs}ms linear`;
      reelState.track.style.transform = `translateY(${targetOffset}px)`;
    });

    setTimeout(finish, durationMs + 200);
  });
}

function getCenterLineSymbols() {
  return state.reels.map((reel) => reel.visibleSymbols[1]);
}

function getWinningDataForCenterLine(centerLine) {
  if (!allSame(centerLine)) return null;

  const symbol = SYMBOL_BY_ID[centerLine[0]];
  return {
    symbol,
    winnings: state.bet * symbol.multiplier,
  };
}

function flashWin() {
  elements.slotsWindow.classList.add('is-win');
  setTimeout(() => {
    elements.slotsWindow.classList.remove('is-win');
  }, 700);
}

function evaluateResult({ skipPayout = false } = {}) {
  const centerLine = getCenterLineSymbols();
  const winningData = getWinningDataForCenterLine(centerLine);

  if (!winningData) {
    setStatus('Повз. Спробуйте ще раз.', 'lose');
    return;
  }

  const { symbol, winnings } = winningData;
  if (!skipPayout) {
    state.balance += winnings;
  }
  flashWin();

  setStatus(
    `WIN x${symbol.multiplier}! ${symbol.label} (${symbol.group} GROUP) +${formatMoney(winnings)}`,
    'win',
  );
}

async function startSpin() {
  if (state.spinning || state.depositDialogOpen || state.infoDialogOpen) return;

  if (state.balance < state.bet) {
    setStatus('Недостатньо коштів. Поповніть баланс через Add $.', 'warn');
    return;
  }

  state.spinning = true;
  state.balance -= state.bet;
  updateTopPanel();
  updateButtons();
  setStatus('Start...', 'neutral');
  hideWinAnnouncement();

  tryStartMusic();

  const spinResult = generateSpinResult();
  const { columns, centerLine } = spinResult;
  const plannedWinData = getWinningDataForCenterLine(centerLine);
  const isWinningSpin = Boolean(plannedWinData);
  let payoutAppliedEarly = false;
  const reelDurationMs = 1000;
  const reelOrder = randomReelOrder();
  const reelPlans = state.reels.map(() => ({
    extraSteps: randomInt(10) + 1,
    direction: randomReelDirection(),
  }));

  try {
    showSpinAnnouncement();
    await wait(1000);
    hideSpinAnnouncement();

    for (let stepIndex = 0; stepIndex < reelOrder.length; stepIndex += 1) {
      const reelIndex = reelOrder[stepIndex];
      const isLastStep = stepIndex === reelOrder.length - 1;
      const cueAudio = isLastStep && isWinningSpin ? winAudio : spinAudio;
      cloneAndPlay(cueAudio);
      if (isLastStep && plannedWinData) {
        if (!payoutAppliedEarly) {
          state.balance += plannedWinData.winnings;
          payoutAppliedEarly = true;
          updateTopPanel();
        }
        showWinAnnouncement(plannedWinData.winnings);
      }

      const plan = reelPlans[reelIndex];
      await animateReelTo(
        state.reels[reelIndex],
        columns[reelIndex],
        reelDurationMs,
        plan.extraSteps,
        plan.direction,
      );
    }
  } finally {
    hideSpinAnnouncement();
    state.spinning = false;
    updateButtons();
    updateTopPanel();
  }

  evaluateResult({ skipPayout: payoutAppliedEarly });
  updateTopPanel();
}

function adjustBet(delta) {
  if (state.spinning || state.depositDialogOpen || state.infoDialogOpen) return;

  const nextBet = Math.min(MAX_BET, Math.max(MIN_BET, state.bet + delta));
  state.bet = nextBet;
  updateTopPanel();
  setStatus(`Ставка: ${formatMoney(state.bet)}`, 'neutral');
}

function addBalance() {
  openDepositDialog();
}

function handleExit() {
  if (state.spinning || state.depositDialogOpen || state.infoDialogOpen) return;
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
      playClickSound();
      tryStartMusic();
    });
  });

  elements.btnInfo.addEventListener('click', () => {
    playClickSound();
    tryStartMusic();
    openInfoDialog();
  });
  elements.infoDialogClose.addEventListener('click', () => {
    playClickSound();
    closeInfoDialog();
  });
  elements.infoDialogOverlay.addEventListener('click', (event) => {
    if (event.target !== elements.infoDialogOverlay) return;
    closeInfoDialog();
  });

  elements.btnStart.addEventListener('click', startSpin);
  elements.btnAdd.addEventListener('click', openDepositDialog);
  elements.btnPlus.addEventListener('click', () => adjustBet(BET_STEP));
  elements.btnMinus.addEventListener('click', () => adjustBet(-BET_STEP));
  elements.btnExit.addEventListener('click', handleExit);
  elements.depositConfirm.addEventListener('click', () => {
    playClickSound();
    submitDepositDialog();
  });
  elements.depositCancel.addEventListener('click', () => {
    playClickSound();
    closeDepositDialog();
  });
  elements.depositInput.addEventListener('input', (event) => {
    event.target.value = event.target.value.replace(/[^\d]/g, '');
  });
  elements.depositInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      playClickSound();
      submitDepositDialog();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      playClickSound();
      closeDepositDialog();
    }
  });

  window.addEventListener('click', tryStartMusic, { once: false });
  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || state.spinning) return;

    if (state.depositDialogOpen) {
      event.preventDefault();
      closeDepositDialog();
      return;
    }

    if (state.infoDialogOpen) {
      event.preventDefault();
      closeInfoDialog();
    }
  });

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
