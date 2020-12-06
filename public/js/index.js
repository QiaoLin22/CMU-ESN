const usernameEle = $('#username');
const passwordEle = $('#password');
const confirmModal = $('#confirmModal');
const welcomeModal = $('#welcomeModal');

const loginAlert = $('#loginAlert');
const confirmAlert = $('#confirmAlert');

/** Alert */
function showAlert(alertElement, text, alertClass) {
  alertElement.text(text);
  alertElement.attr('class', `alert ${alertClass}`);
  alertElement.attr('hidden', false);
}

function hideAlert(alertElement) {
  alertElement.attr('hidden', true);
}

/** Response Handler */
function checkStatus(res) {
  if (!res.ok) throw res;
  if (res.headers.get('Location')) {
    window.location.href = res.headers.get('Location');
  }
  return res.json();
}

// Error handler
function catchError(err, alertElement) {
  if (err instanceof Error) {
    if (alertElement) {
      showAlert(alertElement, err.message, 'alert-danger');
    }
  }

  err.json().then(({ error }) => {
    if (alertElement) {
      showAlert(alertElement, error, 'alert-danger');
    }
  });
}

function getPostOptions() {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: usernameEle.val(),
      password: passwordEle.val(),
    }),
  };
}

/* check username and password
username should be at least 3 characters long
passwords should be at least 4 characters long */
function checkUsernamePassword(username, password) {
  if (username.length < 3) {
    showAlert(
      loginAlert,
      'Username should be at least 3 characters long',
      'alert-danger'
    );
    return false;
  }
  if (password.length < 4) {
    showAlert(
      loginAlert,
      'Passwords should be at least 4 characters long',
      'alert-danger'
    );
    return false;
  }
  return true;
}

$('#confirmBtn').on('click', () => {
  // fetch "/api/users" request to create a new user
  fetch('/api/users/active', getPostOptions())
    .then(checkStatus)
    .then(() => {
      // if registration is successful, popup welcome message
      confirmModal.modal('hide');
      welcomeModal.modal('show');
    })
    .catch((err) => catchError(err, confirmAlert));
});

function loginRequest() {
  fetch('/api/users/login', getPostOptions())
    .then(checkStatus)
    .then((data) => {
      if (data.message === 'create new user?') {
        // ask user to confirm registration
        confirmModal.modal('show');
      }
    })
    .catch((err) => catchError(err, loginAlert));
}

$('#submitBtn').on('click', (event) => {
  event.preventDefault();
  hideAlert(loginAlert);

  if (!checkUsernamePassword(usernameEle.val(), passwordEle.val())) return;

  // fetch "/api/users/login" request
  loginRequest();
});

/* welcome message checkbox handler */
$('#welcomeNextBtn').on('click', (event) => {
  if ($('#acknowledgementForm')[0].checkValidity()) {
    event.preventDefault();
    loginRequest();
  }
});
