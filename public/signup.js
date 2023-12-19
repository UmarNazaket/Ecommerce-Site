"use strict";

document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', submitSignupRequest);
});

function submitSignupRequest(evt) {
    evt.preventDefault();

    if (!isPasswordValid()) {
        displayMessage("Passwords do not match.", true);
        return;
    }

    const formData = new FormData(evt.target);
    const user = {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    fetch("http://localhost:3000/users/signup", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user })
    })
        .then(statusCheck)
        .then(res => res.json())
        .then(showResponse)
        .catch(handleError);
}

function isPasswordValid() {
    const password = id("password").value;
    const confirmPassword = id("confirmPassword").value;
    return password === confirmPassword;
}

function showResponse(response) {
    const errorMessageElement = id('error-message');
    const successMessageElement = id('success-message');

    if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
        window.location.href = "./index.html";
    } else {
        displayMessage(response.message, true);
    }
}

function handleError(error) {
    displayMessage("ERROR: " + error.message, true);
}

function id(idName) {
    return document.getElementById(idName);
}

function displayMessage(message, isError) {
    const element = isError ? id('error-message') : id('success-message');
    element.textContent = message;
}

function clearPreviousMessages() {
    const existingMessages = document.querySelectorAll('#error-message, #success-message');
    existingMessages.forEach(msg => msg.remove());
}