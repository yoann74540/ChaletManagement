
document.addEventListener("DOMContentLoaded", () => {
  renderBottomBar(null);
});

const heaterToggle = document.getElementById("heaterToggle");
if (heaterToggle) {
  heaterToggle.addEventListener("change", (event) => {
    let message = "UNKNOW";
    if (heaterToggle.checked) {
      console.log("Heater turned ON");
      setTemperature(22); // Example temperature when heater is ON
      message = "ON";
    } else {
      console.log("Heater turned OFF");
      message = "OFF"
      setTemperature(16); // Example temperature when heater is OFF
    }
    const result = sendMQTTMEssage("chauffage", message);
  });
}

const logoutBtn = document.getElementById("logoutBtn")
if(logoutBtn){
  logoutBtn.addEventListener("click", () =>{
    document.getElementById("confirm-logout").classList.remove("hidden");
    document.getElementById('settings-panel').style.display ='none';
  });
}

document.getElementById("cancelLogoutBtn").addEventListener("click", () =>{
  document.getElementById("confirm-logout").classList.add("hidden");
  document.getElementById('settings-panel').style.display ='block';
});

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
  document.getElementById('auth').style.display = 'block';
  document.getElementById('settings-panel').style.display ='none';
  //document.getElementById('confirm-logout').style.display='none';

  //active le bouton home
  document.getElementById('homeBtn').classList.add('active');
  document.getElementById('helpBtn').classList.remove('active');
}

function showgauge() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('gauge-modal').style.display = 'block';
  document.getElementById('settings-panel').style.display ='none';

  document.getElementById('gaugeBtn').classList.add('active');
  document.getElementById('calendarBtn').classList.remove('active');
  document.getElementById('gearBtn').classList.remove('active');
}

function showSettings() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('gauge-modal').style.display = 'none';
  document.getElementById('settings-panel').style.display ='block';

  document.getElementById('gaugeBtn').classList.remove('active');
  document.getElementById('calendarBtn').classList.remove('active');
  document.getElementById('gearBtn').classList.add('active');
}

function showCalendar() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('gauge-modal').style.display = 'none';
  document.getElementById('settings-panel').style.display ='none';

  document.getElementById('gaugeBtn').classList.remove('active');
  document.getElementById('calendarBtn').classList.add('active');
  document.getElementById('gearBtn').classList.remove('active');
}


function renderBottomBar(user){
  const bar = document.getElementById("bottom-bar");
  bar.innerHTML = "";

  if(!user){
    bar.innerHTML = "<button class=\"tab active\" id=\"homeBtn\"><i class=\"fa-solid fa-house\"></i></button><button class=\"tab\" id=\"helpBtn\"><i class=\"fa-solid fa-circle-info\"></i></button>";
    document.getElementById('homeBtn').addEventListener("click", () => {
      setActiveTab("homeBtn");
      showHome();
    });
    document.getElementById('helpBtn').addEventListener("click", () => {
      setActiveTab("helpBtn");
      showHelp();
    });

    setActiveTab("homeBtn");
    showHome();
  }else{
    bar.innerHTML = "<button class=\"tab active\" id=\"gaugeBtn\"><i class=\"fa-solid fa-gauge-high\"></i></button><button class=\"tab\" id=\"calendarBtn\"><i class=\"fa-solid fa-calendar\"></i></button><button class=\"tab\" id=\"gearBtn\"><i class=\"fa-solid fa-gear\"></i></button>";
    
    document.getElementById('gaugeBtn').addEventListener("click", () => {
      setActiveTab("gaugeBtn");
      showgauge();
    });
    document.getElementById('calendarBtn').addEventListener("click", () => {
      setActiveTab("calendarBtn");
      showCalendar();
    });
    document.getElementById('gearBtn').addEventListener("click", () => {
      setActiveTab("gearBtn");
      showSettings();
    });

    setActiveTab("gaugeBtn");
    showgauge();
  }
}

function setActiveTab(tabId){
  document.querySelectorAll("#bottom-bar .tab").forEach(btn => btn.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}


function setTemperature(value){
  document.querySelector('.temp-value').textContent = value;
}
