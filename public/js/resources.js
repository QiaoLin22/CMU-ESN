/* global io */
const socket = io();

const username = $('#username-data').val();
const postsContainer = $('.posts-container');
const addPostBtn = $('#add-post-btn');
const addPostModal = $('#add-post-modal');

const newPostResourceType = $('#new-post-resource-type');
const newPostMessage = $('#new-post-message');
const submitPostBtn = $('#submit-post-btn');

let zipCode;
const enterZipModal = $('#enter-zip-modal');
const editZipForm = $('#edit-zip-form');

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
  postsContainer.prepend(postDiv);
}

function loadResourcePosts() {
  fetch(`/api/resource-posts?zip=${zipCode}`, {
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

  const newPostType = $("input[name='resourceTypeRadios']:checked").val();

  const newPost = {
    sender: username,
    postType: newPostType,
    resourceType: newPostResourceType.val(),
    message: newPostMessage.val(),
    zip: $('#zip-code').val(),
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

function showEnterZipModal() {
  enterZipModal.modal('show');
}

$('#zip-save-btn').click(async (event) => {
  event.preventDefault();
  const zip = $('#zip-code').val();
  console.log(zip);
  await fetch(`/api/users/${username}/zip`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ zip }),
  });
  zipCode = zip;
  enterZipModal.modal('hide');
  $('#curr-zip-code').val(zip);
  loadResourcePosts();
});

async function getUserZip() {
  const res = await fetch(`/api/users/${username}/zip`, {
    method: 'GET',
  });

  const { zip } = await res.json();

  if (!zip) {
    return false;
  } else {
    zipCode = zip;
    return true;
  }
}

editZipForm.submit(async (e) => {
  e.preventDefault();

  const newZip = $('#curr-zip-code').val();
  if (newZip !== zipCode) {
    await fetch(`/api/users/${username}/zip`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ zip: newZip }),
    });

    window.location.reload();
  }
});

jQuery(async () => {
  if (await getUserZip()) {
    $('#curr-zip-code').val(zipCode);
    loadResourcePosts();
  } else {
    showEnterZipModal();
  }
});
