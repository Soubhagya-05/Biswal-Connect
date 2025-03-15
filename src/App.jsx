import React, { useContext } from 'react';
import "./App.css";
import va from "./assets/logo.gif";
import logo from "./assets/logo.png";  // Import your logo
import { MdKeyboardVoice } from "react-icons/md";
import { datacontext } from './context/UserContext';
import speakimg from "./assets/speak.gif";
import aigif from "./assets/aiVoice.gif";

function Footer() {
    return <div className="footer">© 2025 Biswal Connect. All Rights Reserved.</div>;
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! ";
    if (hour < 18) return "Good afternoon! ";
    return "Good evening! ";
}

function App() {
    let { recognition, speaking, setSpeaking, prompt, response, setPrompt, setResponse } = useContext(datacontext);

    return (
        <div className='main'>
            {/* Logo + Title Container */}
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo-icon" />
                <span className="logo-text">Biswal Connect</span>
            </div>

            <img src={va} alt="Biswal Connect" id="biswalconnect" />

            {/* Greeting Text with Typing Effect */}
            <span className={`greeting-text ${speaking ? "response-popup" : ""}`}>
                {speaking ? "from Biswal Connect" : getGreeting()}
            </span>

            {!speaking ? 
                <button onClick={() => {
                    setPrompt("Listening...");
                    setSpeaking(true);
                    setResponse(false);
                    recognition.start();
                }}>
                    Say <MdKeyboardVoice />
                </button>
                :  
                <div className='response'>
                    {!response ? <img src={speakimg} alt="Speaking" id="speak" /> : <img src={aigif} alt="AI Response" id="aigif" />}
                    <p>{prompt}</p>
                </div>
            }

            <Footer />
        </div>
    );
}

export default App;
