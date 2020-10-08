/* global io */
const socket = io('http://localhost:5000');

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
}

function retrieveUsers() {
  fetch('/api/users', getGetOptions())
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      data.users.forEach((user) => {
        outputUser(user, user.online);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

socket.on('updateDirectory', () => {
  $('#offline-list').empty();
  $('#online-list').empty();
  retrieveUsers();
});

$(document).ready(retrieveUsers);

logoutBtn.on('click', () => {
  fetch('/api/users/logout', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
});
