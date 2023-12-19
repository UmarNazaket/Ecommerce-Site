"use strict";

(function () {
  let isLoggedIn = false;

  // Event listener for the window load event
  window.addEventListener("load", init);

  // Initialization function
  function init() {
    // Check if a token is present in localStorage
    isLoggedIn = !!localStorage.getItem('token');
    updateButtonVisibility();
  }

  // Function to update button visibility based on login status
  function updateButtonVisibility() {
    const loginButton = document.querySelector('#loginBtn');
    const logoutButton = document.querySelector('#logoutBtn');
    const profileButton = document.querySelector('#profileBtn');

    if (isLoggedIn) {
      setElementDisplay(loginButton, 'none');
      setElementDisplay(logoutButton, 'inline-block');
      setElementDisplay(profileButton, 'inline-block');
    } else {
      setElementDisplay(loginButton, 'inline-block');
      setElementDisplay(logoutButton, 'none');
      setElementDisplay(profileButton, 'none');
    }
  }

  // Function to set display property of an element
  function setElementDisplay(element, displayValue) {
    if (element) {
      element.style.display = displayValue;
    }
  }
})();

// Function to logout the user
function logoutUser() {
  // Remove token and user information from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to the login page
  window.location.href = "./login.html";
}
