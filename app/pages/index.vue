<template>
  <main class="page-shell">
    <div class="orb orb-a" />
    <div class="orb orb-b" />

    <section class="chat-panel">
      <header class="hero">
        <p class="eyebrow">Ingredient Assistant</p>
        <h1>Find alternate components in one message.</h1>
        <p class="hero-copy">
          A minimal NaiveUI chatbot that forwards your request to the local agent API and returns the text response.
        </p>
      </header>

      <NCard class="chat-card" :bordered="false">
        <div class="messages">
          <div
            v-for="item in messages"
            :key="item.id"
            :class="['message-row', `message-row-${item.role}`]"
          >
            <div :class="['bubble', `bubble-${item.role}`]">
              <span class="bubble-label">{{ item.role === 'user' ? 'You' : 'Agent' }}</span>
              <p>{{ item.text }}</p>
            </div>
          </div>

          <div v-if="isLoading" class="message-row message-row-assistant">
            <div class="bubble bubble-assistant bubble-loading">
              <span class="bubble-label">Agent</span>
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
            <span class="hint">Sending to thread `1` via `/agent/request`.</span>
            <NButton type="primary" attr-type="submit" :loading="isLoading">
              Send
            </NButton>
          </div>
        </form>
      </NCard>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NButton, NCard, NInput, NSpin } from 'naive-ui'

type Role = 'user' | 'assistant'

type ChatMessage = {
  id: number
  role: Role
  text: string
}

useHead({
  title: 'Ingredient Assistant'
})

const initialPrompt =
  'I would like to find another component instead of RM-C28-glycerin-85e43afb from Ingredion company in FG-iherb-10421 product'

const draft = ref(initialPrompt)
const isLoading = ref(false)
const nextId = ref(2)
const messages = ref<ChatMessage[]>([
  {
    id: 1,
    role: 'assistant',
    text: 'Paste a component question below and I will ask the local agent for an alternative.'
  }
])

const appendMessage = (role: Role, text: string) => {
  messages.value.push({
    id: nextId.value++,
    role,
    text
  })
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
      body: {
        thread_id: '1',
        message
      }
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
:global(body) {
  margin: 0;
  background:
    radial-gradient(circle at top, rgba(15, 118, 110, 0.18), transparent 32%),
    linear-gradient(180deg, #f4f8f6 0%, #eef3f1 100%);
  color: #10261f;
}

:global(*),
:global(*::before),
:global(*::after) {
  box-sizing: border-box;
}

.page-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding: 32px 16px;
}

.chat-panel {
  position: relative;
  z-index: 1;
  width: min(920px, 100%);
  margin: 0 auto;
}

.hero {
  padding: 24px 8px 18px;
}

.eyebrow {
  margin: 0 0 12px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0f766e;
}

.hero h1 {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 4.4rem);
  line-height: 0.94;
  letter-spacing: -0.05em;
  max-width: 11ch;
}

.hero-copy {
  max-width: 52ch;
  margin: 16px 0 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #49625b;
}

.chat-card {
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 80px rgba(16, 38, 31, 0.12);
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 340px;
  max-height: 56vh;
  overflow-y: auto;
  padding-bottom: 12px;
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
  max-width: min(700px, 88%);
  padding: 14px 16px;
  border-radius: 22px;
  box-shadow: 0 12px 30px rgba(16, 38, 31, 0.08);
}

.bubble p {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.6;
}

.bubble-user {
  background: linear-gradient(135deg, #115e59, #0f766e);
  color: #f7fffc;
  border-bottom-right-radius: 8px;
}

.bubble-assistant {
  background: #ffffff;
  color: #17352d;
  border: 1px solid rgba(15, 118, 110, 0.12);
  border-bottom-left-radius: 8px;
}

.bubble-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.65;
}

.bubble-loading {
  min-width: 180px;
}

.loading-line {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.composer {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(15, 118, 110, 0.1);
}

.composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
}

.hint {
  font-size: 0.9rem;
  color: #55716a;
}

.orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(8px);
  opacity: 0.45;
}

.orb-a {
  top: -60px;
  right: min(8vw, 120px);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(15, 118, 110, 0.42), rgba(15, 118, 110, 0));
}

.orb-b {
  bottom: 80px;
  left: min(4vw, 60px);
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(251, 146, 60, 0.24), rgba(251, 146, 60, 0));
}

@media (max-width: 720px) {
  .page-shell {
    padding: 18px 12px 28px;
  }

  .hero {
    padding-inline: 2px;
  }

  .messages {
    max-height: none;
    min-height: 280px;
  }

  .bubble {
    max-width: 94%;
  }

  .composer-footer {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
