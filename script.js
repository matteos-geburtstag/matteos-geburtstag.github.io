let codesCache = {};
let einstellungenCache = { beschreibung: "", bild: "" };
let aktuellerCode = null;

async function ladeDaten() {
try {
const snap = await db.collection("codes").get();
codesCache = {};
snap.forEach(doc => { codesCache[doc.id] = doc.data(); });
const setting = await db.collection("settings").doc("main").get();
if (setting.exists) einstellungenCache = setting.data();
} catch(e) {
codesCache = {};
einstellungenCache = { beschreibung: "", bild: "" };
}
}

document.getElementById("codeInput").addEventListener("keydown", function(e) {
if (e.key === "Enter") codeSuchen();
});

async function codeSuchen() {
const code = document.getElementById("codeInput").value.trim().toUpperCase();
const fehler = document.getElementById("fehler");
fehler.textContent = "";

if (!code) { fehler.textContent = "Bitte gib einen Code ein."; return; }

await ladeDaten();
const daten = codesCache[code];

if (daten) {
aktuellerCode = code;
document.getElementById("startseite").style.display = "none";
document.getElementById("inhalt").style.display = "block";
document.getElementById("titel").textContent = daten.titel || "Willkommen!";
document.getElementById("beschreibung").textContent = daten.text || "";

const bildUrl = daten.bild || einstellungenCache.bild;
const imgEl = document.getElementById("hauptBild");
if (bildUrl) { imgEl.src = bildUrl; imgEl.style.display = "block"; }
else { imgEl.style.display = "none"; }

document.getElementById("rsvpButtons").style.display = "flex";
document.getElementById("rsvpButtons").style.justifyContent = "center";
rsvpStatusAnzeigen(code);
} else {
fehler.textContent = "Code nicht gefunden. Überprüfe deine Eingabe.";
}
}

async function rsvp(antwort) {
if (!aktuellerCode) return;
try {
await db.collection("rsvp").doc(aktuellerCode).set({ antwort: antwort });
rsvpStatusAnzeigen(aktuellerCode);
} catch(e) {}
}

async function rsvpStatusAnzeigen(code) {
const status = document.getElementById("rsvpStatus");
try {
const doc = await db.collection("rsvp").doc(code).get();
if (doc.exists) {
const a = doc.data().antwort;
if (a === "ja") { status.textContent = "✓ Du hast zugesagt. Wir freuen uns!"; status.className = "rsvp-status zugesagt"; }
else { status.textContent = "✗ Du hast abgesagt. Schade!"; status.className = "rsvp-status abgesagt"; }
} else {
status.textContent = ""; status.className = "rsvp-status";
}
} catch(e) {
status.textContent = ""; status.className = "rsvp-status";
}
}

function zurueck() {
aktuellerCode = null;
document.getElementById("rsvpButtons").style.display = "none";
document.getElementById("inhalt").style.display = "none";
document.getElementById("startseite").style.display = "block";
document.getElementById("codeInput").value = "";
document.getElementById("fehler").textContent = "";
document.getElementById("codeInput").focus();
}
