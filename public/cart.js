"use strict";

document.addEventListener('DOMContentLoaded', function () {
    // Fetch cart items from localStorage
    let cartItems = [];
    try {
        cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (error) {
        console.error('Error parsing cart items:', error);
        // Handle the error accordingly
    }

    // Populate number of items in the cart heading
    document.getElementById('cart-item-count').innerText = cartItems.length;

    // Populate product details cards
    populateProductDetails(cartItems);

    // Populate summary details card
    populateSummaryCard(cartItems);

    // Update total price when quantity changes
    document.querySelector('.product-details').addEventListener('change', function (event) {
        if (event.target.type === 'number') {
            const index = event.target.getAttribute('data-index');
            const quantity = parseInt(event.target.value);

            // Update quantity in the cart
            cartItems[index].quantity = quantity;

            // Save updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cartItems));

            // Update total price
            updateTotalPrice(cartItems);
        }
    });

    // Handle "Continue To Payment" button click
    document.getElementById('continue-to-payment-btn').addEventListener('click', function () {
        window.location.href = 'checkout.html';
    });
});

function populateProductDetails(cartItems) {
    const productDetailsContainer = document.querySelector('.product-details');

    cartItems.forEach((item, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const productImage = document.createElement('img');
        productImage.src = item.img[0];
        productImage.alt = item.name;

        const detailsColumn = document.createElement('div');
        detailsColumn.classList.add('product-details-column');

        const emptyColumn = document.createElement('div');
        emptyColumn.classList.add('product-empty-column');

        const totalPriceColumn = document.createElement('div');
        totalPriceColumn.classList.add('product-price-column');

        const productName = document.createElement('h3');
        productName.innerText = item.name;

        const productPrice = document.createElement('p');
        productPrice.classList.add('product-price');
        productPrice.innerText = `$${item.price.toFixed(2)} / lb`;

        const totalItems = document.createElement('input');
        totalItems.type = 'number';
        totalItems.min = '1';
        totalItems.value = item.quantity;
        totalItems.setAttribute('data-index', index);

        const totalPrice = document.createElement('p');
        totalPrice.innerText = `$${(item.price * item.quantity).toFixed(2)}`;
        totalPrice.classList.add('total-price');

        detailsColumn.appendChild(productName);
        detailsColumn.appendChild(productPrice);
        detailsColumn.appendChild(totalItems);
        totalPriceColumn.appendChild(totalPrice);

        productCard.appendChild(productImage);
        productCard.appendChild(detailsColumn);
        productCard.appendChild(emptyColumn);
        productCard.appendChild(totalPriceColumn);

        productDetailsContainer.appendChild(productCard);
    });
}

function populateSummaryCard(cartItems) {
    const summaryCard = document.querySelector('.summary-card');

    const heading = document.createElement('h3');
    heading.innerText = 'Order Summary';

    const pricingDetails = document.createElement('div');
    pricingDetails.classList.add('pricing-details');

    const subtotal = document.createElement('p');
    subtotal.innerText = `Subtotal: $${calculateSubtotal(cartItems).toFixed(2)}`;

    const shipping = document.createElement('p');
    shipping.innerText = 'Shipping: $2.99';

    const tax = document.createElement('p');
    tax.innerText = 'Tax: $0.99';

    const total = document.createElement('p');
    total.innerText = `Total: $${calculateTotal(cartItems).toFixed(2)}`;

    const btnDiv = document.createElement('div');
    btnDiv.innerHTML = '<button id="continue-to-payment-btn" class="btn btn-primary">Continue To Payment <span class="fa fa-arrow-circle-o-right"></span></button>';

    pricingDetails.appendChild(subtotal);
    pricingDetails.appendChild(shipping);
    pricingDetails.appendChild(tax);
    pricingDetails.appendChild(total);

    summaryCard.appendChild(heading);
    summaryCard.appendChild(pricingDetails);
    summaryCard.appendChild(btnDiv);
}

function calculateSubtotal(cartItems) {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function calculateTotal(cartItems) {
    const subtotal = calculateSubtotal(cartItems);
    const shipping = 2.99;
    const tax = 0.99;
    return subtotal + shipping + tax;
}

function updateTotalPrice(cartItems) {
    const totalItems = document.querySelectorAll('.total-price');
    const subtotalElement = document.querySelector('.pricing-details p:first-child');
    const totalElement = document.querySelector('.pricing-details p:last-child');

    let subtotal = 0;

    cartItems.forEach((item, index) => {
        const totalItemPrice = item.price * item.quantity;
        totalItems[index].innerText = `$${totalItemPrice.toFixed(2)}`;
        subtotal += totalItemPrice;
    });

    subtotalElement.innerText = `Subtotal: $${subtotal.toFixed(2)}`;
    totalElement.innerText = `Total: $${(subtotal + 2.99 + 0.99).toFixed(2)}`;
}
