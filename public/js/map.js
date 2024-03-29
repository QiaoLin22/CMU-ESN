const socket = io();
const username = $('#username-data').val();
const confirmModal = $('#confirmModal');
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};
function displayNotification() {
  $('.toast-body').replaceWith(
    `<div class="toast-body pl-3 pt-2 pr-2 pb-2">Your location has been updated</div>`
  );
  $('.toast').css('zIndex', 1000);
  $('.toast').toast('show');
}
function successLocation(position) {
  const crd = position.coords;
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
  displayNotification();
}

function errorLocation(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
function saveCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
    successLocation,
    errorLocation,
    options
  );
}

function addMarker(map, locations, name, status) {
  const roomId = username < name ? `${username}${name}` : `${name}${username}`;

  const contentStringOther =
    `${
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h5 id="firstHeading" class="firstHeading">UserInfo</h5>' +
      '<div id="bodyContent">' +
      '<p>username:</p>' +
      '<p><b>'
    }${name}</b></p>` +
    `<p>status:</p>` +
    `<p><b>${status}</b></p>` +
    `<p>Go to private chat: </p>` +
    `<a href="/private-chat/${roomId}"</a>Link to private chat with ${name}` +
    `</div>` +
    `</div>`;

  const contentStringSelf =
    `${
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h5 id="firstHeading" class="firstHeading">UserInfo</h5>' +
      '<div id="bodyContent">' +
      '<p>username:</p>' +
      '<p><b>'
    }${name}</b></p>` +
    `<p>status:</p>` +
    `<p><b>${status}</b></p>` +
    `</div>` +
    `</div>`;

  const infowindow = new google.maps.InfoWindow({
    content: username === name ? contentStringSelf : contentStringOther,
  });
  const iconBase = 'http://maps.google.com/mapfiles/kml/paddle/';
  let icon;
  if (status === 'OK') icon = `${iconBase}grn-circle.png`;
  else if (status === 'Help') icon = `${iconBase}ylw-circle.png`;
  else if (status === 'Emergency') icon = `${iconBase}red-circle.png`;
  else if (status === 'Undefined') icon = `${iconBase}wht-circle.png`;
  const marker = new google.maps.Marker({
    position: locations,
    icon: icon,
    map: map,
  });
  marker.addListener('click', () => {
    infowindow.open(map, marker);
  });
}

function getLocationByUsername() {
  return fetch('/api/users/location', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.location === undefined) return undefined;
      return json.location;
    })
    .catch((e) => {
      console.log(e);
    });
}

async function initMap() {
  const location = await getLocationByUsername(username);
  // saveCurrentLocation if user doesn't have a location
  if (location === undefined) {
    confirmModal.modal('show');
  }
  // Map options
  const mapoptions = {
    zoom: 6,
    center: { lat: 37.4106, lng: -122.059732 },
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
    fullscreenControl: true,
  };
  // New Map
  const map = new google.maps.Map(document.getElementById('map'), mapoptions);
  fetch(`/api/users/locations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((json) => {
      json.forEach((e) => {
        const lat = e.location.latitude;
        const lng = e.location.longitude;
        const position = { lat: lat, lng: lng };
        const name = e.username;
        const { status } = e.status;
        addMarker(map, position, name, status);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

socket.on('updateMap', () => {
  initMap();
});

$('#updateMapBtn').on('click', () => {
  saveCurrentLocation();
  confirmModal.modal('hide');
});
