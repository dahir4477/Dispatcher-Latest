# Deploy the Dispatch Landing App on AWS EC2

This guide covers launching an EC2 instance, optionally installing **PostgreSQL** or **MySQL** on the VM, and running the **Next.js** application behind **Nginx** with a process manager.

---

## Important: how this app uses a database

The landing page is built to save leads to **Supabase** (managed PostgreSQL in the cloud) via the `/api/lead` route and the **Supabase JavaScript client**. You do **not** need PostgreSQL or MySQL **on the EC2 instance** for the app to work as designed—only these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (your public URL, e.g. `https://dispatch.example.com`)

**If you still want a database on EC2** (compliance, learning, or future services), install **PostgreSQL** or **MySQL** using the sections below. The current app code does **not** connect to that local DB unless you change the API to use a direct driver (e.g. `pg` or `mysql2`). For production with minimal changes, keep using **Supabase** and treat the local DB as optional.

---

## Part 1 — Create and connect to the EC2 instance

### 1.1 Launch EC2

1. In **AWS Console** → **EC2** → **Launch instance**.
2. **Name:** e.g. `dispatch-landing`.
3. **AMI:** **Ubuntu Server 24.04 LTS** (or 22.04 LTS).
4. **Instance type:** `t3.small` or larger (minimum `t3.micro` for light traffic; `t3.small` is safer for Node builds).
5. **Key pair:** Create or select a key pair → download the `.pem` file.
6. **Network settings:**
   - Allow **SSH (22)** from **My IP** (not `0.0.0.0/0` long term).
   - Allow **HTTP (80)** and **HTTPS (443)** from **Anywhere** (or your ALB/VPC only).
7. **Storage:** 20–30 GiB gp3 is usually enough.
8. **Launch instance**.

### 1.2 Connect over SSH (Linux / macOS / WSL)

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@EC2_PUBLIC_IP
```

On **Windows** (PowerShell), use the same command in WSL or `ssh` with the full path to the key.

---

## Part 2 — Initial server setup (Ubuntu)

Run as `ubuntu` user (use `sudo` where shown).

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw
```

### Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Part 3 — Install Node.js (LTS)

Use **NodeSource** or **nvm**; example with NodeSource (Node 20 LTS):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

## Part 4 — Install PostgreSQL on EC2 (optional)

Only needed if you want a database **on this server** (not required for Supabase-based leads).

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
sudo -u postgres psql -c "SELECT version();"
```

Create a database and user (example):

```bash
sudo -u postgres psql <<'SQL'
CREATE USER dispatch_app WITH PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
CREATE DATABASE dispatch_db OWNER dispatch_app;
GRANT ALL PRIVILEGES ON DATABASE dispatch_db TO dispatch_app;
SQL
```

**Security:** Restrict Postgres to localhost (default). Do not expose port `5432` to the internet unless you use a VPN or security group rules you understand.

To use this DB with the app, you would need to change `/api/lead` to insert via `pg` or an ORM and store credentials in env vars—not covered by the default codebase.

---

## Part 5 — Install MySQL on EC2 (optional)

Alternative to PostgreSQL on the same server.

```bash
sudo apt install -y mysql-server
sudo systemctl enable --now mysql
sudo mysql_secure_installation
```

Create DB and user (example):

```bash
sudo mysql -e "CREATE DATABASE dispatch_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'dispatch_app'@'localhost' IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';"
sudo mysql -e "GRANT ALL PRIVILEGES ON dispatch_db.* TO 'dispatch_app'@'localhost'; FLUSH PRIVILEGES;"
```

Same note: the current Next.js app does **not** use this MySQL instance unless you modify the code.

---

## Part 6 — Deploy the Next.js application

### 6.1 Clone and install

```bash
cd /home/ubuntu
git clone https://github.com/YOUR_ORG/Dispatch-Landing-Page-Website.git app
cd app
npm ci
```

### 6.2 Environment variables

Create a production env file (do not commit secrets):

```bash
nano /home/ubuntu/app/.env.production
```

Example (Supabase — required for the built-in lead form):

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain-or-ec2-dns.com
```

Load these when building and when starting (see below). For Next.js, `NEXT_PUBLIC_*` are embedded at **build** time for client bundles; the API route also reads them at runtime. After changing env, run `npm run build` again.

```bash
export $(grep -v '^#' .env.production | xargs)
npm run build
```

### 6.3 Run with PM2 (recommended)

```bash
sudo npm install -g pm2
cd /home/ubuntu/app
export $(grep -v '^#' .env.production | xargs)
pm2 start npm --name "dispatch-landing" -- start
pm2 save
pm2 startup
# Run the command PM2 prints (sudo env PATH=... pm2 startup systemd -u ubuntu --hp /home/ubuntu)
```

Default Next.js production port is **3000**. PM2 runs `npm start` which listens on `3000`.

```bash
pm2 status
pm2 logs dispatch-landing
```

---

## Part 7 — Nginx reverse proxy + HTTPS

### 7.1 Install Nginx

```bash
sudo apt install -y nginx
```

### 7.2 Site config (HTTP first)

Point **your domain** DNS **A record** to the EC2 public IP (or use the EC2 public DNS for testing only).

```bash
sudo nano /etc/nginx/sites-available/dispatch-landing
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/dispatch-landing /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7.3 HTTPS with Let’s Encrypt (Certbot)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Update `NEXT_PUBLIC_SITE_URL` to `https://your-domain.com`, rebuild, and restart PM2:

```bash
cd /home/ubuntu/app
export $(grep -v '^#' .env.production | xargs)
npm run build
pm2 restart dispatch-landing
```

---

## Part 8 — Operations checklist

| Task | Command |
|------|---------|
| App logs | `pm2 logs dispatch-landing` |
| Restart app | `pm2 restart dispatch-landing` |
| Nginx logs | `sudo tail -f /var/log/nginx/error.log` |
| Update code | `cd ~/app && git pull && npm ci && npm run build && pm2 restart dispatch-landing` |
| Postgres status | `sudo systemctl status postgresql` |
| MySQL status | `sudo systemctl status mysql` |

---

## Part 9 — Security summary

- SSH: key-based only; restrict security group to known IPs where possible.
- Do not open Postgres (`5432`) or MySQL (`3306`) to `0.0.0.0/0`.
- Keep Ubuntu and Node updated; use strong DB passwords.
- Prefer **HTTPS** via Certbot for production traffic.

---

## Quick reference: minimal path (no local DB)

1. Launch EC2 (Ubuntu), open 22, 80, 443.
2. Install Node.js, Git, Nginx, PM2.
3. Clone repo → `npm ci` → create `.env.production` with **Supabase** vars → `npm run build` → `pm2 start npm --name dispatch-landing -- start`.
4. Configure Nginx → Certbot for HTTPS.
5. **Skip** Parts 4–5 unless you have a separate need for MySQL/PostgreSQL on the instance.

This matches how the application is written today: **Supabase** holds lead data; EC2 only runs the Next.js server.
