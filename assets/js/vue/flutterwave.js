function payWithFlutterwave() {
    let country = localStorage.getItem('country_name');
    if (country !== "Nigeria") {
        country = "*";
    }

    let status = null;
    let reference = null;
    let currency = null;
    let amount = null;
    let transactionStatus = null;
    let channel = null;
    let email = localStorage.getItem('email');

    const urlParams = new URLSearchParams(window.location.search);
    let videoId = parseInt(urlParams.get('ia'));
    let videoName = urlParams.get('na');

    // Generate unique transaction reference (your tx_ref)
    let txRef = 'FLW_' + Math.floor((Math.random() * 1000000000) + 1);

    FlutterwaveCheckout({
        public_key: "FLWPUBK-f5a66706c4dc4385078a17169c1c65f6-X", // Replace with your real key
        tx_ref: txRef,
        amount : priceCollection[country].price,
        currency: priceCollection[country].currency,
        payment_options: "card, mobilemoney, ussd",
        customer: {
            email: email,
        },
        callback: function (response) {
            console.log("Flutterwave response: ", response);

            // ✅ Use transaction_id for verification
            let serverResponse = verifyPaymentReference(
                VerifyPaymentRequestQuery,
                { "reference": "FLW_" + response.transaction_id } // numeric id for /verify
            );

            serverResponse
                .then(result => {
                    const parsed = parseDoubleEncodedJson(result.data.verifyPayment);
                    console.log("Parsed verification: ", parsed);

                    if (parsed.status === "success") {
                        status = parsed.status;
                        reference = parsed.data.tx_ref || parsed.data.flw_ref;
                        amount = String(parsed.data.amount);
                        currency = parsed.data.currency;
                        transactionStatus = parsed.data.status;
                        channel = parsed.data.payment_type || "flutterwave";

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
                    } else {
                        console.error("Payment not successful:", parsed);
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
