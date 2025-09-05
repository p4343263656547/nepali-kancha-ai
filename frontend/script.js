const API_URL = "http://localhost:3000"; // Change to your deployed backend URL later

// Google Sign-In
function handleLogin(response) {
  fetch(API_URL + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ credential: response.credential })
  }).then(() => loadUser());
}

// Load user info
function loadUser() {
  fetch(API_URL + "/auth/me", { credentials: "include" })
    .then(res => res.json())
    .then(user => {
      if (user && user.email) {
        document.getElementById("user-info").innerHTML =
          `<p>${user.name}</p><img src="${user.picture}" width="50"/>`;
        document.getElementById("logout").style.display = "block";
      }
    });
}

// Logout buttons
document.getElementById("logout").addEventListener("click", logout);
document.getElementById("logout2").addEventListener("click", logout);
function logout() {
  fetch(API_URL + "/auth/logout", { method:"POST", credentials:"include" })
    .then(() => { location.reload(); });
}

// Settings menu toggle
const settingsBtn = document.getElementById("settings-btn");
const settingsMenu = document.getElementById("settings-menu");
settingsBtn.addEventListener("click", () => {
  settingsMenu.style.display = settingsMenu.style.display === "block" ? "none" : "block";
});

// Chat
const chatInput = document.getElementById("chat-input");
const chatSection = document.getElementById("chat-section");

chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && chatInput.value.trim()) {
    const msg = chatInput.value;
    addMessage(msg, "user");
    chatInput.value = "";

    fetch(API_URL + "/api/chat", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      credentials:"include",
      body: JSON.stringify({ message: msg })
    }).then(res=>res.json()).then(data=>{
      addMessage(data.reply, "ai");
    });
  }
});

function addMessage(text, type) {
  const div = document.createElement("div");
  div.classList.add("message", type === "user" ? "user-message" : "ai-message");
  div.innerText = text;
  chatSection.appendChild(div);
  chatSection.scrollTop = chatSection.scrollHeight;
}

loadUser();
