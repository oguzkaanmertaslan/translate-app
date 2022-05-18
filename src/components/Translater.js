import React, { useEffect, useRef, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import axios from 'axios'
import Button from '@mui/material/Button';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import "./style.css"
const Translater = () => {
    const [options, setOptions] = useState([]);
    const [from, setFrom] = useState("en");
    const [to, setTo] = useState("en");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [isMicActive, setIsMicActive] = useState(false);
    const { transcript, resetTranscript, listening } = useSpeechRecognition();
    const ref = useRef(transcript);

    const translate = () => {
        const params = new URLSearchParams();
        params.append('q', input.toLowerCase());
        params.append('source', from);
        params.append('target', to);
        params.append('api_key', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

        axios.post('https://libretranslate.de/translate', params, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(res => {
            setOutput(res.data.translatedText)
        })
    };
    const startListening = (e) => {
        if (isMicActive) {
            SpeechRecognition.stopListening({ continuous: false });
            setInput((prevState) => (prevState + transcript));
            setIsMicActive(false);
        }
        else {
            SpeechRecognition.startListening({ continuous: true });
            setIsMicActive(true);
        }
    }

    useEffect(() => {
        axios.get('https://libretranslate.com/languages',
            { headers: { 'accept': 'application/json' } }).then(res => {
                setOptions(res.data)
            })
    }, [])

    useEffect(() => {
        if (listening) {
            setTimeout(() => {
                ref.current = input + transcript;
            }, 100);
        }
    });
    return (
        <div className='page-area'>
            <h2>App Translate</h2>
            <div className='select-area'>
                <div className='left-area'>
                    <label>From ({from}) :</label>
                    <select className='from-select' onChange={e => setFrom(e.target.value)}>
                        {options.map(opt => <option key={opt.code} value={opt.code}>{opt.name}</option>)}
                    </select>
                    <textarea
                        cols="50"
                        rows="8"
                        className='source-area'
                        defaultValue={ref.current}
                        onChange={e => {
                            setInput(e.target.value);
                            resetTranscript();
                            ref.current = e.target.value;
                        }}
                    />
                    <div className='mic-area'>
                        {isMicActive ? <MicOffIcon onClick={startListening} /> : <MicIcon onClick={startListening} />}
                    </div>
                </div>
                <div className='right-area'>
                    <label>To ({to}) :</label>
                    <select className='to-select' onChange={e => setTo(e.target.value)}>
                        {options.map(opt => <option key={opt.code} value={opt.code}>{opt.name}</option>)}
                    </select>
                    <textarea disabled={true} className='target-area' cols="50" rows="8" defaultValue={output} />
                </div>
            </div>

            <div className='translate-button'>
                <Button variant='contained' onClick={e => translate()}>Translate</Button>
            </div>
        </div>
    )
}
export default Translater