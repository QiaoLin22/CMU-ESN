const socket = io();
const username = $('#username-data').val();

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
    
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, options);

function successLocation(position) {
  const crd = position.coords;
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  const location = {
    username: username,
    longitude: crd.longitude,
    latitude: crd.latitude,
  };

  fetch(`/api/users/location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(location),
  }).catch((e) => {
    console.log(e);
  });
}

function errorLocation(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function initMap() {
  // Map options
  const options = {
      zoom: 15,
      center: { lat: 37.410600, lng: -122.059732 },
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER,
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
      },
      fullscreenControl: true
  }
  // New Map
  const map = new google.maps.Map(document.getElementById("map"), options);
  // Add Marker
  // const marker = new google.maps.marker({
  //   position: { lat: 37.410600, lng: -122.059732 },
  //   map: map,
  // });
}
