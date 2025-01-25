+++
title = "**Tor**, **Torsocks**, **Nginx**, or **IPFS**"
menu = "Blog"
date = "2025-01-24"
+++


Building a highly private and anonymous file server or communication platform with **Tor**, **Torsocks**, **Nginx**, or **IPFS** involves several steps to ensure that your activities are hidden and the server remains secure. Below is a comprehensive guide to achieve this:

---

### **1. Core Components Overview**
- **Tor**: Provides anonymity by routing traffic through the Tor network. It can also host `.onion` hidden services for anonymous access.
- **Torsocks**: Ensures that applications route traffic exclusively through the Tor network.
- **Nginx**: A lightweight and efficient web server for serving files or hosting websites.
- **IPFS (InterPlanetary File System)**: A decentralized storage and file-sharing system that can work with Tor for anonymity.

---

### **2. Step-by-Step Guide to Building a Private File Server**

#### **A. Setting Up Tor**
1. **Install Tor**:
   ```bash
   sudo apt update
   sudo apt install tor -y
   ```
2. **Configure a Hidden Service**:
   Edit the Tor configuration file:
   ```bash
   sudo nano /etc/tor/torrc
   ```
   Add the following lines to create a hidden service:
   ```plaintext
   HiddenServiceDir /var/lib/tor/hidden_service/
   HiddenServicePort 80 127.0.0.1:80
   ```
   Save and restart Tor:
   ```bash
   sudo systemctl restart tor
   ```
3. **Get the .onion Address**:
   After restarting Tor, retrieve your `.onion` address:
   ```bash
   sudo cat /var/lib/tor/hidden_service/hostname
   ```
   Use this address to access your hidden service.

---

#### **B. Setting Up Nginx**
1. **Install Nginx**:
   ```bash
   sudo apt install nginx -y
   ```
2. **Configure Nginx for File Hosting**:
   Open the Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
   Replace the content with:
   ```nginx
   server {
       listen 127.0.0.1:80;
       server_name localhost;

       root /var/www/html;
       index index.html index.htm;

       location / {
           autoindex on;
           autoindex_exact_size off;
           autoindex_localtime on;
       }
   }
   ```
   Save and restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```
3. **Add Files to Serve**:
   Place your files in `/var/www/html/`. They will be accessible through the `.onion` address.

---

#### **C. Using Torsocks to Route Traffic**
Torsocks ensures all your applications connect through Tor.

1. **Testing Torsocks**:
   ```bash
   torsocks curl https://check.torproject.org
   ```
   This confirms if your traffic is routed through Tor.

2. **Run Applications via Torsocks**:
   - **Git Clone through Tor**:
     ```bash
     torsocks git clone https://github.com/example/repo.git
     ```
   - **SSH through Tor**:
     ```bash
     torsocks ssh user@your-onion-address.onion
     ```

---

#### **D. Using IPFS with Tor**
IPFS can distribute your files in a decentralized way while maintaining anonymity.

1. **Install IPFS**:
   Download and install the latest IPFS version:
   ```bash
   wget https://dist.ipfs.tech/kubo/latest/kubo_latest_linux-amd64.tar.gz
   tar -xvzf kubo_latest_linux-amd64.tar.gz
   sudo mv ipfs /usr/local/bin/
   ```
   Initialize IPFS:
   ```bash
   ipfs init
   ```

2. **Route IPFS Traffic Through Tor**:
   Configure Tor as a SOCKS proxy for IPFS:
   ```bash
   export HTTP_PROXY=socks5h://127.0.0.1:9050
   export HTTPS_PROXY=socks5h://127.0.0.1:9050
   ```
   Start the IPFS daemon:
   ```bash
   ipfs daemon
   ```

3. **Add Files to IPFS**:
   ```bash
   ipfs add your_file.txt
   ```
   Distribute the resulting IPFS hash via Tor.

---

### **3. Enhancing Privacy and Security**

#### **A. Use CoinJoin for Privacy**
CoinJoin mixes Bitcoin transactions, ensuring anonymity when making payments to or from your server.

- **Run JoinMarket Over Tor**:
  Install and use JoinMarket with Torsocks:
  ```bash
  torsocks python joinmarket.py wallet-tool.py generate
  ```

#### **B. Secure the VPS**
- **Disable Root Login**:
  Edit `/etc/ssh/sshd_config`:
  ```plaintext
  PermitRootLogin no
  ```
  Restart SSH:
  ```bash
  sudo systemctl restart ssh
  ```
- **Enable a Firewall**:
  Allow only necessary ports:
  ```bash
  sudo ufw allow OpenSSH
  sudo ufw allow 9050
  sudo ufw enable
  ```

#### **C. Automate Backups**
Automate file backups through Tor using **rsync**:
```bash
torsocks rsync -av /path/to/files/ user@onionaddress.onion:/remote/backup/
```

---

### **4. Advanced Techniques**

#### **A. Combine Tor and VPN**
To add an extra layer of security, connect your VPS to a VPN before starting Tor. This setup prevents your real IP from being exposed even if Tor fails.

#### **B. Automate Tor Traffic Routing**
Use `iptables` to force all traffic through Tor:
```bash
sudo iptables -t nat -A OUTPUT -m owner --uid-owner your-user -j REDIRECT --to-ports 9050
```

#### **C. Implement Hidden Service Authentication**
Restrict access to your `.onion` service using Tor authentication:
1. Add this to your `torrc`:
   ```plaintext
   HiddenServiceDir /var/lib/tor/hidden_service/
   HiddenServicePort 80 127.0.0.1:80
   HiddenServiceAuthorizeClient stealth your-client-name
   ```
2. Retrieve the authorization key:
   ```bash
   sudo cat /var/lib/tor/hidden_service/hostname
   ```

---

### Summary
With **Tor**, **Torsocks**, **Nginx**, and **IPFS**, you can build a secure and anonymous file server or communication platform. Adding advanced techniques like CoinJoin, automated backups, and VPN integration ensures robust privacy and functionality.