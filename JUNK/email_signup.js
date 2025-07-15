function mySubmit(e) { 
    e.preventDefault(); 
}

const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const footerCopyright = getFooterDate(LEGAL_NAME);
        const email = ref('');

        const passwordReset = () => {
            passwordResetRequest(email.value);
        }

        async function passwordResetRequest(email) {
            const query = PasswordResetMutation;

            const variables = {
                email
            };

            try {
                const response = await fetch(AUTH_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authorization headers if needed
                },
                body: JSON.stringify({
                    query,
                    variables
                })
                });

                const result = await response.json();
                console.log(result);

                if (result.errors) {
                    showWarning.value = true;
                } else {
                    const returnBoolean = result.data?.passwordReset;

                    if(returnBoolean){
                        Swal.fire({
                            title: "Password Request!",
                            text: `A password request link has been sent to ${email}`,
                            icon: "success"
                        });
                    }
                }
            } catch (err) {
                console.error('Network error:', err);
            }
        }

        onMounted(() => {
        });

        return {
            footerCopyright,
            email,
            passwordReset,
        };
    }
}).mount('#appVue');