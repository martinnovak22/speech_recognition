const OPTIONS = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export const getLocation = () =>
  new Promise((resolve) => {
    function success(pos) {
      const crd = pos.coords;

      console.log("Your current position is:");
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);

      resolve(crd);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, OPTIONS);
  });

export const firstLetterUpper = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const addBounce = (element) => {
  element.classList.add("animate__animated", "animate__bounceIn");

  setTimeout(() => {
    element.classList.remove("animate__animated", "animate__bounceIn");
  }, 1000);
};

export const setSelectedValue = (selectObj, valueToSet) => {
  for (let i = 0; i < selectObj.options.length; i++) {
    if (selectObj.options[i].value === valueToSet) {
      selectObj.options[i].selected = true;
      return;
    }
  }
};
