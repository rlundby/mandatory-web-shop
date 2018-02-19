// Creating the UI, letting us toggle between shopping and paying

const ui = {
shopBtn: document.getElementById("shop"),
payBtn: document.getElementById("pay"),
shopWindow: document.getElementById("shop-mode"),
buyWindow: document.getElementById("checkout-mode"),
errorTesting: document.getElementById("error-testing"),
wrongNumber: document.getElementById("not-a-number")
};

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
});

ui.shopBtn.addEventListener("click", e => {
    paying = false;
    swapScreens();
});


// Current Products Section - divided into category

const electronicProducts = [
    {   productName: "Apple iPhone X - 256GB Silver",
        price: "8.590",
        description: "5,8 QHD-screen. 12x2/7MP camera",
        img: "https://www.komplett.se/img/p/800/a21b080d-bed4-3803-e860-bbb67c477ceb.jpg"},
    {   productName: "Intel Core i7-8700K Processor",
        price: "4.200",
        description: "Socket-LGA1151, 6-Core, 12-Thread",
        img: "https://www.komplett.se/img/p/1200/ed24940c-de1e-48be-a1f3-f03ff98f24fd.jpg"},
    {   productName: "Phanteks Eclipse P400",
        price: "899",
        description: "Window - Satin Black",
        img: "https://www.komplett.se/img/p/800/2f2e5a12-4c90-0122-8d45-6d20b8a29e87.jpg"},
];

const perfumeProducts = [
    {   productName: "Cristiano Ronaldo Legacy",
        price: "699",
        description: "EDT 50ml ",
        img: "https://www.komplett.se/img/p/1200/7bc98d28-97a1-6109-ea21-8a1acd698e7a.jpg"},
    {   productName: "Voluspa Prosecco Rose",
        price: "249",
        description: "Tin candle 127 g ",
        img: "https://www.komplett.se/img/p/1200/ec83dd5d-12f5-1ab3-1bac-0f747d9efa65.jpg"},
    {   productName: "Bruno Banani Pure Man EDT",
        price: "456",
        description: "50ml ",
        img: "https://www.komplett.se/img/p/1200/8db23380-6b3e-4e3f-be77-9d42ada40088.jpg"},
];



function loadProducts (category, list) {
    let currentCategory = document.getElementById(`${category}`);
    currentCategory.className = category;
    for ( var i = 0; i < list.length; i++) {

        // Create the product div for the item
        let product = document.createElement("a");
        product.className = "product";

        // Assign it to the correct category
        currentCategory.appendChild(product);

        //Create the image of the item
        let productImage = document.createElement("img");
        product.appendChild(productImage);
        productImage.src = list[i].img;

        // Create the name text of the item
        let productName = document.createElement("h3");
        product.appendChild(productName);
        productName.innerText = `${list[i].productName}`;

        // Create the item descriptions
        let productDescr = document.createElement("p");
        product.appendChild(productDescr);
        productDescr.innerText = `${list[i].description}`;

        // Create the price of the item
        let productPrice = document.createElement("p");
        productPrice.className = "product-price";
        product.appendChild(productPrice);
        productPrice.innerText = `${list[i].price}:-`;

        // Add purchase button
        let purchaseBtn = document.createElement("button");
        purchaseBtn.innerText = "Add to cart";
        purchaseBtn.className = "btn btn-success";
        product.appendChild(purchaseBtn);
  }
};

loadProducts("electronics", electronicProducts);
loadProducts("perfume", perfumeProducts);


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
        if (isValid){
            ui.wrongNumber.innerHTML = "";
            return true;
        } else {
            ui.wrongNumber.innerHTML = `<p>Please fill in a valid zip code *</p>` ;
            zipCode.style.borderColor = "red";
            setTimeout(function () {
                zipCode.style.borderColor = "";
            }, 500);
        }
    }


});







