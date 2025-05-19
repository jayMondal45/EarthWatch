// Animate progress text with color intensity matching percentage
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

  // Second phase - slow progress to 100%
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

  // Update progress bar color and text
  function updateProgressBar(currentProgress) {
    const roundedProgress = Math.round(currentProgress);
    progressText.textContent = roundedProgress + '%';

    // Change color intensity based on progress (0% = dim, 100% = full brightness)
    const intensity = roundedProgress / 100;
    progressBar.style.opacity = intensity; // Fade in effect
    progressBar.style.backgroundColor = `rgba(0, 200, 255, ${intensity})`; // Example: blue with dynamic opacity
  }

  function completeLoading() {
    document.querySelector('.status-value.syncing').textContent = 'ONLINE';
    document.querySelector('.status-value.syncing').className = 'status-value online';
    document.querySelector('.status-value.encrypting').textContent = 'SECURE';

    // Wait a moment to show 100% then hide loader
    setTimeout(() => {
      hideLoader();
    }, 800);
  }
}

// Random seismic events
function triggerSeismicEvent() {
  const seismicWaves = document.querySelector('.seismic-waves');
  const newWave = document.createElement('div');
  newWave.className = 'seismic-wave';
  seismicWaves.appendChild(newWave);

  setTimeout(() => {
    newWave.remove();
  }, 2000);
}

function hideLoader() {
  const loader = document.querySelector('.earthwatch-loader');
  loader.style.opacity = '0';
  setTimeout(() => {
    loader.style.display = 'none';
  }, 500);
}

// Initialize loader
document.addEventListener('DOMContentLoaded', () => {
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
});

// Fallback to hide loader if something goes wrong
setTimeout(() => {
  const loader = document.querySelector('.earthwatch-loader');
  if (loader && loader.style.display !== 'none') {
    hideLoader();
  }
}, 8000);