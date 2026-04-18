type AgentRequestBody = {
  thread_id?: string
  message?: string
}

type LooseRecord = Record<string, unknown>

const pickText = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nested = pickText(item)
      if (nested) {
        return nested
      }
    }
  }

  if (value && typeof value === 'object') {
    const record = value as LooseRecord

    for (const key of ['answer', 'response', 'message', 'text', 'content', 'output']) {
      const nested = pickText(record[key])
      if (nested) {
        return nested
      }
    }
  }

  return null
}

export default defineEventHandler(async (event) => {
  const body = await readBody<AgentRequestBody>(event)

  if (!body?.message?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Message is required.'
    })
  }

  const runtimeConfig = useRuntimeConfig(event)
  const baseURL = runtimeConfig.agentBaseUrl || 'http://127.0.0.1:8000'

  try {
    const response = await $fetch<unknown>('/agent/request', {
      baseURL,
      method: 'POST',
      body: {
        thread_id: body.thread_id || '1',
        message: body.message
      }
    })

    return {
      answer: pickText(response) || 'The agent responded, but no text answer was found in the payload.',
      raw: response
    }
  } catch (error) {
    const statusCode =
      typeof error === 'object' && error && 'statusCode' in error && typeof error.statusCode === 'number'
        ? error.statusCode
        : 500

    const statusMessage =
      typeof error === 'object' && error && 'statusMessage' in error && typeof error.statusMessage === 'string'
        ? error.statusMessage
        : 'Unable to reach the agent service.'

    throw createError({
      statusCode,
      statusMessage
    })
  }
})
