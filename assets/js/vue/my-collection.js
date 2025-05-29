const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const footerCopyRight = ref(getFooterDate(APP));
        const appName = ref(APP);
        const country = ref();
        const myFilms = ref();
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

        const getmyFilms = async () => {
            const query = VideoPaymentByEmailQuery;
            const query2 = VideosByIdsQuery;
            let email = localStorage.getItem('email');
            let ids = [];

            const variables = {
                email,
            };

            try {
                const data = await fetchGraphQL(query, variables);
                videoPaymentByEmail.value = data.data.videoPaymentByEmail;

                // alert(JSON.stringify(videoPaymentByEmail.value));

                let items = videoPaymentByEmail.value;
                if(items){
                    items.forEach(function(item) {
                        ids.push(item.video_id);
                        console.log(item.video_id);
                    });
                }

                // alert(videoIds);
                console.log("GraphQL Response videoPaymentByEmail:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

            const variables2 = {
                ids,
            };

            try {
                const data = await fetchGraphQL(query2, variables2);
                myFilms.value = data.data.videosByIds;

                // alert(JSON.stringify(myFilms.value));

                console.log("GraphQL Response VideosByIds:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }
        };

        // Fetch data when component mounts
        onMounted(() => {
            getCountry();
            getmyFilms();
        });

        return {
            country,
            appName,
            footerCopyRight,
            getCopyright,
            myFilms,
        };
    }
}).mount('#appVue');

