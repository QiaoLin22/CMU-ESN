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

function outputUser(data, online, status, hasUnread) {
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

  const otherUsername = data.username;
  const roomId =
    username < otherUsername
      ? `${username}-${otherUsername}`
      : `${otherUsername}-${username}`;
  const user = document.createElement('div');
  const readIcon = `<i class="fas fa-circle ml-4" id=${roomId} style="color: #44b3c5; display: none; position:absolute; top: 35%; right: 3%; height: 20%;"></i>`;

  user.classList.add('online-item');
  if (data.username === username) {
    user.style.cursor = 'not-allowed';
    user.style.pointerEvents = 'none';
  }

  if (online) {
    user.innerHTML = `<li class="list-group-item list-group-item-action online-list-item" >${`${`${data.username}${icon}${readIcon}`}`}</li>`;
    $('#online-list').append(user);
  } else {
    user.innerHTML = `<li class="list-group-item list-group-item-action offline-list-item">${`${`${data.username}${icon}${readIcon}`}`}</>`;
    $('#offline-list').append(user);
  }
  if (hasUnread) {
    document.getElementById(roomId).style.display = 'block';
  } else {
    document.getElementById(roomId).style.display = 'none';
  }

  user.addEventListener('click', () => {
    window.location.href = `/private-chat/${roomId}`;
  });
}

// function checkUnreadMessage(otherUsername) {
//   fetch(`/api/messages/unread/${otherUsername}`, getGetOptions())
//     .then((res) => {
//       return res.json();
//     })
//     .then((json) => {
//       return json;
//     });
// }

function retrieveUsers() {
  fetch('/api/users', getGetOptions())
    .then((res) => {
      return res.json();
    })
    .then(async (data) => {
      /* eslint-disable no-await-in-loop */
      for (const user of data.users) {
        const res = await fetch(
          `/api/messages/unread/${user.username}`,
          getGetOptions()
        );
        const hasUnread = await res.json();
        // TODO: make sure the data from the response is the latest status
        const { status } = user.statusArray[user.statusArray.length - 1];
        console.log(user);
        outputUser(user, user.online, status, hasUnread);
      }
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

// function updateStatus(status) {
//   status.on('click', () => {
//     const newStatus = {
//       username: username,
//       status: status.text(),
//     };
//     console.log(newStatus);
//     fetch('/api/users', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newStatus),
//     }).catch((e) => {
//       console.log(e);
//     });
//   });
// }
// updateStatus(ok);
// updateStatus(help);
// updateStatus(emergency);
// updateStatus(na);
