function mySubmit(e) { 
    e.preventDefault(); 
}

const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const footerCopyright = getFooterDate(LEGAL_NAME);
        const email = ref('');
        const password = ref('');
        const passwordVisibility = ref(false);
        const showWarning = ref(false);
        const redirect = ref(true);

        const tooglePasswordVisibility = () => {
            if(passwordVisibility.value ){
                passwordVisibility.value = false;
            }else{
                passwordVisibility.value = true;
            }
        }

        const login = () => {
            sendLoginRequest(email.value,password.value);
        }

        const checkIfEmailConfirmationTokenisSent = () => {
            const params = new URLSearchParams(window.location.search);

            const code = params.get('code');
            const id = parseInt(params.get('id'));

            if(params.get('code') != null && params.get('id') != null){
                Swal.fire({
                    title: "Confirming Email",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    timer: 5000,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading(); // This shows the built-in loading spinner
                    },
                });
                sendEmailConfirmationRequest(code,id);
            }
        }

        async function sendEmailConfirmationRequest(code, id) {
            const query = EmailConfirmationMutation;

            const variables = {
                code,
                id
            };

            try {
                const response = await fetch(AUTH_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables
                })
                });

                const result = await response.json();

                if (result.errors) {
                    Swal.fire({
                        title: "Account activation failed",
                        text: `Account could not be activated. Contact support`,
                        icon: "warning"
                    });
                } else {
                    const user = result.data?.confirmEmailCode;

                    if(user){
                        localStorage.setItem("email", user.email);

                        Swal.fire({
                            title: "Account has been activated!",
                            text: `${user.email} account has been activated! Login with your email and password!`,
                            icon: "success"
                        });
                    }else{
                        showWarning.value = true;
                    } 
                }
            } catch (err) {
                console.error('Network error:', err);
            }
        }

        async function sendLoginRequest(email, password) {
            const query = LoginUserMutation;

            const variables = {
                email,
                password
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
                    showWarning.value = true;
                } else {
                    const token = result.data?.login;

                    if(token === "Account not activated."){
                        Swal.fire({
                            title: "Account not activated",
                            text: "Please check your email for the activation link.",
                            icon: "warning"
                        });

                        localStorage.removeItem('token');
                        localStorage.removeItem('email');
                        return;

                    }

                    if(token){
                        localStorage.setItem("token", token);
                        localStorage.setItem("email", email);

                        email.value = "";
                        password.value = "";
                        if(redirect.value){
                            checkIfTokenIsSet();
                        }
                    }else{
                        showWarning.value = true;
                    } 
                }
            } catch (err) {
                console.error('Network error:', err);
            }
        }

        onMounted(() => {
            checkIfTokenIsSet();
            checkIfEmailConfirmationTokenisSent();
        });

        return {
            footerCopyright,
            email,
            password,
            passwordVisibility,
            tooglePasswordVisibility,
            login,
            showWarning,
        };
    }
}).mount('#appVue');
