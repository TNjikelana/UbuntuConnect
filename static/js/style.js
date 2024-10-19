document.addEventListener("DOMContentLoaded", function() {
    const submitBtn = document.getElementById('submit-btn');
    
    submitBtn.addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const amount = document.getElementById('amount').value;

        if (!amount || amount <= 0) {
            alert('Please enter a valid donation amount.');
        } else {
            alert(`Thank you for donating R${amount} to ${name}!`);
        }
    });
});
