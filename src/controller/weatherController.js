import { getWeatherForecast } from "../model/weatherAPI";
import { addEventListeners } from "../view/view";
import { render } from "../view/view";

const spinner = document.querySelector(".spinner-content");
const spinnerDesc = document.querySelector(".spinner-desc");

export async function init() {
  addEventListeners();
}

export async function handleSearch(city) {
  try {
    spinner.style.display = "flex";
    spinnerDesc.style.display = "flex";
    spinnerDesc.textContent = `Fetching Data for ${city}...`;
    const data = await getWeatherForecast(city);
    console.log(data);
    spinner.style.display = "none";
    spinnerDesc.style.display = "none";
    if (data) {
      render(data);
    }
  } catch (e) {
    const forecastDashboard = document.querySelector(".forecast-dashboard");
    if (forecastDashboard) {
      forecastDashboard.style.display = "none";
    }
    spinner.style.display = "flex";
    spinnerDesc.style.display = "flex";
    spinnerDesc.textContent =
      "Unable to fetch Data from API. Enter valid City.";
    console.log(e);
  }
}
