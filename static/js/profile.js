let totalDonations = 0; // Initialize total donations
let membersCount = 0; // Initialize member count

document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value; // Password not used in this example for simplicity
    const description = document.getElementById('description').value;

    // Handle image upload (for demonstration purposes only)
    const profileImage = document.getElementById('profileImage').files[0];
    
    // Create profile display
    const profileDisplay = document.getElementById('profileDisplay');
    
    // Clear previous profile display
    profileDisplay.innerHTML = '';

    // Create profile card
    const profileCard = document.createElement('div');
    
     // Display image if uploaded
     if (profileImage) {
        const imgURL = URL.createObjectURL(profileImage);
        profileCard.innerHTML += `<img src="${imgURL}" alt="${username}'s Profile Image" class="profile-image">`;
     }
    
     profileCard.classList.add('profile-card');
     profileCard.innerHTML += `
        <h2>${username}</h2>
        <p>Email: ${email}</p>
        <p>Phone Number: ${phone}</p>
        <p>Members Count: ${membersCount}</p> <!-- Displaying members count -->
        <p>Total Donations Received: $${totalDonations}</p> <!-- Displaying total donations -->
        <p>Description: ${description}</p>
        <button onclick="deleteProfile()">Delete Profile</button>
     `;
    
     profileDisplay.appendChild(profileCard);
});

// Function to delete the profile with confirmation
function deleteProfile() {
   if (confirm("Are you sure you want to delete this profile?")) {
       document.getElementById('profileDisplay').innerHTML = '';
       document.getElementById('profileForm').reset();
       totalDonations = 0; // Reset donations on delete
       membersCount = 0; // Reset members count on delete
   }
}

// Handle donations
document.getElementById('donationForm').addEventListener('submit', function(event) {
   event.preventDefault();
   
   const donationAmount = parseFloat(document.getElementById('donationAmount').value);

   if (!isNaN(donationAmount) && donationAmount > 0) {
       totalDonations += donationAmount; // Increment total donations
       membersCount++; // Increment member count for each donation

       alert(`Donation of $${donationAmount} added!`);
       document.getElementById('donationForm').reset(); // Reset donation form

       // Update the profile display to reflect new totals
       updateProfileDisplay();
   } else {
       alert("Please enter a valid donation amount.");
   }
});

// Function to update the displayed profile with new totals
function updateProfileDisplay() {
   const profileDisplay = document.getElementById('profileDisplay');
   if (profileDisplay.firstChild) { // Check if a profile exists
       const profileCard = profileDisplay.firstChild; 
       profileCard.querySelector("p:nth-child(5)").innerText = `Members Count: ${membersCount}`;
       profileCard.querySelector("p:nth-child(6)").innerText = `Total Donations Received: $${totalDonations}`;
   }
}