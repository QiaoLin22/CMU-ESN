/* global io */
const socket = io();

const username = $('#username-data').val();
socket.emit('join room', username);

// const ok = $('.status-btn:nth-child(1)');
// const help = $('.status-btn:nth-child(2)');
// const emergency = $('.status-btn:nth-child(3)');
// const na = $('.status-btn:nth-child(4)');

function getGetOptions() {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

function outputUser(user) {
  const { online, numUnreadMessages } = user;
  const otherUsername = user.username;
  const { status } = user.latestStatus;

  let icon = '';
  if (status === 'OK') {
    icon = '<i class="far fa-check-circle ml-1" style="color: #18b87e"></i>';
  } else if (status === 'Help') {
    icon = '<i class="fas fa-info-circle ml-1" style="color: #ffd500"></i>';
  } else if (status === 'Emergency') {
    icon = '<i class="fas fa-first-aid ml-1" style="color: #fb5252"></i>';
  } else if (status === undefined || status === 'Undefined') {
    icon = '<i class="far fa-question-circle ml-1" style="color: #d8d8d8"></i>';
  }

  const roomId =
    username < otherUsername
      ? `${username}${otherUsername}`
      : `${otherUsername}${username}`;

  const userDiv = document.createElement('div');
  const readIcon = `<i class="fas fa-circle ml-4" id=${roomId} style="color: #44b3c5; display: none; position:absolute; top: 35%; right: 3%; height: 20%;"></i>`;

  userDiv.classList.add('online-item');
  if (user.username === username) {
    userDiv.style.cursor = 'not-allowed';
    userDiv.style.pointerEvents = 'none';
  }

  if (online) {
    userDiv.innerHTML = `<li class="list-group-item list-group-item-action online-list-item" >${`${`${user.username}${icon}${readIcon}`}`}</li>`;
    $('#online-list').append(userDiv);
  } else {
    userDiv.innerHTML = `<li class="list-group-item list-group-item-action offline-list-item">${`${`${user.username}${icon}${readIcon}`}`}</>`;
    $('#offline-list').append(userDiv);
  }

  if (numUnreadMessages > 0) {
    document.getElementById(roomId).style.display = 'block';
  } else {
    document.getElementById(roomId).style.display = 'none';
  }

  userDiv.addEventListener('click', () => {
    window.location.href = `/private-chat/${roomId}`;
  });
}

/* retrieve userlist */
function retrieveUsers() {
  // fetch "/api/users" request to retrieve userlist
  fetch('/api/users', getGetOptions())
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      data.forEach((user) => outputUser(user));
    })
    .catch((e) => {
      console.log(e);
    });
}

/* updateDirectory request handler */
socket.on('updateDirectory', () => {
  console.log('updateDirectory');
  $('#offline-list').empty();
  $('#online-list').empty();
  retrieveUsers();
});

jQuery(retrieveUsers);
