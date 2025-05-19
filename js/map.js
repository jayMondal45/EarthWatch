// Initialize map immediately
var map = L.map('quakeMap').setView([20, 0], 2);
let earthquakeLayer = null;

// Add OpenStreetMap tiles immediately
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to format time as "X minutes/hours ago"
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

// Function to get color based on magnitude
function getColor(magnitude) {
    return magnitude > 5 ? '#f94144' :
        magnitude > 3 ? '#f8961e' :
            '#4cc9f0';
}

// Function to update time ago display for all quakes
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

// Function to load earthquake data
function loadEarthquakeData() {
    const startTime = performance.now();

    // Show loading indicators
    document.getElementById('mapLoading').style.display = 'flex';
    document.getElementById('listLoading').style.display = 'flex';

    // Remove existing earthquake layer if it exists
    if (earthquakeLayer) {
        map.removeLayer(earthquakeLayer);
    }

    // Use a more lightweight endpoint for initial load
    const useLightEndpoint = !earthquakeLayer; // Use light endpoint only on first load
    const endpoint = useLightEndpoint
        ? 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_hour.geojson'
        : 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';

    // Load earthquake data from USGS
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            // Process features and sort by time (newest first)
            const features = data.features.sort((a, b) => b.properties.time - a.properties.time);

            // First render - show the list immediately
            renderQuakeList(features);

            // Then render the map markers
            renderMapMarkers(features);

            // Hide loading indicators
            document.getElementById('mapLoading').style.display = 'none';
            document.getElementById('listLoading').style.display = 'none';

            console.log(`Data loaded in ${(performance.now() - startTime).toFixed(0)}ms`);

            // If we used the light endpoint, now load the full dataset
            if (useLightEndpoint) {
                setTimeout(loadEarthquakeData, 1000); // Load full data after 1 second
            }
        })
        .catch(error => {
            console.error('Error fetching earthquake data:', error);
            document.getElementById('mapLoading').style.display = 'none';
            document.getElementById('listLoading').style.display = 'none';
            alert('Earthquake data could not be loaded.');
        });
}

// Function to render the quake list
function renderQuakeList(features) {
    const quakeList = document.getElementById('quakeList');
    quakeList.innerHTML = ''; // Clear existing content

    // Add items to quake list
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

    // Update the "last updated" time
    updateTimeDisplays();
}

// Function to render map markers
function renderMapMarkers(features) {
    // Add markers to map
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
                `<strong>${feature.properties.place}</strong><br>` +
                `Magnitude: ${feature.properties.mag}<br>` +
                `Depth: ${feature.geometry.coordinates[2]} km<br>` +
                `Time: ${new Date(feature.properties.time).toLocaleString()}<br>` +
                `<em>${timeAgo(feature.properties.time)}</em>`
            );
        }
    }).addTo(map);
}

// Load data initially
loadEarthquakeData();

// Refresh button functionality
document.getElementById('refreshQuakes').addEventListener('click', function () {
    // Show loading indicators immediately on refresh
    document.getElementById('mapLoading').style.display = 'flex';
    document.getElementById('listLoading').style.display = 'flex';
    loadEarthquakeData();
});

// Update time displays every minute
setInterval(updateTimeDisplays, 60000);

// Auto-refresh data every 5 minutes
setInterval(loadEarthquakeData, 300000);