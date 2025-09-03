// chatbot.js — floating chatbot with mock responses + optional API hook
(function () {
  const USE_MOCK = true; // Set to false to wire a real API in callRealAPI()

  const SAMPLE_QA = [
    { q: "What can this site do?", a: "This demo shows a floating chatbot, clean design, and an easy-to-host static site." },
    { q: "How do I integrate a real API?", a: "Open js/chatbot.js and set USE_MOCK=false, then implement callRealAPI(). Use a backend proxy to keep keys safe." },
    { q: "Can you list the features?", a: "Features: floating chatbot, responsive layout, accessible colors, no build tools, and simple deployment." },
    { q: "Who built this?", a: "NovaLabs (demo brand). Swap in your logo, copy, and links to make it yours." },
  ];

  // Simple fuzzy lookup
  function findAnswer(text) {
    const t = text.toLowerCase();
    for (const { q, a } of SAMPLE_QA) {
      const parts = q.toLowerCase().split(/\W+/).filter(Boolean);
      const hit = parts.some(p => t.includes(p));
      if (hit) return a;
    }
    return null;
  }

  // Optional: wire a real LLM endpoint here
  async function callRealAPI(userText) {
    // Example stub — replace with your own endpoint:
    // const resp = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_KEY' },
    //   body: JSON.stringify({ messages: [{ role: 'user', content: userText }] })
    // });
    // const data = await resp.json();
    // return data.reply || "Sorry, no reply.";
    await new Promise(r => setTimeout(r, 800));
    return "Real API mode is off in this demo. Flip USE_MOCK to false and wire your endpoint.";
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    children.forEach(c => node.appendChild(c));
    return node;
  }

  function messageEl(role, text) {
    return el('div', { class: 'msg ' + (role === 'user' ? 'user' : 'bot') }, [
      el('div', { class: 'bubble' , html: text })
    ]);
  }

  function chipEl(text, onClick) {
    const c = el('button', { class: 'chip', type: 'button' });
    c.textContent = text;
    c.addEventListener('click', () => onClick(text));
    return c;
  }

  function persistHistory(pageKey, arr) {
    try { localStorage.setItem(pageKey, JSON.stringify(arr)); } catch {}
  }
  function loadHistory(pageKey) {
    try { return JSON.parse(localStorage.getItem(pageKey) || '[]'); } catch { return []; }
  }

  function initChatbot() {
    const root = document.getElementById('chatbot-root');
    if (!root) return;

    const fab = el('button', { class: 'chat-fab', title: 'Chat' });
    fab.innerHTML = '💬';

    const panel = el('section', { class: 'chat-panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Chatbot' });
    const header = el('div', { class: 'chat-header' }, [
      el('div', { class: 'chat-title' }, [
        el('span', { class: 'dot' }),
        el('strong', {}, []),
      ]),
      el('button', { class: 'btn btn-ghost', type: 'button' }, [])
    ]);
    header.querySelector('strong').textContent = 'Site Assistant';
    header.querySelector('button').textContent = 'Close';

    const body = el('div', { class: 'chat-body' });
    const chips = el('div', { class: 'chips' });
    SAMPLE_QA.forEach(({ q }) => chips.appendChild(chipEl(q, handleUserMessage)));

    const inputWrap = el('form', { class: 'chat-input' });
    const input = el('input', { type: 'text', placeholder: 'Ask me something…', 'aria-label': 'Message' });
    const sendBtn = el('button', { type: 'submit' });
    sendBtn.textContent = 'Send';
    inputWrap.appendChild(input);
    inputWrap.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(chips);
    panel.appendChild(inputWrap);

    root.appendChild(fab);
    root.appendChild(panel);

    const pageKey = 'chat-history:' + location.pathname;
    let history = loadHistory(pageKey);
    if (history.length === 0) {
      history = [{ role: 'bot', content: "Hi! I’m your site assistant. Try one of the sample prompts below or ask your own question." }];
    }
    history.forEach(m => body.appendChild(messageEl(m.role, m.content)));
    body.scrollTop = body.scrollHeight;

    function setOpen(open) {
      panel.classList.toggle('open', open);
      fab.classList.toggle('hidden', open);
      if (open) input.focus();
    }

    fab.addEventListener('click', () => setOpen(true));
    header.querySelector('button').addEventListener('click', () => setOpen(false));

    inputWrap.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = (input.value || '').trim();
      if (!text) return;
      handleUserMessage(text);
      input.value = '';
    });

    
  }

  // bootstrap once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();