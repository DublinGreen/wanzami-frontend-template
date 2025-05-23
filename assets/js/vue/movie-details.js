
const GRAPHQL_ENDPOINT = AUTH_URL;

const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const footerCopyRight = ref(getFooterDate(APP));
        const appName = ref(APP);
        const film = ref([]); // Store film data
        const country = ref();
        const na = ref();
        const ia = ref();
        const ca = ref();

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

        const getFilm = async (videoId) => {
            const query = VideoByIdQuery;

            const variables = {
                videoId
            };

            try {
                const data = await fetchGraphQL(query, variables);
                film.value = data.data.videoById;
                console.log("GraphQL Response Film Data:", data);
                // console.log(JSON.stringify(film.value));
                // alert(JSON.stringify(film.value.videoMeta.video_length));
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

            return "";
        };


        // Fetch data when component mounts
        onMounted(() => {
            getCountry();
            const urlParams = new URLSearchParams(window.location.search);
            ia.value = urlParams.get('ia');
            na.value = urlParams.get('na');
            ca.value = urlParams.get('ca');
            getFilm(ia.value);
        });

        return {
            country,
            appName,
            getCopyright,
            film,
        };
    }
}).mount('#appVue');

