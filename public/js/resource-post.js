/* global io */
const socket = io();

const username = $('#username-data').val();
const resourcePost = $('#post');
const commentsContainer = $('#comments-container');
const commentEle = $('#comment');

const postId = new URL(window.location.href).pathname.split('/')[3];

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function resourceTypeIcon(resourceType) {
  switch (resourceType) {
    case 'shelter':
      return '<i class="fas fa-home mr-1"></i>';
    case 'food':
      return '<i class="fas fa-utensils mr-1"></i>';
    case 'medicine':
      return '<i class="fas fa-capsules mr-1"></i>';
    case 'medical-devices':
      return '<i class="fas fa-first-aid mr-1"></i>';
    case 'masks':
      return '<i class="fas fa-head-side-mask mr-1"></i>';
    default:
      return undefined;
  }
}

function renderComment(commentObj) {
  const { sender, timestamp, comment } = commentObj;

  const localTime = new Date(timestamp).toLocaleString();

  const commentDiv = $('<div></div>').addClass('comment p-3');
  commentDiv.html(
    $(`      
      <div>
        <span class="meta">${sender}</span>
        <small id="timestamp" style="float: right">${localTime}</small>
      </div>
      <div>
        ${comment}
      </div>
    `)
  );
  commentsContainer.prepend(commentDiv);
}

function renderPost(post) {
  const { sender, timestamp, postType, resourceType, message, comments } = post;

  $('#resource-post-title').text(`${sender}'s Post`);

  const localTime = new Date(timestamp).toLocaleString();
  const postTypeColor = postType === 'request' ? 'red' : 'blue';

  resourcePost.html(
    $(`
      <div>
        <span class="meta">${sender}</span>
        <span id="timestamp">${localTime}</span>
      </div>
      <div>
        <span>
          ${resourceTypeIcon(resourceType)}
          ${capitalizeFirstLetter(resourceType)}
        </span>
        <span id="post-type" style="color:${postTypeColor}">
          ${capitalizeFirstLetter(postType)}
        </span>
      </div>
    <div>${message}</div>
  `)
  );

  comments.forEach((comment) => {
    renderComment(comment);
  });
}

function loadResourcePost() {
  fetch(`/api/resource-posts/${postId}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((post) => {
      renderPost(post);
    })
    .catch((e) => {
      console.log(e);
    });
}

socket.on('new resource post comment', (newComment) => {
  console.log(newComment);
  renderComment(newComment);
});

$('#submitBtn').click((event) => {
  event.preventDefault();

  const newComment = {
    sender: username,
    comment: commentEle.val(),
  };

  fetch(`/api/resource-posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newComment),
  })
    .then(() => {
      commentEle.val('');
    })
    .catch((e) => {
      console.log(e);
    });
});

jQuery(loadResourcePost);
