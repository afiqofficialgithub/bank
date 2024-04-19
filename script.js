// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
});

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const stayLoggedIn = document.getElementById('stay-logged-in').checked;

  // Fetch user credentials from JSON file
  fetch('users.json')
      .then(response => response.json())
      .then(users => {
          const user = users.find(user => user.email === email && user.password === password);
          if (user) {
              // Set cookie to remember login
              const expiry = stayLoggedIn ? ';expires=' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString() : '';
              document.cookie = `loggedInUser=${user.email}${expiry};path=/`;
              // Simulate loading and redirect to profile page
              simulateLoading();
          } else {
              const errorMessage = document.getElementById('error-message');
              errorMessage.textContent = 'Invalid email or password';
          }
      })
      .catch(error => console.error('Error fetching users:', error));
});

// Function to check login status
function checkLoginStatus() {
  const loggedInUser = getCookie('loggedInUser');
  if (loggedInUser) {
      // Fetch user details and display on profile page
      fetch('users.json')
          .then(response => response.json())
          .then(users => {
              const user = users.find(user => user.email === loggedInUser);
              if (user) {
                  displayUserDetails(user);
                  // Add event listeners to buttons
                  document.getElementById('transfer-cash-btn').addEventListener('click', transferCash);
                  document.getElementById('cash-in-btn').addEventListener('click', cashIn);
                  document.getElementById('cash-out-btn').addEventListener('click', cashOut);
              } else {
                  console.error('User not found');
              }
          })
          .catch(error => console.error('Error fetching users:', error));
  }
}

// Function to display user details
function displayUserDetails(user) {
  const userDetailsContainer = document.getElementById('user-details');
  userDetailsContainer.innerHTML = `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>money:</strong> ${user.Balance}</p>
  `;
}

// Function to get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Simulate loading function
function simulateLoading() {
  var loader = document.createElement("div");
  loader.classList.add("loader");
  document.body.appendChild(loader);

  // Simulate loading for 3 seconds
  setTimeout(function() {
      loader.remove(); // Remove the loader after 3 seconds
      redirectToProfilePage();
  }, 3000);
}

// Redirect to profile page function
function redirectToProfilePage() {
  // Redirect to the profile page
  window.location.href = "profile.html";
}
