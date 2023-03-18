import "./note_styles.css";
import "../../styles.css";
import { firstLetterUpper } from "../../utils";

const texts = document.querySelector(".texts");
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const textArea = document.querySelector(".textarea");
const language_option = document.querySelector("#lang");
const searchParams = new URLSearchParams("end");

let p = document.createElement("p");

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

startButton.addEventListener("click", () => {
  searchParams.set("end", "false");
  recognition.start();
});

stopButton.addEventListener("click", () => {
  searchParams.set("end", "true");
  recognition.stop();
});

language_option.addEventListener("change", (e) => {
  recognition.lang = e.target.value;
});

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
// --------

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
