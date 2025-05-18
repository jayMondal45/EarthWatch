document.addEventListener('DOMContentLoaded', function () {
    // IMPORTANT: In production, don't expose your API key like this
    // Use a backend service to protect your key
    const apiKey = 'df37d34202d661594bfda73ab57cae7d';

    // Weather icon mapping
    const iconMap = {
        '01d': 'fa-sun',           // clear sky (day)
        '01n': 'fa-moon',          // clear sky (night)
        '02d': 'fa-cloud-sun',     // few clouds (day)
        '02n': 'fa-cloud-moon',    // few clouds (night)
        '03d': 'fa-cloud',         // scattered clouds
        '03n': 'fa-cloud',
        '04d': 'fa-clouds',        // broken clouds
        '04n': 'fa-clouds',
        '09d': 'fa-cloud-rain',   // shower rain
        '09n': 'fa-cloud-rain',
        '10d': 'fa-cloud-sun-rain', // rain (day)
        '10n': 'fa-cloud-moon-rain', // rain (night)
        '11d': 'fa-bolt',          // thunderstorm
        '11n': 'fa-bolt',
        '13d': 'fa-snowflake',     // snow
        '13n': 'fa-snowflake',
        '50d': 'fa-smog',          // mist
        '50n': 'fa-smog'
    };

    // Get weather data
    function fetchWeather(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Weather data not available');
                return response.json();
            })
            .then(data => {
                updateWeatherUI(data);
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('curtLoct').textContent = "Service unavailable";
                document.getElementById('weatherDesc').textContent = "Try again later";
            });
    }

    // Update UI with weather data
    function updateWeatherUI(data) {
        const weatherIcon = document.getElementById('weatherIcon');
        const weatherId = data.weather[0].icon;

        // Set dynamic icon
        if (iconMap[weatherId]) {
            weatherIcon.className = `fas ${iconMap[weatherId]}`;
        } else {
            weatherIcon.className = 'fas fa-question';
        }

        // Update weather info
        document.getElementById('curtLoct').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('weatherDesc').textContent = data.weather[0].description;
        document.getElementById('curtTemp').textContent = Math.round(data.main.temp);
        document.getElementById('curtfeels').textContent = Math.round(data.main.feels_like);
    }

    // Get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude);
            },
            error => {
                console.warn('Location access denied, using default location');
                // Default to New Delhi if location access is denied
                fetchWeather(28.6139, 77.2090); // New Delhi coordinates
            }
        );
    } else {
        console.error("Geolocation not supported");
        // Default to New Delhi if location access is denied
        fetchWeather(28.6139, 77.2090); // New Delhi coordinates
    }
});