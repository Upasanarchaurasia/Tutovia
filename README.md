# Tutovia — Mindful Study Coach & AI Tutor for CA Aspirants

Tutovia is a specialized study companion designed for Chartered Accountancy (CA Intermediate and CA Final) students in India. It integrates SuperMemo-2 (SM-2) spaced repetition active recall, dynamic syllabus-aligned daily scheduling, and an instant 24/7 AI tutor for ICAI Accounting Standards and Direct/Indirect Tax Laws.

---

## Architecture Overview

- **Main Application:** Served at root `/` (e.g. `http://161.118.173.142/`).
- **Tutovia V2 Standalone Marketing Page:** Served at subpath `/v2/` (e.g. `http://161.118.173.142/v2/`).
  - Completely isolated frontend build in `dist_v2/` deployed to `/var/www/v2/dist/`.
  - In-page localized modals and smooth-scroll anchors (zero external links to root `/`).
  - Adaptive 4-phase time-of-day atmospheric theme engine (Morning, Day, Evening, Night, Auto).

---

## Production Domain & HTTPS / SSL Configuration Guide

The website is currently accessible over raw HTTP via IP address (`http://161.118.173.142/` and `http://161.118.173.142/v2/`). Modern web browsers display a **"Not Secure"** warning when accessing websites over plain HTTP or raw IP addresses.

> [!IMPORTANT]
> **Server Configuration Policy:** Do NOT alter live Nginx server blocks or SSL configurations on the Oracle Cloud VM without explicit user authorization.

To place Tutovia behind a custom domain with full HTTPS encryption (SSL/TLS), follow these steps when ready:

### 1. Point Your Domain DNS to the VM
In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), create an **A Record**:
- **Type:** `A`
- **Host / Name:** `@` (or `v2` for a subdomain like `v2.tutovia.com`)
- **Points to (Value):** `161.118.173.142`
- **TTL:** Auto or 300 seconds

Also add a `CNAME` for `www`:
- **Type:** `CNAME`
- **Host / Name:** `www`
- **Points to:** `yourdomain.com`

---

### 2. Install Certbot on the Ubuntu VM
Connect to the server via SSH:
```bash
ssh -i "path/to/ssh-key.key" ubuntu@161.118.173.142
```

Install Certbot and the Nginx plugin:
```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

---

### 3. Update Nginx Server Name
Edit `/etc/nginx/sites-available/tutovia` (or your active config):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Root Tutovia App
    location / {
        root /var/www/tutovia/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Isolated Tutovia V2 Marketing Page
    location /v2/ {
        alias /var/www/v2/dist/;
        index index.html v2.html;
        try_files $uri $uri/ /v2/index.html;
    }
}
```
Test and reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### 4. Issue Free Let's Encrypt SSL Certificate
Run Certbot to automatically configure SSL and redirect HTTP to HTTPS:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Select the option to **Redirect HTTP traffic to HTTPS**.

---

### 5. Verify Automatic Renewal
Let's Encrypt certificates are valid for 90 days. Certbot installs a systemd timer for automatic renewal. Verify renewal with:
```bash
sudo certbot renew --dry-run
```

Once complete, your site will serve securely at:
- `https://yourdomain.com/` (Main App)
- `https://yourdomain.com/v2/` (V2 Marketing Page)
