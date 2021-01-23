let searchHistory = [];
let savedSearchesDiv = $("#saved-searches");

// check for local storage
if(localStorage.getItem('city')===null){
    searchHistory = [];
}else{
    searchHistory = JSON.parse(localStorage.getItem('city'));
}
//weatherbit.io API key 

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

   


let storeCity = function(city){
    // pushes new city into array
    searchHistory.push(city);

     //clears previous search displays
     savedSearchesDiv.innerHTML = "";
    
    
     // displays searched cities 
     for(let i = 0; i < searchHistory.length; i++){
             
        let listedCity = document.createElement("li");
        listedCity.attr("class", "list-group-item");
        savedSearchesDiv.appendChild(listedCity);
        let cityLink = document.createElement("a");
        cityLink.setAttribute("href","#");
        cityLink.setAttribute("class", "searched-city")
        cityLink.innerHTML = searchHistory[i];
        listedCity.appendChild(cityLink);

};
}
