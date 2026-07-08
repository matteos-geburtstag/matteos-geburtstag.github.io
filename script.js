const STANDARD_CODES = {
"GEBURTSTAG1": { titel: "Willkommen!", text: "Wir feiern meinen Geburtstag im Buddies Bowling. Komm vorbei und hab Spaß!", bild: "" },
"GEBURTSTAG2": { titel: "Überraschung!", text: "Es gibt eine besondere Überraschung für alle Gäste. Sei gespannt!", bild: "" },
"GAST2025": { titel: "Bestätigt", text: "Dein Platz ist reserviert. Wir freuen uns auf dich!", bild: "" }
};

function getCodes() {
try {
const gespeichert = localStorage.getItem("geburtstag_codes");
if (gespeichert) {
return JSON.parse(gespeichert);
}
} catch(e) {}
return STANDARD_CODES;
}

function getEinstellungen() {
try {
const e = localStorage.getItem("geburtstag_einstellungen");
if (e) return JSON.parse(e);
} catch(e) {}
return { beschreibung: "", bild: "" };
}

document.getElementById("codeInput").addEventListener("keydown", function(e) {
if (e.key === "Enter") {
codeSuchen();
}
});

function codeSuchen() {
const code = document.getElementById("codeInput").value.trim().toUpperCase();
const fehler = document.getElementById("fehler");
fehler.textContent = "";

if (!code) {
fehler.textContent = "Bitte gib einen Code ein.";
return;
}

const codes = getCodes();
const daten = codes[code];

if (daten) {
document.getElementById("startseite").style.display = "none";
document.getElementById("inhalt").style.display = "block";
document.getElementById("titel").textContent = daten.titel || "Willkommen!";
document.getElementById("beschreibung").textContent = daten.text || "";

const bildUrl = daten.bild || getEinstellungen().bild;
const imgEl = document.getElementById("hauptBild");
if (bildUrl) {
imgEl.src = bildUrl;
imgEl.style.display = "block";
} else {
imgEl.style.display = "none";
}
} else {
fehler.textContent = "Code nicht gefunden. Überprüfe deine Eingabe.";
}
}

let aktuellerCode = null;

function codeSuchen() {
const code = document.getElementById("codeInput").value.trim().toUpperCase();
const fehler = document.getElementById("fehler");
fehler.textContent = "";

if (!code) {
fehler.textContent = "Bitte gib einen Code ein.";
return;
}

const codes = getCodes();
const daten = codes[code];

if (daten) {
aktuellerCode = code;
document.getElementById("startseite").style.display = "none";
document.getElementById("inhalt").style.display = "block";
document.getElementById("titel").textContent = daten.titel || "Willkommen!";
document.getElementById("beschreibung").textContent = daten.text || "";

const bildUrl = daten.bild || getEinstellungen().bild;
const imgEl = document.getElementById("hauptBild");
if (bildUrl) {
imgEl.src = bildUrl;
imgEl.style.display = "block";
} else {
imgEl.style.display = "none";
}

document.getElementById("rsvpButtons").style.display = "flex";
document.getElementById("rsvpButtons").style.justifyContent = "center";
rsvpStatusAnzeigen(code);
} else {
fehler.textContent = "Code nicht gefunden. Überprüfe deine Eingabe.";
}
}

function rsvp(antwort) {
if (!aktuellerCode) return;
const eintraege = getRSVPs();
eintraege[aktuellerCode] = antwort;
localStorage.setItem("geburtstag_rsvp", JSON.stringify(eintraege));
rsvpStatusAnzeigen(aktuellerCode);
}

function getRSVPs() {
try {
const d = localStorage.getItem("geburtstag_rsvp");
if (d) return JSON.parse(d);
} catch(e) {}
return {};
}

function rsvpStatusAnzeigen(code) {
const eintraege = getRSVPs();
const status = document.getElementById("rsvpStatus");
if (eintraege[code] === "ja") {
status.textContent = "✓ Du hast zugesagt. Wir freuen uns!";
status.className = "rsvp-status zugesagt";
} else if (eintraege[code] === "nein") {
status.textContent = "✗ Du hast abgesagt. Schade!";
status.className = "rsvp-status abgesagt";
} else {
status.textContent = "";
status.className = "rsvp-status";
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
