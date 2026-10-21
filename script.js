// ANFAX — set the real WhatsApp number here later, in international format, without +, spaces or dashes.
const ANFAX_WHATSAPP_NUMBER = "40712452968";
// Supabase public project settings. Publishable key is intended for frontend use.
const ANFAX_SUPABASE_URL = "https://lxybdeqvxxdvmuacvrcv.supabase.co";
const ANFAX_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_3LEUtYByVYGWzkis3Ssnfg_NEgmeKeS";
const ANFAX_SUBMIT_ENDPOINT = `${ANFAX_SUPABASE_URL}/functions/v1/rapid-responder`;

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

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.innerHTML : "";
  const data = new FormData(form);

  // Map the visible form fields to the backend's expected column names.
  const payload = new FormData();
  payload.append("request_type", "customization");
  payload.append("full_name", String(data.get("name") || ""));
  payload.append("phone", String(data.get("phone") || ""));
  payload.append("vehicle_make", String(data.get("make") || ""));
  payload.append("vehicle_model", String(data.get("model") || ""));
  payload.append("vehicle_year", String(data.get("year") || ""));
  payload.append("engine", String(data.get("engine") || ""));
  payload.append("body_type", String(data.get("body") || ""));
  payload.append("requested_products", String(data.get("project") || ""));
  payload.append("description", String(data.get("description") || ""));
  payload.append("budget", String(data.get("budget") || "Prefer să discutăm"));
  payload.append("preferred_contact", "WhatsApp");
  payload.append("email", "");
  for (const fieldName of ["carPhotos", "inspirationPhotos"]) {
    for (const file of Array.from(form.querySelector(`[name="${fieldName}"]`)?.files || [])) {
      payload.append(fieldName, file, file.name);
    }
  }

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "SE TRIMITE...";
  }
  status.textContent = "Se trimite solicitarea și fotografiile în siguranță. Te rugăm să aștepți...";

  try {
    const response = await fetch(ANFAX_SUBMIT_ENDPOINT, {
      method: "POST",
      headers: {
        "apikey": ANFAX_SUPABASE_PUBLISHABLE_KEY,
        "Authorization": `Bearer ${ANFAX_SUPABASE_PUBLISHABLE_KEY}`
      },
      body: payload
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== true) {
      throw new Error(result.error || `Trimiterea a eșuat (HTTP ${response.status}).`);
    }
    status.textContent = `Solicitarea a fost înregistrată cu succes! Număr cerere: ${result.request_id}. Poze încărcate: ${result.photos_uploaded ?? 0}.`;
    form.reset();
    document.getElementById("carPhotoList").textContent = "Nicio poză selectată încă.";
    document.getElementById("inspirationPhotoList").textContent = "Nicio poză selectată încă.";
  } catch (error) {
    console.error("ANFAX submission failed", error);
    status.textContent = "Nu am reușit să trimitem solicitarea momentan. Te rugăm să încerci din nou peste câteva minute sau să ne contactezi direct pe WhatsApp.";
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }
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
    "Golf 5": ["2003–2008 (Mk5 / 1K)"],
    "Golf 6": ["2008–2012 (Mk6 / 5K)"],
    "Golf 7": ["2012–2020 (Mk7 / 5G)"],
    "Golf 8": ["2019–prezent (Mk8 / 5H)"],
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
  ,"Porsche": {
    "911": ["1997–2004 (996)", "2004–2012 (997)", "2012–2019 (991)", "2019–prezent (992)"],
    "Cayenne": ["2002–2010 (I)", "2010–2017 (II)", "2017–prezent (III)"],
    "Macan": ["2014–2024 (I)", "2024–prezent (II)"], "Panamera": ["2009–2016 (I)", "2016–prezent (II)"]
  },
  "Ford": {"Focus": ["2004–2011 (II)", "2011–2018 (III)", "2018–prezent (IV)"], "Fiesta": ["2002–2008 (V)", "2008–2017 (VI/VII)", "2017–2023 (VII)"], "Mustang": ["2005–2014 (S197)", "2015–2023 (S550)", "2024–prezent (S650)"], "Kuga": ["2008–2012 (I)", "2012–2019 (II)", "2019–prezent (III)"]},
  "Renault": {"Clio": ["2005–2012 (III)", "2012–2019 (IV)", "2019–prezent (V)"], "Megane": ["2002–2008 (II)", "2008–2016 (III)", "2016–prezent (IV)"], "Captur": ["2013–2019 (I)", "2019–prezent (II)"], "Austral": ["2022–prezent"]},
  "Dacia": {"Logan": ["2004–2012 (I)", "2012–2020 (II)", "2020–prezent (III)"], "Duster": ["2010–2017 (I)", "2017–2024 (II)", "2024–prezent (III)"], "Sandero": ["2008–2012 (I)", "2012–2020 (II)", "2020–prezent (III)"], "Jogger": ["2021–prezent"]},
  "Volvo": {"S60": ["2000–2009 (I)", "2010–2018 (II)", "2018–prezent (III)"], "V60": ["2010–2018 (I)", "2018–prezent (II)"], "XC60": ["2008–2017 (I)", "2017–prezent (II)"], "XC90": ["2002–2014 (I)", "2015–prezent (II)"]},
  "Lexus": {"IS": ["2005–2013 (II)", "2013–prezent (III)"], "ES": ["2006–2012 (V)", "2012–2018 (VI)", "2018–prezent (VII)"], "RX": ["2003–2009 (II)", "2009–2015 (III)", "2015–2022 (IV)", "2022–prezent (V)"], "NX": ["2014–2021 (I)", "2021–prezent (II)"]},
  "Tesla": {"Model 3": ["2017–2023 (Pre-facelift)", "2023–prezent (Highland)"], "Model Y": ["2020–2025", "2025–prezent"], "Model S": ["2012–2021", "2021–prezent"], "Model X": ["2015–2021", "2021–prezent"]},
  "Peugeot": {"208": ["2012–2019 (I)", "2019–prezent (II)"], "308": ["2007–2013 (I)", "2013–2021 (II)", "2021–prezent (III)"], "3008": ["2009–2016 (I)", "2016–2023 (II)", "2023–prezent (III)"], "508": ["2010–2018 (I)", "2018–prezent (II)"]},
  "Opel": {"Corsa": ["2006–2014 (D/E)", "2014–2019 (E)", "2019–prezent (F)"], "Astra": ["2004–2010 (H)", "2009–2015 (J)", "2015–2021 (K)", "2021–prezent (L)"], "Insignia": ["2008–2017 (I)", "2017–2022 (II)"], "Grandland": ["2017–2024 (I)", "2024–prezent (II)"]},
  "Hyundai": {"i30": ["2007–2012 (I)", "2012–2017 (II)", "2017–prezent (III)"], "Tucson": ["2004–2010 (I)", "2010–2015 (II)", "2015–2020 (III)", "2020–prezent (IV)"], "Kona": ["2017–2023 (I)", "2023–prezent (II)"], "Santa Fe": ["2006–2012 (II)", "2012–2018 (III)", "2018–2024 (IV)", "2024–prezent (V)"]},
  "Kia": {"Ceed": ["2006–2012 (I)", "2012–2018 (II)", "2018–prezent (III)"], "Sportage": ["2004–2010 (II)", "2010–2015 (III)", "2015–2021 (IV)", "2021–prezent (V)"], "Sorento": ["2002–2009 (I)", "2009–2014 (II)", "2014–2020 (III)", "2020–prezent (IV)"], "EV6": ["2021–prezent"]},
  "Honda": {"Civic": ["2001–2005 (VII)", "2006–2011 (VIII)", "2012–2017 (IX)", "2017–2021 (X)", "2021–prezent (XI)"], "Accord": ["2003–2008 (VII)", "2008–2015 (VIII/IX)", "2015–2022 (X)", "2023–prezent (XI)"], "CR-V": ["2002–2006 (II)", "2006–2012 (III)", "2012–2018 (IV)", "2018–2023 (V)", "2023–prezent (VI)"], "HR-V": ["2015–2021 (II)", "2021–prezent (III)"]},
  "Mazda": {"Mazda3": ["2003–2009 (BK)", "2009–2013 (BL)", "2013–2019 (BM/BN)", "2019–prezent (BP)"], "Mazda6": ["2002–2008 (GG)", "2008–2012 (GH)", "2012–2023 (GJ/GL)"], "CX-5": ["2012–2017 (I)", "2017–prezent (II)"], "MX-5": ["2005–2015 (NC)", "2015–prezent (ND)"]},
  "Nissan": {"Qashqai": ["2006–2013 (J10)", "2013–2021 (J11)", "2021–prezent (J12)"], "Juke": ["2010–2019 (I)", "2019–prezent (II)"], "X-Trail": ["2001–2007 (T30)", "2007–2013 (T31)", "2013–2021 (T32)", "2021–prezent (T33)"], "GT-R": ["2007–prezent (R35)"]},
  "Fiat": {"500": ["2007–2024", "2020–prezent (Electric)"], "Panda": ["2003–2012 (II)", "2012–prezent (III)"], "Tipo": ["2015–prezent"], "Ducato": ["2006–2014 (X250)", "2014–prezent (X290)"]},
  "Mini": {"Cooper": ["2001–2006 (R50/R53)", "2006–2013 (R56)", "2014–2023 (F56)", "2024–prezent (F66)"], "Countryman": ["2010–2016 (I)", "2017–2023 (II)", "2023–prezent (III)"], "Clubman": ["2007–2014 (I)", "2015–2023 (II)"]},
  "Mitsubishi": {"Lancer": ["2000–2007 (IX)", "2007–2017 (X)"], "Outlander": ["2003–2012 (I/II)", "2012–2021 (III)", "2021–prezent (IV)"], "ASX": ["2010–2023 (I)", "2023–prezent"]},
  "Subaru": {"Impreza": ["2000–2007 (GD)", "2007–2011 (GH)", "2011–2016 (GP)", "2016–prezent (GT)"], "WRX": ["2002–2007 (GD)", "2007–2014 (GR)", "2014–2021 (VA)", "2021–prezent (VB)"], "Forester": ["2002–2008 (SG)", "2008–2013 (SH)", "2013–2018 (SJ)", "2018–prezent (SK)"], "Outback": ["2003–2009 (III)", "2009–2014 (IV)", "2014–2020 (V)", "2020–prezent (VI)"]},
  "Alfa Romeo": {"Giulia": ["2016–prezent"], "Stelvio": ["2017–prezent"], "Giulietta": ["2010–2020"], "Tonale": ["2022–prezent"]},
  "Cupra": {"Leon": ["2020–prezent"], "Formentor": ["2020–prezent"], "Ateca": ["2018–prezent"], "Born": ["2021–prezent"]},
  "Suzuki": {"Swift": ["2005–2010 (III)", "2010–2017 (IV)", "2017–prezent (V)"], "Vitara": ["2005–2015 (II/III)", "2015–prezent (IV)"], "Jimny": ["1998–2018 (III)", "2018–prezent (IV)"]}
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
  const brandMarks = {"BMW":"BMW logo.svg","Volkswagen":"Volkswagen logo 2019.svg","Škoda":"Škoda Auto logo.svg","Mercedes-Benz":"Mercedes-Benz Star 2022.svg","Jeep":"Jeep logo.svg","Toyota":"Toyota Symbol.svg","Land Rover":"Land Rover.svg","Audi":"Audi-Logo 2016.svg","Porsche":"Porsche crest.svg","Ford":"Ford logo flat.svg","Renault":"Renault 2021.svg","Dacia":"Dacia 2021 logo green.svg","Volvo":"Volvo Iron Mark.svg","Lexus":"Lexus Logo.svg","Tesla":"Tesla T symbol.svg","Peugeot":"Peugeot Logo.svg","Opel":"Opel Logo 2021.svg","Hyundai":"Hyundai symbol.svg","Kia":"KIA logo3.svg","Honda":"Honda.svg","Mazda":"Mazda logo.svg","Nissan":"Nissan 2020 logo.svg","Fiat":"FIAT logo (2020).svg","Mini":"MINI logo.svg","Mitsubishi":"Mitsubishi logo.svg","Subaru":"Subaru logo.svg","Alfa Romeo":"Alfa Romeo logo.svg","Cupra":"Cupra symbol.svg","Suzuki":"Suzuki logo 2025 (symbol).svg"};
  const logoFallback = {"BMW":"BMW","Volkswagen":"VW","Škoda":"ŠKODA","Mercedes-Benz":"MB","Jeep":"JEEP","Toyota":"TOYOTA","Land Rover":"LAND ROVER","Audi":"AUDI","Porsche":"PORSCHE","Ford":"FORD","Renault":"RENAULT","Dacia":"DACIA","Volvo":"VOLVO","Lexus":"LEXUS","Tesla":"TESLA","Peugeot":"PEUGEOT","Opel":"OPEL","Hyundai":"HYUNDAI","Kia":"KIA","Honda":"HONDA","Mazda":"MAZDA","Nissan":"NISSAN","Fiat":"FIAT","Mini":"MINI","Mitsubishi":"MITSUBISHI","Subaru":"SUBARU","Alfa Romeo":"ALFA ROMEO","Cupra":"CUPRA","Suzuki":"SUZUKI"};
  fitmentView.innerHTML = `<div class="fitment-progress"><span class="active"></span><span></span><span></span><span></span></div><div class="fitment-view-head"><div><h3>Alege marca mașinii</h3><p>Începe cu marca. Te ghidăm apoi către model, generație și produsele disponibile.</p></div><span class="fitment-step">${Object.keys(vehicleCatalog).length} MĂRCI</span></div><div class="fitment-grid">${Object.keys(vehicleCatalog).map(make=>`<button class="fitment-option make-option" type="button" data-make="${escapeHTML(make)}"><span class="make-option-top"><span class="make-logo" aria-hidden="true"><img loading="lazy" alt="" src="https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(brandMarks[make] || '')}" onerror="this.remove();this.parentElement.textContent='${escapeHTML(logoFallback[make] || make.toUpperCase())}'"></span><span class="make-arrow">↗</span></span><strong>${escapeHTML(make)}</strong><small>${Object.keys(vehicleCatalog[make]).length} MODELE · EXPLOREAZĂ ↗</small></button>`).join("")}</div>`;
  fitmentView.querySelectorAll("[data-make]").forEach(btn => btn.addEventListener("click", () => { fitmentState.make = btn.dataset.make; renderModels(); }));
}
function renderModels() {
  fitmentState.model = fitmentState.years = null;
  fitmentStep.textContent = "PASUL 02 / MODEL";
  renderCrumbs();
  const models = Object.keys(vehicleCatalog[fitmentState.make] || {});
  const codes = {"Seria 1":"01","Seria 2":"02","Seria 3":"03","Seria 4":"04","Seria 5":"05","X1":"X1","X3":"X3","X5":"X5","Golf":"GOLF","Golf 5":"GOLF 5","Golf 6":"GOLF 6","Golf 7":"GOLF 7","Golf 8":"GOLF 8","Passat":"PASSAT","Polo":"POLO","Tiguan":"TIGUAN","Touareg":"TOUAREG","Octavia":"OCT","Superb":"SUP","Fabia":"FAB","Kodiaq":"KOD","Clasa A":"A","Clasa C":"C","Clasa E":"E","GLC":"GLC","GLE":"GLE","Grand Cherokee":"GC","Wrangler":"WR","Compass":"COMP","Corolla":"COR","RAV4":"RAV4","Land Cruiser":"LC","Yaris":"YAR","Range Rover Sport":"RRS","Range Rover":"RR","Discovery":"DISC","Defender":"DEF","A3":"A3","A4":"A4","A6":"A6","Q5":"Q5"};
  fitmentView.innerHTML = `<div class="fitment-progress"><span class="active"></span><span class="active"></span><span></span><span></span></div><div class="fitment-view-head"><div><h3>${escapeHTML(fitmentState.make)} <span style="color:#ed252b">/</span> Alege modelul</h3><p>Selectează seria sau modelul exact al mașinii tale.</p></div><button type="button" class="fitment-back" id="fitmentBack">← ÎNAPOI LA MĂRCI</button></div><div class="fitment-grid model-photo-grid">${models.map((model,i)=>`<button class="fitment-option model-option" type="button" data-model="${escapeHTML(model)}"><span class="model-photo-wrap"><img class="model-photo" loading="lazy" alt="${escapeHTML(fitmentState.make + ' ' + model)}" data-photo-model="${escapeHTML(model)}" src=""/><span class="model-photo-fallback">${escapeHTML(codes[model] || model.slice(0,4).toUpperCase())}</span></span><strong>${escapeHTML(model)}</strong><small>VEZI GENERAȚII ↗</small></button>`).join("")}</div>`;
  document.getElementById("fitmentBack").addEventListener("click", renderMakes);
  fitmentView.querySelectorAll("[data-model]").forEach(btn => btn.addEventListener("click", () => { fitmentState.model = btn.dataset.model; renderYears(); }));
  // Load model-specific vehicle photos from Wikimedia Commons using the search API.
  // The old generator=search request often returned no usable image, leaving blank cards.
  fitmentView.querySelectorAll("[data-photo-model]").forEach(async img => {
    const make = fitmentState.make;
    const model = img.dataset.photoModel;
    const cleanModel = model.replace(/\s*\((?:Mk|Golf)\s*\d+[^)]*\)/i, "");
    const queries = [
      `"${make} ${cleanModel}" car`,
      `${make} ${cleanModel} hatchback automobile`,
      `${make} ${cleanModel} vehicle exterior`
    ];
    for (const query of queries) {
      try {
        const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(query)}&srlimit=12&format=json&origin=*`;
        const searchResponse = await fetch(searchUrl);
        if (!searchResponse.ok) continue;
        const searchData = await searchResponse.json();
        const results = (searchData.query?.search || []).filter(item =>
          /\.(jpg|jpeg|png|webp)$/i.test(item.title || "") &&
          !/logo|advert|brochure|poster|drawing|diagram|manual/i.test(item.title || "")
        );
        if (!results.length) continue;
        const ids = results.map(item => item.pageid).join("|");
        const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&pageids=${ids}&prop=imageinfo&iiprop=url&iiurlwidth=700&format=json&origin=*`;
        const infoResponse = await fetch(infoUrl);
        if (!infoResponse.ok) continue;
        const infoData = await infoResponse.json();
        const pages = Object.values(infoData.query?.pages || {});
        const match = pages.find(page => page.imageinfo?.[0]?.thumburl);
        if (match) {
          img.onload = () => img.classList.add("loaded");
          img.onerror = () => { img.classList.remove("loaded"); img.removeAttribute("src"); };
          img.src = match.imageinfo[0].thumburl;
          break;
        }
      } catch (_) {
        // Keep the model-code fallback visible if the image source is offline or blocked.
      }
    }
  });
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
    status.textContent = "WhatsApp nu este configurat corect. Contactează ANFAX direct până remediem linkul.";
  }
});
renderMakes();
