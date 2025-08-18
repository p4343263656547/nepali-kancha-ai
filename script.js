const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatOutput = document.getElementById("chatOutput");

sendBtn.addEventListener("click", () => {
    const message = userInput.value;
    if(message.trim() === "") return;

    const response = "Nepali Kancha AI says: " + message; // replace with real AI logic later
    const newLine = document.createElement("p");
    newLine.textContent = response;
    chatOutput.appendChild(newLine);

    userInput.value = "";
});
