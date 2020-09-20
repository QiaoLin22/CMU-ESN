const modal = document.getElementById('welcome');
const closeBtn = document.getElementById('modalClose');

// modal close: click on x button
closeBtn.onclick = () => {
  modal.style.display = 'none';
};

// modal close: click on anywhere outside the modal
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};
