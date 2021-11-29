import React, { useEffect, useState } from "react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useReactMediaRecorder } from "react-media-recorder";
import "./App.css";

function App() {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: false, type: "audio/wav" });

  useEffect(() => {
    const getData = async (mediaBlobUrl) => {
      let blob = await fetch(mediaBlobUrl).then((r) => r.blob());
      console.log(blob);
      var filename = new Date().toISOString();
      var fd = new FormData();
      fd.append("audio_data", blob, filename);
      axios.post(`//localhost:8888/audio`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    };
    if (mediaBlobUrl) {
      console.log(mediaBlobUrl);
      getData(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    stopListening,
    startListening,
  } = useSpeechRecognition();

  const [animate, setAnimate] = useState();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log(
      "Your browser does not support speech recognition software! Try Chrome desktop, maybe?"
    );
  }
  const listenContinuously = () => {
    SpeechRecognition.startListening({
      // continuous: true,
      language: "en-GB",
    });
  };

  return (
    <div className="App">
      <div className="bg-black-50 min-h-screen flex items-center justify-center px-16">
        <div className="relative w-full max-w-lg">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="m-8 relative space-y-4">
            <div className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
              <div className="flex-1">
                <p>{interimTranscript ? interimTranscript : finalTranscript}</p>
              </div>
              <div>
                <div className="w-24 h-6 rounded-lg bg-purple-300"></div>
              </div>
            </div>
            <div className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
              <div className="flex-1">
                <div className="h-4 w-56 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="w-20 h-6 rounded-lg bg-yellow-300"></div>
              </div>
            </div>
            <div className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
              <div className="flex-1">
                <div className="h-4 w-44 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="w-28 h-6 rounded-lg bg-pink-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="mic cursor-pointer"
        // onClick={
        //   listening
        //     ? () => {
        //         // resetTranscript();
        //         SpeechRecognition.stopListening();
        //       }
        //     : SpeechRecognition.startListening
        // }
        onMouseDown={() => {
          listenContinuously();
          setAnimate(true);
          startRecording();
        }}
        onMouseUp={() => {
          SpeechRecognition.stopListening();
          setAnimate(false);
          stopRecording();
        }}
      >
        <i className="mic-icon"></i>
        <div className={`mic-shadow ${animate ? "active" : ""}`}></div>
      </div>
    </div>
  );
}

export default App;
