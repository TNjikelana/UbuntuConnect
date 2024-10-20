from flask import Flask, render_template,request,jsonify
import requests, subprocess,json


app = Flask(__name__)
# Your OpenExchangeRates API Key
API_KEY = 'd9b9fe7f6f5042c7b67dc542fa7097b9'

organizations = {
    'RedCross': 'EUR',
    'UNICEF': 'USD',
    'SPCA': 'ZAR'
}

@app.route('/')
def hello_world():
    return render_template('structure.html')


# Route to render the donation form
@app.route('/donate')
def donation():
    return render_template('donateUpdate.html', organizations=organizations)

# Route to handle the conversion request
@app.route('/convert', methods=['POST'])
def convert_currency():
    try:
        # Get the data from the POST request
        from_currency = request.form.get('fromCurrency')
        organization = request.form.get('organization')
        amount = float(request.form.get('amount'))

        # Get the organization's currency from the organizations dictionary
        to_currency = organizations[organization]

        # Fetch the exchange rate from OpenExchangeRates API
        url = f'https://openexchangerates.org/api/latest.json?app_id={API_KEY}&symbols={from_currency},{to_currency}'
        response = requests.get(url)
        data = response.json()

        # Calculate the rate from 'fromCurrency' to USD (if fromCurrency is not USD)
        from_rate = 1 if from_currency == 'USD' else 1 / data['rates'][from_currency]

        # Calculate the rate from USD to 'toCurrency'
        to_rate = data['rates'][to_currency]

        # Effective rate from 'fromCurrency' to 'toCurrency'
        exchange_rate = from_rate * to_rate
        converted_amount = round(amount * exchange_rate, 2)

        # Send the result back as JSON
        return jsonify({
            'convertedAmount': converted_amount,
            'toCurrency': to_currency,
            'organization': organization
        })

    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route('/request_payment', methods=['POST'])
def request_payment():
    try:
        # Get the donation amount from the request
        donation_amount = request.json.get('donationAmount')
        
        if not donation_amount:
            return jsonify({'error': 'No donation amount provided'}), 400
        
        result = subprocess.run(['node', 'request_payment.js', donation_amount], capture_output=True, text=True)
        
        # Parse the JSON output from the script (if any)
        output = json.loads(result.stdout)
        
        return jsonify(output)  # Send the response back to the client
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
    
# .