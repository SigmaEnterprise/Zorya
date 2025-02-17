+++
title = "Negentropy Revisited - Core Principles of Data Storage and Reconciliation"
menu = "Blog"
date = "2025-02-17"
+++

The Negentropy protocol, based on Range-Based Set Reconciliation (RBSR), is designed for efficiently synchronising datasets across networks, particularly in scenarios where datasets may have been created independently or have drifted out of sync. It is designed to be more efficient and require less parameter tuning than alternatives like bloom filters, and unlike systems based on Merkle trees, it doesn't need per-connection state storage and resists denial-of-service (DoS) attacks.

*   **Core Functionality**: Negentropy determines which records one participant has that the other lacks, and vice versa, facilitating the transfer of missing data items, although the actual transfer is external to the protocol. It supports replication or syncing of datasets that may have inconsistencies due to downtime, network partitions or misconfigurations.
*   **Data Requirements**:
    *   **Record IDs**: Each record must be mapped to a **32-byte ID**, typically a cryptographic hash of the record's content, ensuring that different records have different IDs and equivalent records have the same ID.
    *   **Timestamps**: Records are also mapped to timestamps (or any ordering criteria) that fit within a **64-bit unsigned integer**, with the largest value reserved as an "infinity" value. While timestamps don't need to be unique, similar timestamps should ideally correlate with records downloaded/stored/generated together for efficiency.
    *   **Updates**: Negentropy does not support updating records while preserving their IDs; instead, updates are modelled as deleting the old record and inserting a new one.
*   **Protocol Participants and Setup**: The two parties involved are called the client and the server (or initiator), with the client sending the first message. Both parties sort their records in ascending order by timestamp and then lexically by ID, forming what are called ranges.
*   **Bounds**: Ranges are specified by lower and upper bounds consisting of a timestamp and a variable-length ID prefix, which are as short as possible to differentiate records. Lower bounds are inclusive, and upper bounds are exclusive.
*   **Message Structure and Algorithm**:
    *   Communication occurs through alternating messages, each containing a protocol version byte followed by a sequence of ranges. Each range includes an upper bound, a mode, and a payload.
    *   Supported modes are `Skip` (no further processing needed), `Fingerprint` (payload contains a digest of IDs within the range), and `IdList` (payload contains a complete list of IDs for the range).
    *   The recipient loops over the message's ranges, constructing a new message concurrently. `Skip` ranges are answered with `Skip` ranges, and adjacent `Skip` ranges are coalesced.
    *   `IdList` ranges prompt the client to reply with a `Skip` range, while the server replies with its own ranges.
    *   `Fingerprint` ranges contain a digest used to determine if the data items are equal on both sides. If they differ, further recursive processing is required.
    *   When fingerprints differ, the receiver splits its range and sends the results back. The range is split into sub-ranges, and if the sub-ranges are small, an `IdList` range is sent. If they are large, the sub-ranges are sent as `Fingerprint` ranges (recursion).
*   **Fingerprints**:
    *   Fingerprints are short digests (hashes) of the IDs within a range. They are implemented as an incremental hash to improve efficiency.
    *   Negentropy uses an algorithm that aims for a balance between security and efficiency in its fingerprint specification.
*   **Frame Size Limits**: Negentropy implementations may support a frame size limit parameter to manage message sizes. This can increase the number of messaging round-trips and bandwidth consumed.
*   **Implementations**: Implementations of Negentropy exist in various languages, including C++, JavaScript, Rust, Go, C#, and Kotlin.
*   **Applications**: Negentropy is used in bandwidth-efficient Nostr event syncing and Waku Sync.
*   **Testing**: A conformance test-suite is available for testing implementations.

The Negentropy protocol balances efficiency and security for synchronising large datasets in open networks. By decoupling the protocol from the underlying storage structure, implementations gain flexibility and DoS attack resistance.

Set reconciliation is a method for synchronising datasets, useful when datasets have been created independently or have drifted apart due to downtime, network partitions or misconfigurations. In such cases, detecting and fixing inconsistencies is sometimes called anti-entropy repair. Range-Based Set Reconciliation (RBSR) works well with very large datasets and can be safely used in open networks of uncoordinated peers.

*   **Objective**: To efficiently determine which records one side has that the other side lacks, and vice versa. After determining the missing records, this information can be used to transfer the missing data items. The actual transfer is external to the negentropy protocol.
*   **Participants**: The two parties involved in the protocol are called the client (sometimes called the *initiator*) and the server. The client creates and sends the first message in the protocol.
*   **Data Requirements**: To use negentropy, mappings from data records need to be defined:
    *   `record -> ID`: Typically a cryptographic hash of the entire record, 32 bytes in length. Different records should not have the same ID, and equivalent records should have the same IDs.
    *   `record -> timestamp`: Any ordering criteria can be used, though a timestamp is most obvious. Units can be anything that fits in a 64-bit unsigned integer. The largest 64-bit unsigned integer should be reserved as a special "infinity" value. Timestamps do not need to be unique.
*   **Setup**: Each party sorts their records in ascending order by timestamp and, if timestamps are equivalent, then lexically by their IDs. This sorted array and contiguous slices of it are called *ranges*. Ranges are specified by lower and upper *bounds*, which consist of a timestamp and a variable-length ID prefix.
*   **Bounds**: Lower bounds are *inclusive*, and upper bounds are *exclusive*.
*   **Alternating Messages**: The client creates an initial message and sends it to the server. The server replies, and they continue exchanging messages until the protocol terminates. After termination, the *client* determines what IDs it has (and the server needs) and which it needs (and the server has). The client can then upload and/or download the missing records. Each message consists of a protocol version byte followed by an ordered sequence of ranges. Each range contains an upper bound, a mode, and a payload. The range's implied lower bound is the same as the previous range's upper bound (or 0, if it is the first range). The mode indicates what type of processing is needed for this range, and therefore how the payload should be parsed. If a message does not end in a range with an "infinity" upper bound, an implicit range with an upper bound of "infinity" and mode Skip is appended. An empty message indicates that all ranges have been processed and the sender believes the protocol can now terminate.
*   **Message Modes**:
    *   `Skip`: No further processing is needed for this range; payload is empty.
    *   `Fingerprint`: Payload contains a digest of all the IDs within this range.
    *   `IdList`: Payload contains a complete list of IDs for this range.
*   **Algorithm**: Upon receiving a message, the recipient loops over the message's ranges in order while concurrently constructing a new message. Skip ranges are answered with Skip ranges, and adjacent Skip ranges should be coalesced into a single Skip range. When the client receives an IdList range, it should reply with a Skip range. When a server receives an IdList range, it should reply with its own ranges (typically IdList and/or skip ranges). Fingerprint ranges contain a digest used to determine whether the sets of data items within the range are equal on both sides.

Some implementations and applications of the Negentropy protocol:

*   **Implementations**: C++, Javascript, Rust, Go, C#, Kotlin.
*   **Applications**: Bandwidth-efficient Nostr event syncing and Waku Sync.

Parties engaged in syncing use Negentropy objects as a way to reconcile their datasets, using a process that involves creating, adding events, sealing, and initiating messages. The specifics depend on whether the party is the client (initiator) or the relay (server).

*   **Client (Initiator):**
    *   Chooses a Nostr filter and retrieves the set of local events that match this filter.
    *   Creates a **`Negentropy` object** and adds all the relevant events to it.
    *   **Seals the `Negentropy` object**, preparing it for use.
    *   Calls **`initiate()`** on the `Negentropy` object to create the initial message. This message is then sent to the relay as part of a `NEG-OPEN` message.
    *   After the relay responds, the client calls **`reconcile()`** on its `Negentropy` object, using the data received from the relay.  This determines which events the client has and the relay needs (`have` array) and which events the client needs from the relay (`need` array).
    *   If `reconcile()` returns an empty string, the sync is complete. Otherwise, the result is sent back to the relay in another `NEG-MSG`.
*   **Relay (Server):**
    *   Receives a `NEG-OPEN` message from the client, which includes a Nostr filter and an initial message.
    *   Selects the set of local events that match the filter specified in the `NEG-OPEN` message.
    *   Creates its own **`Negentropy` object** and adds all matching events to it.
    *   **Seals the `Negentropy` object**.
    *   Calls **`reconcile()`** on its `Negentropy` object, using the initial message from the client.  The results are returned to the client as a `NEG-MSG`.
    *   The relay then alternates sending `NEG-MSG`s with the client until the client determines that the sync is complete.

To implement the Negentropy protocol, certain data requirements must be met. These requirements involve defining mappings from your data records to specific attributes.

*   **Record ID**:
    *   A mapping from `record -> ID` must be defined.
    *   This ID is typically a **cryptographic hash** of the entire record.
    *   The ID must be **32 bytes in length**.
    *   **Different records should not have the same ID**. Using a cryptographic hash helps ensure this.
    *   **Equivalent records should have the same ID**. Records should be canonicalised prior to hashing, if necessary.

*   **Record Timestamp**:
    *   A mapping from `record -> timestamp` must be defined.
    *   Although a **timestamp is the most obvious choice, any ordering criteria can be used**.
    *   The protocol will be most efficient if records with similar timestamps are often downloaded/stored/generated together.
    *   Units can be anything (seconds, microseconds, etc.) as long as they fit in a **64-bit unsigned integer**.
    *   The **largest 64-bit unsigned integer should be reserved as a special "infinity" value**.
    *   **Timestamps do not need to be unique**; different records can have the same timestamp. Zero can be used as the timestamp for every record if necessary.

*   **Record Updates**:
    *   Negentropy **does not support the concept of updating or changing a record while preserving its ID**. This should instead be modelled as deleting the old record and inserting a new one.

It is also highly beneficial if elements with similar timestamps are likely to be generated/downloaded/stored together. This is because if several elements with similar timestamps are missing from one side of the sync, then there will be fewer sub-ranges created compared to a situation where the elements are distributed throughout the ID-space.

Frame size limits are a supported parameter in Negentropy implementations. When configured, all messages created by an instance will be equal to or smaller than the specified byte limit. Here's an evaluation of their use:

*   **Purpose**: Frame size limits are implemented to prevent message sizes from becoming unmanageably large, particularly when there are many differences or evenly distributed differences throughout the range. This is especially relevant if the network transport has message size limitations, where a fragmentation system would otherwise be needed. They can also help with work pipelining, where synchronised records can be processed in parallel with additional reconciliation.
*   **Implementation**: Instead of sending all ranges needing syncing, the instance sends a smaller number to stay under the size limit. Subsequent ranges are replied to with a single coalesced Fingerprint range, ensuring they will be processed in later message rounds.
*   **Trade-offs**:
    *   **Increased round trips and bandwidth**: Frame size limits can increase the number of messaging round-trips and the total bandwidth consumed during synchronisation.
    *   **Potential for duplicate processing**: Already reconciled ranges may be coalesced into the final Fingerprint range and re-processed in subsequent reconciliation rounds. As a result, differences may be added to the `have / need` arrays multiple times if either sync party uses frame size limits. Applications that cannot handle duplicates should track the reported items.
*   **Benefits**:
    *   **Managing Message Size**: Frame size limits prevent messages from becoming too large.
    *   **Concurrent Processing**: Notifies about missing elements more rapidly, and allows processing of these missing elements to be performed concurrently with the rest of the sync.
*   **Assumptions**: Negentropy assumes a reliable transport.

Strfry uses the embedded **LMDB database** to store data locally on the filesystem. Strfry employs a custom LMDB schema, without a SQL interface for managing the DB. Here are key aspects of how Strfry uses LMDB:

*   **Data Storage**: All data is stored locally in LMDB, which eliminates the need for an external database.
*   **Direct Access**: Records are accessed directly from the page cache, meaning the read data-path requires no locking/system calls, scaling optimally with additional cores.
*   **Serialisation**: Database records are serialised with FlatBuffers or a bespoke packed representation, allowing fast and zero-copy access to individual fields.
*   **Indices**: A RasgueaDB layer maintains indices and executes queries. Most indices are clustered with the event's `created_at` timestamp, enabling efficient `since / until` scans.
*   **Minimal Record Size**: When an event is inserted, indexable data (id, pubkey, tags, kind, and `created_at`) is loaded into a packed representation, and non-indexed data is removed to minimise record size and improve cache usage. The full event's raw JSON is stored separately after re-serialisation to remove unauthenticated fields and canonicalise the JSON.
*   **Query Engine**: Strfry's custom query engine is optimised for real-time streaming, supporting pausing queries and resuming them later.
*   **Durability**: The relay never returns an OK until an event has been confirmed as committed to the DB.

Additionally, the `strfry compact` command creates a raw dump of the LMDB file (after compaction) and stores it in a specified file, useful for reclaiming space caused by fragmentation or migrating a DB to a new server running the same Strfry version.

Strfry's use of a custom LMDB database schema provides several benefits:

*   **Eliminates external database dependency** Strfry does not require an external database as all data is stored locally on the filesystem in LMDB.
*   **Efficient data access** Records are accessed directly from the page cache, which means the read data-path requires no locking or system calls, and scales optimally with additional cores.
*   **Fast serialisation** Database records are serialised using FlatBuffers or a bespoke packed representation, allowing for rapid, zero-copy access to individual fields within the records.
*   **Optimised indices** The RasgueaDB layer maintains indices and executes queries. The indices are clustered with the event's `created_at` timestamp to allow efficient `since / until` scans.
*   **Minimised record size** When an event is inserted, only indexable data is loaded into a packed representation, and non-indexed data is removed to minimise record size and improve cache usage.
*   **Real-time streaming optimisation** The custom query engine is optimised for real-time streaming use cases, supporting pausing and resuming queries with minimal overhead.

To implement the Negentropy protocol, certain data requirements must be met, primarily involving mappings from data records to specific attributes. These requirements ensure the efficient reconciliation of datasets.

*   **Record ID**:
    *   A mapping from `record -> ID` must be defined.
    *   This ID is typically a **cryptographic hash** of the entire record.
    *   The ID must be **32 bytes in length**.
    *   **Different records should not have the same ID**. Using a cryptographic hash helps ensure this.
    *   **Equivalent records should have the same ID**. Records should be canonicalised prior to hashing, if necessary.
*   **Record Timestamp**:
    *   A mapping from `record -> timestamp` must be defined.
    *   Although a **timestamp is the most obvious choice, any ordering criteria can be used**. The protocol will be most efficient if records with similar timestamps are often downloaded, stored, or generated together.
    *   Units can be anything (seconds, microseconds, etc.) as long as they fit in a **64-bit unsigned integer**.
    *   The **largest 64-bit unsigned integer should be reserved as a special "infinity" value**.
    *   **Timestamps do not need to be unique**; different records can have the same timestamp. Zero can be used as the timestamp for every record if necessary.
*   **Record Updates**:
    *   Negentropy **does not support the concept of updating or changing a record while preserving its ID**. This should instead be modelled as deleting the old record and inserting a new one.

It is also highly beneficial if elements with similar timestamps are likely to be generated, downloaded or stored together. This is because if several elements with similar timestamps are missing from one side of the sync, fewer sub-ranges will be created, compared to a situation where the elements are distributed throughout the ID-space.

Negentropy messages are structured to facilitate bidirectional communication between a client and a server (or between two relays) to reconcile datasets. The messages alternate between the two parties until synchronisation is complete.

*   **Alternating Messages:** After the initial setup, the client sends the first message to the server. The server then replies with another message, and the two parties continue exchanging messages until the protocol terminates.
*   **Message Content:** Each message consists of a protocol version byte followed by an ordered sequence of ranges. Each range contains an upper bound, a mode, and a payload. The range's implied lower bound is the same as the previous range's upper bound (or 0 if it is the first range). The mode indicates what type of processing is needed for this range, and therefore how the payload should be parsed.
*   **Range Modes**: The modes supported are:
    *   **Skip**: No further processing is needed for this range. Payload is empty.
    *   **Fingerprint**: Payload contains a digest of all the IDs within this range.
    *   **IdList**: Payload contains a complete list of IDs for this range.
*   **Implicit Range**: If a message does not end in a range with an "infinity" upper bound, an implicit range with upper bound of "infinity" and mode `Skip` is appended. This means that an empty message indicates that all ranges have been processed and the sender believes the protocol can now terminate.
*   **Message Processing**: Upon receiving a message, the recipient should loop over the message's ranges in order, while concurrently constructing a new message. `Skip` ranges are answered with `Skip` ranges, and adjacent `Skip` ranges should be coalesced into a single `Skip` range.
*   **Client and Server Roles**: `IdList` ranges represent a complete list of IDs held by the sender. Because the receiver obviously knows the items it has, this information is enough to fully reconcile the range. Therefore, when the client receives an `IdList` range, it should reply with a `Skip` range. However, since the goal of the protocol is to ensure the *client* has this information, when a server receives an `IdList` range it should reply with its own ranges (typically `IdList` and/or skip ranges).
*   **Fingerprint Differences:** When the fingerprints on each side differ, the receiver should *split* its own range and send the results back in the next message. When splitting, the number of records within each sub-range should be considered. If small, an `IdList` range should be sent. If large, the sub-ranges should themselves be sent as `Fingerprint`s (this is the recursion).
*   **Termination**: Once the client has looped over all ranges in a server's message and its constructed response message is a full-universe `Skip` range (i.e., the empty string ""), then it needs no more information from the server and therefore it should terminate the protocol.

Negentropy solves the problem of **efficiently synchronising datasets across networks**, especially when the datasets may have been created independently or have drifted out of sync. This is particularly useful in distributed systems where ensuring data consistency can be challenging.

Key components of the Negentropy protocol:

*   **Range-Based Set Reconciliation (RBSR)**: Negentropy is based on RBSR, a method for synchronising datasets. RBSR works well with very large datasets and can be safely used in open networks of uncoordinated peers.
*   **Data Requirements**: To use Negentropy, you need to define mappings from your data records:
    *   `record -> ID`: Typically a cryptographic hash of the entire record, must be 32 bytes in length, different records should not have the same ID, and equivalent records should have different IDs.
    *   `record -> timestamp`: Any ordering criteria can be used, although timestamp is the most obvious. Units can be anything (seconds, microseconds, etc.) as long as they fit in a 64-bit unsigned integer. Timestamps do not need to be unique.
*   **Client-Server Model**: The two parties engaged in the protocol are called the client and the server. The client, also called the *initiator*, creates and sends the first message in the protocol.
*   **Sorted Arrays (Ranges)**: Each party should begin by sorting their records in ascending order by timestamp. If the timestamps are equivalent, records should be sorted lexically by their IDs. This sorted array and contiguous slices of it are called *ranges*.
*   **Bounds**: Ranges are specified by lower and upper *bounds*, which include a timestamp and a variable-length ID prefix. Lower bounds are *inclusive*, and upper bounds are *exclusive*.
*   **Alternating Messages**: The client creates an initial message and sends it to the server, which replies with another message. This exchange continues until the protocol terminates. After the protocol terminates, the *client* will have determined what IDs it has (and the server needs) and which it needs (and the server has).
*   **Message Structure**: Each message consists of a protocol version byte followed by an ordered sequence of ranges. Each range contains an upper bound, a mode, and a payload. The range's implied lower bound is the same as the previous range's upper bound (or 0, if it is the first range). The mode indicates what type of processing is needed for this range and therefore how the payload should be parsed.
    *   `Skip`: No further processing is needed for this range; payload is empty.
    *   `Fingerprint`: Payload contains a digest of all the IDs within this range.
    *   `IdList`: Payload contains a complete list of IDs for this range.
*   **Algorithm**: Upon receiving a message, the recipient should loop over the message's ranges in order while concurrently constructing a new message. `Skip` ranges are answered with `Skip` ranges, and adjacent `Skip` ranges should be coalesced into a single `Skip` range. `IdList` ranges represent a complete list of IDs held by the sender. `Fingerprint` ranges contain a digest used to determine whether the sets of data items within the range are equal on both sides.
*   **Fingerprints**: Fingerprints are short digests (hashes) of the IDs contained within a range. Negentropy fingerprints are specified as an incremental hash to improve efficiency.
*   **Frame Size Limits**: Negentropy implementations may support a *frame size limit* parameter to manage message sizes. If configured, all messages created by this instance will be of a length equal to or smaller than this number of bytes.
*   **Implementations**: Implementations are available in multiple languages, including C++, Javascript, Rust, Go, C#, and Kotlin.
*   **Applications**: Negentropy is used in bandwidth-efficient Nostr event syncing and Waku Sync.

Negentropy's set reconciliation protocol, based on Range-Based Set Reconciliation (RBSR), efficiently synchronises datasets across networks by determining which records each participant has or lacks. Here's how it works:

*   **Initial Setup**:
    *   Two parties, a **client** and a **server**, engage in the protocol. The client, also known as the initiator, sends the first message.
    *   Both parties **sort their records in ascending order by timestamp**, then lexically by ID if timestamps are equal. This sorted data is organised into ranges.
*   **Range Specification**: Ranges are defined by **lower and upper bounds**, consisting of a timestamp and a variable-length ID prefix. The prefixes are as short as possible while still being able to separate records from their predecessors. Lower bounds are inclusive, and upper bounds are exclusive.
*   **Alternating Messages**:
    *   The client creates an initial message containing at least one range that covers the full universe of possible timestamps and sends it to the server.
    *   Subsequent communication involves alternating messages between the client and server until the protocol terminates.
    *   Each message contains a **protocol version byte** followed by an **ordered sequence of ranges**. Each range includes an **upper bound, a mode, and a payload**. The lower bound is implied by the previous range's upper bound.
    *   Supported modes are `Skip`, `Fingerprint`, and `IdList`:
        *   `Skip`: Indicates no further processing is needed for this range, and the payload is empty.
        *   `Fingerprint`: The payload contains a digest (hash) of all IDs within the range.
        *   `IdList`: The payload contains a complete list of IDs for the range.
*   **Reconciliation Algorithm**:
    *   Upon receiving a message, the recipient processes each range while concurrently constructing a new message.
    *   `Skip` ranges are responded to with `Skip` ranges, and adjacent `Skip` ranges are coalesced into a single `Skip` range.
    *   Upon receiving an `IdList` range, the client replies with a `Skip` range, while the server responds with its own ranges.
    *   `Fingerprint` ranges are used to determine if the data items are equal on both sides. If the fingerprints differ, further recursive processing is needed.
    *   When fingerprints on each side differ, the receiver splits its own range into sub-ranges and sends the results back. Small sub-ranges are sent as `IdList` ranges, while large sub-ranges are sent as `Fingerprint` ranges, thus initiating recursion.
*   **Termination**: The protocol terminates when the client has looped over all ranges in a server's message and its constructed response message is a full-universe `Skip` range.

### Limitations:

*   **Data Requirements**: Requires defining mappings from data records to IDs (typically cryptographic hashes) and timestamps (or any ordering criteria). Updating records while preserving their IDs is not supported.
*   **Computational Cost**: Computing fingerprints, especially with cryptographic hash functions, can be computationally intensive.
*   **Frame Size Limits**: Implementing frame size limits to manage message sizes can increase the number of message round-trips and bandwidth consumption.
*   **Security**: Vulnerable to potential third-party censorship attacks if malicious data elements are inserted to cause ranges to have equal fingerprints. Although a cryptographically secure incremental hash function isn't strictly required due to the difficulties in executing this attack.
*   **Memory and Bandwidth**: Syncing can consume a lot of memory and bandwidth if the DBs are highly divergent.
*   **No support for "updates"**: Negentropy does not support the concept of updating or changing a record while preserving its ID, which should be modelled as deleting the old record and inserting a new one.

The negentropy protocol specification details how devices on a network can efficiently determine and exchange differences between sets of data. The source material details several aspects of this protocol.

Key aspects of the negentropy protocol specification:

*   **Data Requirements**: In order to use negentropy, data records need to be mapped to IDs and timestamps.
    *   IDs are typically cryptographic hashes of the entire record and must be 32 bytes in length. Different records should not have the same ID, and equivalent records should have different IDs.
    *   Timestamps do not need to be unique, though any ordering criteria can be used. The largest 64-bit unsigned integer should be reserved as a special "infinity" value.
*   **Client-Server Setup**: The protocol involves two parties: a client (or initiator) and a server. The client initiates the protocol by sending the first message. Both parties sort their records in ascending order by timestamp, and if timestamps are equivalent, they sort lexically by ID.
*   **Bounds**: Ranges are specified by lower and upper bounds, consisting of a timestamp and a variable-length ID prefix. Lower bounds are inclusive, and upper bounds are exclusive.
*   **Alternating Messages**: The client sends an initial message to the server, which replies with another message, and the parties continue exchanging messages until the protocol terminates. The client determines which IDs it has (and the server needs) and which it needs (and the server has).
*   **Message Structure**: Messages consist of a protocol version byte followed by an ordered sequence of ranges. Each range contains an upper bound, a mode, and a payload. The range's implied lower bound is the same as the previous range's upper bound (or 0 if it is the first range).
*   **Modes**: There are three supported modes:
    *   `Skip`: Indicates that no further processing is needed for this range, and the payload is empty.
    *   `Fingerprint`: The payload contains a digest of all the IDs within this range.
    *   `IdList`: The payload contains a complete list of IDs for this range.
    If a message does not end in a range with an "infinity" upper bound, an implicit range with an upper bound of "infinity" and mode `Skip` is appended.
*   **Algorithm**: Upon receiving a message, the recipient loops over the message's ranges in order while constructing a new message concurrently. `Skip` ranges are answered with `Skip` ranges, and adjacent `Skip` ranges are coalesced into a single `Skip` range. `IdList` ranges represent a complete list of IDs held by the sender. `Fingerprint` ranges contain a digest that can be used to determine whether the set of data items within the range are equal on both sides. If they differ, further recursive processing is required.
*   **Fingerprints**: Fingerprints are short digests (hashes) of the IDs contained within a range. They are specified as an incremental hash to improve efficiency.
*   **Frame Size Limits**: Negentropy implementations may support a frame size limit parameter. If configured, all messages created by this instance will be of a length equal to or smaller than this number of bytes.
*    **Nostr Specifics**: When used in Nostr, Negentropy involves specific messages like NEG-OPEN, NEG-MSG, NEG-ERR and NEG-CLOSE for initiating, transmitting messages, handling errors and closing the synchronisation process.

The negentropy protocol is further described in the Log Periodic article on Range-Based Set Reconciliation.

Strfry achieves zero downtime restarts by leveraging the `REUSE_PORT` Linux socket option, allowing multiple instances to listen on the same port simultaneously. The process involves a graceful shutdown and starting a new instance before the old one terminates.

*   **Parallel instances**: Strfry can have multiple running instances that listen on the same port concurrently, thanks to the `REUSE_PORT` socket option.
*   **Graceful shutdown**: Sending a `SIGUSR1` signal to a strfry process initiates a graceful shutdown. This prevents the instance from accepting new websocket connections and causes it to exit once all existing websocket connections are closed.
*   **Restart procedure**:
    *   The process ID (PID) of the running strfry instance is recorded.
    *   A new relay process is started with the same configuration as the existing instance, and both instances accept new connections.
    *   The `SIGUSR1` signal is sent to the old instance to initiate a graceful shutdown using the command `kill -USR1 $OLD_PID`.
    *   The old strfry instance will terminate once all its connections have been closed, while the new instance continues to serve new connections.

This process ensures that users are not impacted during upgrades of the strfry binary or major configuration changes.

RBSR improves upon `rsync`'s synchronisation methods, especially in distributed environments, in several key ways, primarily by addressing the limitations of `rsync` related to **metadata reliance, full data transfers, and single-round communication**.

*   **Content-Based Addressing Instead of Timestamps**:
    *   `rsync` uses file modification timestamps in its initial phase to determine if files have changed.
    *   RBSR, and by extension Negentropy, uses the *contents* of data elements (or their hashes) to determine equivalence. This is more reliable in distributed environments where timestamps can be inconsistent or unreliable due to various factors like server rebuilds, load balancers, or backups.

*   **Divide-and-Conquer Approach**:
    *   `rsync` transmits a list of checksums for each chunk of a file, which means an amount of data linear in the full file-size must be transferred every time a file is synchronised.
    *   RBSR employs a **divide-and-conquer** technique, similar to a binary search, which allows shared subsets of records to be identified early on. This significantly reduces bandwidth overhead, making it grow logarithmically with the total file size rather than linearly. By identifying shared subsets of records early on, no further synchronisation work needs to be performed on them.

*   **Alternating Messages**:
    *   `rsync` constructs and transfers the full list of chunks in one communication round.
    *   RBSR uses back-and-forth communication rounds between the protocol participants. This allows the protocol to find common subsets of elements so that processing of these subsets can be halted. This approach ensures that the number of rounds depends on the size of the datasets being synced and not on the number of differences. Batched recursion in RBSR means that each message transmission may include multiple ranges and their fingerprints.

*   **Flexibility and Customisation**:
    *   RBSR implementations have considerable flexibility when choosing their ranges, allowing for partial syncing, variable sizing, weighted splitting, and randomisation.
    *   This flexibility enables clients to implement their desired range policies without coordination from the other side, making it adaptable to various network conditions and synchronisation needs.

*   **Statelessness and DoS Resistance**: Unlike systems based on Merkle trees, RBSR does not require storing per-connection state and is resistant to DoS attacks. Because the protocol does not rely on a particular tree configuration, the tree structure can be modified in between rounds of the same synchronisation session. RBSR is resilient to tree modifications because the tree structure is not exposed in the protocol.

Consider, **RBSR enhances `rsync`'s capabilities by shifting from metadata-dependent comparisons to content-based addressing, employing a divide-and-conquer strategy for efficient sub-range identification, enabling alternating messages for dynamic adjustments, and offering implementation flexibility – all crucial for the reliability and efficiency required in distributed environments**.

When selecting a fingerprint function for Range-Based Set Reconciliation (RBSR), one must carefully consider the trade-offs between security and efficiency. The fingerprint function's role is to provide a compact summary of a dataset, enabling the verification of equality with a remote set.

*   **Security Considerations**:
    *   **Censorship Attacks**: A core security concern is the potential for third parties to inject malicious data elements, causing different ranges to have the same fingerprint. This could censor victim elements by preventing their synchronisation.
    *   **Incremental Hash Function Security**: The choice of incremental hash function impacts vulnerability to collision attacks. For instance, using XOR for combining hashes makes it surprisingly easy to find sets of elements that, when hashed and XORed, equal a specific target value. Addition modulo 2N is more secure than XOR but still vulnerable. Elliptic Curve Multiset Hash (ECMH) is considered computationally infeasible to crack but is significantly slower.

*   **Efficiency Factors**:
    *   **Incremental Hashing**: To improve efficiency, negentropy fingerprints are specified as an incremental hash. Incremental hashing allows updating the hash to include new elements without re-computing the entire hash from scratch.
    *   **Tree-Friendly Functions**: Using tree-friendly hash functions can reduce the work needed to compute fingerprints by storing elements in a tree data-structure such as a B-tree. This is because each node of the tree contains the incremental hash of all elements below it. When combined with tree data structures, incremental hashes enable the computation of the hash of any range of elements using only a logarithmic number of hashes.
    *   **Computational Cost**: More secure hash functions, like ECMH, are often slower. The trade-off lies in balancing the need for quick computation with robust security against attacks.

*   **Compromises and Hardening**:
    *   **Range Randomisation**: Implementations can randomise sub-ranges during recursion to counter collision attacks. By randomising the number of ranges and/or their offsets, the likelihood of malicious elements aligning to cause a collision is reduced.
    *   **Incorporating Set Size**: Fingerprints can include the number of elements within a range, which can prevent certain attack classes, particularly when attackers can only write to one side of a network split.
    *   **Protocol-Level Security**: Given the difficulties in executing censorship attacks, a cryptographically secure incremental hash function is not always essential.

*   **Negentropy's Approach**:
    *   Negentropy uses a fingerprint function that balances security and efficiency: computing the addition mod 2256 of element IDs, concatenating with the number of elements, hashing with SHA-256, and taking the first 16 bytes.

Consider, the selection of a fingerprint function requires balancing the computational efficiency needed for rapid synchronisation with the security requirements to prevent malicious data manipulation.

RBSR (Range-Based Set Reconciliation) is designed to facilitate **stateless synchronisation**, offering several advantages in distributed systems.

Here's how RBSR enables stateless sync and the benefits it provides:

*   **Decoupling from Storage Structure**: RBSR's key advantage lies in decoupling the protocol from the underlying storage structure. This means implementations have the freedom to use different data structures (e.g., B-trees with varying branching factors) and rebalancing strategies without affecting interoperability.

*   **Resilience to Tree Modifications**: Because RBSR is not reliant on a rigid data-structure, the tree structure can be modified between rounds of the same synchronisation session. A server can continue ingesting new data and modify its tree without waiting for all synchronisation sessions to complete.
*   **No Session-Specific Data**: Unlike rigid data structures which may require copy-on-write behaviour, RBSR doesn't need servers to store session-specific synchronisation data. There is no requirement for servers to maintain references to snapshots or implement garbage collection.

*   **Stateless Operation**: The stateless nature of RBSR means servers do not need to maintain session state, leading to simplified server design and reduced resource consumption.

**Advantages of Stateless Sync with RBSR:**

*   **Protection Against DoS Attacks**: The decoupling of the protocol from the tree configuration protects against DoS attacks.
*   **Flexibility**: Implementations have significant freedom in how they store their data.
*   **Reduced Memory Overhead**: There is no extra memory or garbage collection overhead.
*   **Simplified Server Design**: Servers can be entirely stateless.
*   **Real-Time Data**: Long-running sync sessions will sync data that was added after the sync.
*   **Efficiency**: Avoids the overhead of copy-on-write strategies.

In essence, RBSR's design allows for a flexible and efficient synchronisation process where the server doesn't need to keep track of individual client sessions, making it well-suited for dynamic and high-throughput environments.

The 'divide and conquer' strategy is a key element in Range-Based Set Reconciliation (RBSR) and a significant improvement over methods used in `rsync`. This approach drastically reduces the amount of data that needs to be transferred during synchronisation, especially with large datasets.

*   **Basic Principle**: Instead of transferring the entire dataset or a linear list of checksums, the 'divide and conquer' approach involves recursively splitting the data into smaller chunks to identify differences efficiently.
*   **Initial Check**: The process starts by computing a fingerprint (a cryptographic hash) of the entire dataset. This fingerprint is then sent to the remote side. If the fingerprints match, it indicates that both datasets are identical, and no further synchronisation is needed.
*   **Recursive Splitting**: If the initial fingerprints do not match, the dataset is split into two sub-ranges, and a fingerprint is computed for each. These fingerprints are then exchanged.
*   **Identifying Shared Subsets**: If a fingerprint for a sub-range matches, it confirms that the corresponding data is identical on both sides. This shared subset is then excluded from further processing, saving bandwidth, CPU, and I/O resources.
*   **Further Recursion**: For sub-ranges where the fingerprints do not match, the process is repeated recursively. The sub-range is further divided into smaller sub-ranges until the differences are isolated.
*   **Small Range Handling**: Once the sub-ranges become sufficiently small, instead of splitting further, the elements within that range are sent directly to the other side. This allows the receiving side to identify which elements are missing and complete the synchronisation.
*   **Logarithmic Overhead**: The strength of the divide and conquer technique is that the bandwidth overhead grows logarithmically with the total file size. This is similar to a binary search, where the search space is halved with each step.
*   **Batching**: Each message transmission may include multiple ranges and their fingerprints. This "batching" of multiple ranges means the number of rounds of the protocol only depends on the sizes of the data-sets being synced, and not on their number of differences.

The 'divide and conquer' strategy allows RBSR to efficiently pinpoint and synchronise only the differing parts of large datasets, making it particularly effective in distributed environments where minimising data transfer is crucial.

Incremental fingerprint hashing is a crucial component of the Negentropy protocol and Range-Based Set Reconciliation (RBSR), offering significant efficiency improvements over traditional hashing methods.

*   **Traditional Hashing Limitations**:
    *   With traditional cryptographic hash functions (e.g., SHA-256), updating a hash to include new elements requires re-computing the entire hash from scratch. For example, if you have elements A, B, and C, and you compute `h = sha256(A + B + C)`, adding a new element D would require recomputing `h' = sha256(A + B + C + D)`.
    *   This is inefficient, especially when dealing with large datasets where frequent updates are necessary. Generating fingerprints of sub-ranges would require re-hashing a potentially large number of IDs. Adding a new record would invalidate a cached fingerprint and require re-hashing the full list of IDs.

*   **Incremental Hashing Defined**:
    *   Incremental hashing allows the new hash value to be computed **without starting from scratch**.
    *   A simple incremental hash can be implemented by hashing each individual element and then combining them with bit-wise XOR (⊕). For example: `h = sha256(A) ⊕ sha256(B) ⊕ sha256(C)`.
    *   Since XOR is associative, adding a new element D incrementally is straightforward: `h' = h ⊕ sha256(D)`.
    *   Most incremental hashes also allow subtracting elements out of the hash. With XOR, this is as simple as: `h' ⊕ -sha256(D) = h' ⊕ sha256(D) = h`.
    *   Hashing and then combining with XOR is an example of the randomise then combine paradigm for creating incremental hash functions.

*   **Tree-Friendly Functions**:
    *   Incremental hash functions can be used to reduce the amount of work needed to compute fingerprints by storing elements in a **tree data-structure**.
    *   If an incremental hash function has the properties that make this possible, it is called "tree-friendly".
    *   Each node of the tree contains the incremental hash of all elements below it in the tree.
    *   When combined with tree data structures, incremental hashes enable the computation of the hash of any range of elements using only a **logarithmic number of hashes**.

*   **Advantages**:
    *   **Efficiency**: By using incremental hashing, RBSR avoids the need to re-hash the entire dataset each time a change occurs.
    *   **Tree Structures**: Incremental hash functions are "tree-friendly", allowing for efficient storage and retrieval of data in tree structures like B-trees.
    *   **Flexibility**: Because tree-friendly hash functions can be combined and separated, combinations of multiple trees or sub-trees can be synced in the same protocol-round.

*   **Security Considerations**:
    *   The choice of incremental hash function impacts vulnerability to collision attacks.
    *   XOR is vulnerable because it is easy to find a set of malicious elements that, when hashed and XORed, equal a specific target value.
    *   Addition modulo 2N is more secure than XOR but still vulnerable.
    *   Elliptic Curve Multiset Hash (ECMH) is considered computationally infeasible to crack but is significantly slower.

*   **Compromises and Hardening**:
    *   Range Randomisation: Implementations can randomise sub-ranges during recursion to counter collision attacks.
    *   Incorporating Set Size: Fingerprints can include the number of elements within a range, which can prevent certain attack classes, particularly when attackers can only write to one side of a network split.

*   **Negentropy's Approach**:
    *   Negentropy uses a fingerprint function that balances security and efficiency: computing the addition mod 2256 of element IDs, concatenating with the number of elements, hashing with SHA-256, and taking the first 16 bytes.

Consider, **incremental fingerprint hashing is a critical optimisation in RBSR, enabling efficient computation and updating of fingerprints while carefully balancing security considerations**. The use of tree-friendly functions further enhances efficiency by allowing logarithmic-time computations of range hashes.

Range-Based Set Reconciliation (RBSR) is a method for efficiently synchronising datasets between two parties, even when those datasets are very large and potentially have drifted out of sync due to various reasons like downtime or network issues. It operates by identifying common subsets of data and focusing the synchronisation efforts on the differences, thereby minimising the amount of data that needs to be transferred.

*   **Core Idea**: The fundamental principle of RBSR is to **sort all elements to be synchronised into a particular order**, typically based on a unique timestamp associated with each element. If timestamps are identical, elements are then sorted lexically by ID.
*   **Ranges and Bounds**: A contiguous sequence of these sorted elements is called a 'range'. Since each side potentially has a different set of records, ranges cannot be referred to by their indices in one side's sorted array, and are instead specified by lower and upper 'bounds', consisting of a timestamp and a variable-length ID prefix. Lower bounds are inclusive, while upper bounds are exclusive.

*   **Alternating Messages**: The protocol involves back-and-forth communication between two participants, the client and the server. The client, also called the initiator, creates and sends the first message. Each message consists of a protocol version byte followed by an ordered sequence of ranges.

*   **Initial Message**: The client begins by computing a **fingerprint** over its full range of elements (from timestamp 0 to timestamp infinity) and sending it to the remote side. The initial message should cover the full universe and therefore must have at least one range.
*   **Fingerprint Comparison**: The remote side computes the fingerprint for its own full range. If the fingerprints match, it means both sides have identical sets, and the protocol stops.
*   **Divide and Conquer**: If the fingerprints do not match, the remote side splits its range into two smaller sub-ranges, computes the fingerprints for each, and sends them along with corresponding bounds back to the initiator. The initiator then computes its own fingerprints for each sub-range specified by the remote side. If a fingerprint for a sub-range matches, it confirms that the corresponding data is identical on both sides, and that range is excluded from further processing. For sub-ranges where the fingerprints do not match, the process is repeated recursively.

*   **Range Types**: Messages contain ranges, each with an upper bound, a mode, and a payload. The mode indicates the type of processing needed:
    *   **Skip**: No further processing is needed for this range. Payload is empty.
    *   **Fingerprint**: Payload contains a digest of all the IDs within this range.
    *   **IdList**: Payload contains a complete list of IDs for this range.
*   **Algorithm**: Upon receiving a message, the recipient loops over the message's ranges in order, while concurrently constructing a new message. Skip ranges are answered with Skip ranges, and adjacent Skip ranges should be coalesced into a single Skip range.

*   **IdList Ranges**: represent a complete list of IDs held by the sender. When the client receives an IdList range, it should reply with a Skip range. However, when a server receives an IdList range, it should reply with its own ranges (typically IdList and/or skip ranges).
*   **Fingerprint Ranges**: contain a digest which can be used to determine whether or not the set of data items within the range are equal on both sides. However, if they differ, determining the actual differences requires further recursive processing. When the fingerprints on each side differ, the receiver should split its own range and send the results back in the next message.
*   **Termination**: The protocol continues with alternating messages until the client has determined which IDs it has (and the server needs) and which it needs (and the server has). Once the client has looped over all ranges in a server's message and its constructed response message is a full-universe Skip range (ie, the empty string ""), then it needs no more information from the server and therefore it should terminate the protocol.
*   **Data Transfer**: After the missing records have been determined, this information can be used to transfer the missing data items. The actual transfer is external to the negentropy protocol.
*   **Incremental Hashing**: To improve efficiency, negentropy fingerprints are specified as an incremental hash. This avoids re-hashing a potentially large number of IDs.
*   **Frame Size Limits**: Negentropy implementations may support a *frame size limit* parameter. If configured, all messages created by this instance will be of length equal to or smaller than this number of bytes.

RBSR leverages 'divide and conquer' to minimise data transfer, incremental hashing to efficiently compare data subsets, and flexible range management to adapt to different network conditions and data characteristics. Its design also facilitates stateless operation, offering greater scalability and resilience in distributed systems.



## Further reading

- [strfry - a nostr relay](https://github.com/hoytech/strfry)
- [Negentropy](https://github.com/hoytech/negentropy)
- [NIP-01](https://nips.nostr.com/1)
- [Range Based Set Reconciliation](https://logperiodic.com/rbsr.html)
- [Router and Plugin information Policies](https://github.com/hoytech/strfry/blob/master/docs/plugins.md)
- [Nostr Protocol Extension](https://github.com/hoytech/strfry/blob/master/docs/negentropy.md)
- [Low Level Spec](https://github.com/hoytech/negentropy/blob/master/docs/negentropy-protocol-v1.md)