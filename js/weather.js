//Live Weather
const API_KEY = 'df37d34202d661594bfda73ab57cae7d';
let currentLocation = { lat: null, lon: null, name: '' };

// Icon mapping
const iconMap = {
  '01d': 'fa-sun', '01n': 'fa-moon',
  '02d': 'fa-cloud-sun', '02n': 'fa-cloud-moon',
  '03d': 'fa-cloud', '03n': 'fa-cloud',
  '04d': 'fa-cloud', '04n': 'fa-cloud',
  '09d': 'fa-cloud-rain', '09n': 'fa-cloud-rain',
  '10d': 'fa-cloud-rain', '10n': 'fa-cloud-rain',
  '11d': 'fa-bolt', '11n': 'fa-bolt',
  '13d': 'fa-snowflake', '13n': 'fa-snowflake',
  '50d': 'fa-smog', '50n': 'fa-smog'
};

function getWeatherIcon(iconCode) {
  return iconMap[iconCode] || 'fa-question';
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  setupSearch();
  getLocation();
});

function setupSearch() {
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');

  searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
      fetchWeatherByCity(city);
    }
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const city = searchInput.value.trim();
      if (city) {
        fetchWeatherByCity(city);
      }
    }
  });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation.lat = position.coords.latitude;
        currentLocation.lon = position.coords.longitude;
        fetchWeatherData();
      },
      (error) => {
        console.error('Geolocation error:', error);
        fetchWeatherByCity('Kolkata'); // Fallback
      }
    );
  } else {
    fetchWeatherByCity('Kolkata'); // Fallback
  }
}

async function fetchWeatherByCity(city) {
  try {
    showLoading();

    // Fetch coordinates first
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoResponse.json();

    if (geoData.length === 0) throw new Error('City not found');

    currentLocation = {
      lat: geoData[0].lat,
      lon: geoData[0].lon,
      name: geoData[0].name
    };

    fetchWeatherData();
  } catch (error) {
    console.error('Error:', error);
    showError(error.message);
  }
}

async function fetchWeatherData() {
  try {
    showLoading();

    // Current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.lat}&lon=${currentLocation.lon}&units=metric&appid=${API_KEY}`
    );
    const currentData = await currentResponse.json();

    // 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${currentLocation.lat}&lon=${currentLocation.lon}&units=metric&appid=${API_KEY}`
    );
    const forecastData = await forecastResponse.json();

    updateCurrentWeather(currentData);
    updateForecast(forecastData);

    // Refresh every 15 minutes
    setTimeout(fetchWeatherData, 900000);
  } catch (error) {
    console.error('Error:', error);
    showError(error.message);
  }
}

function updateCurrentWeather(data) {
  document.getElementById('currentLocation').textContent =
    `${data.name}, ${data.sys.country}`;
  document.getElementById('currentTemp').textContent =
    Math.round(data.main.temp);
  document.getElementById('humidity').textContent =
    `${data.main.humidity}%`;
  document.getElementById('pressure').textContent =
    `${data.main.pressure} hPa`;
  document.getElementById('windSpeed').textContent =
    `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  document.getElementById('feelsLike').textContent =
    `${Math.round(data.main.feels_like)}°C`;

  // Convert UNIX timestamps to time
  const formatTime = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  document.getElementById('sunrise').textContent =
    formatTime(data.sys.sunrise);
  document.getElementById('sunset').textContent =
    formatTime(data.sys.sunset);

  // Update icon
  const iconCode = data.weather[0].icon;
  document.getElementById('weatherIcon').className =
    `fas ${getWeatherIcon(iconCode)} weather-icon`;
}

function updateForecast(data) {
  const forecastContainer = document.getElementById('forecastContainer');
  forecastContainer.innerHTML = '';

  // Group by day (API returns data every 3 hours)
  const dailyForecast = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyForecast[date]) {
      dailyForecast[date] = [];
    }
    dailyForecast[date].push(item);
  });

  // Get forecast for next 7 days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let dayCount = 0;

  for (const date in dailyForecast) {
    if (dayCount >= 7) break;

    const dayData = dailyForecast[date];
    const dayName = days[new Date(dayData[0].dt * 1000).getDay()];

    // Find max and min temps
    const temps = dayData.map(item => item.main.temp);
    const dayTemp = Math.round(Math.max(...temps));
    const nightTemp = Math.round(Math.min(...temps));

    // Use midday condition as representative
    const middayCondition = dayData.find(item => {
      const hours = new Date(item.dt * 1000).getHours();
      return hours >= 10 && hours <= 14;
    }) || dayData[0];

    const forecastIcon = getWeatherIcon(middayCondition.weather[0].icon);

    const forecastDay = document.createElement('div');
    forecastDay.className = 'forecast-day';
    forecastDay.innerHTML = `
                    <div class="day">${dayName}</div>
                    <i class="fas ${forecastIcon}"></i>
                    <div class="temps">
                        <span class="high">${dayTemp}°</span> / 
                        <span class="low">${nightTemp}°</span>
                    </div>
                `;
    forecastContainer.appendChild(forecastDay);
    dayCount++;
  }
}

function showLoading() {
  document.getElementById('currentLocation').textContent = 'Loading...';
  document.getElementById('weatherIcon').className = 'fas fa-spinner fa-spin weather-icon';
}

function showError(message) {
  document.getElementById('currentLocation').textContent = `Error: ${message}`;
  document.getElementById('weatherIcon').className = 'fas fa-exclamation-triangle weather-icon';
}