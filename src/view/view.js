import "../styles/view";
import { weatherIcons } from "../view/weatherIcons";
import { handleSearch } from "../controller/weatherController";

export function addEventListeners() {
  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");

  const getCity = () => searchInput.value.trim();

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const city = getCity();
      if (city === "") {
        alert("Enter valid city");
        return;
      }
      handleSearch(city);
      searchInput.value = "";
    }
  });

  searchBtn.addEventListener("click", () => {
    const city = getCity();
    if (city === "") {
      alert("Enter valid city");
      return;
    }
    handleSearch(city);
    searchInput.value = "";
  });
}

export function render(data) {
  const forecastContent = document.querySelector(".forecast-content");
  forecastContent.innerHTML = "";

  const forecastDashboard = document.createElement("div");
  forecastDashboard.classList.add("forecast-dashboard");

  const todaysForecast = document.createElement("div");
  todaysForecast.classList.add("todays-forecast");

  //Main Weather Card Content
  const weatherContent = document.createElement("div");
  weatherContent.classList.add("weather-content");

  const dateTimeContainer = document.createElement("div");
  dateTimeContainer.classList.add("datetime-container");

  const dateContent = document.createElement("div");
  dateContent.classList.add("date-content");
  dateContent.textContent = data.current.day;

  const timeContent = document.createElement("div");
  timeContent.classList.add("time-content");
  timeContent.textContent = data.current.time;

  dateTimeContainer.appendChild(dateContent);
  dateTimeContainer.appendChild(timeContent);

  const locationContainer = document.createElement("div");
  locationContainer.classList.add("location-container");

  const cityString = data.completeAddress;
  const [cityContent, ...rest] = cityString.split(",");
  const region = rest.join(",").trim();

  const city = document.createElement("div");
  city.classList.add("city");
  city.textContent = cityContent;

  const country = document.createElement("div");
  country.classList.add("country");
  country.textContent = region;

  locationContainer.appendChild(city);
  locationContainer.appendChild(country);

  const tempContainer = document.createElement("div");
  tempContainer.classList.add("temp-container");
  tempContainer.textContent = data.current.temp;

  const conditionContainer = document.createElement("div");
  conditionContainer.classList.add("condition-container");

  const conditionIcon = document.createElement("div");
  conditionIcon.classList.add("condition-icon");

  const conditionImg = document.createElement("img");
  conditionImg.src = weatherIcons[data.current.icon];
  conditionImg.alt = `${data.current.icon} Icon`;

  conditionIcon.appendChild(conditionImg);

  const conditionDesc = document.createElement("div");
  conditionDesc.classList.add("condition-desc");

  const conditionPara = document.createElement("p");
  conditionPara.textContent = data.current.desc;

  conditionDesc.appendChild(conditionPara);

  conditionContainer.appendChild(conditionIcon);
  conditionContainer.appendChild(conditionDesc);

  weatherContent.appendChild(dateTimeContainer);
  weatherContent.appendChild(locationContainer);
  weatherContent.appendChild(tempContainer);
  weatherContent.appendChild(conditionContainer);

  //Hourly Forecast Content
  const hourlyForecast = document.createElement("div");
  hourlyForecast.classList.add("hourly-forecast");

  const hourlyHeader = document.createElement("div");
  hourlyHeader.classList.add("hourly-header");
  hourlyHeader.textContent = `Today's Forecast`;

  const hourlyForecastContainer = createHourlyForecastContainer(data.hourly);

  hourlyForecast.appendChild(hourlyHeader);
  hourlyForecast.appendChild(hourlyForecastContainer);

  todaysForecast.appendChild(weatherContent);
  todaysForecast.appendChild(hourlyForecast);

  const weeklyForecast = document.createElement("div");
  weeklyForecast.classList.add("weekly-forecast");

  const weeklyHeader = document.createElement("div");
  weeklyHeader.classList.add("weekly-header");
  weeklyHeader.textContent = `This Week's Forecast`;

  const weeklyForecastContainer = createWeeklyForecastContainer(data.forecast);

  weeklyForecast.appendChild(weeklyHeader);
  weeklyForecast.appendChild(weeklyForecastContainer);

  forecastDashboard.appendChild(todaysForecast);
  forecastDashboard.appendChild(weeklyForecast);

  forecastContent.appendChild(forecastDashboard);
}

function createHourlyForecastContainer(hours) {
  const hourlyForecastDiv = document.createElement("div");
  hourlyForecastDiv.classList.add("hourly-forecast-container");

  hours.forEach((hour) => {
    const hourDiv = document.createElement("div");
    hourDiv.classList.add("hour");

    const hourIcon = document.createElement("img");
    hourIcon.src = weatherIcons[hour.icon];

    const hourTemp = document.createElement("div");
    hourTemp.classList.add("hour-temp");
    hourTemp.textContent = hour.temp;

    const hourTime = document.createElement("div");
    hourTime.classList.add("hour-time");
    hourTime.textContent = hour.time;

    hourDiv.appendChild(hourIcon);
    hourDiv.appendChild(hourTemp);
    hourDiv.appendChild(hourTime);

    hourlyForecastDiv.appendChild(hourDiv);
  });

  return hourlyForecastDiv;
}

function createWeeklyForecastContainer(days) {
  const weeklyForecastDiv = document.createElement("div");
  weeklyForecastDiv.classList.add("weekly-forecast-container");

  days.forEach((day) => {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");

    const dayContent = document.createElement("div");
    dayContent.classList.add("day-content");
    dayContent.textContent = day.dayOfWeek;

    const dayIcon = document.createElement("img");
    dayIcon.src = weatherIcons[day.icon];

    const dayTemp = document.createElement("div");
    dayTemp.classList.add("day-temp");
    dayTemp.textContent = `${day.maxtemp}/${day.mintemp}`;

    const dayCondition = document.createElement("div");
    dayCondition.classList.add("day-condition");
    dayCondition.textContent = day.condition;

    dayDiv.appendChild(dayContent);
    dayDiv.appendChild(dayIcon);
    dayDiv.appendChild(dayCondition);
    dayDiv.appendChild(dayTemp);

    weeklyForecastDiv.appendChild(dayDiv);
  });

  return weeklyForecastDiv;
}
