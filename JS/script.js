let searchHistory = [];
let savedSearchesDiv = document.getElementById("saved-searches");
let searchButton = document.getElementById("btn");
let searchBar = document.getElementById("searchbar");

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
    const btn =  
          document.querySelector('#btn') 
    const close =  
          document.querySelector('.delete') 
  
    btn.addEventListener('click', function () { 
      modal.style.display = 'block' 
    }) 
  
    close.addEventListener('click', function () { 
      modal.style.display = 'none' 
    }) 
    window.addEventListener('click', function (event) { 
      if (event.target.className ===  'delete') { 
        modal.style.display = 'none' 
      } 
    }) 

// translates lon + lat from weather API into county name for COVID API
let findCounty = function(lat, lon){
  fetch('https://geo.fcc.gov/api/census/area?lat=' + lat + '&lon=' + lon + '&format=json').then(function(response){
    if(response.ok){
      response.json().then(function(data){
        let countyName = data.results[0].county_name;
        return countyName;
      });
    }
  })  
}

// stores searched city in local storage and displays below search bar
let storeCity = function(city){
    // pushes new city into array
    searchHistory.push(city);

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

        // stores city into local storage
        localStorage.setItem("city", JSON.stringify(searchHistory));
}

// Pulls value from search bar
let citySearch = function(){
    let city = searchBar.value.trim().toLowerCase();
    console.log(city);
    if(city){
      storeCity(city);
      searchBar.value = "";
    }else{
      return
    }

}

searchButton.addEventListener("click", citySearch);