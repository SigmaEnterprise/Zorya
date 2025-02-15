async function fetchNostrFeed(pubkey, relay = "wss://relay.damus.io") {
    const socket = new WebSocket(relay);

    socket.onopen = () => {
        const filter = {
            "kinds": [1],  // Kind 1 = Text Notes
            "authors": npub16d8gxt2z4k9e8sdpc0yyqzf5gp0np09ls4lnn630qzxzvwpl0rgq5h4rzv,  
            "limit": 5
        };
        socket.send(JSON.stringify(["REQ", "nostr-feed", filter]));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data[0] !== "EVENT") return;

        const eventContent = data[2];
        const postContainer = document.getElementById("nostr-feed");
        const postElement = document.createElement("div");
        postElement.innerHTML = `<p>${eventContent.content}</p><hr>`;
        postContainer.appendChild(postElement);
    };
}