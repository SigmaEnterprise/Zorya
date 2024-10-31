+++
title = "`strfry`: A Feature-Rich Nostr Relay for Efficient, Secure, and Scalable Connections"
menu = "Blog"
dateFormat = "2024-10-30"
+++

# Introducing `strfry`: A Feature-Rich Nostr Relay for Efficient, Secure, and Scalable Connections

<div style="text-align: center;">
  <img src="https://github.com/hoytech/strfry/raw/master/docs/strfry.svg" alt="strfry logo">
</div>


`strfry` is an innovative relay for the [Nostr protocol](https://github.com/nostr-protocol/nostr), designed to streamline data handling, enhance efficiency, and ensure secure real-time communication across decentralized networks. Built with local-first data storage and lightweight configuration, `strfry` supports a wide range of Nostr Implementation Possibilities (NIPs) that enhance interoperability, privacy, and performance.

### Key Features of `strfry`

- **NIP Support**: Strfry is compatible with multiple NIPs, including core ones like 1, 2, 4, and additional functionality-based NIPs such as 11, 22, 28, 40, 70, and 77, making it adaptable to most use cases within the Nostr ecosystem.
  
- **Local Storage via LMDB**: Avoiding the complexity of external databases, `strfry` uses LMDB to store data locally, promoting easy setup, portability, and secure, durable storage directly on the filesystem.

- **Hot Reloading and Zero Downtime**: Configuration changes can be applied instantly, with no server restarts required, ensuring smooth upgrades and uninterrupted service for users.

- **Websocket and On-Disk Compression**: `strfry` enables efficient data transfer with `permessage-deflate` for websocket compression and `zstd` for optional on-disk compression, reducing data load while preserving performance.

- **Real-Time Event Streaming and Synchronization**: With built-in real-time streaming and advanced event reconciliation, `strfry` facilitates instant up/down streaming with remote relays and uses [negentropy-based set reconciliation](https://github.com/hoytech/negentropy) for accurate syncing and event tracking.

- **Community Support**: Users are encouraged to join the [Telegram support group](https://t.me/strfry_users) to share insights and seek assistance.

`strfry` represents a step forward in efficient, resilient relay design for Nostr, accommodating seamless client syncing, real-time event handling, and a strong foundation for privacy-focused applications in decentralized networks.



The benefits of running `strfry`, featuring emojis for added clarity:

| Feature                       | Benefit                                                                                                                                                    |
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🌐 **NIP Support**             | Supports essential NIPs (1, 2, 4, etc.), enhancing interoperability with other Nostr-compatible services.                                                |
| 💾 **Local Storage**           | Stores data locally with LMDB, removing the need for external databases and simplifying setup.                                                           |
| 🔄 **Hot Reloading**           | Configuration changes can be applied instantly without restarting, ensuring uninterrupted service.                                                        |
| ⏱️ **Zero Downtime Restarts**  | Allows for seamless server upgrades without disconnecting users.                                                                                         |
| 🔍 **Efficient Compression**   | Websocket and on-disk compression reduce data load while maintaining high performance.                                                                   |
| 🚀 **Real-Time Streaming**     | Provides instant up/down streaming and real-time event handling for faster data transfer.                                                                |
| 🤝 **Event Reconciliation**    | Uses negentropy-based set reconciliation to accurately sync events between clients and relays.                                                          |
| 📞 **Community Support**       | Active user community available on Telegram for support, updates, and best practices.


Understanding strfry
What is strfry?

strfry is a nostr relay. In simpler terms, it's a special kind of server designed for the nostr protocol. Nostr is like a new type of social media platform that is decentralized and prioritizes privacy. Unlike traditional social media, where a central company controls everything, nostr allows users to control their own data and choose their own relays.

How strfry Works

No external database: All the data strfry needs is stored on your own computer, not in some big company's data center.
Efficient and fast: strfry is built for speed and efficiency, so it can handle a lot of users and data without slowing down.
Privacy-focused: strfry has features that make it harder for others to track you and your data.

OK, let's break down how to set up and run `strfry`.

### Setting Up strfry

Before you can run strfry, you need to make sure you have the necessary tools and dependencies installed. Here's how you can do that on Debian/Ubuntu:

```bash
sudo apt install -y git g++ make libssl-dev zlib1g-dev liblmdb-dev libflatbuffers-dev libsecp256k1-dev libzstd-dev
```

This command installs the required packages, including:

* `git`: For downloading the strfry source code
* `g++`: A C++ compiler
* `make`: A build automation tool
* Various libraries: Essential for strfry's functionality

### Compiling strfry

Once you have the dependencies in place, you can download and compile strfry:

```bash
git clone https://github.com/hoytech/strfry && cd strfry/
git submodule update --init
make setup-golpe
make -j4
```

This will:

1. Clone the strfry repository from GitHub.
2. Initialize and update any submodules (other code that strfry depends on).
3. Set up the "golpe" tool (used internally by strfry).
4. Compile the strfry code using 4 parallel jobs (`-j4` flag).

### Running strfry

After successful compilation, you can run strfry with this simple command:

```bash
./strfry relay
```

This starts the strfry relay with the default configuration.

**Key points to remember**

* The default configuration file is `./strfry.conf`
* The default database directory is `./strfry-db/`
* The default listening port is 7777, and it only accepts connections from localhost by default.

Let's explore the more advanced aspects of `strfry`.

### Database Upgrade

Sometimes, `strfry` needs to change the way it stores data in its database. If you have an older database and try to use it with a newer version of `strfry`, you'll get an error.

To fix this, you need to upgrade your database. Here's how:

1.  Export your existing data in a special format called "fried exports":

    ```bash
    ./strfry export --fried > dbdump.jsonl
    ```

2.  Make a backup of your old database file:

    ```bash
    mv strfry-db/data.mdb data.mdb.bak
    ```

3.  Import the data back into a new database:

    ```bash
    ./strfry import --fried < dbdump.jsonl
    ```

### Database Compaction

Over time, the `strfry` database can become fragmented, taking up more space than necessary. You can compact the database to reclaim this space. Here's how:

1.  Stop the `strfry` relay.
2.  Run the compact command:

    ```bash
    ./strfry compact - > strfry-db/data.mdb.compacted
    ```

3.  Replace the old database file with the compacted one:

    ```bash
    mv strfry-db/data.mdb.compacted strfry-db/data.mdb
    ```

4.  Restart the `strfry` relay.

### Zero Downtime Restarts

You can restart `strfry` without interrupting existing connections. This is useful for upgrading the software or changing settings.

Here's the basic process:

1.  Start a new `strfry` relay alongside the old one.
2.  Tell the old relay to shut down gracefully:

    ```bash
    kill -USR1 <OLD_PID>
    ```

    (Replace `<OLD_PID>` with the actual process ID of the old relay)

### Plugins

`strfry` has a plugin system that lets you customize its behavior. You can use plugins to:

*   Block certain types of events.
*   Control how events are shared with other relays.

### Router

If you're running multiple `strfry` relays, you can use the `strfry router` command to manage connections and event flow between them.

### Syncing

`strfry` has a special way of syncing data between relays. It's designed to be very efficient, even for large amounts of data.

### Compression Dictionaries

`strfry` can compress events to save space. You can create custom dictionaries to optimize compression for different types of events.

OK, let's dive deeper into some of the more technical details of how `strfry` works.

### Architecture

`strfry` is built on top of a framework called `golpe`, which provides basic services like command-line argument parsing, logging, and configuration file handling.

### Database

`strfry` uses a database called LMDB. This database is very efficient because it stores data directly in the computer's memory, making it very fast to access.

### Threads and Inboxes

`strfry` uses multiple threads, which are like mini-programs running at the same time. These threads communicate with each other through message queues and the LMDB database.

### Websocket

`strfry` uses a technology called Websockets to communicate with other relays and clients. This allows for real-time updates and efficient data transfer.

### Compression

`strfry` can compress data to reduce bandwidth usage and improve performance. It supports two types of compression: per-message and sliding-window.

### Ingester

The Ingester is responsible for processing incoming messages, including validating events and verifying signatures.

### Writer

The Writer handles writing data to the database. There's only one Writer thread to avoid conflicts.

### ReqWorker

ReqWorker threads handle requests for data from clients. They retrieve data from the database and send it to the clients.

### Filters

Filters are used to select specific events from the database. `strfry` has an optimized filter engine for efficient querying.

### DBScan

DBScan is the query engine used by ReqWorker. It's designed to take advantage of database indexes for fast retrieval of data.

### ReqMonitor

ReqMonitor watches for new events and sends them to clients who have subscribed to those types of events.

### ActiveMonitors

ActiveMonitors help optimize the monitoring of many concurrent requests by keeping track of which filters are interested in which types of events.

### Negentropy

Negentropy is a protocol for efficient synchronization of data between relays. `strfry` has a dedicated thread pool for handling negentropy requests.

### Cron

The Cron thread performs periodic maintenance tasks, like deleting old events.

### Testing

`strfry` has a comprehensive test suite, including fuzz tests that try to find bugs in the query engine.

Privacy Applications
Data control: You have complete control over your data, as it's stored locally and not shared with any third parties.
Censorship resistance: No single entity can control or censor the network, making it more resistant to censorship.
Pseudonymity: You can interact on the network without revealing your real identity.

