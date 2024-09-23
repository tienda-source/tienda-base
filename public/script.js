// public/script.js

// Fetch products from the server
async function fetchProducts() {
    const response = await fetch('/products.json');
    const products = await response.json();
    return products;
  }
  
  // Display products on the landing page
  async function displayProducts() {
    const products = await fetchProducts();
    const productsContainer = document.getElementById('products');
  
    if (productsContainer) {
      products.forEach(product => {
        const productTile = document.createElement('div');
        productTile.className = 'product-tile';
  
        productTile.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>$${(product.price / 100).toFixed(2)}</p>
          <a href="/product/${product.id}">View Details</a>
        `;
  
        productsContainer.appendChild(productTile);
      });
    }
  }
  
  // Display product details on the product page
  async function displayProductDetails() {
    const products = await fetchProducts();
    const productId = window.location.pathname.split('/').pop();
    const product = products.find(p => p.id === productId);
    const productDetailsContainer = document.getElementById('product-details');
  
    if (productDetailsContainer && product) {
      productDetailsContainer.innerHTML = `
      <div class="product-detail">
      <img src="${product.image}" alt="${product.name}">
      <h1>${product.name}</h1>
      <p>$${(product.price / 100).toFixed(2)}</p>
      <p>${product.description}</p>
      <button id="checkout-button">Buy Now</button>
    </div>
  `;
  
      const checkoutButton = document.getElementById('checkout-button');
      checkoutButton.addEventListener('click', () => {
        createCheckoutSession(product.priceId);
      });
    }
  }
  
  // Create a Stripe Checkout session
  async function createCheckoutSession(priceId) {
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ priceId })
    });
  
    const { url } = await response.json();
    window.location = url;
  }
  
  // Initialize the page
  if (window.location.pathname === '/') {
    displayProducts();
  } else if (window.location.pathname.startsWith('/product')) {
    displayProductDetails();
  }
  