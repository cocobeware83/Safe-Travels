let searchHistory = [];
let savedSearchesDiv = document.getElementById("saved-searches")
let searchButton = document.getElementById("btn")

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

   

// stores searched city in local storage and displays below search bar
let storeCity = function(city){
    // pushes new city into array
    searchHistory.push(city);

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

let citySearch = function(){
    let city = document.getElementById("searchbar").value.trim().toLowerCase();
    console.log(city);
    if(city){
      storeCity(city);
    }else{
      return
    }

}

searchButton.addEventListener("click", citySearch);