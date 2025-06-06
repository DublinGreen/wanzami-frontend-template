function mySubmit(e) { 
    e.preventDefault(); 
}

const { createApp, ref, onMounted, watch } = Vue;

createApp({
    setup() {
        const footerCopyright = getFooterDate(APP);
        const firstName = ref('');
        const lastName = ref('');
        const email = ref('');
        const password = ref('');
        const passwordConfirm = ref('');
        const passwordVisibility = ref(false);
        const emailInUse = ref(false);
        const showWarning = ref(false);
        const redirect = ref(true);
        const message = ref('');
        const role = ref('NORMAL');

        const tooglePasswordVisibility = () => {
            if(passwordVisibility.value ){
                passwordVisibility.value = false;
            }else{
                passwordVisibility.value = true;
            }
        }

        const signup = () => {
            if(password.value !== passwordConfirm.value){
                showWarning.value = true;
                message.value = "Passwords do not match.";
            }else if(emailInUse.value){
                message.value = "Email is already in use.";       
                showWarning.value = true;
            }else{
                Swal.fire({
                    title: "Creating Wanzami Account",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    timer: 5000,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading(); // This shows the built-in loading spinner
                    },
                });
                sendSignupRequest(firstName.value, lastName.value,email.value,password.value,role.value);
            }
        }

        async function sendSignupRequest(firstName,lastName, email, password, role) {
            const query = CreateUserMutation;

            const variables = {
                firstName,
                lastName,
                email,
                password,
                role
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
                    showWarning.value = true;
                    message.value = "Unable to create account.";
                } else {
                    const user = result.data?.createUser;

                    if(user){
                        localStorage.setItem("email", email);
                        Swal.fire({
                            title: "Account has been created!",
                            text: `Account has been created! Activate account by clicking on the confirmation link sent to ${user.email}`,
                            icon: "success"
                        });

                        this.email = "";
                        this.password = "";
                        this.passwordConfirm = "";
                        this.firstName = "";
                        this.lastName = "";

                        const audio = document.getElementById('myAudio');
                        audio.muted = false;

                        audio.play()
                        .then(() => {
                            console.log("Audion is playing");
                        })
                        .catch((error) => {
                            console.error("Audio playback failed:", error);
                        });
                    }else{
                        Swal.fire({
                            title: "Account creation failure",
                            text: `Something went wrong, while creating your account. Please try again later.`,
                            icon: "error"
                        });
                    } 
                }
            } catch (err) {
                console.error('Network error:', err);
            }
        }

        async function checkEmailAvailabilityRequest(email) {
            const query = FindUserByEmailQuery;

            const variables = {
                email
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
                    showWarning.value = false;
                } else {
                    const returnEmail = result.data?.userByEmail?.email;

                    if(returnEmail){
                        showWarning.value = true;
                        message.value = "Email already in use.";
                        emailInUse.value = true;
                    }else{
                        showWarning.value = false;
                        message.value = "";
                    }
                }
            } catch (err) {
                console.error('Network error:', err);
            }
        }

        watch(email, (newEmail, oldEmail) => {
            showWarning.value = false;
            message.value = "";
            emailInUse.value = false;
            
            if (newEmail && newEmail !== oldEmail) {
                checkEmailAvailabilityRequest(newEmail);
            }
        });

        watch([password, passwordConfirm], ([newPass, newConfirm]) => {
            if (newConfirm && newPass !== newConfirm) {
                
                showWarning.value = true;
                message.value = "Passwords do not match.";
            }else{
                showWarning.value = false;
            }
        });

        onMounted(() => {
            checkIfTokenIsSet();
        });

        return {
            footerCopyright,
            firstName,
            lastName,
            email,
            password,
            passwordConfirm,
            passwordVisibility,
            tooglePasswordVisibility,
            signup,
            showWarning,
            message,
            emailInUse,
        };
    }
}).mount('#appVue');
