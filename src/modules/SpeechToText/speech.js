import "../../styles.css";
import { addBounce, firstLetterUpper, setSelectedValue } from "../../utils";
import { languages } from "./languages";

const texts = document.querySelector(".texts");

const start_Button = document.querySelector("#start");
const stop_Button = document.querySelector("#stop");
const read_button = document.querySelector("#read");
const copy_button = document.querySelector("#copy");
const clear_button = document.querySelector("#clear");

const textArea = document.querySelector(".textarea");
textArea.disabled = true;
const language_option = document.querySelector("#lang");

const searchParams = new URLSearchParams("end");

let p = document.createElement("p");

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

const synth = window.speechSynthesis;

// On window load, add languages to selection and choose current one
window.addEventListener("load", () => {
  const userLang = navigator.language;
  languages.map(function (lang) {
    let option = document.createElement("option");
    option.text = lang[0];
    option.value = lang[1];
    language_option.append(option);
  });

  setSelectedValue(language_option, userLang);
});

// Listener for language option
language_option.addEventListener("change", async (e) => {
  recognition.lang = e.target.value;
});

// Listeners for buttons
start_Button.addEventListener("click", () => {
  addBounce(start_Button);
  searchParams.set("end", "false");
  recognition.start();
  start_Button.disabled = true;
});

stop_Button.addEventListener("click", () => {
  addBounce(stop_Button);
  searchParams.set("end", "true");
  recognition.stop();
  start_Button.disabled = false;
});

read_button.addEventListener("click", () => {
  searchParams.set("end", "true");
  recognition.stop();
  start_Button.disabled = false;
  addBounce(read_button);
  const msg = textArea.value;
  const speech = new SpeechSynthesisUtterance(msg);

  const voices = voicesReady();

  const voice = getVoiceFromCode(language_option.value, voices);
  const defaultVoice = getVoiceFromCode("en-GB", voices);

  if (voice === undefined) {
    speech.voice = defaultVoice;
    synth.speak(speech);
    return;
  }
  speech.voice = voice;
  synth.speak(speech);
});

copy_button.addEventListener("click", () => {
  // For mobile
  textArea.select();
  textArea.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(textArea.value).then(() => {
    addBounce(copy_button);
  });
});

clear_button.addEventListener("click", () => {
  addBounce(clear_button);

  textArea.innerHTML = "";
});
// -------

// Listener for speech
recognition.addEventListener("result", (e) => {
  texts.appendChild(p);
  const text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  const upperText = firstLetterUpper(text);
  p.innerText = upperText;
  if (e.results[0].isFinal) {
    textArea.appendChild(document.createTextNode(upperText + ". "));
  }
});

recognition.addEventListener("end", () => {
  if (searchParams.get("end") === "true") {
    recognition.stop();
    setTimeout(() => {
      texts.innerHTML = "";
    }, 1000);
    return;
  }
  recognition.start();
});

// --------

const voicesReady = () => {
  if (speechSynthesis) {
    return speechSynthesis.getVoices();
  } else {
    alert(
      "Bad news!  Your browser doesn't have the Speech Synthesis API this project requires.  Try opening this webpage using the newest version of Google Chrome."
    );
  }
};

const getVoiceFromCode = (code, voices) => {
  return voices.find((voice) => {
    if (voice.lang === code) {
      return voice;
    }
  });
};
