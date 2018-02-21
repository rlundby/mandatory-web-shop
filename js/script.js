// Creating the UI, letting us toggle between shopping and paying

const ui = {
    shopBtn: document.getElementById("shop"),
    payBtn: document.getElementById("pay"),
    shopWindow: document.getElementById("shop-mode"),
    buyWindow: document.getElementById("checkout-mode"),
    errorTesting: document.getElementById("error-testing"),
};

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
    var removedDupes = compressArray(itemsInCart);
    console.log(removedDupes);
    createCart(removedDupes);
    totalCostUpdate ();
});

ui.shopBtn.addEventListener("click", e => {
    paying = false;
    swapScreens();
    checkoutTable.innerHTML = `
    <tr><th>Product</th><th>Price</th><th>Quantity</th></tr>
    `;
});


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
var noDupesPlease = [];
const purchaseButtons = document.querySelectorAll(".purchase-button");
purchaseButtons.forEach(button => button.addEventListener("click", addToCart));


function addToCart(e) {
    var parentDiv = this.parentNode;
    var productId = parentDiv.getAttribute("id");
    // Get the object pressed
    var result = allProducts.find(function(e) {
        return e.id === productId;
    })
    itemsInCart.push(result);
    productsInBasketCounter();
}

function compressArray(original) {

    var compressed = [];
    var copy = original.slice(0);

    for (var i = 0; i < original.length; i++) {

        var myCount = 0;
        for (var w = 0; w < copy.length; w++) {
            if (original[i] == copy[w]) {
                myCount++;
                delete copy[w];
            }
        }
        if (myCount > 0) {
            var a = new Object();
            a = original[i];
            a.quantity = myCount;
            compressed.push(a);
        }
    }
    return compressed;
};

const checkoutTable = document.getElementById("checkout-table");


function createCart(list) {
    for ( i = 0; i < list.length; i++) {
        var row = checkoutTable.insertRow(1);
        row.id = list[i].id;
        var name = row.insertCell(0);
        var price =  row.insertCell(1);
        var quantity = row.insertCell(2);
        name.innerHTML = list[i].productName;
        price.innerHTML = `${list[i].price}:-`;
        quantity.innerHTML = `<button class="btn btn-xs" id="increase-quantity">+</button>${list[i].quantity}<button id="decrease-quantity" class="btn btn-xs">-</button>`;
    }
};


function totalCostUpdate () {
    let totalCostText = document.getElementById("total");
    let totalPrice = 0;
    for (i in itemsInCart) {
        let price = itemsInCart[i].price;
        var numberPrice = parseInt(price.replace(/[^0-9]/g, ''));
        totalPrice = totalPrice + numberPrice;
        totalCostText.innerHTML = `Total Price: <span id="totalPrice">${totalPrice}:-</span>`;
    }
};

function productsInBasketCounter(){
    let totalProducts = itemsInCart.length;
    let counter = document.getElementById("counter");
    counter.innerText = totalProducts;
};




//Check if form is empty on submit

const buyForm = document.getElementById("buyform");

let inputs = Array.from(document.getElementsByTagName("input"));
inputs.splice(3,1);
inputs.splice(5,1);

let zipCode = document.buyform.zipcode;


buyForm.addEventListener("submit", e => {
    e.preventDefault();
    IsValidZipCode(zipCode.value);


// Input validation
    for (var i in inputs){
        if (inputs[i].value === "") {
            ui.errorTesting.innerHTML = `<p>Please fill in the required fields *</p>` ;
            inputs[i].focus();
            inputs[i].style.borderColor = "red";
            setTimeout(function () {
                inputs[i].style.borderColor = "";
            }, 500);
            return false;

        } else {
            ui.errorTesting.innerHTML = "";
        }
    }

//Phone number validation
    var phoneNmbr = document.buyform.number;
    var allowedSymbols = /^\d{10}$/;

    if(phoneNmbr.value.match(allowedSymbols) || phoneNmbr.value === "") {
        ui.errorTesting.innerHTML = "";
        return false;

    }
    else {
        ui.errorTesting.innerHTML = `<p>Please fill in a valid phone number *</p>` ;
        phoneNmbr.focus();
        phoneNmbr.style.borderColor = "red";
        setTimeout(function () {
            phoneNmbr.style.borderColor = "";
        }, 500);
        return false;
    }

    function IsValidZipCode(zip) {
        var isValid = /^\d{5}$/.test(zip);
        var wrongNumber = document.getElementById("not-a-number");
        if (isValid){
            wrongNumber.innerHTML = "";
            return true;
        } else {
            wrongNumber.innerHTML = `<p>Please fill in a valid zip code *</p>` ;
            zipCode.style.borderColor = "red";
            setTimeout(function () {
                zipCode.style.borderColor = "";
            }, 500);
        }
    }


});








