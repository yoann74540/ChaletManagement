
document.addEventListener("DOMContentLoaded", () => {
  renderBottomBar(null);
});

const heaterToggle = document.getElementById("heaterToggle");
if (heaterToggle) {
  heaterToggle.addEventListener("change", async () => {
    const isOn = heaterToggle.checked;

    if(pendingCommand) return;

    pendingCommand = true;
    heaterToggle.disabled = true;
    showLoading("Commande en cours....");

    try{
      await startCommandTimeout();

      await sendMQTTMEssage("chauffage", isOn);

    } catch(err){
      clearCommandTimeout();
      pendingCommand = false;
      heaterToggle.disabled = false;
      if(err.name !== "MqttLimitError" ){
        console.log("Erreur chauffage;", err);
        showError("Impossible de changer l'etat du chauffage");
        hideMessage();
      }
      heaterToggle.checked = !isOn;
    }
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

const historyBtn = document.getElementById("historyBtn");
if(historyBtn){
  historyBtn.addEventListener("click", async () =>{
    document.getElementById("history-modal").classList.remove("hidden");
    document.getElementById('settings-panel').style.display ='none';
    document.getElementById("history-modal").querySelector(".history-container").scrollTop = 0;
    showLoading("Chargement de l'historique...");
    await loadHistory();
  });
}

document.getElementById("cancelHistory").addEventListener("click", () =>{
  document.getElementById("history-modal").classList.add("hidden");
  document.getElementById('settings-panel').style.display ='block';
});

function showMessage(type, message, duration = 3500) {
  const messageBox = document.getElementById("message-box");

  if(!messageBox) return;

  messageBox.className = "message " + type;
  messageBox.classList.remove('hidden');

  if( type != "loading"){
    messageBox.innerText = message;
    setTimeout(() => {
      messageBox.classList.add('hidden');
    }, duration);
  }else{
    messageBox.innerHTML = `
      <span class="spinner"></span>
      <span>${message}</span>
      `;
  }
}

function showError(message, duration) {
    showMessage("error",message,duration);
}

function showWarning(message, duration) {
    showMessage("warning",message,duration);
}

function showLoading(message){
    showMessage("loading",message);
}

function showSuccess(message, duration){
    showMessage("success",message,duration);
}

function hideMessage(){
  document.getElementById("message-box").classList.add('hidden');
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

  //active le bouton home
  document.getElementById('homeBtn').classList.add('active');
  document.getElementById('helpBtn').classList.remove('active');
}

function showgauge() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('gauge-modal').style.display = 'block';
  document.getElementById('settings-panel').style.display ='none';
  document.getElementById("confirm-logout").classList.add("hidden");
  document.getElementById("history-modal").classList.add("hidden");

  document.getElementById('gaugeBtn').classList.add('active');
  document.getElementById('calendarBtn').classList.remove('active');
  document.getElementById('gearBtn').classList.remove('active');
}

function showSettings() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('gauge-modal').style.display = 'none';
  document.getElementById('settings-panel').style.display ='block';
  
  document.getElementById("history-modal").classList.add("hidden");
  document.getElementById("confirm-logout").classList.add("hidden");
  document.getElementById('gaugeBtn').classList.remove('active');
  document.getElementById('calendarBtn').classList.remove('active');
  document.getElementById('gearBtn').classList.add('active');
}

function showCalendar() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('gauge-modal').style.display = 'none';
  document.getElementById('settings-panel').style.display ='none';

  document.getElementById("history-modal").classList.add("hidden");
  document.getElementById("confirm-logout").classList.add("hidden");
  document.getElementById('gaugeBtn').classList.remove('active');
  document.getElementById('calendarBtn').classList.add('active');
  document.getElementById('gearBtn').classList.remove('active');
}


function renderBottomBar(user){
  const bar = document.getElementById("bottom-bar");
  bar.innerHTML = "";

  if(!user){
    bar.innerHTML = "<button class=\"tab active\" id=\"homeBtn\"><i class=\"fa-solid fa-house\"></i><span class=\"tab-label\">Accueil</span></button><button class=\"tab\" id=\"helpBtn\"><i class=\"fa-solid fa-circle-info\"></i><span class=\"tab-label\">Aide</span></button>";
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
    bar.innerHTML = "<button class=\"tab active\" id=\"gaugeBtn\"><i class=\"fa-solid fa-gauge-high\"></i><span class=\"tab-label\">Pilotage</span></button><button class=\"tab\" id=\"calendarBtn\"><i class=\"fa-solid fa-calendar\"></i><span class=\"tab-label\">Calendrier</span></button><button class=\"tab\" id=\"gearBtn\"><i class=\"fa-solid fa-gear\"></i><span class=\"tab-label\">Paramètres</span></button>";
    
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

function setTemperatureDate(GetDate){

  let date = "";

  date = GetDate.toDate();

  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + " à " + date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  document.querySelector('.temp-date').textContent = 'Le ' + formattedDate;
}

function renderHistory(items){
  const container = document.getElementById("history-list");
  container.innerHTML = "";

  if( items.length === 0 ){
    container.innerHTML = "<p>Aucun historique disponible.</p>";
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");

    let date = "";

    date = item.createdAt.toDate();

    const formattedDate = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) + " à " + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    let content = "";

    if(item.type === "heater"){
      content = `
        <div class="history-title">
          Chauffage : ${item.value === true ? "activé" : "désactivé"}
        </div>
      `;
    }

    if(item.type === "temperature"){
      content = `
        <div class="history-title">
          Température interieur : ${item.value}°C
        </div>
      `;
    }

    div.innerHTML = `
      <div class= "history-item">
        ${content}
        <div class="history-date">
          ${formattedDate}
        </div>
      </div>
    `;

    container.appendChild(div);
  });

}