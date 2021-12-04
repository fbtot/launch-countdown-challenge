// https://www.youtube.com/watch?v=Rib69h2DOxg

/* =================================== § TIME VARS === */
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

/* =================================== § PROJECT TIME VARS === */
const deadline = new Date('December 8, 2021 00:00:00');

/* =================================== § DOM === */

/* =================================== § COUNTDOWN FUNCTION === */
function countdown() {
  const now = new Date();
  const rawGap = deadline - now;

  /* ····················· § CURRENT ··· */
  const gapDays = Math.floor(rawGap / day);
  const gapHours = Math.floor((rawGap % day) / hour);
  const gapMinutes = Math.floor((rawGap % hour) / minute);
  const gapSeconds = Math.floor((rawGap % minute) / second);

  /* ····················· § NEXT ··· */
  const gapDaysNext = Math.floor((rawGap - day) / day);
  const gapHoursNext = Math.floor(((rawGap - hour) % day) / (hour));
  const gapMinutesNext = Math.floor(((rawGap - minute) % hour) / minute);
  const gapSecondsNext = Math.floor(((rawGap - second) % minute) / second);
}

countdown();

// setInterval(countdown, second);
