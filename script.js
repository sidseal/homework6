//Variables//
var $citySearched = $("#searchTerm");
var $searchBtn = $("#searchBtn");
var $cityList = $("#cityListDiv");
var $forecast = $("#forecastDiv");
var $currentWeather = $("#currentWeather");
const apiKey = "56f38c0b754d91b2d96d344a431e5dd4";

$(document).ready(function () {

    var cityHist = JSON.parse(localStorage.getItem("cities"))
    console.log(typeof cityHist)
    city = cityHist[cityHist.length - 1]

    for (let i = 0; i < cityHist.length; i++) {
        var thisCity = cityHist[i]
        var cityCard = $('<div>').addClass("card").text(thisCity);
        $cityList.prepend(cityCard);
    }


    doTheThing()
});

function changeTemp(kelvin) {
    let celciusTemp = Number(kelvin) - 273.15
    console.log(celciusTemp)
    let farTemp = (celciusTemp * 9 / 5) + 32
    return farTemp;
}
$searchBtn.on("click", function () {
    event.preventDefault();
    // var city = $citySearched.val();


    var cityCard = $('<div>').addClass("card").text($citySearched.val().toUpperCase());
    $cityList.append(cityCard);
    city = $citySearched.val()

    var citiesSoFar = localStorage.getItem('cities')

    if (!citiesSoFar) {
        let stringOb = JSON.stringify([city])

        localStorage.setItem('cities', stringOb)
    } else {
        let citiesArray = JSON.parse(citiesSoFar)
        citiesArray.push(city)
        localStorage.setItem('cities', JSON.stringify(citiesArray))
    }




    city = $citySearched.val()
    doTheThing()
})

function doTheThing() {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        let unixTime = response.dt
        var date = new Date(unixTime * 1000);
        let temp = changeTemp(response.main.temp)
        let $cardDiv = $("<div>").addClass("card")
        $cardDiv.append($("<h5>").addClass('card-title').text(`${city.toUpperCase()}  ${date.toDateString()}`))
        let $cardBody = $("<div>").addClass("card-body")
        $cardDiv.append($cardBody)

        let $temp = $('<p>').text(`Temperature: ${Math.round(temp)} \u2109`)
        $cardBody.append($temp)
        let $humidity = $('<p>').text(`Humidity: ${response.main.humidity}%`)
        $cardBody.append($humidity)
        let $windSpeed = $('<p>').text(`Wind Speed: ${response.wind.speed}MPH`)
        $cardBody.append($windSpeed)

        let lat = response.coord.lat
        let lon = response.coord.lon

        var queryURLUV = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
        $.ajax({
            url: queryURLUV,
            method: "GET",
        }).then(function (response) {
            let $uvIndex = $('<p>').text(`UV Index: ${response.value}`)
            $cardBody.append($uvIndex)


            $currentWeather.html($cardDiv)
        })
    })

    let queryURLForecast = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

    $.ajax({
        url: queryURLForecast,
        method: "GET",
    }).then(function (response) {
        let $cardDiv = $("<div>").addClass("card")
        $cardDiv.append($("<h5>").addClass('card-title').text(`5 Day Forecast:`))
        let $cardBody = $("<div>").addClass("card-body").addClass("row")
        $cardDiv.append($cardBody)
        for (let i = 6; i < response.list.length; i += 8) {
            let data = response.list[i]
            let $lcardDiv = $("<div>").addClass("card").addClass("col-2").addClass("bg-primary").addClass("mx-3")
            $lcardDiv.append($("<h5>").addClass('card-title').text(data.dt_txt.slice(5, 11)))
            let $lcardBody = $("<div>").addClass("card-body")
            $lcardDiv.append($lcardBody)
            $cardBody.append($lcardDiv)
            $lcardBody.append($(`<p> Temp: ${Math.round(changeTemp(data.main.temp))} \u2109</p>`))
            $lcardBody.append($(`<p> Humidity: ${(data.main.humidity)}%</p>`))



        }
        $forecast.html($cardDiv)
    })
}
