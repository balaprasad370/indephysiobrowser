import { useEffect, useState } from "react";

const useSpeechSynthesis = (props = {}) => {
  const { onEnd = () => {} } = props;
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  const processVoices = (voiceOptions) => {
    setVoices(voiceOptions.filter((voice) => voice.lang.startsWith("de")));
  };

  const getVoices = () => {
    let voiceOptions = window.speechSynthesis.getVoices();
    if (voiceOptions.length > 0) {
      processVoices(voiceOptions);
      return;
    }

    window.speechSynthesis.onvoiceschanged = (event) => {
      voiceOptions = event.target.getVoices();
      processVoices(voiceOptions);
    };
  };

  const handleEnd = () => {
    setSpeaking(false);
    onEnd();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
      getVoices();
    }

    // Cleanup function to stop speech when the component is unmounted
    return () => {
      window.speechSynthesis.cancel(); // Stop any ongoing speech synthesis
    };
  }, []);

  const speak = (args = {}) => {
    const { text = "", rate = 1, pitch = 1, volume = 1 } = args;
    if (!supported || !voices.length) return;

    // console.log(voices);
    

    const germanVoice = voices.find((voice) => voice.lang === "de-DE");
    if (!germanVoice) return;
    // console.log(germanVoice);
    

    setSpeaking(true);

    const utterance = new window.SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = germanVoice;
    utterance.onend = handleEnd;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (!supported) return;
    setSpeaking(false);
    window.speechSynthesis.cancel();
  };

  return {
    supported,
    speak,
    speaking,
    cancel,
    voices
  };
};

export default useSpeechSynthesis;
