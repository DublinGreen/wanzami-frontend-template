
const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const message = ref('Hello Vue!');
        const firstname = ref('Ria');
        const lastname = ref('Singh');
        const footerCopyRight = ref(getFooterDate(APP));
        const appName = ref(APP);
        const films = ref([]); // Store films data
        const filmsSubCategory = ref([]); // Store films subCategory data
        const sliders = ref([]); // sliders data
        const newestRealeasesId = ref(203);
        const newestRealeasesFilms = ref([]);
        const wanzamiOriginalId = ref(202);
        const wanzamiOriginalFilms = ref([]);
        const country = ref();

        const mobileAppAlert = () => {
            Swal.fire({
                title: 'Mobile App Coming Soon',
                text: 'We are working on a mobile app for Wanzami. Stay tuned!',
                icon: 'info',
                confirmButtonText: 'OK'
            });
        }

        // Define a method to get full name
        const getFullName = () => {
            return `${firstname.value} ${lastname.value}`;
        };

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

        const getFilmSubCategory = async (videoId) => {
            const query = FindAllSubCategoryByVideoIdQuery;

            const variables = {
                videoId
            };

            try {
                const data = await fetchGraphQL(query, variables);
                filmsSubCategory.value.push({ [videoId]: data.data.findAllSubCategoryByVideoId});
                console.log("GraphQL Response Film Sub Category:", data);
                console.log(JSON.stringify(filmsSubCategory.value));
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

            return "";
        };

        const getFilms = async (country) => {
            const query = FindAllVideoByRestrictedCountryQuery;

            const variables = {
                country
            };

            try {
                const data = await fetchGraphQL(query, variables);
                films.value = data.data.findAllVideoByRestrictedCountry;
                console.log("GraphQL Response Films:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }
        };

        const getFilmsWanzamiOriginal = async (country, videoCategoryId) => {
            const query = FindVideoByRestrictedCountryAndSubCategoryQuery;

            const variables = {
                country,
                videoCategoryId
            };

            try {
                const data = await fetchGraphQL(query, variables);
                wanzamiOriginalFilms.value = data.data.findVideoByRestrictedCountryAndSubCategory;
                console.log("GraphQL Response getFilmsWazamiOriginal:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }
        };

        const getFilmsNewestRealeases = async (country, videoCategoryId) => {
            const query = FindVideoByRestrictedCountryAndSubCategoryQuery;

            const variables = {
                country,
                videoCategoryId
            };

            try {
                const data = await fetchGraphQL(query, variables);
                newestRealeasesFilms.value = data.data.findVideoByRestrictedCountryAndSubCategory;
                console.log("GraphQL Response getFilmsNewestRealeases:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }
        };

        const getSliders = async () => {
            const query = FindAllActiveSlidersQuery;

            try {
                const data = await fetchGraphQL(query);
                sliders.value = data.data.findAllActiveSliders;                
                console.log("GraphQL Response Sliders:", data);                    
            } catch (error) {
                console.error("GraphQL Error:", error);
            }
        };

        // Fetch data when component mounts
        onMounted(() => {
            getCountry();
            getFilms(localStorage.getItem('country_name'));
            getFilmsNewestRealeases(localStorage.getItem('country_name'),newestRealeasesId.value);
            getFilmsWanzamiOriginal(localStorage.getItem('country_name'),wanzamiOriginalId.value);
            getSliders();
        });

        return {
            country,
            appName,
            getCopyright,
            sliders,
            films,
            filmsSubCategory,
            newestRealeasesFilms,
            wanzamiOriginalFilms,
            mobileAppAlert
        };
    }
}).mount('#appVue');

