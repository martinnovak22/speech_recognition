import { firstLetterUpper, getLocation } from "./utils";

const texts = document.querySelector(".texts");
const start_button = document.querySelector("#start");
const output_box = document.querySelector(".output_box");

const close_button = document.querySelector("#close");
const forecast_overlay = document.querySelector(".forecast_overlay");
const forecast_diagram_holder = document.querySelector(".img_holder");

const APIKEY = "bba7d543d0f17add68199f64c36d222c";

const testButton = document.querySelector(".testButton");

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

start_button.addEventListener("click", () => {
  recognition.start();
  start_button.classList.add(
    "animate__animated",
    "animate__pulse",
    "animate__infinite",
    "infinite"
  );
});

recognition.addEventListener("result", (e) => {
  const resultSpan = document.createElement("span");
  texts.appendChild(resultSpan);
  const result = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  resultSpan.innerText = result;
  const text = result.toLowerCase();
  console.log(text);
  start_button.classList.remove(
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
    if (text.includes("open speech to text")) {
      window.location.href = "/modules/SpeechToText/speech_to_text.html";
    }
    // if (text.includes("show me weather forecast")) {
    //   getLocation().then((location) =>
    //     fetch(
    //       `http://www.7timer.info/bin/civil.php?lon=${location.longitude}&lat=${location.latitude}&ac=0&lang=en&unit=metric&output=internal&tzshift=0`
    //     )
    //       .then((response) => {
    //         return response;
    //       })
    //       .then((data) => {
    //         console.log(data);
    //
    //         const img = document.createElement("img");
    //         img.setAttribute("alt", "forecast diagram");
    //         img.setAttribute("src", `${data.url}`);
    //         img.classList.add("forecast_diagram");
    //         forecast_diagram_holder.appendChild(img);
    //         forecast_overlay.classList.add("overlay_on");
    //
    //         close_button.addEventListener("click", () => {
    //           forecast_overlay.classList.remove("overlay_on");
    //           forecast_diagram_holder.removeChild(img);
    //         });
    //       })
    //   );
    // }
    if (text.includes("what's the weather")) {
      getLocation().then((location) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${APIKEY}&units=metric`
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            const currentWeather = data.list[0];
            console.log(currentWeather);
            console.log(currentWeather.main.temp);
            const weatherSpan = document.createElement("span");
            const icon = document.createElement("img");
            icon.src = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
            icon.alt = "current weather icon";
            icon.classList.add("weather_icon");
            weatherSpan.innerText =
              `Temperature: ${currentWeather.main.temp.toFixed(1)}\n` +
              `${firstLetterUpper(currentWeather.weather[0].description)}`;
            //TODO jiné místo pro load příkazů a výsledků?
            output_box.appendChild(weatherSpan);
            output_box.appendChild(icon);
          })
      );
    }

    if (text.includes("current bitcoin price")) {
      fetch("https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data.price);
          const btcPriceSpan = document.createElement("span");
          btcPriceSpan.innerText =
            "BTC: " + Number(data.price).toFixed(2) + " $";
          output_box.appendChild(btcPrice);
        });
    }

    if (text.includes("what's the date today")) {
      const date = new Date();
      const time = document.createElement("span");
      time.innerText = date.toLocaleString();
      output_box.appendChild(time);
    }

    //TODO případně o lokaci, google map?
    setTimeout(() => {
      texts.removeChild(p);
    }, 1000);
  }
});

testButton.addEventListener("click", () => {
  console.log("click");
});
