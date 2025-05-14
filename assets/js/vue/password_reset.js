function mySubmit(e) { 
    e.preventDefault(); 
}

const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const footerCopyright = getFooterDate(APP);
        const password = ref('');
        const passwordConfirm = ref('');

        const passwordReset = () => {
            if(password.value !== passwordConfirm.value){
                Swal.fire({
                    title: "Password Mismatch!",
                    text: `passwords do not match`,
                    icon: "warning"
                });
            }else{
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const code = urlParams.get('code');
                const id = urlParams.get('id');

                passwordResetRequest(password.value,code);
            }
        }

        async function passwordResetRequest(password,code) {
            const query = PasswordResetMutation;

            const variables = {
                password,
                code
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

                if (result.errors) {
                    Swal.fire({
                        title: "Password Reset Error!",
                        text: `passwords reset was invalid`,
                        icon: "error"
                    });
                } else {
                    const returnBoolean = result.data?.passwordReset;

                    if(returnBoolean){
                        Swal.fire({
                            title: "Password Reset!",
                            text: `Password reset was a success, go to login and use your new password!`,
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
            password,
            passwordConfirm,
            passwordReset,
        };
    }
}).mount('#appVue');