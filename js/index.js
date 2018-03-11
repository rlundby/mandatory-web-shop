let allProducts = [];

function loadProducts() {
    const noEmptyProducts = allProducts.filter(product => product.Name.length > 0);
    for (let i = 0; i < noEmptyProducts.length; i++) {
        $("#product-catalogue").append($("<div></div>").addClass("product").attr('id', noEmptyProducts[i].Id).html(`
           <a>
           <img src=${noEmptyProducts[i].Image}>
           <h3>${noEmptyProducts[i].Name}</h3>
           <p>${noEmptyProducts[i].Description}</p>
         <p class="product-price">${noEmptyProducts[i].Price}:-</p>
          </a>
          <button class="purchase-button btn btn-success ">Add to cart</button>
          `));
    }
    // Adds the functionality to the buy buttons
    $(".purchase-button").on("click", e => {
        addToCart(e);
        // totalProducts();
        // totalCost();
    });
}
let allReviews = [];

// Get products
fetch('http://demo.edument.se/api/products')
    .then(response => response.json())
    .then(function(data){
        allProducts = data;
    })
    .then(loadProducts)

// Some global variables
const checkoutTable = document.getElementById("checkout-table");
let latestClickedProduct;
let latestClickedObject;

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


function writeProduct (e) {
    let itemID = parseInt(e.currentTarget.parentNode.getAttribute("id"));
    let clickedItem = allProducts.find(function (e) {
        return e.Id === itemID;
    });
    // Change HTML
    $("#single-product-view").empty();
    $("#single-product-view").html(
        `<div>
            <h1>${clickedItem.Name}</h1>
            <img src="${clickedItem.Image}">
            <p class="product-desc">"${clickedItem.Description}"</p>
        </div>
        <div class="well singleprice"> <p class="product-price">${clickedItem.Price}:-</p>
            <button class="btn btn-success purch-button">Add to cart</button>  
        </div>
        `);

    showReviews(clickedItem);
    latestClickedProduct = itemID;
    latestClickedObject = clickedItem;

    $(".purch-button").on("click", e => {
        let found = itemsInCart.some(function (el) {
            return el.Id === clickedItem.Id;
        });

        if (!clickedItem.quantity) {
            clickedItem.quantity = 1;
        }

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
    });
}
// Render Single Product View


function showReviews(clickedItem) {

    fetch('http://demo.edument.se/api/reviews')
        .then(response => response.json())
        .then(function(data){
            allReviews = data;
        })
        .then(function(){
            $("#all-reviews").empty();
            let reviews = allReviews.filter((e) => (e.ProductID === clickedItem.Id));

            for (let review of reviews) {

                let $rating = $("<p></p>");

                if (review.Name !== "") {
                    for (let i = 0; i < 5; i++) {
                        let className;
                        if (i < review.Rating) {
                            className = "glyphicon glyphicon-star"
                        } else {
                            className = "glyphicon glyphicon-star-empty"
                        }
                        $rating.append($("<span></span>").addClass(className));
                    }
                    $("#all-reviews").append($("<div></div>").addClass("well").append($rating).append(
                        `   
                <p>"${review.Comment}"</p>
                <h4>-${review.Name}</h4>
            `
                    ));
                }
            }
        })
   // $("#all-reviews").empty();

}

let thisProduct;

$("#product-catalogue").on("click", ".product a", e => {
    $("#show-a-product").css("display", "block");
    $("#checkout-mode").hide();
    $("#shop-mode").hide();

    // Write product clicked!

    $("#all-reviews").empty();

    thisProduct = e;
    writeProduct(e);

});


//  Allows users to add new reviews

// $(`#submit-review-button`).on("click", () => addNewReview(latestClickedProduct));

function addNewReview(clickedProduct) {

    fetch('http://demo.edument.se/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
        ProductID: clickedProduct,
        Name: $('input[name=reviewName]').val(),
        Comment:$('#reviewText').val(),
        Rating: $('#rating').val()
        }),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    $('input[name=reviewTitle]').val(""),
    $('input[name=reviewName]').val(""),
    $('#reviewText').val("")

}

$('#submit-review-button').on("click", function(e) {
    addNewReview(latestClickedProduct);

});

$('#reviewModal').on('hidden.bs.modal', function () {
    showReviews(latestClickedObject);
});



// Keep track on which item people buy
let itemsInCart = [];


// Adds the clicked product to cart
function addToCart(e) {
    let productId = parseInt(e.currentTarget.parentNode.getAttribute("id"));

    let clickedItem = allProducts.find(function (e) {
        return e.Id === productId;
    });

    if (!clickedItem.quantity) {
        clickedItem.quantity = 1;
    }

    let found = itemsInCart.some(function (el) {
         return el.Name === clickedItem.Name;
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
        let price = itemsInCart[i].Price;
        let removeSymbols = parseFloat(price);
        let quantityPrice = removeSymbols * itemsInCart[i].quantity;
        totalPrice = totalPrice + quantityPrice;
        $("#total").html(`Total Price: <span id="totalPrice">${totalPrice}:-</span>`);
    }
}

// Show all products in cart on checkout
function showProductsOnCheckout() {
    for (let i = checkoutTable.rows.length - 1; i > 0; i--) {
        checkoutTable.deleteRow(i);
    }
    // Prints all products on checkout
    for (let i = 0; i < itemsInCart.length; i++) {
        if (itemsInCart[i].quantity != 0) {
            const quantityCart = itemsInCart[i].quantity;
            const row = checkoutTable.insertRow(1);
            row.id = itemsInCart[i].Id;
            const name = row.insertCell(0);
            const price = row.insertCell(1);
            const quantity = row.insertCell(2);
            name.innerHTML = itemsInCart[i].Name;
            price.innerHTML = `${itemsInCart[i].Price}:-`;
            quantity.innerHTML = `${quantityCart}`;

            const increaseButton = document.createElement("button");
            increaseButton.classList.add("incBtn");
            increaseButton.innerText = "+";
            quantity.appendChild(increaseButton);

            const decreaseButton = document.createElement("button");
            decreaseButton.innerText = "-";
            decreaseButton.classList.add("decBtn");
            quantity.appendChild(decreaseButton);

        }
    }
}
// Increase and decrease quantity buttons
$("#checkout-table").on("click", e => {
    let getID = e.target.parentNode.parentNode;
    let productId = parseInt(getID.getAttribute("id"));

    let result = itemsInCart.find(function (e) {
        return e.Id === productId;
    });
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


// Validates the buyform on submit
$("#buyform").on("submit", e => {
    e.preventDefault()
    const  $inputs = $("#buyform input");

    for (let i = 0; i < $inputs.length; i++) {
        console.log($inputs.length);

        // Validate Phone Number
        if (i === 3) {
            let $phoneNmbr = $("#number").val();
            const allowedSymbols = /^\d{10}$/;

            if ($phoneNmbr.match(allowedSymbols) || $phoneNmbr === "") {
                $("#error-testing").html("");
            }
            else {
                $("#error-testing").text("Please enter a valid phone number");
                $("#number").css("border-color", "red").focus();
                setTimeout(function () {
                    $("#number").css("border-color", "#ccc");
                }, 500);
                return false;
            }
        }
        // Validate Zip
        else if (i === 6) {
            const validZip =  /^\d{5}$/;
            let $zipCode = $("#zipcode").val();

            if ($zipCode.match(validZip)) {
                $("#error-testing").html("");
            }
            else {
                $("#error-testing").text("Please enter a valid zip code");
                $("#zipcode").css("border-color", "red").focus();
                setTimeout(function () {
                    $("#zipcode").css("border-color", "#ccc");
                }, 500);
            }
        }

        // Validate Rest of Form
        else if ($inputs[i].value === "") {
            $("#error-testing").text("Please fill in the required fields");
            $inputs[i].style.borderColor = "red";
            $inputs[i].focus();
            setTimeout(function () {
                $inputs[i].style.borderColor = "";
            }, 500);
            return false;
        }
        else {
            $("#error-testing").text("");

            fetch('http://demo.edument.se/api/orders', {
                method: 'POST',
                body: JSON.stringify({
                    FirstName: $('input[name=fname]').val(),
                    LastName: $('input[name=lname]').val(),
                    Email: $('input[name=mail]').val(),
                    Phone: $('input[name=number]').val(),
                    StreetAddress: $('input[name=address]').val(),
                    ZipCode: $('input[name=zipcode]').val(),
                    City: $('input[name=city]').val(),
                    Comment: $('#exampleFormControlTextarea1').val(),
                    OrderItems: itemsInCart
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
        }
    }
})


