const socket = io();

const username = $('#username-data').val();
const createContact = $('#create-contact');
const contactName = $('#emergency-name');
const contactPhone = $('#emergency-phone');
const contacts = $('.contacts');
const contactModal = $('#contactModal');
const confirmBtn = $('#confirmBtn');

const removeContactModal = $('#removeContactModal');
const removeConfirmBtn = $('#removeConfirmBtn');
const deleteText = $('#delete-text');
const deleteName = $('#delete-name');

function removeContact(name) {
  const remove = {
    username: username,
    name: name,
  };
  console.log(`remove ${name} from frontend`);
  fetch(`/api/contacts`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(remove),
  }).catch((e) => {
    console.log(e);
  });
}

function outputContact(newContact) {
  const contact = document.createElement('div');
  contact.classList.add('contact');
  contact.classList.add('p-3');
  const id = `del-${newContact.name}`;
  contact.innerHTML = `<span><h6> ${newContact.name} </h6></span><span class="ml-3">${newContact.phone}<span class="ml-2 contact-edit-button" id="${id}" ><i class="far fa-edit" style="cursor: pointer;"></i></span></span>`;
  contacts.append(contact).on('click', `#${id}`, () => {
    deleteText.text(
      `Are you sure you want to remove ${newContact.name} as your emergency contact?`
    );
    deleteName.text(`${newContact.name}`);
    removeContactModal.modal('show');
  });
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

removeConfirmBtn.on('click', (event) => {
  event.preventDefault();
  removeContact(deleteName.text());
});

createContact.on('click', () => {
  contactModal.modal('show');
});

socket.on('remove a contact', () => {
  contacts.empty();
  loadContact();
});

// Create a new contact
socket.on('create new contact', (newContact) => {
  outputContact(newContact);
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
  })
    .then(() => {
      contactName.val('');
      contactPhone.val('');
    })
    .catch((e) => {
      console.log(e);
    });
});
