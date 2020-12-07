/* eslint-disable no-undef */
const socket = io();

const createNews = $('#create-news');
const newsModal = $('#newsModal');
const confirmModal = $('#confirmModal');
const userlistModal = $('#userlistModal');
const news = $('.news');
const text = $('#news-text');
const post = $('#confirmBtn');
const username = $('#username-data').val();
const citynameBtn = $('#cityNameBtn');
document.getElementById('create-news').style.visibility = 'hidden';

function toBase64(arr) {
  return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

/** Forward notification box */
function displayNotification(notifyMessage) {
  $('#forwardNotifyMessage').text(notifyMessage);
  confirmModal.modal('show');
  $('#forwardNotifyBtn').on('click', () => {
    confirmModal.modal('hide');
  });
}

/* Forward news function */
function forwardNews(recipient, newsId, roomId) {
  const formData = {
    sender: username,
    recipient: recipient,
    newsId: newsId,
    roomId: roomId,
  };

  fetch(`/api/news/forward`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      userlistModal.modal('hide');
      displayNotification(data.message);
    })
    .catch((e) => {
      console.log(e);
    });
}

/* Output user list */
function outputUser(user, newsId) {
  const { online } = user;
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

  const userDiv = document.createElement('div');
  userDiv.classList.add('online-item');
  if (user.username === username) {
    userDiv.style.cursor = 'not-allowed';
    userDiv.style.pointerEvents = 'none';
  }

  if (online) {
    userDiv.innerHTML = `<li class="list-group-item list-group-item-action online-list-item" >${`${user.username}${icon}`}</li>`;
    $('#online-list').append(userDiv);
  } else {
    userDiv.innerHTML = `<li class="list-group-item list-group-item-action offline-list-item">${`${user.username}${icon}`}</>`;
    $('#offline-list').append(userDiv);
  }
  userDiv.addEventListener('click', () => {
    const recipient = user.username;
    const roomId =
      username < recipient
        ? `${username}${recipient}`
        : `${recipient}${username}`;
    forwardNews(recipient, newsId, roomId);
  });
}

function getUserList(newsId) {
  fetch('/api/users', {
    method: 'GET',
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      $('#offline-list').empty();
      $('#online-list').empty();
      data.forEach((user) => outputUser(user, newsId));
    })
    .catch((e) => {
      console.log(e);
    });
}

function outputNews(newNews) {
  const timestamp = new Date(newNews.timestamp).toLocaleString();
  const newsdiv = document.createElement('div');
  newsdiv.classList.add('news-content');
  newsdiv.classList.add('p-3');
  const newsId = `ann-${newNews._id}`;

  if (newNews.photo === undefined) {
    newsdiv.innerHTML = `<p class="meta mb-1"> ${newNews.sender} <span class="ml-3"> ${timestamp} </span></p>
    <div id=${newsId}><p style = "margin-bottom: 0;">${newNews.message}</p><p id = "forwardBtn" class = "mt-2 news-forward"><i class="fas fa-share mr-2"></i>Forward</p></div> 
    `;
  } else {
    newsdiv.innerHTML = `<p class="meta mb-1"> ${newNews.sender} <span class="ml-3"> ${timestamp} </span></p>
    <div id=${newsId}><p style = "margin-bottom: 0;">${newNews.message}<img class="img-thumbnail mt-2" src=" ${newNews.photo}"> 
    <div id=${newsId}><p id = "forwardBtn" class = "mt-2 news-forward"><i class="fas fa-share mr-2"></i>Forward</p></div>
    `;
  }

  news.prepend(newsdiv);

  document.getElementById('forwardBtn').addEventListener('click', () => {
    userlistModal.modal('show');
    getUserList(newNews._id);
  });
}

function loadNews(cityname) {
  fetch(`/api/news/${cityname}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((json) => {
      json.forEach((newsItem) => {
        outputNews(newsItem);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

citynameBtn.on('click', (element) => {
  element.preventDefault();
  news.empty();
  const cityname = $('#cityname-input').val();
  $('#cityname-data').text(cityname);
  loadNews(cityname);
  document.getElementById('create-news').style.visibility = 'visible';
  $('#cityname-input').val('');
});

createNews.on('click', () => {
  newsModal.modal('show');
  text.val('');
  const photo = document.querySelector('input[type="file"]');
  photo.value = '';
});

socket.on('new news', (newMsg) => {
  outputNews(newMsg);
  console.log(newMsg);
});

/* Post a new news */
post.on('click', () => {
  const cityname = $('#cityname-data').text();
  const photo = document.querySelector('input[type="file"]');
  const formData = new FormData();
  formData.append('sender', username);
  formData.append('message', text.val());
  formData.append('photo', photo.files[0]);
  formData.append('cityname', cityname);
  fetch(`/api/news/`, {
    method: 'POST',
    body: formData,
  }).catch((e) => {
    console.log(e);
  });
});
