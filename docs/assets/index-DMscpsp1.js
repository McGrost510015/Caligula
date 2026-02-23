(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function l(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(o){if(o.ep)return;o.ep=!0;const s=l(o);fetch(o.href,s)}})();const F="/Caligula/assets/69-DJ-V3Qun.png",nn="/Caligula/assets/background-b24u1fFU.png",en="/Caligula/assets/background2-x_bj8D9e.png",G="/Caligula/assets/bells-C9QUW6KF.png",H="/Caligula/assets/cherry-DsToXXdX.png",Y="/Caligula/assets/double%20ingots-DY4IPzj1.png",V="/Caligula/assets/grape-Bx3x7jML.png",X="/Caligula/assets/ingot-bugoOfvk.png",tn="/Caligula/assets/click-B07Ux1hi.wav",on="/Caligula/assets/music-CpXgJNkM.wav",sn="/Caligula/assets/spin-Bw6IOeZJ.wav",an="/Caligula/assets/win-DgXZIkyM.wav",U=2e3,j=2e3,ln=1e5,rn=3,u=3,cn=[{group:1,chancePercent:13.3},{group:2,chancePercent:1.75},{group:3,chancePercent:.56},{group:4,chancePercent:.05}],R=[[0,1,2],[0,2,1],[2,1,0],[2,0,1]],E=[{id:"cherry",img:H,multiplier:4,group:1,label:"Cherry"},{id:"bells",img:G,multiplier:4,group:1,label:"Bells"},{id:"grape",img:V,multiplier:4,group:1,label:"Grape"},{id:"69",img:F,multiplier:9,group:2,label:"69"},{id:"ingot",img:X,multiplier:30,group:3,label:"Ingot"},{id:"double-ingot",img:Y,multiplier:200,group:4,label:"Double ingot"}],z=Object.fromEntries(E.map(n=>[n.id,n])),dn=E.reduce((n,e)=>(n[e.group]||(n[e.group]=[]),n[e.group].push(e),n),{}),t={balance:0,bet:j,spinning:!1,reels:[],statusKind:"neutral",depositDialogOpen:!1,infoDialogOpen:!1};document.querySelector("#app").innerHTML=`
  <div class="top-controls">
    <div class="volume-control text-outline">
      <label for="bg-volume">Volume</label>
      <input type="range" id="bg-volume" min="0" max="100" value="45">
    </div>
    <button class="volume-control__info-btn" id="btn-info" type="button" aria-label="Info">i</button>
  </div>

  <div class="game-scene-overlay" style="--scene-overlay-image: url('${en}')"></div>

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
            <div class="info-groups__icon-card"><img src="${H}" alt="Cherry"></div>
            <div class="info-groups__icon-card"><img src="${G}" alt="Bells"></div>
            <div class="info-groups__icon-card"><img src="${V}" alt="Grape"></div>
          </div>
        </div>
        <div class="info-groups__row">
          <div class="info-groups__label">2 GROUP</div>
          <div class="info-groups__icons">
            <div class="info-groups__icon-card"><img src="${F}" alt="69"></div>
          </div>
        </div>
        <div class="info-groups__row">
          <div class="info-groups__label">3 GROUP</div>
          <div class="info-groups__icons">
            <div class="info-groups__icon-card"><img src="${X}" alt="Ingot"></div>
          </div>
        </div>
        <div class="info-groups__row">
          <div class="info-groups__label">4 GROUP</div>
          <div class="info-groups__icons">
            <div class="info-groups__icon-card"><img src="${Y}" alt="Double ingot"></div>
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
        <div class="slots-container" style="--slot-frame-image: url('${nn}')">
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
`;const i={app:document.querySelector("#app"),balanceValue:document.querySelector("#balance-value"),betValue:document.querySelector("#bet-value"),statusLine:document.querySelector("#status-line"),slotsWindow:document.querySelector("#slots-window"),spinAnnouncement:document.querySelector("#spin-announcement"),winAnnouncement:document.querySelector("#win-announcement"),winAnnouncementAmount:document.querySelector("#win-announcement-amount"),depositDialog:document.querySelector("#deposit-dialog"),depositInput:document.querySelector("#deposit-dialog-input"),depositConfirm:document.querySelector("#deposit-dialog-confirm"),depositCancel:document.querySelector("#deposit-dialog-cancel"),infoDialogOverlay:document.querySelector("#info-dialog-overlay"),infoDialogClose:document.querySelector("#info-dialog-close"),reels:Array.from(document.querySelectorAll(".reel")),volumeSlider:document.querySelector("#bg-volume"),btnInfo:document.querySelector("#btn-info"),btnStart:document.querySelector("#btn-start"),btnAdd:document.querySelector("#btn-add"),btnPlus:document.querySelector("#btn-plus"),btnMinus:document.querySelector("#btn-minus"),btnExit:document.querySelector("#btn-exit"),buttons:Array.from(document.querySelectorAll(".btn"))},k=new Audio(tn),O=new Audio(on),I=new Audio(sn),K=new Audio(an);let m=0;O.loop=!0;O.volume=.45;I.loop=!1;I.volume=.7;k.volume=.8;K.volume=.8;function v(n){return`${Math.max(0,Math.trunc(n))}$`}function S(n){return Math.floor(Math.random()*n)}function A(){return E[S(E.length)].id}function un(){return Array.from({length:u},()=>A())}function pn(){return Math.random()<.5?"up":"down"}function gn(){return R[S(R.length)]}function p(n,e="neutral"){t.statusKind=e,i.statusLine.textContent=n,i.statusLine.dataset.kind=e}function b(){i.balanceValue.textContent=v(t.balance),i.betValue.textContent=v(t.bet)}function y(){const n=t.spinning||t.depositDialogOpen||t.infoDialogOpen;i.btnStart.disabled=n,i.btnAdd.disabled=n,i.btnPlus.disabled=n,i.btnMinus.disabled=n,i.btnExit.disabled=n,i.btnInfo.disabled=t.spinning||t.depositDialogOpen||t.infoDialogOpen}function fn(n){const e=n.cloneNode();e.loop=!1,e.volume=n.volume,e.play().catch(()=>{})}function D(){O.paused&&O.play().catch(()=>{})}function f(){k.currentTime=0,k.play().catch(()=>{})}function mn(n){return new Promise(e=>setTimeout(e,n))}function bn(){i.spinAnnouncement.classList.add("is-visible"),i.spinAnnouncement.setAttribute("aria-hidden","false")}function B(){i.spinAnnouncement.classList.remove("is-visible"),i.spinAnnouncement.setAttribute("aria-hidden","true")}function vn(n){m&&(clearTimeout(m),m=0),i.winAnnouncementAmount.textContent=`+${v(n)}`,i.winAnnouncement.classList.add("is-visible"),i.winAnnouncement.setAttribute("aria-hidden","false"),m=window.setTimeout(()=>{J()},4e3)}function J(){m&&(clearTimeout(m),m=0),i.winAnnouncement.classList.remove("is-visible"),i.winAnnouncement.setAttribute("aria-hidden","true")}function yn(){t.spinning||t.depositDialogOpen||t.infoDialogOpen||(t.infoDialogOpen=!0,y(),i.infoDialogOverlay.classList.add("is-visible"),i.infoDialogOverlay.setAttribute("aria-hidden","false"),requestAnimationFrame(()=>{i.infoDialogClose.focus()}))}function x({restoreFocus:n=!0}={}){t.infoDialogOpen&&(t.infoDialogOpen=!1,i.infoDialogOverlay.classList.remove("is-visible"),i.infoDialogOverlay.setAttribute("aria-hidden","true"),y(),n&&requestAnimationFrame(()=>{i.btnInfo.focus()}))}function hn(){t.spinning||t.depositDialogOpen||t.infoDialogOpen||(t.depositDialogOpen=!0,y(),i.depositDialog.classList.add("is-visible"),i.depositDialog.setAttribute("aria-hidden","false"),i.depositInput.value="",requestAnimationFrame(()=>{i.depositInput.focus()}))}function L({restoreFocus:n=!0}={}){t.depositDialogOpen&&(t.depositDialogOpen=!1,i.depositDialog.classList.remove("is-visible"),i.depositDialog.setAttribute("aria-hidden","true"),y(),n&&requestAnimationFrame(()=>{i.btnAdd.focus()}))}function N(){if(!t.depositDialogOpen||t.spinning)return;const e=i.depositInput.value.trim().replace(/[^\d]/g,""),l=Number.parseInt(e,10);if(!Number.isFinite(l)||l<=0){p("Введите корректную сумму пополнения.","warn"),i.depositInput.focus(),i.depositInput.select();return}t.balance+=l,b(),L(),p(`Баланс пополнен на ${v(l)}.`,"neutral")}function _n(n,e,l,a=0){const o=z[n],s=document.createElement("div");s.className="slot-symbol",s.style.height=`${e}px`;const r=((l-a)%u+u)%u;r===0?s.classList.add("is-top"):r===u-1?s.classList.add("is-bottom"):s.classList.add("is-middle");const c=document.createElement("img");return c.src=o.img,c.alt=o.label,c.draggable=!1,s.append(c),s}function C(n,e,l=0){const a=n.reel.clientHeight||300,o=Math.max(1,Math.round(a/u));n.cellHeight=o,n.rowPhase=l,n.track.style.setProperty("--cell-height",`${o}px`),n.track.textContent="";const s=document.createDocumentFragment();e.forEach((r,c)=>{s.append(_n(r,o,c,l))}),n.track.append(s)}function q(n){C(n,n.visibleSymbols,n.rowPhase??0),n.track.style.transition="none",n.track.style.transform="translateY(0px)"}function wn(){t.reels=i.reels.map((n,e)=>{const l=n.querySelector(".reel-track"),a={index:e,reel:n,track:l,visibleSymbols:un(),cellHeight:0,rowPhase:0};return q(a),a})}function Q(n){return n.length>0&&n.every(e=>e===n[0])}function Dn(){const n=Math.random()*100;let e=0;for(const{group:l,chancePercent:a}of cn)if(e+=a,n<e)return l;return null}function An(){let n;const e=Dn();if(e!==null){const a=dn[e],o=a[S(a.length)].id;n=[o,o,o]}else do n=Array.from({length:rn},()=>A());while(Q(n));return{columns:n.map(a=>{const o=A(),s=A();return[o,a,s]}),centerLine:n}}function On(n,e,l){const a=Math.max(1,Math.min(10,Math.trunc(l)));if(a!==1)return a;const o=e[1],[s,,r]=n.visibleSymbols;return s===o||r===o?1:S(9)+2}function Sn(n,e,l,a,o="up"){const s=On(n,e,a),r=Array.from({length:s},()=>A()),c=r.length+u;let h,d,g,_;return o==="down"?(h=[...e,...r,...n.visibleSymbols],d=0,C(n,h,d),g=-(c*n.cellHeight),_=0):(h=[...n.visibleSymbols,...r,...e],d=c%u,C(n,h,d),g=0,_=-(c*n.cellHeight)),new Promise(P=>{let w=!1;const $=()=>{w||(w=!0,n.track.removeEventListener("transitionend",M),n.visibleSymbols=[...e],n.rowPhase=0,q(n),P())},M=T=>{T.target===n.track&&T.propertyName==="transform"&&$()};n.track.addEventListener("transitionend",M),n.track.style.transition="none",n.track.style.transform=`translateY(${g}px)`,n.track.offsetHeight,requestAnimationFrame(()=>{n.track.style.transition=`transform ${l}ms linear`,n.track.style.transform=`translateY(${_}px)`}),setTimeout($,l+200)})}function Ln(){return t.reels.map(n=>n.visibleSymbols[1])}function Z(n){if(!Q(n))return null;const e=z[n[0]];return{symbol:e,winnings:t.bet*e.multiplier}}function En(){i.slotsWindow.classList.add("is-win"),setTimeout(()=>{i.slotsWindow.classList.remove("is-win")},700)}function xn({skipPayout:n=!1}={}){const e=Ln(),l=Z(e);if(!l){p("Повз. Спробуйте ще раз.","lose");return}const{symbol:a,winnings:o}=l;n||(t.balance+=o),En(),p(`WIN x${a.multiplier}! ${a.label} (${a.group} GROUP) +${v(o)}`,"win")}async function kn(){if(t.spinning||t.depositDialogOpen||t.infoDialogOpen)return;if(t.balance<t.bet){p("Недостатньо коштів. Поповніть баланс через Add $.","warn");return}t.spinning=!0,t.balance-=t.bet,b(),y(),p("Start...","neutral"),J(),D();const n=An(),{columns:e,centerLine:l}=n,a=Z(l),o=!!a;let s=!1;const r=1e3,c=gn(),h=t.reels.map(()=>({extraSteps:S(10)+1,direction:pn()}));try{bn(),await mn(1e3),B();for(let d=0;d<c.length;d+=1){const g=c[d],_=d===c.length-1;fn(_&&o?K:I),_&&a&&(s||(t.balance+=a.winnings,s=!0,b()),vn(a.winnings));const w=h[g];await Sn(t.reels[g],e[g],r,w.extraSteps,w.direction)}}finally{B(),t.spinning=!1,y(),b()}xn({skipPayout:s}),b()}function W(n){if(t.spinning||t.depositDialogOpen||t.infoDialogOpen)return;const e=Math.min(ln,Math.max(j,t.bet+n));t.bet=e,b(),p(`Ставка: ${v(t.bet)}`,"neutral")}function Cn(){t.spinning||t.depositDialogOpen||t.infoDialogOpen||p(`Сесію завершено. Підсумковий баланс: ${v(t.balance)}.`,"warn")}function In(){i.volumeSlider.addEventListener("input",e=>{const l=Number(e.target.value)/100;O.volume=l,l>0&&D()}),i.buttons.forEach(e=>{e.addEventListener("click",()=>{f(),D()})}),i.btnInfo.addEventListener("click",()=>{f(),D(),yn()}),i.infoDialogClose.addEventListener("click",()=>{f(),x()}),i.infoDialogOverlay.addEventListener("click",e=>{e.target===i.infoDialogOverlay&&x()}),i.btnStart.addEventListener("click",kn),i.btnAdd.addEventListener("click",hn),i.btnPlus.addEventListener("click",()=>W(U)),i.btnMinus.addEventListener("click",()=>W(-U)),i.btnExit.addEventListener("click",Cn),i.depositConfirm.addEventListener("click",()=>{f(),N()}),i.depositCancel.addEventListener("click",()=>{f(),L()}),i.depositInput.addEventListener("input",e=>{e.target.value=e.target.value.replace(/[^\d]/g,"")}),i.depositInput.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault(),f(),N();return}e.key==="Escape"&&(e.preventDefault(),f(),L())}),window.addEventListener("click",D,{once:!1}),window.addEventListener("keydown",e=>{if(!(e.key!=="Escape"||t.spinning)){if(t.depositDialogOpen){e.preventDefault(),L();return}t.infoDialogOpen&&(e.preventDefault(),x())}});let n=0;window.addEventListener("resize",()=>{t.spinning||(cancelAnimationFrame(n),n=requestAnimationFrame(()=>{t.reels.forEach(q)}))})}function qn(){wn(),b(),y(),In()}qn();
