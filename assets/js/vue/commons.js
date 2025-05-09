const getFooterDate = (appName) => {
    const dateObj = new Date();
    return `© ${appName}  ${dateObj.getFullYear()}` ;
}

const checkIfTokenIsSet = () => {
    let token = localStorage.getItem("token");
    if(token){
        window.location.href = "dashboard.html";
    }
}

async function getUserLocation(googleApiKey) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
            
            getCountryFromLatLng(googleApiKey,latitude,longitude)
            .then((data) => {
                // console.log("Data received:", data);
                localStorage.setItem("country", data);
            })
            .catch((error) => {
                console.error("Fetch failed:", error);
            });
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
}

async function fetchGraphQL(url, query, variables = {}) {
    const response = await fetch(url, {
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

    const result = await response.json();
    return result;
}

async function getCountryFromLatLng(key, lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
    
    const response = await fetch(url);
    const data = await response.json();
  
    const country = data.results[0].address_components.find(component =>
      component.types.includes('country')
    );
    
    return country?.long_name;
}

async function getCountryName(link){
  fetch(link)
  .then(response => response.json())
  .then(data => {
      const value = localStorage.getItem("country_name");
      if (value === null) {
          localStorage.setItem("country_name",data.country_name);
      }
  })
  .catch(error => console.error("Error fetching location:", error));
}
