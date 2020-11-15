const socket = io();

const username = $('#username-data').val();
const createContact = $('#create-contact');
const editContact = $('#edit-contact');
const editButton = $('.contact-edit-button');

const contactModal = $('#contactModal');
const contactName = $('#emergency-name');
const contactNum = $('#emergency-phone');
const contacts = $('.contacts');

function outputContact(newContact){
  const contact = document.createElement('div');
  contact.classList.add('contact');
  contact.classList.add('p-3');
  contact.innerHTML = `<span><h6> ${newContact.name} </h6></span><span class="ml-3">${newContact.phone}<span class="ml-2 contact-edit-button" id="${newContact.name}"><i class="fas fa-minus-circle"></i></span></span>`;
  contacts.append(contact);
}

function loadContact() {
  fetch(`/api/contacts`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((json) => {
      json.forEach((contact) => {
        outputContact(contact);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

socket.on('update Emergency Contact', (newContact) => {
  outputContact(newContact);
});

socket.on('remove a contact', () => {
  loadContact();
});

editContact.on('click', () => {
  if (editButton.css('display') === 'none') {
    editButton.css('display', 'inline-block');
  } else {
    editButton.css('display', 'none');
  }
});

createContact.on('click', () => {
  contactModal.modal('show');
});
