import "./styles.css";

import { firstLetterUpper, getLocation } from "./utils.js";

const texts = document.querySelector(".texts");
const start_button = document.querySelector("#start");
const output = document.querySelector(".output");
const close_button = document.querySelector("#close");
const map_overlay = document.querySelector(".map_overlay");
const map_holder = document.querySelector(".map_holder");
const help_button = document.querySelector("#help");

const result_span = document.createElement("span");

const APIKEY = process.env.WEATHER_API_KEY;
console.log(APIKEY);

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
  texts.appendChild(result_span);
  output.innerHTML = "";
  const result = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  result_span.innerText = result;
  const text = result.toLowerCase();
  console.log(text);
  start_button.classList.remove(
    "animate__animated",
    "animate__pulse",
    "animate__infinite",
    "infinite"
  );
  if (e.results[0].isFinal) {
    if (
      text.includes("What's your name") ||
      text.includes("what is your name")
    ) {
      result_span.innerText = "My name is Martin";
      texts.appendChild(result_span);
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
      window.location.href = "speech_to_text.html";
    }
    if (text.includes("show me my location")) {
      getLocation().then((location) => {
        const mapFrame = document.createElement("iframe");
        mapFrame.setAttribute(
          "src",
          `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&hl=es;z=14&amp;&output=embed`
        );
        mapFrame.classList.add("map_frame");
        mapFrame.setAttribute("loading", "lazy");

        map_holder.appendChild(mapFrame);
        map_overlay.classList.add("overlay_on");

        close_button.addEventListener("click", () => {
          map_overlay.classList.remove("overlay_on");
          map_holder.removeChild(mapFrame);
        });
      });
    }
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
            output.appendChild(weatherSpan);
            output.appendChild(icon);
          })
      );
    }
    if (text.includes("bitcoin price now")) {
      fetch("https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data.price);
          const btcPriceSpan = document.createElement("span");
          btcPriceSpan.innerText =
            "BTC: " + Number(data.price).toFixed(2) + " $";
          output.appendChild(btcPriceSpan);
        });
    }
    if (text.includes("what's the date today")) {
      const date = new Date();
      const time = document.createElement("span");
      time.innerText = date.toLocaleString();
      output.appendChild(time);
    }

    setTimeout(() => {
      texts.removeChild(result_span);
    }, 1000);
  }
});

help_button.addEventListener("click", () => {
  console.log("click");
});
