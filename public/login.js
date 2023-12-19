"use strict";

// Function to submit login request
function submitLoginRequest(evt) {
  // Clear previous login results
  id("login-results").textContent = "";
  // Prevent the default form submission
  evt.preventDefault();

  // Extract user credentials from the form
  const formData = new FormData(evt.target);
  const user = {
    email: formData.get('email'),
    password: formData.get('password')
  };

  // Send a POST request to the login API
  fetch("http://localhost:3000/users/login", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Specify the content type as JSON
    },
    body: JSON.stringify({ user }) // Simplify the object property
  })
    .then(statusCheck)
    .then(res => res.json()) // Parse the response JSON
    .then(showResponse)
    .catch(handleError);
}

// Function to handle the login response
function showResponse(response) {
  if (response.token) {
    // Save user information and token to localStorage
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("token", response.token);
    // Redirect to the index page upon successful login
    window.location.href = "./index.html";
  } else if (response.message) {
    // Display an error message if login fails
    id("login-results").textContent = `Error: ${response.message}`;
  }
}

// Function to get element by ID
function id(elementId) {
  return document.getElementById(elementId);
}

// Function to check the status of the HTTP response
function statusCheck(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response;
}

// Function to handle errors
function handleError(error) {
  console.error('Error:', error);
  // Display the error message
  id("login-results").textContent = `Error: ${error}`;
}
