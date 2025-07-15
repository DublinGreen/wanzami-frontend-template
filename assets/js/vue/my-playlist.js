const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const footerCopyRight = ref(getFooterDate(LEGAL_NAME));
        const appName = ref(APP);
        const country = ref();
        const myPlayList = ref();
        const videoPaymentByEmail = ref();

        const getCopyright = () => {
            return `${footerCopyRight.value}`;
        }

        const getCountry = () => {
            let temp = localStorage.getItem('country_name');
            if(temp){
                country.value = temp;
                return temp
            }else{
                return '*';
            }
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

        const getMyPlaylist = async () => {
            const query = WishListByUserEmailQuery;
            let email = localStorage.getItem('email');

            const variables = {
                email,
            };

            try {
                const data = await fetchGraphQL(query, variables);
                myPlayList.value = data.data.wishListByUserEmail;
                myPlayList.value = [...new Set(myPlayList.value)];

                console.log("GraphQL Response myPlayList:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

        };

        // Fetch data when component mounts
        onMounted(() => {
            getCountry();
            getMyPlaylist();
        });

        return {
            country,
            appName,
            myPlayList,
            footerCopyRight,
            getCopyright,    
        };
    }
}).mount('#appVue');

