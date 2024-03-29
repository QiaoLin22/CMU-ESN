const logoutBtn = $('#logoutBtn');
const updateLocationBtn = $('.location-btn:nth-child(1)');
const deleteLocationBtn = $('.location-btn:nth-child(2)');
const ok = $('.status-btn:nth-child(1)');
const help = $('.status-btn:nth-child(2)');
const emergency = $('.status-btn:nth-child(3)');
const na = $('.status-btn:nth-child(4)');
const username = $('#username-data').val();
const sendSMS = $('#sendSmsModal');
const sendConfirm = $('#sendConfirmBtn');
const administrator = $('#administratorBtn');

function updateAPI(status) {
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
}

function displayNotification(word) {
  $('.toast-body').replaceWith(
    `<div class="toast-body pl-3 pt-2 pr-2 pb-2">${word}</div>`
  );
  $('.toast').css('zIndex', 1000);
  $('.toast').toast('show');
}

function sendNewSMS() {
  fetch('/api/contacts/sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(() => {
      displayNotification('Successfully sent SMS to your contacts');
    })
    .catch((e) => {
      console.log(e);
    });
}

function updateStatus(status) {
  status.on('click', () => {
    if (status === emergency) {
      sendSMS.modal('show');
    }
    updateAPI(status);
  });
}

updateStatus(ok);
updateStatus(help);
updateStatus(emergency);
updateStatus(na);

sendConfirm.on('click', () => {
  console.log('send new sms from frontend');
  sendNewSMS();
});

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

function successLocation(position) {
  const crd = position.coords;
  console.log(crd.longitude);
  console.log(crd.latitude);
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
  displayNotification('Your location has been updated');
}

function errorLocation(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

updateLocationBtn.on('click', async () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  await navigator.geolocation.getCurrentPosition(
    successLocation,
    errorLocation,
    options
  );
});

deleteLocationBtn.on('click', () => {
  fetch('/api/users/location', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: username }),
  }).catch((e) => {
    console.log(e);
  });
  displayNotification('You have stopped sharing location to others');
});

administrator.on('click', () => {
  window.location.href = '/administrator';
});
