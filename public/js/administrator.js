/* eslint-disable no-undef */
const userlistModal = $('#userlistModal');
const confirmModal = $('#confirmModal');
userlistModal.modal('show');
const cancel = $('#cancelBtn');
const discard = $('#discardBtn');
const save = $('#saveBtn');
const username = $('#username-data').val();
const profileUserName = $('#userInfo-username');
const profilePassword = $('#userInfo-password');
const profileprivilegeLevel = $('#userInfo-privilegeLevel');
const errorAlert = $('#error-alert');

/** Forward notification box */
function displayNotification(notifyMessage) {
  $('#notifyMessage').text(notifyMessage);
  confirmModal.modal('show');
  $('#notifyBtn').on('click', () => {
    confirmModal.modal('hide');
    window.location.href = '/profile';
  });
}

function outputUserProfile(user) {
  $('#userProfile-data').text(`${user.username}'s profile`);
  profileUserName.val(user.username);
  profileprivilegeLevel.val(user.privilegeLevel);
  if (user.accountStatus) {
    $('#activeRadio').attr('checked', 'checked');
  } else {
    $('#inactiveRadio').attr('checked', 'checked');
  }
}

function getUserInfo(userId) {
  fetch(`api/users/profile/${userId}`, {
    method: 'GET',
  })
    .then((res) => {
      return res.json();
    })
    .then((user) => {
      console.log(user);
      outputUserProfile(user);
    })
    .catch((e) => {
      console.log(e);
    });
}

/* Output user list */
function outputUserList(user) {
  const { online } = user;
  const userDiv = document.createElement('div');
  userDiv.classList.add('online-item');
  if (user.username === username) {
    userDiv.style.cursor = 'not-allowed';
    userDiv.style.pointerEvents = 'none';
  }
  if (online) {
    userDiv.innerHTML = `<li class="list-group-item list-group-item-action online-list-item" >${`${user.username}`}</li>`;
    $('#online-list').append(userDiv);
  } else {
    userDiv.innerHTML = `<li class="list-group-item list-group-item-action offline-list-item">${`${user.username}`}</>`;
    $('#offline-list').append(userDiv);
  }
  userDiv.addEventListener('click', () => {
    getUserInfo(user.username);
    userlistModal.modal('hide');
  });
}

function getUserList() {
  fetch('/api/users', {
    method: 'GET',
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      $('#offline-list').empty();
      $('#online-list').empty();
      data.forEach((user) => outputUserList(user));
    })
    .catch((e) => {
      console.log(e);
    });
}

save.on('click', () => {
  errorAlert.attr('hidden', false);

  const profileAccountStatus = $(
    "input[name='accountStatusRadios']:checked"
  ).val();
  const prevUsernamestring = $('#userProfile-data').text();
  const prevUsername = prevUsernamestring.substr(
    0,
    prevUsernamestring.indexOf("'s profile")
  );
  const newProfileInfo = {
    newUsername: profileUserName.val(),
    password: profilePassword.val(),
    accountStatus: profileAccountStatus,
    privilegeLevel: profileprivilegeLevel.val(),
  };
  fetch(`api/users/${prevUsername}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProfileInfo),
  })
    .then((res) => {
      if (res.ok) {
        confirmModal.modal('show');
        displayNotification('changed successfully');
      } else {
        console.log('error');
        res.json().then((json) => {
          console.log(json);
          errorAlert.text(json.error);
          errorAlert.removeAttr('hidden');
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

cancel.on('click', () => {
  window.location.href = '/profile';
});

discard.on('click', () => {
  window.location.href = '/profile';
});

jQuery(getUserList);
