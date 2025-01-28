import { addDays, format, startOfWeek } from "date-fns";

export const generateWeeks = (year) => {
  let weeks = [];
  let currentDate = new Date(year, 0, 1);
  currentDate = startOfWeek(currentDate, { weekStartsOn: 1 });

  while (
    currentDate.getFullYear() === year ||
    (currentDate.getFullYear() === year + 1 && currentDate.getMonth() === 0)
  ) {
    let startOfWeekFormatted = format(currentDate, "yyyy-MM-dd");
    let endOfWeekFormatted = format(addDays(currentDate, 6), "yyyy-MM-dd");
    weeks.push(`${startOfWeekFormatted} : ${endOfWeekFormatted}`);
    currentDate = addDays(currentDate, 7);
  }
  return weeks;
};

export const getWeekRange = (startDate) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return `${startDate
    .toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-")} : ${endDate
    .toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-")}`;
};

export const getWeeksOfMonth = (year, month) => {
  const weeks = [];
  let date = new Date(year, month, 1);
  const firstDay = date.getDay();

  if (firstDay !== 1) {
    const diff = firstDay === 0 ? 1 : 8 - firstDay;
    date.setDate(date.getDate() + diff);
  }

  while (
    date.getMonth() === month ||
    (date.getMonth() === (month + 1) % 12 && date.getDate() <= 6)
  ) {
    const startOfWeek = new Date(date);
    weeks.push(getWeekRange(startOfWeek));
    date.setDate(date.getDate() + 7);
  }
  return weeks;
};

export const generateDates = (year, month, week) => {
  const weeks = getWeeksOfMonth(year, month);
  const [startOfWeekFormatted, endOfWeekFormatted] =
    weeks[week - 1].split(" : ");
  let dates = [];
  let currentDate = new Date(`${startOfWeekFormatted}`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = format(currentDate, "yyyy-MM-dd").toUpperCase();
    dates.push({
      inDate: date,
      outDate: date,
      inTimeHH: "",
      inTimeMM: "",
      inPeriod: "",
      outTimeHH: "",
      outTimeMM: "",
      outPeriod: "",
      attendanceStatus: "",
      status: "",
      hours: "",
      disabled: currentDate.getTime() !== today.getTime(), // Adjust disabled logic
      weekRange: `${startOfWeekFormatted} - ${endOfWeekFormatted}`,
    });
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};

export const calculateHours = (inTime, outTime) => {
  const [inHour, inMinute] = inTime.split(":").map(Number);
  const [outHour, outMinute] = outTime.split(":").map(Number);
  const inTotalMinutes = inHour * 60 + inMinute;
  const outTotalMinutes = outHour * 60 + outMinute;
  let diffInMinutes;
  if (outTotalMinutes < inTotalMinutes) {
    diffInMinutes = 1440 - inTotalMinutes + outTotalMinutes;
  } else {
    diffInMinutes = outTotalMinutes - inTotalMinutes;
  }

  const diffHours = Math.floor(diffInMinutes / 60);
  const diffMinutes = diffInMinutes % 60;
  return `${diffHours}:${diffMinutes < 10 ? "0" : ""}${diffMinutes}`;
};
