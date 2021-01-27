let searchHistory = [];
let coordinates = [];
let savedSearchesDiv = document.getElementById("saved-searches");
let searchBtn = document.getElementById("btn");
let fiveDayBtn = document.getElementById("five-day-btn")
let fiveDayClose = document.getElementById("five-day-close")
let searchBar = document.getElementById("searchbar");
let savedCityEl = document.getElementById("saved-searches")



// check for local storage
if(localStorage.getItem('city')===null){
    searchHistory = [];
}else{
    searchHistory = JSON.parse(localStorage.getItem('city'));
}

//weatherbit.io API key a6f0dd8794a44655b5fe26a993709bf4

// Animates navbar burger
$(document).ready(function() {

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
  
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
  
    });
  });
  
  //modal JS
  const modal =  
          document.querySelector('.modal'); 
    const close =  
          document.querySelector('.delete');
    
  
    searchBtn.addEventListener('click', function () { 
      modal.style.display = 'block' 
    }) 

    close.addEventListener('click', function () { 
      modal.style.display = 'none' 
      let extended5 = document.getElementById("extended5");
      extended5.style.display = 'none'
    }) 

    window.addEventListener('click', function (event) { 
      if (event.target.className ===  'delete') { 
        modal.style.display = 'none' 

      } 
    }) 

    // 5 day forecast second modal
    fiveDayBtn.addEventListener('click', function() {
      let extended5 = document.getElementById("extended5");
      extended5.style.display = 'block'
    })

    fiveDayClose.addEventListener('click', function(){
      let extended5 = document.getElementById("extended5");
      extended5.style.display = 'none'
    })

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

function displayCovidData(countyName, stateName){
  console.log(countyName);
}


// stores searched city in local storage and displays below search bar
let storeRecentSearch = function(){


    // limits display to last 8 searches
    searchHistory = searchHistory.slice(Math.max(searchHistory.length - 8,0))

     //clears previous search displays
     savedSearchesDiv.innerHTML = "";
    
    
     // displays searched cities 
     for(let i = 0; i < searchHistory.length; i++){
             
        let listedCity = document.createElement("li");
        listedCity.setAttribute("class", "button is-small mt-0 mx-1");
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
let citySearch = function(){
  let city = searchBar.value.trim().toLowerCase();
      
  // pushes new city into array
  searchHistory.push(city);
  
  if(city){  
      // stores city into local storage
      localStorage.setItem("city", JSON.stringify(searchHistory));
      storeRecentSearch(city);
      displayCityForecast(city);
      searchBar.value = "";
    }else{
      return
    }

}

searchBtn.addEventListener("click", citySearch);
savedCityEl.addEventListener("click", displayRecentSearch);

//api call for currently searched city
function displayCityForecast(city){
  var apiKey = "d6563c1f7289474849eef3ceaf635e1d";
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

  $.ajax({
      url: queryURL,
      method: "GET"
  }).then(function(response){
      var weatherIcon = response.weather[0].icon;
      var date = $("<h2>").text(moment().format('l'));
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
              $("#city-uvindex").addClass("severe");};
              $("#city-uvindex").text(response.value);});   
              $("#displayCity").show();}); 
          };
          
        
        //Clear input for new search
        function getCities(){
            $("#searchedCity").empty();
            for (var i = 0; i < cities.length; i++) { 
                searchedCities(cities[i]);
            };};
        
        function weather(city){
            displayCityForecast(city);
            fiveDayForecast(city);};
        function init() {
        // retrieve city list from local storage
            var storedCities = JSON.parse(localStorage.getItem("searches"));
            if (storedCities) {
                cities = storedCities;
                getCities();
                weather(cities[cities.length -1]);
            };};
        init();


        