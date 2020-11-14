const socket = io();
const username = $('#username-data').val();

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

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

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, options);

function addMarker(map,locations,name,status) {
  if(username === name)return;
  const roomId =
    username < name
      ? `${username}${name}`
      : `${name}${username}`;

  const contentString = 
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h5 id="firstHeading" class="firstHeading">UserInfo</h5>' +
    '<div id="bodyContent">' +
    "<p>username:</p>" + "<p><b>" + name + "</b></p>" +
    "<p>status:</p>" + "<p><b>" + status + "</b></p>" +
    '<p>Go to private chat: </p>' + `<a href="http://localhost:3000/private-chat/${roomId}"</a>Link to private chat with ${name}`
    "</div>" +
    "</div>";

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });
  const iconBase = 'http://maps.google.com/mapfiles/kml/paddle/';
  let icon;
  if(status === 'OK')icon = iconBase + 'grn-circle.png';
  if(status === 'Help')icon = iconBase + 'ylw-circle.png';
  if(status === 'Emergency')icon = iconBase + 'red-circle.png';
  const marker = new google.maps.Marker({
    position: locations,
    icon: icon,
    map: map
  });
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
}

function initMap() {
  // Map options
  
  const mapoptions = {
      zoom: 12,
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
  const map = new google.maps.Map(document.getElementById("map"), mapoptions);
  
  fetch(`/api/users/location`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((res) => res.json())
  .then((json) => {
    json.forEach(e => {
      const lat = e.location.latitude;
      const lng = e.location.longitude;
      const position = {lat: lat, lng: lng};
      const username = e.username;
      const status = e.status.status;
      addMarker(map,position,username,status)
    });
  })
  .catch((e) => {
    console.log(e);
  });
}


