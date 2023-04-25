const predefinedLocations = [
  // Gurugram Locations
  {
    lat: 28.407945984784263,
    lng: 77.1165467236218,
    name: "AED 1",
    address: "Address 1",
    status: "Working",
  },
  {
    lat: 28.40726040753197,
    lng: 77.11703320021923,
    name: "AED 2",
    address: "Address 2",
    status: "Working",
  },
  {
    lat: 28.40625064816643,
    lng: 77.11638947005999,
    name: "AED 3",
    address: "Address 3",
    status: "Working",
  },
  {
    lat: 28.40601472169394,
    lng: 77.11425443169855,
    name: "AED 4",
    address: "Address 4",
    status: "Working",
  },
  // Manipal Locations
  {
    lat: 13.35209307245631,
    lng: 74.79333562540025,
    name: "AED 5",
    address: "Address 5",
    status: "Not Working",
  },
  {
    lat: 13.351743299193053,
    lng: 74.79328923955707,
    name: "AED 6",
    address: "Address 6",
    status: "Not Working",
  },
  {
    lat: 13.351367198344537,
    lng: 74.79270555103045,
    name: "AED 7",
    address: "Address 7",
    status: "Not Working",
  },
  {
    lat: 13.353664076063442,
    lng: 74.78981318695902,
    name: "AED 8",
    address: "Address 8",
    status: "Not Working",
  },
];

let map;
let userLocation;
let userMarker;

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        createMap(userLocation);
        watchUserPosition();
      },
      () => {
        handleLocationError(true);
      }
    );
  } else {
    handleLocationError(false);
  }
}

function createMap(userLocation) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: userLocation,
    zoom: 14,
  });

  userMarker = new google.maps.Marker({
    position: userLocation,
    map: map,
    title: "Your location",
  });

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  const aedIcon = "aed-icon.png";

  predefinedLocations.forEach((location) => {
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      title: location.name,
      label: location.name,
      icon: aedIcon,
    });

    // ...
  });
}

function watchUserPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        userMarker.setPosition(userLocation);
        map.setCenter(userLocation);
      },
      () => {
        handleLocationError(true);
      }
    );
  } else {
    handleLocationError(false);
  }
}

function handleLocationError(browserHasGeolocation) {
  alert(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
}
