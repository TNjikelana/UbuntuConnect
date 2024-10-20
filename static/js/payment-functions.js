async function submitPayment() {
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;

    try {
        const response = await fetch('https://your-interledger-endpoint/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency })
        });

        const responseData = await response.json();

        if (response.ok) {
            alert('Payment successful: ' + responseData.message);
        } else {
            alert('Payment failed: ' + responseData.error);
        }
    } catch (error) {
        console.error('Error with payment processing:', error);
        alert('Error processing payment.');
    }
}
