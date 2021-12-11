// https://www.youtube.com/watch?v=Rib69h2DOxg
// https://www.youtube.com/watch?v=V-Mcul5kS_Y

/* ============================================ */
/* ··········································· § TIME CONSTANTS ··· */
/* ======================================== */
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const animationDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--animation-duration')) * 1000;

/* ============================================ */
/* ··········································· § DOM ELEMENTS ··· */
/* ======================================== */
const containerDaysEl = document.getElementById('containerDays');
const containerHoursEl = document.getElementById('containerHours');
const containerMinutesEl = document.getElementById('containerMinutes');
const containerSecondsEl = document.getElementById('containerSeconds');
const countdownError = document.getElementById('countdownError');
const launchDateForm = document.getElementById('launchDateForm');
const launchDateInput = document.getElementById('launchDateInput');
const resetButton = document.getElementById('resetButton');
const setButton = document.getElementById('setButton');
const faqIcon = document.getElementById('faqIcon');
const faqMessage = document.getElementById('faqMessage');

/* ============================================ */
/* ··········································· § DATE VARS ··· */
/* ======================================== */

// Fallback in case fetching goes wrtong
const timeZone = -(new Date().getTimezoneOffset()) * minute;
const defaultDate = new Date(new Date().getTime() + (day * 7)).toISOString().slice(0, -8);
let nextFullMoonDate = '';

const date = () => (nextFullMoonDate === '' ? defaultDate : nextFullMoonDate);
let deadline = new Date(new Date(date()).getTime() + timeZone);

/* ============================================ */
/* ··········································· § SUPPORT FUNCTIONS ··· */
/* ======================================== */
function addZero(n) {
  return n.toString().length === 1 ? `0${n}` : n.toString();
}

function changeAttribute(element, attribute, change) {
  const selectedElements = element.querySelectorAll(`[${attribute}]`);

  Array.from(selectedElements).forEach((el) => {
    // change the content of the attrbute and add the animation only if it's different than change.
    if (el.getAttribute(attribute) !== addZero(change)) {
      // Start the animation
      element.classList.add('flipped');

      // change the attribute at the end of the animation
      setTimeout(() => {
        el.setAttribute(attribute, change);
      }, animationDuration);

      // remove the class that triggered the animation
      setTimeout(() => { element.classList.remove('flipped'); }, animationDuration);
    }
  });
}

// calculate the gap between now and the deadline in milliseconds
function rawGap() {
  const now = new Date();
  return deadline - now > 0 ? deadline - now : 0;
}

/* ============================================ */
/* ··········································· § COUNTDOWN ··· */
/* ======================================== */

function countdown() {
  /* ····················· § CURRENT ··· */
  // calculate the gaps for the current values
  const gapDays = Math.floor(rawGap() / day);
  const gapHours = Math.floor((rawGap() % day) / hour);
  const gapMinutes = Math.floor((rawGap() % hour) / minute);
  const gapSeconds = Math.floor((rawGap() % minute) / second);

  /* ····················· § NEXT ··· */
  // calculate the gaps for the next values
  const gapDaysNext = Math.floor((rawGap() - day) / day);
  const gapHoursNext = Math.floor(((rawGap() - hour) % day) / (hour));
  const gapMinutesNext = Math.floor(((rawGap() - minute) % hour) / minute);
  const gapSecondsNext = Math.floor(((rawGap() - second) % minute) / second);

  if (gapDays > 1000) {
    countdownError.classList.add('show');
  } else {
    // Change attributes to all the flips
    changeAttribute(containerDaysEl, 'data-current-day', addZero(gapDays));
    changeAttribute(containerDaysEl, 'data-next-day', addZero(gapDaysNext));
    changeAttribute(containerHoursEl, 'data-current-hour', addZero(gapHours));
    changeAttribute(containerHoursEl, 'data-next-hour', addZero(gapHoursNext));
    changeAttribute(containerMinutesEl, 'data-current-minute', addZero(gapMinutes));
    changeAttribute(containerMinutesEl, 'data-next-minute', addZero(gapMinutesNext));
    changeAttribute(containerSecondsEl, 'data-current-second', addZero(gapSeconds));
    changeAttribute(containerSecondsEl, 'data-next-second', addZero(gapSecondsNext));
  }

  // when the gap is 0, stop repeating the function
  if (rawGap() <= 0) {
    // eslint-disable-next-line
    clearInterval(interval);
  }
}

const interval = setInterval(countdown, second);

/* ============================================ */
/* ··········································· § MOON DATA ··· */
/* ======================================== */
// retrieve the date of the next full moon
async function getNextFullMoon(year = new Date().getFullYear()) {
  const response = fetch(`https://craigchamberlain.github.io/moon-data/api/moon-phase-data/${year}/index.json`);
  const moon = await (await response).json();

  // take the date of the first full moon after today
  const nextFullMoon = await moon.filter(

    // the Phase number 2 is the full moon
    (el) => el.Phase === 2 && new Date(el.Date) >= new Date(),
  )[0];

  // If the next full moon is in the current year, retrieve it.
  // Else call the functon again adding 1 to the year.
  if (nextFullMoon) return nextFullMoon.Date;
  // eslint-disable-next-line
  return getNextFullMoon(year += 1);
}

getNextFullMoon().then((moon) => {
  nextFullMoonDate = moon;
  deadline = new Date(date());
  launchDateInput.value = date();
  return interval;
}).catch(() => interval);

/* ============================================ */
/* ··········································· § FORM ··· */
/* ======================================== */
// eslint-disable-next-line
if (!Modernizr.inputtypes['datetime-local']) {
  launchDateForm.style.display = 'none';
}

launchDateInput.value = new Date(date()).toISOString().slice(0, -8);

setButton.addEventListener('click', (e) => {
  e.preventDefault();
  deadline = new Date(launchDateInput.value);
});

resetButton.addEventListener('click', (e) => {
  e.preventDefault();
  deadline = new Date(date());
  launchDateInput.value = date();
});

faqIcon.addEventListener('click', () => {
  faqMessage.classList.toggle('show-message');
});
