let searchHistory = [];
let coordinates = [];
let savedSearchesDiv = document.getElementById("saved-searches");
let searchBtn = document.getElementById("btn");
let fiveDayBtn = document.getElementById("five-day-btn");
let localBtn = document.getElementById("local-btn");
let fiveDayClose = document.getElementById("five-day-close")
let searchBar = document.getElementById("searchbar");
let savedCityEl = document.getElementById("saved-searches");
const modal = document.querySelector('#main-modal'); 
const close = document.querySelector('.delete');

const request = new XMLHttpRequest();

// Pull current location from local ip
function currentLocation(){
  request.open('GET', 'https://api.ipdata.co/city?api-key=1ddc00a02475fc126c6d96449e706e451097bb6f79b990f25e1fc8f0&fields');
  request.setRequestHeader('Accept', 'application/json');
  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      citySearch(this.response);
      modal.style.display = 'block' 
    }
  };

  request.send();
}

 


// check for local storage
if(localStorage.getItem('city')===null){
    searchHistory = [];
}else{
    searchHistory = JSON.parse(localStorage.getItem('city'));
}

// Animates navbar burger
$(document).ready(function() {

  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function() {
  
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  
    });
});   

// API call that translates lon + lat from weather API into county name for COVID API
let findCounty = function(lat, lon){

  fetch('https://geo.fcc.gov/api/census/area?lat=' + lat + '&lon=' + lon + '&format=json').then(function(response){
    if(response.ok){
      response.json().then(function(data){
        let stateName = data.results[0].state_name;
        let countyName = data.results[0].county_name;
        displayCovidData(countyName, stateName);


        
      });
    }
  })  
}

// Covid Api fetch
function displayCovidData(countyName, stateName){

  const url ='https://disease.sh/v3/covid-19/jhucsse/counties/';
  
  fetch(url + countyName)
    .then((resp) => resp.json())
    .then(function(data) {
      // for multiple counties with the same name, match stateName with covid province to pull correct info
      for( var i = 0; i < data.length; i++) {

        // once correct info is found, display on modal
        if(data[i].province === stateName) {
          let confirmedCases = document.getElementById('county-cases')
          let confirmedDeaths = document.getElementById('county-deaths')
          let countySpan = document.getElementById('county-name')
          let casesData = data[i].stats.confirmed;
          let deathData = data[i].stats.deaths;

          // format numbers with commas
          nfObject = new Intl.NumberFormat('en-US')
          casesData = nfObject.format(casesData);
          deathData = nfObject.format(deathData)
            
          // clear previous information
          countySpan.innerHTML = "";
          confirmedCases.innerHTML = "";
          confirmedDeaths.innerHTML = "";
            
          // add current cities info
          countySpan.innerHTML = '<strong>' + countyName +  '</strong>';
          confirmedCases.innerHTML = casesData;
          confirmedDeaths.innerHTML = deathData;

        }
    }
}

)}



// stores searched city in local storage and displays below search bar
let storeRecentSearch = function(){


    // limits display to last 8 searches
    searchHistory = searchHistory.slice(Math.max(searchHistory.length - 8,0))

     //clears previous search displays
     savedSearchesDiv.innerHTML = "";
    
    
     // displays searched cities 
     for(let i = 0; i < searchHistory.length; i++){
             
        let listedCity = document.createElement("li");
        listedCity.setAttribute("class", "button is-small mt-0 mx-1 mt-2");
        savedSearchesDiv.appendChild(listedCity);
        let cityLink = document.createElement("a");
        cityLink.setAttribute("href","#");
        cityLink.setAttribute("class", "searched-city has-text-white")
        cityLink.innerHTML = searchHistory[i];
        listedCity.appendChild(cityLink);

      };


}

// When user clicks on searched city link, modal will pop up with that cities information
let displayRecentSearch = function(event){
  let targetEl = event.target;

  if(targetEl.matches(".searched-city")){
      let city = targetEl.textContent;
      storeRecentSearch(city);
      displayCityForecast(city);
      modal.style.display = "block";

  }
}

// Pulls value from search bar
let citySearch = function(location){
  let city = searchBar.value.trim().toLowerCase();
  
  // user input city in searchbar
  if(city){
  
    // stores city into local storage
    localStorage.setItem("city", JSON.stringify(searchHistory));
    storeRecentSearch(city);
    displayCityForecast(city);
    fiveDayForecast(city);

    // pushes new city into array. prevents duplicates from displaying
    if (searchHistory.indexOf(city) === -1) searchHistory.push(city);

    // clears searchbar
    searchBar.value = "";

  // user clicks on "My Location" button
  }else if(location){

    storeRecentSearch(location);
    displayCityForecast(location);
    fiveDayForecast(location); 

  }else{

    modal.style.display = "none";
      
  }
}



//api call for currently searched city
function displayCityForecast(city){
  var apiKey = "d6563c1f7289474849eef3ceaf635e1d";
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){
    var weatherIcon = response.weather[0].icon;
    var date = $("<h4>").text(moment().format('l'));
    var icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png");
    var tempFarenheit = (response.main.temp - 273.15) * 1.80 + 32;
    var feelLike = (response.main.feels_like - 273.15) * 1.80 + 32;

          
    $("#city-name").text(response.name);
    $("#city-name").append(date);
    $("#city-name").append(icon);
    $("#city-temp").text(tempFarenheit.toFixed(2) + " \u00B0F");
    $("#city-humidity").text(response.main.humidity + "%");
    $("#city-feelslike").text(feelLike.toFixed(2) + " \u00B0F");

      
    var lat = response.coord.lat
    var lon = response.coord.lon
      
    // send coordinate data to findCounty function
    findCounty(lat, lon)


    queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon; 
    $.ajax({
      url: queryURL,
      method: "GET"
      }).then(function(response){

      //apply class for UV index 
      var uvIndex = response.value;
      $("#city-uvindex").removeClass("favorable");
      $("#city-uvindex").removeClass("moderate");
      $("#city-uvindex").removeClass("severe");
      if (uvIndex <= 2.9){
        $("#city-uvindex").addClass("favorable");
      } else if (uvIndex >= 3 && uvIndex <= 7.9){
        $("#city-uvindex").addClass("moderate");
      } else {
        $("#city-uvindex").addClass("severe");
      };

    $("#city-uvindex").text(response.value);});   
    $("#display-city").show();
  }); 
};

// begin api call for 5 day forecast	
function fiveDayForecast(city){	
  var apiKey = "d6563c1f7289474849eef3ceaf635e1d"	
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;	

    $.ajax({	
      url: queryURL,	
      method: "GET"	
    }).then(function(response){	
      var counter = 1	
      for(var i=0; i < response.list.length; i += 8){	
        var date = moment(response.list[i].dt_txt).format("l");	
        var weatherIcon = response.list[i].weather[0].icon;	
        var temperatureF = (response.list[i].main.temp - 273.15) * 1.80 + 32;	

        
        $("#day-" + counter).text(date);	
        $("#icon" + counter).attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png");	
        $("#temp-" + counter).text(temperatureF.toFixed(2) + " \u00B0F");	
        $("#humidity-" + counter).text(response.list[i].main.humidity + "%"); counter++;};
      $("#extended5").show();   	
    });	
};


// main modal event
searchBtn.addEventListener('click', function () { 
  modal.style.display = 'block' 
}) 

close.addEventListener('click', function () { 
  modal.style.display = 'none' 
  let extended5 = document.getElementById("forecast-modal");
  extended5.style.display = 'none'
}) 

// 5 day forecast second modal event
fiveDayBtn.addEventListener('click', function() {
  let extended5 = document.getElementById("forecast-modal");
  extended5.style.display = 'block'
})

fiveDayClose.addEventListener('click', function(){
  let extended5 = document.getElementById("forecast-modal");
  extended5.style.display = 'none'
})

window.addEventListener('click', function (event) { 
  if (event.target.className ===  'delete') { 
    modal.style.display = 'none' 

  } 
}) 

// recent searches event
savedCityEl.addEventListener("click", displayRecentSearch);

// user location event
localBtn.addEventListener('click', currentLocation);

// user input event 
searchBtn.addEventListener("click", citySearch);              
