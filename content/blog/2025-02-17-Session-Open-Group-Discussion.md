+++
title = "Session Runthrough On Open Groups"
menu = "Blog"
date = "2025-02-17"
+++

Decentralised messaging focuses on reducing metadata collection and providing secure communication channels.

Key aspects of decentralised messaging:
*   **No Phone Number or Email Required**: Account identity is based on pseudonymous public-private key pairs.
*   **Onion Routing Protocol**: Makes it difficult to link IP addresses to accounts or messages.
*   **Decentralised Network**: Relies on a decentralised network of nodes for core messaging functions.
*   **Self-Hosting**: Allows users to self-host infrastructure for services like large attachments and group chat channels.

Session is a secure messaging application that uses a decentralised storage server and an onion routing protocol to send end-to-end encrypted messages while minimising the exposure of user metadata. It aims to provide features expected of mainstream messaging apps, such as multi-device syncing, offline inboxes, and voice/video calling.

Session reduces metadata collection in three key ways:
1.  It does not require users to provide a phone number, email address, or other similar identifier when registering a new account. Instead, pseudonymous public-private key pairs are the basis of an account’s identity.
2.  It makes it difficult to link IP addresses to accounts or messages sent or received by users, through the use of an onion routing protocol.
3.  It does not rely on central servers; a decentralised network of economically incentivised nodes performs all core messaging functionality. For those services where decentralisation is impractical, like storage of large attachments and hosting of large group chat channels, Session allows users to self-host infrastructure and rely on built-in encryption and meta-data protection to mitigate trust concerns.

**Session Nodes**:
*   Session uses a staked routing and storage network called the Session Node network.
*   A financial requirement is added for anyone wishing to host a server on the network.
*   Authorisation for a server to operate on the network is attained through the server operator interacting with the Session staking smart contracts.
*   These contracts enable an operator to register a node by staking a defined amount of Session Tokens, which are bound to their Session Node public key.
*   The staking system provides a defence against Sybil attacks by limiting attackers based on the amount of financial resources they have available.
*   Session Nodes earn rewards for their work, paid as Session Tokens from the Session Node Staking Reward Pool.

**Onion Requests**:
*   Session uses an onion routing protocol, referred to as onion requests, which enables Session clients to obfuscate their IP address by creating a 3-hop randomised ‘path’ through the Session Node network.
*   Onion requests use a simple onion routing protocol which successively encrypts each request for each of the three hops.
*   The first Session Node only knows the IP address of the client and the middle Session Node.
*   The middle Session Node only knows the first and last Session Nodes but not the client or destination.
*   The last Session Node only knows the middle Session Node and the destination IP address.
*   Each onion request contains a payload; the payload describes what is being requested.
*   This payload is end-to-end encrypted for the destination.

Traditional messaging applications often require a phone number or email to register, which creates privacy and security concerns. Session does not use phone numbers or email addresses; user identity is established through the generation of an Ed25519 public-private key pair.

To ensure reliable message storage, Session employs a two-layered approach using the Session Node network and swarms:

*   **Session Node Network**: Session uses a staked routing and storage network where operators are financially incentivised to host servers, ensuring a baseline level of service reliability.
*   **Swarms**: Session replicates messages across small groupings of Session Nodes called **swarms**. This secondary logical data storage layer ensures reliable message storage and retrieval.
    *   Swarms are designed to mitigate the risk of unexpected node downtime due to maintenance, bugs, or outages.
    *   The composition of each swarm changes as nodes leave or new ones register.
    *   Swarms rebalance themselves, with nodes being redistributed to maintain optimal size and prevent any single swarm from becoming overloaded or underpopulated.
    *   Session Nodes within swarms remain synchronised through specific rules when a node joins or leaves.
*   When a node joins a new swarm, existing members recognise the new member and push the swarm’s data records to the new member.
*   When a node leaves a swarm, its existing records can be safely erased, except when the node is migrating from a dissolving swarm. In this case, the migrating node determines the swarms responsible for its records and distributes them accordingly.
*   **Partitioning Identities**: To balance Session users across groups, the user-generated public key space is divided into distinct groupings, mapping each directly to a swarm responsible for storing messages for users within that grouping. Each swarm has a deterministically generated 64-bit number as its identifier. Once the identifier of every swarm on the network is known, a mapping from clients’ Account IDs to swarms can be created. To do this, a given Account ID is reduced to a 64-bit integer to match the number space of swarm identifiers and is then assigned to the swarm whose ID is numerically closest. This ensures that a user can always determine their swarm without a centralised resolver.

Session employs several design choices that differ from traditional messengers to enhance metadata protection. Unlike many popular messaging applications that require a phone number or email address for registration, Session uses pseudonymous public-private key pairs to establish account identity. This approach avoids linking user accounts to personal information.

Key design choices for metadata protection in Session:

*   **Account Identity**: Session accounts are based on Ed25519 public-private key pairs, not phone numbers or email addresses. This eliminates the need for personal identifiers.
*   **Onion Routing**: Session uses an onion routing protocol to make it difficult to link IP addresses to accounts or messages. This involves creating a 3-hop randomised path through the Session Node network to obfuscate IP addresses.
*   **Decentralised Network**: Session relies on a decentralised network of economically incentivised nodes for core messaging functions, rather than central servers.
*   **Self-Hosting**: Session allows users to self-host infrastructure for services like large attachments and group chat channels. Built-in encryption and metadata protection mitigate trust concerns.
*   **Message Storage**: Session provides message storage through the incentivised Session Node network and its usage of swarms. Messages are replicated across small groupings of Session Nodes to ensure reliable storage and retrieval.
*   **No Central Server**: Session does not have a central server to keep records of user accounts. Account recovery is done using a Recovery Password.

By implementing these design choices, Session aims to minimise metadata leakage and provide a more private and secure messaging experience compared to other messengers that rely on traditional methods.

Session's design involves several trade-offs between security and usability, especially concerning metadata protection, encryption, and account management.

Account Identity:
*   **Security**: Session does not require a phone number or email address for registration, instead using Ed25519 public-private key pairs, enhancing pseudonymity and reducing the risk of identity compromise.
*   **Usability**: This approach complicates account recovery, as it relies on users safeguarding their long-term private key represented as a Recovery Password. Losing this key means losing access to the account.
*   **SNS**: Session Name Service (SNS) allows users to register a mapping between their Account ID and a shorter, human-readable string of text.

Onion Routing and Decentralisation:
*   **Security**: Session employs onion routing via onion requests to obfuscate IP addresses, making it difficult to link accounts to specific locations. The decentralised network of nodes, incentivised by Session Tokens, reduces reliance on central servers.
*   **Usability**: This can result in slower message delivery compared to centralised systems due to the multi-hop routing. The need for up-to-date Session Node lists also adds complexity.

End-to-End Encryption:
*   **Security**: Session uses the Session Protocol for end-to-end encryption, protecting message contents from third parties.
*   **Usability**: The protocol is designed to function in decentralised networks without strong synchronisation or permanent storage, potentially causing message loss if clients are offline for extended periods.
*   **Groups vs. Communities**: Session offers groups (3-100 members) with end-to-end encryption and communities (100+ members) with transport-only encryption.
    *   The group option prioritises security but may face scaling issues with larger memberships.
    *   Communities favour usability and scalability but provide weaker server-side attack protection, messages are not stored on the Session Node network but require self-hosting.

Multi-Device Support:
*   **Security**: Session can sync messages across multiple devices by sharing the long-term private key.
*   **Usability**: While linking devices is straightforward, managing configuration messages (profile information, contact lists) requires constant updates to avoid expiration.

Client-Side Protections:
*   **Security**: Session provides message deletion controls and message requests to manage potential spam, enhancing client-side security.
*   **Usability**: These features require active user management and may not prevent all forms of spam or targeted attacks.

Perfect Forward Secrecy and Deniability:
*   **Security**: Session Protocol does not provide Perfect Forward Secrecy (PFS) in one-on-one conversations because it encrypts for the long-term public key, it also does not provide cryptographic deniability because messages are signed with the long-term private key.
*   **Usability**: Implementing PFS and deniability would add complexity and overhead, potentially affecting performance and user experience.

Attachments:
*   **Security**: Attachments are encrypted with a random symmetric AES key and stored on a centralised server.
*   **Usability**: Users rely on a centralised file server run by OPTF, but can set up their own.

Spam Prevention:
*   **Security:** Session accounts are easy to generate, making client-based Sybil attacks possible and creating the potential for spam.
*   **Usability:** Proposed protections include proof-of-work, CAPTCHA schemes, and community moderation, each balancing effectiveness against user intrusion.

The balance between security and usability in Session's design reflects a focus on robust metadata protection and decentralisation while attempting to provide a user-friendly experience.

The Session Node staking system is designed to defend against Sybil attacks by placing financial limitations on potential attackers.

Here's how the staking system achieves this:

*   **Financial Requirement:** To operate a server (Session Node) on the network and participate in message storage and routing, operators must stake a defined amount of Session Tokens, which are bound to their Session Node public key.
*   **Sybil Attack Defence:** By requiring a financial stake, the system limits attackers based on their available financial resources, making it more difficult to create a large number of malicious nodes.
*   **Market Feedback Loop:** The need to acquire Session Tokens to run Session Nodes creates a market dynamic that can increase the cost of attacks. As an attacker buys and stakes more tokens, removing them from circulation, the supply of available tokens decreases, potentially driving up the price. This creates a feedback loop where the cost of acquiring enough tokens to control a significant portion of the network increases with the scale of the attack.
*   **Economic Disincentive:** The staking system binds an attacker to their stake, meaning that if they are caught performing active attacks, the value of their stake is likely to decline as users lose trust in the protocol. Additionally, the network may slash the stake, increasing the financial cost to the attacker.

Lokinet integration is designed to resolve limitations related to Session's current use of the onion requests protocol. Lokinet is a network layer onion routing protocol, which can facilitate stream-based protocols, and offers Session several benefits:

*   **Streaming Support**: Lokinet supports stream-based protocols like QUIC. This allows clients to connect to Session Nodes and listen for events related to their Account ID or push new messages without repeatedly polling.
*   **Improved Efficiency**: By enabling stream-based connections, Lokinet resolves the limitations of Session's stateless request-response protocol, which requires specific requests for every piece of information.
*   **File Transfer**: Lokinet allows large requests containing files to be broken up into packets and streamed to the destination without any size limit. Currently, the maximum amount of data that can flow in a single request between Session Nodes is limited to 10MB.
*   **Direct Client Connections**: Lokinet support for stream-based connections extends beyond client to Session Node communication. Session could theoretically allow clients to connect directly to each other to stream data without requiring intermediary storage. This would be useful for maintaining anonymity for voice and video calls and for the transfer of large files between online clients.

The Session Node testing process serves to ensure that Session Nodes are providing services to the network in an honest and consistent manner. It is a network-level system of peer policing designed to prevent dishonest Session Nodes from refusing to store messages while still collecting rewards.

Here's a breakdown of the testing process's purpose and how it works:

*   **Reachability Testing**: Session Nodes periodically test each other to ensure they are reachable and providing service to the network. This involves attempting to establish connections to the other nodes' storage servers and Lokinet instances. If a connection is established, the node is marked as passing the test. Session Nodes also publish uptime proofs periodically, and if a node does not send an uptime proof for longer than 2 hours, it is presumed offline and is taken into account during testing.
*   **Testing Quorums**: Session Nodes participate in a process to generate pseudo-random, unpredictable data using a RANDAO-style commit reveal scheme. Using this data, nodes sort themselves into testing quorums of 10 nodes.
*   **Reporting Results**: Testing quorums collectively report their local testing results on a deterministically selected set of 50 Session Nodes. If any Session Node is reported as non-functional by more than 7 out of 10 members of the testing quorum, a jointly signed transaction is emitted by one of the nodes. This can lead to the offending node being decommissioned or deregistered from the Session Node network.
*   **Storage Behaviour Testing (Future)**: The network currently tests only the reachability of individual Session Nodes, not whether they are storing user messages. To prevent nodes from reducing storage costs by only responding to reachability tests and refusing to store user data, deeper testing of Session Node storage behaviours is planned. This would involve Node A selecting records from its database and sending a test request to Node B, containing only the record hashes. Node B would then respond with a hash proving their knowledge of the record data.
*   **Incentivising Honesty**: By rewarding nodes for honest and consistent service and penalising dishonest behaviour, the testing process aims to maintain the integrity and reliability of the Session network.

Session uniquely handles identity keys primarily to enhance user privacy and security, differing from approaches used by popular messaging applications like Signal and WhatsApp. Here's why and how Session's approach is unique:

*   **No reliance on personal identifiers**: Unlike many messaging apps that require a phone number or email address for account registration, **Session uses Ed25519 public-private key pairs as the basis for user identity**. This means users are not required to link their accounts to personally identifiable information, providing a greater degree of pseudonymity.
*   **Decentralised Identity Management**: Session does not rely on a central server to manage user accounts. This eliminates the risk of a single point of failure or control and reduces the potential for data breaches or surveillance.
*   **Account Restoration**: Because Session doesn't have a central server, account recovery is handled differently. **Users are prompted to write down their long-term private key (Recovery Password) upon account creation**, which they can use to restore their account if their device is lost or destroyed.
*   **Partitioning Identities**: Session divides the user-generated public key space into distinct groupings and maps each grouping directly to a swarm responsible for storing messages for users within that grouping. This ensures that the storage of offline messages is balanced across the network.
*   **Blinded Account IDs for Communities**: To protect users' primary Account IDs in large communities, Session employs blinded Account IDs. **Users derive a separate, blinded key pair for each community they join, preventing the exposure of their primary Account ID to the community server**. This also enables users to initiate encrypted contact with each other within the community without revealing their primary identities.

By using public-private key pairs, Session avoids the privacy and security risks associated with phone number-based identification, such as SIM swapping attacks, service provider hacking, and phone number recycling. This approach also allows users to maintain multiple pseudonymous accounts without linking them to personal information.

Metadata protection is a core design consideration for Session, aimed at minimising the exposure of user information beyond the content of messages. Session employs several strategies to achieve robust metadata protection.

Key features and design elements contributing to metadata protection in Session:

*   **Account Identity**: Session does not require users to provide a phone number, email address, or similar identifier when registering. Instead, pseudonymous public-private key pairs form the basis of an account’s identity. This reduces the potential for linking real-world identities to Session accounts. Account IDs are 66-character hexadecimal addresses, representing the user’s long-term public key.
*   **Onion Routing**: Session uses an onion routing protocol to make it difficult to link IP addresses to accounts or messages sent or received by users. This involves routing messages through a randomised path of three Session Nodes, which obfuscates the sender's and receiver's IP addresses. The first Session Node knows the IP address of the client, but not the message contents or final destination.
*   **Decentralisation**: Session relies on a decentralised network of economically incentivised nodes to perform core messaging functionality. This reduces reliance on central servers, minimising the risk of mass data collection and surveillance.
*   **Groups and Communities**: Session employs different strategies for metadata protection in groups and communities.
    *   Groups (3-100 members) use end-to-end encryption to protect message content and metadata.
    *   Communities (100+ members) use transport-only encryption and require self-hosting to protect against server-side attacks.
*   **Blinded Account IDs**: In communities, Session uses blinded Account IDs to protect users' primary Account IDs. Users derive a separate, blinded key pair for each community they join, preventing the exposure of their primary Account ID to the community server.
*   **Message Requests**: Session implements message requests to shield users from potential spam by sorting messages from unknown contacts into a separate folder. This allows users to decide whether to accept or deny further messages from the user.
*   **Session Name Service (SNS)**: SNS allows users to register a mapping between their Account ID and a shorter, human-readable string of text. This enhances usability while maintaining security and privacy.
*   **Scraping Protection**: Session implements measures to prevent the scraping of messages from swarms. This includes requiring authentication from users who request messages and using blinded Account IDs in communities.

While Session aims to provide robust metadata protection, some limitations and trade-offs exist:

*   **Traffic Analysis**: Session's onion routing protocol is susceptible to traffic analysis attacks if both ends of a connection are monitored by a co-opted ISP. Solutions such as mix networks are being considered to mitigate this risk.
*   **Global Passive Adversary**: A global passive adversary that can monitor the first and last hops in an onion request path could use traffic analysis to reveal the IP address of a Session client and the destination node that client is talking to.
*   **Community Servers**: Session Communities do not store messages on the Session Node network, instead, communities require self-hosting using open-source software. Session Community Servers may have several rooms, each room displays as a separate conversation in the Session client.
*   **Namespaces:** Clients are able to send several different types of Session messages, including visible messages and configuration messages. To account for this, Session sorts messages into a limited number of types using logically separated inboxes called “namespaces".

Session's metadata protection strategy reflects a balance between security, usability, and performance. By minimising the collection and exposure of metadata, Session aims to provide a more private and secure messaging experience for its users.

Message scraping in Session groups is prevented through a combination of authentication and access control mechanisms.

Key strategies:
*   **Authentication for all requests:** Individual Session Nodes in each swarm require authentication from users who request messages.
*   **Group identity public key:** Session Nodes storing messages for a group have visibility of the long-term group identity public key. This means Session Nodes can only validate requests for the group when they are signed under the group identity private key, which is only given to group administrators.
*   **Administrator Signatures:** Group administrators sign every request to the Session Node network under the group identity private key. Session Nodes then validate these signatures.
*   **Authentication for unprivileged members:** Unprivileged members of a group require a different method of authentication.
    *   When a new member of the group is added by an administrator, the administrator will generate a pair of values: a token and a signature. The token contains a blinding factor, permission flags, and a network prefix.
    *   A blinded public key is generated by the administrator. The administrator signs over the token with the group identity private key and will then send the signature and token to the new member of the group.
    *   Upon receiving these credentials, the new member calculates their corresponding blinded private key.
    *   To fetch group messages, the member sends a request to a Session Node within the group’s swarm. This request will contain a signature from the blinded private key, the previously provided token, and the administrator’s signature over that token from the group identity private key.
    *   The Session Node verifies the administrator’s signature of the provided token using the group identity public key.
    *   Subsequent to this verification, the Session Node confirms the member’s signature under the blinded public key.
*   **Revocation List**: When a member is kicked or leaves, a group administrator will add the removed members’ blinded public key to a revocation list which consists of the keys of the last 50 members who have been kicked or left the group. This key revocation list is stored unencrypted in the swarm such that the Session Nodes can read revoked tokens. When Session Nodes validate requests, they refuse requests signed with a revoked token.

To deploy and manage a Session Open Group Server (SOGS), here are the key steps and considerations, as detailed in the sources:

*   **Find a Suitable Server**. The simplest method is to lease a Virtual Private Server (VPS). You can run a SOGS from home, but consider most consumer internet connections have poor upstream bandwidth and may not provide a static IP address. Outages can also affect the ability for users to chat in your group.
    *   Some popular VPS options include Vultr, Hetzner, DigitalOcean, Linode, and Amazon Lightsail.
    *   Resource requirements depend on the number of users and frequency of usage. A good starting point is 1 virtual core, 512 MB of RAM, and 20GB of HDD space.
    *   Once signed up with a provider, you should receive a static IP address.
*   **Prepare the Server**. You will need to SSH into your server.
*   **Add the Oxen apt Repository**. This is done by running the following commands:
    *   `sudo curl -so /etc/apt/trusted.gpg.d/oxen.gpg https://deb.oxen.io/pub.gpg`
    *   `echo "deb https://deb.oxen.io $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/oxen.list`
    *   `sudo apt update`
*   **Install SOGS**. You can choose between the `sogs-standalone` package or the `sogs-proxied` package.
    *   `sogs-standalone`: Installs a SOGS that listens on a public IP/port for HTTP connections. It does not support HTTPS connections, but since all messages to/from SOGS are separately encrypted, HTTPS is not necessary nor recommended.
    *   `sogs-proxied`: SOGS listens on an internal port and expects requests to be proxied to it from an Nginx or Apache2 front-end server that listens on the public IP/port. The package will install basic site configuration files for either Nginx or Apache2, but extra configuration may be necessary.
    *   If you want your SOGS to be reached over HTTPS, the proxied package is required.
    *   If you don't know what any of this means then stick with the `sogs-standalone` package.
    *   `sudo apt install sogs-standalone` OR `sudo apt install sogs-proxied`
    *   If installing the standalone version you will see a prompt, asking you to enter a URL or IP address, if you have not setup DNS to point towards the IP address of your VPS then you should enter your VPS Public IP address, which can usually be found on your VPS provider's website.
*   **Add a Room**. To add a room, run:
    *   `sogs --add-room TOKEN --name "NAME" --description "DESCRIPTION"`
    *   Replace `TOKEN` with the address to use in the room URL (which must consist of **ONLY** lowercase letters, numbers, underscores, or dashes), replace `NAME` with the room name to display in Session and optionally replace `DESCRIPTION` with a short description of the topic of the room.
    *   For example: `sogs --add-room fish --name "Fishing" --description "Australian fisheries chat"`
*   **Make Yourself an Administrator**.
    *   Make yourself a global administrator for all rooms hosted on your SOGS by running the following: `sogs --rooms + --add-moderators ACCOUNTID --admin --visible`
    *   Replace `SESSIONID` with the Account ID you want to be an administrator.
    *   For **example**: `sogs --rooms + --add-moderators 05d871fc80ca007eed9b2f4df72853e2a2d5465a92fcb1889fb5c84aa2833b3b40 --admin --visible`
*   **Join Your SOGS**.
    *   Once setup, you should be able to navigate to your VPS's IP address in a web browser, for example `http://116.203.70.33/`.
    *   Clicking on a room will display a QR code and the link required to join the room, this link can be copied and pasted into a Session client to join a group.
*   **Upgrading SOGS**. SOGS is configured as a Debian package, it will be updated when you update and upgrade other packages on your system. You can trigger this process by running the following commands:
    *   `sudo apt update`
    *   `sudo apt upgrade`
*   **Note that**: Session open group servers provide transit encryption, but open group messages are not encrypted while stored on the server; **closed groups** (which can be created within Session itself) are a better solution for high-security communications with groups of 100 or less people.

If you're having trouble setting up your SOGS, it is recommended to open an issue on the Session open group server GitHub repository.

Session employs different designs for group encryption, depending on the size and intended use of the group. The two main types are Groups (3-100 members) and Communities (100+ members).

**Groups (3-100 Members)**
*   **Initialisation**: The group creator selects members and generates a **group identity key pair**, a **group encryption symmetric key**, and **authentication values** for each invited member.
    *   The group identity key pair identifies the shared swarm and authenticates administrator actions.
    *   The group encryption symmetric key encrypts and decrypts messages.
    *   Authentication values are for non-administrator members to authenticate message sending and retrieval.
*   **Encryption and Distribution**: The creator encrypts the group encryption symmetric key with each member's Account ID, creating an array of encrypted payloads stored in the group's dedicated swarm. Group invite messages are sent to each member, including the group's name, group identity public key, a digital signature, and member-specific authentication values.
*   **Joining the Group**: Members use the group identity public key to determine the swarm storing group messages. They authenticate to a Session Node using their authentication values and retrieve the encrypted payloads, decrypting the group encryption symmetric key.
*   **Message Transmission**: Onion requests are used for transmitting messages to and from the shared swarm.
*   **Group Administration**: The group creator is the first administrator and can add more administrators by sharing the group identity private key. Administrators can remove members, delete messages, and delete the group. Members can read, write, and delete their own messages, and leave the group.
*   **Encryption**: Users encrypt and decrypt messages using the group encryption symmetric key with the XChaCha20-Poly1305 algorithm.
*   **Key Rotation**: To prevent former members from accessing future messages, the group encryption symmetric key is rotated when a member leaves or is removed. The administrator generates and distributes a new symmetric encryption key to the remaining members. Conflicting updates are resolved by administrator devices using sequence numbers and hashing to prevent loops.

**Communities (100+ Members)**
*   **Scaling Issues**: Large groups face scaling issues with key updates when members leave.
*   **Encryption**: Communities use **transport-only encryption**, which protects against network adversaries but offers weaker protection against server-side attacks.
*   **Message Storage**: Session Communities **do not store messages on the Session Node network**. They require self-hosting using open-source software.
*   **Message Handling**: Messages and attachments are fetched and posted using onion requests, forwarding to the Session Community Server's IP address or domain name, preserving network-layer anonymity.
*   **Rooms**: Session Community Servers may have multiple rooms, each displayed as a separate conversation in the Session client.
*   **Administration**: The server operator is the original administrator and can add more administrators and moderators. Administrators can modify permissions and delete messages.
*   **Encryption and Authentication**: Encryption uses the Session Protocol, targeting the Session Community Server public key. Authentication uses a deterministic derived key to prevent leaking the user's real Account ID.
*   **Blinded Account IDs**: Users derive blinded Account IDs by hashing their Account ID with the Session Community Server public key and generating a derived key pair. Messages are signed using the blinded private key.
*   **Message Requests**: Users can encrypt message requests for a recipient’s blinded public key, sending them to the Session Community Server. The server relays the request, allowing rate limiting and spam prevention.

To configure Mumble to use Lokinet, these steps can be followed:

1.  **Rent a Virtual Private Server (VPS)**: Choose a VPS hosting service and select Ubuntu 22.04 or Debian 11 as the operating system. A VPS with at least 512MB RAM should suffice.

2.  **Prepare the VPS**:
    *   Open a command prompt (Terminal on macOS, any command prompt on Linux, or PowerShell on Windows 10).
    *   Establish an SSH connection to the VPS using the command: `ssh root@[VPS IP address]`, replacing `[VPS IP address]` with the actual IP of the VPS.
    *   Update package lists: `sudo apt update`.
    *   Upgrade outdated packages: `sudo apt upgrade`.
    *   Ensure `curl` is installed: `which curl`. If it returns an error, install it using: `sudo apt install curl`.

3.  **Install Lokinet**:
    *   Add the Lokinet repository by installing the public key: `sudo curl -so /etc/apt/trusted.gpg.d/oxen.gpg https://deb.oxen.io/pub.gpg`.
    *   Tell `apt` where to find Lokinet packages: `echo "deb https://deb.oxen.io $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/oxen.list`.
    *   Update repository package lists again: `sudo apt update`.
    *   Install Lokinet: `sudo apt install lokinet`.

4.  **Install the Mumble Server**: Run the command: `sudo apt install mumble-server`.

5.  **Set up a Persistent Keyfile**:
    *   Open the `lokinet.ini` file: `sudo nano /etc/loki/lokinet.ini`.
    *   Navigate to the `[network]` section and remove the `#` from the `keyfile=` line.
    *   Add `/var/lib/lokinet/mumble.private` after the `=` symbol.
    *   Save and exit the file (Ctrl+X, then “Y”, then Enter).
    *   Restart Lokinet: `sudo systemctl restart lokinet`.

6.  **Bind the Mumble Server to Lokinet**:
    *   Get the IP address needed to bind Mumble to: `dig @127.3.2.1 +short localhost.loki`. Copy the IP address (a number in the format xxx.xx(x).x.x).
    *   Open the Mumble server configuration file: `nano /etc/mumble-server.ini`.
    *   Navigate to the line `;host=` under the section *Specific IP or hostname to bind to*. Delete the `;` and paste the copied IP address after the `=` symbol.
    *   Save and exit the file (Ctrl+X, then “Y”, then Enter).
    *   Restart the Mumble server to apply changes: `systemctl restart mumble-server`.

7.  **Obtain the Lokinet Address**: Run `dig @127.3.2.1 +short localhost.loki` and note the long string of characters ending in `.loki`. This is the Lokinet address of the Mumble server. Share this address with those who need to connect to the server. They can paste it into the Address field of the Add Server dialog in the Mumble client.

Anyone connecting to the Mumble server will also need to have Lokinet installed and running. Lokinet can be downloaded from [https://lokinet.org/](https://lokinet.org/).


Onion routing is a key component of Lokinet and Session, designed to enhance privacy and security by obscuring the origin and destination of network traffic.

**Lokinet:**
*   Websites and services running on Lokinet are called SNApps.
*   Lokinet addresses can be converted into human-readable domain names.

**Session:**
*   **IP Address Obfuscation:** Onion routing, via **onion requests**, helps Session clients hide their IP addresses by creating a randomised 3-hop path through the Session Node network.
*   **Anonymity:** It makes it difficult to link IP addresses to accounts or messages.
*   **Onion Requests:** Session uses an onion routing protocol referred to as onion requests, enabling Session clients to obfuscate their IP address.
*   **Three-Hop Path:** Onion requests use a simple onion routing protocol which successively encrypts each request for each of the three hops.
*   **Node Roles:**
    *   The first Session Node only knows the IP address of the client and the middle Session Node.
    *   The middle Session Node only knows the first and last Session Nodes but not the client or destination.
    *   The last Session Node only knows the middle Session Node and the destination IP address.
*   **Path Creation:** On startup, a Session client forms a 'path' using three random Session Nodes from their node list.
*   **Encryption:** Clients encrypt each layer of the 'onion' using the respective Ed25519 public keys of the three selected Session Nodes.
*   **Payload Encryption:** Each onion request contains a payload, which is end-to-end encrypted for the destination. The Session client generates an ephemeral X25519 key pair to encrypt the payload using either AES or XChaCha20-Poly1305 algorithm.
*   **Stateless Protocol:** The onion requests protocol is designed as a stateless request response protocol.
*   **Limitations:** The onion requests protocol is designed as a stateless request response protocol, meaning specific requests must be constructed for every piece of information the Session client requires or provides. The Session client must retrieve all information using polling, which is inefficient and slow. It places requirements to limit the maximum amount of data that can flow in a single request between Session Nodes to ensure memory is not clogged while Session Nodes handle a request, currently set at 10MB.

**Traffic Analysis:**
*   Onion routing networks are susceptible to traffic analysis attacks because of their reliance on the internet.
*   If both ends of an onion request connection between Alice and Bob are monitored by a co-opted ISP, then a path between the two can be discovered by inspecting Alice’s outgoing encrypted packets, and correlating those with Bob’s incoming encrypted packets.
*   Even if packets are padded to be a constant size, Alice’s ISP could introduce a delay (or drop packets) and, with the help of Bob’s ISP, watch as the delay or packet loss propagates into Bob’s connection.

**Mitigation:**
*   **Mixnets:** The deployment of an internal mixnet on top of the existing Session Node network would make traffic analysis difficult, as network adversaries are required to track batched messages.
*   **Padding and Encryption:** Local network adversaries, such as dishonest ISPs, are typically thwarted by padding messages and encrypting connections between hops.
*   **Decoy Messages:** Timing attacks can be defeated using special decoy messages which loop back to the sender, acting as cover traffic.

Session's design addresses threats related to metadata collection and aims to provide secure messaging with minimal exposure of user information. The threat model considers attackers with varying levels of resources and capabilities, and the design incorporates protections against both passive and active attacks.

The key aspects of the threat model that Session's design addresses are:
*   **Session Node Operators** Session considers that attackers may control a fraction of the Session Node network. Dishonest Session Node operators could perform passive attacks such as reading message headers, logging message relay or receipt timestamps, saving the encrypted contents of messages, or recording the sizes of messages. Active attacks could include failing to relay messages, failing to store messages, providing clients with modified messages, or refusing to respond to requests for messages belonging to specific Account IDs.
*   **Network Adversaries** Session's design also considers local network adversaries such as Internet Service Providers (ISPs) or local network providers. These adversaries can perform passive attacks such as monitoring traffic, conducting deep packet inspection, or saving relayed packets for later inspection.

Session aims to provide the following protections against attackers within the scope of the threat model:
*   **Sender Anonymity**: A sender's Account ID (public key) cannot be linked to specific messages they send, except by the intended recipient. The IP address of the sender is unknown to all parties except the first node in the onion requests path.
*   **Recipient Anonymity**: The IP address of the recipient is unknown to all parties except the first node in the onion requests path.
*   **Data Integrity**: Messages are received intact and unmodified, and if messages are modified this can be detected.
*   **Storage**: Messages are stored and available until their specified expiry time.
*   **End-To-End Encryption**: All messages are encrypted only for the intended recipient(s) of a conversation.

However, Session's threat model does not cover all possible attacks.
*   **Active Attacks** A network adversary could conduct active attacks including corrupting or rerouting packets, or adding delays for the purpose of denying service or correlating traffic.
*   **Global Passive Adversary** A global passive adversary (GPA) that can monitor the first and last hops in an onion request path could use traffic analysis to reveal the IP address of a Session client and the destination node that client is talking to.
*   **Out of Band Key Discovery** Users may compromise the pseudonymity provided by Session's public key-based account system if a user associates their real world identity with their Account ID.

To mitigate these threats, Session employs various techniques:
*   **Onion Routing**: Session uses onion requests to obfuscate IP addresses and prevent direct linking of accounts to messages.
*   **Decentralised Network**: By using a decentralised network of incentivised nodes, Session avoids reliance on central servers, reducing the risk of data collection and single points of failure.
*   **No Phone Numbers**: Session avoids the privacy risks associated with phone number-based identification.
*   **Traffic Analysis Mitigation**: Session implements padding, encryption, and mixnets to defend against traffic analysis.

## Further Reading


- [Session Open Group Server Setup](https://docs.oxen.io/oxen-docs/products-built-on-oxen/session/guides/open-group-setup)
- [Run a secure Mumble server over Lokinet](https://docs.oxen.io/oxen-docs/products-built-on-oxen/lokinet/guides/secure-mumble-server-over-lokinet)
- [Oxen Name Service for Session](https://docs.oxen.io/oxen-docs/products-built-on-oxen/session/loki-name-system-for-session)
- [Message Routing](https://docs.oxen.io/oxen-docs/products-built-on-oxen/session/message-routing)
- [Session: End-To-End Encrypted Conversations With Minimal Metadata Leakage](https://arxiv.org/pdf/2002.04609)
