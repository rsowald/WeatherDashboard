var apiKey = "d12a2200f8bbf27b2b5fa7c741e3a391";


function getCurrentWeather() {
    var currentConditionsApiUrl = "https://api.openweathermap.org/data/2.5/weather";
    var forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast";
    var cityName = $("#cityName").val();
    $("#cityName").val("");
    var weatherRequest = {
        q: cityName,
        appid: apiKey,
        units: "imperial"
    };

    $.get(currentConditionsApiUrl, weatherRequest)
        .done(onCurrentConditionsSuccess)
        .fail(onCurrentConditionsError);

    $.get(forecastApiUrl, weatherRequest)
        .done(onForecastSuccess)
        .fail(onForecastError);
}

function onCurrentConditionsError() {
    console.log("error");
    //todo:400 error from API - your error
    //todo:500 error from API - API error
}
function onCurrentConditionsSuccess(data) {
    function displayCurrentConditions() {
        console.log(data);
        var date = new Date();
        var weatherIcon = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        //todo: call UVIndex API and display result
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
        //todo: click event on history items to search for them
    }
    displayCurrentConditions();
    addHistory();
}

function onForecastError() {
    console.log("error");
    //todo:400 error from API - your error
    //todo:500 error from API - API error
}
function onForecastSuccess(data) {

}


$("#button-addon2").on("click", getCurrentWeather)