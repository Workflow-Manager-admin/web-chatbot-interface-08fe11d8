/* eslint-env browser */
/* global setTimeout */
import './style.css';

// SVGs for icons
const robotSVG = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="18" fill="#F5F5F7"/><rect x="9" y="13" width="18" height="12" rx="6" fill="#6F5CF1"/><ellipse cx="14.5" cy="19.5" rx="2" ry="2.5" fill="#fff"/><ellipse cx="21.5" cy="19.5" rx="2" ry="2.5" fill="#fff"/><rect x="13.5" y="11" width="9" height="4" rx="2" fill="#fff"/><circle cx="10.5" cy="17" r="1.5" fill="#6F5CF1"/><circle cx="25.5" cy="17" r="1.5" fill="#6F5CF1"/></svg>`;
const userSVG = `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#e5e7eb"/><circle cx="16" cy="14" r="6" fill="#6F5CF1"/><ellipse cx="16" cy="24" rx="8" ry="4" fill="#bcbfe6"/></svg>`;
const paperclipSVG = `<svg viewBox="0 0 20 20" width="20" height="20" fill="none"><path d="M5 11V7a5 5 0 0 1 10 0v6a4 4 0 0 1-8 0V8" stroke="#6F5CF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="7" r="0.5" fill="#6F5CF1"/></svg>`;
const sendSVG = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15.33 22.66C15.13 23.21 14.41 23.21 14.21 22.66L11 13 1.34 9.79c-.55-.2-.55-.92 0-1.12L22 2z"/></svg>`;

const tabNames = ["Chat", "Browse FAQs"];
let activeTab = 0;

// Demo messages, replace with real data/integration later
let messages = [
  {
    sender: "bot",
    text: "Hello! How can I assist you today?",
    time: "09:23 AM"
  },
  {
    sender: "user",
    text: "What are your hours?",
    time: "09:24 AM"
  },
  {
    sender: "bot",
    text: "I am available 24/7 to answer your questions.",
    time: "09:24 AM"
  }
];

function formatTime(date = new Date()) {
  // Returns "hh:mm AM/PM"
  let hrs = date.getHours();
  let mins = date.getMinutes();
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  hrs = hrs % 12 || 12;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

function renderHeader() {
  return `
    <header class="cb-header">
      <span class="cb-avatar" aria-label="Bot avatar">${robotSVG}</span>
      <div class="cb-header-titles">
        <div class="cb-title">AI Assistant</div>
        <div class="cb-subtext">Online &middot; Instant replies</div>
      </div>
      <button class="cb-clear-btn" aria-label="Clear chat" tabindex="0">Clear</button>
    </header>
  `;
}

function renderTabs() {
  return `
    <nav class="cb-tabs" role="tablist">
      ${tabNames.map((tab, i) =>
        `<span class="cb-tab${i === activeTab ? ' active' : ''}" role="tab" aria-selected="${i === activeTab}" tabindex="0" data-tabidx="${i}">${tab}</span>`
      ).join('')}
    </nav>
  `;
}

function renderMessagesArea() {
  if (activeTab === 1) {
    // FAQ Example (could be improved with real data)
    return `<main class="cb-messages faqs">
      <div class="cb-faq-list">
        <div class="cb-faq-q">Q: How do I reset my password?</div>
        <div class="cb-faq-a">A: Click "Forgot password" at the login screen and follow the instructions.</div>
        <div class="cb-faq-q">Q: What can this chatbot do?</div>
        <div class="cb-faq-a">A: Answer general questions and help you navigate our services.</div>
      </div>
    </main>`;
  }
  return `<main class="cb-messages" id="cb-messages-main">
    ${messages.map(renderMessageBubble).join('')}
  </main>`;
}

function renderMessageBubble(msg) {
  if (msg.sender === "bot") {
    return `
      <div class="cb-message-row bot">
        <span class="cb-msg-avatar" aria-label="Bot avatar">${robotSVG}</span>
        <div class="cb-msg-group">
          <div class="cb-msg-bubble bot">${msg.text}</div>
          <time class="cb-msg-time bot">${msg.time}</time>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="cb-message-row user">
        <div class="cb-msg-group">
          <div class="cb-msg-bubble user">${msg.text}</div>
          <time class="cb-msg-time user">${msg.time}</time>
        </div>
        <span class="cb-msg-avatar" aria-label="User avatar">${userSVG}</span>
      </div>
    `;
  }
}

function renderComposer() {
  return `
    <footer class="cb-composer" id="cb-composer">
      <button class="cb-attach-btn" aria-label="Attach file" tabindex="0" type="button">${paperclipSVG}</button>
      <input class="cb-input" id="cb-input" type="text" placeholder="Type your question..." aria-label="Chat message input" autocomplete="off" maxlength="500"/>
      <button class="cb-send-btn" id="cb-send-btn" aria-label="Send message" tabindex="0" type="button">
        ${sendSVG}
      </button>
      <div class="cb-helptext">Press Enter to send &middot; AI-powered responses.</div>
    </footer>
  `;
}

function renderChatbotUI() {
  return `
    <div class="chatbot-container" role="main">
      ${renderHeader()}
      ${renderTabs()}
      ${renderMessagesArea()}
      ${renderComposer()}
    </div>
  `;
}

// Initial rendering
document.getElementById("app").innerHTML = renderChatbotUI();
focusInput();

// --- Interactivity ---

// Add event listeners for all dynamic controls after DOM paint
function addEventListeners() {
  // Tab switching
  document.querySelectorAll(".cb-tab").forEach(tab => {
    tab.addEventListener("click", tabSwitchHandler);
    tab.addEventListener("keydown", e => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        tabSwitchHandler.call(tab, e);
      }
    });
  });

  // Clear chat
  const clearBtn = document.querySelector(".cb-clear-btn");
  if (clearBtn) clearBtn.onclick = () => {
    if (activeTab !== 0) return;
    messages = [];
    rerenderMainArea();
    focusInput();
  };

  // Send message button
  const sendBtn = document.getElementById("cb-send-btn");
  if (sendBtn) sendBtn.onclick = sendMessageHandler;

  // Keyboard: send on Enter in input, not Shift+Enter
  const input = document.getElementById("cb-input");
  if (input) {
    input.onkeydown = (e) => {
      if (e.key === "Enter" && !e.shiftKey && !input.disabled) {
        e.preventDefault();
        sendMessageHandler();
      }
    };
    input.oninput = () => {
      setSendButtonState();
    };
  }

  // Attach button (currently no file logic)
  const attachBtn = document.querySelector(".cb-attach-btn");
  if (attachBtn) {
    attachBtn.onkeydown = function(event) {
      if (event.key === " " || event.key === "Enter") { event.preventDefault(); }
    };
  }
  setSendButtonState();

  // Focus style for accessibility:
  document.querySelectorAll('button, input, .cb-tab').forEach(el => {
    el.onfocus = function() { this.classList.add('focus'); };
    el.onblur = function() { this.classList.remove('focus'); };
  });
}

function tabSwitchHandler() {
  const idx = +this.getAttribute('data-tabidx');
  if (typeof idx === "number" && idx !== activeTab) {
    activeTab = idx;
    rerenderMainArea(true);
    focusInput();
  }
}

function rerenderMainArea(full = false) {
  // For tab switch or clear only
  if (full) {
    document.getElementById("app").innerHTML = renderChatbotUI();
    addEventListeners();
  } else {
    document.querySelector(".cb-messages").innerHTML = messages.map(renderMessageBubble).join('');
    focusInput();
  }
}

function sendMessageHandler() {
  const input = document.getElementById("cb-input");
  if (!input) return;
  const value = input.value.trim();
  if (value.length === 0) return;
  const now = formatTime();
  messages.push({ sender: "user", text: value, time: now });
  document.querySelector(".cb-messages").innerHTML = messages.map(renderMessageBubble).join('');
  input.value = "";
  setSendButtonState();
  focusInput();
  scrollMessagesToBottom();

  // Fake bot reply for demo
  setTimeout(() => {
    messages.push({ sender: "bot", text: "You asked: " + value, time: formatTime() });
    rerenderMainArea();
    scrollMessagesToBottom();
  }, 600);
}

function setSendButtonState() {
  const input = document.getElementById("cb-input");
  const btn = document.getElementById("cb-send-btn");
  if (btn && input) {
    btn.disabled = !input.value.trim();
    btn.classList.toggle("disabled", !input.value.trim());
  }
}

function focusInput() {
  setTimeout(() => {
    const input = document.getElementById("cb-input");
    if (input) input.focus();
  }, 50);
}

function scrollMessagesToBottom() {
  setTimeout(() => {
    const area = document.getElementById("cb-messages-main");
    if (area) area.scrollTop = area.scrollHeight + 500;
  }, 100);
}

// Initial interactive setup
addEventListeners();

// Accessibility: allow tab switching, message sending, and clear via keyboard as well.
