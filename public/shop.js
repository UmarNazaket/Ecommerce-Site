"use strict";

document.addEventListener('DOMContentLoaded', function () {
    // Function to get the current date
    function getCurrentDate() {
        const currentDate = new Date();
        return currentDate.toDateString();
    }

    // Function to fetch the authentication token from localStorage
    function getAuthToken() {
        return localStorage.getItem('token');
    }

    // Function to populate product cards
    function populateProductCards(products) {
        const productCardsContainer = document.getElementById('product-cards');

        products.forEach(product => {
            const productCard = createProductCard(product);
            productCardsContainer.appendChild(productCard);
        });
    }

    // Function to create a product card
    function createProductCard(product) {
        product.imgs_links = JSON.parse(product.imgs_links)
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const productImage = createImage(product);
        const productName = createHeading('h3', product.name);
        const productDescription = createParagraph(product.description);
        const productPrice = createSpan(`$${product.price.toFixed(2)}`);

        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productDescription);
        productCard.appendChild(productPrice);

        // Add click event listener to the product card
        productCard.addEventListener('click', () => handleProductCardClick(product));

        return productCard;
    }

    // Function to create an image element
    function createImage(product) {
        const productImage = document.createElement('img');
        productImage.src = product.imgs_links[0];
        productImage.alt = product.name;
        return productImage;
    }

    // Function to create a heading element
    function createHeading(tag, text) {
        const heading = document.createElement(tag);
        heading.innerText = text;
        return heading;
    }

    // Function to create a paragraph element
    function createParagraph(text) {
        const paragraph = document.createElement('p');
        paragraph.innerText = text;
        return paragraph;
    }

    // Function to create a span element
    function createSpan(text) {
        const span = document.createElement('span');
        span.innerText = text;
        return span;
    }

    // Function to handle click on a product card
    function handleProductCardClick(product) {
        // Store the selected product details in localStorage
        localStorage.setItem('selectedProduct', JSON.stringify(product));

        // Redirect to the product details page
        window.location.href = '../public/product.html';
    }

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', handleSearch);

    // Function to handle search input
    function handleSearch() {
        const searchTerm = searchInput.value.trim();

        // Fetch filtered products from the /filterproduct API
        fetch(`http://localhost:3000/products/filterproduct?search=${searchTerm}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        })
            .then(response => response.json())
            .then(data => {
                // Clear existing product cards
                clearProductCards();

                // Populate new product cards based on the search results
                populateProductCards(data.products);
            })
            .catch(error => console.error('Error fetching filtered products:', error));
    }

    // Function to clear existing product cards
    function clearProductCards() {
        const productCardsContainer = document.getElementById('product-cards');
        productCardsContainer.innerHTML = '';
    }

    // Populate current date in the heading
    document.getElementById('current-date').innerText = getCurrentDate();

    // Fetch products from the /getproducts API
    fetch('http://localhost:3000/products/getproducts', {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
        .then(response => response.json())
        .then(data => populateProductCards(data.products))
        .catch(error => console.error('Error fetching products:', error));
});
