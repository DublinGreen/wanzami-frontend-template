function mySubmit(e) { 
    e.preventDefault(); 
}

const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const footerCopyright = getFooterDate(APP);
        const email = ref('');
        const showWarning = ref(false);

        const passwordReset = () => {
            passwordResetRequest(email.value);
        }

        async function passwordResetRequest(email) {
            const query = PasswordResetRequestMutation;

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
                    Swal.fire({
                        title: "Password Reset Request failed",
                        text: `Password reset request failed. Contact support`,
                        icon: "warning"
                    });
                } else {
                    const returnBoolean = result.data?.passwordResetRequest;

                    if(returnBoolean){
                        Swal.fire({
                            title: "Password Reset Request!",
                            text: `A password reset request link has been sent to ${email}`,
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
            showWarning,
        };
    }
}).mount('#appVue');