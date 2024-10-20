// sample.js

function showDetails(title, description) {
    document.getElementById('ngo-title').innerText = title;
    document.getElementById('ngo-description').innerText = description;
    document.getElementById('ngo-details').style.display = 'block';
 }
 
 function openDonationForm() {
    document.getElementById('donation-modal').style.display = 'block';
 }
 
 // Function to show news details
 function showNewsDetails(title, content) {
    document.getElementById('news-title').innerText = title;
    document.getElementById('news-content').innerText = content;
    document.getElementById('news-details').style.display = 'block';
 }
 
 // Close buttons functionality
 document.querySelectorAll('.close').forEach(function(closeBtn) {
    closeBtn.onclick = function() {
        this.parentElement.style.display = 'none';
    };
 });
 
 // Function to open login modal
 document.getElementById('login-link').onclick = function() {
    document.getElementById('login-modal').style.display = 'block';
 };
 
 // Function to open register modal
 document.getElementById('register-link').onclick = function() {
    document.getElementById('register-modal').style.display = 'block';
 };