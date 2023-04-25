let map;
let userMarker;
const aedIcon = "aed-icon.png";

const allLocations = [
  // Gurugram locations
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
    status: "not working",
    address: "Address 3",
  },
  {
    lat: 28.40601472169394,
    lng: 77.11425443169855,
    name: "AED 4",
    status: "not working",
    address: "Address 4",
  },
  // Manipal locations
  {
    lat: 13.35209307245631,
    lng: 74.79333562540025,
    name: "AED 5",
    status: "working",
    address: "Address 5",
  },
  {
    lat: 13.351743299193053,
    lng: 74.79328923955707,
    name: "AED 6",
    status: "working",
    address: "Address 6",
  },
  {
    lat: 13.351367198344537,
    lng: 74.79270555103045,
    name: "AED 7",
    status: "not working",
    address: "Address 7",
  },
  {
    lat: 13.353664076063442,
    lng: 74.78981318695902,
    name: "AED 8",
    status: "not working",
    address: "Address 8",
  },
  // Kakkanad locations
  {
    lat: 10.0156779,
    lng: 76.3378421,
    name: "AED 9",
    status: "working",
    address: "Near Infopark Entrance, Infopark Rd, Kakkanad, Kochi, Kerala",
  },
  {
    lat: 10.0201098,
    lng: 76.3619053,
    name: "AED 10",
    status: "working",
    address: "Rajagiri Valley, Kakkanad, Kochi, Kerala",
  },
  {
    lat: 10.0047001,
    lng: 76.3254134,
    name: "AED 11",
    status: "not working",
    address: "Thrikkakara Temple, Thrikkakara North, Kakkanad, Kochi, Kerala",
  },
  {
    lat: 9.9981663,
    lng: 76.3080833,
    name: "AED 12",
    status: "not working",
    address: "Kakkanad Civil Station, Kochi, Kerala",
  },
];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.4089, lng: 77.1162 },
    zoom: 15,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  });

  createMarkers(allLocations);
  requestUserLocation();
  createLocationControl(map);
}

function createMarkers(locations) {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

  locations.forEach((location) => {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(location.lat, location.lng),
      map: map,
      icon: aedIcon,
      label: {
        text: location.name,
        color: "#000",
        fontWeight: "bold",
      },
    });

    marker.addListener("click", () => {
      if (userMarker) {
        const userLocation = userMarker.getPosition();
        const destination = { lat: location.lat, lng: location.lng };

        directionsService.route(
          {
            origin: userLocation,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);

              // Calculate time to reach the location
              const duration = result.routes[0].legs[0].duration.text;

              // Update InfoWindow content with time to reach
              const infoWindowContent = `<h3>${location.name}</h3><p>Status: ${location.status}</p><p>Address: ${location.address}</p><p>Time to reach: ${duration}</p>`;
              const infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent,
              });

              infoWindow.open(map, marker);
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
    navigator.geolocation.getCurrentPosition(showUserLocation, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
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

function createLocationControl(map) {
  const locationControlDiv = document.createElement("div");
  locationControlDiv.id = "location-control";
  locationControlDiv.title = "Center map on your location";

  locationControlDiv.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map.panTo(userLocation);
        },
        (error) => {
          alert("Error: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
    locationControlDiv
  );
}
