# Tienda App Comprehensive Documentation

**Welcome to Tienda!**

Tienda is an ultra-simple, free, and minimalistic e-commerce platform designed to help small (micro) business owners launch a web store effortlessly. It aims to lower the barrier to entry into e-commerce by providing a straightforward, easy-to-use application with minimal setup.

This documentation provides all the necessary context and details about the Tienda app, including its structure, code, and instructions. You can use this guide as a reference and share it with GPT-4 to get assistance in modifying the app or fixing any issues.

---

## **Table of Contents**

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [File Structure](#file-structure)
4. [Setup and Installation](#setup-and-installation)
5. [Detailed Code Explanation](#detailed-code-explanation)
   - [package.json](#packagejson)
   - [server.js](#serverjs)
   - [products.json](#productsjson)
   - [public/index.html](#publicindexhtml)
   - [public/product.html](#publicproducthtml)
   - [public/styles.css](#publicstylescss)
   - [public/script.js](#publicscriptjs)
   - [public/success.html](#publicsuccesshtml)
   - [public/cancel.html](#publiccancelhtml)
6. [Adding New Products](#adding-new-products)
7. [Customizing the App](#customizing-the-app)
8. [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)
9. [AI Assistance with GPT-4](#ai-assistance-with-gpt-4)
10. [Conclusion](#conclusion)

---

## **Project Overview**

**Tienda** is a minimal e-commerce application that consists of:

- **Landing Page**: Displays product tiles with images, names, and prices.
- **Product Detail Page**: Shows detailed information about a selected product and includes a "Buy Now" button.
- **Payment Processing**: Integrates with Stripe Checkout for secure payments.

**Features:**

- Simple setup with minimal dependencies.
- Easy customization for non-technical users.
- No database required; uses a JSON file for product data.
- AI-optimized structure to allow for assistance via GPT-4.

---

## **Tech Stack**

- **Frontend**:
  - HTML5
  - CSS3
  - Vanilla JavaScript

- **Backend**:
  - Node.js
  - Express.js

- **Payment Processing**:
  - Stripe Checkout

---

## **File Structure**

```
tienda/
├── package.json
├── server.js
├── products.json
├── public/
│   ├── index.html
│   ├── product.html
│   ├── success.html
│   ├── cancel.html
│   ├── styles.css
│   ├── script.js
│   └── images/
│       ├── product1.jpg
│       ├── product2.jpg
│       └── ...
└── README.md
```

---

## **Setup and Installation**

### **Prerequisites**

- Node.js and npm installed on your machine.
- A Stripe account with API keys.

### **Steps**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/tienda.git
   cd tienda
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   - Create a `.env` file in the root directory.
   - Add your Stripe secret key:

     ```
     STRIPE_SECRET_KEY=your_stripe_secret_key
     ```

4. **Run the Application**

   ```bash
   node server.js
   ```

5. **Access the App**

   - Open your browser and navigate to `http://localhost:3000`.

---

## **Detailed Code Explanation**

### **package.json**

Contains project metadata and dependencies.

```json
{
  "name": "tienda",
  "version": "1.0.0",
  "description": "An ultra-simple e-commerce platform.",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "body-parser": "^1.19.0",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "stripe": "^11.2.0"
  }
}
```

**Key Points:**

- **Dependencies**:
  - `express`: Web framework for Node.js.
  - `stripe`: Stripe Node.js library.
  - `body-parser`: Middleware for parsing incoming request bodies.
  - `dotenv`: Loads environment variables from a `.env` file.

---

### **server.js**

Sets up the Express.js server and handles backend logic.

```javascript
// server.js

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve product detail page
app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

// Serve products.json
app.get('/products.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'products.json'));
});

// Endpoint to create Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

**Key Points:**

- **Stripe Initialization**: Uses `dotenv` to securely load the Stripe secret key.
- **Routes**:
  - `/`: Serves the landing page.
  - `/product/:id`: Serves the product detail page.
  - `/products.json`: Serves the product data.
  - `/create-checkout-session`: Handles Stripe Checkout session creation.
- **Middleware**:
  - `body-parser`: Parses JSON request bodies.
  - `express.static('public')`: Serves static files from the `public` directory.

---

### **products.json**

Stores product data in JSON format.

```json
[
  {
    "id": "prod_1",
    "name": "Product 1",
    "description": "This is the description for Product 1.",
    "price": 1999,
    "priceId": "price_1A2B3C4D5E",
    "image": "/images/product1.jpg"
  },
  {
    "id": "prod_2",
    "name": "Product 2",
    "description": "This is the description for Product 2.",
    "price": 2999,
    "priceId": "price_6F7G8H9I0J",
    "image": "/images/product2.jpg"
  }
]
```

**Key Points:**

- **Fields**:
  - `id`: Unique identifier for the product.
  - `name`: Product name.
  - `description`: Product description.
  - `price`: Price in cents (e.g., 1999 = $19.99).
  - `priceId`: Corresponds to the Price ID from Stripe.
  - `image`: Path to the product image.

---

### **public/index.html**

Landing page displaying product tiles.

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tienda - Home</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h1>Welcome to Tienda</h1>
  <div id="products" class="product-grid"></div>
  <script src="/script.js"></script>
</body>
</html>
```

**Key Points:**

- **Container**: `<div id="products" class="product-grid"></div>` where product tiles will be injected.
- **Script**: References `/script.js` for dynamic content.

---

### **public/product.html**

Product detail page showing detailed information.

```html
<!-- public/product.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Product Details</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div id="product-details"></div>
  <script src="/script.js"></script>
</body>
</html>
```

**Key Points:**

- **Container**: `<div id="product-details"></div>` where product details will be injected.
- **Script**: Uses the same `/script.js` for dynamic content.

---

### **public/styles.css**

Contains all CSS styles for the app.

```css
/* public/styles.css */

/* General Styles */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}

h1 {
  text-align: center;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}

/* Landing Page Styles */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.product-tile {
  border: 1px solid #ccc;
  margin: 10px;
  padding: 10px;
  width: 200px;
  text-align: center;
}

.product-tile img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
}

/* Product Detail Page Styles */
.product-detail {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.product-detail img {
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: cover;
  margin-bottom: 20px;
}

.product-detail h1 {
  font-size: 2em;
}

.product-detail p {
  margin: 10px 0;
}

/* Success and Cancel Page Styles */
.message {
  text-align: center;
  margin-top: 50px;
}
```

**Key Points:**

- **Responsive Design**: Uses relative units and `max-width` for responsiveness.
- **Styling Classes**:
  - `.product-grid` and `.product-tile` for the landing page.
  - `.product-detail` for the product detail page.

---

### **public/script.js**

Handles dynamic content and interactivity.

```javascript
// public/script.js

// Fetch products from the server
async function fetchProducts() {
  try {
    const response = await fetch('/products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
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

  if (productDetailsContainer) {
    if (product) {
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
    } else {
      productDetailsContainer.innerHTML = '<p>Product not found.</p>';
    }
  }
}

// Create a Stripe Checkout session
async function createCheckoutSession(priceId) {
  try {
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId })
    });

    const { url } = await response.json();
    window.location = url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
  }
}

// Initialize the page
if (window.location.pathname === '/') {
  displayProducts();
} else if (window.location.pathname.startsWith('/product/')) {
  displayProductDetails();
}
```

**Key Points:**

- **fetchProducts()**: Retrieves product data from `products.json`.
- **displayProducts()**: Renders product tiles on the landing page.
- **displayProductDetails()**: Shows product details on the product page.
- **createCheckoutSession()**: Initiates Stripe Checkout.
- **Initialization**: Determines which function to call based on the current URL.

---

### **public/success.html**

Displayed after a successful purchase.

```html
<!-- public/success.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Successful</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="message">
    <h1>Thank you for your purchase!</h1>
    <p>Your payment was successful.</p>
    <a href="/">Back to Home</a>
  </div>
</body>
</html>
```

---

### **public/cancel.html**

Displayed if the payment is canceled.

```html
<!-- public/cancel.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Canceled</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="message">
    <h1>Payment Canceled</h1>
    <p>Your payment was not completed.</p>
    <a href="/">Back to Home</a>
  </div>
</body>
</html>
```

---

## **Adding New Products**

To add a new product to your store:

1. **Update `products.json`**

   Add a new product object to the array.

   ```json
   {
     "id": "prod_3",
     "name": "Product 3",
     "description": "This is the description for Product 3.",
     "price": 2499,
     "priceId": "price_9K8L7M6N5O",
     "image": "/images/product3.jpg"
   }
   ```

   **Notes:**

   - **Create the Product in Stripe**: Log in to your Stripe Dashboard and create a new product with a corresponding price. Use the generated `priceId` in `products.json`.
   - **Add the Product Image**: Place the product image in the `public/images/` directory.

2. **Save and Test**

   - Restart the server if necessary.
   - Refresh the landing page to see the new product.

---

## **Customizing the App**

### **Styling Changes**

- **Modify `styles.css`**: Update styles or add new classes to change the appearance.
- **Responsive Design**: Use media queries to adjust styles for different screen sizes.

### **Content Updates**

- **Edit `index.html` and `product.html`**: Modify the static parts of the pages.
- **Update Product Descriptions**: Change the `description` field in `products.json`.

### **Adding New Pages**

- **Create a New HTML File**: Place it in the `public/` directory.
- **Define a New Route**: Add a route in `server.js` to serve the new page.

---

## **Common Issues and Troubleshooting**

### **1. Images Not Displaying**

- **Check Image Paths**: Ensure the `image` field in `products.json` points to the correct file in `public/images/`.
- **Verify File Names**: Ensure there are no typos and that file extensions are correct.

### **2. Styles Not Applying**

- **CSS File Not Linked**: Ensure the `<link>` tag in your HTML files points to the correct path of `styles.css`.
- **Caching Issues**: Perform a hard refresh or clear the browser cache.

### **3. Payment Errors**

- **Invalid `priceId`**: Verify that the `priceId` in `products.json` matches the one from Stripe.
- **Stripe Secret Key**: Ensure your Stripe secret key is correctly set in the `.env` file.

### **4. Server Not Starting**

- **Port In Use**: Check if another application is using the same port.
- **Syntax Errors**: Review `server.js` for any coding errors.

---

## **AI Assistance with GPT-4**

You can use GPT-4 to help modify the app or resolve issues by providing it with context from this documentation. When seeking assistance:

- **Describe Your Goal or Problem Clearly**
- **Include Relevant Code Snippets**
- **Specify the File and Location**
- **Ask Specific Questions**

**Example:**

```
I'm working on the Tienda app and want to change the layout of the product tiles to display four products per row on the landing page. Here's my current CSS for `.product-grid` and `.product-tile`:

[Include CSS code]

How can I modify the CSS to achieve this layout?
```

---

## **Conclusion**

Tienda is designed to be simple and accessible, allowing anyone to set up an e-commerce site with minimal effort. By following this documentation, you should have all the context needed to understand, customize, and troubleshoot the app.

**Happy Selling!**

---

**Note:** This documentation is intended to provide all necessary information about the Tienda app. If you need further assistance, feel free to consult additional resources or seek help from the community.