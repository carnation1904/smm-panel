// SMM Vault Application JavaScript - Fixed Version

'use strict';

/***********************
 *  GLOBAL DATA
 **********************/
const smmData = {
  services: [
    {
      id: 1,
      platform: "Instagram",
      service: "Followers",
      description: "High Quality Instagram Followers",
      rate: "₹0.50",
      min: 100,
      max: 10000
    },
    {
      id: 2,
      platform: "Instagram", 
      service: "Likes",
      description: "Instagram Post Likes - Fast Delivery",
      rate: "₹0.25",
      min: 50,
      max: 5000
    },
    {
      id: 3,
      platform: "YouTube",
      service: "Views",
      description: "YouTube Video Views - High Retention",
      rate: "₹1.20",
      min: 1000,
      max: 100000
    },
    {
      id: 4,
      platform: "Facebook",
      service: "Page Likes",
      description: "Facebook Page Likes - Real Users",
      rate: "₹0.80",
      min: 100,
      max: 20000
    },
    {
      id: 5,
      platform: "YouTube",
      service: "Subscribers",
      description: "YouTube Channel Subscribers - Real",
      rate: "₹2.50",
      min: 50,
      max: 5000
    },
    {
      id: 6,
      platform: "Instagram",
      service: "Comments",
      description: "Instagram Custom Comments",
      rate: "₹1.00",
      min: 10,
      max: 1000
    }
  ]
};

/***********************
 *  STATE VARIABLES
 **********************/
let currentUser = null;
let userOrders = [];
let userBalance = 0;
let qrStream = null;
let selectedPaymentMethod = null;

/***********************
 *  INITIALIZATION
 **********************/
document.addEventListener('DOMContentLoaded', () => {
  console.log('SMM Vault app initialized');
  try {
    setupEventListeners();
    showPage('landing');
    loadSMMServices();
  } catch (err) {
    console.error('Init error:', err);
  }
});

/***********************
 *  EVENT LISTENERS
 **********************/
function setupEventListeners() {
  try {
    console.log('Setting up event listeners...');
    
    // Header login form
    const headerLoginForm = document.getElementById('headerLoginForm');
    if (headerLoginForm) {
      headerLoginForm.addEventListener('submit', handleHeaderLogin);
      console.log('Header login form listener added');
    }

    // Auth forms
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', handleSignup);
      console.log('Signup form listener added');
    }

    const resetForm = document.getElementById('resetForm');
    if (resetForm) {
      resetForm.addEventListener('submit', handlePasswordReset);
      console.log('Reset form listener added');
    }

    // Dashboard forms
    const addFundsForm = document.getElementById('addFundsForm');
    if (addFundsForm) {
      addFundsForm.addEventListener('submit', handleAddFunds);
      console.log('Add funds form listener added');
    }

    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', handleSettingsUpdate);
      console.log('Settings form listener added');
    }

    // Close modals when clicking backdrop
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
      }
    });

    console.log('All event listeners set up successfully');
  } catch (err) {
    console.error('Event listener setup error:', err);
  }
}

/***********************
 *  PAGE NAVIGATION
 **********************/
function showPage(pageName) {
  try {
    console.log(`Showing page: ${pageName}`);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
      p.classList.add('hidden');
    });

    // Show target page
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
      targetPage.classList.remove('hidden');
      console.log(`Page ${pageName} shown successfully`);
    } else {
      console.error(`Page ${pageName}Page not found`);
    }

    // Handle page-specific logic
    switch (pageName) {
      case 'dashboard':
        if (!currentUser) {
          showErrorModal('Please login to access dashboard');
          return;
        }
        loadDashboard();
        break;
      case 'services':
        loadSMMServices();
        break;
      default:
        break;
    }
  } catch (err) {
    console.error('Show page error:', err);
  }
}

function showDashboardTab(tabName) {
  try {
    console.log(`Showing dashboard tab: ${tabName}`);
    
    // Hide all dashboard content
    document.querySelectorAll('.dashboard-content').forEach(tab => {
      tab.classList.remove('active');
    });

    // Show target tab
    const targetTab = document.getElementById(`dashboard${capitalize(tabName)}`);
    if (targetTab) {
      targetTab.classList.add('active');
      console.log(`Dashboard tab ${tabName} shown successfully`);
    } else {
      console.error(`Dashboard tab ${tabName} not found`);
    }

    // Load tab-specific content
    switch (tabName) {
      case 'overview':
        updateDashboardStats();
        break;
      case 'services':
        loadSMMServices();
        break;
      case 'orders':
        loadOrderHistory();
        break;
      case 'settings':
        loadUserSettings();
        break;
      default:
        break;
    }
  } catch (err) {
    console.error('Dashboard tab error:', err);
  }
}

/***********************
 *  AUTHENTICATION
 **********************/
function handleHeaderLogin(e) {
  e.preventDefault();
  console.log('Header login form submitted');
  
  try {
    const email = document.getElementById('headerEmail').value;
    const password = document.getElementById('headerPassword').value;

    console.log(`Login attempt for email: ${email}`);

    if (!email || !password) {
      showErrorModal('Please enter both email and password');
      return;
    }

    // Simulate login
    currentUser = {
      id: Date.now(),
      name: email.split('@')[0],
      email: email,
      joinDate: new Date().toISOString().split('T')[0]
    };

    userBalance = 100.00; // Starting balance
    userOrders = [];

    console.log('Login successful, user created:', currentUser);

    showSuccessModal('Login Successful', 'Redirecting to dashboard...');
    setTimeout(() => {
      closeModal('successModal');
      showPage('dashboard');
    }, 1500);

  } catch (err) {
    console.error('Header login error:', err);
    showErrorModal('Login failed');
  }
}

function handleSignup(e) {
  e.preventDefault();
  console.log('Signup form submitted');
  
  try {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const agree = document.getElementById('agreeTerms').checked;

    if (!name || !email || !password || !agree) {
      showErrorModal('Please complete all fields and accept terms');
      return;
    }

    currentUser = {
      id: Date.now(),
      name: name,
      email: email,
      joinDate: new Date().toISOString().split('T')[0]
    };

    userBalance = 0.00;
    userOrders = [];

    console.log('Signup successful, user created:', currentUser);

    showSuccessModal('Account Created', 'Welcome to SMM Vault!');
    setTimeout(() => {
      closeModal('successModal');
      showPage('dashboard');
    }, 1500);

  } catch (err) {
    console.error('Signup error:', err);
    showErrorModal('Signup failed');
  }
}

function handlePasswordReset(e) {
  e.preventDefault();
  console.log('Password reset form submitted');
  
  try {
    const email = document.getElementById('resetEmail').value;
    if (!email) {
      showErrorModal('Please enter your email address');
      return;
    }

    showSuccessModal('Reset Link Sent', 'Check your email for reset instructions');
    setTimeout(() => {
      closeModal('successModal');
      showPage('landing');
    }, 2000);

  } catch (err) {
    console.error('Password reset error:', err);
  }
}

function logout() {
  try {
    console.log('User logging out');
    currentUser = null;
    userBalance = 0;
    userOrders = [];
    selectedPaymentMethod = null;
    showPage('landing');
    showSuccessModal('Logged Out', 'You have been logged out successfully');
  } catch (err) {
    console.error('Logout error:', err);
  }
}

/***********************
 *  DASHBOARD
 **********************/
function loadDashboard() {
  try {
    console.log('Loading dashboard for user:', currentUser);
    
    // Update user name in dashboard
    const userNameEl = document.getElementById('dashboardUserName');
    if (userNameEl && currentUser) {
      userNameEl.textContent = currentUser.name;
    }

    // Show overview tab by default
    showDashboardTab('overview');
    updateDashboardStats();
  } catch (err) {
    console.error('Load dashboard error:', err);
  }
}

function updateDashboardStats() {
  try {
    // Update balance
    const balanceEl = document.getElementById('userBalance');
    if (balanceEl) {
      balanceEl.textContent = userBalance.toFixed(2);
    }

    // Update order counts
    const totalOrdersEl = document.getElementById('totalOrders');
    const completedOrdersEl = document.getElementById('completedOrders');
    const pendingOrdersEl = document.getElementById('pendingOrders');

    if (totalOrdersEl) totalOrdersEl.textContent = userOrders.length;
    if (completedOrdersEl) {
      completedOrdersEl.textContent = userOrders.filter(o => o.status === 'Completed').length;
    }
    if (pendingOrdersEl) {
      pendingOrdersEl.textContent = userOrders.filter(o => o.status === 'Pending').length;
    }

    // Update recent orders
    loadRecentOrders();
  } catch (err) {
    console.error('Update stats error:', err);
  }
}

function loadRecentOrders() {
  try {
    const container = document.getElementById('recentOrdersList');
    if (!container) return;

    if (userOrders.length === 0) {
      container.innerHTML = '<p>No orders yet. <a href="#" onclick="showDashboardTab(\'services\')">Place your first order</a></p>';
      return;
    }

    const recentOrders = userOrders.slice(0, 5);
    container.innerHTML = recentOrders.map(order => `
      <div class="order-item">
        <div class="order-info">
          <h4>${order.platform} ${order.service}</h4>
          <p class="order-details">Quantity: ${order.quantity} • ${order.date}</p>
        </div>
        <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Load recent orders error:', err);
  }
}

/***********************
 *  SMM SERVICES
 **********************/
function loadSMMServices() {
  try {
    const container = document.getElementById('smmServicesList');
    if (!container) return;

    container.innerHTML = smmData.services.map(service => `
      <div class="service-card" onclick="orderService(${service.id})">
        <div class="service-header">
          <div class="service-info">
            <h3>${service.platform} ${service.service}</h3>
            <p class="service-platform">${service.platform}</p>
          </div>
          <div class="service-rate">${service.rate}</div>
        </div>
        <div class="service-description">${service.description}</div>
        <div class="service-meta">
          <span>Min: ${service.min}</span>
          <span>Max: ${service.max}</span>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Load services error:', err);
  }
}

function orderService(serviceId) {
  try {
    console.log(`Ordering service ${serviceId}`);
    
    const service = smmData.services.find(s => s.id === serviceId);
    if (!service) return;

    const quantity = prompt(`Enter quantity (${service.min} - ${service.max}):`);
    if (!quantity || isNaN(quantity)) return;

    const qty = parseInt(quantity);
    if (qty < service.min || qty > service.max) {
      showErrorModal(`Quantity must be between ${service.min} and ${service.max}`);
      return;
    }

    const link = prompt('Enter target URL/link:');
    if (!link) return;

    const rate = parseFloat(service.rate.replace('₹', ''));
    const total = (rate * qty).toFixed(2);

    if (userBalance < total) {
      showErrorModal('Insufficient balance. Please add funds.');
      showDashboardTab('funds');
      return;
    }

    // Create order
    const order = {
      id: Date.now(),
      platform: service.platform,
      service: service.service,
      quantity: qty,
      link: link,
      rate: rate,
      total: total,
      status: 'Pending',
      date: new Date().toLocaleDateString()
    };

    userOrders.unshift(order);
    userBalance -= parseFloat(total);

    console.log('Order created:', order);

    showSuccessModal('Order Placed', `Your order for ${qty} ${service.service} has been placed successfully!`);
    updateDashboardStats();

    // Simulate order processing
    setTimeout(() => {
      order.status = 'Processing';
      updateDashboardStats();
    }, 3000);

    setTimeout(() => {
      order.status = 'Completed';
      updateDashboardStats();
    }, 10000);

  } catch (err) {
    console.error('Order service error:', err);
    showErrorModal('Failed to place order');
  }
}

/***********************
 *  PAYMENT & FUNDS
 **********************/
function selectPaymentMethod(method) {
  try {
    console.log(`Selecting payment method: ${method}`);
    
    // Clear previous selections
    document.querySelectorAll('.payment-method').forEach(pm => {
      pm.classList.remove('selected');
    });

    // Select clicked method
    event.currentTarget.classList.add('selected');
    selectedPaymentMethod = method;

    if (method === 'qr') {
      setTimeout(openQRScanner, 500);
    }
  } catch (err) {
    console.error('Payment method selection error:', err);
  }
}

function handleAddFunds(e) {
  e.preventDefault();
  console.log('Add funds form submitted');
  
  try {
    const amount = parseFloat(document.getElementById('fundAmount').value);
    
    if (!amount || amount < 100) {
      showErrorModal('Minimum deposit amount is ₹100');
      return;
    }

    if (!selectedPaymentMethod) {
      showErrorModal('Please select a payment method');
      return;
    }

    // Simulate payment processing
    showSuccessModal('Payment Processing', 'Please wait...');
    
    setTimeout(() => {
      userBalance += amount;
      updateDashboardStats();
      closeModal('successModal');
      showSuccessModal('Funds Added', `₹${amount} has been added to your account`);
      document.getElementById('fundAmount').value = '';
      
      // Clear payment method selection
      document.querySelectorAll('.payment-method').forEach(pm => {
        pm.classList.remove('selected');
      });
      selectedPaymentMethod = null;
    }, 2000);

  } catch (err) {
    console.error('Add funds error:', err);
    showErrorModal('Failed to add funds');
  }
}

/***********************
 *  QR SCANNER
 **********************/
function openQRScanner() {
  try {
    console.log('Opening QR scanner');
    
    const modal = document.getElementById('qrScannerModal');
    if (modal) {
      modal.classList.remove('hidden');
    }

    const video = document.getElementById('qrVideo');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showErrorModal('Camera not supported on this device');
      return closeQRScanner();
    }

    navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    })
    .then(stream => {
      qrStream = stream;
      if (video) {
        video.srcObject = stream;
        video.play();
      }
      
      // Simulate QR code detection after 3 seconds
      setTimeout(simulateQRDetection, 3000);
    })
    .catch(err => {
      console.error('Camera error:', err);
      showErrorModal('Camera permission denied');
      closeQRScanner();
    });

  } catch (err) {
    console.error('QR scanner error:', err);
  }
}

function simulateQRDetection() {
  try {
    console.log('QR code detected');
    closeQRScanner();
    showSuccessModal('QR Code Detected', 'Payment information captured successfully');
    
    setTimeout(() => {
      closeModal('successModal');
    }, 1500);
  } catch (err) {
    console.error('QR detection error:', err);
  }
}

function closeQRScanner() {
  try {
    console.log('Closing QR scanner');
    
    const modal = document.getElementById('qrScannerModal');
    if (modal) {
      modal.classList.add('hidden');
    }

    if (qrStream) {
      qrStream.getTracks().forEach(track => track.stop());
      qrStream = null;
    }

    const video = document.getElementById('qrVideo');
    if (video) {
      video.srcObject = null;
    }
  } catch (err) {
    console.error('Close QR scanner error:', err);
  }
}

/***********************
 *  ORDER HISTORY
 **********************/
function loadOrderHistory() {
  try {
    const container = document.getElementById('orderHistoryList');
    if (!container) return;

    if (userOrders.length === 0) {
      container.innerHTML = '<p>No orders yet.</p>';
      return;
    }

    container.innerHTML = userOrders.map(order => `
      <div class="order-item">
        <div class="order-info">
          <h4>${order.platform} ${order.service}</h4>
          <p class="order-details">
            Quantity: ${order.quantity} • Rate: ₹${order.rate} • Total: ₹${order.total}
          </p>
          <p class="order-details">Date: ${order.date}</p>
          <p class="order-details">Link: ${order.link}</p>
        </div>
        <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Load order history error:', err);
  }
}

/***********************
 *  SETTINGS
 **********************/
function loadUserSettings() {
  try {
    if (!currentUser) return;

    const nameEl = document.getElementById('settingsName');
    const emailEl = document.getElementById('settingsEmail');

    if (nameEl) nameEl.value = currentUser.name;
    if (emailEl) emailEl.value = currentUser.email;
  } catch (err) {
    console.error('Load settings error:', err);
  }
}

function handleSettingsUpdate(e) {
  e.preventDefault();
  console.log('Settings update form submitted');
  
  try {
    const name = document.getElementById('settingsName').value;
    const email = document.getElementById('settingsEmail').value;
    const password = document.getElementById('settingsPassword').value;

    if (!name || !email) {
      showErrorModal('Please fill in required fields');
      return;
    }

    // Update user data
    currentUser.name = name;
    currentUser.email = email;

    // Update dashboard display
    const userNameEl = document.getElementById('dashboardUserName');
    if (userNameEl) {
      userNameEl.textContent = name;
    }

    showSuccessModal('Settings Updated', 'Your account settings have been saved');
    
    // Clear password field
    document.getElementById('settingsPassword').value = '';

  } catch (err) {
    console.error('Settings update error:', err);
    showErrorModal('Failed to update settings');
  }
}

/***********************
 *  FAQ FUNCTIONALITY
 **********************/
function toggleFAQ(element) {
  try {
    console.log('FAQ item clicked');
    
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      faqItem.classList.add('active');
      console.log('FAQ item opened');
    } else {
      console.log('FAQ item closed');
    }
  } catch (err) {
    console.error('FAQ toggle error:', err);
  }
}

/***********************
 *  MODALS
 **********************/
function showSuccessModal(title, message) {
  try {
    console.log(`Showing success modal: ${title} - ${message}`);
    
    const titleEl = document.getElementById('successTitle');
    const messageEl = document.getElementById('successMessage');
    const modal = document.getElementById('successModal');

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    if (modal) modal.classList.remove('hidden');
  } catch (err) {
    console.error('Success modal error:', err);
  }
}

function showErrorModal(message) {
  try {
    console.log(`Showing error modal: ${message}`);
    
    const messageEl = document.getElementById('errorMessage');
    const modal = document.getElementById('errorModal');

    if (messageEl) messageEl.textContent = message;
    if (modal) modal.classList.remove('hidden');
  } catch (err) {
    console.error('Error modal error:', err);
  }
}

function closeModal(modalId) {
  try {
    console.log(`Closing modal: ${modalId}`);
    
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  } catch (err) {
    console.error('Close modal error:', err);
  }
}

/***********************
 *  UTILITY FUNCTIONS
 **********************/
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/***********************
 *  GLOBAL EXPORTS
 **********************/
window.showPage = showPage;
window.showDashboardTab = showDashboardTab;
window.logout = logout;
window.orderService = orderService;
window.selectPaymentMethod = selectPaymentMethod;
window.openQRScanner = openQRScanner;
window.closeQRScanner = closeQRScanner;
window.closeModal = closeModal;
window.toggleFAQ = toggleFAQ;
