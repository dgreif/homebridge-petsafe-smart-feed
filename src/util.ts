import { createInterface } from 'readline'

interface Logger {
  logInfo: (message: string) => void
  logError: (message: string) => void
}

let logger: Logger = {
    logInfo(message) {
      // eslint-disable-next-line no-console
      console.info(message)
    },
    logError(message) {
      // eslint-disable-next-line no-console
      console.error(message)
    }
  },
  debugEnabled = false

export function logDebug(message: any) {
  if (debugEnabled) {
    logger.logInfo(message)
  }
}

export function logInfo(message: any) {
  logger.logInfo(message)
}

export function logError(message: any) {
  logger.logError(message)
}

export function useLogger(newLogger: Logger) {
  logger = newLogger
}

export function enableDebug() {
  debugEnabled = true
}

export function delay(milliseconds: number) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}

export async function requestInput(question: string) {
  const lineReader = createInterface({
      input: process.stdin,
      output: process.stdout
    }),
    answer = await new Promise<string>(resolve => {
      lineReader.question(question, resolve)
    })

  lineReader.close()

  return answer.trim()
}
