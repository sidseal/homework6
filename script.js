$(document).ready(function () {
    doTheThing()
});
//Variables//
var $citySearched = $("#searchTerm");
var $searchBtn = $("#searchBtn");
var $cityList = $("#cityListDiv");
var $forecast = $("#forecastDiv");
const apiKey = "56f38c0b754d91b2d96d344a431e5dd4";

var city = "austin"//stub for UI

var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

function changeTemp(kelvin){
    let celciusTemp = Number(kelvin) - 273.15
    console.log(celciusTemp)
    // debugger
    let farTemp = (celciusTemp * 9/5) + 32
    return farTemp;
}

function doTheThing(){

$.ajax({
    url: queryURL,
    method: "GET",
}).then(function(response){
    console.log("second")
    console.log(response)
    console.log("kelvin",response.main.temp)
    console.log("far", changeTemp(response.main.temp))
    console.log(response.main.humidity)
    console.log(response.wind.speed)
    let lat= response.coord.lat
    let lon= response.coord.lon
    console.log(lat, lon)
    var queryURLUV = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    $.ajax({
        url:queryURLUV,
        method: "GET",
    }).then(function(response){
        console.log(response.value)
    })
})
console.log("first")
let queryURLForecast= `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

$.ajax({
    url: queryURLForecast,
    method: "GET",
}).then(function(response){
    console.log(response)
    for(let i =0; i<response.list.length; i+=1){
    //for(let i =7; i<response.list.length; i+=8)
    console.log(i)
    console.log(response.list[i])
    //console.log()//maybe bring in moment to parse the data
    }
})
}






