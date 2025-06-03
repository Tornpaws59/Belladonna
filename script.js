document.getElementById('checkWeatherBtn').addEventListener('click', () => {
    getWeather();
});

function getWeather() {
    const baseUrl = 'https://api.open-meteo.com/v1/forecast';
    const latitude = '52.1324';
    const longitude = '-106.6689';
    // Variables for the 'hourly' parameter, which will be used by 'current_weather'
    const hourlyParams = 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,cloudcover,windspeed_10m,is_day';
    const weatherUrl = `${baseUrl}?latitude=${latitude}&longitude=${longitude}&hourly=${hourlyParams}&current_weather=true&timezone=auto`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.current_weather) {
                generateRecommendations(data.current_weather, data.hourly, data.hourly_units); // Pass current_weather, full hourly data, and units
            } else {
                alert('Error: Current weather data not found in API response.');
                console.error('Unexpected data structure:', data);
            }
        })
        .catch(error => {
            alert('Error fetching weather data.');
            console.error(error);
        });
}

function generateRecommendations(current_weather, hourly, hourly_units) {
    // Extract data from current_weather object
    const temp = current_weather.temperature_2m;
    const apparentTemp = current_weather.apparent_temperature;
    const humidity = current_weather.relative_humidity_2m;
    const precipitationProbability = current_weather.precipitation_probability !== undefined ? current_weather.precipitation_probability : (hourly && hourly.precipitation_probability ? hourly.precipitation_probability[0] : 0);
    const precipitation = current_weather.precipitation; // This is current precipitation amount
    const weatherCode = current_weather.weathercode;
    const cloudCover = current_weather.cloudcover; // Percentage
    const windSpeed = current_weather.windspeed_10m;
    const isDay = current_weather.is_day; // 1 for day, 0 for night

    // Extract units for display
    const tempUnit = (hourly_units && hourly_units.temperature_2m) || '°C';
    const windSpeedUnit = (hourly_units && hourly_units.windspeed_10m) || 'km/h';
    const precipitationUnit = (hourly_units && hourly_units.precipitation) || 'mm';
    const humidityUnit = (hourly_units && hourly_units.relative_humidity_2m) || '%';
    const cloudCoverUnit = (hourly_units && hourly_units.cloudcover) || '%';

    let activitySuggestion = '';
    let attireSuggestion = '';
    let weatherDescription = getWeatherDescription(weatherCode);
    const iconName = getWeatherIconName(weatherCode, isDay);

    if (precipitation > 0 || precipitationProbability > 50) {
        activitySuggestion = 'Looks wet! Good time for indoor activities. ';
        if (weatherCode >= 70 && weatherCode <= 77) { // Snow fall
             activitySuggestion += 'Maybe build a snowman if there\'s enough snow, or enjoy a warm drink inside.';
             attireSuggestion = 'Wear warm, waterproof winter clothing, including boots, gloves, and a hat.';
        } else { // Rain
             activitySuggestion += 'How about a museum, a movie, or a cozy cafe?';
             attireSuggestion = 'Don\'t forget your umbrella and a waterproof jacket!';
        }
    } else if (temp < 0 && apparentTemp < 0) {
        activitySuggestion = 'Brrr! It\'s freezing. Best to stay warm indoors. Read a book, watch a movie, or do some indoor exercise.';
        attireSuggestion = 'Heavy winter gear is a must: thermal layers, insulated coat, hat, gloves, and scarf.';
    } else if (temp < 10 || apparentTemp < 10) {
        activitySuggestion = 'Quite chilly! ';
        if (windSpeed > 20) {
            activitySuggestion += 'The wind makes it feel colder. ';
            attireSuggestion = 'Wear a warm, windproof jacket, layers, a hat, and gloves. ';
        } else {
            attireSuggestion = 'A warm jacket and layers should keep you comfortable. ';
        }
        if (isDay) {
            activitySuggestion += 'A brisk walk if you\'re bundled up, or visit an indoor attraction like a gallery or museum.';
        } else {
            activitySuggestion += 'A cozy evening in, or a visit to a warm restaurant or pub.';
        }
    } else if (temp >= 10 && temp < 20) {
        activitySuggestion = 'Pleasant weather! ';
        attireSuggestion = 'A light jacket or sweater would be good. ';
        if (windSpeed > 25) {
             activitySuggestion += 'It might be a bit breezy for some activities. ';
             attireSuggestion += 'Consider a windbreaker. ';
        }
        if (isDay) {
            activitySuggestion += 'Great for a walk, cycling, or a picnic if it\'s not too windy.';
        } else {
            activitySuggestion += 'Enjoy an evening stroll or dine outdoors (if warm enough).';
        }
    } else if (temp >= 20 && temp < 30) {
        activitySuggestion = 'Lovely and warm! ';
        attireSuggestion = 'Light and comfortable clothing. ';
        if (cloudCover < 30 && isDay) { // Sunny
            activitySuggestion += 'Perfect for outdoor sports, a trip to the park, or gardening. ';
            attireSuggestion += 'Don\'t forget sunscreen!';
        } else if (isDay) {
            activitySuggestion += 'Enjoy any outdoor activity, like hiking or visiting a local market.';
        } else {
            activitySuggestion += 'A great evening for outdoor dining or a walk.';
        }
    } else if (temp >= 30) {
        activitySuggestion = 'It\'s hot out there! ';
        attireSuggestion = 'Wear very light, breathable clothing (shorts, t-shirt). Stay hydrated and use sunscreen. ';
        if (isDay) {
            activitySuggestion += 'Ideal for swimming or staying in cool, air-conditioned places. Avoid strenuous activity during peak heat.';
        } else {
            activitySuggestion += 'Try to stay cool. A late evening swim or relaxing in a shaded spot could be nice.';
        }
    } else {
        activitySuggestion = 'Enjoy the day! Check the specific conditions to choose your activity.';
        attireSuggestion = 'Dress according to the temperature and conditions.';
    }

    if (windSpeed > 30 && !(precipitation > 0 || precipitationProbability > 50)) {
        attireSuggestion += ' It\'s quite windy, so a windbreaker might be useful.';
    }

    document.getElementById('recommendation').innerHTML = `
        <p><strong>Current Temperature:</strong> ${temp}${tempUnit} (Feels like: ${apparentTemp}${tempUnit})</p>
        <p><strong>Weather:</strong> <img class="weather-icon" src="icons/${iconName}" alt="${weatherDescription}"> ${weatherDescription}</p>
        <p><strong>Humidity:</strong> ${humidity}${humidityUnit}</p>
        <p><strong>Wind:</strong> ${windSpeed} ${windSpeedUnit}</p>
        <p><strong>Precipitation Amount:</strong> ${precipitation} ${precipitationUnit}</p>
        <p><strong>Chance of Precipitation:</strong> ${precipitationProbability}%</p>
        <p><strong>Cloud Cover:</strong> ${cloudCover}${cloudCoverUnit}</p>
        <p><strong>Daytime:</strong> ${isDay ? 'Yes' : 'No'}</p>
        <hr>
        <p><strong>Activity Suggestion:</strong> ${activitySuggestion}</p>
        <p><strong>Attire Suggestion:</strong> ${attireSuggestion}</p>
    `;
}

function getWeatherDescription(code) {
    const wmoCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Drizzle: Light intensity',
        53: 'Drizzle: Moderate intensity',
        55: 'Drizzle: Dense intensity',
        56: 'Freezing Drizzle: Light intensity',
        57: 'Freezing Drizzle: Dense intensity',
        61: 'Rain: Slight intensity',
        63: 'Rain: Moderate intensity',
        65: 'Rain: Heavy intensity',
        66: 'Freezing Rain: Light intensity',
        67: 'Freezing Rain: Heavy intensity',
        71: 'Snow fall: Slight intensity',
        73: 'Snow fall: Moderate intensity',
        75: 'Snow fall: Heavy intensity',
        77: 'Snow grains',
        80: 'Rain showers: Slight',
        81: 'Rain showers: Moderate',
        82: 'Rain showers: Violent',
        85: 'Snow showers: Slight',
        86: 'Snow showers: Heavy',
        95: 'Thunderstorm: Slight or moderate',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return wmoCodes[code] || `Unknown weather code (${code})`;
}

function getWeatherIconName(weatherCode, isDayParam) {
    const isDayTime = isDayParam === 1 || isDayParam === true; // Normalize isDay

    switch (weatherCode) {
        case 0: return isDayTime ? 'clear-day.svg' : 'clear-night.svg';
        case 1: return isDayTime ? 'mainly-clear-day.svg' : 'mainly-clear-night.svg';
        case 2: return isDayTime ? 'partly-cloudy-day.svg' : 'partly-cloudy-night.svg';
        case 3: return 'overcast.svg';
        case 45:
        case 48:
            return 'fog.svg';
        case 51:
        case 53:
        case 55:
            return 'drizzle.svg';
        case 56:
        case 57:
            return 'freezing-rain.svg'; // Or a specific freezing drizzle icon if available
        case 61: // Rain: Slight intensity
        case 63: // Rain: Moderate intensity
        case 65: // Rain: Heavy intensity
            return 'rain.svg';
        case 66:
        case 67:
            return 'freezing-rain.svg';
        case 71: // Snow fall: Slight intensity
        case 73: // Snow fall: Moderate intensity
        case 75: // Snow fall: Heavy intensity
        case 77: // Snow grains
            return 'snow.svg';
        case 80:
        case 81:
        case 82:
            return 'showers-rain.svg';
        case 85:
        case 86:
            return 'showers-snow.svg';
        case 95:
        case 96:
        case 99:
            return 'thunderstorm.svg';
        default:
            return 'default-weather.svg'; // A generic icon for unknown codes
    }
}
