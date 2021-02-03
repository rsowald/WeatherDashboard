$(document).ready(function () {

    var apiKey = "d12a2200f8bbf27b2b5fa7c741e3a391";
    ;

    function renderSearchHistory() {
        // Start with a clear list 
        $("#search-history").empty();
        // Render a new button for each city
        var searchHistory = JSON.parse(localStorage.getItem("Searched Cities"))
        for (var i = 0; i < searchHistory.length; i++) {
            var city = searchHistory[i];

            var button = $("<button></button>");
            button.text(city);

            $("#search-history").append(button);
        }
    }

    function getCurrentWeather(cityName) {
        var currentConditionsApiUrl = "https://api.openweathermap.org/data/2.5/weather";
        var forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast";

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
    //     //todo: extract this from onCurrentConditionsSuccess and onForecastSuccess
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
        function storeHistory() {
            var searchedCity = $("#cityName").val();
            $("#cityName").val("");
            searchHistory.push(searchedCity);
            localStorage.setItem("Searched Cities", JSON.stringify(searchHistory))
        }
        displayCurrentConditions();
        addHistory();
        storeHistory();
    }

    function onForecastError() {
        console.log("error");
        //todo:400 error from API - your error
        //todo:500 error from API - API error
    }
    function onForecastSuccess(hourForecasts) {
        console.log(hourForecasts);
        // check array of hours to find 1500 on each day
        var dayForecasts = hourForecasts.list.filter(forecast => forecast.dt_txt.includes('15:00:00'));

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

    renderSearchHistory();
    $("#button-addon2").on("click", function () {
        getCurrentWeather($("#cityName").val());
    });
    //todo: make enter also submit search
    $("#search-history").on("click", "button", function () {
        getCurrentWeather($(this).text());
    });

});