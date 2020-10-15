/* global io */
const socket = io();

const username = $('#username-data').val();
socket.emit('join room', username);

const logoutBtn = $('#logoutBtn');

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
    user.innerHTML = `<li class="list-group-item list-group-item-action">${data.username}</li>`;
    $('#online-list').append(user);
  } else {
    user.innerHTML = `<li class="list-group-item list-group-item-action offline-list-item">${data.username}</li>`;
    $('#offline-list').append(user);
  }

  user.addEventListener('click', (event) => {
    const otherUsername = event.target.innerHTML;
    const roomId =
      username < otherUsername
        ? `${username}${otherUsername}`
        : `${otherUsername}${username}`;
    window.location.href = `/private-chat/${roomId}`;
  });
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
    body: JSON.stringify({ online: false }),
  }).then((res) => {
    console.log('yikes');
    if (res.ok) {
      // delete jwt
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/';
    }
  });
});
