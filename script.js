document.getElementById('checkWeatherBtn').addEventListener('click', () => {
    // Check if geolocation is available
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeather(latitude, longitude);
        }, error => {
            alert('Unable to retrieve your location.');
            console.error(error);
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

function getWeather(lat, lon) {
    // Build the Open-Meteo API URL
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            generateRecommendations(data);
        })
        .catch(error => {
            alert('Error fetching weather data.');
            console.error(error);
        });
}

function generateRecommendations(data) {
    // Extract current weather data
    const currentWeather = data.current_weather;
    const temp = currentWeather.temperature;
    const weatherCode = currentWeather.weathercode;

    let weatherCondition = '';
    let activitySuggestion = '';
    let attireSuggestion = '';

    // Map weather codes to conditions
    switch (weatherCode) {
        case 0:
            weatherCondition = 'Clear sky';
            break;
        case 1:
        case 2:
        case 3:
            weatherCondition = 'Mainly clear, partly cloudy, overcast';
            break;
        case 45:
        case 48:
            weatherCondition = 'Fog and depositing rime fog';
            break;
        case 51:
        case 53:
        case 55:
            weatherCondition = 'Drizzle';
            break;
        case 56:
        case 57:
            weatherCondition = 'Freezing drizzle';
            break;
        case 61:
        case 63:
        case 65:
            weatherCondition = 'Rain';
            break;
        case 66:
        case 67:
            weatherCondition = 'Freezing rain';
            break;
        case 71:
        case 73:
        case 75:
            weatherCondition = 'Snow fall';
            break;
        case 77:
            weatherCondition = 'Snow grains';
            break;
        case 80:
        case 81:
        case 82:
            weatherCondition = 'Rain showers';
            break;
        case 85:
        case 86:
            weatherCondition = 'Snow showers';
            break;
        case 95:
            weatherCondition = 'Thunderstorm';
            break;
        case 96:
        case 99:
            weatherCondition = 'Thunderstorm with hail';
            break;
        default:
            weatherCondition = 'Unknown';
    }

    // Activity suggestions based on weather condition
    if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) {
        activitySuggestion = 'It\'s rainy! A great time for indoor activities like visiting a museum or watching a movie.';
        attireSuggestion = 'Don\'t forget your umbrella and wear waterproof shoes.';
    } else if (weatherCode === 0) {
        activitySuggestion = 'Clear skies! Perfect for outdoor activities like hiking or picnicking.';
        attireSuggestion = 'Wear sunglasses and light clothing.';
    } else if ([1, 2, 3].includes(weatherCode)) {
        activitySuggestion = 'It\'s cloudy. How about visiting a café or going for a leisurely walk?';
        attireSuggestion = 'A light jacket might be necessary.';
    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
        activitySuggestion = 'Snow is falling! Ideal for skiing or building a snowman.';
        attireSuggestion = 'Bundle up with warm clothing, gloves, and a hat.';
    } else if ([95, 96, 99].includes(weatherCode)) {
        activitySuggestion = 'Thunderstorms expected. Best to stay indoors and stay safe.';
        attireSuggestion = 'Wear comfortable indoor clothes.';
    } else {
        activitySuggestion = 'The weather is moderate. You can choose any activity you enjoy!';
        attireSuggestion = 'Dress comfortably.';
    }

    // Additional suggestions based on temperature
    if (temp < 0) {
        attireSuggestion += ' It\'s freezing outside; wear thermal layers.';
    } else if (temp >= 0 && temp < 10) {
        attireSuggestion +=
