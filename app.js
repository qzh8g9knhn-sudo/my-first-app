const sourceText = document.getElementById("sourceText");
const targetText = document.getElementById("targetText");
const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");
const status = document.getElementById("status");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");

let debounceTimer;
let currentTranslation = "";
let currentLanguage = "ar";

function setStatus(message) {
  status.textContent = message;
}

async function translate() {
  const text = sourceText.value.trim();

  if (!text) {
    targetText.value = "";
    currentTranslation = "";
    setStatus("");
    return;
  }

  clearTimeout(debounceTimer);
  setStatus("Translating…");

  debounceTimer = setTimeout(async () => {
    try {
      const from = sourceLanguage.value === "auto" ? "auto" : sourceLanguage.value;
      const to = targetLanguage.value;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Translation service unavailable");

      const data = await response.json();
      const translation = data?.responseData?.translatedText;

      if (!translation) throw new Error("No translation returned");

      currentTranslation = translation;
      targetText.value = translation;
      currentLanguage = to;
      setStatus("");
    } catch (error) {
      targetText.value = "";
      currentTranslation = "";
      setStatus("Translation unavailable");
    }
  }, 550);
}

function copyText(value) {
  if (!value) return;
  navigator.clipboard.writeText(value).then(() => {
    setStatus("Copied");
    setTimeout(() => setStatus(""), 1400);
  });
}

function speak(text, language) {
  if (!text || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "auto" ? navigator.language || "en-US" : language;
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

function swapLanguages() {
  if (sourceLanguage.value === "auto") return;

  const previousSource = sourceLanguage.value;
  sourceLanguage.value = targetLanguage.value;
  targetLanguage.value = previousSource;

  const previousText = sourceText.value;
  sourceText.value = targetText.value;
  targetText.value = previousText;

  translate();
}

// Theme handling
function applyTheme(theme) {
  if (theme === "auto") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  localStorage.setItem("theme", theme);
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}

// Initialize theme
const savedTheme = localStorage.getItem("theme") || "auto";
applyTheme(savedTheme);

// Event listeners
sourceText.addEventListener("input", translate);
sourceLanguage.addEventListener("change", translate);
targetLanguage.addEventListener("change", translate);
document.getElementById("swapLanguages").addEventListener("click", swapLanguages);

document.getElementById("clearInput").addEventListener("click", () => {
  sourceText.value = "";
  targetText.value = "";
  currentTranslation = "";
  setStatus("");
  sourceText.focus();
});

document.getElementById("copySource").addEventListener("click", () => copyText(sourceText.value));
document.getElementById("copyTarget").addEventListener("click", () => copyText(targetText.value));

document.getElementById("speakSource").addEventListener("click", () =>
  speak(sourceText.value, sourceLanguage.value)
);

document.getElementById("speakTarget").addEventListener("click", () =>
  speak(targetText.value || currentTranslation, currentLanguage)
);

// Settings modal
settingsBtn.addEventListener("click", () => {
  settingsModal.classList.remove("hidden");
});

closeSettings.addEventListener("click", () => {
  settingsModal.classList.add("hidden");
});

settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) settingsModal.classList.add("hidden");
});

document.querySelectorAll(".theme-btn").forEach(btn => {
  btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
});

document.getElementById("termsLink").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Terms of Service: This app uses the free MyMemory Translation API. Translations are provided as-is.");
});
