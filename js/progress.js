/* =========================================================
   progress.js — tracks which of the 5 regions are complete
   Stored in localStorage so progress survives reloads
   (per-browser only, same limitation as any static site).
   ========================================================= */

const REGIONS = [
  { id: "jungbu", name: "중부", mission: "아치 카드 짝맞추기", page: "jungbu.html" },
  { id: "seohae", name: "서해", mission: "소금빵 두더지 잡기", page: "seohae.html" },
  { id: "namhae", name: "남해", mission: "아치 퍼즐 맞추기", page: "namhae.html" },
  { id: "jeju",   name: "제주", mission: "낙하물 받기", page: "jeju.html" },
  { id: "donghae",name: "동해", mission: "틀린그림찾기", page: "donghae.html" },
];

const PROGRESS_KEY = "archi_mission_progress";

function amGetProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
}

function amMarkComplete(regionId) {
  const p = amGetProgress();
  p[regionId] = true;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function amIsComplete(regionId) {
  return !!amGetProgress()[regionId];
}

function amCompletedCount() {
  const p = amGetProgress();
  return REGIONS.filter((r) => p[r.id]).length;
}

function amResetProgress() {
  localStorage.removeItem(PROGRESS_KEY);
}/* =========================================================
   progress.js — tracks which of the 5 regions are complete
   Stored in localStorage so progress survives reloads
   (per-browser only, same limitation as any static site).
   ========================================================= */

const REGIONS = [
  { id: "jungbu", name: "중부", mission: "아치 카드 짝맞추기", page: "jungbu.html" },
  { id: "seohae", name: "서해", mission: "소금빵 두더지 잡기", page: "seohae.html" },
  { id: "namhae", name: "남해", mission: "아치 퍼즐 맞추기", page: "namhae.html" },
  { id: "jeju",   name: "제주", mission: "낙하물 받기", page: "jeju.html" },
  { id: "donghae",name: "동해", mission: "틀린그림찾기", page: "donghae.html" },
];

const PROGRESS_KEY = "archi_mission_progress";

function amGetProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
}

function amMarkComplete(regionId) {
  const p = amGetProgress();
  p[regionId] = true;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function amIsComplete(regionId) {
  return !!amGetProgress()[regionId];
}

function amCompletedCount() {
  const p = amGetProgress();
  return REGIONS.filter((r) => p[r.id]).length;
}

function amResetProgress() {
  localStorage.removeItem(PROGRESS_KEY);
}
