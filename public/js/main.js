const usernameEle = $('#username');
const passwordEle = $('#password');
const confirmModal = $('#confirmModal');
const welcomeModal = $('#welcomeModal');

const loginAlert = $('#loginAlert');

function showAlert(alertElement, text, alertClass) {
  alertElement.text(text);
  alertElement.attr('class', `alert ${alertClass}`);
  alertElement.attr('hidden', false);
}

function hideAlert(alertElement) {
  alertElement.attr('hidden', true);
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

function clearInputBox() {
  usernameEle.val('');
  passwordEle.val('');
}

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

function createNewUser() {
  // fetch "/api/users" request to create a new user
  fetch('/api/users', getPostOptions())
    .then((res) => {
      if (!res.ok) throw res;
      return res.json();
    })
    .then(() => {
      // if registration is successful, popup welcome message
      confirmModal.modal('hide');
      welcomeModal.modal('show');
    })
    .catch((error) => {
      showAlert(loginAlert, error, 'alert-danger');
    });
}

$('#confirmBtn').on('click', createNewUser);

$('#submitBtn').on('click', (event) => {
  event.preventDefault();
  hideAlert(loginAlert);

  if (!checkUsernamePassword(usernameEle.val(), passwordEle.val())) return;

  // fetch "/api/login" request
  fetch('/api/login', getPostOptions())
    .then((res) => {
      if (!res.ok) throw res;
      return res.json();
    })
    .then((data) => {
      if (data.message === 'create new user?') {
        // ask user to confirm registration
        confirmModal.modal('show');
      } else {
        showAlert(loginAlert, 'Successfully logged in', 'alert-success');
      }
    })
    .catch((err) => {
      if (err instanceof Error) throw err;

      err.json().then(({ error }) => {
        showAlert(loginAlert, error, 'alert-danger');
      });
    });
});
