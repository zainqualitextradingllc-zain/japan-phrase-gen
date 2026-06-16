const STORAGE_KEYS = {
  viewed: "tr_viewed",
  favorites: "tr_favorites",
  quizBest: "tr_quiz_best",
  quizTotal: "tr_quiz_total"
};

function getStored(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function setStored(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getViewed() {
  return getStored(STORAGE_KEYS.viewed);
}

function markViewed(phraseId) {
  const viewed = getViewed();
  if (!viewed.includes(phraseId)) {
    viewed.push(phraseId);
    setStored(STORAGE_KEYS.viewed, viewed);
  }
}

function getFavorites() {
  return getStored(STORAGE_KEYS.favorites);
}

function isFavorite(phraseId) {
  return getFavorites().includes(phraseId);
}

function toggleFavorite(phraseId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(phraseId);
  if (index === -1) {
    favorites.push(phraseId);
    showToast("お気に入りに追加しました ❤️");
  } else {
    favorites.splice(index, 1);
    showToast("お気に入りから削除しました");
  }
  setStored(STORAGE_KEYS.favorites, favorites);
  return favorites.includes(phraseId);
}

function getQuizStats() {
  return {
    best: parseInt(localStorage.getItem(STORAGE_KEYS.quizBest) || "0", 10),
    total: parseInt(localStorage.getItem(STORAGE_KEYS.quizTotal) || "0", 10)
  };
}

function saveQuizResult(score) {
  const stats = getQuizStats();
  stats.total += 1;
  if (score > stats.best) stats.best = score;
  localStorage.setItem(STORAGE_KEYS.quizBest, String(stats.best));
  localStorage.setItem(STORAGE_KEYS.quizTotal, String(stats.total));
  return stats;
}

function speakJapanese(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
  showToast("🔊 読み上げ中...");
}

function copyPhrase(text) {
  const done = () => showToast("コピーしました！ ✅");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, callback) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    callback();
  } catch {
    showToast("コピーに失敗しました");
  }
  document.body.removeChild(ta);
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function searchPhrases(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return PHRASES.filter(p =>
    p.japanese.includes(query) ||
    p.romaji.toLowerCase().includes(q) ||
    p.english.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q)) ||
    p.context.toLowerCase().includes(q)
  );
}

function filterByFormality(phrases, formality) {
  if (!formality || formality === "all") return phrases;
  return phrases.filter(p => p.formality === formality);
}

function getRelatedPhrases(phrase) {
  return PHRASES
    .filter(p => p.id !== phrase.id)
    .map(p => {
      let score = 0;
      if (p.category === phrase.category) score += 3;
      score += p.tags.filter(t => phrase.tags.includes(t)).length * 2;
      return { phrase: p, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.phrase);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function truncateEnglish(text, max = 80) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}