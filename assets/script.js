var apiKey = "d12a2200f8bbf27b2b5fa7c741e3a391";


function getCurrentWeather() {
    var url = "https://api.openweathermap.org/data/2.5/weather";
    var cityName = $("#cityName").val();
    var date = new Date();
    $.get(url, {
        q: cityName,
        appid: apiKey
    },
        function (data) {
            console.log(data);

            $("#current-weather").append($("<h2>" + cityName + " (" + date.toLocaleDateString() + ")</h2>"))

        }
    );
}

$("#button-addon2").on("click", getCurrentWeather)