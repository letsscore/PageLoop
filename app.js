// Change this URL to your deployed Render web URL once you host your server.js online
const BACKEND_URL = 'http://localhost:5000/api';

// Handle OTP Dispatch
document.getElementById('sendOtpBtn')?.addEventListener('click', async () => {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const sendOtpBtn = document.getElementById('sendOtpBtn');

    if (!phoneNumber) {
        alert('Please enter a valid phone number before requesting an OTP.');
        return;
    }

    sendOtpBtn.innerText = 'Sending...';
    sendOtpBtn.disabled = true;

    try {
        const response = await fetch(`${BACKEND_URL}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber })
        });
        const result = await response.json();

        if (result.success) {
            alert('SMS OTP sent successfully!');
            document.getElementById('otp').disabled = false;
            sendOtpBtn.innerText = 'Resend OTP';
            sendOtpBtn.disabled = false;
        } else {
            alert('Error sending OTP. Standard simulation: Set code to 9999 to test locally.');
            document.getElementById('otp').disabled = false;
            document.getElementById('otp').value = "9999";
            sendOtpBtn.innerText = 'Resend OTP';
            sendOtpBtn.disabled = false;
        }
    } catch (err) {
        console.error('Backend connection error: Running fallback mockup mode.');
        document.getElementById('otp').disabled = false;
        document.getElementById('otp').value = "9999";
        sendOtpBtn.innerText = 'Fallback (9999)';
        sendOtpBtn.disabled = false;
    }
});

// Authenticate and Redirect
document.getElementById('authGatewayForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('phoneNumber').value;
    const otpCode = document.getElementById('otp').value;
    const role = document.getElementById('userRole').value;
    const name = document.getElementById('fullName').value;

    // Fast simulation check if backend is still deploying
    if (otpCode === '9999') {
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userName', name);
        localStorage.setItem('userRole', role);
        window.location.href = `${role}.html`;
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: phone, code: otpCode })
        });
        const result = await response.json();

        if (result.success) {
            localStorage.setItem('userPhone', phone);
            localStorage.setItem('userName', name);
            localStorage.setItem('userRole', role);
            window.location.href = `${role}.html`;
        } else {
            alert('Invalid verification pin code.');
        }
    } catch (err) {
        alert('Auth Server connection offline. Fallback authorization approved.');
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userName', name);
        localStorage.setItem('userRole', role);
        window.location.href = `${role}.html`;
    }
});

// Staff Authentication Handler
document.getElementById('staffCredentialLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const adminUser = document.getElementById('staffId').value;
    const adminPass = document.getElementById('staffPassword').value;

    try {
        const res = await fetch(`${BACKEND_URL}/staff/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: adminUser, password: adminPass })
        });
        const data = await res.json();

        if (data.success) {
            document.getElementById('staffAuthWrapper').style.display = 'none';
            document.getElementById('staffDashboardShell').style.display = 'block';
        } else {
            alert('Unauthorized Access Attempt.');
        }
    } catch (error) {
        // Fallback testing values locally
        if (adminUser === 'admin' && adminPass === 'admin123') {
            document.getElementById('staffAuthWrapper').style.display = 'none';
            document.getElementById('staffDashboardShell').style.display = 'block';
        } else {
            alert('Incorrect Admin credentials.');
        }
    }
});

// Universal Session Exits
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});
document.getElementById('staffLogoutBtn')?.addEventListener('click', () => {
    window.location.href = 'index.html';
});
                                     
