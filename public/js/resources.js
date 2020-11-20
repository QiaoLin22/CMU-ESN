/* global io */
const socket = io();

const username = $('#username-data').val();
const postsContainer = $('.posts-container');
const addPostBtn = $('#add-post-btn');
const addPostModal = $('#add-post-modal');

// const newPostResourceType = $('#new-post-resource-type');
const newPostMessage = $('#new-post-message');
const submitPostBtn = $('#submit-post-btn');

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderResourcePost(post) {
  const { _id, sender, timestamp, postType, resourceType, message } = post;

  const localTime = new Date(timestamp).toLocaleString();
  const postTypeColor = postType === 'request' ? 'red' : 'blue';

  const postDiv = $('<div></div>').addClass('resource-post p-3');

  postDiv.click(() => {
    window.location.href = `/resources/posts/${_id}`;
  });
  postDiv.html(
    $(`
      <div>
        <span class="meta">${sender}</span>
        <span id="timestamp">${localTime}</span>
      </div>
      <div>
        <span>${capitalizeFirstLetter(resourceType)}</span>
        <span id="post-type" style="color:${postTypeColor}">
          ${capitalizeFirstLetter(postType)}
        </span>
      </div>
      <div>${message}</div>
  `)
  );
  postsContainer.append(postDiv);
}

function loadResourcePosts() {
  fetch(`/api/resource-posts`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((posts) => {
      posts.forEach((post) => {
        renderResourcePost(post);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

addPostBtn.click(() => {
  addPostModal.modal('show');
});

submitPostBtn.click((event) => {
  event.preventDefault();

  const newPost = {
    sender: username,
    postType: undefined,
    resourceType: undefined,
    message: newPostMessage.val(),
  };
  console.log(newPost);
  fetch(`/api/resource-posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPost),
  }).catch((e) => {
    console.log(e);
  });
});

socket.on('new resource post', (newPost) => {
  renderResourcePost(newPost);
});

jQuery(loadResourcePosts);
