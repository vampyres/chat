(function(){

    const chatContainer = document.querySelector(".chat-container");
    const socket = io();

    let uname = "User_" + Date.now();
    let alias = chatContainer.querySelector("#username").value.trim();

    let tmp = chatContainer.querySelector("#username").value.trim();
    
    if (tmp.length == 0){
        alias = "User";   
    }

    console.log(alias);



    let fullusr = uname + " (" + alias + ")"; // Initialize fullusr with default value

    console.log(uname);
    console.log(alias);
    console.log(fullusr);

    chatContainer.querySelector(".editable-username #username").addEventListener("input", function(){
        let username = chatContainer.querySelector("#username").value.trim();
        if (username.length == 0){
            return;
        }

        alias = chatContainer.querySelector("#username").value.trim();
        fullusr = uname + " (" + alias + ")"; // Update fullusr when alias changes

        // Emit newuser event after updating fullusr with the alias
    });

    // Emit newuser event with the default fullusr value when the page loads
    socket.emit("newuser", uname);

    chatContainer.querySelector(".chat-form #new-message").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    socket.on("update",function(data){
        renderMessage("update", data);
    });
    socket.on("chat",function(message){
        renderMessage("other",{
            user: message.user,
            text: message.text
        });
    });

    function sendMessage() {
        let messageInput = chatContainer.querySelector(".chat-form #new-message");
        let message = messageInput.value.trim();
        if (message.length == 0){
            return;
        }
        renderMessage("my",{
            user: fullusr,
            text: message
        });
        socket.emit("chat",{
            user: fullusr,
            text: message
        });
        messageInput.value = "";
    }

    function renderMessage(type,message){
        let messageContainer = chatContainer.querySelector(".chat-wrapper #chat");
        if (type=="my"){
            let el = document.createElement("div");
            el.setAttribute("class","message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.user}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == "other"){
            let el = document.createElement("div");
            el.setAttribute("class","message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.user}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class","status");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        // Scroll chat to the bottom
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

})();
