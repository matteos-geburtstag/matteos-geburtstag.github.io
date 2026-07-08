function getPasswort() {
try {
const p = localStorage.getItem("geburtstag_passwort");
if (p) return p;
} catch(e) {}
return "1234";
}

function setPasswort(p) {
localStorage.setItem("geburtstag_passwort", p);
}

function login() {
const pw = document.getElementById("passwort").value;
document.getElementById("loginFehler").textContent = "";

if (pw === getPasswort()) {
document.getElementById("loginBox").style.display = "none";
document.getElementById("adminPanel").style.display = "block";
codesAnzeigen();
rsvpAnzeigen();
designLaden();
} else {
document.getElementById("loginFehler").textContent = "Falsches Passwort.";
}
}

document.getElementById("passwort").addEventListener("keydown", function(e) {
if (e.key === "Enter") login();
});

function logout() {
document.getElementById("loginBox").style.display = "block";
document.getElementById("adminPanel").style.display = "none";
document.getElementById("passwort").value = "";
document.getElementById("loginFehler").textContent = "";
}

function tabWechseln(tab) {
document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
document.querySelectorAll(".tab-inhalt").forEach(t => t.style.display = "none");

if (tab === "codes") {
document.querySelectorAll(".tab")[0].classList.add("active");
document.getElementById("tabCodes").style.display = "block";
codesAnzeigen();
} else if (tab === "rsvp") {
document.querySelectorAll(".tab")[1].classList.add("active");
document.getElementById("tabRsvp").style.display = "block";
rsvpAnzeigen();
} else {
document.querySelectorAll(".tab")[2].classList.add("active");
document.getElementById("tabDesign").style.display = "block";
}
}

let bearbeiteKey = null;

async function codesAnzeigen() {
const liste = document.getElementById("codeListe");
liste.innerHTML = '<p class="hinweis">Lade...</p>';
try {
const snap = await db.collection("codes").get();
liste.innerHTML = "";
if (snap.empty) {
liste.innerHTML = '<p class="hinweis">Noch keine Codes angelegt.</p>';
return;
}
snap.forEach(doc => {
const c = doc.data();
const div = document.createElement("div");
div.className = "code-eintrag";
div.innerHTML = `
<strong>${doc.id}</strong>
<p>${c.titel || ""} - ${c.text ? c.text.substring(0, 50) : ""}</p>
<button class="edit" onclick="codeBearbeiten('${doc.id}')">Bearbeiten</button>
<button class="delete" onclick="codeLoeschen('${doc.id}')">Löschen</button>
`;
liste.appendChild(div);
});
} catch(e) {
liste.innerHTML = '<p class="hinweis">Fehler beim Laden. Firestore aktiviert?</p>';
}
}

async function codeSpeichern() {
const key = document.getElementById("codeKey").value.trim().toUpperCase();
const titel = document.getElementById("codeTitel").value.trim();
const text = document.getElementById("codeText").value.trim();

if (!key) { alert("Bitte einen Code eingeben."); return; }

try {
if (bearbeiteKey && bearbeiteKey !== key) {
await db.collection("codes").doc(bearbeiteKey).delete();
}
await db.collection("codes").doc(key).set({ titel: titel, text: text, bild: "" });
codeFormZuruecksetzen();
codesAnzeigen();
} catch(e) {
alert("Fehler beim Speichern: " + e.message);
}
}

function codeBearbeiten(key) {
const input = document.getElementById("codeKey");
input.value = key;
bearbeiteKey = key;
db.collection("codes").doc(key).get().then(doc => {
if (doc.exists) {
document.getElementById("codeTitel").value = doc.data().titel || "";
document.getElementById("codeText").value = doc.data().text || "";
}
});
}

async function codeLoeschen(key) {
if (!confirm(`Code "${key}" wirklich löschen?`)) return;
try {
await db.collection("codes").doc(key).delete();
codesAnzeigen();
} catch(e) {}
}

function codeAbbrechen() { codeFormZuruecksetzen(); }

function codeFormZuruecksetzen() {
document.getElementById("codeKey").value = "";
document.getElementById("codeTitel").value = "";
document.getElementById("codeText").value = "";
bearbeiteKey = null;
}

async function rsvpAnzeigen() {
const liste = document.getElementById("rsvpListe");
liste.innerHTML = '<p class="hinweis">Lade...</p>';
try {
const codes = {};
const csnap = await db.collection("codes").get();
csnap.forEach(doc => { codes[doc.id] = doc.data(); });

const rsnap = await db.collection("rsvp").get();
liste.innerHTML = "";
if (rsnap.empty) {
liste.innerHTML = '<p class="hinweis">Noch keine Rückmeldungen.</p>';
return;
}
rsnap.forEach(doc => {
const antwort = doc.data().antwort;
const c = codes[doc.id];
const name = c ? c.titel || doc.id : doc.id;
const div = document.createElement("div");
div.className = "code-eintrag";
const icon = antwort === "ja" ? "✓" : "✗";
const farbe = antwort === "ja" ? "#28a745" : "#dc3545";
div.innerHTML = `
<strong style="color:${farbe}">${icon}</strong>
<p><strong>${name}</strong> (${doc.id})</p>
<p style="color:${farbe};font-weight:600">${antwort === "ja" ? "Kommt" : "Kommt nicht"}</p>
`;
liste.appendChild(div);
});
} catch(e) {
liste.innerHTML = '<p class="hinweis">Fehler beim Laden.</p>';
}
}

function passwortAendern() {
const alt = document.getElementById("altesPasswort").value;
const neu = document.getElementById("neuesPasswort").value;
const status = document.getElementById("passwortStatus");

if (alt !== getPasswort()) { status.textContent = "Altes Passwort ist falsch."; return; }
if (!neu || neu.length < 3) { status.textContent = "Neues Passwort muss mind. 3 Zeichen haben."; return; }

setPasswort(neu);
status.textContent = "Passwort geändert!";
status.style.color = "#28a745";
document.getElementById("altesPasswort").value = "";
document.getElementById("neuesPasswort").value = "";
setTimeout(() => { status.textContent = ""; status.style.color = "#dc3545"; }, 2000);
}

function designLaden() {
db.collection("settings").doc("main").get().then(doc => {
if (doc.exists) {
const e = doc.data();
document.getElementById("standardBeschreibung").value = e.beschreibung || "";
const container = document.getElementById("bildVorschauContainer");
container.innerHTML = "";
if (e.bild) {
const img = document.createElement("img");
img.src = e.bild;
img.className = "vorschau-bild";
container.appendChild(img);
document.getElementById("fotoLoeschenBtn").style.display = "block";
} else {
document.getElementById("fotoLoeschenBtn").style.display = "none";
}
}
});
}

document.getElementById("fotoUpload").addEventListener("change", function(e) {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = function(event) {
const container = document.getElementById("bildVorschauContainer");
container.innerHTML = "";
const img = document.createElement("img");
img.src = event.target.result;
img.className = "vorschau-bild";
container.appendChild(img);
document.getElementById("fotoLoeschenBtn").style.display = "block";
};
reader.readAsDataURL(file);
});

function fotoLoeschen() {
db.collection("settings").doc("main").update({ bild: "" }).then(() => {
document.getElementById("bildVorschauContainer").innerHTML = "";
document.getElementById("fotoLoeschenBtn").style.display = "none";
document.getElementById("designStatus").textContent = "Foto gelöscht!";
setTimeout(() => { document.getElementById("designStatus").textContent = ""; }, 2000);
}).catch(() => {
document.getElementById("designStatus").textContent = "Fehler.";
});
}

function designSpeichern() {
const beschreibung = document.getElementById("standardBeschreibung").value;
const img = document.querySelector("#bildVorschauContainer img");
const bild = img ? img.src : "";
db.collection("settings").doc("main").set({ beschreibung, bild }).then(() => {
document.getElementById("designStatus").textContent = "Gespeichert!";
setTimeout(() => { document.getElementById("designStatus").textContent = ""; }, 2000);
}).catch(() => {
document.getElementById("designStatus").textContent = "Fehler.";
});
}
