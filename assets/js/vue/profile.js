function mySubmit(e) { 
    e.preventDefault(); 
}

const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const footerCopyRight = ref(getFooterDate(APP));
        const appName = ref(APP);
        const country = ref();
        const email = ref();
        const gender = ref();
        const day = ref();
        const month = ref();
        const message = ref();
        const userMeta = ref();
        const showWarning = ref(false);

        const getCopyright = () => {
            return `${footerCopyRight.value}`;
        }

        // Function to call GraphQL API
        const fetchGraphQL = async (query, variables = {}) => {
            let token = localStorage.getItem("token");

            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });

            return response.json();
        };

        // Function to call GraphQL API
        const fetchGraphQLAuth = async (query, variables = {}) => {

            const response = await fetch(AUTH_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });

            return response.json();
        };

        const logoutRequest = async () => {
            const query = LogoutMutation;
            let token = localStorage.getItem("token");

            const variables = {
                token,
            };

            try {
                const data = await fetchGraphQLAuth(query, variables);
                let logoutStatus  = data.data.logout;
                if(logoutStatus){
                    localStorage.removeItem('email');
                    localStorage.removeItem('token');
                    localStorage.removeItem('country_name');

                    window.location.href = 'index.html';
                }

                console.log("GraphQL Response Logout:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

        };

        const updateProfileRequest = async (gender, day, month) => {
            const query = CreateOrUpdateUserMetaMutation;
            let token = localStorage.getItem("token");
            let email = localStorage.getItem("email");

            const variables = {
                email,
                gender,
                day,
                month
            };

            try {
                const data = await fetchGraphQL(query, variables);
                let profileUpdateStatus  = data.data.createOrUpdateUserMeta;

                if(profileUpdateStatus.id !== ""){
                    Swal.fire({
                        title: "Profile has been updated!",
                        text: `Your profile with (${email}) has been updated.`,
                        icon: "success"
                    });
                }

                console.log("GraphQL Response Profile Update:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

        };

        const getUserMetaRequest = async (email) => {
            const query = UserMetaByEmailQuery;
            let token = localStorage.getItem("token");

            const variables = {
                email,
            };

            try {
                const data = await fetchGraphQL(query, variables);
                userMeta.value  = data.data.userMetaByEmail;
                if(userMeta.value ){
                    gender.value = userMeta.value.gender;
                    day.value = userMeta.value.dayOfBirth;
                    month.value = userMeta.value.monthOfBirth;
                }

                console.log("GraphQL Response UserMeta:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

        };

        const logoutConfirm = async () => {
              Swal.fire({
                title: 'Are you sure?',
                text: "You want to be logout?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, do it!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Exiting Wanzami Profile",
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        timer: 2000,
                        showConfirmButton: false,
                        didOpen: () => {
                            Swal.showLoading(); // This shows the built-in loading spinner
                        },
                    });
                    logoutRequest();
                }
            });
        }

        // Fetch data when component mounts
        onMounted(() => {
            email.value = localStorage.getItem("email");
            getUserMetaRequest(email.value)
        });

        return {
            country,
            appName,
            email,
            gender,
            showWarning,
            day,
            month,
            logoutRequest,
            logoutConfirm,
            footerCopyRight,
            message,
            getCopyright,
            updateProfileRequest,    
        };
    }
}).mount('#appVue');

