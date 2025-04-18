const GRAPHQL_ENDPOINT = AUTH_URL;

// async function fetchGraphQL(query, variables = {}) {
//     const response = await fetch(GRAPHQL_ENDPOINT, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//         },
//         body: JSON.stringify({
//             query,
//             variables,
//         }),
//     });

//     const result = await response.json();
//     return result;
// }

const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const message = ref('Hello Vue!');
        const firstname = ref('Ria');
        const lastname = ref('Singh');
        const footerCopyRight = ref(getFooterDate(APP));
        const users = ref([]); // Store users data
        const sliders = ref([]); // sliders data

        // Define a method to get full name
        const getFullName = () => {
            return `${firstname.value} ${lastname.value}`;
        };

        const getCopyright = () => {
            return `${footerCopyRight.value}`;
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

        const getItems = async () => {
            const query = `
                query FindAllUsers {
                    findAllUsers {
                        id
                        status
                        username
                        email
                        telephone
                        password
                        role
                    }
                }
            `;

            try {
                const data = await fetchGraphQL(query);
                users.value = data.data.findAllUsers; // Store API response in users array                        
                console.log("GraphQL Response:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }
        };

        const getSliders = async () => {
            const query = `
                query FindAllSliders {
                    findAllSliders {
                        id
                        status
                        name
                        description
                        duration
                        video_quality
                        image_link
                        background_link
                        video_link
                    }
                }
            `;

            try {
                const data = await fetchGraphQL(query);
                sliders.value = data.data.findAllSliders; // Store API response in sliders array    
                console.log("GraphQL Response Sliders:", data);                    
            } catch (error) {
                console.error("GraphQL Error:", error);
            }
        };

        // Fetch data when component mounts
        onMounted(() => {
            getItems();
            getSliders();
        });

        return {
            message,
            firstname,
            lastname,
            getFullName,
            getCopyright,
            getItems,
            users,
        };
    }
}).mount('#appVue');

