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

  // Scroll-based Active Navigation
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop - sectionHeight * 0.25) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinksAll.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // Smooth Scrolling with active class update
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

      // Update active class after scroll completes
      setTimeout(() => {
        updateActiveNav();
      }, 1000);
    });
  });

  // Initialize scroll-based navigation
  updateActiveNav();
  window.addEventListener('scroll', function() {
    let ticking = false;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Earthquake data functionality without map
  function updateEarthquakeData() {
    const earthquakes = [
      { magnitude: 5.2, location: 'Indonesia', depth: 35, time: Date.now() - 3600000 },
      { magnitude: 4.7, location: 'Japan', depth: 50, time: Date.now() - 7200000 },
      { magnitude: 3.8, location: 'California', depth: 12, time: Date.now() - 10800000 },
      { magnitude: 6.1, location: 'Chile', depth: 60, time: Date.now() - 14400000 }
    ];

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

  // Set up refresh button
  const refreshQuakes = document.getElementById('refreshQuakes');
  if (refreshQuakes) {
    refreshQuakes.addEventListener('click', updateEarthquakeData);
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
  updateEarthquakeData();
});

// bottom to top button
const cyberBtn = document.getElementById('cyberScrollBtn');
  
  // Show button when scrolling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      cyberBtn.classList.add('visible');
    } else {
      cyberBtn.classList.remove('visible');
    }
  });
  
  // Cyberpunk teleport effect on click
  cyberBtn.addEventListener('click', () => {
    cyberBtn.style.transform = 'scale(1.2)';
    cyberBtn.style.boxShadow = '0 0 40px rgba(100, 180, 255, 0.9)';
    
    setTimeout(() => {
      cyberBtn.style.transform = 'scale(1)';
      cyberBtn.style.boxShadow = '0 0 25px rgba(100, 180, 255, 0.7)';
    }, 500);
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });