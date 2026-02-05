/* ===== FIREBASE CONFIG ===== */
const firebaseConfig = {
  apiKey: "TUO_API_KEY",
  authDomain: "TUO_PROGETTO.firebaseapp.com",
  databaseURL: "https://TUO_PROGETTO.firebaseio.com",
  projectId: "TUO_PROGETTO",
  storageBucket: "TUO_PROGETTO.appspot.com",
  messagingSenderId: "TUO_ID",
  appId: "TUO_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ===== CATEGORIE ===== */
const categories = [
  { id: "musica", label: "Musica" },
  { id: "radio", label: "Radio" },
  { id: "giochi", label: "Giochi" }
];

const musica = [
  { name:"Playlist anni '80", url:"https://youtu.be/6_cAP0aXZXA" }
];

const radio = [
  {name:"Radio 80", url:"https://sphera.fluidstream.eu/radio80.aac", desc:"Pop e rock anni '80"},
  {name:"SomaFM Underground 80s", url:"http://ice1.somafm.com/u80s-128-mp3", desc:"New wave, synth, alternative"},
  {name:"80s80s Italo Disco", url:"https://streams.80s80s.de/italodiscomix/mp3-192/streams.80s80s.de/", desc:"Italo disco anni '80"},
  {name:"Italia 80", url:"https://stream.laut.fm/italia80", desc:"Musica italiana anni '80"}
];

const giochi = [
  {name:"🎮 Giochi retrò", url:"https://www.retrogames.cc/arcade-games/space-invaders.html", desc:"Arcade anni ’80 – gioca online"}
];

/* ===== ELEMENTI ===== */
const categoriesEl = document.getElementById("categories");
const contentEl = document.getElementById("content");
const audio = document.getElementById("audio");
const now = document.getElementById("now");

/* ===== MENU ===== */
categories.forEach(cat=>{
  const div = document.createElement("div");
  div.className = "category";
  div.textContent = cat.label;
  div.onclick = () => openCategory(cat.id, div);
  categoriesEl.appendChild(div);
});

function resetCategories(){
  document.querySelectorAll(".category").forEach(c=>c.classList.remove("active"));
}

/* ===== SEZIONI ===== */
function openCategory(id, el){
  resetCategories(); el.classList.add("active");

  if(id==="musica"){
    contentEl.innerHTML = `<div class="grid">${musica.map(m=>`
      <div class="card" onclick="window.open('${m.url}','_blank')">
        <div class="title">${m.name}</div>
        <div class="desc">Apri su YouTube</div>
      </div>`).join("")}</div>`;
  }

  if(id==="radio"){
    contentEl.innerHTML = `<div class="grid">${radio.map(r=>`
      <div class="card" onclick="playRadio('${r.url}','${r.name}')">
        <div class="title">${r.name}</div>
        <div class="desc">${r.desc}</div>
      </div>`).join("")}</div>`;
  }

  if(id==="giochi"){
    contentEl.innerHTML = `<div class="grid">${giochi.map(g=>`
      <div class="card" onclick="window.open('${g.url}','_blank')">
        <div class="title">${g.name}</div>
        <div class="desc">${g.desc}</div>
      </div>`).join("")}</div>`;
  }

  // Mostra la chat
  document.getElementById("chat").style.display = "block";
}

/* ===== RADIO PLAYER ===== */
function playRadio(url, name){
  audio.src = url;
  audio.play();
  now.textContent = "In riproduzione: " + name;
}

/* ===== CHAT GUEST + ADMIN ===== */
// Ottieni nickname
let nickname = localStorage.getItem("nickname") || "";
if(!nickname){
  nickname = prompt("Scegli un nickname per la chat:", "Guest80");
  if(!nickname) nickname = "Guest80";
  localStorage.setItem("nickname", nickname);
}

// Imposta admin nickname
const adminNickname = "Admin80";
const isAdmin = nickname === adminNickname;

// Aggiungi messaggio nella chat
function addMessage(msg, id){
  const chatEl = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.textContent = `${msg.nickname}: ${msg.text}`;
  
  // Se sei admin, aggiungi pulsante cancella
  if(isAdmin){
    const del = document.createElement("span");
    del.textContent = " ✖";
    del.className = "message-admin";
    del.onclick = () => db.ref("messages/"+id).remove();
    div.appendChild(del);
  }

  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

// Invia messaggio
document.getElementById("chat-send").onclick = () => {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if(text.length===0) return;
  if(text.length>200) return alert("Messaggio troppo lungo!");
  
  db.ref("messages").push({
    nickname,
    text,
    timestamp: Date.now()
  });
  
  input.value = "";
};

// Lettura messaggi in tempo reale
db.ref("messages").on("child_added", snapshot => {
  addMessage(snapshot.val(), snapshot.key);
});

/* ===== SERVICE WORKER ===== */
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js")
    .then(()=>console.log("Service Worker registrato ✅"))
    .catch(err=>console.error("Errore SW:", err));
}
