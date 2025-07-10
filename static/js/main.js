// earthwatch.js - Consolidated JavaScript for EarthWatch Project

/****************************
 * INITIALIZATION & GLOBALS
 ****************************/
let currentLocation = { lat: null, lon: null, name: '' };
let map = null;
let earthquakeLayer = null;

// Weather icon mapping
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

/****************************
 * LOADER ANIMATION
 ****************************/
function initLoader() {
  updateProgress();

  // Random seismic events during loading
  const seismicInterval = setInterval(() => {
    if (Math.random() > 0.7) {
      triggerSeismicEvent();
    }
  }, 1500);

  // Clear seismic interval when loader is hidden
  setTimeout(() => {
    clearInterval(seismicInterval);
  }, 5000);
}

function updateProgress() {
  const progressBar = document.querySelector('.progress-bar');
  const progressText = document.querySelector('.progress-text');
  let progress = 0;

  // First phase - fast progress to ~90%
  const fastInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 90) {
      progress = 90;
      clearInterval(fastInterval);
      startSlowPhase();
    }
    updateProgressBar(progress);
  }, 200);

  function startSlowPhase() {
    const slowInterval = setInterval(() => {
      progress += Math.random() * 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(slowInterval);
        completeLoading();
      }
      updateProgressBar(progress);
    }, 300);
  }

  function updateProgressBar(currentProgress) {
    const roundedProgress = Math.round(currentProgress);
    progressText.textContent = roundedProgress + '%';
    progressBar.style.opacity = roundedProgress / 100;
    progressBar.style.backgroundColor = `rgba(0, 200, 255, ${roundedProgress / 100})`;
  }

  function completeLoading() {
    document.querySelector('.status-value.syncing').textContent = 'ONLINE';
    document.querySelector('.status-value.syncing').className = 'status-value online';
    document.querySelector('.status-value.encrypting').textContent = 'SECURE';
    setTimeout(hideLoader, 800);
  }
}

function triggerSeismicEvent() {
  const seismicWaves = document.querySelector('.seismic-waves');
  const newWave = document.createElement('div');
  newWave.className = 'seismic-wave';
  seismicWaves.appendChild(newWave);
  setTimeout(() => newWave.remove(), 2000);
}

function hideLoader() {
  const loader = document.querySelector('.earthwatch-loader');
  loader.style.opacity = '0';
  setTimeout(() => loader.style.display = 'none', 500);
}

/****************************
 * THEME & UI CONTROLS
 ****************************/
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-theme');
    const isLight = document.documentElement.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
  }
}

function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');
  if (!mobileMenuBtn || !navLinks) return;

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  });
}

function initScrollToTop() {
  const cyberBtn = document.getElementById('cyberScrollBtn');
  if (!cyberBtn) return;

  window.addEventListener('scroll', () => {
    cyberBtn.classList.toggle('visible', window.scrollY > 500);
  });

  cyberBtn.addEventListener('click', () => {
    cyberBtn.style.transform = 'scale(1.2)';
    cyberBtn.style.boxShadow = '0 0 40px rgba(100, 180, 255, 0.9)';
    setTimeout(() => {
      cyberBtn.style.transform = 'scale(1)';
      cyberBtn.style.boxShadow = '0 0 25px rgba(100, 180, 255, 0.7)';
    }, 500);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/****************************
 * NAVIGATION & SCROLL
 ****************************/
function initNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - sectionHeight * 0.25) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        setTimeout(updateActiveNav, 1000);
      }
    });
  });

  // Scroll-based navigation
  updateActiveNav();
  window.addEventListener('scroll', () => {
    let ticking = false;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });
}

/****************************
 * WEATHER FUNCTIONS
 ****************************/
function initWeather() {
  setupSearch();
  getLocation();
  setupRefreshButton();
}

function setupSearch() {
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');

  searchButton?.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) fetchWeatherByCity(city);
  });

  searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      fetchWeatherByCity(searchInput.value.trim());
    }
  });
}

function setupRefreshButton() {
  document.getElementById('refreshWeather')?.addEventListener('click', () => {
    if (currentLocation.lat && currentLocation.lon) {
      fetchWeatherData();
    } else {
      getLocation();
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
      () => fetchWeatherByCity('Kolkata') // Fallback
    );
  } else {
    fetchWeatherByCity('Kolkata'); // Fallback
  }
}

async function fetchWeatherByCity(city) {
  try {
    showLoading();
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    if (!response.ok) throw new Error('City not found');
    
    const data = await response.json();
    currentLocation = {
      lat: data.current.coord.lat,
      lon: data.current.coord.lon,
      name: data.current.name
    };
    
    updateCurrentWeather(data.current);
    updateForecast(data.forecast);
  } catch (error) {
    console.error('Error:', error);
    showError(error.message);
  }
}

async function fetchWeatherData() {
  try {
    showLoading();
    const response = await fetch(`/api/weather?lat=${currentLocation.lat}&lon=${currentLocation.lon}`);
    if (!response.ok) throw new Error('Weather data not available');
    
    const data = await response.json();
    updateCurrentWeather(data.current);
    updateForecast(data.forecast);

    // Auto-refresh every 15 minutes
    setTimeout(fetchWeatherData, 900000);
  } catch (error) {
    console.error('Error:', error);
    showError(error.message);
  }
}

function updateCurrentWeather(data) {
  document.getElementById('currentLocation').textContent = `${data.name}, ${data.sys?.country || ''}`;
  document.getElementById('currentTemp').textContent = Math.round(data.main.temp);
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
  document.getElementById('windSpeed').textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;

  // New updates for quick status section
  document.getElementById('curtLoct').textContent = `${data.name}, ${data.sys?.country || ''}`;
  document.getElementById('curtTemp').textContent = Math.round(data.main.temp);
  document.getElementById('curtfeels').textContent = Math.round(data.main.feels_like);
  document.getElementById('weatherDesc').textContent = data.weather[0].description;

  // Convert UNIX timestamps to time
  const formatTime = (timestamp) => new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (data.sys?.sunrise) document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise);
  if (data.sys?.sunset) document.getElementById('sunset').textContent = formatTime(data.sys.sunset);

  // Update icon (for both sections)
  const iconCode = data.weather[0].icon;
  document.getElementById('weatherIcon').className = `fas ${getWeatherIcon(iconCode)} weather-icon`;
}

function updateForecast(data) {
  const forecastContainer = document.getElementById('forecastContainer');
  if (!forecastContainer) return;
  forecastContainer.innerHTML = '';

  // Group by day (API returns data every 3 hours)
  const dailyForecast = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyForecast[date]) dailyForecast[date] = [];
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

function getWeatherIcon(iconCode) {
  return iconMap[iconCode] || 'fa-question';
}

/****************************
 * EARTHQUAKE MAP & DATA
 ****************************/
function initEarthquakeMap() {
  if (!document.getElementById('quakeMap')) return;

  // Initialize map
  map = L.map('quakeMap').setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Load initial data
  loadEarthquakeData();

  // Set up refresh button
  document.getElementById('refreshQuakes')?.addEventListener('click', () => {
    document.getElementById('mapLoading').style.display = 'flex';
    document.getElementById('listLoading').style.display = 'flex';
    loadEarthquakeData();
  });

  // Auto-refresh every 5 minutes
  setInterval(loadEarthquakeData, 300000);
}

function loadEarthquakeData() {
  const startTime = performance.now();
  document.getElementById('mapLoading').style.display = 'flex';
  document.getElementById('listLoading').style.display = 'flex';

  // Remove existing layer
  if (earthquakeLayer) {
    map.removeLayer(earthquakeLayer);
  }

  // Use lightweight endpoint for initial load
  const useLightEndpoint = !earthquakeLayer;
  const days = useLightEndpoint ? 1 : 7;
  
  fetch(`/api/earthquakes?days=${days}`)
    .then(response => response.json())
    .then(data => {
      const features = data.features.sort((a, b) => b.properties.time - a.properties.time);
      renderQuakeList(features);
      renderMapMarkers(features);
      document.getElementById('mapLoading').style.display = 'none';
      document.getElementById('listLoading').style.display = 'none';
      console.log(`Data loaded in ${(performance.now() - startTime).toFixed(0)}ms`);

      // Load full dataset after initial load
      if (useLightEndpoint) {
        setTimeout(loadEarthquakeData, 1000);
      }
    })
    .catch(error => {
      console.error('Error fetching earthquake data:', error);
      document.getElementById('mapLoading').style.display = 'none';
      document.getElementById('listLoading').style.display = 'none';
    });
}

function renderQuakeList(features) {
  const quakeList = document.getElementById('quakeList');
  if (!quakeList) return;
  quakeList.innerHTML = '';

  features.slice(0, 20).forEach(feature => {
    const quakeItem = document.createElement('div');
    quakeItem.className = 'quake-item';
    quakeItem.dataset.time = feature.properties.time;

    const magnitude = feature.properties.mag;
    const depth = feature.geometry.coordinates[2];

    quakeItem.innerHTML = `
      <div class="quake-magnitude" style="background: ${getColor(magnitude)}">${magnitude}</div>
      <div class="quake-details">
        <div class="quake-location">${feature.properties.place}</div>
        <div class="quake-time">${timeAgo(feature.properties.time)}</div>
        <div class="quake-depth">Depth: ${depth} km</div>
      </div>
    `;
    quakeList.appendChild(quakeItem);
  });

  updateTimeDisplays();
}

function renderMapMarkers(features) {
  earthquakeLayer = L.geoJSON(features, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: Math.min(feature.properties.mag * 2, 15),
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(
        `<strong>${feature.properties.place}</strong><br>
         Magnitude: ${feature.properties.mag}<br>
         Depth: ${feature.geometry.coordinates[2]} km<br>
         Time: ${new Date(feature.properties.time).toLocaleString()}<br>
         <em>${timeAgo(feature.properties.time)}</em>`
      );
    }
  }).addTo(map);
}

function updateTimeDisplays() {
  const quakeItems = document.querySelectorAll('.quake-item');
  quakeItems.forEach(item => {
    const timestamp = item.dataset.time;
    const timeElement = item.querySelector('.quake-time');
    if (timestamp && timeElement) {
      timeElement.textContent = timeAgo(parseInt(timestamp));
    }
  });

  // Update last updated time
  const now = new Date();
  document.getElementById('mapUpdateTime').textContent = now.toLocaleTimeString();
  document.getElementById('listUpdateTime').textContent = now.toLocaleTimeString();
}

function timeAgo(timestamp) {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " year" + (interval === 1 ? "" : "s") + " ago";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s") + " ago";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s") + " ago";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
  return Math.floor(seconds) + " second" + (Math.floor(seconds) === 1 ? "" : "s") + " ago";
}

function getColor(magnitude) {
  return magnitude > 5 ? '#f94144' :
    magnitude > 3 ? '#f8961e' :
      '#4cc9f0';
}

/****************************
 * PREDICTION MODALS
 ****************************/
function initPredictionModals() {
  // Modal elements
  const weatherModal = document.getElementById('weatherPredictionModal');
  const quakeModal = document.getElementById('quakePredictionModal');
  const weatherTriggerBtn = document.getElementById('weatherTriggerBtn');
  const quakeTriggerBtn = document.getElementById('quakeTriggerBtn');
  const closeModalBtns = document.querySelectorAll('.close-modal');

  // Open modals
  weatherTriggerBtn?.addEventListener('click', () => {
    weatherModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  quakeTriggerBtn?.addEventListener('click', () => {
    quakeModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  // Close modals
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      weatherModal.style.display = 'none';
      quakeModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  });

  // Close when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === weatherModal) {
      weatherModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
    if (e.target === quakeModal) {
      quakeModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Form submissions
  document.getElementById('weatherPredictionForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const temp = document.getElementById('weatherTemp').value;
    const humidity = document.getElementById('weatherHumidity').value;
    const wind = document.getElementById('weatherWind').value;
    const cloud = document.getElementById('weatherCloud').value;
    const date = document.getElementById('weatherDate').value;

    if (!temp || !humidity || !wind || !cloud || !date) {
      alert('Please fill in all fields');
      return;
    }

    simulateWeatherPrediction(temp, humidity, wind, cloud, date);
    weatherModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  document.getElementById('quakePredictionForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const lat = parseFloat(document.getElementById('quakeLatitude').value);
    const lng = parseFloat(document.getElementById('quakeLongitude').value);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates');
      return;
    }

    simulateQuakePrediction(lat, lng);
    quakeModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
}

function simulateWeatherPrediction(temp, humidity, wind, cloud, date) {
  const weatherResult = document.getElementById('weatherPredictionResult');
  if (!weatherResult) return;

  weatherResult.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Analyzing weather patterns...</p>';
  weatherResult.classList.remove('active');

  setTimeout(() => {
    const conditions = ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    weatherResult.classList.add('active');
    weatherResult.innerHTML = `
      <h4>${new Date(date).toLocaleDateString()}</h4>
      <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0;">
        <i class="fas ${getWeatherIcon(condition)}" style="font-size: 2rem; color: ${getWeatherColor(condition)};"></i>
        <span style="font-size: 1.5rem; font-weight: 700;">${temp}°C</span>
        <span style="font-size: 1rem; color: var(--text-secondary);">${condition.toUpperCase()}</span>
      </div>
      <div class="prediction-details">
        <p><span>Confidence:</span> <span>${Math.floor(Math.random() * 30) + 70}%</span></p>
        <p><span>Humidity:</span> <span>${humidity}%</span></p>
        <p><span>Wind Speed:</span> <span>${wind} km/h</span></p>
        <p><span>Precipitation:</span> <span>${cloud}%</span></p>
      </div>
    `;
  }, 2000);
}

function simulateQuakePrediction(lat, lng) {
  const quakeResult = document.getElementById('quakePredictionResult');
  if (!quakeResult) return;

  quakeResult.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Analyzing seismic activity...</p>';
  quakeResult.classList.remove('active');

  setTimeout(() => {
    const riskLevel = Math.floor(Math.random() * 100);
    const mag = (Math.random() * 4 + 1).toFixed(1);
    const confidence = Math.floor(Math.random() * 30) + 65;

    quakeResult.classList.add('active');
    quakeResult.innerHTML = `
      <h4>Seismic Risk Assessment</h4>
      <p>Location: (${lat.toFixed(4)}, ${lng.toFixed(4)})</p>

      <div style="margin: 1rem 0;">
        <div style="display: flex; justify-content: space-between;">
          <span>Risk Level:</span>
          <span style="font-weight: 700; color: ${getRiskColor(riskLevel)};">${riskLevel}%</span>
        </div>
        <div class="risk-indicator">
          <div class="risk-level" style="width: ${riskLevel}%; background: ${getRiskColor(riskLevel)};"></div>
        </div>
      </div>

      <div class="prediction-details">
        <p><span>Highest Potential Magnitude:</span> <span>${mag}</span></p>
        <p><span>Confidence:</span> <span>${confidence}%</span></p>
        <p><span>Historical Activity:</span> <span>${Math.floor(Math.random() * 20) + 5} quakes/year</span></p>
      </div>
    `;
  }, 2000);
}

function getWeatherColor(condition) {
  const colors = {
    sunny: 'var(--sun-light)',
    cloudy: 'var(--cloud-dark)',
    rainy: 'var(--rain-heavy)',
    stormy: 'var(--storm-dark)',
    snowy: 'var(--cloud-light)'
  };
  return colors[condition] || 'var(--primary)';
}

function getRiskColor(risk) {
  return risk < 30 ? 'var(--success)' :
    risk < 70 ? 'var(--warning)' :
      'var(--danger)';
}

/****************************
 * USER REPORTS
 ****************************/
function initUserReports() {
  document.getElementById('observationForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const type = document.getElementById('observationType').value;
    const location = document.getElementById('location').value;
    const details = document.getElementById('details').value;
    const severity = document.getElementById('severity').value;

    const newReport = createReportElement(type, location, details, severity);
    const reportsList = document.querySelector('.reports-list');
    reportsList.insertBefore(newReport, reportsList.firstChild);
    this.reset();
  });
}

function createReportElement(type, location, details, severity) {
  let iconClass, typeClass, typeDisplay;
  switch (type) {
    case 'weather':
      iconClass = 'fas fa-cloud-rain';
      typeClass = 'weather';
      typeDisplay = '';
      break;
    case 'earthquake':
      iconClass = 'fas fa-mountain';
      typeClass = 'quake';
      typeDisplay = '';
      break;
    case 'flood':
      iconClass = 'fas fa-water';
      typeClass = 'flood';
      typeDisplay = '';
      break;
    default:
      iconClass = 'fas fa-exclamation';
      typeClass = '';
      typeDisplay = 'Observation';
  }

  const reportItem = document.createElement('div');
  reportItem.className = 'report-item';
  const timestamp = new Date();
  reportItem.dataset.timestamp = timestamp.toISOString();

  reportItem.innerHTML = `
    <div class="report-type ${typeClass}">
      <i class="${iconClass}"></i>
    </div>
    <div class="report-content">
      <h4>${typeDisplay} ${details}</h4>
      <p>${location}, <span class="time-ago">just now</span></p>
      ${severity ? `<span class="report-severity ${severity}">${severity.charAt(0).toUpperCase() + severity.slice(1)}</span>` : ''}
    </div>
  `;

  updateTimeAgo(reportItem);
  const intervalId = setInterval(() => updateTimeAgo(reportItem), 60000);
  reportItem.dataset.intervalId = intervalId;
  return reportItem;
}

function updateTimeAgo(reportItem) {
  const timestamp = new Date(reportItem.dataset.timestamp);
  const seconds = Math.floor((new Date() - timestamp) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    reportItem.querySelector('.time-ago').textContent = interval === 1 ? "1 year ago" : `${interval} years ago`;
    return;
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    reportItem.querySelector('.time-ago').textContent = interval === 1 ? "1 month ago" : `${interval} months ago`;
    return;
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    reportItem.querySelector('.time-ago').textContent = interval === 1 ? "1 day ago" : `${interval} days ago`;
    return;
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    reportItem.querySelector('.time-ago').textContent = interval === 1 ? "1 hour ago" : `${interval} hours ago`;
    return;
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    reportItem.querySelector('.time-ago').textContent = interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
    return;
  }

  reportItem.querySelector('.time-ago').textContent = "just now";
}

/****************************
 * HISTORY CHARTS
 ****************************/
function initHistoryCharts() {
  if (typeof Chart === 'undefined') return;

  // Temperature Chart
  const tempCtx = document.getElementById('tempChart');
  if (tempCtx) {
    new Chart(tempCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Average Temperature (°C)',
          data: [12, 13, 16, 19, 23, 27, 30, 29, 26, 21, 16, 13],
          borderColor: '#FFD700',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: false } }
      }
    });
  }

  // Precipitation Chart
  const precipCtx = document.getElementById('precipChart');
  if (precipCtx) {
    new Chart(precipCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Precipitation (mm)',
          data: [80, 70, 65, 60, 45, 20, 10, 15, 40, 75, 90, 85],
          backgroundColor: '#4682B4',
          borderColor: '#4682B4',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // Earthquake Chart
  const quakeCtx = document.getElementById('quakeChart');
  if (quakeCtx) {
    new Chart(quakeCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Earthquakes > M4.0',
          data: [120, 110, 130, 140, 125, 115, 105, 110, 125, 135, 145, 130],
          backgroundColor: '#E74C3C',
          borderColor: '#E74C3C',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // Tab functionality
  const historyTabs = document.querySelectorAll('.history-tab');
  const historyPanels = document.querySelectorAll('.history-panel');

  historyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      historyTabs.forEach(t => t.classList.remove('active'));
      historyPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panelId = tab.dataset.tab;
      document.querySelector(`.history-panel[data-panel="${panelId}"]`)?.classList.add('active');
    });
  });

  // Activate first tab by default
  historyTabs[0]?.click();
}

/****************************
 * MAIN INITIALIZATION
 ****************************/
document.addEventListener('DOMContentLoaded', function () {
  initLoader();
  initThemeToggle();
  initMobileMenu();
  initScrollToTop();
  initNavigation();
  initWeather();
  initEarthquakeMap();
  initPredictionModals();
  initUserReports();
  initHistoryCharts();
});