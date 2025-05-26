
const { createApp, ref, onMounted } = Vue;

var trailer = "";
var movieGeneratePresignedGetUrl = "";
var priceCollection = [];

function playTrailerFullscreen() {
    const trailerVideo = document.getElementById('myTrailer');
    const shortVideo = document.getElementById('shortVideo');
    var videoSrc = "";

    if(trailer != ""){
        videoSrc = trailer

        // Show the video
        trailerVideo.style.display = 'block';

        // HLS support
        if (trailerVideo.canPlayType('application/vnd.apple.mpegurl')) {
            trailerVideo.src = videoSrc;
        } else if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(trailerVideo);
        } else {
            console.error('HLS is not supported in this browser.');
            return;
        }

        // Request fullscreen
        const requestFullscreen = trailerVideo.requestFullscreen || trailerVideo.webkitRequestFullscreen || trailerVideo.msRequestFullscreen;
        if (requestFullscreen) {
            requestFullscreen.call(trailerVideo);
        }

        // Play video
        shortVideo.pause().catch(err => console.error('short Video playback failed:', err));
        trailerVideo.play().catch(err => console.error('Trailer Video playback failed:', err));
    }

}

function playMovieFullscreen(){
    const movieVideo = document.getElementById('myMovie');
    const shortVideo = document.getElementById('shortVideo');
    var videoSrc = "";

    if(movieGeneratePresignedGetUrl != ""){
        videoSrc = movieGeneratePresignedGetUrl

        // Show the video
        movieVideo.style.display = 'block';

        // HLS support
        if (movieVideo.canPlayType('application/vnd.apple.mpegurl')) {
            movieVideo.src = videoSrc;
        } else if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(movieVideo);
        } else {
            console.error('HLS is not supported in this browser.');
            return;
        }

        // Request fullscreen
        const requestFullscreen = movieVideo.requestFullscreen || movieVideo.webkitRequestFullscreen || movieVideo.msRequestFullscreen;
        if (requestFullscreen) {
            requestFullscreen.call(movieVideo);
        }

        // Play video
        shortVideo.pause().catch(err => console.error('short Video playback failed:', err));
        movieVideo.play().catch(err => console.error('Main Video playback failed:', err));
    }
}

// Hide video when fullscreen is exited
document.addEventListener('fullscreenchange', handleFullscreenExit);
document.addEventListener('webkitfullscreenchange', handleFullscreenExit); // Safari
document.addEventListener('msfullscreenchange', handleFullscreenExit); // IE/Edge

function handleFullscreenExit() {
    const trailerVideo = document.getElementById('myTrailer');
    const movieVideo = document.getElementById('myMovie');
    const shortVideo = document.getElementById('shortVideo');

    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

    if (!isFullscreen) {
        trailerVideo.pause();
        trailerVideo.style.display = 'none';

        movieVideo.pause();
        movieVideo.style.display = 'none';

        shortVideo.play().catch(err => console.error('short Video playback failed:', err));
        shortVideo.muted = true;
    }
}

createApp({
    setup() {
        const footerCopyRight = ref(getFooterDate(APP));
        const appName = ref(APP);
        const film = ref([]); // Store film data
        const country = ref();
        const na = ref();
        const ia = ref();
        const ca = ref();
        const newestRealeasesId = ref(203);
        const newestRealeasesFilms = ref();
        const productionCrew = ref();
        const casts = ref();
        const prices = ref();
        const generatePresignedGetUrl = ref();

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

        const getFilm = async (videoId) => {
            const query = VideoByIdQuery;

            const variables = {
                videoId
            };

            try {
                const data = await fetchGraphQL(query, variables);
                film.value = data.data.videoById;
                trailer = film.value.videoMeta?.video_trailer_url;

                console.log("GraphQL Response Film Data:", data);

                if(film.value){
                    generatePresignedGetUrlRequest(film.value.videoMeta.video_url);
                    getPricesByVideoIdRequest(videoId);
                }
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

            return "";
        };


        const generatePresignedGetUrlRequest = async (fileName) => {
            const query = GeneratePresignedGetUrlQuery;

            const variables = {
                fileName
            };

            try {
                const data = await fetchGraphQL(query, variables);
                generatePresignedGetUrl.value = data.data.generatePresignedGetUrl;
                movieGeneratePresignedGetUrl = generatePresignedGetUrl.value;
                console.log("GraphQL Response generatePresignedGetUrlRequest Data:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

            return "";
        };
        
        const getPricesByVideoIdRequest = async (videoId) => {
            const query = VideoPriceByVideoIdQuery;

            const variables = {
                videoId
            };

            try {
                const data = await fetchGraphQL(query, variables);
                prices.value = data.data.videoPriceByVideoId;
                
                let pricesObj = prices.value;
                if(pricesObj){
                    pricesObj.forEach(function(item) {
                        if(item.status == 1){
                            priceCollection.push({
                                currency: item.price.currency,
                                price: item.price.price
                            });
                        }
                    });
                }

                // console.log(priceCollection);
                console.log("GraphQL Response Video Prices Data:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

            return "";
        };


        const getProductionCrew = async (videoId) => {
            const query = VideoProductionCrewByVideoIdQuery;

            const variables = {
                videoId
            };

            try {
                const data = await fetchGraphQL(query, variables);
                productionCrew.value = data.data.videoProductionCrewByVideoId;
                console.log("GraphQL Response Production Crew Data:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

            return "";
        };

        const getCasts = async (videoId) => {
            const query = VideoCastByVideoIdQuery;

            const variables = {
                videoId
            };

            try {
                const data = await fetchGraphQL(query, variables);
                casts.value = data.data.videoCastByVideoId;
                console.log("GraphQL Response Casts Data:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

            return "";
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

        // Fetch data when component mounts
        onMounted(() => {
            getCountry();
            const urlParams = new URLSearchParams(window.location.search);
            ia.value = urlParams.get('ia');
            na.value = urlParams.get('na');
            ca.value = urlParams.get('ca');
            getFilm(ia.value);
            getProductionCrew(ia.value);
            getCasts(ia.value);
            getFilmsNewestRealeases(na.value,newestRealeasesId.value);
        });

        return {
            country,
            appName,
            prices,
            getCopyright,
            film,
            productionCrew,
            casts,
            newestRealeasesFilms,
        };
    }
}).mount('#appVue');

