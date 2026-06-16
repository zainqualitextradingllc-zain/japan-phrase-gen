/* ═══ App State ═══ */
const SCREENS = ["welcome", "browse", "search", "list", "detail", "favorites", "quiz"];
const TAB_SCREENS = ["welcome", "browse", "search", "favorites", "quiz"];
const SUB_SCREENS = ["list", "detail"];

let navStack = { from: "browse", category: null, searchQuery: "" };
let detailFrom = "list";
let currentScreen = "welcome";
let formalityFilter = { list: "all", search: "all", favorites: "all" };
let quizState = { phrase: null, options: [], answered: false, score: 0, round: 0, total: 10 };

/* ═══ Init ═══ */
document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  renderCategories();
  bindEvents();
  updateProgress();
  updateBottomNav("welcome");
  registerServiceWorker();
});

function bindEvents() {
  document.getElementById("search-input").addEventListener("input", runSearch);
  document.querySelectorAll(".bottom-nav .nav-item").forEach(btn => {
    btn.addEventListener("click", () => navigateTab(btn.dataset.screen));
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

/* ═══ Particles ═══ */
function initParticles() {
  const container = document.getElementById("particles");
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = (12 + Math.random() * 18) + "s";
    p.style.animationDelay = Math.random() * 10 + "s";
    p.style.width = p.style.height = 2 + Math.random() * 4 + "px";
    container.appendChild(p);
  }
}

/* ═══ Navigation ═══ */
function showScreen(name, direction = "forward") {
  const prev = document.getElementById("screen-" + currentScreen);
  const next = document.getElementById("screen-" + name);
  if (!next) return;

  if (prev && prev !== next) {
    prev.classList.remove("active", "slide-in-left", "slide-in-right", "slide-out-left", "slide-out-right");
    prev.classList.add(direction === "back" ? "slide-out-right" : "slide-out-left");
    setTimeout(() => prev.classList.remove("slide-out-left", "slide-out-right"), 300);
  }

  next.classList.remove("slide-in-left", "slide-in-right");
  next.classList.add("active", direction === "back" ? "slide-in-right" : "slide-in-left");
  currentScreen = name;
  window.scrollTo(0, 0);

  const showNav = TAB_SCREENS.includes(name);
  document.getElementById("bottom-nav").classList.toggle("hidden", !showNav);
  if (showNav) updateBottomNav(name);
}

function navigateTab(name) {
  if (name === "browse") renderCategories();
  if (name === "search") {
    document.getElementById("search-filters").innerHTML = renderFormalityFilters("search-filters", "search");
    document.getElementById("search-input").value = navStack.searchQuery || "";
    if (navStack.searchQuery) runSearch();
    else document.getElementById("search-results").innerHTML = "";
  }
  if (name === "favorites") renderFavorites();
  if (name === "quiz") startQuiz();
  if (name === "welcome") updateProgress();
  showScreen(name, currentScreen === "detail" || currentScreen === "list" ? "back" : "forward");
}

function navigate(name) {
  navigateTab(name);
}

function listBack() {
  if (navStack.from === "search") {
    showScreen("search", "back");
    runSearch();
    updateBottomNav("search");
  } else if (navStack.from === "favorites") {
    showScreen("favorites", "back");
    renderFavorites();
    updateBottomNav("favorites");
  } else {
    showScreen("browse", "back");
    updateBottomNav("browse");
  }
}

function detailBack() {
  if (detailFrom === "search") {
    showScreen("search", "back");
    updateBottomNav("search");
  } else if (detailFrom === "favorites") {
    showScreen("favorites", "back");
    renderFavorites();
    updateBottomNav("favorites");
  } else {
    showScreen("list", "back");
  }
}

function updateBottomNav(active) {
  document.querySelectorAll(".bottom-nav .nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.screen === active);
  });
}

/* ═══ Progress ═══ */
function updateProgress() {
  const count = getViewed().length;
  const total = PHRASES.length;
  const pct = Math.round((count / total) * 100);

  const countEl = document.getElementById("viewed-count");
  const barEl = document.getElementById("progress-bar");
  const labelEl = document.getElementById("progress-label");

  if (countEl) countEl.textContent = `📚 ${count} / ${total} phrases explored`;
  if (barEl) barEl.style.width = pct + "%";
  if (labelEl) labelEl.textContent = `${pct}% complete`;
}

/* ═══ Formality filters ═══ */
function renderFormalityFilters(containerId, context) {
  const current = formalityFilter[context];
  return `
    <div class="formality-filters" data-context="${context}">
      ${FORMALITY_FILTERS.map(f => `
        <button type="button"
          class="filter-btn ${current === f.id ? "active" : ""}"
          onclick="setFormalityFilter('${context}', '${f.id}')">${f.label}</button>
      `).join("")}
    </div>
  `;
}

function setFormalityFilter(context, value) {
  formalityFilter[context] = value;
  if (context === "search") {
    document.getElementById("search-filters").innerHTML = renderFormalityFilters("search-filters", "search");
    runSearch();
  } else if (context === "favorites") {
    renderFavorites();
  } else if (context === "list") {
    document.getElementById("list-filters").innerHTML = renderFormalityFilters("list-filters", "list");
    const phrases = PHRASES.filter(p => p.category === navStack.category);
    renderPhraseList(filterByFormality(phrases, value), "phrase-list", "list");
  }
}

/* ═══ Categories ═══ */
function renderCategories() {
  document.getElementById("cat-grid").innerHTML = CATEGORIES.map(c => `
    <div class="cat-card" onclick="openCategory('${c.id}')">
      <span class="emoji">${c.emoji}</span>
      <span class="jp">${c.jp}</span>
      <span class="en">${c.en}</span>
    </div>
  `).join("");
}

function openCategory(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  const phrases = filterByFormality(
    PHRASES.filter(p => p.category === catId),
    formalityFilter.list
  );
  navStack = { from: "browse", category: catId, searchQuery: "" };
  detailFrom = "list";
  document.getElementById("list-emoji").textContent = cat.emoji;
  document.getElementById("list-title").textContent = cat.jp;
  document.getElementById("list-filters").innerHTML = renderFormalityFilters("list-filters", "list");
  renderPhraseList(phrases, "phrase-list", "list");
  showScreen("list");
}

/* ═══ Phrase cards ═══ */
function renderPhraseCard(p, from, showHeart = true) {
  const viewed = getViewed();
  const fav = isFavorite(p.id);
  return `
    <div class="phrase-card">
      <div class="phrase-card-main" onclick="openDetail('${p.id}', '${from}')">
        <p class="jp-preview">${p.japanese}</p>
        <p class="en-preview">${truncateEnglish(p.english)}</p>
        <div class="phrase-card-footer">
          <span class="badge badge-${p.formality}">${FORMALITY_LABELS[p.formality]}</span>
          ${viewed.includes(p.id) ? '<span class="viewed-dot">✓ Viewed</span>' : ""}
        </div>
      </div>
      ${showHeart ? `
        <button type="button" class="heart-btn ${fav ? "active" : ""}"
          onclick="event.stopPropagation(); toggleFavoriteUI('${p.id}', '${from}')"
          aria-label="Favorite">${fav ? "❤️" : "🤍"}</button>
      ` : ""}
    </div>
  `;
}

function renderPhraseList(phrases, containerId, from) {
  const el = document.getElementById(containerId);
  if (!phrases.length) {
    el.innerHTML = '<p class="empty-state">見つかりませんでした。別のキーワードをお試しください。</p>';
    return;
  }
  el.innerHTML = phrases.map(p => renderPhraseCard(p, from)).join("");
}

function toggleFavoriteUI(id, from) {
  toggleFavorite(id);
  if (from === "favorites") renderFavorites();
  else if (from === "search") runSearch();
  else if (from === "list") {
    const phrases = filterByFormality(
      PHRASES.filter(p => p.category === navStack.category),
      formalityFilter.list
    );
    renderPhraseList(phrases, "phrase-list", "list");
  }
  if (currentScreen === "detail") openDetail(id, detailFrom);
}

/* ═══ Search ═══ */
function runSearch() {
  const query = document.getElementById("search-input").value;
  navStack.searchQuery = query;
  const results = filterByFormality(searchPhrases(query), formalityFilter.search);
  renderPhraseList(results, "search-results", "search");
}

/* ═══ Favorites ═══ */
function renderFavorites() {
  const favIds = getFavorites();
  const phrases = filterByFormality(
    PHRASES.filter(p => favIds.includes(p.id)),
    formalityFilter.favorites
  );
  document.getElementById("fav-filters").innerHTML = renderFormalityFilters("fav-filters", "favorites");
  const el = document.getElementById("favorites-list");
  if (!favIds.length) {
    el.innerHTML = '<p class="empty-state">お気に入りはまだありません。<br>フレーズの ❤️ をタップして保存しましょう。</p>';
    return;
  }
  if (!phrases.length) {
    el.innerHTML = '<p class="empty-state">この敬語レベルのお気に入りはありません。</p>';
    return;
  }
  el.innerHTML = phrases.map(p => renderPhraseCard(p, "favorites")).join("");
}

/* ═══ Detail ═══ */
function openDetail(id, from) {
  const p = PHRASES.find(x => x.id === id);
  if (!p) return;
  detailFrom = from;
  if (from === "favorites") navStack.from = "favorites";
  markViewed(id);
  updateProgress();

  const related = getRelatedPhrases(p);
  const fav = isFavorite(p.id);

  document.getElementById("detail-content").innerHTML = `
    <div class="detail-header-row">
      <span class="badge badge-${p.formality}">${FORMALITY_LABELS[p.formality]}</span>
      <button type="button" class="heart-btn detail-heart ${fav ? "active" : ""}"
        onclick="toggleFavoriteUI('${p.id}', '${from}')" aria-label="Favorite">
        ${fav ? "❤️" : "🤍"}
      </button>
    </div>
    <p class="detail-jp">${p.japanese}</p>
    <p class="detail-romaji">${p.romaji}</p>
    <p class="detail-english">${p.english}</p>
    <div class="context-box">
      <strong>💡 USAGE CONTEXT</strong>
      ${p.context}
    </div>
    <div class="example-box">
      <h4>EXAMPLE IN CONTEXT</h4>
      <pre>${p.example}</pre>
    </div>
    <div class="action-row">
      <button type="button" class="btn btn-primary" onclick="copyById('${p.id}')">📋 コピーする</button>
      <button type="button" class="btn btn-secondary" onclick="speakById('${p.id}')">🔊 読み上げ</button>
      <button type="button" class="btn btn-outline" onclick="detailBack()">↩️ 戻る</button>
    </div>
    ${related.length ? `
      <div class="related-section">
        <h4>🔗 RELATED PHRASES</h4>
        <div class="phrase-list">
          ${related.map(r => `
            <div class="phrase-card">
              <div class="phrase-card-main" onclick="openDetail('${r.id}', '${from}')">
                <p class="jp-preview">${r.japanese}</p>
                <p class="en-preview">${truncateEnglish(r.english)}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}
  `;
  showScreen("detail");
}

function copyById(id) {
  const p = PHRASES.find(x => x.id === id);
  if (p) copyPhrase(p.japanese);
}

function speakById(id) {
  const p = PHRASES.find(x => x.id === id);
  if (p) speakJapanese(p.japanese);
}

function openFavoriteDetail(id) {
  navStack.from = "favorites";
  openDetail(id, "favorites");
}

/* ═══ Quiz ═══ */
function startQuiz() {
  quizState = { phrase: null, options: [], answered: false, score: 0, round: 0, total: 10 };
  renderQuizStats();
  nextQuizQuestion();
}

function renderQuizStats() {
  const stats = getQuizStats();
  document.getElementById("quiz-stats").innerHTML = `
    <span>Best: ${stats.best}/10</span>
    <span>Played: ${stats.total}</span>
  `;
}

function nextQuizQuestion() {
  quizState.answered = false;
  quizState.round += 1;

  if (quizState.round > quizState.total) {
    finishQuiz();
    return;
  }

  const pool = shuffle(PHRASES);
  const correct = pool[0];
  const wrong = shuffle(pool.slice(1)).slice(0, 2);
  const options = shuffle([correct, ...wrong]);

  quizState.phrase = correct;
  quizState.options = options;

  document.getElementById("quiz-progress").textContent =
    `Question ${quizState.round} / ${quizState.total}`;
  document.getElementById("quiz-score-live").textContent =
    `Score: ${quizState.score}`;

  document.getElementById("quiz-content").innerHTML = `
    <p class="quiz-jp">${correct.japanese}</p>
    <p class="quiz-hint">What does this phrase mean?</p>
    <div class="quiz-options">
      ${options.map((opt, i) => `
        <button type="button" class="quiz-option" id="quiz-opt-${i}"
          onclick="answerQuiz(${i})">${truncateEnglish(opt.english, 100)}</button>
      `).join("")}
    </div>
    <button type="button" class="btn btn-secondary btn-sm quiz-speak"
      onclick="speakById('${correct.id}')">🔊 読み上げ</button>
  `;
}

function answerQuiz(index) {
  if (quizState.answered) return;
  quizState.answered = true;

  const correctIdx = quizState.options.findIndex(o => o.id === quizState.phrase.id);
  const buttons = document.querySelectorAll(".quiz-option");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIdx) btn.classList.add("correct");
    else if (i === index) btn.classList.add("wrong");
  });

  if (index === correctIdx) {
    quizState.score += 1;
    showToast("正解！ ✅");
  } else {
    showToast("不正解 — もう一度挑戦！");
  }

  document.getElementById("quiz-score-live").textContent =
    `Score: ${quizState.score}`;

  setTimeout(() => {
    const area = document.getElementById("quiz-content");
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "btn btn-primary";
    nextBtn.textContent = quizState.round >= quizState.total ? "結果を見る" : "次の問題 →";
    nextBtn.onclick = nextQuizQuestion;
    area.appendChild(nextBtn);
  }, 600);
}

function finishQuiz() {
  const stats = saveQuizResult(quizState.score);
  document.getElementById("quiz-progress").textContent = "Quiz Complete!";
  document.getElementById("quiz-content").innerHTML = `
    <div class="quiz-result">
      <p class="quiz-result-score">${quizState.score} / ${quizState.total}</p>
      <p class="quiz-result-label">${quizState.score >= 8 ? "素晴らしい！" : quizState.score >= 5 ? "いい調子！" : "もう一度挑戦しましょう"}</p>
      <p class="quiz-result-best">Best score: ${stats.best} · Games played: ${stats.total}</p>
      <button type="button" class="btn btn-primary" onclick="startQuiz()">もう一度プレイ</button>
    </div>
  `;
  renderQuizStats();
}