document.getElementById('checkWeatherBtn').addEventListener('click', () => {
    getWeather();
});

function getWeather() {
    // Use the provided API link
    const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=52.1324&longitude=-106.6689&hourly=temperature_2m';

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
    // Get the current hour's temperature
    const currentHour = new Date().getHours();
    const temp = data.hourly.temperature_2m[currentHour];

    let activitySuggestion = '';
    let attireSuggestion = '';

    // Activity suggestions based on temperature
    if (temp < 0) {
        activitySuggestion = 'It\'s freezing outside! Good day for indoor activities like reading a book or watching a movie.';
        attireSuggestion = 'Wear heavy winter clothing, including a coat, gloves, and a hat.';
    } else if (temp >= 0 && temp < 10) {
        activitySuggestion = 'A bit chilly. Maybe visit a museum or enjoy a warm drink at a café.';
        attireSuggestion = 'Wear a warm jacket and consider layers.';
    } else if (temp >= 10 && temp < 20) {
        activitySuggestion = 'Perfect weather for a walk in the park or light outdoor activities.';
        attireSuggestion = 'A light jacket or sweater should be sufficient.';
    } else if (temp >= 20 && temp < 30) {
        activitySuggestion = 'Great weather for outdoor sports, picnics, or a bike ride.';
        attireSuggestion = 'Wear comfortable, light clothing.';
    } else if (temp >= 30) {
        activitySuggestion = 'It\'s quite hot! Consider swimming or staying cool indoors.';
        attireSuggestion = 'Wear shorts, a t-shirt, and stay hydrated.';
    }

    // Display the recommendations
    document.getElementById('recommendation').innerHTML = `
        <p><strong>Current Temperature:</strong> ${temp}°C</p>
        <p><strong>Activity Suggestion:</strong> ${activitySuggestion}</p>
        <p><strong>Attire Suggestion:</strong> ${attireSuggestion}</p>
    `;
}
