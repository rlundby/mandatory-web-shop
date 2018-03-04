// Creating the UI, letting us toggle between shopping and paying
const ui = {
    errorTesting: document.getElementById("error-testing"),
};

// Current Products Section - divided into category
const electronicProducts = [
    {
        productName: "Apple iPhone X - 256GB Silver",
        price: "8.590",
        description: "5,8 QHD-screen. 12x2/7MP camera",
        img: "https://www.komplett.se/img/p/800/a21b080d-bed4-3803-e860-bbb67c477ceb.jpg",
        id: "123",
        quantity: 1
    },
    {
        productName: "Intel Core i7-8700K Processor",
        price: "4.200",
        description: "Socket-LGA1151, 6-Core, 12-Thread",
        img: "https://www.komplett.se/img/p/1200/ed24940c-de1e-48be-a1f3-f03ff98f24fd.jpg",
        id: "1234",
        quantity: 1
    },
    {
        productName: "Phanteks Eclipse P400",
        price: "899",
        description: "Window - Satin Black",
        img: "https://www.komplett.se/img/p/800/2f2e5a12-4c90-0122-8d45-6d20b8a29e87.jpg",
        id: "12345",
        quantity: 1
    }
];

const perfumeProducts = [
    {
        productName: "Cristiano Ronaldo Legacy",
        price: "699",
        description: "EDT 50ml ",
        img: "https://www.komplett.se/img/p/1200/7bc98d28-97a1-6109-ea21-8a1acd698e7a.jpg",
        id: "abc",
        quantity: 1
    },
    {
        productName: "Voluspa Prosecco Rose",
        price: "249",
        description: "Tin candle 127 g ",
        img: "https://www.komplett.se/img/p/1200/ec83dd5d-12f5-1ab3-1bac-0f747d9efa65.jpg",
        id: "abcd",
        quantity: 1
    },
    {
        productName: "Bruno Banani Pure Man EDT",
        price: "456",
        description: "50ml ",
        img: "https://www.komplett.se/img/p/1200/8db23380-6b3e-4e3f-be77-9d42ada40088.jpg",
        id: "abcde",
        quantity: 1
    },
];

// Product reviews
var productReviews = [
    {
        title: "This phone works great!",
        name: "Steve Jobs",
        rating: "5",
        review: "I really love this phone! It's probably the most expensive iPhone yet, which is great for company revenue",
        id: "123"
    }
]

const allProducts = electronicProducts.concat(perfumeProducts);
const checkoutTable = document.getElementById("checkout-table");
var latestClickedProduct;


// Change how the app looks depending on what is clicked
$("body").on("click", function (e) {

    if (e.target.id === "pay") {
        $("#checkout-mode").css("display", "block");
        $("#shop-mode").hide();
        $("#show-a-product").hide();
        showProductsOnCheckout();
    }
    else if (e.target.id === "shop") {
        $("#shop-mode").css("display", "block");
        $("#checkout-mode").hide();
        $("#show-a-product").hide();

        checkoutTable.innerHTML = `
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
        </tr>
    `;
    }
});

// Render Single Product View
$(".category").on("click", ".product a", e => {
    $("#show-a-product").css("display", "block");
    $("#checkout-mode").hide();
    $("#shop-mode").hide();

    // Write product clicked!

    let itemID = e.currentTarget.parentNode.getAttribute("id");
    let clickedItem = allProducts.find(function (e) {
        return e.id === itemID;
    })

    // Change HTML
    $("#single-product-view").empty();
    $("#single-product-view").html(
        `<div>
            <h1>${clickedItem.productName}</h1>
            <img src="${clickedItem.img}">
            <p class="product-desc">${clickedItem.description}</p>
        </div>
        <div class="well singleprice"> <p class="product-price">${clickedItem.price}:-</p>
            <button class="btn btn-success purchase-button">Add to cart</button>  
        </div>
        `
    );

    showReviews(itemID);
    latestClickedProduct = itemID;
});

function showReviews(itemID) {
    $("#all-reviews").empty();
    let allReviews = productReviews.filter((e) => (e.id === itemID));

    for (let review of allReviews) {

        let $rating = $("<p></p>")

        for (let i = 0; i < 5; i++) {
            let className;
            if (i < review.rating) {
                className = "glyphicon glyphicon-star"
            } else {
                className = "glyphicon glyphicon-star-empty"
            }
            $rating.append($("<span></span>").addClass(className));
        }

        $("#all-reviews").append($("<div></div>").addClass("well").append($rating).append(
            `   <h3>${review.title}</h3>
                <p>"${review.review}"</p>
                <h4>-${review.name}</h4>
            `
        ));
    }
}

// Add new Reviews

$(`#submit-review-button`).on("click", () => addNewReview(latestClickedProduct));

function addNewReview(itemID) {
    productReviews.push({
        title: $('input[name=reviewTitle]').val(),
        name: $('input[name=reviewName]').val(),
        rating: $('#rating').val(),
        review: $('#reviewText').val(),
        id: itemID,
    });
    showReviews(itemID);
    $('input[name=reviewTitle]').val(""),
        $('input[name=reviewName]').val(""),
        $('#reviewText').val("")
}



function loadProducts(category, list) {
    let $currentCategory = $(`#${category}`);
    $currentCategory.addClass(category);
    for (var i = 0; i < list.length; i++) {
        $currentCategory.append($("<div></div>").addClass("product").attr('id', list[i].id).html(`
          <a>
          <img src=${list[i].img}>
          <h3>${list[i].productName}</h3>    
          <p>${list[i].description}</p>
          <p class="product-price">${list[i].price}:-</p>
          </a>
          <button class="btn btn-success purchase-button">Add to cart</button>
          `));
    }
    ;
};

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

    var clickedItem = allProducts.find(function (e) {
        return e.id === productId;
    })
    var found = itemsInCart.some(function (el) {
        return el.id === clickedItem.id;
    });

    if (itemsInCart.length == 0) {
        itemsInCart.push(clickedItem);
    } else {
        if (!found) {
            itemsInCart.push(clickedItem);
        } else {
            clickedItem.quantity++;
        }
    }

    totalProducts();
    totalCost();
}

// Count the total amount of products added
function totalProducts() {
    let totalItemsInCart = 0;
    for (let i = 0; i < itemsInCart.length; i++) {
        totalItemsInCart += itemsInCart[i].quantity
    }
    $("#counter").text(`${totalItemsInCart}`);
}

// Count the total cost of products added
function totalCost() {
    let totalCostText = document.getElementById("total");
    let totalPrice = 0;
    for (i in itemsInCart) {
        let price = itemsInCart[i].price;
        let removeSymbols = parseInt(price.replace(/[^0-9]/g, ''));
        let quantityPrice = removeSymbols * itemsInCart[i].quantity;
        totalPrice = totalPrice + quantityPrice;
        $("#total").html(`Total Price: <span id="totalPrice">${totalPrice}:-</span>`);
    }
};

function showProductsOnCheckout() {
    for (var i = checkoutTable.rows.length - 1; i > 0; i--) {
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
            quantity.appendChild(increaseButton);

            var decreaseButton = document.createElement("button");
            decreaseButton.innerText = "-"
            decreaseButton.classList.add("decBtn")
            quantity.appendChild(decreaseButton);

        }
    }
};

// Increase and decrease buttons
$("#checkout-table").on("click", e => {
    let getID = e.target.parentNode.parentNode;
    let productId = getID.getAttribute("id");
    let result = itemsInCart.find(function (e) {
        return e.id === productId;
    })

    if (e.target.classList.contains("incBtn")) {
        result.quantity++;
        showProductsOnCheckout();
    } else if (e.target.classList.contains("decBtn")) {
        if (result.quantity > 1) {
            result.quantity--;
            showProductsOnCheckout()
        } else {
            result.quantity = 0;
            getID.parentNode.removeChild(getID)
        }
    }
    totalProducts();
    totalCost();
});

loadProducts("electronics", electronicProducts);
loadProducts("perfume", perfumeProducts);








