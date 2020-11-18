const socket = io();

const createNews = $('#create-news');
const newsModal = $('#newsModal');
const news = $('.news');
const text = $('#news-text');
const post = $('#confirmBtn');
const username = $('#username-data').val();
const citynameBtn = $('#cityNameBtn');
document.getElementById('create-news').style.visibility = 'hidden';


/*function outputAnnouncement(newAnnouncement) {
  const timestamp = new Date(newAnnouncement.timestamp).toLocaleString();
  const announce = document.createElement('div');
  announce.classList.add('announcement');
  announce.classList.add('p-3');
  const announcementId = `ann-${newAnnouncement._id}`;
  announce.innerHTML = `<p class="meta mb-1"> ${newAnnouncement.sender} <span class="ml-3"> ${timestamp} </span></p>
  <p id=${announcementId}> ${newAnnouncement.message}</p><button type="button" class="icon-share-alt" ></button>`;
  announcements.prepend(announce);
}*/

function loadNews(cityname) {
  fetch(`/api/news/${cityname}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(cityname)
      //json.forEach((announcement) => {
        //outputAnnouncement(announcement);
      //});
    })
    .catch((e) => {
      console.log(e);
    });
}



citynameBtn.on('click', (element) => {
  element.preventDefault();
  var cityname = $('#cityname-input').val();
  $('#cityname-data').text(cityname);
  loadNews(cityname);
  console.log(cityname)
  document.getElementById('create-news').style.visibility = 'visible';
  $('#cityname-input').val('');
});



createNews.on('click', () => {
  newsModal.modal('show');
});

socket.on('new news', (newMsg) => {
  //outputAnnouncement(newMsg);
});

post.on('click', (event) => {
  const cityname = $('#cityname-data').text();
 
  const newNews = {
    sender: username,
    message: text.val(),
    cityname: cityname,
  };

  fetch(`/api/news/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newNews),
  }).catch((e) => {
    console.log(e);
  });
});
