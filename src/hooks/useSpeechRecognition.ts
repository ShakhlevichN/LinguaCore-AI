import { useEffect, useRef, useState } from 'react'

interface SpeechResultItem {
  readonly length: number
  readonly isFinal: boolean
  [index: number]: { transcript: string }
}

interface SpeechResultEvent {
  resultIndex: number
  results: ArrayLike<SpeechResultItem>
}

interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechResultEvent) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

interface Options {
  onTranscript: (text: string) => void
  onEnd: () => void
}

function getRecognitionConstructor(): SpeechRecognitionConstructor | null {
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

function describeError(code: string): string | null {
  if (code === 'no-speech' || code === 'aborted') return null
  if (code === 'not-allowed' || code === 'service-not-allowed') {
    return 'Microphone access is blocked. Allow it in your browser settings and try again.'
  }
  if (code === 'audio-capture') return 'No microphone was found. Connect one and try again.'
  if (code === 'network') return 'Speech recognition needs an internet connection right now.'
  return 'Something went wrong with the microphone. Please try again.'
}

export function useSpeechRecognition({ onTranscript, onEnd }: Options) {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const baseRef = useRef('')
  const finalRef = useRef('')
  const callbacksRef = useRef({ onTranscript, onEnd })

  useEffect(() => {
    callbacksRef.current = { onTranscript, onEnd }
  })

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
    }
  }, [])

  const start = (currentText: string) => {
    const Constructor = getRecognitionConstructor()
    if (!Constructor) {
      setError('Live speech is not supported in this browser. You can type your answer instead.')
      return
    }

    const recognition = new Constructor()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    baseRef.current = currentText.trim() ? `${currentText.trimEnd()} ` : ''
    finalRef.current = ''

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript
        if (result.isFinal) {
          finalRef.current += `${text} `
        } else {
          interim += text
        }
      }
      callbacksRef.current.onTranscript(`${baseRef.current}${finalRef.current}${interim}`.trimStart())
    }

    recognition.onerror = (event) => {
      const message = describeError(event.error)
      if (message) setError(message)
    }

    recognition.onend = () => {
      recognitionRef.current = null
      setIsListening(false)
      callbacksRef.current.onEnd()
    }

    recognitionRef.current = recognition
    setError(null)

    try {
      recognition.start()
      setIsListening(true)
    } catch {
      recognitionRef.current = null
      setError('Could not start the microphone. Please try again.')
    }
  }

  const stop = () => {
    recognitionRef.current?.stop()
  }

  return {
    isSupported: getRecognitionConstructor() !== null,
    isListening,
    error,
    start,
    stop,
  }
}
