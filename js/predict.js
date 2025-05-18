document.addEventListener('DOMContentLoaded', function () {
  // Modal elements
  const weatherModal = document.getElementById('weatherPredictionModal');
  const quakeModal = document.getElementById('quakePredictionModal');
  const weatherTriggerBtn = document.getElementById('weatherTriggerBtn');
  const quakeTriggerBtn = document.getElementById('quakeTriggerBtn');
  const closeModalBtns = document.querySelectorAll('.close-modal');

  // Form elements
  const weatherForm = document.getElementById('weatherPredictionForm');
  const quakeForm = document.getElementById('quakePredictionForm');

  // Result elements
  const weatherResult = document.getElementById('weatherPredictionResult');
  const quakeResult = document.getElementById('quakePredictionResult');

  // Open modals
  if (weatherTriggerBtn) {
    weatherTriggerBtn.addEventListener('click', () => {
      weatherModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  if (quakeTriggerBtn) {
    quakeTriggerBtn.addEventListener('click', () => {
      quakeModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

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

  // Weather prediction form
  if (weatherForm) {
    weatherForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const location = document.getElementById('weatherLocation').value;
      const date = document.getElementById('weatherDate').value;

      if (!location || !date) {
        alert('Please fill in all fields');
        return;
      }

      simulateWeatherPrediction(location, date);
      weatherModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  // Earthquake prediction form
  if (quakeForm) {
    quakeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const lat = parseFloat(document.getElementById('quakeLatitude').value);
      const lng = parseFloat(document.getElementById('quakeLongitude').value);
      const radius = parseInt(document.getElementById('quakeRadius').value);
      const timeframe = document.getElementById('quakeTimeframe').value;

      if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
        alert('Please enter valid numbers for coordinates and radius');
        return;
      }

      simulateQuakePrediction(lat, lng, radius, timeframe);
      quakeModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  // Simulate weather prediction
  function simulateWeatherPrediction(location, date) {
    if (!weatherResult) return;

    weatherResult.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Analyzing weather patterns...</p>';
    weatherResult.classList.remove('active');

    setTimeout(() => {
      const conditions = ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy'];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const temp = Math.floor(Math.random() * 30) + 10;
      const humidity = Math.floor(Math.random() * 60) + 30;
      const wind = Math.floor(Math.random() * 30) + 5;

      weatherResult.classList.add('active');
      weatherResult.innerHTML = `
        <h4>${location} - ${new Date(date).toLocaleDateString()}</h4>
        <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0;">
          <i class="fas ${getWeatherIcon(condition)}" style="font-size: 2rem; color: ${getWeatherColor(condition)};"></i>
          <span style="font-size: 1.5rem; font-weight: 700;">${temp}°C</span>
          <span style="font-size: 1rem; color: var(--text-secondary);">${condition.toUpperCase()}</span>
        </div>
        <div class="prediction-details">
          <p><span>Confidence:</span> <span>${Math.floor(Math.random() * 30) + 70}%</span></p>
          <p><span>Humidity:</span> <span>${humidity}%</span></p>
          <p><span>Wind Speed:</span> <span>${wind} km/h</span></p>
          <p><span>Precipitation:</span> <span>${Math.floor(Math.random() * 100)}%</span></p>
        </div>
      `;
    }, 2000);
  }

  // Simulate earthquake prediction
  function simulateQuakePrediction(lat, lng, radius, timeframe) {
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
        <p>Within ${radius}km of (${lat.toFixed(4)}, ${lng.toFixed(4)})</p>
        <p>Next ${timeframe} days</p>

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

  // Helper functions
  function getWeatherIcon(condition) {
    const icons = {
      sunny: 'sun',
      cloudy: 'cloud',
      rainy: 'cloud-rain',
      stormy: 'bolt',
      snowy: 'snowflake'
    };
    return icons[condition] || 'question';
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
    if (risk < 30) return 'var(--success)';
    if (risk < 70) return 'var(--warning)';
    return 'var(--danger)';
  }
});