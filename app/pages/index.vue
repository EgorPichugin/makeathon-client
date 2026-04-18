<template>
  <div class="shell">
    <header class="topbar">
      <a class="brand" href="#">
        <span class="brand-mark" aria-hidden="true" />
        <span class="brand-name">Spherecast</span>
      </a>
      <div class="topbar-meta">
        <span class="mono-label">
          <span class="status-dot" />
          Agent online
        </span>
        <span class="mono-label muted">Thread <code>1</code></span>
      </div>
    </header>

    <main class="workbench">
      <!-- LEFT: chat panel -->
      <section class="panel panel-chat" aria-label="Chat window">
        <div class="panel-head">
          <span class="panel-kicker">01 · Conversation</span>
        </div>

        <div ref="scrollArea" class="messages">
          <div
            v-for="item in messages"
            :key="item.id"
            :class="['message-row', `message-row-${item.role}`]"
          >
            <div :class="['bubble', `bubble-${item.role}`]">
              <span class="bubble-label">
                {{ item.role === 'user' ? 'You' : 'Spherecast' }}
              </span>
              <p>{{ item.text }}</p>
            </div>
          </div>

          <div v-if="isLoading" class="message-row message-row-assistant">
            <div class="bubble bubble-assistant bubble-loading">
              <span class="bubble-label">Spherecast</span>
              <div class="loading-line">
                <span class="dots"><i /><i /><i /></span>
                <span>thinking</span>
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
              Press <kbd>Enter</kbd> to send · <kbd>Shift</kbd>+<kbd>Enter</kbd>
              for new line
            </span>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoading"
            >
              <span>{{ isLoading ? 'Sending' : 'Send request' }}</span>
              <span class="sphere sphere-sm" aria-hidden="true" />
            </button>
          </div>
        </form>
      </section>

      <!-- RIGHT: agent workflow panel -->
      <section class="panel panel-workflow" aria-label="Agent workflow">
        <div class="panel-head">
          <span class="panel-kicker">02 · Agent workflow</span>
          <button
            v-if="steps.length"
            type="button"
            class="btn btn-ghost btn-sm"
            @click="clearSteps"
          >
            Clear log
          </button>
        </div>

        <div class="workflow">
          <div v-if="!steps.length" class="workflow-empty">
            <div class="empty-sphere" aria-hidden="true">
              <span class="sphere sphere-lg" />
            </div>
            <p class="empty-title">No runs yet</p>
            <p class="empty-sub">
              Send a question on the left — the agent's plan, tool calls and
              output will stream here.
            </p>
          </div>

          <ol v-else class="timeline">
            <li
              v-for="step in steps"
              :key="step.id"
              :class="['step', `step-${step.status}`]"
            >
              <div class="step-rail">
                <span class="step-node" />
                <span class="step-line" />
              </div>
              <div class="step-body">
                <div class="step-head">
                  <span class="step-kind">{{ step.kind }}</span>
                  <span class="step-time">{{ formatTime(step.at) }}</span>
                </div>
                <p class="step-label">{{ step.label }}</p>
                <pre v-if="step.detail" class="step-detail">{{ step.detail }}</pre>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { NInput } from 'naive-ui'
import { nextTick, ref } from 'vue'

type Role = 'user' | 'assistant'

type ChatMessage = {
  id: number
  role: Role
  text: string
}

type StepStatus = 'pending' | 'running' | 'done' | 'error'

type WorkflowStep = {
  id: number
  kind: string
  label: string
  status: StepStatus
  at: number
  detail?: string
}

const initialPrompt =
  'I would like to find another component instead of RM-C28-glycerin-85e43afb from Ingredion company in FG-iherb-10421 product'

const draft = ref(initialPrompt)
const isLoading = ref(false)
const nextMsgId = ref(2)
const nextStepId = ref(1)
const scrollArea = ref<HTMLElement | null>(null)

const messages = ref<ChatMessage[]>([
  {
    id: 1,
    role: 'assistant',
    text: 'Paste a component question on the left and I will query the local agent for an alternative. The right panel will show every step the agent takes.'
  }
])

const steps = ref<WorkflowStep[]>([])

const appendMessage = (role: Role, text: string) => {
  messages.value.push({ id: nextMsgId.value++, role, text })
  nextTick(() => {
    if (scrollArea.value) {
      scrollArea.value.scrollTop = scrollArea.value.scrollHeight
    }
  })
}

const addStep = (
  kind: string,
  label: string,
  status: StepStatus = 'running',
  detail?: string
) => {
  const step: WorkflowStep = {
    id: nextStepId.value++,
    kind,
    label,
    status,
    at: Date.now(),
    detail
  }
  steps.value.push(step)
  return step
}

const markStep = (step: WorkflowStep, status: StepStatus, detail?: string) => {
  step.status = status
  if (detail !== undefined) step.detail = detail
}

const clearSteps = () => {
  steps.value = []
}

const formatTime = (ts: number) => {
  const d = new Date(ts)
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const sendMessage = async () => {
  const message = draft.value.trim()
  if (!message || isLoading.value) return

  appendMessage('user', message)
  draft.value = ''
  isLoading.value = true

  const s1 = addStep('input', 'Received user request', 'done', message)
  const s2 = addStep('plan', 'Preparing request for agent API')
  const s3 = addStep('network', 'POST /agent/request (thread 1)')

  try {
    markStep(s2, 'done')

    const response = await $fetch<{ answer: string; raw?: unknown }>(
      '/api/agent-request',
      {
        method: 'POST',
        body: { thread_id: '1', message }
      }
    )

    markStep(s3, 'done', 'HTTP 200 · response received')

    const s4 = addStep('parse', 'Parsing agent payload', 'done')
    if (response.raw) {
      try {
        s4.detail = JSON.stringify(response.raw, null, 2).slice(0, 800)
      } catch {
        /* ignore */
      }
    }

    addStep('answer', 'Final answer delivered to chat', 'done', response.answer)
    appendMessage('assistant', response.answer)
  } catch (error) {
    const fallback =
      error instanceof Error
        ? error.message
        : 'The request failed before the agent returned a response.'

    markStep(s3, 'error', fallback)
    addStep('answer', 'Agent request failed', 'error', fallback)
    appendMessage('assistant', fallback)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.shell {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(
      ellipse 60% 40% at 50% 110%,
      rgba(154, 200, 255, 0.09) 0%,
      rgba(14, 18, 22, 0) 60%
    ),
    #0e1216;
  color: #e7e8eb;
}

/* ---------------- Topbar ---------------- */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 40px;
  border-bottom: 1px solid rgba(231, 232, 235, 0.08);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Creato Display', sans-serif;
  font-weight: 500;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  color: #f2f5fb;
}

.brand-mark {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: radial-gradient(
    circle at 32% 28%,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(200, 220, 255, 0.9) 25%,
    rgba(154, 200, 255, 0.92) 55%,
    rgba(15, 30, 70, 1) 100%
  );
  box-shadow:
    inset -4px -5px 12px rgba(0, 0, 0, 0.55),
    inset 3px 3px 8px rgba(255, 255, 255, 0.22),
    0 0 0 1px rgba(154, 200, 255, 0.22);
}

.topbar-meta {
  display: inline-flex;
  align-items: center;
  gap: 20px;
}

.mono-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #c8cdd5;
}

.mono-label.muted {
  color: #919191;
}

.mono-label code {
  font-family: inherit;
  color: #e7e8eb;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #9ac8ff;
  box-shadow: 0 0 10px rgba(154, 200, 255, 0.9);
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

/* ---------------- Workbench grid ---------------- */
.workbench {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: 24px;
  padding: 24px 40px 40px;
  min-height: 0;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: calc(100vh - 160px);
  padding: 26px;
  background: rgba(231, 232, 235, 0.02);
  border: 1px solid rgba(231, 232, 235, 0.1);
  position: relative;
  overflow: hidden;
}

.panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    90% 120% at 50% 120%,
    rgba(154, 200, 255, 0.08) 0%,
    rgba(255, 255, 255, 0) 60%
  );
  pointer-events: none;
}

.panel-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(231, 232, 235, 0.08);
  position: relative;
}

.panel-kicker {
  display: block;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9ac8ff;
  margin-bottom: 10px;
}

.panel-title {
  margin: 0;
  font-family: 'Creato Display', sans-serif;
  font-weight: 500;
  font-size: 1.6rem;
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: #e7e8eb;
}

/* ---------------- Chat messages ---------------- */
.messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 6px;
  position: relative;
}

.messages::-webkit-scrollbar {
  width: 6px;
}
.messages::-webkit-scrollbar-thumb {
  background: rgba(231, 232, 235, 0.14);
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
  max-width: min(640px, 90%);
  padding: 14px 16px;
  font-size: 0.96rem;
  line-height: 1.55;
  border: 1px solid rgba(231, 232, 235, 0.1);
}

.bubble p {
  margin: 0;
  white-space: pre-wrap;
}

.bubble-user {
  background: #9ac8ff;
  color: #0e1216;
  border-color: #9ac8ff;
}
.bubble-user .bubble-label {
  color: rgba(14, 18, 22, 0.6);
}

.bubble-assistant {
  background: rgba(231, 232, 235, 0.03);
  color: #e7e8eb;
}

.bubble-label {
  display: block;
  margin-bottom: 6px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(231, 232, 235, 0.55);
}

.loading-line {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #c8cdd5;
}

.dots {
  display: inline-flex;
  gap: 4px;
}
.dots i {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #9ac8ff;
  animation: dot 1.1s ease-in-out infinite;
}
.dots i:nth-child(2) {
  animation-delay: 0.15s;
}
.dots i:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes dot {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }
  40% {
    transform: translateY(-3px);
    opacity: 1;
  }
}

/* ---------------- Composer ---------------- */
.composer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid rgba(231, 232, 235, 0.08);
}

.composer :deep(.n-input) {
  background: rgba(231, 232, 235, 0.02);
}

.composer :deep(.n-input .n-input__textarea-el) {
  color: #e7e8eb;
  font-family: inherit;
}

.composer :deep(.n-input .n-input__placeholder) {
  color: rgba(231, 232, 235, 0.38);
}

.composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.hint {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #919191;
}

.hint kbd {
  display: inline-block;
  padding: 1px 6px;
  margin: 0 2px;
  background: rgba(231, 232, 235, 0.06);
  border: 1px solid rgba(231, 232, 235, 0.12);
  color: #e7e8eb;
  font-family: inherit;
  font-size: 0.65rem;
}

/* ---------------- Buttons (Spherecast rectangular mono) ---------------- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0.75rem 1.5rem;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.78rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  border-radius: 0;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  background: #e7e8eb;
  color: #0e1216;
  border-color: #e7e8eb;
}
.btn-primary:hover:not(:disabled) {
  background: #9ac8ff;
  border-color: #9ac8ff;
}

.btn-ghost {
  background: transparent;
  color: #e7e8eb;
  border-color: rgba(231, 232, 235, 0.22);
}
.btn-ghost:hover:not(:disabled) {
  border-color: #9ac8ff;
  color: #9ac8ff;
}

.btn-sm {
  padding: 0.5rem 1.1rem;
  font-size: 0.7rem;
}

/* ---------------- Sphere decoration ---------------- */
.sphere {
  border-radius: 999px;
  background: radial-gradient(
    circle at 32% 28%,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(220, 235, 255, 0.95) 20%,
    rgba(154, 200, 255, 0.95) 55%,
    rgba(15, 30, 70, 1) 100%
  );
  box-shadow:
    inset -4px -5px 12px rgba(0, 0, 0, 0.55),
    inset 3px 3px 8px rgba(255, 255, 255, 0.22);
}
.sphere-sm {
  width: 16px;
  height: 16px;
}
.sphere-lg {
  width: 72px;
  height: 72px;
  box-shadow:
    inset -10px -14px 32px rgba(0, 0, 0, 0.6),
    inset 6px 8px 22px rgba(255, 255, 255, 0.22),
    0 0 60px rgba(154, 200, 255, 0.28);
}

/* ---------------- Workflow timeline ---------------- */
.workflow {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
  position: relative;
}
.workflow::-webkit-scrollbar {
  width: 6px;
}
.workflow::-webkit-scrollbar-thumb {
  background: rgba(231, 232, 235, 0.14);
}

.workflow-empty {
  height: 100%;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 14px;
  color: #919191;
  position: relative;
}

.empty-sphere {
  margin-bottom: 8px;
}

.empty-title {
  margin: 0;
  font-family: 'Creato Display', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  color: #e7e8eb;
  letter-spacing: -0.01em;
}

.empty-sub {
  margin: 0;
  max-width: 40ch;
  font-size: 0.9rem;
  line-height: 1.55;
  color: #919191;
}

.timeline {
  list-style: none;
  margin: 0;
  padding: 4px 0 0;
  display: flex;
  flex-direction: column;
}

.step {
  position: relative;
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 14px;
  padding: 14px 0 18px;
}

.step-rail {
  position: relative;
  width: 20px;
  display: flex;
  justify-content: center;
}

.step-node {
  position: relative;
  z-index: 2;
  margin-top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #0e1216;
  border: 1.5px solid #9ac8ff;
}

.step-line {
  position: absolute;
  left: 50%;
  top: 14px;
  bottom: -18px;
  width: 1px;
  background: rgba(231, 232, 235, 0.1);
  transform: translateX(-0.5px);
}

.step:last-child .step-line {
  display: none;
}

.step-running .step-node {
  background: #9ac8ff;
  box-shadow: 0 0 0 3px rgba(154, 200, 255, 0.2);
  animation: pulse 1.4s ease-in-out infinite;
}
.step-done .step-node {
  background: #9ac8ff;
  border-color: #9ac8ff;
}
.step-error .step-node {
  background: #ff7a7a;
  border-color: #ff7a7a;
}

.step-body {
  min-width: 0;
}

.step-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.step-kind {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9ac8ff;
}
.step-error .step-kind {
  color: #ff7a7a;
}

.step-time {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  color: #919191;
}

.step-label {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.45;
  color: #e7e8eb;
}

.step-detail {
  margin: 10px 0 0;
  padding: 12px 14px;
  background: rgba(231, 232, 235, 0.03);
  border: 1px solid rgba(231, 232, 235, 0.08);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #c8cdd5;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 220px;
  overflow: auto;
}

/* ---------------- Responsive ---------------- */
@media (max-width: 1100px) {
  .workbench {
    grid-template-columns: 1fr;
    padding: 20px;
  }
  .panel {
    min-height: 520px;
  }
}

@media (max-width: 680px) {
  .topbar {
    padding: 16px 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .topbar-meta {
    width: 100%;
    justify-content: flex-start;
  }
  .panel {
    padding: 20px;
  }
}
</style>
