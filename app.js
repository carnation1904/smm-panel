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

    // QR Modal close button
    const qrCloseBtn = document.getElementById('qrModalClose');
    if (qrCloseBtn) {
      qrCloseBtn.addEventListener('click', closeQrModal);
    }

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
      container.innerHTML = '<p class="no-orders">No orders yet. Place your first order!</p>';
      return;
