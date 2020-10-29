const msgEle = $('#msg');
const roomId = (() => {
  // check if this is private chat
  const urlList = window.location.href.split('/');
  const lastStr = urlList[urlList.length - 2];

  return lastStr === 'public-wall' ? 'public' : lastStr;
})();
$('#submitBtn').on('click', (element) => {
  element.preventDefault();
  const keywords = msgEle.val();
  fetch(`/api/search/messages/${roomId}/${keywords}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(() => {
      msgEle.val('');
    })
    .catch((e) => {
      console.log(e);
    });
});
