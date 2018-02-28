
// Creating the UI, letting us toggle between shopping and paying
const ui = {
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
        $("#checkout-mode").css("display", "none");
        $("#shop-mode").css("display", "block");
    } else {
        $("#shop-mode").css("display", "none");
        $("#checkout-mode").css("display", "block");
    }
}

$("#pay").on("click", e => {
    paying = true;
    swapScreens();
    showProductsOnCheckout();
});

$("#shop").on("click", e => {
    paying = false;
    swapScreens();
    checkoutTable.innerHTML = `
    <tr><th>Product</th><th>Price</th><th>Quantity</th></tr>
    `;
});

const allProducts = electronicProducts.concat(perfumeProducts);

function loadProducts (category,list) {
    let $currentCategory = $(`#${category}`);
    $currentCategory.addClass(category);
    for (var i = 0; i < list.length; i++) {
        $currentCategory.append($("<a></a>").addClass("product").attr('id', list[i].id).html(`
          <img src=${list[i].img}>
          <h3>${list[i].productName}</h3>    
          <p>${list[i].description}</p>
          <p class="product-price">${list[i].price}:-</p>
          <button class="btn btn-success purchase-button">Add to cart</button>
          `));
    };
};

loadProducts("electronics", electronicProducts);
loadProducts("perfume", perfumeProducts);

// Keep track on which item people buy
var itemsInCart = [];
const $purchaseButtons = $(".purchase-button")


$(".purchase-button").on("click", e => {
    addToCart(e);
    totalProducts();
    totalCost();
});


function addToCart(e) {
    let thisItem = e.currentTarget;
    let parentDiv = thisItem.parentNode;
    let productId = parentDiv.getAttribute("id");
    // Find item I clicked buy on
    var clickedItem = allProducts.find(function(e) {
        return e.id === productId; })
    var found = itemsInCart.some(function (el) {
        return el.id === clickedItem.id;
    });

    if (itemsInCart.length == 0) {
        itemsInCart.push(clickedItem);
    } else {
        if (!found) {
            itemsInCart.push(clickedItem);
        } else {
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
    let totalItemsInCart = 0;
    for (let i = 0; i < itemsInCart.length; i++ ) {
        totalItemsInCart += itemsInCart[i].quantity
    }
    $("#counter").text(`${totalItemsInCart}`);
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
        $("#total").html(`Total Price: <span id="totalPrice">${totalPrice}:-</span>`);
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
            quantity.innerHTML = `${quantityCart}`;
            var increaseButton = document.createElement("button");
            increaseButton.classList.add("incBtn")
            increaseButton.innerText = "+"
            var decreaseButton = document.createElement("button");
            decreaseButton.innerText = "-"
            decreaseButton.classList.add("decBtn")
            quantity.appendChild(increaseButton);
            quantity.appendChild(decreaseButton);

        }
    }
};


// Increase and decrease buttons
$("#checkout-table").on("click", e => {

    if(e.target.classList.contains("incBtn")){
        let getID = e.target.parentNode.parentNode;
        let productId = getID.getAttribute("id");

        let result = itemsInCart.find(function(e) {
            return e.id === productId;
        })
        result.quantity ++;
        showProductsOnCheckout();

    } else if (e.target.classList.contains("decBtn")){
        let getID = e.target.parentNode.parentNode;
        let productId = getID.getAttribute("id");
        var p = e.target.parentNode.parentNode;

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

    };

    totalProducts();
    totalCost();
});





