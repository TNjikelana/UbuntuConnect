import {
    createAuthenticatedClient,
    OpenPaymentsClientError,
    isFinalizedGrant,
} from "@interledger/open-payments";
import readline from "readline/promises";

// Get the donation amount from the command-line argument
const donationAmount = process.argv[2];

(async () => {
    if (!donationAmount) {
        console.error("Donation amount is required");
        process.exit(1);
    }

    const client = await createAuthenticatedClient({
        walletAddressUrl: "https://ilp.interledger-test.dev/donation",
        privateKey: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSUkzQ1FJcmJzbnFDUWYxM2ZlcTdRR1lzTDQ5TStrTGVUVk4xYVdMRldUU1YKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ==",
        keyId: "3fbcf72b-0b49-4a41-a7dc-5b6509dbbdb3",
    });

    const sendingWalletAddress = await client.walletAddress.get({
        url: "https://ilp.interledger-test.dev/donation",
    });
    const receivingWalletAddress = await client.walletAddress.get({
        url: "https://ilp.interledger-test.dev/redcross",
    });

    console.log(
        "Got wallet addresses. Setting up payment between sending and receiving wallet address",
        { receivingWalletAddress, sendingWalletAddress }
    );

    // Step 1: Get a grant for the incoming payment
    const incomingPaymentGrant = await client.grant.request(
        {
            url: receivingWalletAddress.authServer,
        },
        {
            access_token: {
                access: [
                    {
                        type: "incoming-payment",
                        actions: ["read", "complete", "create"],
                    },
                ],
            },
        }
    );

    console.log(
        "\nStep 1: got incoming payment grant for receiving wallet address",
        incomingPaymentGrant
    );

    // Step 2: Create the incoming payment using the dynamic donation amount
    const incomingPayment = await client.incomingPayment.create(
        {
            url: receivingWalletAddress.resourceServer,
            accessToken: incomingPaymentGrant.access_token.value,
        },
        {
            walletAddress: receivingWalletAddress.id,
            incomingAmount: {
                assetCode: receivingWalletAddress.assetCode,
                assetScale: receivingWalletAddress.assetScale,
                value: donationAmount, // Using the dynamic donation amount here
            },
        }
    );

    console.log(
        "\nStep 2: created incoming payment on receiving wallet address",
        incomingPayment
    );
  
    // Step 3: Get a quote grant, so we can create a quote on the sending wallet address
    const quoteGrant = await client.grant.request(
      {
        url: sendingWalletAddress.authServer,
      },
      {
        access_token: {
          access: [
            {
              type: "quote",
              actions: ["create", "read"],
            },
          ],
        },
      }
    );
  
    console.log(
      "\nStep 3: got quote grant on sending wallet address",
      quoteGrant
    );
  
    // Step 4: Create a quote, this gives an indication of how much it will cost to pay into the incoming payment
    const quote = await client.quote.create(
      {
        url: sendingWalletAddress.resourceServer,
        accessToken: quoteGrant.access_token.value,
      },
      {
        walletAddress: sendingWalletAddress.id,
        receiver: incomingPayment.id,
        method: "ilp",
      }
    );
  
    console.log("\nStep 4: got quote on sending wallet address", quote);
  
    // Step 5: Start the grant process for the outgoing payments.
    // This is an interactive grant: the user (in this case, you) will need to accept the grant by navigating to the outputted link.
    const outgoingPaymentGrant = await client.grant.request(
      {
        url: sendingWalletAddress.authServer,
      },
      {
        access_token: {
          access: [
            {
              type: "outgoing-payment",
              actions: ["read", "create"],
              limits: {
                debitAmount: {
                  assetCode: quote.debitAmount.assetCode,
                  assetScale: quote.debitAmount.assetScale,
                  value: quote.debitAmount.value,
                },
              },
              identifier: sendingWalletAddress.id,
            },
          ],
        },
        interact: {
          start: ["redirect"],
          // finish: {
          //   method: "redirect",
          //   // This is where you can (optionally) redirect a user to after going through interaction.
          //   // Keep in mind, you will need to parse the interact_ref in the resulting interaction URL,
          //   // and pass it into the grant continuation request.
          //   uri: "https://example.com",
          //   nonce: crypto.randomUUID(),
          // },
        },
      }
    );