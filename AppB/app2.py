from flask import Flask, render_template,request,jsonify,url_for
import requests, subprocess,json
from config import API_KEY,private_key,key_id

app = Flask(__name__)
# Your OpenExchangeRates API Key
API_KEY



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
    
    
    
# @app.route('/request_payment', methods=['POST'])
# def request_payment():
#     try:
#         # Get the donation amount from the request
#         donation_amount = request.json.get('donationAmount')
        
#         if not donation_amount:
#             return jsonify({'error': 'No donation amount provided'}), 400
        
#         result = subprocess.run(['node', 'request_payment.js', donation_amount], capture_output=True, text=True)
        
#         # Parse the JSON output from the script (if any)
#         output = json.loads(result.stdout)
        
#         return jsonify(output)  # Send the response back to the client
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
    
# ------------------------------------------------------
# My wallet(will be donating from)
# this action takes place after form submission

wallet_address_url = "https://ilp.interledger-test.dev/donation"
receiving_wallet_url = "https://ilp.interledger-test.dev/redcross" #hardcoded... check later



def create_authenticated_client(wallet_address_url,private_key,key_id):
    """
    This function creates an authenticated client for interacting with the payment system.
    - wallet_address_url: The URL of the wallet.
    - private_key: The private key for authentication.
    - key_id: The key identifier used with the private key.
    """

    headers = {
        'Authorization': f'Bearer {private_key}',  # Example authentication, might require JWT or another token
        'X-Key-ID': key_id
    }
    
    response = requests.post(
        wallet_address_url + '/authenticate',  # Example endpoint
        headers=headers
    )

    if response.status_code == 200:
        return response.json()  # Return the authenticated client data
    else:
        raise Exception("Authentication failed: " + response.text)


#----------------------
def get_wallet_address(client, wallet_address_url):
    """
    This function fetches the wallet address details (e.g., resource server URL, asset code, asset scale).
    - client: The authenticated client object.
    - wallet_address_url: The URL to the wallet address resource.
    """
    # Use the access token from the client to authenticate the request
    access_token = client.get('access_token', '')


    # Set up the authorization header
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    # Send the GET request to retrieve wallet address details
    response = requests.get(wallet_address_url, headers=headers)

    if response.status_code == 200:
        return response.json()  # Return the wallet address details (in JSON format)
    else:
        raise Exception("Failed to retrieve wallet address: " + response.text)

    
#----------------------
def get_wallet_balance(client, wallet_address_url):
    """
    Fetches the current balance of the wallet.
    - client: The authenticated client object.
    - wallet_address_url: The URL of the wallet address (typically includes the resource server).
    """
    # Use the access token from the client to authenticate the request
    access_token = client.get('access_token', '')

    # Set up the authorization header
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    # Assuming the wallet API has a '/balance' endpoint
    balance_url = f"{wallet_address_url}/balance"

    # Make a request to get the wallet balance
    response = requests.get(balance_url, headers=headers)

    if response.status_code == 200:
        return response.json()  # Return the balance information as JSON
    else:
        raise Exception(f"Failed to retrieve wallet balance: {response.text}")


#----------------------

def request_grant(client, auth_server_url, grant_type):
    """
    Requests a grant for the specified grant type from the authentication server.
    - client: The authenticated client object.
    - auth_server_url: The URL of the authentication server.
    - grant_type: The type of grant to request (e.g., 'incoming-payment').
    """
    access_token = client.get('access_token', '')

    # Set up the authorization header
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    # Prepare the grant request payload
    payload = {
        'grant_type': grant_type,

        # Add any other required parameters for the grant request here
    }

    # Send the request to the authentication server
    response = requests.post(auth_server_url + '/grants', json=payload, headers=headers)

    if response.status_code == 200:
        return response.json()  # Return the grant information as JSON
    else:
        raise Exception("Failed to request grant: " + response.text)

#----------------------

def create_incoming_payment(client, receiving_wallet_url, access_token, receiving_wallet_id, asset_code, asset_scale, donation_amount):
    """
    Creates an incoming payment request.
    - client
    - receiving_wallet_url: The link of the receiving wallet.
    - access_token: The access token for authentication.
    - receiving_wallet_id: The ID of the receiving wallet.
    - asset_code: The code of the asset being transferred.
    - asset_scale: The scale of the asset.
    - donation_amount.
    """
    # Set up the authorization header
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    # Prepare the payload for the incoming payment
    payload = {
        'receiving_wallet_id': receiving_wallet_id,
        'asset_code': asset_code,
        'asset_scale': asset_scale,
        'amount': donation_amount,
        # Add any other required parameters for the incoming payment request here
    }

    # Send the request to create the incoming payment
    response = requests.post(receiving_wallet_url + '/incoming-payments', json=payload, headers=headers)

    if response.status_code == 200:
        return response.json()  # Return the incoming payment details as JSON
    else:
        raise Exception("Failed to create incoming payment: " + response.text)

#----------------------


@app.route('/request_payment', methods=['POST'])
def start_payment(): #change to request_payment
    receiving_wallet_url

    donation_amount = request.json.get('donationAmount') # Get the amount from the request
    
    client = create_authenticated_client(wallet_address_url, private_key, key_id)
    sending_wallet_url = get_wallet_address(client,wallet_address_url)

    # Get wallet addresses for sending and receiving wallets
    sending_wallet_address = get_wallet_address(client, sending_wallet_url)
    receiving_wallet_address = get_wallet_address(client, receiving_wallet_url)

    # for debugging:
    print(f"Sending Wallet Address: {sending_wallet_address}")
    print(f"Receiving Wallet Address: {receiving_wallet_address}")


    # Step 1: Check wallet balance
    balance_info = get_wallet_balance(client, sending_wallet_address['resourceServer'], client['access_token'])
    available_balance = int(balance_info["balance"]['value'])  # The balance is assumed to be in the smallest currency unit (e.g., cents)

    # Convert donation_amount to match the asset scale of the wallet
    donation_amount_scaled = int(donation_amount) * (10 ** sending_wallet_address['assetScale'])
    if available_balance < donation_amount:
        print("debug purpose: ", available_balance) #delete later
        return jsonify({
            'error': 'Insufficient funds(funds greater than what you have in wallet)'
            }), 400

    if donation_amount_scaled > available_balance:
        # If the donation amount exceeds the available balance, return an error
        return render_template('error.html', message="Insufficient funds in your wallet.")


    # Step 2: Get grant for incoming payment
    incoming_payment_grant = request_grant(client, receiving_wallet_address['authServer'], 'incoming-payment')


    # creating the incoming payment from donator
    incoming_payment = create_incoming_payment(
        client,
        receiving_wallet_address['resourceServer'],
        incoming_payment_grant['access_token']['value'],
        receiving_wallet_address['id'],
        receiving_wallet_address['assetCode'],
        receiving_wallet_address['assetScale'],
        donation_amount
        )

    