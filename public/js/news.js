const socket = io();

const createNews = $('#create-news');
const newsModal = $('#newsModal');
const userlistModal = $('userlistModal');
const news = $('.news');
const text = $('#news-text');
const post = $('#confirmBtn');
const username = $('#username-data').val();
const citynameBtn = $('#cityNameBtn');
document.getElementById('create-news').style.visibility = 'hidden';


function toBase64(arr) {
  //arr = new Uint8Array(arr) if it's an ArrayBuffer
  return btoa(
     arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}


function outputNews(newNews) {
  const timestamp = new Date(newNews.timestamp).toLocaleString();
  const newsdiv = document.createElement('div');
  newsdiv.classList.add('news');
  newsdiv.classList.add('p-3');
  const newsId = `ann-${newNews._id}`;
  newsdiv.innerHTML = `<p class="meta mb-1"> ${newNews.sender} <span class="ml-3"> ${timestamp} </span></p>
  <p id=${newsId}> ${newNews.message}<button type="button" id = "forwardBtn" class="btn btn-info float-right" >FORWARD</button></p>
  <img src="data:image/png;base64,${toBase64( newNews.photo.data.data)}"> `;
  news.prepend(newsdiv);

  document.getElementById("forwardBtn").addEventListener('click', () => {
    newsModal.modal('show');
  });
}

function loadNews(cityname) {
  fetch(`/api/news/${cityname}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((json) => {
      json.forEach((news) => {
        console.log(news)
        outputNews(news);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}



citynameBtn.on('click', (element) => {
  element.preventDefault();
  news.empty();
  var cityname = $('#cityname-input').val();
  $('#cityname-data').text(cityname);
  loadNews(cityname);
  document.getElementById('create-news').style.visibility = 'visible';
  $('#cityname-input').val('');
});



createNews.on('click', () => {
  newsModal.modal('show');
  text.val('');
  var photo = document.querySelector('input[type="file"]');
  photo.value = '';
});

socket.on('new news', (newMsg) => {
  outputNews(newMsg);
  console.log(newMsg)
});

post.on('click', () => {
  const cityname = $('#cityname-data').text();
  var photo = document.querySelector('input[type="file"]');
  var formData = new FormData();
  formData.append("sender", username);
  formData.append("message", text.val());
  formData.append("photo", photo.files[0]);
  formData.append("cityname", cityname);
  fetch(`/api/news/`, {
    method: 'POST',
    body: formData,
  }).catch((e) => {
    console.log(e);
  });
});
