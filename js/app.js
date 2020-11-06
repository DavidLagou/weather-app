// Creating a App object that will be used in the feetch call.
const api = {
    key: "8784ca70300e96b0e481f399516d8c76",
    base: "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.search-box');

// Main weather information
let userinput = searchbox.value;
let errorMsg = document.querySelector("#homeScreen .errorTxt");
let city = document.querySelector('.location .city');
let currTemp = document.querySelector('.current .temp');
let date = document.querySelector('.location .date');
let weatherDescription = document.querySelector('.current .weather');
let weatherImg = document.getElementById("weatherImg");
let todayDate = new Date();
var posLat;
var posLong;
searchbox.addEventListener("keypress", setQuery);
var loadContainer = document.getElementById('loadContainer');

function setQuery(e) {
    // Checking to see if the user has pressed enter on the search box 
    if (e.keyCode == 13) {
        // Storing the value, in this case the city name inside of function getSearchResults
        getSearchResults(searchbox.value);
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, bad);
    } else {
        // error
        alert('DENIED');
    }
}
function bad() {
    // location.reload();
    // return false;
}
function showPosition(position) {
    posLat = position.coords.latitude;
    posLong = position.coords.longitude;
    getGeolocationResults();
}

// Verify the fetch request was  sent, if not , do not display the response
function verifyFetch(response) {
    errorMsg.innerText = "";
    if (!response.ok) {
        // If there is an error display this error message
        errorMsg.innerText = "Whoops " + searchbox.value + " is not a valid city";
        throw Error(response.statusText + " -- " + response.url);
    } else {
        return response;
    }

}

// This function grabs the value that the user has entered and places it inside the url.
// This function also makes a call to the API object and grabs both its base and its our API key
function getSearchResults(query) {

    
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)

        .then(verifyFetch)
        .then(weather => {
            return weather.json();
        })
        .then(displayResults)
        .then(function () {
            loadContainer.style.display = 'none';
        });


    // Adding the second API FETCH for the forecast 
    fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
        .then(verifyFetch)
        .then(forecast => {
            return forecast.json();
        })
        .then(displayForecast);
}

function getGeolocationResults() {

    fetch(`${api.base}weather?lat=${posLat}&lon=${posLong}&units=metric&appid=${api.key}`)
        .then(geoweather => {
            return geoweather.json();
        })
        .then(displayResults);

    // Adding the second API FETCH for the forecast 
    fetch(`${api.base}forecast?lat=${posLat}&lon=${posLong}&units=metric&appid=${api.key}`)
        .then(verifyFetch)
        .then(geoforecast => {
            return geoforecast.json();
        })
        .then(displayForecast);
}


// If the user query is a correct city, display the results for each Key
function displayResults(weather) {
    // console.log(weather);
    weatherImg.src = "https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png";


    city.innerText = `${weather.name},${weather.sys.country}`;
    // Date 
    date.innerText = dateBuilder(todayDate);
    // Current Temperature
    currTemp.innerHTML = `${Math.round(weather.main.temp)}<span> °c</span>`;
    // weather description
    weatherDescription.innerText = `${weather.weather[0].description}`;
    // High Low

    searchbox.value = "";
}

function displayForecast(forecast) {

    let forecastArray = forecast.list;
    let outputArray = [];

    // Getting every position thats a multiple of 4 in order to get a consitent time on each forecastArray index 
    for (let i = 4; i < forecastArray.length; i = i + 8) {

        outputArray.push((forecastArray[i]));
        for (let i = 0; i < outputArray.length; i++) {
            // Main Temperature 
            document.querySelector(`.day${i} .temp `).innerHTML = `${Math.round(outputArray[i].main.temp)} °C`;
            // Weather Description
            document.querySelector(`.day${i} .description `).innerHTML = outputArray[i].weather[0].description;
            // Date
            var d = new Date((outputArray[i].dt_txt))
            let dToString = d.toUTCString();
            let dtoHtml = dToString.slice(0, 7);
            document.querySelector(`.day${i} .date `).innerHTML = dtoHtml;

        }
    }

}

// adding Geolocation var posLat;

function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    // console.log(d.getDay());
    return `${day} ${date} ${month} ${year}`;

}
