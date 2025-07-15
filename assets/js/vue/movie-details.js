
const GRAPHQL_ENDPOINT = AUTH_URL;

const { createApp, ref, onMounted } = Vue;

var trailer = "";

function playFullscreen() {
    const video = document.getElementById('myVideo');
    const shortVideo = document.getElementById('shortVideo');
    var videoSrc = "";

    if(trailer != ""){
        videoSrc = trailer

        // Show the video
        video.style.display = 'block';

        // HLS support
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc;
        } else if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
        } else {
            console.error('HLS is not supported in this browser.');
            return;
        }

        // Request fullscreen
        const requestFullscreen = video.requestFullscreen || video.webkitRequestFullscreen || video.msRequestFullscreen;
        if (requestFullscreen) {
            requestFullscreen.call(video);
        }

        // Play video
        shortVideo.pause().catch(err => console.error('short Video playback failed:', err));
        video.play().catch(err => console.error('Video playback failed:', err));
    }

}

let NoPlaySound =  document.getElementById("NoPlaySound");
let playSound =  document.getElementById("playSound");
playSound.style.display = "none";
NoPlaySound.style.display = "block";

function muteShortVideo(){
    const shortVideo = document.getElementById('shortVideo');
    let NoPlaySound =  document.getElementById("NoPlaySound");
    let playSound =  document.getElementById("playSound");
    playSound.style.display = "none";
    NoPlaySound.style.display = "none";

    if (shortVideo.muted) {
        console.log("Video is muted");
        shortVideo.muted = false;
        playSound.style.display = "block";
        NoPlaySound.style.display = "none";
    } else {
        shortVideo.muted = true;
        console.log("Video is not muted");
        let playSound =  document.getElementById("playSound");
        playSound.style.display = "none";
        NoPlaySound.style.display = "block";

    }    
}

// Hide video when fullscreen is exited
document.addEventListener('fullscreenchange', handleFullscreenExit);
document.addEventListener('webkitfullscreenchange', handleFullscreenExit); // Safari
document.addEventListener('msfullscreenchange', handleFullscreenExit); // IE/Edge

function handleFullscreenExit() {
    const video = document.getElementById('myVideo');
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

    if (!isFullscreen) {
        video.pause();
        video.style.display = 'none';
    }
}

createApp({
    setup() {
        const footerCopyRight = ref(getFooterDate(LEGAL_NAME));
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
                trailer = film.value.videoMeta?.video_trailer_url;

                console.log("GraphQL Response Film Data:", data);
                // console.log(JSON.stringify(film.value));
                // alert(JSON.stringify(film.value.videoMeta.video_length));
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
            checkIfTokenIsSet();
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
            getCopyright,
            film,
            productionCrew,
            casts,
            newestRealeasesFilms,
        };
    }
}).mount('#appVue');

