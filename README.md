# Translate

A minimalist, Apple-inspired translation web app with automatic translation and text-to-speech.

Now available as a **Progressive Web App (PWA)** — you can install it on your phone or desktop like a native app.

## Features

- Auto-detect or selected source language
- Automatic translation after typing pauses
- Arabic as the default target language
- Copy and clear controls
- Listen to source or translated text using the Web Speech API
- Light and dark appearance based on system preferences
- Responsive layout for phones, tablets, and desktop
- **PWA support**: Installable, works offline for the UI, custom icon

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Install as App (PWA)

1. Open the app in Chrome, Edge, or Safari.
2. Look for the install prompt (or use the browser menu → "Install app" / "Add to Home Screen").
3. The app will appear on your home screen / app drawer with the 🌐 icon.

## Translation API

This project uses the free MyMemory Translation API. No API key is required.

## Deploy as website

To publish it live for free with GitHub Pages:

1. Go to the repository → **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Choose branch: **main** and folder: **/ (root)**
4. Save. Your site will be available at:
   `https://qzh8g9knhn-sudo.github.io/my-first-app/`
