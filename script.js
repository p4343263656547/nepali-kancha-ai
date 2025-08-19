// Settings
const settingsBtn = document.getElementById('settingsBtn');
const panel = document.getElementById('panel');
const closePanel = document.getElementById('closePanel');
const darkToggle = document.getElementById('darkToggle');

settingsBtn.addEventListener('click', ()=> panel.classList.add('show'));
closePanel.addEventListener('click', ()=> panel.classList.remove('show'));

darkToggle.addEventListener('change', (e)=>{
  document.body.style.background = e.target.checked
    ? getComputedStyle(document.documentElement).getPropertyValue('--bg')
    : '#0b1220';
});

// Demo login
document.getElementById('loginBtn').addEventListener('click', ()=>{
  const name = prompt('Enter your name:');
  if(name){ document.querySelector('.login span').textContent = name; }
});

// Chat system
const messages = document.getElementById('messages');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function addMessage(text, type){
  const msg = document.createElement('div');
  msg.className = 'message ' + type;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

sendBtn.addEventListener('click', ()=>{
  const text = input.value.trim();
  if(!text) return;
  addMessage(text, 'user');
  input.value = '';
  setTimeout(()=> addMessage("Kancha says: " + text, 'bot'), 600);
});

input.addEventListener('keypress', (e)=>{
  if(e.key === 'Enter'){ sendBtn.click(); }
});

// Voice input
const voiceBtn = document.getElementById('voiceBtn');
let recognition;
if('webkitSpeechRecognition' in window){
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event)=>{
    const transcript = event.results[0][0].transcript;
    addMessage(transcript, 'user');
    setTimeout(()=> addMessage("Kancha heard: " + transcript, 'bot'), 600);
  };

  voiceBtn.addEventListener('click', ()=>{
    recognition.start();
    addMessage("[listening...]", 'bot');
  });
}else{
  voiceBtn.style.opacity = .4;
  voiceBtn.title = "Speech API not supported";
}
