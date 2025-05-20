import { getHours, isToday, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const API_KEY = "GRWWGGW9XNMGKR6HZWHNS95SV";

export async function getWeatherForecast(city) {
  if (!API_KEY) {
    throw new Error("API Key Missing!");
  }
  try {
    const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`;
    const response = await fetch(weatherUrl, { mode: "cors" });

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    if (!data) {
      throw new Error("Invalid weather data");
    }

    let filteredHours = await filterHours(data.days[0].hours, data.timezone);
    let convertedTime = await convertTime(data.timezone);

    return {
      address: data.address,
      completeAddress: data.resolvedAddress,
      current: {
        day: format(new Date(data.days[0].datetime), "EEE, MMM d"),
        desc: data.days[0].description,
        temp: data.days[0].temp,
        icon: data.days[0].icon,
        time: convertedTime,
      },
      hourly: filteredHours.map((hour) => ({
        time: hour.datetime,
        temp: hour.temp,
        icon: hour.icon,
      })),
      forecast: data.days.slice(0, 6).map((day) => ({
        dayOfWeek: isToday(day.datetime)
          ? "Today"
          : format(new Date(day.datetime), "EEE"),
        maxtemp: day.tempmax,
        mintemp: day.tempmin,
        icon: day.icon,
        condition: day.conditions,
      })),
    };
  } catch (e) {
    console.log(`Error fetching forecast: ${e.message}`);
    throw e;
  }
}

async function filterHours(hours, timeZone) {
  const utcDate = new Date();
  const zonedDate = toZonedTime(utcDate, timeZone);
  const currentTime = getHours(zonedDate);

  const laterHours = hours.filter((item) => {
    const hour = Number(item.datetime.split(":")[0]);
    return hour >= currentTime;
  });

  const earlyHours = hours.filter((item) => {
    const hour = Number(item.datetime.split(":")[0]);
    return hour < currentTime;
  });

  return [...laterHours, ...earlyHours];
}

async function convertTime(timeZone) {
  const utcTime = new Date();
  const zonedTime = toZonedTime(utcTime, timeZone);
  return format(zonedTime, "h:mm a");
}
