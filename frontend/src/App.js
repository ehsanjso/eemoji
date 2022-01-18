import React, { useEffect, useState } from "react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useReactMediaRecorder } from "react-media-recorder";
import normalize from "array-normalize";
import { useSpring, animated } from "react-spring";
import "./App.css";
import Loading from "./Loading";

const emotionObj = {
  1: "neutral",
  2: "calm",
  3: "happy",
  4: "sad",
  5: "angry",
  6: "fear",
  7: "disgust",
  8: "surprise",
};

const emojiObj = {
  1: [":neutral_face:", ":no_mouth:"],
  2: [":sunglasses:"],
  3: [":smile:", ":laughing:", ":joy:"],
  4: [":disappointed:", ":cry:", ":sob:"],
  5: [":angry:", ":rage:"],
  6: [":fearful:", ":cold_sweat:"],
  7: [":persevere:", ":confounded:"],
  8: [":open_mouth:", ":astonished:"],
};

const emojiSVGObj = {
  1: ["1F610", "1F636"],
  2: ["1F60C", "1F607"],
  3: ["1F600", "1F601", "1F602"],
  4: ["1F625", "1F622", "1F62D"],
  5: ["1F620", "1F621", "1F92C"],
  6: ["1F627", "1F628", "1F630"],
  7: ["1F922", "1F92E"],
  8: ["1F62E", "1F62F"],
};

function App() {
  const [isFetchInProg, setIsFetchInProg] = useState(false);
  const [emotion, setEmotion] = useState(undefined);
  const [animation, setAnimation] = useState([]);
  const [emotionDegree, setEmotionDegree] = useState(0);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: false, type: "audio/wav" });

  const [styles, api] = useSpring(() => ({ marginTop: 0 }));

  useEffect(() => {
    const getData = async (mediaBlobUrl) => {
      let blob = await fetch(mediaBlobUrl).then((r) => r.blob());
      var filename = new Date().toISOString();
      var fd = new FormData();
      fd.append("audio_data", blob, filename);
      setIsFetchInProg(true);
      const res = await axios.post(`//161.35.11.4:8080/audio`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsFetchInProg(false);

      const data = res.data.split(/\r?\n/);
      const emotionData = data[0];
      const animationData = normalize(data[1].split(",").map(Number));

      setEmotion(emotionData);
      setAnimation(animationData);
      api({
        from: { marginTop: 0 },
        to: animationData
          .map((el) => ({ marginTop: el * 20 }))
          .concat({ marginTop: 0 }),
        loop: true,
      });

      setEmotionDegree(0);
    };
    if (mediaBlobUrl) {
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
      <div className="watch">
        <div className="top_band"></div>
        <div className="watch_face">
          <div className="bg-black-50 flex items-center justify-center px-2">
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 -left-4 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-24 h-24 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="m-8 relative space-y-4">
                <div className="p-1 rounded-lg flex items-center justify-between space-x-8">
                  <div className="flex-1 text-white">
                    <p>
                      {interimTranscript ? interimTranscript : finalTranscript}
                    </p>
                    <div className="flex items-center justify-center p-1 rounded-lg space-x-8">
                      {emotion &&
                        emojiSVGObj[emotion].map((el) => (
                          <animated.img
                            src={`./openmoji-svg-color/${el}.svg`}
                            alt={el}
                            className="emoji"
                            key={el}
                            style={styles}
                          />
                        ))}
                    </div>
                  </div>
                  {/* <div>
                    <div className="w-24 h-6 rounded-lg "></div>
                  </div> */}
                </div>
                {/* <div className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
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
            </div> */}
              </div>
            </div>
          </div>
          <div
            className="mic cursor-pointer"
            onMouseDown={() => {
              listenContinuously();
              setAnimate(true);
              startRecording();
              setEmotion(undefined);
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

          {isFetchInProg ? <Loading /> : undefined}
        </div>
        <div className="bottom_band"></div>
      </div>
    </div>
  );
}

export default App;
