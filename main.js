const texts = document.querySelector(".texts");
const startButton = document.querySelector("#start");

let p = document.createElement("p");

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

startButton.addEventListener("click", () => {
  recognition.start();
  console.log("start");
});

recognition.addEventListener("result", (e) => {
  texts.appendChild(p);
  const text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  p.innerText = text;

  if (e.results[0].isFinal) {
    if (text.includes("how are you")) {
      p = document.createElement("p");
      p.classList.add("replay");
      p.innerText = "I am fine";
      texts.appendChild(p);
    }
    if (
      text.includes("What's your name") ||
      text.includes("what is your name")
    ) {
      p = document.createElement("p");
      p.innerText = "My Name is Martin";
      texts.appendChild(p);
    }
    if (text.includes("Open YouTube")) {
      p = document.createElement("p");
      texts.appendChild(p);
      window.open("https://www.youtube.com/");
    }
    p = document.createElement("p");
  }
});
