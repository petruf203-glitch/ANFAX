// ANFAX — set the real WhatsApp number here later, in international format, without +, spaces or dashes.
const ANFAX_WHATSAPP_NUMBER = "407XXXXXXXX";

const form = document.getElementById("requestForm");
const status = document.getElementById("formStatus");

function showFiles(inputId, outputId) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(outputId);
  input.addEventListener("change", () => {
    const files = Array.from(input.files || []);
    output.textContent = files.length ? files.map(file => `${file.name} (${Math.round(file.size / 1024)} KB)`).join(" • ") : "Nicio poză selectată încă.";
  });
}
showFiles("carPhotos", "carPhotoList");
showFiles("inspirationPhotos", "inspirationPhotoList");

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a => a.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open")));

document.getElementById("whatsappButton").addEventListener("click", (event) => {
  if (ANFAX_WHATSAPP_NUMBER.includes("X")) {
    event.preventDefault();
    status.textContent = "Butonul WhatsApp este pregătit pentru test. Când îmi dai numărul, îl conectăm.";
    document.getElementById("cerere").scrollIntoView({behavior:"smooth"});
  } else {
    document.getElementById("whatsappButton").href = `https://wa.me/${ANFAX_WHATSAPP_NUMBER}?text=${encodeURIComponent("Salut! Aș vrea să discut despre un proiect de personalizare auto.")}`;
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    "Salut! Am o solicitare de personalizare ANFAX.",
    `Nume: ${data.get("name")}`,
    `Telefon: ${data.get("phone")}`,
    `Mașină: ${data.get("make")} ${data.get("model")}`,
    `An: ${data.get("year")}`,
    `Motorizare: ${data.get("engine")}`,
    `Caroserie: ${data.get("body")}`,
    `Proiect: ${data.get("project")}`,
    `Descriere: ${data.get("description")}`,
    `Buget estimativ: ${data.get("budget") || "De discutat"}`,
    "",
    "Am selectat poze în formular; le voi atașa separat în WhatsApp."
  ].join("\n");

  if (ANFAX_WHATSAPP_NUMBER.includes("X")) {
    status.textContent = "Test reușit: formularul este valid și detaliile sunt pregătite. Pentru trimiterea efectivă, conectăm numărul de WhatsApp. Pozele vor necesita atașare separată sau un serviciu de upload.";
    return;
  }
  window.open(`https://wa.me/${ANFAX_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  status.textContent = "Am pregătit mesajul pentru WhatsApp. Verifică datele și atașează pozele selectate înainte de trimitere.";
});


// ANFAX interactive vehicle navigation: make -> model -> production years -> products.
// Sample catalog is intentionally small and editable; exact fitment must be confirmed before order.
const vehicleCatalog = {
  "BMW": {
    "Seria 1": ["2004–2011 (E8x)", "2011–2019 (F2x)", "2019–prezent (F4x)"],
    "Seria 2": ["2014–2021 (F22/F23)", "2021–prezent (G42)"],
    "Seria 3": ["2005–2013 (E9x)", "2012–2019 (F3x)", "2018–prezent (G2x)"],
    "Seria 4": ["2013–2020 (F3x)", "2020–prezent (G2x)"],
    "Seria 5": ["2003–2010 (E60/E61)", "2010–2017 (F10/F11)", "2017–2023 (G30/G31)", "2023–prezent (G60/G61)"],
    "X1": ["2009–2015 (E84)", "2015–2022 (F48)", "2022–prezent (U11)"],
    "X3": ["2003–2010 (E83)", "2010–2017 (F25)", "2017–2024 (G01)", "2024–prezent (G45)"],
    "X5": ["2000–2006 (E53)", "2006–2013 (E70)", "2013–2018 (F15)", "2018–prezent (G05)"]
  },
  "Volkswagen": {
    "Golf": ["2003–2008 (Golf 5)", "2008–2012 (Golf 6)", "2012–2020 (Golf 7)", "2019–prezent (Golf 8)"],
    "Passat": ["2005–2010 (B6)", "2010–2014 (B7)", "2014–2023 (B8)", "2023–prezent (B9)"],
    "Polo": ["2002–2009 (9N)", "2009–2017 (6R/6C)", "2017–prezent (AW)"],
    "Tiguan": ["2007–2016 (I)", "2016–2024 (II)", "2024–prezent (III)"],
    "Touareg": ["2002–2010 (I)", "2010–2018 (II)", "2018–prezent (III)"]
  },
  "Škoda": {
    "Octavia": ["2004–2013 (II)", "2012–2020 (III)", "2020–prezent (IV)"],
    "Superb": ["2008–2015 (II)", "2015–2024 (III)", "2024–prezent (IV)"],
    "Fabia": ["2000–2007 (I)", "2007–2014 (II)", "2014–2021 (III)", "2021–prezent (IV)"],
    "Kodiaq": ["2016–2024 (I)", "2024–prezent (II)"]
  },
  "Mercedes-Benz": {
    "Clasa A": ["2004–2012 (W169)", "2012–2018 (W176)", "2018–prezent (W177)"],
    "Clasa C": ["2000–2007 (W203)", "2007–2014 (W204)", "2014–2021 (W205)", "2021–prezent (W206)"],
    "Clasa E": ["2002–2009 (W211)", "2009–2016 (W212)", "2016–2023 (W213)", "2023–prezent (W214)"],
    "GLC": ["2015–2022 (X253)", "2022–prezent (X254)"],
    "GLE": ["2015–2019 (W166)", "2019–prezent (W167)"]
  },
  "Jeep": {
    "Grand Cherokee": ["2005–2010 (WK)", "2010–2021 (WK2)", "2021–prezent (WL)"],
    "Wrangler": ["2007–2018 (JK)", "2018–prezent (JL)"],
    "Compass": ["2006–2016 (I)", "2017–prezent (II)"]
  },
  "Toyota": {
    "Corolla": ["2000–2006 (E120)", "2006–2013 (E150)", "2013–2018 (E170)", "2018–prezent (E210)"],
    "RAV4": ["2000–2005 (II)", "2005–2012 (III)", "2012–2018 (IV)", "2018–prezent (V)"],
    "Land Cruiser": ["2002–2009 (J120)", "2009–2021 (J150)", "2021–prezent (J300)"],
    "Yaris": ["2005–2011 (II)", "2011–2020 (III)", "2020–prezent (IV)"]
  },
  "Land Rover": {
    "Range Rover Sport": ["2005–2013 (L320)", "2013–2022 (L494)", "2022–prezent (L461)"],
    "Range Rover": ["2002–2012 (L322)", "2012–2021 (L405)", "2022–prezent (L460)"],
    "Discovery": ["2004–2017 (Discovery 3/4)", "2017–prezent (Discovery 5)"],
    "Defender": ["1983–2016 (Classic)", "2020–prezent (L663)"]
  },
  "Audi": {
    "A3": ["2003–2012 (8P)", "2012–2020 (8V)", "2020–prezent (8Y)"],
    "A4": ["2000–2008 (B6/B7)", "2007–2015 (B8)", "2015–2024 (B9)", "2024–prezent (B10)"],
    "A6": ["2004–2011 (C6)", "2011–2018 (C7)", "2018–prezent (C8)"],
    "Q5": ["2008–2017 (I)", "2017–prezent (II)"]
  }
};

const fitmentView = document.getElementById("fitmentView");
const fitmentStep = document.getElementById("fitmentStep");
const fitmentCrumbs = document.getElementById("fitmentCrumbs");
const fitmentState = { make: null, model: null, years: null };
const productSamples = [
  {name:"Volan custom", description:"Configurații în funcție de model, echipare și airbag.", mark:"ANFAX / 01"},
  {name:"Jante și setup roți", description:"Opțiuni de design și dimensiuni, în funcție de compatibilitate.", mark:"ANFAX / 02"},
  {name:"Interior & accesorii", description:"Detalii și accesorii pentru un interior personalizat.", mark:"ANFAX / 03"},
  {name:"Exterior & tuning", description:"Elemente de styling și upgrade-uri, în funcție de model.", mark:"ANFAX / 04"}
];
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function renderCrumbs() {
  const bits = [];
  bits.push(fitmentState.make ? `<button type="button" data-go="make">Mărci</button>` : `<span class="crumb-current">Alege marca</span>`);
  if (fitmentState.make) bits.push(`<span>›</span>`, fitmentState.model ? `<button type="button" data-go="model">${escapeHTML(fitmentState.make)}</button>` : `<span class="crumb-current">${escapeHTML(fitmentState.make)}</span>`);
  if (fitmentState.model) bits.push(`<span>›</span>`, fitmentState.years ? `<button type="button" data-go="years">${escapeHTML(fitmentState.model)}</button>` : `<span class="crumb-current">${escapeHTML(fitmentState.model)}</span>`);
  if (fitmentState.years) bits.push(`<span>›</span>`, `<span class="crumb-current">${escapeHTML(fitmentState.years)}</span>`);
  fitmentCrumbs.innerHTML = bits.join(" ");
  fitmentCrumbs.querySelectorAll("[data-go]").forEach(btn => btn.addEventListener("click", () => {
    const level = btn.dataset.go;
    if (level === "make") { fitmentState.make = fitmentState.model = fitmentState.years = null; renderMakes(); }
    if (level === "model") { fitmentState.model = fitmentState.years = null; renderModels(); }
    if (level === "years") { fitmentState.years = null; renderYears(); }
  }));
}
function renderMakes() {
  fitmentState.make = fitmentState.model = fitmentState.years = null;
  fitmentStep.textContent = "PASUL 01 / MARCĂ";
  renderCrumbs();
  const brandMarks = {"BMW":"BMW","Volkswagen":"VW","Škoda":"ŠK","Mercedes-Benz":"MB","Jeep":"JEEP","Toyota":"TOYOTA","Land Rover":"LAND ROVER","Audi":"AUDI"};
  fitmentView.innerHTML = `<div class="fitment-progress"><span class="active"></span><span></span><span></span><span></span></div><div class="fitment-view-head"><div><h3>Alege marca mașinii</h3><p>Începe cu marca. Te ghidăm apoi către model, generație și produsele disponibile.</p></div><span class="fitment-step">8 MĂRCI</span></div><div class="fitment-grid">${Object.keys(vehicleCatalog).map(make=>`<button class="fitment-option make-option" type="button" data-make="${escapeHTML(make)}"><span class="make-option-top"><span class="make-logo">${escapeHTML(brandMarks[make] || make.slice(0,3).toUpperCase())}</span><span class="make-arrow">↗</span></span><strong>${escapeHTML(make)}</strong><small>EXPLOREAZĂ MODELELE</small></button>`).join("")}</div>`;
  fitmentView.querySelectorAll("[data-make]").forEach(btn => btn.addEventListener("click", () => { fitmentState.make = btn.dataset.make; renderModels(); }));
}
function renderModels() {
  fitmentState.model = fitmentState.years = null;
  fitmentStep.textContent = "PASUL 02 / MODEL";
  renderCrumbs();
  const models = Object.keys(vehicleCatalog[fitmentState.make] || {});
  const codes = {"Seria 1":"01","Seria 2":"02","Seria 3":"03","Seria 4":"04","Seria 5":"05","X1":"X1","X3":"X3","X5":"X5","Golf":"GOLF","Passat":"PASSAT","Polo":"POLO","Tiguan":"TIGUAN","Touareg":"TOUAREG","Octavia":"OCT","Superb":"SUP","Fabia":"FAB","Kodiaq":"KOD","Clasa A":"A","Clasa C":"C","Clasa E":"E","GLC":"GLC","GLE":"GLE","Grand Cherokee":"GC","Wrangler":"WR","Compass":"COMP","Corolla":"COR","RAV4":"RAV4","Land Cruiser":"LC","Yaris":"YAR","Range Rover Sport":"RRS","Range Rover":"RR","Discovery":"DISC","Defender":"DEF","A3":"A3","A4":"A4","A6":"A6","Q5":"Q5"};
  fitmentView.innerHTML = `<div class="fitment-progress"><span class="active"></span><span class="active"></span><span></span><span></span></div><div class="fitment-view-head"><div><h3>${escapeHTML(fitmentState.make)} <span style="color:#ed252b">/</span> Alege modelul</h3><p>Selectează seria sau modelul exact al mașinii tale.</p></div><button type="button" class="fitment-back" id="fitmentBack">← ÎNAPOI LA MĂRCI</button></div><div class="fitment-grid">${models.map(model=>`<button class="fitment-option model-option" type="button" data-model="${escapeHTML(model)}"><span class="model-code">${escapeHTML(codes[model] || model.slice(0,4).toUpperCase())}</span><strong>${escapeHTML(model)}</strong><small>VEZI GENERAȚII ↗</small></button>`).join("")}</div>`;
  document.getElementById("fitmentBack").addEventListener("click", renderMakes);
  fitmentView.querySelectorAll("[data-model]").forEach(btn => btn.addEventListener("click", () => { fitmentState.model = btn.dataset.model; renderYears(); }));
}
function renderYears() {
  fitmentState.years = null;
  fitmentStep.textContent = "PASUL 03 / AN";
  renderCrumbs();
  const years = vehicleCatalog[fitmentState.make][fitmentState.model] || [];
  fitmentView.innerHTML = `<div class="fitment-progress"><span class="active"></span><span class="active"></span><span class="active"></span><span></span></div><div class="fitment-view-head"><div><h3>${escapeHTML(fitmentState.model)} / Alege generația</h3><p>Selectează intervalul de fabricație pentru a vedea categoriile disponibile.</p></div><button type="button" class="fitment-back" id="fitmentBack">← ÎNAPOI LA MODELE</button></div><div class="fitment-grid">${years.map(year=>`<button class="fitment-option" type="button" data-years="${escapeHTML(year)}"><strong>${escapeHTML(year)}</strong><small>VEZI PRODUSELE ↗</small></button>`).join("")}</div>`;
  document.getElementById("fitmentBack").addEventListener("click", renderModels);
  fitmentView.querySelectorAll("[data-years]").forEach(btn => btn.addEventListener("click", () => { fitmentState.years = btn.dataset.years; renderProducts(); }));
}
function renderProducts() {
  fitmentStep.textContent = "PASUL 04 / PRODUSE";
  renderCrumbs();
  fitmentView.innerHTML = `<div class="fitment-progress"><span class="active"></span><span class="active"></span><span class="active"></span><span class="active"></span></div><div class="fitment-view-head"><div><h3>Produse pentru ${escapeHTML(fitmentState.make)} ${escapeHTML(fitmentState.model)}</h3><p>${escapeHTML(fitmentState.years)} · Produsele afișate sunt categorii demonstrative până la adăugarea catalogului real.</p></div><button type="button" class="fitment-back" id="fitmentBack">← SCHIMBĂ ANUL</button></div><div class="products-grid">${productSamples.map((p,i)=>`<article class="fitment-product"><div class="product-placeholder">${p.mark}</div><div class="fitment-product-body"><h4>${p.name}</h4><p>${p.description}</p><button type="button" class="btn btn-red" data-request-product="${escapeHTML(p.name)}">TRIMITE CERERE <span>↗</span></button></div></article>`).join("")}</div>`;
  document.getElementById("fitmentBack").addEventListener("click", renderYears);
  fitmentView.querySelectorAll("[data-request-product]").forEach(btn => btn.addEventListener("click", () => openProductModal(btn.dataset.requestProduct)));
}
const requestModal = document.getElementById("productRequestModal");
let selectedProduct = "";
function openProductModal(product) {
  selectedProduct = product;
  document.getElementById("modalProductLabel").textContent = `${product} · ${fitmentState.make} ${fitmentState.model} · ${fitmentState.years}`;
  document.getElementById("productRequestStatus").textContent = "";
  requestModal.classList.add("open");
  requestModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeProductModal() {
  requestModal.classList.remove("open");
  requestModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
requestModal.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeProductModal));
document.addEventListener("keydown", event => { if (event.key === "Escape" && requestModal.classList.contains("open")) closeProductModal(); });
document.getElementById("productRequestForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = `ANFAX — Cerere produs\nProdus: ${selectedProduct}\nMașină: ${fitmentState.make} ${fitmentState.model}\nAni: ${fitmentState.years}\nContact preferat: ${data.get("contactType")}\nContact: ${data.get("contact")}\nDetalii mașină: ${data.get("carDetails")}\nDetalii suplimentare: ${data.get("notes") || "—"}`;
  const status = document.getElementById("productRequestStatus");
  if (typeof ANFAX_WHATSAPP_NUMBER !== "undefined" && !ANFAX_WHATSAPP_NUMBER.includes("X")) {
    window.open(`https://wa.me/${ANFAX_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    status.textContent = "Mesajul a fost pregătit pentru WhatsApp. Verifică-l și trimite-l din aplicație.";
  } else {
    status.textContent = "Formular testat: cererea a fost validată, dar nu a fost trimisă. La final conectăm emailul sau WhatsApp-ul pentru transmiterea reală.";
  }
});
renderMakes();
