function payWithPaystack(){
    let country = localStorage.getItem('country_name') || '*';
    let status = null;
    let reference = null;
    let currency = null;
    let email = localStorage.getItem('email');
    let transactionStatus = null;
    let channel = null;
    const urlParams = new URLSearchParams(window.location.search);
    let videoId = parseInt(urlParams.get('ia'));

    var handler = PaystackPop.setup({
        key: PAYSTACK_KEY, // Replace with your public key
        email: localStorage.getItem('email'),
        amount: priceCollection[country].price * 100, // Amount in kobo (i.e. ₦5000)
        currency: priceCollection[country].currency,
        ref: '' + Math.floor((Math.random() * 1000000000) + 1),
        callback: function(response){
            // Send `response.reference` to your backend to verify
            // alert('Payment successful. Reference: ' + response.reference);
            console.log("response: " + JSON.stringify(response));
            
            let serverResponse = verifyPaymentReference(VerifyPaymentRequestQuery,{"reference": response.reference});
            serverResponse
            .then(result => {
                const parsed = parseDoubleEncodedJson(result.data.verifyPayment);
                console.log(JSON.stringify(parsed));

                if(parsed.status){
                    status = parsed.status;
                    reference = parsed.data.reference;
                    amount = String(parsed.data.amount);
                    currency = priceCollection[country].currency;
                    transactionStatus =  parsed.data.gateway_response;
                    channel = parsed.data.channel;

                    let serverResponseAfterSendingLog = sendSuccessPaymentLog(CreateVideoPaymentMutation,{
                        "video_id" : videoId,
                        "email" : email,
                        "reference" : reference,
                        "amount" : amount,
                        "currency" : currency,
                        "transaction_status" : transactionStatus,
                        "channel" : channel,
                    });

                    serverResponseAfterSendingLog.then(result => {
                        location.reload();
                    })
                    .catch(error => {
                        console.error(error);
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
        },
        onClose: function(){
            alert('Transaction was not completed, window closed.');
        }
    });
    handler.openIframe();
    }