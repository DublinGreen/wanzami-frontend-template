function payWithFlutterwave() {
    let country = localStorage.getItem('country_name');
    if (country !== "Nigeria") {
        country = "*";
    }

    // Variables to be set after verification
    let status = null;
    let reference = null;
    let currency = null;
    let amount = null;
    let transactionStatus = null;
    let channel = null;
    let email = localStorage.getItem('email');

    const urlParams = new URLSearchParams(window.location.search);
    let videoId = parseInt(urlParams.get('ia'));
    let videoName = parseInt(urlParams.get('na'));


    // Generate unique transaction reference (better if backend provides this)
    let txRef = 'FLW_' + Math.floor((Math.random() * 1000000000) + 1);

    FlutterwaveCheckout({
        public_key: "H6Jbpgq12cTBTgQWxC8m5IYxgE1nD1It", // Replace with your public key
        tx_ref: txRef,
        amount: priceCollection[country].price, // in currency units, not kobo
        currency: priceCollection[country].currency,
        payment_options: "card, mobilemoney, ussd",
        customer: {
            email: email,
        },
        callback: function (response) {
            console.log("Flutterwave response: ", response);

            // Verify payment from backend
            let serverResponse = verifyPaymentReference(
                VerifyPaymentRequestQuery,
                { "reference": response.tx_ref } // tx_ref from Flutterwave
            );

            serverResponse
                .then(result => {
                    const parsed = parseDoubleEncodedJson(result.data.verifyPayment);
                    console.log("Parsed verification: ", parsed);

                    if (parsed.status) {
                        status = parsed.status;
                        reference = parsed.data.tx_ref || parsed.data.flw_ref;
                        amount = String(parsed.data.amount);
                        currency = parsed.data.currency;
                        transactionStatus = parsed.data.status;
                        channel = parsed.data.payment_type || "Unknown";

                        // Log payment in backend
                        let logResponse = sendSuccessPaymentLog(
                            CreateVideoPaymentMutation,
                            {
                                "video_id": videoId,
                                "email": email,
                                "reference": reference,
                                "amount": amount,
                                "currency": currency,
                                "transaction_status": transactionStatus,
                                "channel": channel,
                            }
                        );

                        logResponse
                            .then(() => {
                                location.reload();
                            })
                            .catch(error => {
                                console.error("Error logging payment:", error);
                            });
                    }
                })
                .catch(error => {
                    console.error("Error verifying payment:", error);
                });
        },
        onclose: function () {
            alert("Transaction was not completed, window closed.");
        },
        customizations: {
            title: "Wanzami Entertainment",
            description: "Payment for film: " + videoName,
            logo: "https://www.wanzami.tv/assets/images/logo.png",
        },
    });
}