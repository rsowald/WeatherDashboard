$(document).ready(function () {

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

    // function getWeatherIcon{
    //     //todo: extract this from onCurrentConditionsSuccess
    // }

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
            //todo: write to local storage
            //todo: only add to history if it's not already there
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
    function onForecastSuccess(hourForecasts) {
        console.log(hourForecasts);
        //these hourForecasts come in 3 hour blocks, so every 8th index is the same time on the next day
        var dayForecasts = [hourForecasts.list[2], hourForecasts.list[10], hourForecasts.list[18], hourForecasts.list[26], hourForecasts.list[34]]
        $("#5-day-forecast").empty();
        for (var i = 0; i < dayForecasts.length; i++) {
            var forecast = dayForecasts[i]
            var date = new Date(forecast.dt_txt).toLocaleDateString();
            var weatherIcon = "http://openweathermap.org/img/wn/" + forecast.weather[0].icon + "@2x.png";
            var temp = forecast.main.temp;
            var humidity = forecast.main.humidity;
            var card = $("<div class='card forecastCard'></div>");
            card.append("<h3>" + date + "</h3>");
            card.append("<p class='card-text'>" + "<img src=" + weatherIcon + "></img><br>Temp: " + temp + "°F<br>Humidity: " + humidity + "%</p>");
            $("#5-day-forecast").append(card);
        }
    }


    $("#button-addon2").on("click", getCurrentWeather);
    //todo: make enter also submit search

});