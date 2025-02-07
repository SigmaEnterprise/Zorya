+++
title = "Nostr-Identity Blossom-Storage Lightning-Payments"
menu = "Blog"
date = "2025-02-06"
+++


Blossom is a specification for a set of HTTP endpoints that allows users to store blobs of data on publicly accessible servers. Blobs are packs of binary data addressed by their SHA256 hash. **Blossom aims to solve the problem of censorship and ensure data integrity when storing and serving media**.

Here's how Blossom addresses these issues:
*   **Censorship Resistance:** Unlike traditional media servers, which can take down or censor content, Blossom ensures that once a file is uploaded and its hash is available, it can be re-uploaded by anyone, making it difficult to remove the content from the network.
*   **Data Integrity:** Media servers often transcode or modify uploaded files. Blossom requires servers to serve the original file without any changes. This allows clients to verify the downloaded blob against its SHA256 hash, ensuring the integrity and authenticity of the content. This prevents malicious actors from substituting content, for example, swapping a video with one that has been slightly altered.
*   **Decentralized File Serving:** By using hashes to identify files, Blossom allows content to be retrieved from multiple servers without relying on any single point of control. If a file is deleted from one server, users can re-upload it to a different server, and clients can find the file using its hash.
*   **Simplified Media Serving:**  Blossom's protocol includes standard endpoints for uploading, retrieving, and managing blobs. The protocol also allows for the posting of file metadata events on Noster, which includes the hash. This makes it easier for apps to integrate with a variety of compatible servers.
*   **Link Rot Prevention:** Blossom helps prevent link rot, because even if a file is deleted from one server, users can re-upload it elsewhere. All clients still will be able to find it using the file's hash.

Blossom servers expose a few endpoints for managing blobs:
*   `GET /<sha256>` (optional file .ext) - retrieves a blob
*   `HEAD /<sha256>` (optional file .ext) - retrieves the header for a blob
*   `PUT /upload` - uploads a blob, requires authentication, and returns a blob descriptor
*    `HEAD /upload` - retrieves the header for a blob upload
*    `GET /list/<pubkey>` - returns an array of blob descriptors, optionally requires authentication
*   `DELETE /<sha256>` - deletes a blob, requires authentication
*   `PUT /mirror` - mirrors a blob, requires authentication
*   `PUT /media` - optimizes media, requires authentication
*  `HEAD /media` - retrieves the header for a media optimization
*  `PUT /report` - reports a blob

Blossom uses Nostr public/private keys for identities. Users are expected to sign authorization events to prove their identity when interacting with servers.

The Blossom protocol is specified in a series of "Blossom Upgrade Documents" (BUDs).

The protocol includes various event kinds:
*   24242: Authorization event
*   110063: User Server List

**Blossom aims to provide a censorship-resistant and reliable way to store and serve media, using hashes for addressing and verification, and encouraging a decentralized ecosystem of servers**.
Blossom uses Nostr public and private keys for identities. Users are expected to sign authorization events to prove their identity when interacting with servers.

Here's how Blossom's use of Nostr impacts its functionality and security:

*   **Authentication:** Blossom uses signed Nostr events for authentication when interacting with servers. This means that users prove their identity using their Nostr keys when uploading, managing or mirroring blobs on Blossom servers.
*   **Authorization:** Blossom uses a specific Nostr event kind (24242) for authorization. This allows servers to verify the user's identity and permissions.
*   **Blob Management:** Blossom servers expose endpoints for managing blobs, including upload, retrieval, and deletion. These actions are authenticated using signed Nostr events, ensuring only authorised users can modify their data.
*   **Censorship Resistance:**  By using hashes to address blobs and verifying the integrity of the data, Blossom offers a degree of **censorship resistance**. If a server takes down a file, it can be re-uploaded to another server and the hash allows users to retrieve the file from the new location.
*   **Integrity:** Blossom uses the sha256 hash of a file as its address. When a client retrieves a blob, it can verify that the binary data matches the hash, ensuring the file has not been tampered with.
*   **Metadata:** Blossom uses Nostr to provide a **decentralized metadata exchange**. Blossom clients can query Nostr relays to find out where a file with a specific hash is hosted.  A file metadata event includes the hash, which can be used to locate the file.
*   **Mirroring:** Blossom allows users to mirror blobs on multiple servers. This is also authenticated using signed Nostr events.
*  **Decentralized File Serving**: Blossom is a protocol designed to allow for decentralised file serving. The use of Nostr allows files to be addressed by their hashes, and these files can be served without modification. This means clients can verify the binary data against the hash, and anyone can download and re-upload files, making the system more censorship-resistant.
*  **Nostr as an Addressing Layer**: Noster can be used as an addressing layer by mapping an npub to an IP address. A service can write its IP address in its profile and be discoverable without DNS, and Noster can be used to send encrypted messages to services without a clear net IP address.

Blossom's use of Nostr provides a decentralized and secure way to store and share data. The use of Nostr keys for authentication, coupled with the use of content hashes, provides integrity and censorship resistance.

The Blossom system is designed for storing blobs of data on publicly accessible servers, using **Nostr public/private keys for identities**. Users sign authorization events to prove their identity when interacting with servers.

Key architectural components and concepts of the Blossom system include:

*   **Blobs:** These are packs of **binary data** addressed by their **SHA256 hash**.
*   **HTTP Endpoints:** Blossom servers expose specific HTTP endpoints for managing blobs. These endpoints include:
    *   `GET /<sha256>`: Retrieves a blob.
    *   `HEAD /<sha256>`: Retrieves the headers for a blob.
    *    `PUT /upload`: Uploads a blob, requiring a signed Nostr event for authentication.
    *    `HEAD /upload`: Retrieves the headers for upload requirements.
    *   `GET /list/<pubkey>`: Returns an array of blob descriptors and has optional authentication with a signed Nostr event.
    *   `DELETE /<sha256>`: Deletes a blob, requiring a signed Nostr event for authentication.
    *   `PUT /mirror`: Mirrors a blob to another server and requires a signed Nostr event.
   *    `PUT /media`: Handles media optimization and requires a signed Nostr event.
    *   `HEAD /media`: Retrieves headers for media endpoints.
     *   `PUT /report`: Reports a blob and requires a signed Nostr event.
*   **Blossom Upgrade Documents (BUDs):** These documents provide detailed explanations of the endpoints. Some of the BUDs include:
    *   **BUD-01:** Server requirements and blob retrieval.
    *   **BUD-02:** Blob upload and management.
    *  **BUD-03:** User Server List.
    *  **BUD-04:** Mirroring blobs.
    *   **BUD-05:** Media optimization.
    *   **BUD-06:** Upload requirements.
     *  **BUD-08:** Nostr File Metadata Tags.
    *   **BUD-09:** Blob Report.
*   **Nostr Integration:** Blossom uses Nostr for identities and authorization, requiring signed Nostr events for server interactions.
*   **Event Kinds:** Specific event kinds are used, such as:
    *   **24242:** Authorization event.
    *   **10063:** User Server List.
*   **Censorship Resistance:** By addressing files with their hashes, Blossom allows users to verify that the content served matches the original, helping to create a more censorship-resistant system. If a file is taken down on one server, it can be re-uploaded and discovered through its hash on Nostr, making it more resilient to censorship.
*   **Non-custodial file serving**: The system is designed so that users can verify the files that they download are exactly what the uploader intended, making it non-custodial.
*   **Link rot prevention**: By using content addressing with hashes, Blossom has the potential to make links to files more resilient.

The Blossom protocol's design is intended to allow for the decentralisation of file serving, particularly for media files, such as video.

Here is a comprehensive list of resources and links related to the topics discussed, drawing from the provided sources and our conversation:

*   **nc.app:** This is a **self-custodial Noster signing service** that stores keys within the browser and uses a service worker for background tasks. It aims to make key management more accessible to Noster users.
    *   The code for nc.app is open source.
    *   nc.app uses the **Noster connect protocol**.
*   **Noster connect:** This protocol enables apps to connect to user keys for signing and authentication.
    *   It's implemented in apps like **nsec bunker**, **Amber**, and **Gossip client**.
    *   Noster connect offers a versatile approach to key management, avoiding the need for browser extensions and supporting multiple keys and non-interactive use cases.
*   **Noster login:** This is a client-side library to simplify the integration of Noster connect into applications.
    *   It provides a user interface (UI) component for handling Noster logins.
    *   It includes options for different login methods such as pasting nsec, using extensions or Noster Connect.
    *   It enables apps to request specific permissions for key access.
    *   A helper page for implementing Noster login on apps and websites is available at **Noster login.org**.
*   **Nostr:** This is a protocol for building non-custodial and decentralised apps, providing services similar to cloud-based ones.
    *   Nostr aims for online freedom by allowing users to run open-source software on their own hardware without relying on central third parties.
    *   Nostr can act as an identity layer for signing into apps or websites.
    *   It allows for account creation without captchas or KYC.
*   **Blossom:** This is a specification for HTTP endpoints for storing binary data (blobs) on publicly accessible servers.
    *   Blobs are addressed by their **SHA256 hash**, ensuring content integrity.
    *   Blossom uses **Nostr public/private keys for identities**, and users sign authorization events to prove identity.
     *  Blossom aims to solve censorship issues and ensure data integrity by requiring servers to serve the original files without modification.
    *   The **GitHub repository** for Blossom can be found at **hzrd149/blossom**.
    *   The Blossom protocol is detailed in a series of "Blossom Upgrade Documents" (BUDs).
    *  There is discussion of Blossom by haardt and Steward on the **Citadel Dispatch** podcast.
*   **NIP-96:** This protocol specifies the standard for a media server.
    *   Blossom builds on NIP-96 by adding decentralised properties.
*  **Decentralised Addressing:** There are efforts to use Noster to map npubs to IP addresses.
   * This approach allows services to be discovered without relying on DNS and enables services to be hosted without clear net IP addresses.
*   **Open Source Development:** Open-source development in the Noster ecosystem focuses on practical contributions.
    *   Developers are encouraged to build projects, create pull requests and file issues.
    *  This work is collaborative, with developers sharing and improving each other's code.
    *   Open-source is seen as a positive force, enabling easy remixing and reuse of code.
    *   Many interactions between developers take place on **GitHub**.
*   **Other Relevant Apps:**
    *   **Amber:** An Android app that supports the Noster connect protocol.
    *   **Gossip client:** A desktop app that supports Noster connect.
    *   **Highlighter:** A service that used to work with insc bunker but now works with nc.app.
    *   **Noster nests:** A new app by Kieran and Derek that uses Noster connect.
*   **Various Noster Apps:** There are a number of Noster apps that support Noster connect:
    *   Coracle
    *   Snort
    *   zap stream
    *   Noster band
    *   Nostr nests
    *   Noster wine
    *   Wikia FREEDIA
    *   Highlighter


1. **Blossom Protocol Overview**:  
   - Blossom aims to provide a censorship-resistant way to store and serve media files using SHA256 hashes.  
   - [GitHub Repository for Blossom](https://github.com/hzrd149/blossom)  
   - Blossom Upgrade Documents (BUDs):  
     * BUD-01: Server requirements and blob retrieval.  
     * BUD-02: Blob upload and management.  
     * BUD-03: User Server List.  
     * BUD-04: Mirroring blobs.  
     * BUD-05: Media optimization.  
     * BUD-06: Upload requirements.  
     * BUD-08: Nostr File Metadata Tags.  
     * BUD-09: Blob Report.

2. **Nostr Protocol**:  
   - The Nostr protocol serves as the foundation for identities, authentication, and event signing within Blossom.  
   - [Nostr Overview](https://nostr-nips.com/)  
   - **Nostr connect**: A protocol enabling apps to connect to user keys for signing and authentication.  
     * [Notedeck](https://damus.io/notedeck/)  
     * Apps using Nostr Connect: **nsec bunker**, **Amber**, **Gossip client**.

3. **Authentication and Authorization via Nostr**:  
   - Blossom uses Nostr public/private keys for identity verification.  
   - Signed Nostr events are used for **authentication** and **authorization**.
   - Event kinds:  
     * **24242**: Authorization event.  
     * **10063**: User Server List.

4. **Decentralized File Serving**:  
   - **SHA256-based addressing** for data integrity and decentralization.  
   - **Link Rot Prevention**: Re-upload files elsewhere if deleted from one server.  
   - **Censorship Resistance**: Allows files to be re-uploaded if taken down.  
   - **Mirroring**: Re-upload and mirror blobs across servers.

5. **Blossom’s Use of Nostr for Metadata Exchange**:  
   - Nostr is used for decentralized metadata management, allowing clients to discover where a file is hosted based on its hash.  
   - [Nostr Relay Explorer](https://nostr.watch/)

6. **Nostr Identity and Event Signing**:  
   - **Nostr Login**: A client-side library for integrating Nostr into applications, handling user authentication and signing.  
   - [Noster Login Docs](https://docs.nwc.dev/)  
   - **Nostr Profile**: How users can authenticate and prove ownership of blobs via Nostr keys.

7. **Decentralized Addressing & IP Mapping**:  
   - **Nostr as an Addressing Layer**: Mapping npub to an IP address for decentralized service discovery.  
   - Allows services to be hosted without clear net IP addresses.  
   - [PKARR](https://github.com/pubky/pkarr)

8. **Relevant Applications**:
   - **Amber**: Android app supporting Noster connect.  
     * [Amber App](https://github.com/greenart7c3/Amber)  
   - **Gossip Client**: Desktop app for Noster.  
     * [Gossip Client GitHub](https://github.com/mikedilger/gossip)  
   - **nsec bunker**: Key management service for Noster.  
     * [nsec bunker GitHub](https://github.com/kind-0/nsecbunkerd)  
   - **Highlighter**: A service working with **nc.app** for Noster interaction.  
     * [Highlighter](https://highlighter.com/)

9. **Other Noster Projects**:
   - **Coracle**, **Snort**, **Zap Stream**, **Nostr Band**, **Wikia FREEDIA**, **Noster Wine**, **Nostr Nests**, **Zap Stream**.  
   - [Noster Apps Overview](https://nostrapps.com/)

10. **General Reading**:  
    - [NIP-96 (Media Server Standard)](https://nips.nostr.com/96)  
    - [Blossom Censorship Resistance and Data Integrity Concepts](https://www.nobsbitcoin.com/blossom-intro/)  

