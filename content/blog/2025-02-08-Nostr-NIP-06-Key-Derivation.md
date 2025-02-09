+++
title = "Nostr NIP-06 Key Derivation - Crafting QR's and Seed Plates From Nostr Mnemonic Seed"
menu = "Blog"
date = "2025-02-08"
+++

Nostr key generation involves the use of a mnemonic seed phrase, which is then used to derive private and public keys.

*   **Mnemonic Seed Phrase:**  The process starts with a mnemonic seed phrase, which is a sequence of words. The source mentions that BIP39 is used to generate these mnemonic seed words and then derive a binary seed from them. The tool `nip06-cli` can generate a random mnemonic.
*   **Derivation Path:** The binary seed is then used to derive keys using a specific derivation path. The path used is `m/44'/1237'/<account>'/0/0`, according to the Nostr entry on SLIP44. BIP32 is used for this derivation.
    *   A basic client may use an `account` value of `0` to derive a single key.
    *   More advanced clients can increment the `account` value to generate multiple keys. This allows for "practically infinite keys" from the 5-level path.
*   **Private and Public Keys:** From this derivation process, both a private key and a corresponding public key are generated.
*   **Key Formats:** These keys are represented in various formats:
    *   **Private key (hex):** The private key is represented as a hexadecimal string.
    *   **nsec:** The private key is also represented in an `nsec` format.
    *   **Public key (hex):** The public key is represented as a hexadecimal string.
    *   **npub:** The public key is also represented in an `npub` format.

The `nip06-cli` tool can be used to generate a random mnemonic and restore an existing one. The tool also allows for exploring formats for saving keys, like `enc` or `JSON`, and encrypting backups. Additionally, keys can be printed as a QR code or etched onto metal for backup.

The sources include two examples of mnemonic phrases, their derived private and public keys (in hex, `nsec`, and `npub` formats).

Key restoration in the context of Nostr involves using a previously generated mnemonic seed phrase to recover the corresponding private and public keys. Here's how it works, based on the sources:

*   **Mnemonic Input:** The process begins with an existing mnemonic seed phrase. This phrase is a sequence of words, generated using BIP39.

*  **Restoring with `nip06-cli`**: The `nip06-cli` tool offers a "restore" command that allows you to input an existing mnemonic seed phrase. This tool can be used to restore keys from the mnemonic phrase.

*   **Key Derivation:** Once the mnemonic is input into the tool, the tool uses the same derivation path as key generation (`m/44'/1237'/<account>'/0/0` according to SLIP44) and the BIP32 standard to re-derive the binary seed, private key and public key.

*   **Key Output:** The tool outputs the private and public keys in the same formats as during key generation:
    *   **Private key (hex):** Represented as a hexadecimal string.
    *   **nsec:** The private key in `nsec` format.
    *   **Public key (hex):** Represented as a hexadecimal string.
    *   **npub:** The public key in `npub` format.
*   **Backups:** The sources suggest that mnemonic seed phrases should be backed up, and recommend exploring formats like `enc` or `JSON` and the possibility of encrypting backups. They also suggest printing them as QR codes or etching the mnemonic onto metal.

In essence, key restoration is the reverse process of key generation, and allows you to regain access to your Nostr account using your **backed-up mnemonic seed phrase**. The `nip06-cli` tool facilitates this process.

Key backup is a crucial aspect of managing Nostr keys, and the sources provide several methods and considerations for this process. Here's a breakdown of key backup strategies:

*   **Exploring Formats for Saving Keys:** It's important to consider different formats for saving keys, such as the `enc` or `JSON` formats, and to explore encrypting backups. This allows you to store keys in a way that is both convenient and secure.
*  **Printing as QR Code:** Keys can be printed as a **QR code**, which allows for easy scanning and importing of keys into various Nostr clients.
*   **Etching Mnemonic onto Metal:** For long-term and secure backup, the **mnemonic phrase can be etched onto metal**. This provides a durable backup that is resistant to physical damage.
*  **Mnemonic Seed Phrase is Key:** The mnemonic seed phrase is the starting point for key generation, and it is the key to recovery. It should be backed up carefully and securely.
* **`nip06-cli` Tool**: The `nip06-cli` tool can be used to generate and restore a mnemonic, and thus can also be part of a key backup and restoration strategy.
*   **Encryption:** The sources emphasize encrypting backups, especially when storing them in digital formats.
*   **Secure Storage:** The overall strategy for key backup should focus on secure storage to prevent unauthorized access to your keys.

These backup methods ensure that users can recover their keys if they are lost, damaged, or inaccessible, emphasizing the importance of a robust backup strategy for Nostr key management.

Nostr keys are represented in several formats, each serving a different purpose or audience. Here's a breakdown of the key formats mentioned in the sources:

*   **Mnemonic Seed Phrase:** This is a sequence of words generated using the BIP39 standard. It is the most human-readable representation of a key and is used for both key generation and restoration. The sources provide two examples of mnemonic phrases:
    *   "leader monkey parrot ring guide accident before fence cannon height naive bean"
    *  "what bleak badge arrange retreat wolf trade produce cricket blur garlic valid proud rude strong choose busy staff weather area salt hollow arm fade"

*   **Private Key (hex):** The private key is represented as a hexadecimal string. This is a machine-readable format, directly derived from the mnemonic seed, that should be kept secret. The sources provide two examples:
    *   `7f7ff03d123792d6ac594bfa67bf6d0c0ab55b6b1fdb6249303fe861f1ccba9a`
    *   `c15d739894c81a2fcfd3a2df85a0d2c0dbc47a280d092799f144d73d7ae78add`

*   **nsec:** This is another format for representing the private key. It's a string that encodes the private key and has a specific prefix (`nsec`). Like the hexadecimal private key, this format should be kept secret. The sources provide two examples:
    *   `nsec10allq0gjx7fddtzef0ax00mdps9t2kmtrldkyjfs8l5xruwvh2dq0lhhkp`
    *   `nsec1c9wh8xy5eqdzln7n5t0ctgxjcrdug73gp5yj0x03gntn67h83twssdfhel`

*   **Public Key (hex):** The public key, also derived from the mnemonic seed, is also represented as a hexadecimal string. This key can be shared publicly and is used to verify messages or actions associated with the private key. The sources provide two examples:
    *  `17162c921dc4d2518f9a101db33695df1afb56ab82f5ff3e5da6eec3ca5cd917`
    *   `d41b22899549e1f3d335a31002cfd382174006e166d3e658e3a5eecdb6463573`

*   **npub:** This is a format for representing the public key. It's a string that encodes the public key and has a specific prefix (`npub`). This format can be shared publicly. The sources provide two examples:
    *   `npub1zutzeysacnf9rru6zqwmxd54mud0k44tst6l70ja5mhv8jjumytsd2x7nu`
    *   `npub16sdj9zv4f8sl85e45vgq9n7nsgt5qphpvmf7vk8r5hhvmdjxx4es8rq74h`

Nostr uses a variety of formats to represent keys, each suited to different contexts and security requirements. The **mnemonic phrase** is used to derive the **private and public keys**, which are then represented as **hexadecimal strings** and also using **`nsec` and `npub` formats**, respectively. The `nip06-cli` tool can generate and restore keys and handle them in these various formats.

The NIP-06 CLI (`nip06-cli`) is a command-line tool designed to assist with the generation and restoration of Nostr keys, based on the NIP-06 standard. It uses the BIP39 standard to generate mnemonic seed words and derive a binary seed from them, and the BIP32 standard to derive private and public keys.

*   **Installation:** The tool can be installed using the Node Package Manager (npm) with the command `npm i -g nip06-cli`. It is also available as a Docker image: `docker run --rm -it jaonoctus/nip06-cli [options] [command]`.
*   **Commands:** The CLI offers the following commands:
    *   `random`: This command is used to **generate a random mnemonic seed phrase**.
    *   `restore`: This command is used to **restore keys from an existing mnemonic seed phrase**.
    *   `help`: This command displays help information for the tool or specific commands.
*   **Options:** The CLI accepts the following options:
    *   `-v, --version`: Outputs the version number.
    *   `-h, --help`: Displays help information.
*   **Key Generation:** The `nip06-cli` uses the generated or restored mnemonic seed phrase to derive private and public keys, following the derivation path `m/44'/1237'/<account>'/0/0`.
*   **Key Formats:** The tool deals with keys in the following formats:
    *   Private key (hex)
    *   `nsec` format of the private key
    *   Public key (hex)
    *   `npub` format of the public key
*   **Key Backup:** While the primary purpose of the tool is key generation and restoration, it also facilitates key backup. The tool allows for exploring different formats for saving keys, like `enc` or `JSON` and offers options for encrypting these backups. It also supports generating QR codes from keys and etching the mnemonic onto metal for physical backups.

The `nip06-cli` is a versatile tool for managing Nostr keys, allowing users to easily generate, restore, and backup their keys from a mnemonic seed phrase, which is compliant with NIP-06.

Going beyond simply storing the mnemonic phrase itself. These methods aim to balance convenience, security and durability. Here's an exploration of the key saving formats, as well as printing QR codes and etching mnemonics onto metal:

*   **Exploring Formats Like `enc` or `JSON`:** The sources suggest exploring formats such as `enc` or `JSON` for saving keys.
    *   These formats likely refer to encrypted files (`enc`) and structured data files (`JSON`), which are common ways to store data digitally.
    *   Using such formats allows for the storage of key information along with other relevant data in an organized way.
    *   The sources **emphasise the importance of encrypting backups**, especially if storing them in digital formats. This adds a layer of security, preventing unauthorized access to the keys even if the files are compromised.
*   **Printing as a QR Code:** Another approach for backing up keys is to print them as a **QR code**.
    *   This method allows for easy scanning and importing of keys into various Nostr clients or devices.
    *   The QR code essentially encodes the key data in a visual format that can be quickly read by a camera or scanner.
    *  This method provides a convenient way to transfer keys from a physical medium to a digital device without typing.
*   **Etching Mnemonic onto Metal:** For long-term, durable and secure backups, the sources recommend etching the **mnemonic phrase onto metal**.
    *   This method creates a physical backup that is resistant to physical damage like water, fire, or general wear and tear.
    *   This can be seen as a very robust approach to backing up mnemonic phrases, ensuring their survival in the face of accidents.
    *   **Given that the mnemonic phrase is the key to all of the derived keys**, protecting it by etching it onto metal can be an effective key backup strategy.

These backup methods address different needs:
   *   Digital backups with encryption for convenient storage and retrieval.
   *   QR codes for easy transfer to devices, and
   *   Physical, durable backups etched onto metal for long-term preservation.
   * The `nip06-cli` tool can play a central role in implementing all of these backup methods.

 By combining these various methods, users can ensure that they have multiple backup options for their Nostr keys, catering to different scenarios and mitigating various risks.

The NIP-06 standard specifies a particular key derivation path based on the BIP32 standard. Here's a breakdown of that path:

*   **Base Path:** The derivation path starts with `m/44'/1237'`.
    *   `m` indicates the master or root key.
    *   `44'` represents the purpose field, which is used for general-purpose coin derivation.
    *   `1237'` is the SLIP44 registered coin type for Nostr.

*   **Account Level:** Following this base, the path includes an `<account>` level, which allows for the derivation of multiple sets of keys.
    *   A basic client can simply use an `account` of `0` to derive a single key.
    *   For more advanced use cases, the `account` can be incremented, allowing for the generation of many keys from the same mnemonic seed.

*   **Final Levels:** The path is completed with two final fixed levels: `/0/0`.

*   **Complete Derivation Path:** The full derivation path specified by NIP-06 is therefore: **`m/44'/1237'/<account>/0/0`**.

*   **Hardened Derivation:** This entire path uses hardened derivation, which means that the derived keys cannot be used to derive the parent key.

*   **Flexibility:** While the specified path is recommended, the source notes that other types of clients can use other derivation paths for their own purposes.

**NIP-06 specifies the use of the `m/44'/1237'/<account>/0/0` derivation path**, which uses hardened derivation. This path allows for the generation of multiple keys from the same mnemonic seed using the `<account>` level. The `nip06-cli` tool uses this path to generate or restore keys.

The use of BIP39 and BIP32 standards in the context of generating and managing Nostr keys. Here's a breakdown of how these standards are used:

*   **BIP39:** This standard is used to generate **mnemonic seed phrases** from which the cryptographic keys are derived.
    *   A mnemonic seed phrase is a sequence of words, making it easier for humans to manage and back up keys.
    *   The sources provide two examples of mnemonic phrases: "leader monkey parrot ring guide accident before fence cannon height naive bean" and "what bleak badge arrange retreat wolf trade produce cricket blur garlic valid proud rude strong choose busy staff weather area salt hollow arm fade".
    *   BIP39 is used to derive a binary seed from the mnemonic words.
    *  The `nip06-cli` tool uses the BIP39 standard to generate a random mnemonic phrase, or to restore keys using an existing mnemonic.
*   **BIP32:** This standard is used to derive hierarchical deterministic keys from the binary seed generated by BIP39.
    *   BIP32 specifies a way to derive child keys from a parent key, forming a tree-like structure.
    *   The sources specify a derivation path of `m/44'/1237'/<account>/0/0` according to the Nostr entry on SLIP44.
        *   `m` indicates the master or root key.
        *   `44'` represents the purpose field for general-purpose coin derivation.
        *   `1237'` is the SLIP44 registered coin type for Nostr.
        *   `<account>` is a variable that allows for the derivation of multiple sets of keys. A basic client might use `0` as the account.
    *   The complete path uses **hardened derivation**, meaning that derived keys cannot be used to find the parent key.
    *   This allows for the generation of many keys from a single mnemonic seed, which is useful for managing multiple Nostr identities or for creating hierarchical keys.
*   **Key Derivation Process**: The process starts with a mnemonic seed phrase.
    *   The mnemonic seed is then used to derive a binary seed using BIP39.
    *   The binary seed is then used by BIP32 to generate a private key which can in turn be used to derive a public key.
*  **`nip06-cli` Tool:** The `nip06-cli` tool uses both BIP39 and BIP32 standards to generate and restore keys.

**BIP39** is used for creating mnemonic seed phrases, while **BIP32** is used for deriving hierarchical keys from those mnemonic seed phrases using the specified derivation path. Both are used by the `nip06-cli` tool to manage keys in accordance with the NIP-06 standard.


*   **NIP-06:** 
    *   [NIP06](https://github.com/nostr-protocol/nips/blob/master/06.md)
      

*   **BIP39:** 
    *   [Schema For BIP39](https://rya-sge.github.io/access-denied/2024/10/28/bitcoin-keys-101/).

*   **BIP32:** 
    *   [Derivation Paths](https://thebitcoinmanual.com/articles/btc-derivation-path/).

*   **SLIP44:**  
     *   [Coin Types](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)

*   **`nip06-cli` Tool:** 
    *  [`nip06-cli`](https://github.com/jaonoctus/nip06-cli?tab=readme-ov-file)

*   **Nostr Protocol:** 
    * [Full Nostr Specification](https://nostr-nips.com/)  

*   **Key Backup:**
*   * [Key Backup](https://bitcoin101.org/blog/best-practices-for-storing-bitcoin-private-keys)


