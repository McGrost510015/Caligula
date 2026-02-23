import './style.css';
import clickSoundUrl from '../assets/sound/click.wav';
import musicSoundUrl from '../assets/sound/music.wav';

document.querySelector('#app').innerHTML = `
  <div class="volume-control text-outline">
    <label for="bg-volume">🔊 Volume:</label>
    <input type="range" id="bg-volume" min="0" max="100" value="50">
  </div>
  <div class="casino-container">
    <div class="top-panel text-outline">
      <div class="info-line">
        <span class="label">Balance:</span>
        <span class="value balance-val">0$</span>
      </div>
      <div class="info-line">
        <span class="label">Bet:</span>
        <span class="value bet-val">5000$</span>
      </div>
    </div>
    
    <div class="slots-container">
      <div class="slots-inner">
        <!-- Центральна частина для іконок слотів -->
      </div>
    </div>
    
    <div class="bottom-panel">
      <button class="btn btn-exit">Exit</button>
      <button class="btn btn-add">Add $</button>
      <button class="btn btn-minus">-</button>
      <button class="btn btn-plus">+</button>
      <button class="btn btn-start">Start</button>
    </div>
  </div>
`;

// Ініціалізація аудіо кліку
const clickAudio = new Audio(clickSoundUrl);

// Ініціалізація фонової музики
const bgMusic = new Audio(musicSoundUrl);
bgMusic.loop = true;
bgMusic.volume = 0.5; // Значення за замовчуванням відповідно до slider value="50"

// Елемент контролю гучності
const volumeSlider = document.getElementById('bg-volume');

volumeSlider.addEventListener('input', (event) => {
  const volumeValue = event.target.value;
  bgMusic.volume = volumeValue / 100;
});

// Додаємо обробник подій на всі кнопки для відтворення звуку кліку
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Встановлюємо на початок, щоб звук відтворювався навіть при дуже швидкому кліканні
    clickAudio.currentTime = 0;
    clickAudio.play().catch(e => console.log('Не вдалося відтворити звук:', e));

    // Якщо фонова музика ще не грає (браузер блокував), запускаємо її при кліці на будь-яку кнопку
    if (bgMusic.paused) {
      bgMusic.play().catch(e => console.log('Фон заблоковано:', e));
    }
  });
});

volumeSlider.addEventListener('input', (event) => {
  const volumeValue = event.target.value;
  bgMusic.volume = volumeValue / 100;

  // Якщо користувач почав рухати повзунок - музика має грати 100%
  if (bgMusic.paused && volumeValue > 0) {
    bgMusic.play().catch(e => console.log('Фон заблоковано:', e));
  }
});

// Спроба відтворити музику при завантаженні або будь-якому кліці на сторінці як резервний варіант
const tryPlayMusic = () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      window.removeEventListener('click', tryPlayMusic);
    }).catch(() => { }); // Ігноруємо помилки блокування
  }
};
window.addEventListener('click', tryPlayMusic);
