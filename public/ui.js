
function showMessage(type, message, duration = 3500) {
  const messageBox = document.getElementById("message-box");

  if(!messageBox) return;

  messageBox.className = "message " + type;
  messageBox.innerText = message;
  messageBox.classList.remove('hidden');

  setTimeout(() => {
    messageBox.classList.add('hidden');
  }, duration);
}

function showError(message, duration) {
    showMessage("error",message,duration);
}

function showWarning(message, duration) {
    showMessage("warning",message,duration);
}
