export {};
const log = document.querySelector<HTMLDivElement>('#chatLog');
const form = document.querySelector<HTMLFormElement>('#chatForm');
const input = document.querySelector<HTMLInputElement>('#chatInput');
const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(`${protocol}//${location.host}/api/community/socket`);

socket.addEventListener('message', (event) => {
  if (!log) return;
  const div = document.createElement('div');
  div.className = 'chat-message';
  div.textContent = String(event.data);
  log.append(div);
  log.scrollTop = log.scrollHeight;
});
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!input?.value.trim()) return;
  socket.send(input.value.trim());
  input.value = '';
});
