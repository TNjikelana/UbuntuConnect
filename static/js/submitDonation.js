async function submitDonation() {
    const donationAmount = document.getElementById('donationAmount').value;

    const response = await fetch('/request_payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ donationAmount }),
    });

    const result = await response.json();
    console.log(result);
}
