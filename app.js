// 1. Core Dataset for Laundry Operations
const laundryDataset = [
    { id: 101, name: "Premium Wash & Fold", price: 299 },
    { id: 102, name: "Express Dry Cleaning", price: 499 },
    { id: 103, name: "Steam Ironing & Press", price: 149 },
    { id: 104, name: "Stain Removal Treatment", price: 399 }
];

// 2. Application State Layer
let activeCart = [];

// 3. Document Object Model (DOM) Selectors
const servicesTarget = document.getElementById('services-render-target');
const emptyPlaceholder = document.getElementById('cart-empty-placeholder');
const cartListOutput = document.getElementById('active-cart-list');
const grandTotalOutput = document.getElementById('invoice-grand-total');
const bookingFormNode = document.getElementById('laundry-order-form');
const feedbackAlert = document.getElementById('success-feedback-msg');

// 4. Smooth Scroll for Hero Button Action
function scrollToBooking() {
    document.getElementById('booking-app-core').scrollIntoView({ behavior: 'smooth' });
}

// 5. Render Available Catalog Items
function renderCatalog() {
    servicesTarget.innerHTML = '';

    laundryDataset.forEach(service => {
        const isSelected = activeCart.some(item => item.id === service.id);
        
        const cardNode = document.createElement('div');
        cardNode.className = `laundry-item-card ${isSelected ? 'is-active' : ''}`;
        
        cardNode.innerHTML = `
            <div class="card-meta">
                <h4>${service.name}</h4>
                <div class="price-tag">₹${service.price}</div>
            </div>
            <div class="card-triggers">
                <button class="action-add-btn" ${isSelected ? 'disabled' : `onclick="addItemToBasket(${service.id})"`}>
                    ${isSelected ? '<i class="fa-solid fa-check"></i> Added' : 'Add Item'}
                </button>
                <button class="action-remove-btn" onclick="removeItemFromBasket(${service.id})">Remove Item</button>
            </div>
        `;
        servicesTarget.appendChild(cardNode);
    });
}

// 6. Sync UI View Layer with State Array
function refreshCartUI() {
    if (activeCart.length === 0) {
        emptyPlaceholder.style.display = 'block';
        cartListOutput.innerHTML = '';
    } else {
        emptyPlaceholder.style.display = 'none';
        cartListOutput.innerHTML = '';

        activeCart.forEach(item => {
            const liNode = document.createElement('li');
            liNode.className = 'basket-row';
            liNode.innerHTML = `
                <span class="basket-item-name">${item.name}</span>
                <span class="basket-item-price">₹${item.price}</span>
            `;
            cartListOutput.appendChild(liNode);
        });
    }

    // Calculate Dynamic Accumulation Sum
    const calculatedSum = activeCart.reduce((acc, item) => acc + item.price, 0);
    grandTotalOutput.innerText = `₹${calculatedSum}`;
}

// 7. Click Actions: Add Operation
function addItemToBasket(targetId) {
    const selectedObject = laundryDataset.find(service => service.id === targetId);
    if (selectedObject && !activeCart.some(item => item.id === targetId)) {
        activeCart.push(selectedObject);
        refreshCartUI();
        renderCatalog();
    }
}

// 8. Click Actions: Remove Operation
function removeItemFromBasket(targetId) {
    activeCart = activeCart.filter(item => item.id !== targetId);
    refreshCartUI();
    renderCatalog();
}

// 9. Dispatch Form & EmailJS Pipeline Execution
bookingFormNode.addEventListener('submit', function(event) {
    event.preventDefault();

    if (activeCart.length === 0) {
        alert('Please add at least one laundry service to your basket before checking out.');
        return;
    }

    // Extract User Credentials
    const clientName = document.getElementById('client-name').value;
    const clientEmail = document.getElementById('client-email').value;
    const clientPhone = document.getElementById('client-phone').value;

    // Collect Selected Services Names for Email Body
    const selectedServicesText = activeCart.map(item => `${item.name} (₹${item.price})`).join(', ');
    const grandTotalVal = grandTotalOutput.innerText;

    // Prepare Payload Data Object for EmailJS Template variables
    const emailParams = {
        to_name: clientName,
        to_email: clientEmail,
        user_phone: clientPhone,
        ordered_services: selectedServicesText,
        total_bill: grandTotalVal
    };

    // --- IMPORTANT EMAILJS CONFIGURATION ---
    // सूरज भाई, जब आप EmailJS डैसबोर्ड सेट कर लोगे, तो नीचे अपनी IDs डाल देना:
    // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailParams)
    
    // अभी के लिए हम सीधे सक्सेस फ्लो दिखा रहे हैं ताकि आपका बिना अटके टेस्ट हो जाए:
    setTimeout(() => {
        // Clear Form inputs and Purge Array State
        bookingFormNode.reset();
        activeCart = [];
        refreshCartUI();
        renderCatalog();

        // Display Guidelines Mandatory Confirmation Text Block
        feedbackAlert.className = "hidden-feedback success-state";
        feedbackAlert.innerText = "Thank you For Booking the Service We will get back to you soon!";
        
        // Auto-scroll to feedback message smoothly
        feedbackAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 800);
});

// App Engine Boot Initialization Trigger
renderCatalog();
refreshCartUI();