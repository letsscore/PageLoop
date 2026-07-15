// Complete Global Database Array State
let products = [
    {
        id: 101,
        action: 'sell', // sell | donate
        type: 'book', // book | notes
        tier: 'College', // School | College | University | Competitive
        title: 'Higher Engineering Mathematics - 44th Edition',
        price: 450,
        fee: 20,
        sellerName: 'Amit Verma',
        sellerPin: '700019',
        coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 102,
        action: 'sell',
        type: 'notes',
        tier: 'Competitive',
        title: 'UPSC Civil Services Indian Economy Hand Written Notes',
        price: 300,
        fee: 25,
        sellerName: 'Neha Sharma',
        sellerPin: '110001',
        coverImage: 'https://images.unsplash.com/photo-1453733190148-c44698c26588?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 103,
        action: 'donate',
        type: 'book',
        tier: 'School',
        title: 'NCERT Mathematics Class 10 Textbook Set',
        price: 0,
        fee: 0,
        sellerName: 'Rajesh Gupta',
        sellerPin: '400001',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'
    }
];

// Active State Configuration Matrix
let currentUser = null;
let currentIntentFilter = 'sell';
let currentTypeFilter = 'all';
let currentTierFilter = 'all';

// Real-time Platform Fixed Charge Matrix Rule
function getPlatformFee(tier, action) {
    if (action === 'donate') return 0;
    switch(tier) {
        case 'School': return 10;
        case 'College':
        case 'University': return 20;
        case 'Competitive': return 25;
        default: return 0;
    }
}

// System Onboarding Handlers & Dynamic OTP Flow
const sendOtpBtn = document.getElementById('sendOtpBtn');
const userOtpInput = document.getElementById('userOtp');
const onboardingForm = document.getElementById('onboardingForm');

sendOtpBtn.addEventListener('click', () => {
    const phone = document.getElementById('userPhone').value;
    if(!phone) { alert('Please enter a valid phone number first.'); return; }
    sendOtpBtn.innerText = 'Sent (1234)';
    userOtpInput.disabled = false;
    userOtpInput.value = '1234'; // Simulated instant autofill bypass code
});

onboardingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(userOtpInput.value !== '1234') { alert('Invalid Authentication Code!'); return; }

    // Hydrate runtime active customer profile
    currentUser = {
        name: document.getElementById('userName').value,
        dob: document.getElementById('userDob').value,
        phone: document.getElementById('userPhone').value,
        pin: document.getElementById('userPin').value,
        status: document.getElementById('userStatus').value,
        intent: document.getElementById('userIntent').value
    };

    // UI View transition matrix changes
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('navUserBadge').innerHTML = `<i class="fa-solid fa-circle-user"></i> ${currentUser.name} (${currentUser.status})`;
    
    // Auto sync filter state configuration with onboarding preference selection
    currentIntentFilter = currentUser.intent === 'buy' ? 'sell' : 'sell';
    renderMarketplace();
});

// Structural Filter Switch Engines (Flipkart Paradigm)
document.querySelectorAll('.intent-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.intent-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentIntentFilter = e.target.dataset.intent;
        renderMarketplace();
    });
});

document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentTypeFilter = e.target.dataset.type;
        renderMarketplace();
    });
});

document.querySelectorAll('.tier-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentTierFilter = e.target.dataset.tier;
        renderMarketplace();
    });
});

// Listing Logic Fee Trigger Updates
const listActionSelect = document.getElementById('listAction');
const listTierSelect = document.getElementById('listCategory');
const priceGroup = document.getElementById('priceInputGroup');
const feeNotice = document.getElementById('feeNotice');

function updateModalFeeNotice() {
    const action = listActionSelect.value;
    const tier = listTierSelect.value;
    
    if (action === 'donate') {
        priceGroup.classList.add('hidden');
        document.getElementById('listPrice').required = false;
        feeNotice.innerHTML = `<p><i class="fa-solid fa-heart"></i> Philanthropy Model: Platform processing charges are fully waived (₹0) for donation listings!</p>`;
    } else {
        priceGroup.classList.remove('hidden');
        document.getElementById('listPrice').required = true;
        const structuralFee = getPlatformFee(tier, 'sell');
        feeNotice.innerHTML = `<p><i class="fa-solid fa-circle-info"></i> Fixed Gateway Charge applied on sales: <strong>₹${structuralFee}</strong> for ${tier} Tier.</p>`;
    }
}
listActionSelect.addEventListener('change', updateModalFeeNotice);
listTierSelect.addEventListener('change', updateModalFeeNotice);

// Modal Core Controller Interops
const listModal = document.getElementById('listModal');
document.getElementById('openListModalBtn').addEventListener('click', () => { 
    listModal.classList.add('active'); 
    updateModalFeeNotice(); 
});
document.getElementById('closeModalBtn').addEventListener('click', () => listModal.classList.remove('active'));

// Dynamic New Listing Engine (Injecting dynamic binary image placeholders)
document.getElementById('listingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const action = listActionSelect.value;
    const tier = listTierSelect.value;
    const basePrice = action === 'donate' ? 0 : parseFloat(document.getElementById('listPrice').value);
    
    const newProductListing = {
        id: Date.now(),
        action: action,
        type: document.getElementById('listItemType').value,
        tier: tier,
        title: document.getElementById('listTitle').value,
        price: basePrice,
        fee: getPlatformFee(tier, action),
        sellerName: currentUser.name,
        sellerPin: currentUser.pin,
        coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400' // Default production stock wrapper fallback
    };

    products.unshift(newProductListing);
    listModal.classList.remove('active');
    document.getElementById('listingForm').reset();
    renderMarketplace();
});

// Flipkart E-Commerce Functional Core Grid Builder Rendering Engine
function renderMarketplace() {
    const grid = document.getElementById('itemsGrid');
    grid.innerHTML = '';

    const viewableSubset = products.filter(p => {
        const matchesIntent = p.action === currentIntentFilter;
        const matchesType = currentTypeFilter === 'all' || p.type === currentTypeFilter;
        const matchesTier = currentTierFilter === 'all' || p.tier === currentTierFilter;
        return matchesIntent && matchesType && matchesTier;
    });

    document.getElementById('listingsCount').innerText = `Displaying ${viewableSubset.length} architectural listing entries matched`;

    if(viewableSubset.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 4rem; color: #64748b;">
            <i class="fa-regular fa-folder-closed" style="font-size:3rem; margin-bottom:1rem;"></i>
            <p>No verified listings populate this structural view segment yet.</p>
        </div>`;
        return;
    }

    viewableSubset.forEach(product => {
        const actionLabel = product.action === 'sell' ? 'FOR SALE' : 'DONATION';
        const badgeClass = product.action === 'sell' ? 'badge-sell' : 'badge-donate';
        
        const cardStructure = `
            <div class="fk-card">
                <div class="fk-img-box">
                    <img src="${product.coverImage}" alt="Product Image Document">
                    <span class="fk-badge ${badgeClass}">${actionLabel}</span>
                </div>
                <div class="fk-details">
                    <span class="fk-tier">${product.tier} • ${product.type}</span>
                    <h4 class="fk-title">${product.title}</h4>
                    <div class="fk-pricing-bar">
                        <span class="fk-price">${product.price > 0 ? '₹' + product.price : 'FREE'}</span>
                        ${product.fee > 0 ? `<span class="fk-fee-tag">+ ₹${product.fee} fee</span>` : ''}
                    </div>
                    <div class="fk-meta-footer">
                        <div><i class="fa-solid fa-user-shield"></i> Seller: ${product.sellerName}</div>
                        <div><i class="fa-solid fa-location-dot"></i> Zone Location PIN: ${product.sellerPin}</div>
                    </div>
                    <button class="btn btn-primary btn-block btn-sm" onclick="initiateCheckout(${product.id})" style="margin-top: 1rem;">
                        ${product.action === 'sell' ? 'Buy System Item' : 'Claim Donation Item'}
                    </button>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardStructure);
    });
}

// Transaction Pipeline Secure Gateway Execution Engine
const checkoutModal = document.getElementById('checkoutModal');
let targetActiveCheckoutProductId = null;

window.initiateCheckout = function(productId) {
    const item = products.find(p => p.id === productId);
    if(!item) return;

    targetActiveCheckoutProductId = productId;
    const summaryContainer = document.getElementById('checkoutSummary');
    const aggregateTotalCost = item.price + item.fee;

    summaryContainer.innerHTML = `
        <h4>Order Matrix Breakdown</h4>
        <div class="checkout-row"><span>Item Line Description:</span> <strong>${item.title}</strong></div>
        <div class="checkout-row"><span>Logistical Academic Level:</span> <span>${item.tier} Setup</span></div>
        <div class="checkout-row"><span>Base Item Cost Matrix:</span> <span>₹${item.price}</span></div>
        <div class="checkout-row"><span>Fixed Administrative Processing Fee:</span> <span>₹${item.fee}</span></div>
        <div class="checkout-row checkout-total"><span>Aggregated Total Remittance:</span> <span>₹${aggregateTotalCost}</span></div>
    `;
    checkoutModal.classList.add('active');
};

document.getElementById('closeCheckoutBtn').addEventListener('click', () => checkoutModal.classList.remove('active'));

document.getElementById('payNowBtn').addEventListener('click', () => {
    alert('Payment Gateway Handshake Authorized! Transaction successfully completed directly inside PageLoop ecosystem layer.');
    // Splice target processing records from view architecture on successful buy clearing
    products = products.filter(p => p.id !== targetActiveCheckoutProductId);
    checkoutModal.classList.remove('active');
    renderMarketplace();
});

