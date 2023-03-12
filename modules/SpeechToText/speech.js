import { firstLetterUpper } from "../../utils";

const texts = document.querySelector(".texts");
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const textArea = document.querySelector(".textarea");
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

// Listener for speech
recognition.addEventListener("result", (e) => {
  texts.appendChild(p);
  const text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  // const speechText = document.createTextNode(
  //   text.charAt(0).toUpperCase() + text.slice(1) + ". "
  // );

  p.innerText = firstLetterUpper(text);

  if (e.results[0].isFinal) {
    textArea.appendChild(firstLetterUpper(text).createTextNode());
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
