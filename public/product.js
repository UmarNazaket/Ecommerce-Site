"use strict";

document.addEventListener('DOMContentLoaded', function () {
  // Fetch product details from localStorage
  const productDetails = JSON.parse(localStorage.getItem('selectedProduct'));

  // Add event listener to the "Add to Cart" button
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  addToCartBtn.addEventListener('click', addToCart);

  // Populate product details on the page
  populateProductDetails(productDetails);

  // Start image slideshow
  startSlideshow(productDetails.imgs_links);
});

function populateProductDetails(productDetails) {
  const productImagesContainer = document.getElementById('product-images');
  const productNameElement = document.getElementById('product-name');
  const productDescriptionElement = document.getElementById('product-description');
  const productPriceElement = document.getElementById('product-price');
  productDetails.imgs_links = productDetails.imgs_links;

  // Populate product images
  productDetails.imgs_links.forEach(imageLink => {
    const imageElement = createImageElement(imageLink, productDetails.name);
    productImagesContainer.appendChild(imageElement);
  });

  // Populate other product details
  productNameElement.innerText = productDetails.name;
  productDescriptionElement.innerText = productDetails.description;
  productPriceElement.innerText = `Price: $${productDetails.price.toFixed(2)}`;
}

function createImageElement(imageLink, altText) {
  const imageElement = document.createElement('img');
  imageElement.src = imageLink;
  imageElement.alt = altText;
  return imageElement;
}

function addToCart() {
  const productName = document.getElementById('product-name').innerText;
  const quantity = parseInt(document.getElementById('quantity').value);

  // Fetch product details from localStorage
  const productDetails = JSON.parse(localStorage.getItem('selectedProduct'));

  // Extract the productId from productDetails
  const productId = productDetails.product_id;

  // Fetch the existing cart items from localStorage
  const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProductIndex = existingCart.findIndex(item => item.product_id === productId);

  // Create a product object to store in the cart
  const product = {
    product_id: productId,
    name: productName,
    quantity: quantity,
    img: productDetails.imgs_links,
    price: parseFloat(document.getElementById('product-price').innerText.split('$')[1]),
  };

  if (existingProductIndex !== -1) {
    existingCart[existingProductIndex].quantity = quantity;
  } else {
    // Add the new product to the cart
    existingCart.push(product);
  }

  // Store the updated cart in localStorage
  localStorage.setItem('cart', JSON.stringify(existingCart));

  alert('Product added to cart!');
  window.location.href = './cart.html';
}

function startSlideshow(images) {
  const imageContainer = document.getElementById('product-images');
  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage(imageContainer, images[currentIndex]);
  }, 3000); // Change image every 3 seconds
}

function updateImage(container, imageUrl) {
  container.innerHTML = ''; // Clear existing images
  const imageElement = createImageElement(imageUrl, 'Product Image');
  container.appendChild(imageElement);
}
