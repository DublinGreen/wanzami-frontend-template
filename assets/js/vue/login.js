function mySubmit(e) { 
    e.preventDefault(); 
}

const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const footerCopyright = getFooterDate(APP);
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

                    if(token){
                        localStorage.setItem("token", token);
                        localStorage.setItem("email", email);
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
