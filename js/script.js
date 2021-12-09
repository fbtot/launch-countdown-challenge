// https://www.youtube.com/watch?v=Rib69h2DOxg
// https://www.youtube.com/watch?v=V-Mcul5kS_Y

/* =================================== § TIME VARS === */
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const animationDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--animation-duration')) * 1000;

/* =================================== § MOON DATA === */
async function fetchMoonData() {
  const response = await fetch('https://craigchamberlain.github.io/moon-data/api/moon-phase-data/2021/index.json');
  const moon = await response.json();

  return moon;
}

fetchMoonData().then((moon) => {
  console.log(moon.filter((el) => el.Phase === 2 && new Date(el.Date) >= new Date())[0]);
});

/* =================================== § DOM === */
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

const defaultDate = '2022-11-09T09:06:00';
let date = defaultDate;
let deadline = new Date(date);

/* =================================== § SUPPORT FUNCTIONS === */
function addZero(n) {
  return n.toString().length === 1 ? `0${n}` : n.toString();
}

function changeAttribute(element, attribute, change) {
  const selectedElements = element.querySelectorAll(`[${attribute}]`);

  Array.from(selectedElements).forEach((el) => {
    if (el.getAttribute(attribute) !== addZero(change)) {
      element.classList.add('flipped');
      setTimeout(() => {
        el.setAttribute(attribute, change);
      }, animationDuration);
      setTimeout(() => { element.classList.remove('flipped'); }, animationDuration);
    }
  });
}

/* =================================== § COUNTDOWN FUNCTION === */
function rawGap() {
  const now = new Date();
  return deadline - now > 0 ? deadline - now : 0;
}
function countdown() {
  /* ····················· § CURRENT ··· */
  const gapDays = Math.floor(rawGap() / day);
  const gapHours = Math.floor((rawGap() % day) / hour);
  const gapMinutes = Math.floor((rawGap() % hour) / minute);
  const gapSeconds = Math.floor((rawGap() % minute) / second);

  /* ····················· § NEXT ··· */
  const gapDaysNext = Math.floor((rawGap() - day) / day);
  const gapHoursNext = Math.floor(((rawGap() - hour) % day) / (hour));
  const gapMinutesNext = Math.floor(((rawGap() - minute) % hour) / minute);
  const gapSecondsNext = Math.floor(((rawGap() - second) % minute) / second);

  if (gapDays > 1000) {
    countdownError.classList.add('show');
  } else {
    changeAttribute(containerDaysEl, 'data-current-day', addZero(gapDays));
    changeAttribute(containerDaysEl, 'data-next-day', addZero(gapDaysNext));
    changeAttribute(containerHoursEl, 'data-current-hour', addZero(gapHours));
    changeAttribute(containerHoursEl, 'data-next-hour', addZero(gapHoursNext));
    changeAttribute(containerMinutesEl, 'data-current-minute', addZero(gapMinutes));
    changeAttribute(containerMinutesEl, 'data-next-minute', addZero(gapMinutesNext));
    changeAttribute(containerSecondsEl, 'data-current-second', addZero(gapSeconds));
    changeAttribute(containerSecondsEl, 'data-next-second', addZero(gapSecondsNext));
  }

  if (rawGap() <= 0) {
    // eslint-disable-next-line
    clearInterval(interval);
  }
}

const interval = setInterval(countdown, second);

/* ============================================ */
/* ··········································· § FORM ··· */
/* ======================================== */
// eslint-disable-next-line
if (!Modernizr.inputtypes['datetime-local']) {
  launchDateForm.style.display = 'none';
}

launchDateInput.value = date;

setButton.addEventListener('click', (e) => {
  e.preventDefault();
  date = launchDateInput.value;
  deadline = new Date(date);
});

resetButton.addEventListener('click', (e) => {
  e.preventDefault();
  date = defaultDate;
  deadline = new Date(date);
  launchDateInput.value = date;
});

faqIcon.addEventListener('click', () => {
  faqMessage.classList.toggle('show-message');
});
