/* global io */
const socket = io();

const logoutBtn = $('#logoutBtn');
const username = $('#username-data').val();
const ok = $(".status-btn:nth-child(1)");
const help = $(".status-btn:nth-child(2)");
const emergency = $(".status-btn:nth-child(3)");
const undefined = $(".status-btn:nth-child(4)");



function getGetOptions() {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

function outputUser(data, online) {
  const user = document.createElement('div');
  user.classList.add('online-item');
  if (online) {
    user.innerHTML = `<li class="list-group-item list-group-item-action">${data.username+' '+data.status}</li>`;
    $('#online-list').append(user);
  } else {
    user.innerHTML = `<li class="list-group-item list-group-item-action offline-list-item">${data.username}</>`;
    $('#offline-list').append(user);
  }
}

function retrieveUsers() {
  fetch('/api/users', getGetOptions())
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      data.users.forEach((user) => {
        outputUser(user, user.online);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

socket.on('updateDirectory', () => {
  console.log('updateDirectory');
  $('#offline-list').empty();
  $('#online-list').empty();
  retrieveUsers();
});

jQuery(retrieveUsers);

logoutBtn.on('click', () => {
  fetch('/api/users/logout', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    console.log('yikes');
    if (res.ok) {
      // delete jwt
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/';
    }
  });
});

function updateStatus(status,username) {
  status.on('click', () => {
    let newStatus = {
      username: username,
      status:status.text()
    }
    fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStatus)
    }).catch((e) => {
      console.log(e);
    });
  })
}


updateStatus(ok,username)
updateStatus(help,username)
updateStatus(emergency,username)
updateStatus(undefined,username)


