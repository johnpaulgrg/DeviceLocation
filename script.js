let map;
let userMarker;
const aedIcon = "aed-icon.png"; // Replace with your custom image URL

const gurugramLocations = [
  {
    lat: 28.407945984784263,
    lng: 77.1165467236218,
    name: "AED 1",
    status: "working",
    address: "Address 1",
  },
  {
    lat: 28.40726040753197,
    lng: 77.11703320021923,
    name: "AED 2",
    status: "working",
    address: "Address 2",
  },
  {
    lat: 28.40625064816643,
    lng: 77.11638947005999,
    name: "AED 3",
    status: "working",
    address: "Address 3",
  },
  {
    lat: 28.40601472169394,
    lng: 77.11425443169855,
    name: "AED 4",
    status: "working",
    address: "Address 4",
  },
  {
    lat: 28.40857213663377,
    lng: 77.11377163407913,
    name: "AED 5",
    status: "not working",
    address: "Address 5",
  },
  {
    lat: 28.40857213663377,
    lng: 77.1138038205871,
    name: "AED 6",
    status: "not working",
    address: "Address 6",
  },
  {
    lat: 28.40924215026731,
    lng: 77.11726923461093,
    name: "AED 7",
    status: "not working",
    address: "Address 7",
  },
  {
    lat: 28.410383994722114,
    lng: 77.11577792640871,
    name: "AED 8",
    status: "not working",
    address: "Address 8",
  },
];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.4089, lng: 77.1162 },
    zoom: 15,
  });

  createMarkers(gurugramLocations);
  requestUserLocation();
}

function createMarkers(locations) {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

  locations.forEach((location) => {
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      icon: aedIcon,
      title: location.name,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${location.name}</h3><p>Status: ${location.status}</p><p>Address: ${location.address}</p>`,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);

      if (userMarker) {
        const userLocation = userMarker.getPosition();
        const destination = { lat: location.lat, lng: location.lng };

        directionsService.route(
          {
            origin: userLocation,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
            } else {
              console.error(`Directions request failed due to ${status}`);
            }
          }
        );
      }
    });
  });
}

function requestUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showUserLocation, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}
function showUserLocation(position) {
  const userLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };

  // Remove the existing user marker if it exists
  if (userMarker) {
    userMarker.setMap(null);
  }

  // Create a blue circle for the user's location
  userMarker = new google.maps.Marker({
    position: userLocation,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#4285F4",
      fillOpacity: 1,
      strokeColor: "white",
      strokeWeight: 1,
      scale: 7,
    },
    zIndex: google.maps.Marker.MAX_ZINDEX + 1,
  });

  map.panTo(userLocation);
}

function handleError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}
