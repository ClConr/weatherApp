import './style.css'

document.querySelector('button').addEventListener('click', getWeather);
document.getElementById('clear').addEventListener('click', clearDisplay);
const forecastDiv = document.getElementById('forecast');
const tempDiv = document.getElementById('temp-div');
const weatherDiv = document.getElementById('weather');
const weatherIcon = document.getElementById('icon');

export function getWeather() {
  const apiKey = '5b09592ff185ae2c9f875f9435567ac3';

  // get location from input
  const input = document.getElementById('search').value;
  const [city, state] = input.split(',').map(part => part.trim()); // part.trim removes any whitespace

  if (!city) {
    alert('City does not exist. Please try again.');
    return;
  }
  if (!state){
    alert('State does not exist. Please try again.');
    return;
  }


  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},us&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${state},us&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error fetching data. Please try again.');
    });

  fetch(forecastUrl)
    .then(response => response.json())
    .then(hourlyData => {
      displayForecast(hourlyData.list);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error fetching forecast data. Please try again.');
    });

}

function displayWeather(data) {

  // clear previous content
  weatherDiv.innerHTML = '';
  forecastDiv.innerHTML = '';
  tempDiv.innerHTML = '';

  if (data.cod === '404') {
    weatherDiv.innerHTML = '<p>${data.message}</p>';
  } else {

    const cityName = data.name;
    const temp = Math.round((data.main.temp * 1.8) + 32); // API gives temp in celcius
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconURl = `http://openweathermap.org/img/wn/${icon}@4x.png`;

    const tempHTML = `<p>${temp}°F</p>`;

    const weatherHTML = `<p>${cityName}</p> 
      <p>${description}</p>`;
    tempDiv.innerHTML = tempHTML;
    weatherDiv.innerHTML = weatherHTML;
    weatherIcon.src = iconURl;
    weatherIcon.alt = description;

    showImage();
  }
}

function displayForecast(hourlyData) {
  
  const forecast = hourlyData.slice(0, 40); // get forecast for the next 5 days 

  forecast.forEach(item => {
    const dateTime = new Date(item.dt * 1000); // API gives time in seconds
    const hour = dateTime.getHours();
    const temperature = Math.round((item.main.temp * 1.8) + 32); // convert to fahrenheit (API gives temp in celsius);
    const icon = item.weather[0].icon;
    const iconURl = `http://openweathermap.org/img/wn/${icon}.png`;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = days[dateTime.getDay()];

    const hourlyData = `
      <div class="hourlyItem">
        <span>${dayOfWeek}</span>
        <span>${hour}:00</span>
        <img src="${iconURl}" alt="${item.weather[0].description}">
        <span>${temperature}°F</span>
      </div>`;
    forecastDiv.innerHTML += hourlyData;
  });
}

function showImage() {
  weatherIcon.style.display = 'block';
}

function clearDisplay() {
  weatherDiv.innerHTML = '';
  forecastDiv.innerHTML = '';
  tempDiv.innerHTML = '';
  weatherIcon.style.display = 'none';
  document.getElementById('search').value = '';
}