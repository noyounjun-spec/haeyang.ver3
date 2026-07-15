/* =========================================================
   seohae.js — 소금빵 두더지 잡기
   Bread pop-ups = +1, trash pop-ups = -1. Reach 8+ points
   before the 30-second timer runs out to clear the mission.
   ========================================================= */

const HOLE_COUNT = 9;
const GAME_SECONDS = 30;
const PASS_SCORE = 8;
const SPAWN_MS = 650;
const VISIBLE_MS = 850;

const TRASH_EMOJI = ["🧴", "🥤", "🛍️", "🥫"];

const BREAD_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="56" rx="42" ry="30" fill="#1c1a18"/>
  <ellipse cx="50" cy="50" rx="42" ry="30" fill="#2b2724"/>
  <path d="M20,40 Q50,20 80,40" stroke="#F0E6D2" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M22,52 Q50,34 78,52" stroke="#F0E6D2" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M26,64 Q50,48 74,64" stroke="#F0E6D2" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;

let score = 0;
let timeLeft = GAME_SECONDS;
let spawnTimer = null;
let tickTimer = null;
let running = false;

function $(sel) { return document.querySelector(sel); }

function buildGrid() {
  const grid = $("#mole-grid");
  grid.innerHTML = "";
  for (let i = 0; i < HOLE_COUNT; i++) {
    const hole = document.createElement("div");
    hole.className = "hole";
    hole.dataset.idx = i;
    hole.innerHTML = `<div class="critter"></div><div class="pop-feedback"></div>`;
    hole.addEventListener("click", () => onHit(hole));
    grid.appendChild(hole);
  }
}

function randomEmptyHole() {
  const holes = Array.from(document.querySelectorAll(".hole")).filter(
    (h) => !h.classList.contains("up")
  );
  if (holes.length === 0) return null;
  return holes[Math.floor(Math.random() * holes.length)];
}

function spawn() {
  const hole = randomEmptyHole();
  if (!hole) return;
  const isBread = Math.random() < 0.62;
  hole.dataset.type = isBread ? "bread" : "trash";
  const critter = hole.querySelector(".critter");
  if (isBread) {
    critter.innerHTML = BREAD_SVG;
  } else {
    const emoji = TRASH_EMOJI[Math.floor(Math.random() * TRASH_EMOJI.length)];
    critter.innerHTML = `<div class="emoji">${emoji}</div>`;
  }
  hole.classList.add("up");

  hole.hideTimeout = setTimeout(() => {
    hole.classList.remove("up");
    delete hole.dataset.type;
  }, VISIBLE_MS);
}

function onHit(hole) {
  if (!running || !hole.classList.contains("up")) return;
  const type = hole.dataset.type;
  clearTimeout(hole.hideTimeout);
  hole.classList.remove("up");
  delete hole.dataset.type;

  const fb = hole.querySelector(".pop-feedback");
  if (type === "bread") {
    score += 1;
    fb.textContent = "+1";
    fb.className = "pop-feedback good show";
  } else {
    score = Math.max(0, score - 1);
    fb.textContent = "-1";
    fb.className = "pop-feedback bad show";
  }
  setTimeout(() => fb.classList.remove("show"), 650);
  $("#score-value").textContent = score;
}

function tick() {
  timeLeft -= 1;
  $("#time-value").textContent = timeLeft;
  if (timeLeft <= 0) endGame();
}

function startGame() {
  score = 0;
  timeLeft = GAME_SECONDS;
  running = true;
  $("#score-value").textContent = score;
  $("#time-value").textContent = timeLeft;
  $("#start-panel").style.display = "none";
  $("#mole-grid").style.display = "grid";
  buildGrid();
  spawnTimer = setInterval(spawn, SPAWN_MS);
  tickTimer = setInterval(tick, 1000);
}

function endGame() {
  running = false;
  clearInterval(spawnTimer);
  clearInterval(tickTimer);
  document.querySelectorAll(".hole.up").forEach((h) => h.classList.remove("up"));

  const passed = score >= PASS_SCORE;
  if (passed) amMarkComplete("seohae");

  $("#result-title").textContent = passed ? "미션 성공!" : "아쉬워요";
  $("#result-desc").textContent = passed
    ? `${score}점으로 서해 해양경찰청 미션을 완료했어요.`
    : `이번 점수는 ${score}점이에요. ${PASS_SCORE}점을 넘겨야 미션 완료! 다시 도전해볼까요?`;
  $("#result-overlay").classList.add("show");
}

$("#start-btn").addEventListener("click", startGame);
$("#retry-btn").addEventListener("click", () => {
  $("#result-overlay").classList.remove("show");
  startGame();
});
