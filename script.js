/* ==========================================
   PAGELOOP BACKEND LOGIC CORE (UPGRADED)
   ========================================== */

/* --- Simulated Database Mock Data --- */
let mockListings = [
    {
        id: 1,
        title: "Class 12 Physics Wave Mechanics & Optics Guide",
        type: "notes",
        tier: "School",
        price: 180,
        action: "sell",
        sellerName: "Abidur Hussain",
        sellerPhone: "7002137940",
        coverImage: "https://images.unsplash.com/photo-1453733190148-c44698c26588?auto=format&fit=crop&q=80&w=400",
        platformFee: 10,
        status: "available", 
        negotiatedPrice: null
    },
    {
        id: 2,
        title: "Introduction to Quantum Electromagnetism",
        type: "book",
        tier: "University",
        price: 490,
        action: "sell",
        sellerName: "Prof. Sen",
        sellerPhone: "9876543210",
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
        platformFee: 20,
        status: "available",
        negotiatedPrice: null
    }
];

let transactionEscrow = null; 
let loggedInUser = null; 
let currentSelectedRole = "buyer"; 

/* --- Live Educational Rotating Quotes --- */
const academicQuotes = [
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "Today a reader, tomorrow a leader.", author: "Margaret Fuller" },
    { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
    { text: "Books are a uniquely portable magic.", author: "Stephen King" }
];

let quoteIndex = 0;
const quoteCard = document.getElementById("quoteCard");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");

// 3D smooth flip rotation loop for quotes card
if (quoteCard) {
    setInterval(() => {
        quoteCard.style.transform = "rotateY(90deg)";
        setTimeout(() => {
            quoteIndex = (quoteIndex + 1) % academicQuotes.length;
            quoteText.innerText = `"${academicQuotes[quoteIndex].text}"`;
            quoteAuthor.innerText = `- ${academicQuotes[quoteIndex].author}`;
            quoteCard.style.transform = "rotateY(0deg)";
        }, 400);
    }, 6000);
}

/* --- Platform Audit Logging Utilities --- */
const staffLogs = [];
function pushStaffLog(msg) {
    const timestamp = new Date().toLocaleTimeString();
    const formatted = `[${timestamp}] ${msg}`;
    staffLogs.unshift(formatted);
    const logContainer = document.getElementById("staffAuditLogs");
    if(logContainer) {
        logContainer.innerHTML = staffLogs.map(log => `<div>${log}</div>`).join('');
    }
}

/* --- Role Authentication Panel Switcher --- */
const tabButtons = document.querySelectorAll(".auth-tab-btn");
const userFormContainer = document.getElementById("userFormContainer");
const staffFormContainer = document.getElementById("staffFormContainer");
const formTitle = document.getElementById("formTitle");

tabButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentSelectedRole = btn.dataset.role;

        if(currentSelectedRole === "staff") {
            userFormContainer.classList.add("hidden");
            staffFormContainer.classList.remove("hidden");
        } else {
            userFormContainer.classList.remove("hidden");
            staffFormContainer.classList.add("hidden");
            formTitle.innerText = `${currentSelectedRole.charAt(0).toUpperCase() + currentSelectedRole.slice(1)} Registration & Access Gateway`;
        }
    });
});

/* --- Live Mock SMS OTP Dispatch Engine --- */
const sendOtpBtn = document.getElementById("btnRequestOtp");
const regOtpInput = document.getElementById("regOtp");

if (sendOtpBtn) {
    sendOtpBtn.addEventListener("click", () => {
        const userPhoneInput = document.getElementById("regPhone").value;
        if(!userPhoneInput) {
             alert("Please enter a valid phone number.");
             return;
        }
        
        alert(`Sending secure OTP package to ${userPhoneInput} via production messaging gateway...`);
        sendOtpBtn.innerText = "Resend (9999)";
        regOtpInput.disabled = false;
        regOtpInput.value = "9999"; 
        pushStaffLog(`OTP Verification code dispatched to mobile: ${userPhoneInput}`);
    });
}

/* --- User Authentication Submit --- */
document.getElementById("gatekeeperForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if(regOtpInput.value !== "9999") {
        alert("Invalid verification code! Use system default code '9999'.");
        return;
    }

    loggedInUser = {
        name: document.getElementById("regName").value,
        dob: document.getElementById("regDob").value,
        phone: document.getElementById("regPhone").value,
        pin: document.getElementById("regPin").value,
        status: document.getElementById("regStatus").value,
        role: currentSelectedRole,
        sessionUsed: false 
    };

    bootstrapDashboard();
});

/* --- Staff Access Portal Submit --- */
document.getElementById("staffLoginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    loggedInUser = {
        name: "Admin Control Office",
        role: "staff"
    };
    bootstrapDashboard();
});

/* --- Dynamic Workspace Dashboard Routers --- */
const authSection = document.getElementById("authSection");
const dashboardShell = document.getElementById("dashboardShell");
const buyerView = document.getElementById("buyerView");
const sellerView = document.getElementById("sellerView");
const staffView = document.getElementById("staffView");

function bootstrapDashboard() {
    authSection.classList.add("hidden");
    dashboardShell.classList.remove("hidden");

    document.getElementById("pillName").innerText = loggedInUser.name;
    document.getElementById("pillRole").innerText = loggedInUser.role.toUpperCase();

    buyerView.classList.add("hidden");
    sellerView.classList.add("hidden");
    staffView.classList.add("hidden");

    pushStaffLog(`Session established for user: ${loggedInUser.name} [Role: ${loggedInUser.role.toUpperCase()}]`);

    if(loggedInUser.role === "buyer") {
        buyerView.classList.remove("hidden");
        renderMarketplace();
    } else if(loggedInUser.role === "seller") {
        sellerView.classList.remove("hidden");
        renderSellerDashboard();
    } else if(loggedInUser.role === "staff") {
        staffView.classList.remove("hidden");
        renderStaffDashboard();
    }
}

// Global exit handler
document.getElementById("logoutBtn").addEventListener("click", () => {
    loggedInUser = null;
    dashboardShell.classList.add("hidden");
    authSection.classList.remove("hidden");
});

/* ==========================================
   MARKETPLACE LISTINGS & CATEGORY CONTROLLER
   ========================================== */
function getPlatformCharge(tier) {
    if(tier === "School") return 10;
    if(tier === "College" || tier === "University") return 20;
    if(tier === "Competitive") return 25;
    return 0;
}

function renderMarketplace(typeFilter = 'all') {
    const marketGrid = document.getElementById("marketGrid");
    if (!marketGrid) return;
    marketGrid.innerHTML = "";

    const filtered = mockListings.filter(p => {
        if(p.status !== "available" && p.status !== "buyer_deposited") return false;
        if(typeFilter !== 'all' && p.type !== typeFilter) return false;
        return true;
    });

    filtered.forEach(p => {
        const card = `
            <div class="fk-card">
                <div class="fk-img-box">
                    <img src="${p.coverImage}" alt="Cover Page representation">
                    <span class="fk-badge ${p.action === 'donate' ? 'donate' : ''}">${p.action.toUpperCase()}</span>
                </div>
                <div class="fk-details">
                    <span class="fk-tier">${p.tier} Level • ${p.type.toUpperCase()}</span>
                    <h4 class="fk-title">${p.title}</h4>
                    <span class="fk-price">${p.action === 'donate' ? 'FREE / DONATION' : 'Base Price: ₹' + p.price}</span>
                    <div class="fk-meta">
                        <p><i class="fa-solid fa-user"></i> Seller: ${p.sellerName}</p>
                    </div>
                    <button class="btn btn-primary btn-block btn-sm" style="margin-top:1rem;" onclick="openSimulatedChat(${p.id})">
                        <i class="fa-solid fa-comments"></i> Chat & Bargain
                    </button>
                </div>
            </div>
        `;
        marketGrid.insertAdjacentHTML("beforeend", card);
    });
}

// Hook up filter category button clicks
document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        renderMarketplace(e.target.dataset.type);
    });
});

/* ==========================================
   IN-APP REALTIME CHAT & BARGAIN DESK
   ========================================== */
const chatModal = document.getElementById("chatModal");
const closeChatBtn = document.getElementById("closeChatBtn");
const chatMessagesBox = document.getElementById("chatMessagesBox");
const chatWithTitle = document.getElementById("chatWithTitle");
const chatItemTitle = document.getElementById("chatItemTitle");
const negotiatedPriceInput = document.getElementById("negotiatedPriceInput");
const btnLockBargainedDeal = document.getElementById("btnLockBargainedDeal");
let activeChattingItem = null;

window.openSimulatedChat = function(id) {
    if(loggedInUser.sessionUsed) {
        alert("Session Lock active! You can only execute one transaction per login session.");
        return;
    }

    const item = mockListings.find(p => p.id === id);
    activeChattingItem = item;

    chatWithTitle.innerText = `Negotiate with ${item.sellerName}`;
    chatItemTitle.innerText = `${item.title} (Original: ₹${item.price})`;
    negotiatedPriceInput.value = item.price; 

    // Inject contextual peer-to-peer bargaining scenario
    chatMessagesBox.innerHTML = `
        <div class="msg-bubble seller">Hi there! The study notes are completely intact. No tears or markings.</div>
        <div class="msg-bubble buyer">That's great! Will you accept a slightly lower price for student budget?</div>
        <div class="msg-bubble seller">Sure! Let's negotiate. Propose your best price in the dealbox below.</div>
    `;

    chatModal.classList.add("active");
};

if (closeChatBtn) {
    closeChatBtn.addEventListener("click", () => {
        chatModal.classList.remove("active");
    });
}

btnLockBargainedDeal.addEventListener("click", () => {
    const agreedAmt = parseFloat(negotiatedPriceInput.value);
    if(isNaN(agreedAmt) || agreedAmt < 0) {
        alert("Please enter a valid negotiated amount.");
        return;
    }

    activeChattingItem.negotiatedPrice = agreedAmt;
    chatModal.classList.remove("active");
    triggerPlatformBooking(activeChattingItem);
});

/* ==========================================
   DOUBLE-SIDED PLATFORM ESCROW CLEARING
   ========================================== */
const checkoutModal = document.getElementById("checkoutModal");
const checkoutDetails = document.getElementById("checkoutDetails");
const btnGatewayAction = document.getElementById("btnGatewayAction");
const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
let activeCheckoutItem = null;

function triggerPlatformBooking(item) {
    activeCheckoutItem = item;
    const fee = getPlatformCharge(item.tier);

    checkoutDetails.innerHTML = `
        <h4 style="margin-bottom:0.75rem;"><i class="fa-solid fa-receipt"></i> PageLoop Safe-Lock Ticket</h4>
        <div class="checkout-row"><span>Exchange Item:</span> <strong>${item.title}</strong></div>
        <div class="checkout-row"><span>Bargained Subtotal (Direct):</span> <strong>₹${item.negotiatedPrice}</strong></div>
        <hr style="border:0; border-top:1px dashed var(--border); margin:10px 0;">
        <div class="checkout-row" style="color:var(--accent); font-weight:800;">
            <span>Secure Communication Escrow Fee:</span> 
            <span>₹${fee}</span>
        </div>
        
        <div style="background: #e0f2fe; border-left: 4px solid var(--primary); padding: 12px; margin-top: 12px; border-radius: 8px; font-size: 0.75rem; line-height:1.4; color: #0369a1;">
            <strong>💡 Trade Clearance Workflow:</strong>
            The finalized subtotal of <strong>₹${item.negotiatedPrice}</strong> is settled directly offline (via Cash or UPI) when you physically meet the seller. The minimal fee of <strong>₹${fee}</strong> is deposited to verify mutual interest and release contact coordinates securely.
        </div>
    `;
    
    btnGatewayAction.innerText = `Pay Security Platform Fee (₹${fee})`;
    checkoutModal.classList.add("active");
}

if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener("click", () => {
        checkoutModal.classList.remove("active");
    });
}

btnGatewayAction.addEventListener("click", () => {
    if(loggedInUser.role === "buyer") {
        processBuyerPlatformPayment();
    } else if(loggedInUser.role === "seller") {
        processSellerPlatformPayment();
    }
});

function processBuyerPlatformPayment() {
    const fee = getPlatformCharge(activeCheckoutItem.tier);
    alert(`Platform Escrow Fee of ₹${fee} deposited into PageLoop secure node!`);
    
    loggedInUser.sessionUsed = true;
    activeCheckoutItem.status = "buyer_deposited";
    
    // Fire off automated notification dispatch simulations
    const sellerSms = `PAGELOOP LINK -> Great news! A buyer has locked in your listing '${activeCheckoutItem.title}' for ₹${activeCheckoutItem.negotiatedPrice}. Clear matching handshake to exchange contacts: pageloop.org`;
    alert(`SMS API Notification dispatched to Seller phone (${activeCheckoutItem.sellerPhone}):\n\n"${sellerSms}"`);
    
    pushStaffLog(`Buyer [${loggedInUser.name}] locked deal for item: "${activeCheckoutItem.title}" with platform fee deposit.`);
    checkoutModal.classList.remove("active");
    renderMarketplace();
}

/* ==========================================
   SELLER CONTROL ACTIONS & LISTING GENERATION
   ========================================= */
function renderSellerDashboard() {
    const notificationsBox = document.getElementById("sellerNotificationList");
    if (!notificationsBox) return;
    notificationsBox.innerHTML = "";

    const mySales = mockListings.filter(p => p.sellerPhone === loggedInUser.phone);
    const pendingHandshakes = mySales.filter(p => p.status === "buyer_deposited");

    if(pendingHandshakes.length === 0) {
        notificationsBox.innerHTML = `<p style="font-size:0.85rem; color:#64748b;">No active matching requests or pending lock deposits found for your listings.</p>`;
    } else {
        pendingHandshakes.forEach(p => {
            const row = `
                <div class="notification-bubble">
                    <p><i class="fa-solid fa-bell" style="color:var(--gold);"></i> <strong>Secured Match Request!</strong></p>
                    <p style="margin:0.25rem 0;">A buyer wants to secure your material: <strong>${p.title}</strong> for <strong>₹${p.negotiatedPrice}</strong>.</p>
                    <p style="font-size:0.75rem; color:#475569;">Settle your platform handshake fee of <strong>₹${getPlatformCharge(p.tier)}</strong> to immediately exchange validated contacts and close offline trades.</p>
                    <button class="btn btn-dark btn-sm" style="margin-top:0.5rem;" onclick="triggerSellerEscrowMatch(${p.id})">Clear Matching Handshake</button>
                </div>
            `;
            notificationsBox.insertAdjacentHTML("beforeend", row);
        });
    }
}

window.triggerSellerEscrowMatch = function(id) {
    if(loggedInUser.sessionUsed) {
        alert("Session lock active: Only one transaction is allowed per active session.");
        return;
    }

    const item = mockListings.find(p => p.id === id);
    activeCheckoutItem = item;
    const fee = getPlatformCharge(item.tier);

    checkoutDetails.innerHTML = `
        <h4 style="margin-bottom:0.75rem;"><i class="fa-solid fa-handshake"></i> Seller Match Clearance desk</h4>
        <div class="checkout-row"><span>Material Title:</span> <strong>${item.title}</strong></div>
        <div class="checkout-row"><span>agreed Collectible Amount (Offline):</span> <strong style="color:var(--success);">₹${item.negotiatedPrice}</strong></div>
        <div class="checkout-row" style="color:var(--accent); font-weight:800;"><span>Required Match Fee:</span> <span>₹${fee}</span></div>
        <p style="font-size:0.75rem; color:#64748b; margin-top:0.5rem;">Unlocking will dispatch verified buyer name, secure coordinates, and match codes.</p>
    `;
    
    btnGatewayAction.innerText = `Clear Platform Match Fee (₹${fee})`;
    checkoutModal.classList.add("active");
};

function processSellerPlatformPayment() {
    const fee = getPlatformCharge(activeCheckoutItem.tier);
    alert(`Verification Handshake Clear!\n\nVerified Buyer Exchange Data Opened:\n- Name: Abidur Hussain\n- Mobile Line: 7002137940\n- Target Area Code (PIN): 785640\n\nPlease proceed to meet up and safely collect your ₹${activeCheckoutItem.negotiatedPrice} offline cash/UPI!`);
    
    loggedInUser.sessionUsed = true;
    activeCheckoutItem.status = "finished"; 
    
    pushStaffLog(`Handshake system verified. Seller cleared platform fee ₹${fee}. Transaction record compiled.`);
    
    checkoutModal.classList.remove("active");
    renderSellerDashboard();
}

// Seller item listing submission handler
const sellerListForm = document.getElementById("sellerListForm");
if (sellerListForm) {
    sellerListForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if(loggedInUser.sessionUsed) {
            alert("Session Lock active: You can only upload one listing per session!");
            return;
        }

        const tier = document.getElementById("listTier").value;
        const action = document.getElementById("listAction").value;
        const price = action === "donate" ? 0 : parseFloat(document.getElementById("listPrice").value || 0);

        const newListing = {
            id: Date.now(),
            title: document.getElementById("listTitle").value,
            type: document.getElementById("listType").value,
            tier: tier,
            price: price,
            action: action,
            sellerName: loggedInUser.name,
            sellerPhone: loggedInUser.phone,
            coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400",
            platformFee: getPlatformCharge(tier),
            status: "available",
            negotiatedPrice: null
        };

        mockListings.push(newListing);
        loggedInUser.sessionUsed = true; 

        alert("Listing published successfully into PageLoop decentralized registry!");
        pushStaffLog(`New item posted: "${newListing.title}" by ${loggedInUser.name}`);
        
        sellerListForm.reset();
        renderSellerDashboard();
    });
}

// Adjust Listing Base Price input depending on Action Type (Sell vs Donate)
const listActionSelect = document.getElementById("listAction");
if (listActionSelect) {
    listActionSelect.addEventListener("change", (e) => {
        const group = document.getElementById("listPriceGroup");
        const priceInput = document.getElementById("listPrice");
        if(e.target.value === "donate") {
            group.style.opacity = "0.3";
            priceInput.disabled = true;
            priceInput.value = "";
        } else {
            group.style.opacity = "1";
            priceInput.disabled = false;
        }
    });
}

/* ==========================================
   ADMINISTRATIVE STAFF PANEL CONTROLLER
   ========================================= */
function renderStaffDashboard() {
    document.getElementById("staffUsersCount").innerText = "14 Accounts Verified";
    document.getElementById("staffListingsCount").innerText = mockListings.length;
    document.getElementById("staffEscrowsCount").innerText = "4 Handshakes";
}
