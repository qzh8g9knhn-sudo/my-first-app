const sourceText = document.getElementById("sourceText");
const targetText = document.getElementById("targetText");
const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");
const status = document.getElementById("status");

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

document.getElementById("themeToggle").addEventListener("click", () => {
  document.documentElement.style.colorScheme =
    document.documentElement.style.colorScheme === "dark" ? "light" : "dark";
});