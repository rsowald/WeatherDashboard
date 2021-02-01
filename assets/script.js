var apiKey = "d12a2200f8bbf27b2b5fa7c741e3a391";


function getCurrentWeather() {
    var url = "https://api.openweathermap.org/data/2.5/weather";
    var cityName = $("#cityName").val();

    $.get(url, {
        q: cityName,
        appid: apiKey,
        units: "imperial"
    },
        success
    );
}


function success(data) {
    function displayCurrentConditions() {
        console.log(data);
        var date = new Date();
        var weatherIcon = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
        $("#current-weather").empty();
        $("#current-weather").append($("<h2>" + data.name + " (" + date.toLocaleDateString() + ")" + "<img src=" + weatherIcon + "></img></h2>"));
        $("#current-weather").append($("<p>Temperature: " + data.main.temp + " °F</p>"));
        $("#current-weather").append($("<p>Humidity: " + data.main.humidity + " %</p>"));
        $("#current-weather").append($("<p>Wind Speed: " + data.wind.speed + " MPH</p>"));
    }
    function addHistory() {
        var newSearch = $("<li>" + data.name + "</li>");
        newSearch.addClass("list-group-item");
        $("#search-history").append(newSearch);
    }
    displayCurrentConditions();
    addHistory();
}




$("#button-addon2").on("click", getCurrentWeather)