/* =========================================================
   jeju.js — 낙하물 받기
   Catch ♻️ purified items for +1, avoid trash for -1.
   Reach 15 points within 30 seconds to clear the mission.
   ========================================================= */

const J_GAME_SECONDS = 30;
const J_PASS_SCORE = 15;
const J_SPAWN_MS = 620;
const J_FALL_MS_MIN = 2200;
const J_FALL_MS_MAX = 3200;

const J_GOOD_EMOJI = ["♻️"];
const J_BAD_EMOJI = ["🧴", "🥤", "🛍️", "🥫"];

let jScore = 0;
let jTimeLeft = J_GAME_SECONDS;
let jRunning = false;
let jSpawnTimer = null;
let jTickTimer = null;
let jCatcherX = 50; // percent
let jItems = [];
let jRafId = null;

function j$(sel) { return document.querySelector(sel); }

function setCatcherX(pct) {
  jCatcherX = Math.max(6, Math.min(94, pct));
  j$("#catcher").style.left = jCatcherX + "%";
}

function spawnItem() {
  const stage = j$("#catch-stage");
  const isGood = Math.random() < 0.55;
  const emoji = isGood
    ? J_GOOD_EMOJI[0]
    : J_BAD_EMOJI[Math.floor(Math.random() * J_BAD_EMOJI.length)];

  const el = document.createElement("div");
  el.className = "falling-item";
  el.textContent = emoji;
  el.dataset.good = isGood ? "1" : "0";
  const xPct = 8 + Math.random() * 84;
  el.style.left = xPct + "%";
  el.style.top = "-40px";
  stage.appendChild(el);

  const fallMs = J_FALL_MS_MIN + Math.random() * (J_FALL_MS_MAX - J_FALL_MS_MIN);
  jItems.push({
    el,
    xPct,
    startTime: performance.now(),
    fallMs,
    caught: false,
  });
}

function gameLoop(now) {
  const stage = j$("#catch-stage");
  const stageH = stage.clientHeight;

  jItems.forEach((item) => {
    if (item.caught) return;
    const t = (now - item.startTime) / item.fallMs;
    const topPx = t * (stageH + 40) - 40;
    item.el.style.top = topPx + "px";

    // collision check near catcher zone
    if (topPx > stageH - 100 && topPx < stageH - 20) {
      const dx = Math.abs(item.xPct - jCatcherX);
      if (dx < 9) {
        item.caught = true;
        item.el.remove();
        const isGood = item.el.dataset.good === "1";
        jScore = isGood ? jScore + 1 : Math.max(0, jScore - 1);
        j$("#score-value").textContent = jScore;
        if (jScore >= J_PASS_SCORE) {
          jEndGame(true);
          return;
        }
      }
    }

    if (t >= 1 && !item.caught) {
      item.caught = true;
      item.el.remove();
    }
  });

  jItems = jItems.filter((i) => !i.caught);

  if (jRunning) jRafId = requestAnimationFrame(gameLoop);
}

function jTick() {
  jTimeLeft -= 1;
  j$("#time-value").textContent = jTimeLeft;
  if (jTimeLeft <= 0) jEndGame(jScore >= J_PASS_SCORE);
}

function jStartGame() {
  jScore = 0;
  jTimeLeft = J_GAME_SECONDS;
  jRunning = true;
  jItems.forEach((i) => i.el.remove());
  jItems = [];
  j$("#score-value").textContent = jScore;
  j$("#time-value").textContent = jTimeLeft;
  j$("#start-panel").style.display = "none";
  j$("#catch-stage").style.display = "block";
  j$(".catch-controls").style.display = "flex";
  setCatcherX(50);

  jSpawnTimer = setInterval(spawnItem, J_SPAWN_MS);
  jTickTimer = setInterval(jTick, 1000);
  jRafId = requestAnimationFrame(gameLoop);
}

function jEndGame(passed) {
  jRunning = false;
  clearInterval(jSpawnTimer);
  clearInterval(jTickTimer);
  cancelAnimationFrame(jRafId);
  jItems.forEach((i) => i.el.remove());
  jItems = [];

  if (passed) amMarkComplete("jeju");

  j$("#result-title").textContent = passed ? "미션 성공!" : "아쉬워요";
  j$("#result-desc").textContent = passed
    ? `${jScore}점으로 제주 해양경찰청 미션을 완료했어요.`
    : `이번 점수는 ${jScore}점이에요. ${J_PASS_SCORE}점을 넘겨야 미션 완료! 다시 도전해볼까요?`;
  j$("#result-overlay").classList.add("show");
}

// controls: drag / touch on stage
function bindControls() {
  const stage = j$("#catch-stage");
  stage.addEventListener("pointermove", (e) => {
    if (!jRunning) return;
    const rect = stage.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setCatcherX(pct);
  });

  document.addEventListener("keydown", (e) => {
    if (!jRunning) return;
    if (e.key === "ArrowLeft") setCatcherX(jCatcherX - 6);
    if (e.key === "ArrowRight") setCatcherX(jCatcherX + 6);
  });

  j$("#left-btn").addEventListener("click", () => setCatcherX(jCatcherX - 10));
  j$("#right-btn").addEventListener("click", () => setCatcherX(jCatcherX + 10));
}

j$("#start-btn").addEventListener("click", jStartGame);
j$("#retry-btn").addEventListener("click", () => {
  j$("#result-overlay").classList.remove("show");
  jStartGame();
});
bindControls();
