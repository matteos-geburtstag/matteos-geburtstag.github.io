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

function passwortAendern() {
const alt = document.getElementById("altesPasswort").value;
const neu = document.getElementById("neuesPasswort").value;
const status = document.getElementById("passwortStatus");

if (alt !== getPasswort()) {
status.textContent = "Altes Passwort ist falsch.";
return;
}
if (!neu || neu.length < 3) {
status.textContent = "Neues Passwort muss mind. 3 Zeichen haben.";
return;
}

setPasswort(neu);
status.textContent = "Passwort geändert!";
status.style.color = "#28a745";
document.getElementById("altesPasswort").value = "";
document.getElementById("neuesPasswort").value = "";
setTimeout(() => {
status.textContent = "";
status.style.color = "#dc3545";
}, 2000);
}

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

function getCodes() {
try {
const d = localStorage.getItem("geburtstag_codes");
if (d) return JSON.parse(d);
} catch(e) {}
return {};
}

function setCodes(codes) {
localStorage.setItem("geburtstag_codes", JSON.stringify(codes));
}

function codesAnzeigen() {
const codes = getCodes();
const liste = document.getElementById("codeListe");
liste.innerHTML = "";

const keys = Object.keys(codes);
if (keys.length === 0) {
liste.innerHTML = '<p class="hinweis">Noch keine Codes angelegt.</p>';
return;
}

keys.forEach(key => {
const c = codes[key];
const div = document.createElement("div");
div.className = "code-eintrag";
div.innerHTML = `
<strong>${key}</strong>
<p>${c.titel || ""} - ${c.text ? c.text.substring(0, 50) : ""}</p>
<button class="edit" onclick="codeBearbeiten('${key}')">Bearbeiten</button>
<button class="delete" onclick="codeLoeschen('${key}')">Löschen</button>
`;
liste.appendChild(div);
});
}

let bearbeiteKey = null;

function codeSpeichern() {
const key = document.getElementById("codeKey").value.trim().toUpperCase();
const titel = document.getElementById("codeTitel").value.trim();
const text = document.getElementById("codeText").value.trim();

if (!key) {
alert("Bitte einen Code eingeben.");
return;
}

const codes = getCodes();

if (bearbeiteKey && bearbeiteKey !== key) {
delete codes[bearbeiteKey];
}

codes[key] = { titel: titel, text: text, bild: "" };
setCodes(codes);
codeFormZuruecksetzen();
codesAnzeigen();
}

function codeBearbeiten(key) {
const codes = getCodes();
const c = codes[key];
if (!c) return;

document.getElementById("codeKey").value = key;
document.getElementById("codeTitel").value = c.titel || "";
document.getElementById("codeText").value = c.text || "";
bearbeiteKey = key;
}

function codeLoeschen(key) {
if (!confirm(`Code "${key}" wirklich löschen?`)) return;
const codes = getCodes();
delete codes[key];
setCodes(codes);
codesAnzeigen();
}

function codeAbbrechen() {
codeFormZuruecksetzen();
}

function codeFormZuruecksetzen() {
document.getElementById("codeKey").value = "";
document.getElementById("codeTitel").value = "";
document.getElementById("codeText").value = "";
bearbeiteKey = null;
}

function getEinstellungen() {
try {
const e = localStorage.getItem("geburtstag_einstellungen");
if (e) return JSON.parse(e);
} catch(e) {}
return { beschreibung: "", bild: "" };
}

function setEinstellungen(e) {
localStorage.setItem("geburtstag_einstellungen", JSON.stringify(e));
}

function designLaden() {
const e = getEinstellungen();
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
const e = getEinstellungen();
e.bild = "";
setEinstellungen(e);
document.getElementById("bildVorschauContainer").innerHTML = "";
document.getElementById("fotoLoeschenBtn").style.display = "none";
document.getElementById("designStatus").textContent = "Foto gelöscht!";
setTimeout(() => {
document.getElementById("designStatus").textContent = "";
}, 2000);
}

function getRSVPs() {
try {
const d = localStorage.getItem("geburtstag_rsvp");
if (d) return JSON.parse(d);
} catch(e) {}
return {};
}

function rsvpAnzeigen() {
const codes = getCodes();
const rsvps = getRSVPs();
const liste = document.getElementById("rsvpListe");
liste.innerHTML = "";

const keys = Object.keys(rsvps);
if (keys.length === 0) {
liste.innerHTML = '<p class="hinweis">Noch keine Rückmeldungen.</p>';
return;
}

keys.forEach(key => {
const antwort = rsvps[key];
const c = codes[key];
const name = c ? c.titel || key : key;
const div = document.createElement("div");
div.className = "code-eintrag";
const icon = antwort === "ja" ? "✓" : "✗";
const farbe = antwort === "ja" ? "#28a745" : "#dc3545";
div.innerHTML = `
<strong style="color:${farbe}">${icon}</strong>
<p><strong>${name}</strong> (${key})</p>
<p style="color:${farbe};font-weight:600">${antwort === "ja" ? "Kommt" : "Kommt nicht"}</p>
`;
liste.appendChild(div);
});
}

function designSpeichern() {
const e = getEinstellungen();
e.beschreibung = document.getElementById("standardBeschreibung").value;

const img = document.querySelector("#bildVorschauContainer img");
if (img) {
e.bild = img.src;
}

setEinstellungen(e);
document.getElementById("designStatus").textContent = "Gespeichert!";
setTimeout(() => {
document.getElementById("designStatus").textContent = "";
}, 2000);
}
