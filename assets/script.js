$(document).ready(function () {

    var apiKey = "d12a2200f8bbf27b2b5fa7c741e3a391";
    var currentConditionsApiUrl = "https://api.openweathermap.org/data/2.5/weather";
    var forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast";

    var searchHistory;

    function renderSearchHistory() {
        // Start with a clear list 
        $("#search-history").empty();
        // Render a new button for each city
        searchHistory = JSON.parse(localStorage.getItem("Searched Cities"));
        //make button only if it is not already in history list
        if (!searchHistory) {
            searchHistory = [];
        }

        for (var i = 0; i < searchHistory.length; i++) {
            var city = searchHistory[i];
            var button = $("<button></button>");
            button.addClass("btn btn-outline-light");
            button.text(city);
            $("#search-history").append(button);
        }
    }

    function getCurrentWeather(cityName) {
        var weatherRequest = {
            q: cityName,
            appid: apiKey,
            units: "imperial"
        };

        $.get(currentConditionsApiUrl, weatherRequest)
            .done(data => onCurrentConditionsSuccess(data, cityName))
            .fail(onCurrentConditionsError);

        $.get(forecastApiUrl, weatherRequest)
            .done(onForecastSuccess)
            .fail(onForecastError);
    }

    // function getWeatherIcon{
    //     //TODO: extract this from onCurrentConditionsSuccess and onForecastSuccess
    // }

    function onCurrentConditionsError() {
        console.log("error");
        // TODO: 400 error from API - your error
        //TODO:500 error from API - API error
    }
    function onCurrentConditionsSuccess(data, cityName) {
        function displayCurrentConditions() {
            console.log(data);
            var date = new Date();
            var weatherIcon = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
            var weatherRequest = {
                lat: data.coord.lat,
                lon: data.coord.lon,
                appid: apiKey
            }
            var uvIndex = "https://api.openweathermap.org/data/2.5/onecall"

            $.get(uvIndex, weatherRequest)
                .done(uvData => {
                    $("#current-weather").append($("<p>UV Index: <span id='uvIndex'>" + uvData.current.uvi + "</span></p>"));
                    var uvDisplay = $("#uvIndex");
                    if (uvData.current.uvi <= 2) {
                        uvDisplay.attr("style", "background-color:green;")
                    }
                    else if (uvData.current.uvi > 2 && uvData.current.uvi <= 5) {
                        uvDisplay.attr("style", "background-color:yellow;")
                    }
                    else if (uvData.current.uvi > 5 && uvData.current.uvi <= 7) {
                        uvDisplay.attr("style", "background-color:orange;")
                    }
                    else if (uvData.current.uvi > 7 && uvData.current.uvi <= 10) {
                        uvDisplay.attr("style", "background-color:orange;")
                    }
                    else {
                        uvDisplay.attr("style", "background-color:light-purple;")
                    }
                })
                .fail(error => console.log(error));
            //TODO: alert errors
            $("#current-weather").empty();
            $("#current-weather").append($("<h2>" + data.name + " (" + date.toLocaleDateString() + ")" + "<img src=" + weatherIcon + "></img></h2>"));
            $("#current-weather").append($("<p>Temperature: " + data.main.temp + " °F</p>"));
            $("#current-weather").append($("<p>Humidity: " + data.main.humidity + " %</p>"));
            $("#current-weather").append($("<p>Wind Speed: " + data.wind.speed + " MPH</p>"));
        }
        function addHistoryButton() {
            var newSearch = $("<button>" + cityName + "</button>");
            newSearch.addClass("btn btn-outline-light");
            $("#search-history").append(newSearch);
        }
        function storeHistory() {
            searchHistory.push(cityName);
            localStorage.setItem("Searched Cities", JSON.stringify(searchHistory))
        }

        displayCurrentConditions();

        if (!searchHistory.includes(cityName)) {
            addHistoryButton();
            storeHistory();
        }
    }

    function onForecastError() {
        console.log("error");
        //TODO:400 error from API - your error
        //TODO:500 error from API - API error
    }
    function onForecastSuccess(hourForecasts) {
        console.log(hourForecasts);
        // check array of hours to find 1500 on each day
        var dayForecasts = hourForecasts.list.filter(forecast => forecast.dt_txt.includes('15:00:00'));

        $("#5-day-forecast").empty();
        for (var i = 0; i < dayForecasts.length; i++) {
            var forecast = dayForecasts[i]
            var date = new Date(forecast.dt_txt).toLocaleDateString();
            var weatherIcon = "http://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png";
            var temp = forecast.main.temp;
            var humidity = forecast.main.humidity;
            var card = $("<div class='card forecastCard'></div>");
            card.append("<h3>" + date + "</h3>");
            card.append("<p class='card-text'>" + "<img src=" + weatherIcon + "></img><br>Temp: " + temp + "°F<br>Humidity: " + humidity + "%</p>");
            $("#5-day-forecast").append(card);
        }
    }

    renderSearchHistory();
    $("#button-addon2").on("click", function (event) {
        event.preventDefault();
        var cityName = $("#cityName").val();
        $("#cityName").val("");
        getCurrentWeather(cityName);
    });
    $("#search-history").on("click", "button", function () {
        getCurrentWeather($(this).text());

    });

});