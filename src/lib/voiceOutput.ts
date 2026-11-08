export function speakText(text: string): boolean {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  const voices = window.speechSynthesis.getVoices()
  const voice =
    voices.find((v) => v.lang === 'en-US') ??
    voices.find((v) => v.lang === 'en-GB') ??
    voices.find((v) => v.lang.startsWith('en'))
  utterance.lang = voice?.lang ?? 'en-US'
  if (voice) utterance.voice = voice
  utterance.rate = 1
  window.speechSynthesis.speak(utterance)
  return true
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}
