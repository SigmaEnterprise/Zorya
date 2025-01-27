+++
title = "The Role of Hash Time-Locked Contracts (HTLCs) in the Lightning Network"
menu = "Blog"
date = "2025-01-27"
+++ 

#### The Role of Hash Time-Locked Contracts (HTLCs) in the Lightning Network  

Hash Time-Locked Contracts (HTLCs) are a cornerstone of the Lightning Network, enabling trustless payment channels by ensuring atomicity. This means that either all steps of a transaction are completed successfully, or none at all, which prevents scenarios like partial payments or lost funds. HTLCs achieve this by using a hash preimage as the secret that unlocks a payment. The process begins with the recipient generating a random secret number and computing its hash. This hash serves as the condition for the payment. Once the recipient reveals the preimage (the secret), all participants in the payment chain can validate the hash and claim their respective payments. You can read more about this concept [here](https://github.com/lnbook/lnbook/blob/develop/08_routing_htlcs.asciidoc).  

---

#### How Atomic MultiPath Payments (AMPs) Enhance Lightning Network Capabilities  

Atomic MultiPath Payments (AMPs) expand on the principles of HTLCs by enabling large transactions to be split across multiple payment paths, significantly improving reliability and privacy. This functionality ensures that partial payments sent through different channels are only settled once all parts of the transaction reach the recipient. By allowing payments to exceed the capacity of a single channel, AMPs eliminate the need to reuse payment hashes, which enhances path diversity and avoids potential transaction correlation. This innovation strengthens both network functionality and user anonymity. Learn more about AMPs [here](https://lists.linuxfoundation.org/pipermail/lightning-dev/2018-February/000993.html).  

AMP implementation doesn’t require fundamental protocol changes. Instead, it relies on sender-receiver negotiations using **Encrypted Onion Balances (EOBs)**. EOBs deliver additive shares of a base preimage, maintaining atomicity even for payments distributed across multiple paths. More details on EOBs can be found [here](https://lists.linuxfoundation.org/pipermail/lightning-dev/2018-April/001221.html).  

---

#### Privacy Benefits of Atomic MultiPath Payments  

AMPs significantly enhance privacy on the Lightning Network by dividing a single transaction into smaller parts that travel through different paths. This increases path diversity, making it harder for any single node to infer the origin or total amount of the payment. Furthermore, AMP transactions avoid reusing payment hashes, thereby reducing the risk of correlating transactions across different channels. By decentralizing and distributing transaction routing, AMPs help obscure the payment’s details, safeguarding user anonymity. For more information, check out the detailed explanation [here](https://lists.linuxfoundation.org/pipermail/lightning-dev/2018-February/000993.html).  

---

#### Why Multipath Payments Are Crucial for Large Transactions  

The Lightning Network’s channel capacity limits often restrict the execution of large transactions through a single channel. Multipath payments solve this issue by splitting large transactions into smaller parts that can be routed simultaneously through multiple channels. This method ensures successful transactions regardless of individual channel capacity.  

In addition to supporting larger payments, multipath payments enhance reliability by utilizing multiple available routes, reducing the likelihood of bottlenecks or failures. Privacy is also improved as no single node can view the entire transaction’s amount or path. Read more about this [here](https://github.com/lnbook/lnbook/blob/develop/10_onion_routing.asciidoc).  

---

#### The Importance of Encrypted Onion Balances (EOBs) in AMPs  

Encrypted Onion Balances (EOBs) are essential for maintaining the atomicity of payments in AMPs. They work by delivering additive shares of a base preimage within onion-encrypted layers of the network. Each partial payment carries one of these additive shares, which the recipient can combine to reconstruct the complete preimage. Payments remain locked until all shares arrive, ensuring that no partial payment can be claimed prematurely.  

EOBs add another layer of security and privacy by preventing any single routing node from gathering enough information to compromise the transaction. This advanced mechanism underpins the robust functionality of AMPs. You can find more on this [here](https://lists.linuxfoundation.org/pipermail/lightning-dev/2018-February/000993.html).  

---  

Feel free to explore more references:  
- [Understanding HTLCs](https://github.com/lnbook/lnbook/blob/develop/08_routing_htlcs.asciidoc)  
- [Lightning AMP Proposal](https://lists.linuxfoundation.org/pipermail/lightning-dev/2018-February/000993.html)  
- [EOBs and Their Role](https://lists.linuxfoundation.org/pipermail/lightning-dev/2018-April/001221.html)  
- [Onion Routing and Multipath Payments](https://github.com/lnbook/lnbook/blob/develop/10_onion_routing.asciidoc)  

### Additional Links:
- [Submarine Swaps employ hash time-locked contracts (HTLCs), which in layperson’s terms, enable two transactions (both sides of the swap) to happen simultaneously by linking them together cryptographically inside of a smart contract](https://fountain.fm/episode/a8xCuaA8YvdDwz7GrRP6)
- [Web of Trust: Navigating the Social Graph](https://www.nobsbitcoin.com/navigating-the-social-graph/)
- [EU's Encryption Report Finds Layer 2s, Private Ownership of Bitcoin 'Problematic' for Law Enforcement](https://www.nobsbitcoin.com/eu-first-encryption-report/)