"use strict";

document.addEventListener('DOMContentLoaded', async function () {
    // Fetch user details from localStorage
    const user = JSON.parse(localStorage.getItem('user'))[0];

    // Check if the user is logged in
    if (!user) {
        // If not logged in, redirect to the sign-in page
        window.location.href = 'signin.html';
        return;
    }

    // Populate user details
    populateUserDetails(user);

    try {
        // Fetch past orders for the user
        const ordersData = await getCustomerOrders(user.user_id);
        // Populate past orders
        populatePastOrders(ordersData);
    } catch (error) {
        console.error('Error fetching past orders:', error);
        // Handle the error, e.g., display a message to the user
    }
});

function populateUserDetails(user) {
    const userDetailsContainer = document.querySelector('.user-details');

    const heading = createHeading('User Details');

    const name = createParagraph(`Name: ${user.firstname} ${user.lastname}`);
    const email = createParagraph(`Email: ${user.email}`);

    appendChildren(userDetailsContainer, [heading, name, email]);
}

async function getCustomerOrders(customerId) {
    try {
        const response = await fetch('http://localhost:3000/order/getcustomerorders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ customerId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.orders || [];
    } catch (error) {
        throw error;
    }
}

function populatePastOrders(ordersData) {
    const pastOrdersContainer = document.querySelector('.past-orders');

    const heading = createHeading('Past Orders');
    const ordersList = createOrdersList(ordersData);

    appendChildren(pastOrdersContainer, [heading, ordersList]);
}

function createOrdersList(ordersData) {
    const ordersList = document.createElement('div');
    ordersList.classList.add('orders-list');

    ordersData.forEach(order => {
        const orderItem = createOrderItem(order);
        ordersList.appendChild(orderItem);
    });

    return ordersList;
}

function createOrderItem(order) {
    const orderItem = document.createElement('div');
    orderItem.classList.add('order-item');

    const orderDetails = createOrderDetails(order);
    orderItem.appendChild(orderDetails);

    return orderItem;
}

function createOrderDetails(order) {
    const orderDetails = document.createElement('div');
    orderDetails.classList.add('order-details');

    const orderId = createParagraph(`Order ID: ${order.order_id}`);
    const status = createParagraph(`Status: ${order.order_status}`);
    const date = createParagraph(`Date: ${order.date_creation}`);
    const confirmation = createParagraph(`Confirmation Code: ${order.confirmation_number}`);
    const productList = createProductList(order.order_details);

    appendChildren(orderDetails, [orderId, status, date, confirmation, productList]);

    return orderDetails;
}

function createProductList(orderDetails) {
    const productList = document.createElement('ul');
    productList.classList.add('product-list');

    orderDetails.forEach(item => {
        const productItem = document.createElement('li');
        productItem.innerText = `Product ID: ${item.product_id}, Quantity: ${item.quantity}`;
        productList.appendChild(productItem);
    });

    return productList;
}

function getAuthToken() {
    return localStorage.getItem('token');
}

function createHeading(text) {
    const heading = document.createElement('h2');
    heading.innerText = text;
    return heading;
}

function createParagraph(text) {
    const paragraph = document.createElement('p');
    paragraph.innerText = text;
    return paragraph;
}

function appendChildren(parent, children) {
    children.forEach(child => parent.appendChild(child));
}
