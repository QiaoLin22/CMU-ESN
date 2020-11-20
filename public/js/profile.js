const logoutBtn = $('#logoutBtn');
const ok = $('.status-btn:nth-child(1)');
const help = $('.status-btn:nth-child(2)');
const emergency = $('.status-btn:nth-child(3)');
const na = $('.status-btn:nth-child(4)');
const username = $('#username-data').val();
const sendSMS = $('#sendSmsModal');
const sendConfirm = $('#sendConfirmBtn');

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

function displayNotification() {
  $('.toast-body').replaceWith(
    `<div class="toast-body pl-3 pt-2 pr-2 pb-2">Successfully sent SMS to your contacts</div>`
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
      displayNotification();
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

// add socket event 'sent SMS'

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
