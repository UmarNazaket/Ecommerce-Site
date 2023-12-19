document.addEventListener('DOMContentLoaded', function () {
    // Fetch cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Populate order summary details
    populateOrderSummary(cartItems);

    // Autofill customer details from localStorage
    const customerNameInput = document.querySelector('.customer-details input[type="text"]');
    const customerEmailInput = document.querySelector('.customer-details input[type="email"]');
    
    const user = JSON.parse(localStorage.getItem('user'))[0];

    if (user) {
        customerNameInput.value = user.email;
        customerEmailInput.value = `${user.firstname} ${user.lastname}`;
    }
});

function populateOrderSummary(cartItems) {
    const orderSummaryContainer = document.querySelector('.order-summary');

    // Create and append heading for order summary
    const heading = document.createElement('h2');
    heading.innerText = 'Order Summary';
    orderSummaryContainer.appendChild(heading);

    // Create and append container for order details
    const orderDetails = document.createElement('div');
    orderDetails.classList.add('order-details');
    orderSummaryContainer.appendChild(orderDetails);

    // Populate order details
    cartItems.forEach(item => {
        const orderItem = document.createElement('p');
        orderItem.innerText = `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
        orderDetails.appendChild(orderItem);
    });

    // Calculate and display total amount
    const totalAmount = document.createElement('p');
    totalAmount.innerText = `Total: $${calculateSubtotal(cartItems).toFixed(2)}`;
    orderSummaryContainer.appendChild(totalAmount);

    // Populate customer details form
    populateCustomerDetails();
}

function populateCustomerDetails() {
    const customerDetailsContainer = document.querySelector('.customer-details');

    // Create and append heading for customer details
    const heading = document.createElement('h2');
    heading.innerText = 'Customer Details';
    customerDetailsContainer.appendChild(heading);

    // Create and append form for customer details
    const form = document.createElement('form');
    customerDetailsContainer.appendChild(form);

    // Create and append input fields for customer details
    const createInputField = (labelText, inputType, inputName) => {
        const label = document.createElement('label');
        label.innerText = labelText;

        const input = document.createElement('input');
        input.type = inputType;
        input.required = true;
        input.name = inputName;

        form.appendChild(label);
        form.appendChild(input);
    };

    createInputField('Name:', 'text', 'customerName');
    createInputField('Email:', 'email', 'customerEmail');
    createInputField('Phone:', 'tel', 'customerPhone');
    createInputField('Address:', 'text', 'customerAddress');

    // Create and append place order button
    const placeOrderBtn = document.createElement('button');
    placeOrderBtn.id = 'place-order-btn';
    placeOrderBtn.innerText = 'Place Order';
    placeOrderBtn.addEventListener('click', placeOrder);
    form.appendChild(placeOrderBtn);
}

function calculateSubtotal(cartItems) {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function placeOrder(e) {
    e.preventDefault();
    const customerName = document.querySelector('.customer-details input[type="text"]').value;
    const customerEmail = document.querySelector('.customer-details input[type="email"]').value;
    const customerPhone = document.querySelector('.customer-details input[type="tel"]').value;
    
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const user = JSON.parse(localStorage.getItem('user'))[0];

    // Check if customer details are provided
    if (!customerName || !customerEmail || !customerPhone) {
        alert('Please provide all customer details.');
        return;
    }

    // Create payload
    const orderPayload = {
        order: {
            customer_id: user.user_id, // Replace with the actual customer ID from your system
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            productDetails: cartItems.map(item => ({ productId: item.product_id, quantity: item.quantity }))
        }
    };

    // Send the payload to the backend API
    fetch("http://localhost:3000/order/postorder", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}` // Add authorization header if needed
        },
        body: JSON.stringify(orderPayload)
    })
    .then(statusCheck)
    .then(response => response.json())
    .then(handleOrderResponse)
    .catch(handleError);
}

// Function to fetch the authentication token from localStorage
function getAuthToken() {
    return localStorage.getItem('token');
}

function handleOrderResponse(response) {
    if (response.status == 200) {
        // Order successful, remove cart items from localStorage
        localStorage.removeItem('cart');

        // Redirect to shop.html
        window.location.href = './shop.html';
    } else {
        // Order failed, display an error message
        alert(`Order failed: ${response.message}`);
    }
}

function handleError(e){
    console.log("ERROR: ", e)
}

// Function to check the status of the HTTP response
function statusCheck(response) {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  }