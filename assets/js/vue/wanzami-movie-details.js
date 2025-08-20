
const { createApp, ref, onMounted } = Vue;

var trailer = "";
var movieGeneratePresignedGetUrl = "";
var priceCollection = [];

let NoPlaySound =  document.getElementById("NoPlaySound");
let playSound =  document.getElementById("playSound");
playSound.style.display = "none";
NoPlaySound.style.display = "block";

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
        // shortVideo.pause().catch(err => console.error('short Video playback failed:', err));
        trailerVideo.play().catch(err => console.error('Trailer Video playback failed:', err));

    }

}

function isVideoPlaying(video) {
  return !!(
    video.currentTime > 0 &&
    !video.paused &&
    !video.ended &&
    video.readyState > 2
  );
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari
document.addEventListener('mozfullscreenchange', handleFullscreenChange);    // Firefox
document.addEventListener('MSFullscreenChange', handleFullscreenChange);     // IE/Old Edge

function handleFullscreenChange() {
  const isFullscreen =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;

  if (!isFullscreen) {
    // ✅ Fullscreen has been exited
    // Trying to continue playback, after fullscreen has been existed and resumed [Bug]
    // console.log("fullscreen existed");
    // const movieVideo = document.getElementById('myMovie');
    // movieVideo.src = movieGeneratePresignedGetUrl;
    // movieVideo.load();
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
        if(shortVideo){
            let isShortVideoPlaying = isVideoPlaying(shortVideo);

            if(isShortVideoPlaying){
                try{
                    shortVideo.muted = true;
                    // shortVideo.pause();
                }catch(err){
                    console.error('short Video playback failed:', err)
                }
            }
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('ia');
        const videoName = urlParams.get('na');

        // Resume from last saved time
        movieVideo.addEventListener('loadedmetadata', function onMeta() {
            const savedTime = localStorage.getItem(`video-progress-${videoId}`);
            if(savedTime != null | savedTime != ""){
                movieVideo.currentTime = savedTime;
                console.log("resume movie");
                movieVideo.removeEventListener('loadedmetadata', onMeta);
            }
        }); 

        movieVideo.addEventListener('canplay', function onCanPlay() {
            movieVideo.play();
            movieVideo.removeEventListener('canplay', onCanPlay);
        });
            
        // Save current time regularly
        movieVideo.addEventListener('timeupdate', () => {
            localStorage.setItem(`video-progress-${videoId}`, movieVideo.currentTime);
        });

        // movieVideo.play().catch(err => console.error('Main Video playback failed:', err));
    }
}

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

function getHelp(){
    const SUPPORT_EMAIL = "support@wanzamientertainment.com";
    Swal.fire({
        title: "Need Help.",
        text: 'Need help? Please contact us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>',
        html: `Need help? Please contact us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>`,
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: 'Close',
        confirmButtonAriaLabel: 'Close',
        cancelButtonText: 'Cancel',
        cancelButtonAriaLabel: 'Cancel',
        reverseButtons: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        showLoaderOnConfirm: false,
        icon: "info"
    });  
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
        const prices = ref();
        const videoPayments = ref();
        const canPay = ref(true);
        const myPlayList = ref();
        const canAddToPlayList = ref(true);
        const generatePresignedGetUrl = ref();

        const getCopyright = () => {
            return `${footerCopyRight.value}`;
        }

        const mobileAppAlert = () => {
            Swal.fire({
                title: 'Mobile App Coming Soon',
                text: 'We are working on a mobile app for Wanzami. Stay tuned!',
                icon: 'info',
                confirmButtonText: 'OK'
            });
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

        const getMyPlaylist = async () => {
            const query = WishListByUserEmailQuery;
            let email = localStorage.getItem('email');

            const variables = {
                email,
            };

            try {
                const data = await fetchGraphQL(query, variables);
                myPlayList.value = data.data.wishListByUserEmail;

                myPlayList.value.forEach((item) => {
                    if(item.video.id ==  ia.value ){
                        canAddToPlayList.value = false;
                    }
                });
        
                console.log("GraphQL Response myPlayList:", data);
            } catch (error) {
                console.error("GraphQL Error:", error);
            }

        };

        const sendWishListRequest = async (videoId, videoName) => {
            const query = CreateWishListMutation;
            let email = localStorage.getItem('email');
            let video_id = parseInt(videoId);

            const variables = {
                video_id,
                email
            };

            try {
                const data = await fetchGraphQL(query, variables);
                let wishData = data.data.createWishList;

                console.log("GraphQL Response Wishlist Data:", data);

                if(wishData.id){                    
                    Swal.fire({
                        title: "PlayList updated.",
                        text: `${videoName} has been added to your playlist!`,
                        icon: "success"
                    });

                    canAddToPlayList.value = false;
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
                            if(country.value == item.price.country.name){
                                priceCollection[country.value] = {
                                    currency: item.price.currency,
                                    price: item.price.price
                                };
                            }else {
                                priceCollection['*'] = {
                                    currency: item.price.currency,
                                    price: item.price.price
                                };
                            }
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

        const getVideoPaymentsByEmail = async (email) => {
            const query = VideoPaymentByEmailQuery;

            const variables = {
                email
            };

            try {
                const data = await fetchGraphQL(query, variables);
                videoPayments.value = data.data.videoPaymentByEmail;
                
                videoPayments.value.forEach(videoPayment => {
                    if(ia.value == videoPayment.video_id){
                        canPay.value = false;
                    }
                });

                console.log("GraphQL Response videoPayments:", data);
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
            getVideoPaymentsByEmail(localStorage.getItem('email'));
            getMyPlaylist();
        });

        return {
            country,
            appName,
            prices,
            videoPayments,
            ia,
            canPay,
            getCopyright,
            film,
            productionCrew,
            casts,
            sendWishListRequest,
            newestRealeasesFilms,
            canAddToPlayList,
            mobileAppAlert,
        };
    }
}).mount('#appVue');

