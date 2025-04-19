// Allen Code
document.addEventListener("DOMContentLoaded", function () {
    const cartToggle = document.getElementById("cartToggle");
    const cartDropdown = document.getElementById("cartDropdown");

    // Toggle dropdown visibility when clicking the cart icon
    cartToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        if (cartDropdown.style.display === "block") {
            cartDropdown.style.display = "none";
        } else {
            populateCart(cartDropdown);
            cartDropdown.style.display = "block";
        }
    });
    
    // Hide dropdown when clicking outside the cart
    document.addEventListener("click", function () {
        cartDropdown.style.display = "none";
    });

    // Prevent the dropdown from hiding when clicking inside the dropdown
    cartDropdown.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    // On page load updates cart and populates the menu on menu page and the cart on the order page if on the respective pages
    updateCartTotal();
    populateMenu();
    populateOrderPageCart(cartDropdown);   
});

// Function to populate the dropdown with cart items
function populateCart(cartDropdown) {
    const cartData = JSON.parse(sessionStorage.getItem("cart") || "[]");
    cartDropdown.innerHTML = "";

    if (cartData.length === 0) {
        cartDropdown.innerHTML = `<p class="mb-0">Your cart is empty.</p>`;
        updateCartTotal();
        return;
    }

    let total = 0;

    cartData.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const li = document.createElement("li");
        li.innerHTML = `
            <div class="row order-item align-items-center mb-3" data-id="${item.id}">
                <div class="col-2">
                    <img class="w-100" loading="lazy" src="${item.image}" alt="${item.name}">
                </div>
                <div class="col-8">
                    <div class="d-flex justify-content-between">
                        <div class="item-description">
                            <h6 class="item-name">${item.name}</h6>
                        </div>
                        <span class="item-price">€${item.price.toFixed(2)}</span>
                    </div>
                </div>
                <div class="col-2 d-flex align-items-center gap-2">
                    <input type="text" class="form-control quantity-input text-center" value="${item.quantity}" disabled/>
                </div>
            </div>
        `;
        cartDropdown.appendChild(li);
    });
    cartDropdown.innerHTML += `
        <hr>
        <div class="d-flex justify-content-between fw-bold">
            <span>Total:</span>
            <span>€${total.toFixed(2)}</span>
        </div>
        <hr>
        <a class="btn btn-sm cstm-button" href="../pages/order.html" onclick="cartDropdown.style.display='none'">Go To Order</a>
    `;
    updateCartTotal();
}

function updateCartTotal() {
    const cartTotalDisplay = document.querySelector(".account-bag");
    const cartData = JSON.parse(sessionStorage.getItem("cart") || "[]");
    let total = 0;

    // Calculate the total price from the cart items
    cartData.forEach(item => {
        total += item.price * item.quantity;
    });

    // Update the total in the cart icon
    cartTotalDisplay.textContent = `€${total.toFixed(2)}`;
}

// Populates menu with json file of products
// Images are from pixabay:
// https://pixabay.com/photos/sourdough-bread-homemade-7739022/
// https://pixabay.com/photos/loaf-bakery-preparation-fresh-bread-2436370/
// https://pixabay.com/photos/croissant-bread-bake-food-taste-2559862/
// https://pixabay.com/photos/muffin-cake-ignite-baking-homemade-299479/
// https://pixabay.com/photos/cinnamon-roll-pastry-cinnamon-4890783/
// https://pixabay.com/photos/danish-pastry-cream-cheese-jam-892909/
// https://pixabay.com/photos/brownie-dessert-cake-sweet-548591/
// https://pixabay.com/photos/cookies-sweets-dessert-8082386/
// https://pixabay.com/photos/tart-pie-dessert-pastry-sweet-6011609/
// https://pixabay.com/photos/cake-carrot-cake-cake-stand-dessert-4890393/
function populateMenu() {
    const menu = document.getElementById("menu");
    fetch('../data/products.json')
        .then(res => res.json())
        .then(data => {
            // Group items by category
            const categories = {};

            data.forEach(item => {
                if (!categories[item.category]) {
                    categories[item.category] = [];
                }
                categories[item.category].push(item);
            });

            // Clear the menu
            menu.innerHTML = '';

            // Loop through each category
            for (const category in categories) {
                menu.innerHTML += `<h2>${category}</h2>`;

                // Add each item in the category
                categories[category].forEach((item, index) => {
                    menu.innerHTML += `
                        <div class="row justify-content-evenly menu-item align-items-center mb-3" data-id="${item.id}">
                            <div class="col-2">
                                <img class="w-100" src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="col-7">
                                <div class="d-flex justify-content-between">
                                    <div class="menu-description">
                                        <h6 class="item-name">${item.name}</h6>
                                        <p>${item.description}</p>
                                    </div>
                                    <span>€${item.price.toFixed(2)}</span>
                                </div>
                            </div>
                            <div class="col-3 d-flex align-items-center gap-2">
                                <button class="btn btn-sm decrement">−</button>
                                <input type="text" class="form-control quantity-input text-center" value="0" readonly />
                                <button class="btn btn-sm increment">+</button>
                                <i class="add-to-cart fa-lg fa-shopping-bag fas rounded-1"></i>
                            </div>
                        </div>
                    `;
                });
            }
            // Event listener for increment, decrement and the bag icon button
            menu.addEventListener('click', (e) => {
                const target = e.target;
            
                if (target.classList.contains('increment') || target.classList.contains('decrement')) {
                    const input = target.parentElement.querySelector('.quantity-input');
                    let currentValue = parseInt(input.value);
            
                    if (target.classList.contains('increment') && currentValue < 20) {
                        input.value = currentValue + 1;
                    }
                    if (target.classList.contains('decrement') && currentValue > 0) {
                        input.value = currentValue - 1;
                    }
                }
                if (target.classList.contains('add-to-cart')) {
                    const row = target.closest('.row');
                    const quantity = parseInt(row.querySelector('.quantity-input').value);
            
                    if (quantity > 0) {
                        // Retrieve the item details from the row's data attributes
                        const itemId = parseInt(row.dataset.id);
                        const itemName = row.querySelector('.item-name').textContent;
                        const itemPrice = parseFloat(row.querySelector('span').textContent.replace('€', '').trim());
                        const itemImage = row.querySelector('img').src;
                        if (isNaN(itemId) || isNaN(itemPrice)) {
                            console.error("Item ID or Price is missing or invalid.");
                            return;
                        }
            
                        // Get current cart from sessionStorage, or initialize as empty array
                        let cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
            
                        // Check if the item already exists in the cart
                        const existingItem = cartItems.find(item => item.id === itemId);
            
                        if (existingItem) {
                            // If it exists, update the quantity
                            existingItem.quantity += quantity;
                        } else {
                            // If not, add it as a new entry
                            cartItems.push({
                                id: itemId,
                                name: itemName,
                                quantity: quantity,
                                price: itemPrice,
                                image: itemImage
                            });
                        }
            
                        // Save updated cart back to sessionStorage
                        sessionStorage.setItem("cart", JSON.stringify(cartItems));
            
                        // Update the cart total after adding to the cart
                        updateCartTotal();
                        showFlashMessageAdd();
                    } else {
                        showFlashMessageQty()
                    }
                }
            });                
        })
        .catch(err => console.error('Error loading JSON:', err));
}

// Populates order cart from cart in session storage
function populateOrderPageCart(cartDropdown) {
    const cartData = JSON.parse(sessionStorage.getItem("cart") || "[]");
    const orderList = document.getElementById("order-list");
    const orderTotalDisplay = document.getElementById("order-total");
    orderList.innerHTML = "";

    // If no items then show no items in cart
    if (cartData.length === 0) {
        orderList.innerHTML = `<p>No items in cart</p>`;
        orderTotalDisplay.textContent = "€0.00";
        return;
    }

    let total = 0;
    // Each time is multiplied by the quantity to get the total and html is added for each item
    cartData.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const li = document.createElement("li");
        li.innerHTML = `
            <div class="row justify-content-evenly order-item align-items-center mb-3" data-id="${item.id}">
                <div class="col-2">
                    <img class="w-100" src="${item.image}" alt="${item.name}">
                </div>
                <div class="col-7">
                    <div class="d-flex justify-content-between">
                        <div class="item-description">
                            <h6 class="item-name">${item.name}</h6>
                        </div>
                        <span class="item-price">€${item.price.toFixed(2)}</span>
                    </div>
                </div>
                <div class="col-3 d-flex align-items-center gap-2">
                    <button class="btn btn-sm decrement">−</button>
                    <input type="text" class="form-control quantity-input text-center" value="${item.quantity}" readonly />
                    <button class="btn btn-sm increment">+</button>
                    <button class="btn btn-sm delete-item" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        orderList.appendChild(li);
        const decrementBtn = li.querySelector(".decrement");
        const incrementBtn = li.querySelector(".increment");
        const deleteBtn = li.querySelector(".delete-item");

        // Event listeners for increasing, decreasing or deleting an item from the cart
        decrementBtn.addEventListener("click", () => {
            if (cartData[index].quantity > 1) {
                cartData[index].quantity--;
            } else {
                return;
            }
            sessionStorage.setItem("cart", JSON.stringify(cartData));
            populateOrderPageCart(cartDropdown);
            populateCart(cartDropdown);
            showFlashMessageUpdate();
        });
        incrementBtn.addEventListener("click", () => {
            cartData[index].quantity++;
            sessionStorage.setItem("cart", JSON.stringify(cartData));
            populateOrderPageCart(cartDropdown);
            populateCart(cartDropdown);
            showFlashMessageUpdate();
        });
        deleteBtn.addEventListener("click", () => {
            cartData.splice(index, 1);
            sessionStorage.setItem("cart", JSON.stringify(cartData));
            populateOrderPageCart(cartDropdown);
            populateCart(cartDropdown);
            showFlashMessageUpdate();
        });
    });
    orderTotalDisplay.textContent = `€${total.toFixed(2)}`;
}

// Flash message if user adds to the cart
function showFlashMessageAdd() {
    const flashMessage = document.getElementById('flashMessageAdd');
    flashMessage.style.display = 'block';
    flashMessage.classList.add('show');
    
    // Hide the message after 2 seconds
    setTimeout(() => {
        flashMessage.classList.remove('show');
        setTimeout(() => flashMessage.style.display = 'none', 500);
    }, 2000);
}
// Flash message if user tries to add an item without selecting a quantity
function showFlashMessageQty() {
    const flashMessage = document.getElementById('flashMessageQty');
    flashMessage.style.display = 'block';
    flashMessage.classList.add('show');
    
    // Hide the message after 2 seconds
    setTimeout(() => {
        flashMessage.classList.remove('show');
        setTimeout(() => flashMessage.style.display = 'none', 500);
    }, 2000);
}
// Flash message when the user adds or moves items on the order page
function showFlashMessageUpdate() {
    const flashMessage = document.getElementById('flashMessageUpdate');
    flashMessage.style.display = 'block';
    flashMessage.classList.add('show');
    
    // Hide the message after 2 seconds
    setTimeout(() => {
        flashMessage.classList.remove('show');
        setTimeout(() => flashMessage.style.display = 'none', 500);
    }, 2000);
}

$(document).ready(function() {
    // Order Page
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches

    $(".next").click(function () {
        const currentFieldset = $(this).closest("fieldset");
        const inputs = currentFieldset.find("input");
    
        // Check if all inputs in current step are valid
        for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].checkValidity()) {
                inputs[i].reportValidity();
                return;
            }
        }
    
        // Save delivery data to be used on payment form or if the user presses previous to come back to this form
        const deliveryData = {
            name: $("input[name='name']").val(),
            address1: $("input[name='address-line-1']").eq(0).val(),
            address2: $("input[name='address-line-2']").eq(0).val(),
            city: $("input[name='city']").eq(0).val(),
            eircode: $("input[name='eircode']").eq(0).val(),
            phone: $("input[name='phone']").val()
        };
        sessionStorage.setItem("deliveryDetails", JSON.stringify(deliveryData));
    
        if (animating) return false;
        animating = true;
    
        current_fs = currentFieldset;
        next_fs = currentFieldset.next();
        // Flip over to the next fieldset form
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
    
        next_fs.show();
        current_fs.animate({ opacity: 0 }, {
            step: function (now, mx) {
                scale = 1 - (1 - now) * 0.2;
                left = (now * 50) + "%";
                opacity = 1 - now;
                current_fs.css({
                    'transform': 'scale(' + scale + ')',
                    'position': 'absolute'
                });
                next_fs.css({ 'left': left, 'opacity': opacity });
            },
            duration: 800,
            complete: function () {
                current_fs.hide();
                animating = false;
            },
            easing: 'easeInOutBack'
        });
    });    

    $(".previous").click(function(){
        // Load delivery data from sessionStorage
        const savedData = JSON.parse(sessionStorage.getItem("deliveryDetails"));
        if (savedData) {
            $("input[name='name']").val(savedData.name);
            $("input[name='address-line-1']").eq(0).val(savedData.address1);
            $("input[name='address-line-2']").eq(0).val(savedData.address2);
            $("input[name='city']").eq(0).val(savedData.city);
            $("input[name='eircode']").eq(0).val(savedData.eircode);
            $("input[name='phone']").val(savedData.phone);
        }
        if(animating) return false;
        animating = true;
        
        current_fs = $(this).closest("fieldset");
        previous_fs = current_fs.prev();
        
        //de-activate current step on progressbar
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
        
        //show the previous fieldset
        previous_fs.show(); 
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function(now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale previous_fs from 80% to 100%
                scale = 0.8 + (1 - now) * 0.2;
                //2. take current_fs to the right(50%) - from 0%
                left = ((1-now) * 50)+"%";
                //3. increase opacity of previous_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({'left': left});
                previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
            }, 
            duration: 800, 
            complete: function(){
                current_fs.hide();
                animating = false;
            }, 
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });
    // Checkbox to use same information as delivery information in payment form or not
    $("#flexCheckDefault").on("change", function () {
        if ($(this).is(":checked")) {
            const savedData = JSON.parse(sessionStorage.getItem("deliveryDetails"));
            if (savedData) {
                $("input[name='address-line-1']").eq(1).val(savedData.address1);
                $("input[name='address-line-2']").eq(1).val(savedData.address2);
                $("input[name='city']").eq(1).val(savedData.city);
                $("input[name='eircode']").eq(1).val(savedData.eircode);
            }
        } else {
            // Clear fields if unchecked (optional)
            $("input[name='address-line-1']").eq(1).val('');
            $("input[name='address-line-2']").eq(1).val('');
            $("input[name='city']").eq(1).val('');
            $("input[name='eircode']").eq(1).val('');
        }
    });
    // The confirm button on payment form will check if valid and if valid will display a message that the order is out to delivery
    // and the arrival time to be one hour from the current time
    $(".submit").click(function (e) {
        e.preventDefault();
    
        const currentFieldset = $(this).closest("fieldset");
        const inputs = currentFieldset.find("input");
    
        for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].checkValidity()) {
                inputs[i].reportValidity();
                return;
            }
        }
    
        sessionStorage.clear();
        updateCartTotal();
    
        const now = new Date();
        now.setHours(now.getHours() + 1);
        const arrivalTime = now.toTimeString().slice(0, 5);
    
        $("main").html(`
            <div class="d-flex justify-content-center align-items-center" style="height: 70vh;">
                <div class="text-center">
                    <h2>Order out to delivery.</h2>
                    <p class="lead">Estimated arrival time: <strong>${arrivalTime}</strong></p>
                </div>
            </div>
        `);
    });    
});
// End of Allen code

// Salini Code
// Cake Decoration Game
let currentOption = null;
let optionsCount = 0;

const toppingImages = {
    sprinkles: "../images/sprinkles.webp",
    blueBerries: "../images/blueBerries.webp",
    cherries: "../images/cherries.webp"
};

const flavourImage = {
    pineapple: "../images/cakeBase-Pineapple.webp",
    vennila: "../images/cakeBase-Vennila.webp"
};

function setTopping(optionType) {
    currentOption = optionType;
};

function addTopping() {
    const cakeContainer = document.getElementById('cake');
    if (currentOption) {
        if (optionsCount < 3) {
            const options = document.createElement('img');
            options.src = toppingImages[currentOption];
            options.className = 'placeTopping';
            options.style.position = 'absolute';
            let baseBottom = 130;
            options.style.borderRadius = '25px';


            if (optionsCount == 0) {
                options.style.transform = 'translateX(-100%)';
            }
            else if (optionsCount == 1) {
                options.style.transform = 'translateX(0%)';

            }
            else if (optionsCount == 2) {
                options.style.transform = 'translateX(95%)';
                options.style.marginTop = '50px';
                baseBottom = 110;
            }

            options.style.zIndex = 2;

            const optionsHeight = 8;
            options.style.bottom = `${baseBottom + (optionsCount * optionsHeight)}px`;

            cakeContainer.appendChild(options);
            optionsCount++;
        }
        else {
            alert('Only three toppings allowed!');
        }
    }
    else {
        alert('Please choose a topping!');
    }
};

function removeTopping() {
    const cakeContainer = document.getElementById('cake');
    const options = cakeContainer.querySelectorAll('.placeTopping');
    if (options.length > 0) {
        cakeContainer.removeChild(options[options.length - 1]);
        optionsCount--;
    } else {
        alert('No toppings to remove!');
    }
}

function refresh() {
    const cakeContainer = document.getElementById('cake');
    cakeContainer.innerHTML = '';
    const cakeBaseDom = document.createElement('div');
    cakeBaseDom.className = 'vanillaCake';
    cakeContainer.appendChild(cakeBaseDom);
    optionsCount = 0;
    document.getElementById("flavour").value = 'Vanilla';
}

function changeFlavor() {
    var selectedFlavour = document.getElementById("flavour").value;
    if (selectedFlavour == 'Pineapple') {
        const cakeContainer = document.getElementById('cake');
        cakeContainer.innerHTML = '';
        const cakeBaseDom = document.createElement('div');
        cakeBaseDom.className = 'pineappleCake';
        cakeContainer.appendChild(cakeBaseDom);
        optionsCount = 0;
    }
    else if (selectedFlavour == 'Vanilla') {
        const cakeContainer = document.getElementById('cake');
        cakeContainer.innerHTML = '';
        const cakeBaseDom = document.createElement('div');
        cakeBaseDom.className = 'vanillaCake';
        cakeContainer.appendChild(cakeBaseDom);
        optionsCount = 0;
    }
    else if (selectedFlavour == 'Chocolate') {
        const cakeContainer = document.getElementById('cake');
        cakeContainer.innerHTML = '';
        const cakeBaseDom = document.createElement('div');
        cakeBaseDom.className = 'chocolateCake';
        cakeContainer.appendChild(cakeBaseDom);
        optionsCount = 0;
    }
}
// End of Salini code