# ANFAX — Homepage and customisation request form

A responsive Romanian-language landing page for ANFAX Performance, built with plain HTML/CSS/JS for GitHub Pages.

## Features
- Inspirational automotive homepage and minimalist black/white/red design
- WhatsApp CTA placeholder
- Vehicle request form: name, phone, make/model, year, engine, body style, project category, description and budget
- Image file selection for car photos and inspiration photos
- Form validation and WhatsApp message preparation once a WhatsApp number is configured

## Before publishing
Open `script.js` and replace `407XXXXXXXX` with the WhatsApp number in international format without `+`, spaces or dashes.

## Important limitation
GitHub Pages is static hosting. This version does not upload image files to a server or store submitted requests. After the WhatsApp number is configured, the form prepares the text for a WhatsApp message; selected images must be attached manually in WhatsApp. For automatic image uploads, connect a form backend or file-upload service.

## Publish
1. Create a new public repository, e.g. `anfax-performance`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Go to Settings → Pages.
4. Select Deploy from a branch, branch `main`, folder `/(root)`, and Save.
