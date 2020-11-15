const socket = io();

const username = $('#username-data').val();
const createContact = $('#create-contact');
const editContact = $('#edit-contact');
const editButton = $('.contact-edit-button');

const contactModal = $('#contactModal');
const confirmBtn = $('#confirmBtn');
const removeContactModal = $('#removeContactModal');
const removeConfirmBtn = $('#removeConfirmBtn');

const contactName = $('#emergency-name');
const contactPhone = $('#emergency-phone');
const contacts = $('.contacts');

function outputContact(newContact) {
  const contact = document.createElement('div');
  contact.classList.add('contact');
  contact.classList.add('p-3');
  contact.innerHTML = `<span><h6> ${newContact.name} </h6></span><span class="ml-3">${newContact.phone}<span class="ml-2 contact-edit-button"><i class="fas fa-minus-circle"></i></span></span>`;
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

jQuery(loadContact);

socket.on('create new contact', (newContact) => {
  outputContact(newContact);
});

socket.on('remove a contact', () => {
  contacts.empty();
  loadContact();
});

editContact.on('click', '.contact-edit-button', () => {
  console.log('click');
  if ($(this).css('display') === 'none') {
    $(this).css('display', 'inline-block');
  } else {
    $(this).css('display', 'none');
  }
});

editButton.on('click', () => {
  removeContactModal.modal('show');
});

createContact.on('click', () => {
  contactModal.modal('show');
});

removeConfirmBtn.on('click', (event) => {
  event.preventDefault();
  const remove = {
    username: username,
    // TODO: get the correct name through id
    name: 'Mom',
  };
  fetch(`/api/contacts`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(remove),
  }).catch((e) => {
    console.log(e);
  });
});

confirmBtn.on('click', (event) => {
  event.preventDefault();

  const newContact = {
    username: username,
    name: contactName.val(),
    phone: contactPhone.val(),
  };

  fetch(`/api/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newContact),
  }).catch((e) => {
    console.log(e);
  });
});
