document.addEventListener('DOMContentLoaded', function () {
  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light-theme');
      const isLight = document.documentElement.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    }
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (!targetId) return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      targetElement.scrollIntoView({
        behavior: 'smooth'
      });

      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      this.classList.add('active');
    });
  });

  // Initialize Mapbox for Earthquakes
  if (document.getElementById('quakeMap') && typeof mapboxgl !== 'undefined') {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xmbXZ1dW5wMDV0aDNvcGJmZ2VqNG5xYSJ9.1234567890';
    const map = new mapboxgl.Map({
      container: 'quakeMap',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [0, 20],
      zoom: 1.5
    });

    // Add earthquake markers
    function addEarthquakeMarkers(earthquakes) {
      earthquakes.forEach(quake => {
        const el = document.createElement('div');
        el.className = 'quake-marker';
        el.style.width = `${Math.min(quake.magnitude * 5, 30)}px`;
        el.style.height = `${Math.min(quake.magnitude * 5, 30)}px`;

        new mapboxgl.Marker(el)
          .setLngLat([quake.longitude, quake.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <h3>Magnitude ${quake.magnitude}</h3>
            <p>${quake.location}</p>
            <p>Depth: ${quake.depth} km</p>
            <p>${new Date(quake.time).toLocaleString()}</p>
          `))
          .addTo(map);
      });
    }

    // Simulated earthquake data
    function updateEarthquakeData() {
      const earthquakes = [
        { magnitude: 5.2, location: 'Indonesia', depth: 35, time: Date.now() - 3600000, latitude: -2.5, longitude: 118.0 },
        { magnitude: 4.7, location: 'Japan', depth: 50, time: Date.now() - 7200000, latitude: 36.2, longitude: 138.3 },
        { magnitude: 3.8, location: 'California', depth: 12, time: Date.now() - 10800000, latitude: 36.5, longitude: -121.0 },
        { magnitude: 6.1, location: 'Chile', depth: 60, time: Date.now() - 14400000, latitude: -35.0, longitude: -72.0 }
      ];

      // Clear existing markers
      document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());
      
      // Add new markers
      addEarthquakeMarkers(earthquakes);

      // Update earthquake list
      const quakeList = document.getElementById('quakeList');
      if (quakeList) {
        quakeList.innerHTML = '';
        earthquakes.forEach(quake => {
          const quakeItem = document.createElement('div');
          quakeItem.className = 'quake-item';
          quakeItem.innerHTML = `
            <span class="magnitude">${quake.magnitude}</span>
            <div class="quake-details">
              <span>${quake.location}</span>
              <span>${quake.depth}km depth • ${formatTimeAgo(quake.time)}</span>
            </div>
          `;
          quakeList.appendChild(quakeItem);
        });
      }
    }

    // Initial update
    updateEarthquakeData();
    
    // Set up refresh button
    const refreshQuakes = document.getElementById('refreshQuakes');
    if (refreshQuakes) {
      refreshQuakes.addEventListener('click', updateEarthquakeData);
    }
  }

  // Initialize All Charts
  function initCharts() {
    // Check if Chart is available
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded');
      return;
    }

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
          plugins: {
            legend: {
              position: 'top',
            }
          },
          scales: {
            y: {
              beginAtZero: false
            }
          }
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
          plugins: {
            legend: {
              position: 'top',
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
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
          plugins: {
            legend: {
              position: 'top',
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  // Tab functionality for history section
  const historyTabs = document.querySelectorAll('.history-tab');
  const historyPanels = document.querySelectorAll('.history-panel');

  if (historyTabs.length && historyPanels.length) {
    historyTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        historyTabs.forEach(t => t.classList.remove('active'));
        historyPanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const panelId = tab.dataset.tab;
        const targetPanel = document.querySelector(`.history-panel[data-panel="${panelId}"]`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });

    // Activate first tab by default
    if (historyTabs[0]) {
      historyTabs[0].click();
    }
  }

  // Helper function to format time ago
  function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  // Initialize everything
  initCharts();
});