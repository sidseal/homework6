$(document).ready(function () {
    doTheThing()
});
//Variables//
var $citySearched = $("#searchTerm");
var $searchBtn = $("#searchBtn");
var $cityList = $("#cityListDiv");
var $forecast = $("#forecastDiv");
var $currentWeather = $("#currentWeather");
const apiKey = "56f38c0b754d91b2d96d344a431e5dd4";

var city = "austin"//stub for UI

var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

function changeTemp(kelvin) {
    let celciusTemp = Number(kelvin) - 273.15
    console.log(celciusTemp)
    let farTemp = (celciusTemp * 9 / 5) + 32
    return farTemp;
}

function doTheThing() {

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response)
        console.log(response.dt)
        let unixTime = response.dt
        var date = new Date(unixTime * 1000);
        console.log(date)
        console.log("kelvin", response.main.temp)
        let temp = changeTemp(response.main.temp)
        let $cardDiv = $("<div>").addClass("card")
        $cardDiv.append($("<h5>").addClass('card-title').text(`${city} ${date.toDateString()}`))
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


            $currentWeather.append($cardDiv)
        })
    })

    let queryURLForecast = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

    $.ajax({
        url: queryURLForecast,
        method: "GET",
    }).then(function (response) {
        console.log(response)
        let $cardDiv = $("<div>").addClass("card")
            $cardDiv.append($("<h5>").addClass('card-title').text(`5 Day Forecast:`))
            let $cardBody = $("<div>").addClass("card-body").addClass("row")
            $cardDiv.append($cardBody)
        for (let i = 6; i < response.list.length; i += 8) {
            //for(let i =7; i<response.list.length; i+=8)
            console.log(i)
            console.log(response.list[i])
            console.log(response.list[i].dt_txt)
            let data = response.list[i]
            let $lcardDiv = $("<div>").addClass("card").addClass("col-2").addClass("bg-primary").addClass("mx-3")
            $lcardDiv.append($("<h5>").addClass('card-title').text(data.dt_txt.slice(5,11)))
            let $lcardBody = $("<div>").addClass("card-body")
            $lcardDiv.append($lcardBody)
            $cardBody.append($lcardDiv)
            $lcardBody.append($(`<p> Temp: ${Math.round(changeTemp(data.main.temp))} \u2109</p>`))
            $lcardBody.append($(`<p> Humidity: ${(data.main.humidity)}%</p>`))


            //console.log()//maybe bring in moment to parse the data
        }
        $forecast.append($cardDiv)
    })

}






