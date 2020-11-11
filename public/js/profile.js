const logoutBtn = $('#logoutBtn');
const locationBtn = $('#locationBtn')
const ok = $('.status-btn:nth-child(1)');
const help = $('.status-btn:nth-child(2)');
const emergency = $('.status-btn:nth-child(3)');
const na = $('.status-btn:nth-child(4)');
const username = $('#username-data').val();

function updateStatus(status) {
  status.on('click', () => {
    const newStatus = {
      username: username,
      status: status.text(),
    };
    console.log(newStatus);
    fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStatus),
    }).catch((e) => {
      console.log(e);
    });
  });
}
updateStatus(ok);
updateStatus(help);
updateStatus(emergency);
updateStatus(na);

function displayNotification() {
  $('.toast-body').replaceWith(
    `<div class="toast-body pl-3 pt-2 pr-2 pb-2">Your location has been updated</div>`
  );
  $('.toast').css('zIndex', 1000);
  $('.toast').toast('show');
}

logoutBtn.on('click', () => {
  fetch('/api/users/logout', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (res.ok) {
      // delete jwt
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/';
    }
  });
});

locationBtn.on('click', async() => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  await navigator.geolocation.getCurrentPosition(successLocation, errorLocation, options);
  displayNotification();
});

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


