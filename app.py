from flask import Flask, render_template, jsonify, request
import requests
from datetime import datetime, timedelta
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# Configuration
class Config:
    OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY', 'df37d34202d661594bfda73ab57cae7d')
    SECRET_KEY = os.environ.get('SECRET_KEY', 'cc81a37a7227dc25af1c5c586c3d82b8a93e949c26c3d61a')

app.config.from_object(Config)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/weather')
def get_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    city = request.args.get('city')

    if city:
        geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={app.config['OPENWEATHER_API_KEY']}"
        try:
            geo_response = requests.get(geo_url).json()
            if not geo_response:
                return jsonify({'error': 'City not found'}), 404
            lat, lon = geo_response[0]['lat'], geo_response[0]['lon']
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    try:
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={app.config['OPENWEATHER_API_KEY']}"
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={app.config['OPENWEATHER_API_KEY']}"

        current_data = requests.get(weather_url).json()
        forecast_data = requests.get(forecast_url).json()

        return jsonify({
            'current': current_data,
            'forecast': forecast_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/earthquakes')
def get_earthquakes():
    days = int(request.args.get('days', '1'))
    min_magnitude = request.args.get('min_magnitude', '2.5')

    start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
    url = f"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime={start_date}&minmagnitude={min_magnitude}"

    try:
        response = requests.get(url).json()
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)