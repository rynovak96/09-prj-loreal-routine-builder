/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  return data.products;
}

/* Store selected products */
const selectedProducts = [];
/* Reference to list area */
const selectedProductsList = document.getElementById("selectedProductsList");

/* Helper: update selected products display */
function updateSelectedProductsList() {
  // Create a small label for each selected product
  selectedProductsList.innerHTML = selectedProducts
    .map((p) => `<div class="selected-chip">${p.name}</div>`)
    .join("");
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card" data-name="${product.name}">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
      </div>
    </div>
  `
    )
    .join("");

  /* Add click handlers to toggle selection */
  const cards = productsContainer.querySelectorAll(".product-card");
  cards.forEach((card) => {
    const name = card.getAttribute("data-name");
    /* If already selected (from previous category), mark it */
    if (selectedProducts.some((p) => p.name === name)) {
      card.classList.add("selected");
    }
    card.addEventListener("click", () => {
      // Toggle select / deselect by checking if product already in array
      const productObj = products.find((p) => p.name === name);
      const idx = selectedProducts.findIndex((p) => p.name === name);
      if (idx >= 0) {
        selectedProducts.splice(idx, 1);
        card.classList.remove("selected");
      } else {
        selectedProducts.push(productObj);
        card.classList.add("selected");
      }
      updateSelectedProductsList();
    });
  });
}

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  const products = await loadProducts();
  const selectedCategory = e.target.value;

  /* filter() creates a new array containing only products 
     where the category matches what the user selected */
  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  displayProducts(filteredProducts);
});

/* Chat form submission handler - placeholder for OpenAI integration */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});
