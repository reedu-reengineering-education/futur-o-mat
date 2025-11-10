# Futur-O-Mat Character Designer

This project is a web-based avatar/character designer for the Futur-O-Mat. Users can create, customize, and share avatars, including sharing exact character states via short links.

---

## Requirements

- **PHP** (for the backend and local server)
- **Node.js** and **npm** (for running the manifest generator script)
- A modern web browser

---

## 1. Starting the PHP Server

To run the website locally, you need a PHP server.  
Open a terminal in the project directory and run:

```bash
php -S localhost:8000
```

This will start a local server at [http://localhost:8000](http://localhost:8000).

---

## 2. Displaying the Website

After starting the PHP server, open your browser and go to:

```
http://localhost:8000/index.php
```

If you have deployed to a web server, use your public URL (e.g., `https://portfolio.benjaminbertram.de/index.php`).

---

## 3. Running `generate_parts_manifest.js`

This script scans the `assets/avatars` directory and generates the `avatar_parts_manifest.json` file used by the app.

**To run the script:**

1. Make sure you have Node.js installed.
2. In the project directory, run:

```bash
node generate_parts_manifest.js
```

This will update `avatar_parts_manifest.json` with all available avatar parts.

---

## 4. File Structure

- `index.php` — Main entry point for the app (serves the website and dynamic meta tags for sharing)
- `scripts.js` — Main frontend logic
- `styles.css` — Main stylesheet
- `avatar_parts_manifest.json` — Generated manifest of all avatar parts
- `generate_parts_manifest.js` — Script to generate the manifest
- `avatar_state_api.php` — API for saving/loading avatar states for sharing
- `assets/` — All avatar images and static assets

---

## 5. Sharing and Social Media

- When you share an avatar, a short link is generated (with a state ID).
- When the link is opened, the exact same avatar is reconstructed.
- Social media previews use dynamic Open Graph meta tags for rich previews.

---

## Troubleshooting

- If you see a "no secure connection" error, make sure your server supports HTTPS or use HTTP for local testing.
- If avatars do not appear, ensure you have run `generate_parts_manifest.js` and that your `assets/avatars` directory is populated.

---

## License

CC-BY-4.0