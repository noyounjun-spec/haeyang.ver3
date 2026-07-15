/* =========================================================
   namhae.js — 아치 퍼즐 맞추기
   The photo is sliced into a 3x3 grid and shuffled. Tap two
   pieces to swap them; match every piece to its original
   spot to clear the mission.
   ========================================================= */

const GRID_SIZE = 3;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

let slots = []; // slots[i] = contentIndex currently shown at slot i
let selectedSlot = null;
let moveCount = 0;
let solved = false;

function n$(sel) { return document.querySelector(sel); }

function shuffledOrder() {
  const arr = [...Array(TOTAL_PIECES).keys()];
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (isSolvedArray(arr) || derangementScore(arr) < 5);
  return arr;
}

function isSolvedArray(arr) {
  return arr.every((v, i) => v === i);
}

function derangementScore(arr) {
  return arr.filter((v, i) => v !== i).length;
}

function bgPositionFor(contentIndex) {
  const row = Math.floor(contentIndex / GRID_SIZE);
  const col = contentIndex % GRID_SIZE;
  const step = 100 / (GRID_SIZE - 1);
  return `${col * step}% ${row * step}%`;
}

function renderPuzzle() {
  const grid = n$("#puzzle-grid");
  grid.innerHTML = "";
  slots.forEach((contentIndex, slotIndex) => {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.dataset.slot = slotIndex;
    piece.style.backgroundPosition = bgPositionFor(contentIndex);
    piece.addEventListener("click", () => onPieceClick(slotIndex));
    grid.appendChild(piece);
  });
  updateMoveCount();
}

function onPieceClick(slotIndex) {
  if (solved) return;
  const pieces = document.querySelectorAll(".piece");

  if (selectedSlot === null) {
    selectedSlot = slotIndex;
    pieces[slotIndex].classList.add("selected");
    return;
  }

  if (selectedSlot === slotIndex) {
    pieces[slotIndex].classList.remove("selected");
    selectedSlot = null;
    return;
  }

  // swap
  [slots[selectedSlot], slots[slotIndex]] = [slots[slotIndex], slots[selectedSlot]];
  moveCount += 1;
  pieces[selectedSlot].classList.remove("selected");
  selectedSlot = null;
  renderPuzzle();
  checkSolved();
}

function checkSolved() {
  if (isSolvedArray(slots)) {
    solved = true;
    document.querySelectorAll(".piece").forEach((p) => p.classList.add("correct"));
    n$("#puzzle-wrap").classList.add("solved");
    amMarkComplete("namhae");
    n$("#result-title").textContent = "미션 성공!";
    n$("#result-desc").textContent = `${moveCount}번 만에 아치 사진을 완성했어요!`;
    n$("#result-overlay").classList.add("show");
  }
}

function updateMoveCount() {
  n$("#move-value").textContent = moveCount;
}

function newGame() {
  slots = shuffledOrder();
  selectedSlot = null;
  moveCount = 0;
  solved = false;
  n$("#puzzle-wrap").classList.remove("solved");
  n$("#result-overlay").classList.remove("show");
  renderPuzzle();
}

function startPuzzle() {
  n$("#start-panel").style.display = "none";
  n$("#puzzle-wrap").style.display = "block";
  newGame();
}

n$("#start-btn").addEventListener("click", startPuzzle);
n$("#retry-btn").addEventListener("click", newGame);
n$("#shuffle-btn").addEventListener("click", newGame);
