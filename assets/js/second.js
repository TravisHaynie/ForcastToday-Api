// event listener to allow content to load from the DOM faster
document.addEventListener('DOMContentLoaded', () => {
    // variables
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-button');
    const apiKey = '29944ab421f5c313160a51cb372a5bfe';
    // Api call for the citys
    function getCoordinates(city) {
        const geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        return fetch(geocodingUrl)
            .then(response => response.json())
            .then(data => data.coord);
    }
    // Api calls for specific cooridiants of the citys to allow for more detailed information
    function getWeatherData(latitude, longitude, city) {
        const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
        // storing and displaying information on the page
        return fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('weatherData', JSON.stringify(data));
                return data;
            });
    }
    // function to clear excisting content on the page and call other function
    function displayWeatherData(data, city) {
        const weatherData = document.getElementById('weatherData');
        const cityInputs = document.getElementById('city-inputs');
        weatherData.innerHTML = ''; // Clear existing content

        displayCurrentWeather(data.list[0], city, weatherData);
        display5DayForecast(data, city, cityInputs);
    }
    // function to create the main card for current weather
    function displayCurrentWeather(currentWeather, city, container) {
        const titleCard = document.createElement('div');
        titleCard.classList.add('card1');
        titleCard.innerHTML = `
            <h3>Current Weather Forecast For ${city}</h3>
            <p>Temperature: ${currentWeather.main.temp} F</p>
            <p>Humidity: ${currentWeather.main.humidity}%</p>
            <p>Wind: ${currentWeather.wind.speed} MPH</p>
        `;

        container.appendChild(titleCard);
    }
    // for loop to display card data on the page for 5 day forcast
    function display5DayForecast(forecastData, city, container) {
        container.innerHTML = ''; // Clear existing content

        for (let i = 0; i < 5; i++) {
            const forecast = forecastData.list[i * 8]; // Getting data at 24-hour intervals
            const date = forecast.dt_txt;
            const temperature = forecast.main.temp;
            const humidity = forecast.main.humidity;
            const wind = forecast.wind.speed;

            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h3>${date}</h3>
                <p>${city}</p>
                <p>Temperature: ${temperature} F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind: ${wind} MPH</p>
            `;
            container.appendChild(card);
        }
    }
    // event listener on button element
    searchBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const city = cityInput.value;
        getCoordinates(city)
            .then(({ lat, lon }) => {
                getWeatherData(lat, lon, city)
                    .then((weatherData) => {
                        displayWeatherData(weatherData, city);
                    });
            });
    });
});