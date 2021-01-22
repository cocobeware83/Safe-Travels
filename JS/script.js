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
          document.querySelector('.modal-close') 
  
    btn.addEventListener('click', function () { 
      modal.style.display = 'block' 
    }) 
  
    close.addEventListener('click', function () { 
      modal.style.display = 'none' 
    }) 
    window.addEventListener('click', function (event) { 
      if (event.target.className ===  'modal-background') { 
        modal.style.display = 'none' 
      } 
    }) 

   

