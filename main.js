const texts = document.querySelector(".texts");
const startButton = document.querySelector("#start");

let p = document.createElement("p");

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

startButton.addEventListener("click", () => {
  recognition.start();
  startButton.classList.add(
    "animate__animated",
    "animate__pulse",
    "animate__infinite",
    "infinite"
  );
});

recognition.addEventListener("result", (e) => {
  texts.appendChild(p);
  const result = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  p.innerText = result;
  const text = result.toLowerCase();
  console.log(text);
  startButton.classList.remove(
    "animate__animated",
    "animate__pulse",
    "animate__infinite",
    "infinite"
  );
  if (e.results[0].isFinal) {
    if (text.includes("how are you")) {
      p.innerText = "I am fine";
      texts.appendChild(p);
    }
    if (
      text.includes("What's your name") ||
      text.includes("what is your name")
    ) {
      texts.appendChild(p);
    }
    if (text.includes("open youtube")) {
      window.open("https://www.youtube.com/");
    }
    if (text.includes("open facebook")) {
      window.open("https://www.facebook.com/");
    }
    if (text.includes("open google")) {
      window.open("https://www.google.com/");
    }
    if (text.includes("open seznam")) {
      window.open("https://www.seznam.cz/");
    }
    setTimeout(() => {
      texts.removeChild(p);
    }, 2500);
  }
});
