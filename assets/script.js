$(document).ready(function () {

    var apiKey = "d12a2200f8bbf27b2b5fa7c741e3a391";
    var currentConditionsApiUrl = "https://api.openweathermap.org/data/2.5/weather";
    var forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast";
    //declare searchHistory as a global variable so it can be used different ways in multiple functions
    var searchHistory;

    function renderSearchHistory() {
        // Start with a clear list 
        $("#search-history").empty();
        searchHistory = JSON.parse(localStorage.getItem("Searched Cities"));
        //make button only if it is not already in history list
        if (!searchHistory) {
            searchHistory = [];
        }
        // Render a new button for each city
        for (var i = 0; i < searchHistory.length; i++) {
            var city = searchHistory[i];
            var button = $("<button></button>");
            button.addClass("btn btn-outline-light");
            button.text(city);
            $("#search-history").append(button);
        }
    }
    //function to call two main APIs
    function getCurrentWeather(cityName) {
        //both APIs use the same query data, so set it as var
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

    function onCurrentConditionsError(Response) {
        console.log("error");
        if (Response.status >= 400 && Response.status < 500) {
            alert("There is something wrong with your city name. Please try again.")
        }
        else if (Response.status >= 500 && Response.status < 600) {
            alert("There is a problem getting your results. Please try again later.")
        }
        else {
            alert("There is an unknown error. Please try again later.")
        }
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
            //new API call to OneCall API for uvData and display data
            //because of asynchronous operations, uvData will still appear last in the list because it will take the most time
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
            //also display all other data from first current weather API call
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
        //only save new searches in local storage if they are not already there
        if (!searchHistory.includes(cityName)) {
            addHistoryButton();
            storeHistory();
        }
    }
    //not alerting this error because user does not need 2 alerts that the same information doesn't work
    function onForecastError() {
        console.log("error");
    }

    function onForecastSuccess(hourForecasts) {
        console.log(hourForecasts);
        // check array of hours to find 1500 on each day
        var dayForecasts = hourForecasts.list.filter(forecast => forecast.dt_txt.includes('15:00:00'));

        $("#5-day-forecast").empty();
        //display data for each day at 1500 in a new card
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
    //these functions run as soon as document is ready
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