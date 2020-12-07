const socket = io();
const username = $('#username-data').val();

socket.on('force logout', (logoutUsername) => {
  if (logoutUsername === username) {
    console.log('logout');
    fetch('/api/users/logout', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.ok) {
        // delete jwt
        document.cookie =
          'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/';
      }
    });
  }
});
