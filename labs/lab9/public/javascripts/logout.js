const logoutForm = document.getElementById("logout-form");
logoutForm.addEventListener('submit', function (e) {
   console.log("On logoutForm submit");
   e.preventDefault();  // cancel page reload
   localStorage.removeItem('jwt');
});
