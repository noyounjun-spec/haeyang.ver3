/* =========================================================
   auth.js — demo-only client-side "auth"
   GitHub Pages has no server, so accounts live in the
   visitor's own localStorage. This is fine for a portfolio /
   puzzle-game demo, but it is NOT real authentication:
   anyone can open devtools and read or edit this data.
   ========================================================= */

const AG_USERS_KEY = "ag_users";
const AG_SESSION_KEY = "ag_session";

function agGetUsers() {
  try {
    return JSON.parse(localStorage.getItem(AG_USERS_KEY)) || {};
  } catch {
    return {};
  }
}

function agSaveUsers(users) {
  localStorage.setItem(AG_USERS_KEY, JSON.stringify(users));
}

// Not cryptographic — just avoids storing raw passwords as plain text.
// Do not reuse this pattern for anything real.
function agHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h.toString(16);
}

function agSignup(username, password) {
  const users = agGetUsers();
  if (!username || !password) return { ok: false, message: "요원 코드와 암호를 모두 입력하세요." };
  if (users[username]) return { ok: false, message: "이미 등록된 요원 코드입니다." };
  users[username] = { pass: agHash(password), createdAt: Date.now() };
  agSaveUsers(users);
  return { ok: true, message: "등록 완료. 로그인 화면으로 이동합니다." };
}

function agLogin(username, password) {
  const users = agGetUsers();
  const record = users[username];
  if (!record || record.pass !== agHash(password)) {
    return { ok: false, message: "요원 코드 또는 암호가 일치하지 않습니다." };
  }
  sessionStorage.setItem(AG_SESSION_KEY, username);
  return { ok: true, message: "인증 완료. 잠수를 시작합니다." };
}

function agCurrentUser() {
  return sessionStorage.getItem(AG_SESSION_KEY);
}

function agLogout() {
  sessionStorage.removeItem(AG_SESSION_KEY);
}

function agRequireLogin(redirectTo) {
  if (!agCurrentUser()) {
    window.location.href = redirectTo || "login.html";
  }
}
