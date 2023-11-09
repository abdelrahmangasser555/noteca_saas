(function () {
  document.head.insertAdjacentHTML(
    "beforeend",
    '<link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css" rel="stylesheet">'
  );

  // Inject the CSS
  const style = document.createElement("style");
  style.innerHTML = `
		.hidden {
			display: none;
		}
		#chat-widget-container {
			position: fixed;
			bottom: 20px;
			right: 20px;
			flex-direction: column;
		}
		#chat-popup {
			height: 70vh;
			max-height: 70vh;
			transition: all 0.3s;
			overflow: hidden;
		}
		@media (max-width: 768px) {
			#chat-popup {
				position: fixed;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 100%;
				max-height: 100%;
				border-radius: 0;
			}
		}

		@keyframes move-up-down {
			0%, 100% {
				transform: translateY(0);
			}
			50% {
				transform: translateY(-8px);
			}
		}
		
		.animate-dot-1 {
			animation: move-up-down 1s infinite 0.1s;
		}
		
		.animate-dot-2 {
			animation: move-up-down 1s infinite 0.2s;
		}
		
		.animate-dot-3 {
			animation: move-up-down 1s infinite 0.3s;
		}

		.max-width70 {
			max-width: 80%;
		}
		
		`;

  document.head.appendChild(style);

  // Create chat widget container
  const chatWidgetContainer = document.createElement("div");
  chatWidgetContainer.id = "chat-widget-container";
  document.body.appendChild(chatWidgetContainer);

  // Inject the HTML
  chatWidgetContainer.innerHTML = `
			<div id="chat-bubble" class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer text-3xl">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
				</svg>
			</div>
			<div id="chat-popup" class="hidden absolute bottom-20 right-0 w-96 bg-white rounded-md shadow-md flex flex-col transition-all text-sm">
				<div id="chat-header" class="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-md">
					<h3 class="m-0 text-lg">Manufacturing Chat Agent</h3>
					<button id="close-popup" class="bg-transparent border-none text-white cursor-pointer">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div id="chat-messages" class="flex-1 p-4 overflow-y-auto"></div>
				<div id="chat-input-container" class="p-4 border-t border-gray-200">
					<div class="flex space-x-4 items-center">
						<input type="text" id="chat-input" class="flex-1 border border-gray-300 rounded-md px-4 py-2 outline-none w-3/4" placeholder="Type your message...">
						<button id="chat-submit" class="bg-gray-800 text-white rounded-md px-4 py-2 cursor-pointer">Send</button>
					</div>
					<div class="flex text-center text-xs pt-4">
						<button id="clear-chat" class="bg-transparent border-none text-red-500 cursor-pointer">Clear Chat</button>
					</div>
				</div>
			</div>
		`;

  // Add event listeners
  const chatInput = document.getElementById("chat-input");
  const chatSubmit = document.getElementById("chat-submit");
  const chatMessages = document.getElementById("chat-messages");
  const chatBubble = document.getElementById("chat-bubble");
  const chatPopup = document.getElementById("chat-popup");
  const closePopup = document.getElementById("close-popup");
  const clearChat = document.getElementById("clear-chat");

  chatSubmit.addEventListener("click", function () {
    const message = chatInput.value.trim();
    if (!message) return;

    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = "";

    onUserRequest(message);
  });

  chatInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      chatSubmit.click();
    }
  });

  chatBubble.addEventListener("click", function () {
    togglePopup();
  });

  closePopup.addEventListener("click", function () {
    togglePopup();
  });

  function togglePopup() {
    const chatPopup = document.getElementById("chat-popup");
    chatPopup.classList.toggle("hidden");
    if (!chatPopup.classList.contains("hidden")) {
      document.getElementById("chat-input").focus();
      // scroll to bottom
      const chatMessages = document.getElementById("chat-messages");
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  clearChat.addEventListener("click", function () {
    messages = [];
    localStorage.setItem("userID", generateUUID());
    localStorage.setItem("chatMessages", JSON.stringify([]));
    chatMessages.innerHTML = "";
  });

  let messages = localStorage.getItem("chatMessages");
  let userID = localStorage.getItem("userID");

  // If no messages found, create a new UUID and an empty array for messages
  if (!messages) {
    userID = generateUUID();
    messages = [];
    localStorage.setItem("userID", userID);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  } else {
    messages = JSON.parse(messages);
  }

  // async function fetchWithTimeout(resource, options) {
  //   const { timeout = 120000 } = options;

  //   const controller = new AbortController();

  //   const id = setTimeout(() => controller.abort(), timeout);

  //   const response = await fetch(resource, {
  //     ...options,
  //     signal: controller.signal
  //   });
  //   clearTimeout(id);

  //   const data = await response.json();
  //   console.log(data);
  //   // check if data is not empty, if empty, try again
  //   if(data.answer){
  //     return data.answer;
  //   }
  //   else{
  //     return fetchWithTimeout(resource, options);
  //   }
  // }

  // async function fetchWithTimeout(resource, options) {

  // 	try {

  // 		const response = await axios.post(resource, options, {
  // 			timeout: 120000 // Set the timeout for 2 minutes (120,000 milliseconds)
  // 		});

  // 		const data = response.data;
  // 		console.log(data);

  // 		// Check if data is not empty; if empty, retry the request
  // 		if (data.answer) {
  // 			return data.answer;
  // 		} else {
  // 			return fetchWithTimeout(resource, options);
  // 		}
  // 	} catch (error) {
  // 		if (axios.isCancel(error)) {
  // 			// Handle timeout or abort scenario
  // 			console.log('Request timed out or aborted');
  // 			// You can handle retry or specific timeout-related actions here
  // 			// For example, retry fetchWithTimeout(resource, options);
  // 		} else {
  // 			// Handle other errors
  // 			console.error('Error:', error);
  // 			throw error; // Throw the error to maintain consistency in error handling
  // 		}
  // 	}
  // }

  // async function fetchWithTimeout(resource, options) {
  // 	try {
  // 		const response = await axios({
  // 			method: 'post',
  // 			url: resource,
  // 			data: options,
  // 			timeout: 120000,
  // 			responseType: 'stream'
  // 		});

  // 		const data = response.data;

  // 		// Check if data is not empty; if empty, retry the request
  // 		if (data.answer) {
  // 			return data.answer;
  // 		} else {
  // 			return fetchWithTimeout(resource, options);
  // 		}
  // 	} catch (error) {
  // 		if (axios.isCancel(error)) {
  // 			// Handle timeout or abort scenario
  // 			console.log('Request timed out or aborted');
  // 			// You can handle retry or specific timeout-related actions here
  // 			// For example, retry fetchWithTimeout(resource, options);
  // 		} else {
  // 			// Handle other errors
  // 			console.error('Error:', error);
  // 			throw error; // Throw the error to maintain consistency in error handling
  // 		}
  // 	}
  // }

  async function fetchWithTimeout(resource, options) {
    try {
      // send a post request with fetch
      const response = await fetch(resource, {
        method: "POST",
        body: JSON.stringify(options),
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 120000,
      });

      // check if response is ok
      if (response.ok) {
        return response.body.getReader();
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error; // Throw the error to maintain consistency in error handling
    }
  }

  function onUserRequest(message) {
    // Handle user request here
    console.log("User request:", message);

    //url: https://wunvu7arb4.execute-api.us-west-1.amazonaws.com/manufacturing
    // send a post request with json {question, session_id}
    // receive a json response {answer}
    // keep trying until the answer is not empty

    // const url = 'https://wunvu7arb4.execute-api.us-west-1.amazonaws.com/manufacturing';
    // const url = 'https://gk2t3n5zt2g73bdnofjnou7u7m0oadaq.lambda-url.us-west-1.on.aws/';
    // localhost on port 5000
    const url = "http://localhost:8000/stream";
    // const url = 'https://wunvu7arb4.execute-api.us-west-1.amazonaws.com/test';
    const data = { question: message, session_id: userID };

    // fetchWithTimeout(url, data
    // 	// method: 'POST',
    // 	// body: JSON.stringify(data),
    // 	// headers: {
    // 	//   'Content-Type': 'application/json'
    // 	// },
    // 	// timeout: 120000
    // // })
    // )
    // 	.then((data) => {
    // 		messages.push({ user: userID, type: 'user', text: message, timestamp: new Date() });
    // 		localStorage.setItem('chatMessages', JSON.stringify(messages));
    // 		reply(data);
    // 	})
    // 	.catch((error) => {
    // 		reply("An Error Occured. Please try again");
    // 	});

    // listen to the stream response

    let fullResponse = "";
    let removedDots = false;
    const replyElement = document.createElement("div");
    replyElement.className = "flex mb-3";

    fetchWithTimeout(url, data)
      .then((reader) => {
        return readData();
        function readData() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              // console.log('Stream complete');
              // console.log(fullResponse);
              return fullResponse;
            }
            // convert Uint8Array to string
            value = new TextDecoder("utf-8").decode(value);
            fullResponse += value;
            console.log(fullResponse);

            if (!removedDots) {
              // remove dots reply from the bot (all of them) (because sometimes there are multiple dots replies)
              const dotsElements = document.getElementsByClassName(
                "flex justify-start mb-3"
              );
              for (let i = 0; i < dotsElements.length; i++) {
                dotsElements[i].remove();
              }

              // read the stream
              // create the chat bubble for reply and pass it to the readData function
              const chatMessages = document.getElementById("chat-messages");
              chatMessages.appendChild(replyElement);
              removedDots = true;
            }

            const fullResponseFormatted = fullResponse.replace(/\n/g, "<br>");

            replyElement.innerHTML = `
								<div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-width70">
									${fullResponseFormatted}
								</div>
							`;

            return readData();
          });
        }
      })
      .then((data) => {
        messages.push({
          user: userID,
          type: "user",
          text: message,
          timestamp: new Date(),
        });
        localStorage.setItem("chatMessages", JSON.stringify(messages));

        messages.push({
          user: "bot",
          type: "bot",
          text: data,
          timestamp: new Date(),
        });
        localStorage.setItem("chatMessages", JSON.stringify(messages));
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Display user message
    const messageElement = document.createElement("div");
    messageElement.className = "flex justify-end mb-3";

    const formattedMessage = message.replace(/\n/g, "<br>");

    messageElement.innerHTML = `
				<div class="bg-gray-800 text-white rounded-lg py-2 px-4 max-width70">
					${formattedMessage}
				</div>
			`;
    chatMessages.appendChild(messageElement);

    // add dots reply from the bot
    const dotsElement = document.createElement("div");
    dotsElement.className = "flex justify-start mb-3";

    dotsElement.innerHTML = `
			<div class="flex items-center justify-center mt-8">
			<div class="flex space-x-2">
				<div class="h-2 w-2 bg-gray-700 rounded-full animate-dot-1"></div>
				<div class="h-2 w-2 bg-gray-700 rounded-full animate-dot-2"></div>
				<div class="h-2 w-2 bg-gray-700 rounded-full animate-dot-3"></div>
			</div>
		</div>
			`;
    chatMessages.appendChild(dotsElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = "";
  }

  function reply(message) {
    // remove dots reply from the bot (all of them) (because sometimes there are multiple dots replies)
    const dotsElements = document.getElementsByClassName(
      "flex justify-start mb-3"
    );
    for (let i = 0; i < dotsElements.length; i++) {
      dotsElements[i].remove();
    }

    messages.push({
      user: "bot",
      type: "bot",
      text: message,
      timestamp: new Date(),
    });
    localStorage.setItem("chatMessages", JSON.stringify(messages));

    const chatMessages = document.getElementById("chat-messages");
    const replyElement = document.createElement("div");
    replyElement.className = "flex mb-3";

    const formattedMessage = message.replace(/\n/g, "<br>");

    replyElement.innerHTML = `
				<div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-width70">
					${formattedMessage}
				</div>
			`;
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function loadMessages() {
    // Retrieve stored messages from localStorage
    messages = JSON.parse(localStorage.getItem("chatMessages"));

    if (messages) {
      // Loop through messages and display them in the chat UI
      messages.forEach((msg) => {
        const chatMessages = document.getElementById("chat-messages");
        const messageElement = document.createElement("div");

        // Create and display message elements in the chat UI
        // Adjust this part based on your existing UI code structure
        messageElement.className =
          msg.type === "user" ? "flex justify-end mb-3" : "flex mb-3";
        messageElement.innerHTML = `
						<div class="${
              msg.type === "user"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-black"
            } rounded-lg py-2 px-4 max-width70">
							${msg.text}
						</div>
					`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    }
  }

  // Call the function to load messages when the website loads
  window.onload = loadMessages;
})();
