// https://www.youtube.com/watch?v=Rib69h2DOxg

/* =================================== § TIME VARS === */
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const animationDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--animation-duration')) * 1000;

/* =================================== § PROJECT TIME VARS === */
const deadline = new Date('December 6, 2021 08:54:00');

/* =================================== § DOM === */
const containerDaysEl = document.getElementById('containerDays');
const containerHoursEl = document.getElementById('containerHours');
const containerMinutesEl = document.getElementById('containerMinutes');
const containerSecondsEl = document.getElementById('containerSeconds');
const countdownError = document.getElementById('countdownError');

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
  } else if (rawGap() <= 0) {
    // eslint-disable-next-line
    clearInterval(interval);
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
}

const interval = setInterval(countdown, second);
