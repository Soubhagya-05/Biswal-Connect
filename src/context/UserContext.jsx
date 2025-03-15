import React, { createContext, useState } from "react";
import run from "../gemini";

export const datacontext = createContext();

function UserContext({ children }) {
    let [speaking, setSpeaking] = useState(false);
    let [prompt, setPrompt] = useState("Observing...");
    let [response, setResponse] = useState(false);

    function speak(text, lang = "en-IN") {
        text = text.replace(/\bGoogle\b/gi, "Soubhagya Biswal").replace(/\*{1,2}/g, " ");
        
        if (window.responsiveVoice) {
            window.responsiveVoice.speak(text, "UK English Female", {
                pitch: 1,
                rate: 0.9,
                volume: 1,
                onstart: function () {
                    setSpeaking(true);
                    console.log("Speaking started...");
                },
                onend: function () {
                    setSpeaking(false);
                    setResponse(false);
                    console.log("Speaking ended.");
                }
            });
        } else {
            console.error("ResponsiveVoice is not loaded or API key is missing.");
        }
    }
    

    async function aiResponse(prompt) {
        let lowerPrompt = prompt.toLowerCase().trim();
        console.log("User asked:", lowerPrompt);

        let lang = "en-IN"; // Default language

        let customResponses = [
            { keywords: ["your name", "who are you", "तुम कौन हो"], response: "My name is Biswal Connect. I am an AI assistant created by Soubhagya Biswal." },
            { keywords: ["your founder", "who created you", "तुम्हें किसने बनाया", "soubhagya biswal कौन है", "who is soubhagya"], response: "Soubhagya Biswal is the founder of Biswal Connect. He is a UI/UX designer and an expert in NLP and deep learning." }
        ];

        for (let entry of customResponses) {
            if (entry.keywords.some(keyword => lowerPrompt.includes(keyword))) {
                let responseText = entry.response.replace(/\bGoogle\b/gi, "Soubhagya Biswal");
                setPrompt(responseText);
                speak(responseText, lang);
                setResponse(true);
                return;
            }
        }

        let text = await run(prompt);
        text = text.replace(/\bGoogle\b/gi, "Soubhagya Biswal");
        setPrompt(text);
        speak(text, lang);
        setResponse(true);
    }

    let recognition;
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-IN";
        recognition.onresult = (e) => {
            let transcript = e.results[e.resultIndex][0].transcript;
            setPrompt(transcript);
            aiResponse(transcript);
        };
    } else {
        console.warn("Speech recognition is not supported in this browser.");
    }

    let value = { recognition, speaking, setSpeaking, prompt, setPrompt, response, setResponse };

    return <datacontext.Provider value={value}>{children}</datacontext.Provider>;
}

export default UserContext;
