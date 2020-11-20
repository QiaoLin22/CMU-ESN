// /* global io */
// const socket = io();

// const username = $('#username-data').val();
const postsContainer = $('.posts-container');

function renderResourcePosts(post) {
  const { _id, sender, timestamp, postType, resourceType, message } = post;
  console.log(_id);
  const localTime = new Date(timestamp).toLocaleString();

  const postHTML = $(`
  <div class="resource-post p-3">
    <div class="row">
      <span class="meta">${sender}</span>
      <span class="ml-3">${localTime}</span>
    </div>
    <div>${postType}</div>
    <div>${resourceType}</div>
    <div>${message}</div>
  </div>
  `);
  postsContainer.append(postHTML);
}

function loadResourcePosts() {
  fetch(`/api/resource-posts`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((posts) => {
      posts.forEach((post) => {
        renderResourcePosts(post);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

jQuery(loadResourcePosts);
