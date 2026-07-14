/* =========================================================
   quiz.js — four pressure layers between the surface and
   the sealed vault at 40m. Each solved stage moves the
   depth-gauge marker and unlocks the next stage.
   ========================================================= */

const STAGES = [
  {
    id: "stage-1",
    depth: 10,
    label: "LAYER 01 · 10M",
    riddle: "밀물과 썰물을 밀어 올리는 하늘의 그것은 무엇인가? (한 단어)",
    check: (v) => normalize(v) === "달",
  },
  {
    id: "stage-2",
    depth: 20,
    label: "LAYER 02 · 20M",
    riddle: "선박 신호기: 2 → 4 → 8 → 16 → ? 다음 숫자는?",
    check: (v) => normalize(v) === "32",
  },
  {
    id: "stage-3",
    depth: 30,
    label: "LAYER 03 · 30M",
    riddle: "알파벳 순번 암호: 19-8-9-16 를 해독하면?",
    check: (v) => normalize(v) === "SHIP",
  },
  {
    id: "stage-4",
    depth: 40,
    label: "LAYER 04 · 40M",
    riddle: "모스 부호를 해독하라: ● ● ● ▬ ▬ ▬ ● ● ●",
    check: (v) => normalize(v) === "SOS",
  },
];

function normalize(v) {
  return (v || "").trim().toUpperCase().replace(/\s+/g, "");
}

function renderStages() {
  const container = document.getElementById("stage-list");
  container.innerHTML = "";
  STAGES.forEach((stage, idx) => {
    const el = document.createElement("div");
    el.className = "stage";
    el.id = stage.id;
    el.innerHTML = `
      <div class="stage-label">${stage.label}</div>
      <div class="riddle">${stage.riddle}</div>
      <div class="answer-row">
        <input type="text" placeholder="응답 입력" aria-label="${stage.label} 응답" />
        <button type="button">해독 시도</button>
      </div>
      <div class="msg error" role="alert"></div>
    `;
    container.appendChild(el);

    const input = el.querySelector("input");
    const btn = el.querySelector("button");
    const msg = el.querySelector(".msg");

    const attempt = () => {
      if (stage.check(input.value)) {
        el.classList.add("solved");
        msg.classList.remove("show");
        setStageState(idx);
      } else {
        msg.textContent = "일치하지 않습니다. 다시 시도하세요.";
        msg.classList.add("show");
      }
    };
    btn.addEventListener("click", attempt);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") attempt();
    });
  });
  setStageState(-1);
}

function setStageState(solvedIndex) {
  const solvedDepth = solvedIndex >= 0 ? STAGES[solvedIndex].depth : 0;
  const highestSolved = Math.max(
    solvedDepth,
    Number(sessionStorage.getItem("ag_depth") || 0)
  );
  sessionStorage.setItem("ag_depth", String(highestSolved));

  STAGES.forEach((stage, idx) => {
    const el = document.getElementById(stage.id);
    const solved = stage.depth <= highestSolved;
    const isNext = !solved && (idx === 0 || STAGES[idx - 1].depth <= highestSolved);
    el.classList.toggle("solved", solved);
    el.classList.toggle("active", isNext);
  });

  moveGaugeMarker(highestSolved);

  if (highestSolved >= 40) {
    document.getElementById("final-doc").classList.add("show");
  }
}

function moveGaugeMarker(depth) {
  const marker = document.querySelector(".depth-gauge .marker");
  if (!marker) return;
  const pct = Math.min(depth / 40, 1);
  marker.style.top = `${pct * 100}%`;
}

document.addEventListener("DOMContentLoaded", () => {
  const savedDepth = Number(sessionStorage.getItem("ag_depth") || 0);
  renderStages();
  moveGaugeMarker(savedDepth);
  if (savedDepth >= 40) {
    document.getElementById("final-doc").classList.add("show");
  }
});
