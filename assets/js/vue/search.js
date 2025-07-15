
function mySubmit(e) { 
    e.preventDefault(); 
}

const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const footerCopyRight = ref(getFooterDate(LEGAL_NAME));
        const appName = ref(APP);
        const films = ref([]); // Store films data
        const newestRealeasesFilms = ref([]);
        const newestRealeasesId = ref(203);
        const country = ref();
        const search = ref();
        const videoPaymentByEmail = ref();
        const searchHasValues = ref(false);

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

        const searchFilms = async (country,videoName) => {
            const query = SearchVideoByRestrictedCountryQuery;

            const variables = {
                country,
                videoName
            };

            try {
                const data = await fetchGraphQL(query, variables);
                films.value = data.data.searchVideoByRestrictedCountry;
                if(films.value){
                    searchHasValues.value = true;
                }
                console.log("GraphQL Response Films:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }
        };

        const searchRequest = async () => {
            if(search.value != null){
                Swal.fire({
                    title: "Searching Wanzami",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    timer: 2000,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading(); // This shows the built-in loading spinner
                    },
                });
                searchFilms(localStorage.getItem('country_name'),search.value);
            }
        }

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

        // Fetch data when component mounts
        onMounted(() => {
            getCountry();
            getFilmsNewestRealeases(localStorage.getItem('country_name'),newestRealeasesId.value);
        });

        return {
            country,
            search,
            appName,
            footerCopyRight,
            searchHasValues,
            getCopyright,
            searchRequest,
            films,
            newestRealeasesFilms,
        };
    }
}).mount('#appVue');

