// Creating the UI, letting us toggle between shopping and paying
const ui = {
    shopBtn: document.getElementById("shop"),
    payBtn: document.getElementById("pay"),
    shopWindow: document.getElementById("shop-mode"),
    buyWindow: document.getElementById("checkout-mode"),
    errorTesting: document.getElementById("error-testing"),
};

// Current Products Section - divided into category
const electronicProducts = [
    {   productName: "Apple iPhone X - 256GB Silver",
        price: "8.590",
        description: "5,8 QHD-screen. 12x2/7MP camera",
        img: "https://www.komplett.se/img/p/800/a21b080d-bed4-3803-e860-bbb67c477ceb.jpg",
        id: "123",
        quantity: 1},
    {   productName: "Intel Core i7-8700K Processor",
        price: "4.200",
        description: "Socket-LGA1151, 6-Core, 12-Thread",
        img: "https://www.komplett.se/img/p/1200/ed24940c-de1e-48be-a1f3-f03ff98f24fd.jpg",
        id: "1234",
        quantity: 1},
    {   productName: "Phanteks Eclipse P400",
        price: "899",
        description: "Window - Satin Black",
        img: "https://www.komplett.se/img/p/800/2f2e5a12-4c90-0122-8d45-6d20b8a29e87.jpg",
        id: "12345",
        quantity: 1}
];

const perfumeProducts = [
    {   productName: "Cristiano Ronaldo Legacy",
        price: "699",
        description: "EDT 50ml ",
        img: "https://www.komplett.se/img/p/1200/7bc98d28-97a1-6109-ea21-8a1acd698e7a.jpg",
        id: "abc",
        quantity: 1},
    {   productName: "Voluspa Prosecco Rose",
        price: "249",
        description: "Tin candle 127 g ",
        img: "https://www.komplett.se/img/p/1200/ec83dd5d-12f5-1ab3-1bac-0f747d9efa65.jpg",
        id: "abcd",
        quantity: 1},
    {   productName: "Bruno Banani Pure Man EDT",
        price: "456",
        description: "50ml ",
        img: "https://www.komplett.se/img/p/1200/8db23380-6b3e-4e3f-be77-9d42ada40088.jpg",
        id: "abcde",
        quantity: 1},
];

// Hide Showing
var paying = false;

swapScreens();

function swapScreens() {
    if (paying === false) {
        ui.buyWindow.style.display = "none";
        ui.shopWindow.style.display = "block";
    } else {
        ui.shopWindow.style.display ="none";
        ui.buyWindow.style.display = "block";
    }
}

ui.payBtn.addEventListener("click", e => {
    paying = true;
    swapScreens();
    showProductsOnCheckout();
});

ui.shopBtn.addEventListener("click", e => {
    paying = false;
    swapScreens();
    checkoutTable.innerHTML = `
    <tr><th>Product</th><th>Price</th><th>Quantity</th></tr>
    `;
});




const allProducts = electronicProducts.concat(perfumeProducts);

function loadProducts (category,list) {
    let currentCategory = document.getElementById(`${category}`);
    currentCategory.className = category;
    for (var i = 0; i < list.length; i++) {
        let product = document.createElement("a");
        product.className = "product";
        product.id = list[i].id;
        currentCategory.appendChild(product);
        product.innerHTML = `
          <img src=${list[i].img}>
          <h3>${list[i].productName}</h3>    
          <p>${list[i].description}</p>
          <p class="product-price">${list[i].price}:-</p>
          <button class="btn btn-success purchase-button">Add to cart</button>
          `
    };
};


loadProducts("electronics", electronicProducts);
loadProducts("perfume", perfumeProducts);

// Keep track on which item people buy
var itemsInCart = [];
const purchaseButtons = document.querySelectorAll(".purchase-button");
purchaseButtons.forEach(button => button.addEventListener("click", addToCart));


function addToCart(e) {
    var parentDiv = this.parentNode;
    var productId = parentDiv.getAttribute("id");
    // Find item I clicked buy on
    var clickedItem = allProducts.find(function(e) {
        return e.id === productId; })
    var found = itemsInCart.some(function (el) {
        return el.id === clickedItem.id;
    });

    if (itemsInCart.length == 0) {
        console.log("First item!");
        itemsInCart.push(clickedItem);
    } else {
        if (!found) {
            console.log("du har ej klickat på denna förtut")
            itemsInCart.push(clickedItem);
        } else {
            console.log("du har klickat på den här förut")
            clickedItem.quantity ++;

        }
    }
    //Update total amount of products:
    totalProducts();
    //Update the total price:
    totalCost();
}

// Count the total amount of products added
function totalProducts () {
    // Update total
    let totalItemsInCartText = document.getElementById("counter");
    let totalItemsInCart = 0;
    for (let i = 0; i < itemsInCart.length; i++ ) {
        totalItemsInCart += itemsInCart[i].quantity
    }
    totalItemsInCartText.innerText = `${totalItemsInCart}`
}

// Count the total cost of products added
function totalCost () {
    let totalCostText = document.getElementById("total");
    let totalPrice = 0;
    for (i in itemsInCart) {
        let price = itemsInCart[i].price;
        let removeSymbols = parseInt(price.replace(/[^0-9]/g, ''));
        let quantityPrice =  removeSymbols * itemsInCart[i].quantity;
        totalPrice = totalPrice + quantityPrice;
        totalCostText.innerHTML = `Total Price: <span id="totalPrice">${totalPrice}:-</span>`;
    }
};


const checkoutTable = document.getElementById("checkout-table");
function showProductsOnCheckout() {
    for(var i = checkoutTable.rows.length - 1; i > 0; i--)
    {
        checkoutTable.deleteRow(i);
    }
    // Prints all products on checkout
    for (i = 0; i < itemsInCart.length; i++) {
        if (itemsInCart[i].quantity != 0) {
            var quantityCart = itemsInCart[i].quantity;
            var row = checkoutTable.insertRow(1);
            row.id = itemsInCart[i].id;
            var name = row.insertCell(0);
            var price = row.insertCell(1);
            var quantity = row.insertCell(2);
            name.innerHTML = itemsInCart[i].productName;
            price.innerHTML = `${itemsInCart[i].price}:-`;
            // quantity.innerHTML = `<div></div>
            // <input id="number${[i]}" class="test" type="number" value="${itemsInCart[i].quantity}" min="0">`;
            quantity.innerHTML = `${quantityCart}`;
            var increaseButton = document.createElement("button");
            increaseButton.innerText = "+"
            var decreaseButton = document.createElement("button");
            decreaseButton.innerText = "-"
            quantity.appendChild(increaseButton);
            quantity.appendChild(decreaseButton);

            increaseButton.addEventListener("click", increase);
            decreaseButton.addEventListener("click", decrease);
        }
    }
};


function increase() {
    let oneUp = this.parentNode;
    let getID = oneUp.parentNode;
    console.log(getID);
    let productId = getID.getAttribute("id");


    let result = itemsInCart.find(function(e) {
        return e.id === productId;
    })

    result.quantity ++;
    showProductsOnCheckout();
    totalProducts();
    totalCost();
}

function decrease() {
    let oneUp = this.parentNode;
    let getID = oneUp.parentNode;
    console.log(getID);
    let productId = getID.getAttribute("id");
    var p = this.parentNode.parentNode;

    let result = itemsInCart.find(function(e) {
        return e.id === productId;
    })

    if (result.quantity > 1) {
        result.quantity --;
        showProductsOnCheckout()
    } else {
        result.quantity = 0;
        p.parentNode.removeChild(p)
    }

    totalProducts();
    totalCost();
}







