const createAnnounce = $('#create-announcement');
const announceModal = $('#announceModal');

createAnnounce.on('click', () => {
  announceModal.modal('show');
});
