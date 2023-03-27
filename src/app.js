import "./styles.css";
import { default_sites_list } from "./sites";
import { addBounce, firstLetterUpper, getLocation } from "./utils.js";

const texts = document.querySelector(".texts");
const start_button = document.querySelector("#start");
const output = document.querySelector(".output");

const close_button = document.querySelector("#close");
const overlay = document.querySelector(".overlay");

const map_holder = document.querySelector(".map_holder");

const help_button = document.querySelector("#help");
const help_box = document.querySelector(".help_box");

const new_command_button = document.querySelector("#new");
const name_input = document.querySelector("#name");
const url_input = document.querySelector("#url");
const new_site = document.querySelector("#new_site");
const site_add_box = document.querySelector(".site_add_box");
const remove_last_button = document.querySelector("#remove");

const list_box = document.querySelector("#list_box");
const list_box_container = document.querySelector(".list_box_container");

const spinner = document.querySelector("#spinner");

const result_span = document.createElement("span");

const APIKEY = process.env.WEATHER_API_KEY;

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

window.addEventListener("load", () => {
  if (!localStorage.getItem("sites")) {
    localStorage.setItem("sites", JSON.stringify(default_sites_list));
  }
});

// Listeners for buttons
start_button.addEventListener("click", () => {
  recognition.start();
  start_button.disabled = true;
  start_button.classList.add(
    "animate__animated",
    "animate__pulse",
    "animate__infinite",
    "infinite"
  );
});

help_button.addEventListener("click", () => {
  addBounce(help_button);

  overlay.classList.add("overlay_on");
  help_box.style.display = "flex";

  close_button.addEventListener("click", () => {
    overlay.classList.remove("overlay_on");
    help_box.style.display = "none";
  });
});

new_command_button.addEventListener("click", () => {
  addBounce(new_command_button);
  overlay.classList.add("overlay_on");
  site_add_box.style.display = "flex";

  getList();

  new_site.addEventListener("submit", (e) => {
    addBounce(document.querySelector(".submit"));
    const new_site_object = { name: "", url: "" };
    e.preventDefault();
    new_site_object.name = name_input.value;
    new_site_object.url = url_input.value;
    const current_list = JSON.parse(localStorage.getItem("sites"));

    if (current_list.some((site) => site.name === new_site_object.name)) {
      return;
    }
    current_list.push(new_site_object);
    localStorage.setItem("sites", JSON.stringify(current_list));

    getList();
  });

  close_button.addEventListener("click", () => {
    overlay.classList.remove("overlay_on");
    site_add_box.style.display = "none";

    list_box.innerHTML = "";
    list_box_container.style.display = "none";
  });
});

remove_last_button.addEventListener("click", (e) => {
  addBounce(remove_last_button);
  e.preventDefault();
  const current_list = localStorage.getItem("sites");
  const arr = JSON.parse(current_list);
  arr.pop();
  localStorage.setItem("sites", JSON.stringify(arr));

  getList();
});

// ----

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
    if (text.includes("open")) {
      const storage_list = window.localStorage.getItem("sites");
      JSON.parse(storage_list).map((site) => {
        if (text.includes(site.name)) {
          window.open(site.url);
        }
      });
    }
    if (text.includes("open speech to text")) {
      window.location.href = "speech_to_text.html";
    }
    if (text.includes("show me my location")) {
      map_holder.style.display = "flex";
      overlay.classList.add("overlay_on");
      getLocation().then((location) => {
        const mapFrame = document.createElement("iframe");
        mapFrame.setAttribute(
          "src",
          `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&hl=es;z=14&amp;&output=embed`
        );
        mapFrame.classList.add("map_frame");
        mapFrame.setAttribute("loading", "lazy");

        map_holder.appendChild(mapFrame);

        close_button.addEventListener("click", () => {
          const currentFrame = document.querySelector(".map_frame");
          overlay.classList.remove("overlay_on");
          currentFrame ? map_holder.removeChild(currentFrame) : null;
          map_holder.style.display = "none";
        });
      });
    }
    if (
      text.includes("what's the weather") ||
      text.includes("what is the weather")
    ) {
      spinner.removeAttribute("hidden");
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
            spinner.setAttribute("hidden", "");
            output.appendChild(weatherSpan);
            output.appendChild(icon);
          })
      );
    }
    if (text.includes("bitcoin price now")) {
      spinner.removeAttribute("hidden");
      fetch("https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data.price);
          const btcPriceSpan = document.createElement("span");
          btcPriceSpan.innerText =
            "BTC: " + Number(data.price).toFixed(2) + " $";
          spinner.setAttribute("hidden", "");
          output.appendChild(btcPriceSpan);
        });
    }
    if (
      text.includes("what's the date today") ||
      text.includes("what is the date today")
    ) {
      const date = new Date();
      const time = document.createElement("span");
      time.innerText = date.toLocaleString();
      output.appendChild(time);
    }

    if (text.includes("search")) {
      window.open(`https://www.google.com/search?q=${text.slice(6)}`);
    }

    start_button.disabled = false;
    setTimeout(() => {
      texts.removeChild(result_span);
    }, 1000);
  }
});

const getList = () => {
  const list = localStorage.getItem("sites");
  const arr = JSON.parse(list);

  list_box.innerHTML = "";

  arr.map((site) => {
    const name_listing = document.createElement("span");
    const url_listing = document.createElement("span");

    name_listing.innerText = "Name: " + site.name + "\n";
    url_listing.innerText = "Url: " + site.url + "\n";

    url_listing.classList.add("margin-bottom");

    list_box_container.style.display = "flex";

    list_box.appendChild(name_listing);
    list_box.appendChild(url_listing);
  });
};
