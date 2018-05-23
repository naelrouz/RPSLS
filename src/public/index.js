const socket = io();
const messages = document.querySelector('.messages');
const messagesForm = document.querySelector('.messages__form');
const messagesFormInput = document.querySelector('.messages__form__input');
//
const usernameForm = document.querySelector('.username__form');
const usernameFormInput = document.querySelector('.username__form__input');

const NEW_MESSAGE = 'NEW_MESSAGE';
const CHANGE_USERNAME = 'CHANGE_USERNAME';

// Emit message
messagesForm.addEventListener('submit', e => {
  e.preventDefault();

  //   const message = messagesFormInput.value;
  //   console.log('message:', message);

  socket.emit(NEW_MESSAGE, { message: messagesFormInput.value });
  messagesFormInput.value = '';
  return false;
});

// Emit username
usernameForm.addEventListener('submit', e => {
  e.preventDefault();
  socket.emit(CHANGE_USERNAME, { username: usernameFormInput.value });
  //   usernameFormInput.value = '';
  return false;
});

// Listen on NEW_MESSAGE
socket.on(NEW_MESSAGE, payload => {
  console.log('payload', payload);
  const li = document.createElement('li');
  li.innerHTML = `${payload.username} :  ${payload.message}`;

  messages.appendChild(li);
});

// $('form').submit(function () {
//     socket.emit('chat message', $('#m').val());
//     $('#m').val('');
//     return false;
// });
