
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

function showHelp() {
  document.getElementById('help-modal').style.display = 'block';

  //active le bouton i
  document.getElementById('helpBtn').classList.add('active');
  document.getElementById('homeBtn').classList.remove('active');
}

function showHome() {
  document.getElementById('help-modal').style.display = 'none';

  //active le bouton home
  document.getElementById('homeBtn').classList.add('active');
  document.getElementById('helpBtn').classList.remove('active');
}
