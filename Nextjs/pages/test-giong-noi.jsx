import React, { useState } from 'react';

function SpeechToText() {
    const [text, setText] = useState('');

    // Hàm xử lý sự kiện khi người dùng nói
    const handleSpeech = (event) => {
        const speechToText = event.results[0][0].transcript;
        setText(speechToText);
    }

    // Hàm bắt đầu lắng nghe giọng nói
    const startListening = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.onresult = handleSpeech;
        recognition.start();
    }

    return (
        <div style={{ backgroundColor: '#fff' }}>
            <button onClick={startListening}>Bắt đầu nói</button>
            <p>{text}</p>
        </div>
    );
}

export default SpeechToText;
