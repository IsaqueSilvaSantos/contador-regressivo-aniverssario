let form = document.querySelector("#form");
let errorMssg = document.querySelector(".error_mssg");
let formContainer = document.querySelector(".form-container");
let countdownContainer = document.querySelector(".countdown-container");
let resetCountdown = document.querySelector(".reset-countdown");
let storedBdate = localStorage.getItem("bdate");

/**
 * It takes a date string as an argument, converts it to a date object, compares it to the current
 * date, and returns true if the input date is in the future, and false if it is not.
 * @param dateString - The date string that you want to check.
 * @returns A function that takes a date string as an argument and returns a boolean.
 */
const IS_DATE_IN_FUTURE = (dateString) => {
  let inputDate = new Date(dateString);
  let currentDate = new Date();

  if (inputDate > currentDate) {
    errorMssg.hidden = false;
    return true;
  } else {
    return false;
  }
};

/**
 * After the form container is moved off the screen, the countdown container is moved onto the screen.
 */
const CONTAINER_ACTION = () => {
  formContainer.style.top = "-99px";

  setTimeout(() => {
    countdownContainer.style.top = "50%";
  }, 1000);
};

/**
 * It returns a string of HTML code that will be used to render the countdown layout.
 * @param dateObj - An object containing the following properties:
 * @returns A string of HTML.
 */
const RENDER_LAYOUT = (dateObj) => {
  let headerTitle = `MEU ANIVERSSÁRIO DE ${dateObj.age} ANO É EM:`;

  if (dateObj.age > 1) headerTitle = `MEU ANIVERSSÁRIO DE ${dateObj.age} ANOS É EM:`;

  resetCountdown.hidden = false;

  let layout = `
    <h2>${headerTitle}</h2>
    <div class="countdown_div">
      <div>
        <h3 class="day">${dateObj.days}</h3>
        <p>DIAS</p>
      </div>
      <div>
        <h3 class="hour">${dateObj.hours}</h3>
        <p>HORAS</p>
      </div>
      <div>
        <h3 class="minute">${dateObj.minutes}</h3>
        <p>MINUTOS</p>
      </div>
      <div>
        <h3 class="second">${dateObj.seconds}</h3>
        <p>SEGUNDOS</p>
      </div>
    </div>
  `;

  return layout;
};

/**
 * It clears the local storage and reloads the page.
 */
const CLEAR_LOCAL_STORAGE = () => {
  localStorage.clear();
  location.reload()
};

/* Hiding the error message when the user changes the input. */
form.addEventListener("change", (event) => {
  errorMssg.hidden = true;
});

/* Preventing the default action of the form from happening, which is to reload the page. It is also
getting the form data and storing it in a variable. It is then checking if the date is in the
future. If it is not, it will run the CONTAINER_ACTION function and setInterval function. It will
also store the birthDate in localStorage. */
form.addEventListener("submit", (event) => {
  event.preventDefault();
  let form = event.target;
  let formData = new FormData(form);
  let birthDate = `${formData.get("year")}-${formData.get("month")}-${formData.get("day")}`;

  if (!IS_DATE_IN_FUTURE(birthDate)) {
    CONTAINER_ACTION();
    setInterval(() => {
      countdownContainer.innerHTML = RENDER_LAYOUT(GET_BIRTHDAY_COUNTDOWN(birthDate));
    }, 1000);
    localStorage.setItem("bdate", birthDate);
  }
});

/**
 * It takes a birthday in the format of "MM/DD/YYYY" and returns an object with the number of days,
 * hours, minutes, seconds, and age until the next birthday.
 * @param birthday - The birthday of the person you want to get the countdown for.
 * @returns An object with the following properties:
 * days: days,
 * hours: hours,
 * minutes: minutes,
 * seconds: seconds,
 * age: age,
 */
const GET_BIRTHDAY_COUNTDOWN = (birthday) => {
  let birthDate = new Date(birthday);
  let currentYear = new Date().getFullYear();
  let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

  if (nextBirthday < new Date()) {
    nextBirthday.setFullYear(currentYear + 1);
  }

  let timeRemaining = nextBirthday - new Date();

  let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  let age = nextBirthday.getFullYear() - birthDate.getFullYear();

  let obj = {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    age: age,
  };

  return obj;
};

/* Checking if there is a storedBdate in localStorage. If there is, it will run the CONTAINER_ACTION
function and setInterval function. If there is not, it will show the formContainer. */
if (storedBdate) {
  CONTAINER_ACTION();

  setInterval(() => {
    countdownContainer.innerHTML = RENDER_LAYOUT(GET_BIRTHDAY_COUNTDOWN(storedBdate));
  }, 1000);
} else {
  formContainer.hidden = false;
}
