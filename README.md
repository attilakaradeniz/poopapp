# PoopApp

A lightweight, Raspberry Pi-hosted, mobile-friendly poop tracking app built with Flask + SQLite.

> Let's you record and view your daily **pooptivity** with style.

---

## Features

- Add poop session via raw 16-digit input format: `DDMMYYYYHHMMHHMM`
- Auto-converts and saves date, start time, end time, and duration (in seconds)
- View all records on a clean dashboard
- See **total duration today**
- Edit and delete entries
- Responsive & mobile-friendly layout
- Tailscale support for secure remote access

---

## Planned Features

- **Start / End** buttons with live timer
- Real-time duration counter with visual progress bar
- Fancy animations (e.g., growing poop & fart clouds)
- Random silly pop-up messages for long sessions ("kubura mı düştün?")
- Cloud sync (optional)
- Multi-user support (with names?)

---

## Tech Stack

- Python 3.x
- Flask
- SQLite
- HTML + CSS (Jinja2)
- Tailscale for secure remote access

---

## Installation (on Raspberry Pi)

```bash
git clone https://github.com/YOUR_USERNAME/poopapp-api.git
cd poopapp-api
pip install flask flask-cors
python3 app.py
