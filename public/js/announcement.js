const socket = io();

const createAnnounce = $('#create-announcement');
const announceModal = $('#announceModal');
const announcements = $('.announcements');
const text = $('#announcement-text');
const post = $('#confirmBtn');
const username = $('#username-data').val();
const roomId = 'announcement';

function outputAnnouncement(newAnnouncement) {
  const timestamp = new Date(newAnnouncement.timestamp).toLocaleString();
  const announce = document.createElement('div');
  announce.classList.add('announcement');
  announce.classList.add('p-3');
  //TODO: need unique id to replace collapseExample -> each announcement matches with one show button
  //TODO: show button won't show unless the announcement is long
  announce.innerHTML = `<p class="meta mb-1"> ${username} <span class="ml-3"> ${timestamp} </span></p><p class="collapse" id="collapseExample" aria-expanded="false"> ${newAnnouncement.message} </p><a role="button" class="collapsed" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"></a>`;
  announcements.append(announce);
}

function loadAnnouncement() {
  fetch(`/api/messages/announcement`, {
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

// jQuery(loadAnnouncement);

createAnnounce.on('click', () => {
  announceModal.modal('show');
});

socket.on('new announcement', (newMsg) => {
  outputAnnouncement(newMsg);
});

post.on('click', (event) => {
  event.preventDefault();

  const newAnnouncement = {
    username: username,
    message: text.val(),
    roomId: roomId,
  };
  //TODO: post to database
  outputAnnouncement(newAnnouncement);
  console.log(newAnnouncement);
});
