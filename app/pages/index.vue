<template>
  <div class="shell">
    <!-- Background: deep space, starfield, central light pillar, horizon glow -->
    <div class="bg-space" aria-hidden="true">
      <div class="stars stars-1" />
      <div class="stars stars-2" />
      <div class="stars stars-3" />
      <div class="light-pillar" />
      <div class="horizon" />
      <div class="horizon-glow" />
    </div>

    <header class="nav">
      <a class="brand" href="#">
        <span class="brand-mark" aria-hidden="true" />
        <span class="brand-name">Spherecast</span>
      </a>

      <nav class="nav-links">
        <a href="#solution">Solution</a>
        <a href="#benefits">Benefits</a>
        <a href="#features">Features</a>
        <a href="#customers">Customers</a>
        <a href="#blog">Blog</a>
        <a href="#careers">Careers</a>
      </nav>

      <div class="nav-cta">
        <a class="nav-login" href="#">Log In</a>
        <button type="button" class="pill-btn pill-btn-outline">
          <span>Book a Demo</span>
          <span class="sphere sphere-sm" aria-hidden="true" />
        </button>
      </div>
    </header>

    <main class="container">
      <section class="hero">
        <div class="hero-copy">
          <h1 class="hero-title">
            The AI Supply Chain Manager<br />for Omni-Channel CPG Brands
          </h1>

          <p class="hero-sub">
            Swap components in seconds. Ask the agent for an alternative
            ingredient — it queries your internal catalog and returns a
            grounded recommendation. No spreadsheets. No extra headcount.
          </p>

          <div class="hero-badges">
            <span class="badge">
              <span class="badge-icon badge-icon-yc">Y</span>
              Backed by Y-Combinator
            </span>
            <span class="badge-dot" />
            <span class="badge">
              <span class="badge-icon badge-icon-link" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </span>
              Integrates with ERP & Data Warehouse
            </span>
          </div>

          <div class="hero-cta">
            <button
              type="button"
              class="pill-btn pill-btn-outline"
              @click="scrollToChat"
            >
              <span>Try the agent</span>
              <span class="sphere sphere-sm" aria-hidden="true" />
            </button>
          </div>
        </div>

        <aside class="hero-video" aria-label="Launch video">
          <div class="video-frame">
            <div class="video-thumb" />
            <button type="button" class="video-play" aria-label="Play video">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
          <span class="video-label">Watch launch video</span>
        </aside>
      </section>

      <section id="chat" ref="chatSection" class="chat-section">
        <div class="chat-head">
          <div>
            <span class="eyebrow">Live agent</span>
            <h2>Ask for an alternative component.</h2>
          </div>
          <div class="chat-status">
            <span class="status-dot" />
            Connected to <code>/agent/request</code>
          </div>
        </div>

        <div class="chat-card">
          <div class="messages">
            <div
              v-for="item in messages"
              :key="item.id"
              :class="['message-row', `message-row-${item.role}`]"
            >
              <div :class="['bubble', `bubble-${item.role}`]">
                <span class="bubble-label">
                  {{ item.role === 'user' ? 'You' : 'Spherecast Agent' }}
                </span>
                <p>{{ item.text }}</p>
              </div>
            </div>

            <div v-if="isLoading" class="message-row message-row-assistant">
              <div class="bubble bubble-assistant bubble-loading">
                <span class="bubble-label">Spherecast Agent</span>
                <div class="loading-line">
                  <NSpin size="small" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          </div>

          <form class="composer" @submit.prevent="sendMessage">
            <NInput
              v-model:value="draft"
              type="textarea"
              placeholder="Ask for an alternative ingredient or component..."
              :autosize="{ minRows: 3, maxRows: 6 }"
              :disabled="isLoading"
              @keydown.enter.exact.prevent="sendMessage"
            />

            <div class="composer-footer">
              <span class="hint">
                Thread <code>1</code> · press <kbd>Enter</kbd> to send
              </span>
              <button
                type="submit"
                class="pill-btn pill-btn-outline"
                :disabled="isLoading"
              >
                <span>{{ isLoading ? 'Sending...' : 'Send request' }}</span>
                <span class="sphere sphere-sm" aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section id="features" class="features">
        <div class="feature">
          <div class="feature-icon">
            <span class="sphere sphere-xs" aria-hidden="true" />
          </div>
          <h3>Grounded answers</h3>
          <p>
            Every recommendation is tied to your catalog of raw materials and
            finished goods — no hallucinated suppliers.
          </p>
        </div>
        <div class="feature">
          <div class="feature-icon">
            <span class="sphere sphere-xs" aria-hidden="true" />
          </div>
          <h3>One-message swaps</h3>
          <p>
            Drop a component ID and SKU — the agent returns a ranked list of
            alternates with rationale.
          </p>
        </div>
        <div class="feature">
          <div class="feature-icon">
            <span class="sphere sphere-xs" aria-hidden="true" />
          </div>
          <h3>Built for operators</h3>
          <p>
            A chat surface your procurement and R&amp;D teams can actually
            use — no SQL, no dashboards to maintain.
          </p>
        </div>
      </section>

      <footer class="footer">
        <span>© 2026 Spherecast · Ingredient Agent demo</span>
        <span>Powered by a local agent at <code>/agent/request</code></span>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { NInput, NSpin } from 'naive-ui'

type Role = 'user' | 'assistant'

type ChatMessage = {
  id: number
  role: Role
  text: string
}

const initialPrompt =
  'I would like to find another component instead of RM-C28-glycerin-85e43afb from Ingredion company in FG-iherb-10421 product'

const draft = ref(initialPrompt)
const isLoading = ref(false)
const nextId = ref(2)
const chatSection = ref<HTMLElement | null>(null)

const messages = ref<ChatMessage[]>([
  {
    id: 1,
    role: 'assistant',
    text: 'Paste a component question below and I will ask the local agent for an alternative.'
  }
])

const appendMessage = (role: Role, text: string) => {
  messages.value.push({ id: nextId.value++, role, text })
}

const scrollToChat = () => {
  chatSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const sendMessage = async () => {
  const message = draft.value.trim()

  if (!message || isLoading.value) {
    return
  }

  appendMessage('user', message)
  draft.value = ''
  isLoading.value = true

  try {
    const response = await $fetch<{ answer: string }>('/api/agent-request', {
      method: 'POST',
      body: { thread_id: '1', message }
    })

    appendMessage('assistant', response.answer)
  } catch (error) {
    const fallback =
      error instanceof Error
        ? error.message
        : 'The request failed before the agent returned a response.'

    appendMessage('assistant', fallback)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  isolation: isolate;
  color: #e7ecf5;
}

/* ---------------- Background ---------------- */
.bg-space {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(
      ellipse 100% 60% at 50% 110%,
      rgba(180, 210, 255, 0.35) 0%,
      rgba(100, 150, 240, 0.15) 18%,
      rgba(5, 7, 13, 0) 55%
    ),
    linear-gradient(180deg, #05070d 0%, #06090f 55%, #080c18 100%);
}

/* Starfield (three layered radial-gradient dot patterns) */
.stars {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  opacity: 0.55;
  mix-blend-mode: screen;
  pointer-events: none;
}

.stars-1 {
  background-image: radial-gradient(
    1px 1px at 20px 30px,
    rgba(255, 255, 255, 0.9),
    transparent 60%
  );
  background-size: 180px 180px;
}
.stars-2 {
  background-image: radial-gradient(
    1px 1px at 80px 120px,
    rgba(200, 220, 255, 0.7),
    transparent 60%
  );
  background-size: 260px 260px;
  opacity: 0.4;
}
.stars-3 {
  background-image: radial-gradient(
    1.5px 1.5px at 150px 60px,
    rgba(255, 255, 255, 0.85),
    transparent 60%
  );
  background-size: 340px 340px;
  opacity: 0.35;
}

/* Central vertical light pillar rising from horizon */
.light-pillar {
  position: absolute;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 110%;
  background: linear-gradient(
    180deg,
    rgba(160, 200, 255, 0) 0%,
    rgba(160, 200, 255, 0.35) 30%,
    rgba(200, 225, 255, 0.95) 80%,
    rgba(255, 255, 255, 1) 100%
  );
  box-shadow:
    0 0 30px 4px rgba(160, 200, 255, 0.45),
    0 0 120px 20px rgba(90, 150, 240, 0.35);
  filter: blur(0.3px);
}

/* Sunrise-like horizon glow at the bottom */
.horizon-glow {
  position: absolute;
  left: 50%;
  bottom: -40%;
  transform: translateX(-50%);
  width: 140%;
  height: 90%;
  background: radial-gradient(
    ellipse 60% 50% at 50% 30%,
    rgba(220, 235, 255, 0.75) 0%,
    rgba(140, 190, 255, 0.35) 25%,
    rgba(60, 100, 200, 0.12) 50%,
    rgba(5, 7, 13, 0) 70%
  );
  filter: blur(20px);
}

.horizon {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 22%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(120, 170, 255, 0) 0%,
    rgba(180, 210, 255, 0.6) 45%,
    rgba(255, 255, 255, 0.9) 50%,
    rgba(180, 210, 255, 0.6) 55%,
    rgba(120, 170, 255, 0) 100%
  );
  filter: blur(0.5px);
  opacity: 0.7;
}

/* ---------------- Navigation ---------------- */
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 20px 56px;
  background: transparent;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter Tight', Inter, sans-serif;
  font-weight: 500;
  font-size: 1.35rem;
  letter-spacing: -0.02em;
  color: #f2f5fb;
}

.brand-mark {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background:
    radial-gradient(
      circle at 32% 28%,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(200, 220, 255, 0.9) 25%,
      rgba(120, 170, 240, 0.9) 55%,
      rgba(20, 40, 90, 1) 100%
    );
  box-shadow:
    inset -4px -5px 12px rgba(0, 0, 0, 0.55),
    inset 3px 3px 8px rgba(255, 255, 255, 0.25),
    0 0 0 1px rgba(160, 200, 255, 0.25);
}

.nav-links {
  display: flex;
  gap: 30px;
  margin-left: 48px;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #c8cfdc;
}

.nav-links a {
  transition: color 0.15s ease;
}

.nav-links a:hover {
  color: #ffffff;
}

.nav-cta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 26px;
}

.nav-login {
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #c8cfdc;
  transition: color 0.15s ease;
}

.nav-login:hover {
  color: #ffffff;
}

/* ---------------- Pill buttons (outlined) ---------------- */
.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px 12px 22px;
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: transparent;
  color: #ffffff;
  white-space: nowrap;
}

.pill-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.pill-btn-outline:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.55);
  transform: translateY(-1px);
}

/* ---------------- Sphere decoration ---------------- */
.sphere {
  border-radius: 999px;
  background:
    radial-gradient(
      circle at 32% 28%,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(200, 220, 255, 0.9) 25%,
      rgba(110, 160, 235, 0.9) 55%,
      rgba(15, 30, 70, 1) 100%
    );
  box-shadow:
    inset -4px -5px 12px rgba(0, 0, 0, 0.5),
    inset 3px 3px 8px rgba(255, 255, 255, 0.22);
}

.sphere-xs {
  width: 12px;
  height: 12px;
}

.sphere-sm {
  width: 18px;
  height: 18px;
}

/* ---------------- Layout ---------------- */
.container {
  width: min(1280px, 100%);
  margin: 0 auto;
  padding: 0 56px 80px;
}

/* ---------------- Hero ---------------- */
.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 48px;
  align-items: end;
  padding: 120px 0 160px;
  min-height: calc(100vh - 80px);
}

.hero-copy {
  max-width: 900px;
}

.hero-title {
  margin: 0 0 28px;
  font-family: 'Inter Tight', Inter, sans-serif;
  font-size: clamp(2.6rem, 5.6vw, 5rem);
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-weight: 500;
  color: #e6eefb;
}

.hero-sub {
  margin: 0 0 32px;
  max-width: 56ch;
  font-size: 1.08rem;
  line-height: 1.55;
  font-weight: 400;
  color: #c2cada;
}

.hero-badges {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 36px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.74rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #c8cfdc;
}

.badge-dot {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: rgba(200, 207, 220, 0.4);
}

.badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 700;
  font-family: 'Inter Tight', sans-serif;
}

.badge-icon-yc {
  background: #f26625;
  color: #fff;
  letter-spacing: 0;
}

.badge-icon-link {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #c8cfdc;
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

/* ---------------- Video card ---------------- */
.hero-video {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}

.video-frame {
  position: relative;
  width: 200px;
  height: 130px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #0a1020;
}

.video-thumb {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 55% 45%,
      #3a4a66 0%,
      #1a2338 45%,
      #0a1020 85%
    );
}

.video-thumb::after {
  content: '';
  position: absolute;
  inset: 25% 25% 25% 25%;
  border-radius: 999px;
  background:
    radial-gradient(
      circle at 45% 40%,
      #dee7f5 0%,
      #6a86b5 35%,
      #1a2235 70%,
      #050810 100%
    );
  box-shadow: inset -3px -4px 10px rgba(0, 0, 0, 0.7);
}

.video-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: rgba(10, 16, 32, 0.6);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.video-play:hover {
  background: rgba(20, 30, 55, 0.8);
  border-color: #fff;
}

.video-label {
  font-size: 0.74rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #c8cfdc;
}

/* ---------------- Chat section ---------------- */
.chat-section {
  padding: 40px 0 80px;
  scroll-margin-top: 80px;
}

.chat-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.eyebrow {
  display: inline-block;
  font-size: 0.74rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6aa8ff;
}

.chat-head h2 {
  margin: 12px 0 0;
  font-family: 'Inter Tight', Inter, sans-serif;
  font-size: clamp(1.6rem, 2.6vw, 2.4rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  color: #e6eefb;
}

.chat-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  color: #c2cada;
}

.chat-status code {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 2px 7px;
  font-size: 0.78rem;
  color: #e7ecf5;
  font-family: ui-monospace, Menlo, monospace;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #6aa8ff;
  box-shadow: 0 0 10px rgba(106, 168, 255, 0.9);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

.chat-card {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.035) 0%,
    rgba(255, 255, 255, 0.015) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 320px;
  max-height: 52vh;
  overflow-y: auto;
  padding-right: 4px;
}

.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
}

.message-row {
  display: flex;
}

.message-row-user {
  justify-content: flex-end;
}

.message-row-assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: min(640px, 86%);
  padding: 14px 18px;
  border-radius: 16px;
  font-size: 0.96rem;
  line-height: 1.6;
}

.bubble p {
  margin: 0;
  white-space: pre-wrap;
}

.bubble-user {
  background: linear-gradient(135deg, #6aa8ff 0%, #3b82f6 100%);
  color: #04122d;
  border-bottom-right-radius: 6px;
  box-shadow: 0 14px 28px -14px rgba(106, 168, 255, 0.55);
}

.bubble-assistant {
  background: rgba(255, 255, 255, 0.04);
  color: #e7ecf5;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 6px;
}

.bubble-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.7;
}

.loading-line {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #c2cada;
}

.composer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.composer :deep(.n-input) {
  background: rgba(255, 255, 255, 0.03);
}

.composer :deep(.n-input .n-input__textarea-el) {
  color: #e7ecf5;
}

.composer :deep(.n-input .n-input__placeholder) {
  color: rgba(231, 236, 245, 0.45);
}

.composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.hint {
  font-size: 0.82rem;
  color: #c2cada;
}

.hint code,
.hint kbd {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 2px 7px;
  font-size: 0.76rem;
  color: #e7ecf5;
  font-family: ui-monospace, Menlo, monospace;
}

/* ---------------- Features ---------------- */
.features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  padding: 40px 0 60px;
}

.feature {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.035) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 26px 24px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.feature:hover {
  transform: translateY(-3px);
  border-color: rgba(106, 168, 255, 0.35);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(106, 168, 255, 0.08);
  border: 1px solid rgba(106, 168, 255, 0.22);
  margin-bottom: 16px;
}

.feature h3 {
  margin: 0 0 8px;
  font-family: 'Inter Tight', Inter, sans-serif;
  font-size: 1.15rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: #e6eefb;
}

.feature p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #c2cada;
}

/* ---------------- Footer ---------------- */
.footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 28px 0 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.82rem;
  color: #8691a5;
  flex-wrap: wrap;
}

.footer code {
  color: #c2cada;
  font-family: ui-monospace, Menlo, monospace;
}

/* ---------------- Responsive ---------------- */
@media (max-width: 1000px) {
  .nav {
    padding: 16px 24px;
    gap: 16px;
  }
  .nav-links {
    display: none;
  }
  .container {
    padding: 0 24px 60px;
  }
  .hero {
    grid-template-columns: 1fr;
    padding: 72px 0 80px;
    min-height: auto;
  }
  .hero-video {
    order: -1;
  }
  .video-frame {
    width: 160px;
    height: 104px;
  }
  .features {
    grid-template-columns: 1fr;
  }
  .chat-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
