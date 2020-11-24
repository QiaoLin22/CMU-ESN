/* global io */
const socket = io();

const createAnnounce = $('#create-announcement');
const announceModal = $('#announceModal');
const announcements = $('.announcements');
const text = $('#announcement-text');
const post = $('#confirmBtn');
const username = $('#username-data').val();

function outputAnnouncement(newAnnouncement) {
  const timestamp = new Date(newAnnouncement.timestamp).toLocaleString();
  const announce = document.createElement('div');
  announce.classList.add('announcement');
  announce.classList.add('p-3');
  const announcementId = `ann-${newAnnouncement._id}`;
  announce.innerHTML = `<p class="meta mb-1"> ${newAnnouncement.sender} <span class="ml-3"> ${timestamp} </span></p><p class="collapse" id=${announcementId} aria-expanded="false"> ${newAnnouncement.message} </p><a role="button" class="collapsed" data-toggle="collapse" href="#${announcementId}"aria-expanded="false" aria-controls=${announcementId}></a>`;
  announcements.prepend(announce);
}

function loadAnnouncement() {
  fetch(`/api/announcements`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((json) => {
      json.forEach((announcement) => {
        outputAnnouncement(announcement);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

jQuery(loadAnnouncement);

createAnnounce.on('click', () => {
  announceModal.modal('show');
});

socket.on('new announcement', (newMsg) => {
  outputAnnouncement(newMsg);
});

post.on('click', (event) => {
  event.preventDefault();

  const newAnnouncement = {
    sender: username,
    message: text.val(),
  };

  fetch(`/api/announcements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAnnouncement),
  }).catch((e) => {
    console.log(e);
  });
});
