+++
title = "Secure Messaging System Architecture: Session"
menu = "Blog"
date = "2025-02-15"
+++

---

# **Secure Messaging System Architecture: Session**

![session-messenger](https://i0.wp.com/mobirank.pl/wp-content/uploads/2020/03/session-messenger-screen.png?ssl=1)

## **SNS Messaging System**
Session is an open-source, public-key-based secure messaging system designed to minimize metadata leakage while maintaining strong encryption. It uses decentralized storage servers and an onion routing protocol to ensure privacy, avoiding central servers and traditional identity-based registration methods (e.g., phone numbers, emails). 

---

## **1. Service Nodes**
Service Nodes (also called **Session Nodes**) form the backbone of the network. They are responsible for:
- **Message Routing**: Forwarding encrypted messages through multiple hops.
- **Storage Servers**: Temporarily holding messages for offline users.
- **Network Security**: Ensuring data integrity and anonymity.

### **Decentralization and Economic Incentives**
Unlike traditional centralized messaging apps, Session uses a **staked routing and storage network** built on Arbitrum, an Ethereum Layer 2 blockchain. This model:
- Requires node operators to **stake tokens** to prevent Sybil attacks.
- Provides **rewards** to honest nodes.
- Ensures high availability through a **self-balancing swarm system**.

---

## **2. Client Applications**
Session clients provide the user-facing functionality of the network and interact with Service Nodes.

### **Core Features**
- **Message Encryption**: Uses end-to-end encryption with XChaCha20-Poly1305.
- **Path Selection**: Clients establish onion-routed paths through random nodes.
- **Network Interaction**: Periodically fetches new Session Node lists to ensure accurate routing.

### **Identity Management**
Session clients generate **Ed25519 public-private key pairs** for account identity. No phone number or email is required. Accounts can be recovered using a **mnemonic seed phrase (Recovery Password)**.

---

## **3. Open Group Servers**
Open Group Servers (Session Communities) facilitate **large-scale communication**.

### **Roles**
- **Community Hosting**: Acts as a decentralized forum for large groups.
- **Message Storage**: Stores messages outside the core Session Node network.
- **User Management**: Admins enforce rules and permissions.

### **Security Model**
- **Blind ID Authentication**: Users’ Account IDs are obfuscated when joining communities.
- **Self-hosting Option**: Users can run their own community servers.
- **Transport Encryption**: Protects data during transmission but lacks end-to-end encryption.

---

## **4. Message Routing**
Session employs **onion routing** to obscure sender and recipient metadata.

### **Mechanism**
1. A client encrypts a message in multiple layers, each decrypted by an intermediate node.
2. The message is forwarded through **three hops** in the network.
3. The last node forwards the message to its final destination.

### **Key Features**
- **Store and Forward**: Messages are stored temporarily to ensure offline delivery.
- **Path Redundancy**: Multiple paths exist to prevent single points of failure.
- **Network Resilience**: Dynamic path selection enhances security against adversaries.

---

## **5. Security Features**
Session implements multiple layers of security to protect user data and prevent metadata leakage.

### **Core Security Features**
- **Path Encryption**: Messages are encrypted at each routing layer.
- **Node Authentication**: Only legitimate nodes can participate in routing.
- **Network Monitoring**: Session Nodes undergo periodic **reachability testing**.
- **Attack Prevention**: Defenses against passive and active adversaries.

### **Metadata Protection**
Session minimizes metadata collection:
- **No IP-linkability**: The first node in the path sees the sender but not the recipient.
- **Decentralized Storage**: Messages are fragmented across **swarm-based storage**.
- **Pseudonymous Accounts**: No phone numbers, emails, or centralized identifiers.

---

## **Consider**
Session’s architecture prioritizes **decentralization, security, and anonymity** through a combination of:
- **Onion routing for network-level privacy.**
- **Session Nodes for decentralized storage and message forwarding.**
- **Open Group Servers for large-scale communication.**
- **End-to-end encryption for private messaging.**

By combining these elements, Session offers a highly secure messaging environment with **minimal metadata exposure**, making it a strong alternative to centralized messaging platforms.

# **Session Technical Architecture Overview**  
 
Session is a decentralized, secure messaging platform built on the Oxen network. It modifies elements of the **Signal Protocol**, incorporates **onion routing**, and operates on a distributed network of **Service Nodes**. This document provides a deep dive into Session’s technical architecture, covering **clients, servers, service nodes, protocols, and encryption mechanisms**.  

---

## **1. Core Components**  

### **1.1 Client Applications**  
Session provides cross-platform support through the following implementations:  

| Platform  | Technology Stack |
|-----------|----------------|
| **Desktop** | Electron (JavaScript, React) |
| **Android** | Kotlin, Java |
| **iOS** | Swift |

#### **Client Responsibilities**  
- **Message encryption & decryption** (using a modified Signal Protocol).  
- **Onion routing path selection** for anonymous communication.  
- **Fetching updated service node lists** for decentralized routing.  
- **Secure account management** with Ed25519 public-private key pairs.  

---

### **1.2 Server Components**  
Session utilizes **PySOGS** (Python-based Open Group Server) to handle **open group communications** and file storage outside of the onion-routed Session network.  

🔗 **Reference:** [Open Group Setup Guide](https://docs.oxen.io/oxen-docs/products-built-on-oxen/session/guides/open-group-setup)  

#### **PySOGS Responsibilities**  
- **Community Hosting**: Manages public chat groups.  
- **Message Storage**: Stores non-ephemeral messages.  
- **User Management**: Controls access rules and permissions.  
- **Limited Metadata Protection**: Lacks end-to-end encryption but offers transport encryption.  

---

## **2. Service Nodes & File Servers**  

Session's core infrastructure relies on **Service Nodes**, which form the backbone of message propagation and storage.  

### **2.1 Service Nodes**  
- **Decentralized message routing** through onion-encrypted paths.  
- **Staked participation**: Service Nodes must stake Oxen (OXEN cryptocurrency) to prevent Sybil attacks.  
- **Redundant storage & relaying**: Messages are temporarily stored until delivery.  

### **2.2 File Servers**  
- Used for **attachments & media storage** outside the encrypted onion-routed network.  
- Operates on **decentralized infrastructure**, preventing centralized control.  
- Files are **end-to-end encrypted before upload**, ensuring privacy.  

---

## **3. Protocol Details**  

Session’s communication security is based on a modified **Signal Protocol**, combined with Oxen’s **LLARP onion routing** and a decentralized **message storage mechanism**.  

### **3.1 Signal Protocol Modifications**  
- **Removal of phone number requirement** (uses Ed25519 keys instead).  
- **Long-term private key storage** without centralized servers.  
- **Multi-hop onion encryption for metadata protection** (not present in original Signal).  

### **3.2 Onion Routing Implementation**  
- **Three-hop encryption** similar to Tor.  
- Each hop only knows the **next destination**, not the final recipient.  
- **Path obfuscation**: Messages take dynamic paths to avoid traffic analysis.  

### **3.3 Message Routing & Storage**  
- Messages are stored in a **store-and-forward** model for offline users.  
- **Redundancy**: Messages are stored across multiple nodes to prevent loss.  
- **Swarm-based message storage**: Each message is redundantly stored within a rotating subset of nodes.  

### **3.4 Encryption Specifications**  
Session applies multiple encryption layers:  

| Encryption Layer | Algorithm |
|-----------------|-----------|
| **Message Encryption** | XChaCha20-Poly1305 |
| **Identity & Signatures** | Ed25519 |
| **Onion Routing Encryption** | LLARP AES-GCM |
| **File Encryption** | AES-256-GCM |

---

## **4. Network Architecture**  

Session’s network design ensures **decentralization, resilience, and anonymity**.  

### **4.1 Decentralized Design**  
- No central servers; **Service Nodes** handle all routing and storage.  
- Nodes participate in a **proof-of-stake mechanism**, reducing Sybil attacks.  
- **No reliance on DNS** or centralized IP addresses.  

### **4.2 Service Node Operations**  
- Each node maintains a **partial view of the network**, ensuring scalability.  
- Nodes are responsible for **validating encrypted traffic** without seeing message content.  
- **Service Nodes use a rotating quorum system** for load balancing and preventing censorship.  

### **4.3 Message Propagation**  
- Messages are **onion-encrypted** and pass through **three service nodes**.  
- **No node knows both the sender and recipient**, ensuring anonymity.  
- **Message delivery confirmation** is handled via cryptographic acknowledgments.  

### **4.4 File Handling**  
- Files are stored separately from text messages for **scalability**.  
- Attachments use **end-to-end encryption** before upload.  
- File retrieval is authenticated using **Ephemeral File IDs** (EFIDs).  

---

## **Consider**  
Session achieves **high security, privacy, and decentralization** through its unique architecture:  
✔ **Modified Signal Protocol** for secure messaging.  
✔ **LLARP onion routing** for anonymous communication.  
✔ **Service Node-based decentralized storage & relay network**.  
✔ **PySOGS for open groups and non-ephemeral messaging**.  
✔ **No phone numbers, emails, or centralized identity tracking**.  

This system ensures that **Session remains censorship-resistant, private, and scalable** while maintaining a **trustless, decentralized messaging experience**.

# **Comprehensive Guide: Setting Up a Session Open Group Server (SOGS)**  

## **Decentralized Onion Routed SNS**  
Session Open Group Servers (SOGS) allow you to **host large, decentralized group chats** for Session users. These groups can support thousands of members, offering **metadata privacy** while maintaining **server-side message storage**.  

This guide provides **step-by-step instructions** to:  
- Install and configure a **Session Open Group Server** (PySOGS).  
- Manage rooms and users.  
- Interact with the **SOGS REST API** for automation.  
- Set up a **proxy server (optional) for HTTPS support**.  

---

## **1. Prerequisites**  
### **Server Requirements**  
- **Operating System:** Ubuntu 20.04+ or Debian 10+  
- **Minimum Hardware:**  
  - 1 vCore CPU  
  - 512MB RAM  
  - 20GB storage  

### **Choosing a Hosting Provider**  
You can use a **Virtual Private Server (VPS)** from:  
- **Hetzner**  
- **Linode**  
- **DigitalOcean**  
- **Amazon Lightsail**  
- **Vultr**  

Alternatively, you can **self-host**, but keep in mind:  
- **Dynamic IPs & bandwidth limits** may affect stability.  
- **Port forwarding & firewall rules** are required.  

---

## **2. Install SOGS**  

### **Step 1: Add the Oxen Repository**  
Run the following commands:  
```bash
sudo curl -so /etc/apt/trusted.gpg.d/oxen.gpg https://deb.oxen.io/pub.gpg
echo "deb https://deb.oxen.io $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/oxen.list
sudo apt update
```

### **Step 2: Install SOGS**
You have **two installation options**:  

#### **Option 1: Standalone SOGS (Default)**
```bash
sudo apt install sogs-standalone
```
- Listens directly on a **public IP & port** for HTTP requests.  
- Does **not support HTTPS** (but Session messages are encrypted anyway).  

#### **Option 2: Proxied SOGS (for HTTPS)**
```bash
sudo apt install sogs-proxied
```
- Runs behind **nginx or Apache2**.  
- Allows HTTPS with **Let's Encrypt & Certbot**.  

> 📝 **If unsure, use the standalone version.**  

### **Step 3: Set Server Address**  
During installation, enter:  
- **Your domain name** (if you have one).  
- **Your public VPS IP** (if no domain is set up).  

You can find your VPS IP using:  
```bash
curl ifconfig.me
```

---

## **3. Configure Your Open Group Server**  

### **Step 1: Create a Room**
Run:
```bash
sogs --add-room ROOM_TOKEN --name "Room Name" --description "Room Description"
```
Example:  
```bash
sogs --add-room bitcoin --name "Bitcoin Chat" --description "Talk about BTC!"
```

### **Step 2: Set Yourself as an Admin**
```bash
sogs --rooms + --add-moderators YOUR_SESSION_ID --admin --visible
```
Example:
```bash
sogs --rooms + --add-moderators 05d871fc80ca007eed9b2f4df72853e2a2d5465a92fcb1889fb5c84aa2833b3b40 --admin --visible
```
> 🔍 **Find your Session ID:** Open the Session app → Settings → Copy Account ID.  

### **Step 3: Verify Room Setup**
- Open a web browser and go to:  
  ```
  http://YOUR_VPS_IP/
  ```
- Click on a room to get a **QR code & invite link**.  
- Share the **Session join link** with users.  

---

## **4. API Reference: Automate SOGS Management**
You can use the **SOGS REST API** to automate room management, user moderation, and message retrieval.  

### **Authentication**  
All API requests require a **Bearer token**:
```http
Authorization: Bearer YOUR_TOKEN
```

---

### **4.1 Room Management**
#### **Create a Room**
```http
POST /room
Content-Type: application/json

{
    "token": "room_token",
    "name": "Room Name",
    "description": "Room Description"
}
```
#### **Get Room Info**
```http
GET /room/{token}
```
#### **Update Room**
```http
PUT /room/{token}
Content-Type: application/json

{
    "name": "New Name",
    "description": "New Description"
}
```
#### **Delete Room**
```http
DELETE /room/{token}
```

---

### **4.2 Message Operations**
#### **Send a Message**
```http
POST /room/{token}/message
Content-Type: application/json

{
    "content": "Message content"
}
```
#### **Get Messages (Since a Timestamp)**
```http
GET /room/{token}/messages?since={timestamp}
```
#### **Delete a Message**
```http
DELETE /room/{token}/message/{id}
```

---

### **4.3 User Management**
#### **Ban a User**
```http
POST /room/{token}/ban
Content-Type: application/json

{
    "session_id": "user_session_id"
}
```
#### **Unban a User**
```http
DELETE /room/{token}/ban/{session_id}
```
#### **List Banned Users**
```http
GET /room/{token}/bans
```

---

### **4.4 File Operations**
#### **Upload a File**
```http
POST /room/{token}/upload
Content-Type: multipart/form-data
```
#### **Download a File**
```http
GET /file/{file_id}
```

---

## **5. Securing SOGS with a Reverse Proxy (HTTPS)**
If you installed `sogs-proxied`, set up **nginx with HTTPS**:

### **Step 1: Install nginx & Certbot**
```bash
sudo apt install nginx certbot python3-certbot-nginx
```

### **Step 2: Configure nginx**
```bash
sudo nano /etc/nginx/sites-available/session
```
Paste:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
Save & exit. Then enable the config:
```bash
sudo ln -s /etc/nginx/sites-available/session /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### **Step 3: Get SSL Certificate**
```bash
sudo certbot --nginx -d YOUR_DOMAIN_OR_IP
```

Now, your **SOGS will be accessible via HTTPS**.

---

## **6. Updating & Maintaining SOGS**
To keep your server up-to-date:
```bash
sudo apt update && sudo apt upgrade
```

To restart the SOGS service:
```bash
sudo systemctl restart sogs
```

---

## **7. Troubleshooting**
### **Check Logs**
```bash
sudo journalctl -u sogs --no-pager | tail -50
```

### **Restart the Service**
```bash
sudo systemctl restart sogs
```

### **Check if SOGS is Running**
```bash
sudo systemctl status sogs
```

---

## **Welcome New Sessions**
You now have a fully functional **Session Open Group Server (SOGS)** running on your VPS! 🎉  

### **Recap:**
✔ **Installed SOGS** on Ubuntu/Debian.  
✔ **Created & managed rooms** via CLI.  
✔ **Set up an admin user**.  
✔ **Integrated REST API** for automation.  
✔ **Secured with HTTPS using nginx & Certbot**.  

🚀 **Your private, decentralized chatroom is now live!** 🚀

## Further Reading

- [Session: End-To-End Encrypted Conversations With Minimal
Metadata Leakage](https://arxiv.org/pdf/2002.04609)
