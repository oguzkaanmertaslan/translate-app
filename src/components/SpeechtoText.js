import React, { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
const SpeechtoText = () => {
  const { transcript, resetTranscript } = useSpeechRecognition()
  const [text, setText] = useState("");

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true })
  }
  return (
    <div>
      <h1>SpeechtoText</h1>
      <input value={transcript}></input>
      <button onClick={() => startListening()}>Start Recording</button>
      <button onClick={() => SpeechRecognition.stopListening({ continuous: false })}>Stop Recording</button>
    </div>
  )
}

export default SpeechtoText