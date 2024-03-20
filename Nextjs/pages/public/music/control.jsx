import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router';

var io = require('socket.io-client');
var socket;

function Control(props) {
    const [result, setResult] = useState('');

    const idTimer = useRef(null);

    const router = useRouter();

    useEffect(() => {
        socket = io.connect(`${process.env.REACT_APP_BACKEND_URL}`, {
            reconnect: true,
        });



        // Add a connect listener
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        console.log('Control')

        // init();
        if (idTimer.current) clearTimeout(idTimer.current);
        idTimer.current = setTimeout(() => {
            console.log('init');
            // init();
        }, 1000);

    }, []);

    const init = () => {
        const recognition = new webkitSpeechRecognition() || SpeechRecognition();

        recognition.lang = 'vi-VN';
        recognition.interimResults = true;
        recognition.start();
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('').toLowerCase();
            setResult(transcript);

            const queryParams = new URLSearchParams(window.location.search);

            // Lấy giá trị của query parameter có tên là 'name'
            const key = queryParams.get('key');

            switch (transcript) {
                case "chuyển bài.":
                case "đổi bài.":
                    console.log("Chuyển bài");

                    socket.emit(
                        `next-music-desktop`,
                        key
                    );


                    break;
                case "quay lại.":
                    console.log("Quay lại");
                    break;
                case "dừng lại.":
                    console.log("Dừng lại");
                    break;
                case "tiếp tục.":
                    console.log("Tiếp tục");
                    break;
            }

        };

        recognition.onend = () => {
            recognition.start();
        };

        recognition.onerror = (event) => {
            setResult('Có lỗi xảy ra: ' + event.error)
        };
    }

    return (
        <div style={{ backgroundColor: '#fff' }}>
            <button onClick={init}>start</button>
            <div>{result}</div>
        </div>
    )
}

export default Control