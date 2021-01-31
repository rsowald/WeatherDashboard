var apiKey = "d12a2200f8bbf27b2b5fa7c741e3a391";


function getCurrentWeather() {
    var url = "https://api.openweathermap.org/data/2.5/weather";
    var cityName = $("#cityName").val();
    var date = new Date();
    $.get(url, {
        q: cityName,
        appid: apiKey,
        units: "imperial"
    },
        function (data) {
            console.log(data);
            var weatherIcon = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
            $("#current-weather").append($("<h2>" + cityName + " (" + date.toLocaleDateString() + ")" + "<img src=" + weatherIcon + "></img></h2>"));
            $("#current-weather").append($("<p>Temperature: " + data.main.temp + " °F</p>"));
            $("#current-weather").append($("<p>Humidity: " + data.main.humidity + " %</p>"));
            $("#current-weather").append($("<p>Wind Speed: " + data.wind.speed + " MPH</p>"));
        }
    );
}

$("#button-addon2").on("click", getCurrentWeather)